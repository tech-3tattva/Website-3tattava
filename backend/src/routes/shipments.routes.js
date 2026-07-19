"use strict";

/**
 * /api/shipments — NimbusPost (api-v2) shipment management
 *
 * Flow: on payment we auto-create the order in NimbusPost (status "created").
 * Ops assigns a courier + generates the AWB from the NimbusPost dashboard.
 * We read AWB / status / delivery timestamps back via order-detail polling
 * (POST /track/bulk, called by a cron) and the tracking webhook.
 */

const express = require("express");
const { z } = require("zod");
const nimbus = require("../lib/nimbus");
const Order = require("../models/Order");
const { verifyAdmin } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

// Map a NimbusPost order_status -> internal order status.
function mapStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (["delivered"].includes(s)) return "delivered";
  if (["cancelled", "canceled", "rto", "rto_delivered", "rto_initiated", "lost"].includes(s)) return "cancelled";
  if (["out_for_delivery", "ofd", "in_transit", "intransit", "shipped", "manifested", "pickup_scheduled", "picked_up", "picked"].includes(s)) return "shipped";
  if (["created", "new", "pickup_pending", "ready_to_ship"].includes(s)) return "processing";
  return null;
}

function applyTracking(order, t) {
  if (t.awbNumber) order.shipment.awbNumber = t.awbNumber;
  if (t.courierName) order.shipment.courierName = t.courierName;
  if (t.labelUrl) order.shipment.labelUrl = t.labelUrl;
  if (t.currentStatus) order.shipment.nimbusStatus = String(t.currentStatus).toLowerCase();
  if (Array.isArray(t.checkpoints) && t.checkpoints.length) order.shipment.checkpoints = t.checkpoints;
  order.shipment.lastTrackedAt = new Date();

  if (t.awbNumber) {
    order.tracking = {
      ...(order.tracking || {}),
      courierName: t.courierName || order.tracking?.courierName || "",
      trackingNumber: t.awbNumber,
      trackingUrl: `https://ship.nimbuspost.com/tracking/${t.awbNumber}`,
      estimatedDelivery: t.edd ? String(t.edd) : order.tracking?.estimatedDelivery,
    };
  }

  const mapped = mapStatus(t.currentStatus);
  if (mapped && order.status !== mapped && order.status !== "cancelled") {
    order.status = mapped;
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: mapped, note: `NimbusPost: ${t.currentStatus}`, updatedBy: "system" },
    ];
  }
}

// --------------------------------------------------------------------------
// POST /api/shipments/create — push an order to NimbusPost (create order)
// --------------------------------------------------------------------------
router.post("/create", verifyAdmin, async (req, res, next) => {
  try {
    if (!nimbus.isConfigured()) throw new ApiError(503, "NimbusPost is not configured");
    const { orderId } = z.object({ orderId: z.string().min(1) }).parse(req.body);

    const order = await Order.findById(orderId).exec();
    if (!order) throw new ApiError(404, "Order not found");
    if (order.shipment?.nimbusOrderId) {
      return res.json({ message: "Already sent to NimbusPost", shipment: order.shipment });
    }

    const result = await nimbus.createShipmentForOrder(order);

    order.shipment = {
      ...(order.shipment || {}),
      nimbusOrderId: result.nimbusOrderId,
      shipmentId: result.nimbusOrderId,
      awbNumber: result.awbNumber || "",
      courierName: result.courierName || "",
      labelUrl: result.labelUrl || "",
      paymentType: "prepaid",
      nimbusStatus: result.status || "created",
      checkpoints: order.shipment?.checkpoints || [],
      createdAt: order.shipment?.createdAt || new Date(),
      lastTrackedAt: new Date(),
    };

    if (order.status === "confirmed") order.status = "processing";
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: order.status, note: `Order created in NimbusPost (${result.nimbusOrderNumber || result.nimbusOrderId}) — awaiting courier assignment`, updatedBy: "system" },
    ];

    await order.save();
    return res.json({ shipment: order.shipment, order });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/track/bulk — refresh status from NimbusPost (cron)
// Body optional: { order_ids: [<our order _id>...] }. Without it, refreshes
// every order that has a NimbusPost order id and isn't final.
// --------------------------------------------------------------------------
router.post("/track/bulk", verifyAdmin, async (req, res, next) => {
  try {
    if (!nimbus.isConfigured()) throw new ApiError(503, "NimbusPost is not configured");
    const { order_ids } = z.object({ order_ids: z.array(z.string()).optional() }).parse(req.body || {});

    const query = order_ids?.length
      ? { _id: { $in: order_ids }, "shipment.nimbusOrderId": { $exists: true, $ne: "" } }
      : { "shipment.nimbusOrderId": { $exists: true, $ne: "" }, status: { $nin: ["delivered", "cancelled"] } };

    const orders = await Order.find(query).limit(200).exec();
    const byNimbusId = new Map(orders.map((o) => [o.shipment.nimbusOrderId, o]));

    const tracked = await nimbus.trackByOrderIds([...byNimbusId.keys()]);
    const updated = [];
    for (const t of tracked) {
      if (t.error) continue;
      const order = byNimbusId.get(t.nimbusOrderId);
      if (!order) continue;
      applyTracking(order, t);
      await order.save();
      updated.push({ orderNumber: order.orderNumber, awb: t.awbNumber, status: t.currentStatus });
    }

    return res.json({ refreshed: orders.length, updated });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/shipments/track/:id — public tracking by AWB or order number
// --------------------------------------------------------------------------
router.get("/track/:id", async (req, res, next) => {
  try {
    const id = req.params.id.trim();
    const order = await Order.findOne({
      $or: [{ "shipment.awbNumber": id }, { orderNumber: id }],
    }).exec();
    if (!order || !order.shipment?.nimbusOrderId) {
      throw new ApiError(404, "No shipment found for this tracking id");
    }
    const t = await nimbus.getOrder(order.shipment.nimbusOrderId);
    return res.json({
      orderNumber: order.orderNumber,
      awbNumber: t.awbNumber,
      courierName: t.courierName,
      status: t.currentStatus,
      estimatedDelivery: t.edd,
      checkpoints: t.checkpoints,
    });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/cancel — cancel NimbusPost order(s) by our order id(s)
// --------------------------------------------------------------------------
router.post("/cancel", verifyAdmin, async (req, res, next) => {
  try {
    if (!nimbus.isConfigured()) throw new ApiError(503, "NimbusPost is not configured");
    const { order_ids } = z.object({ order_ids: z.array(z.string()).min(1) }).parse(req.body);

    const orders = await Order.find({ _id: { $in: order_ids } }).exec();
    const results = [];
    for (const order of orders) {
      const nid = order.shipment?.nimbusOrderId;
      if (!nid) {
        results.push({ orderNumber: order.orderNumber, cancelled: false, reason: "not in NimbusPost" });
        continue;
      }
      const [r] = await nimbus.cancelByOrderIds([nid]);
      if (r?.cancelled) {
        order.status = "cancelled";
        order.shipment.nimbusStatus = "cancelled";
        order.statusHistory = [
          ...(order.statusHistory || []),
          { status: "cancelled", note: "Shipment cancelled in NimbusPost", updatedBy: req.user?.email || "admin" },
        ];
        await order.save();
      }
      results.push({ orderNumber: order.orderNumber, cancelled: !!r?.cancelled, error: r?.error });
    }

    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/shipments/serviceability?pickup_pincode=&delivery_pincode=&weight=
// --------------------------------------------------------------------------
router.get("/serviceability", async (req, res, next) => {
  try {
    const params = z
      .object({
        pickup_pincode: z.string().min(6),
        delivery_pincode: z.string().min(6),
        weight: z.string().optional(),
        cod: z.string().optional(),
      })
      .parse(req.query);

    const result = await nimbus.checkServiceability({
      pickup_pincode: params.pickup_pincode,
      delivery_pincode: params.delivery_pincode,
      weight: params.weight ? Number(params.weight) : 0.5,
      cod: params.cod === "true" || params.cod === "1",
    });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// Manifests / NDR are managed in the NimbusPost dashboard (not exposed in
// api-v2 for our plan). Kept as graceful stubs so the admin panel never 404s.
// --------------------------------------------------------------------------
router.post("/manifest", verifyAdmin, (_req, res) =>
  res.json({ note: "Generate manifests in the NimbusPost dashboard.", data: [] })
);
router.get("/ndr", verifyAdmin, (_req, res) =>
  res.json({ note: "Manage NDR in the NimbusPost dashboard.", data: [] })
);
router.post("/ndr/action", verifyAdmin, (_req, res) =>
  res.json({ note: "Take NDR actions in the NimbusPost dashboard." })
);

module.exports = router;
