"use strict";

/**
 * /api/shipments — NimbusPost shipment management
 *
 * Admin-only except GET /api/shipments/track/:awb (for customer tracking page)
 *
 * Endpoints:
 *   POST   /api/shipments/create          — create shipment for an order (admin)
 *   POST   /api/shipments/track/bulk      — bulk tracking poll (admin/cron)
 *   GET    /api/shipments/track/:awb      — single AWB tracking (public)
 *   POST   /api/shipments/cancel          — cancel AWBs (admin)
 *   POST   /api/shipments/manifest        — generate manifest PDF (admin)
 *   GET    /api/shipments/ndr             — NDR list (admin)
 *   POST   /api/shipments/ndr/action      — NDR action (admin)
 *   GET    /api/shipments/serviceability  — check pincode serviceability (public)
 */

const express = require("express");
const { z } = require("zod");
const nimbus = require("../lib/nimbus");
const Order = require("../models/Order");
const { verifyAdmin, verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

// --------------------------------------------------------------------------
// Internal: build NimbusPost create payload from an Order document
// --------------------------------------------------------------------------
function buildNimbusPayload(order) {
  const addr = order.shippingAddress;
  const item = order.items[0]; // primary item for description

  return {
    order_number: order.orderNumber,
    payment_type: "prepaid", // all Razorpay orders are prepaid
    package_weight: 500, // grams — default; override via env or product meta
    package_length: 15,
    package_breadth: 10,
    package_height: 10,
    order_amount: order.total,
    consignee: {
      name: `${addr.firstName} ${addr.lastName}`,
      address: addr.line1 + (addr.line2 ? `, ${addr.line2}` : ""),
      address_2: "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      country: addr.country || "India",
      email: addr.email,
    },
    pickup_address: {
      warehouse_name: process.env.NP_WAREHOUSE_NAME || "warehouse 1",
    },
    product_description: item?.name || "3TATTAVA Ayurveda Product",
    courier_id: 0, // 0 = auto-assign cheapest courier
  };
}

// --------------------------------------------------------------------------
// POST /api/shipments/create — trigger shipment for an order
// --------------------------------------------------------------------------
router.post("/create", verifyAdmin, async (req, res, next) => {
  try {
    const { orderId } = z.object({ orderId: z.string().min(1) }).parse(req.body);

    const order = await Order.findById(orderId).exec();
    if (!order) throw new ApiError(404, "Order not found");
    if (order.shipment?.awbNumber) {
      return res.json({ message: "Shipment already created", shipment: order.shipment });
    }

    const payload = buildNimbusPayload(order);
    const npResp = await nimbus.createShipment(payload);

    const shipData = npResp.data || npResp;

    order.shipment = {
      awbNumber: shipData.awb_number,
      shipmentId: String(shipData.shipment_id || ""),
      courierName: shipData.courier_name || "",
      labelUrl: shipData.label || "",
      paymentType: "prepaid",
      nimbusStatus: "booked",
      checkpoints: [],
      createdAt: new Date(),
      lastTrackedAt: new Date(),
    };

    // Mirror into legacy tracking field so existing admin panel sees it
    order.tracking = {
      courierName: shipData.courier_name || "",
      trackingNumber: shipData.awb_number,
      trackingUrl: `https://www.nimbuspost.com/tracking/?awb=${shipData.awb_number}`,
    };

    order.status = "processing";
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: "processing", note: `Shipment booked. AWB: ${shipData.awb_number}`, updatedBy: "system" },
    ];

    await order.save();
    return res.json({ shipment: order.shipment, order });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/track/bulk — bulk status refresh (called by cron job)
// --------------------------------------------------------------------------
router.post("/track/bulk", verifyAdmin, async (req, res, next) => {
  try {
    const { awb_numbers } = z
      .object({ awb_numbers: z.array(z.string()).min(1) })
      .parse(req.body);

    const npResp = await nimbus.trackBulk(awb_numbers);
    const trackMap = {}; // awb → tracking info

    for (const t of npResp.data || []) {
      trackMap[t.awb_number] = t;
    }

    // Update orders in DB for each AWB
    const updated = [];
    for (const [awb, info] of Object.entries(trackMap)) {
      const order = await Order.findOne({ "shipment.awbNumber": awb }).exec();
      if (!order) continue;

      order.shipment.nimbusStatus = info.current_status || order.shipment.nimbusStatus;
      order.shipment.lastTrackedAt = new Date();

      if (info.tracking_data?.length) {
        order.shipment.checkpoints = info.tracking_data.map((cp) => ({
          status: cp.sr_status_label || cp.status,
          location: cp.location || "",
          timestamp: cp.date ? new Date(cp.date) : new Date(),
          remarks: cp.activity || "",
        }));
      }

      // Map NimbusPost status → internal order status
      const statusMap = {
        "booked": "processing",
        "in_transit": "shipped",
        "out_for_delivery": "shipped",
        "delivered": "delivered",
        "rto": "cancelled",
        "lost": "cancelled",
      };
      const mappedStatus = statusMap[info.current_status?.toLowerCase()];
      if (mappedStatus && order.status !== mappedStatus) {
        order.status = mappedStatus;
        order.statusHistory = [
          ...(order.statusHistory || []),
          { status: mappedStatus, note: `NimbusPost: ${info.current_status}`, updatedBy: "system" },
        ];
      }

      await order.save();
      updated.push(awb);
    }

    return res.json({ updated, raw: npResp });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/shipments/track/:awb — public single-AWB tracking
// --------------------------------------------------------------------------
router.get("/track/:awb", async (req, res, next) => {
  try {
    const awb = req.params.awb.trim();
    const npResp = await nimbus.trackSingle(awb);
    return res.json(npResp);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/cancel — cancel AWBs
// --------------------------------------------------------------------------
router.post("/cancel", verifyAdmin, async (req, res, next) => {
  try {
    const { awb_numbers } = z
      .object({ awb_numbers: z.array(z.string()).min(1) })
      .parse(req.body);

    const npResp = await nimbus.cancelShipments(awb_numbers);

    // Mark orders cancelled
    for (const awb of awb_numbers) {
      const order = await Order.findOne({ "shipment.awbNumber": awb }).exec();
      if (!order) continue;
      order.status = "cancelled";
      order.shipment.nimbusStatus = "cancelled";
      order.statusHistory = [
        ...(order.statusHistory || []),
        { status: "cancelled", note: "Shipment cancelled via NimbusPost", updatedBy: req.user?.email || "admin" },
      ];
      await order.save();
    }

    return res.json(npResp);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/manifest
// --------------------------------------------------------------------------
router.post("/manifest", verifyAdmin, async (req, res, next) => {
  try {
    const { awb_numbers } = z
      .object({ awb_numbers: z.array(z.string()).min(1) })
      .parse(req.body);

    const npResp = await nimbus.createManifest(awb_numbers);
    return res.json(npResp);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/shipments/ndr — NDR list
// --------------------------------------------------------------------------
router.get("/ndr", verifyAdmin, async (req, res, next) => {
  try {
    const npResp = await nimbus.getNDRList();
    return res.json(npResp);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/shipments/ndr/action
// --------------------------------------------------------------------------
router.post("/ndr/action", verifyAdmin, async (req, res, next) => {
  try {
    const body = z
      .object({
        awb_number: z.string().min(1),
        action: z.string().min(1),
        remarks: z.string().optional(),
      })
      .parse(req.body);

    const npResp = await nimbus.ndrAction(body);
    return res.json(npResp);
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

    const npResp = await nimbus.checkServiceability(params);
    return res.json(npResp);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
