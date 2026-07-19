"use strict";

/**
 * Periodic NimbusPost tracking refresh.
 *
 * Polls order detail for every order that has a NimbusPost order id and isn't
 * in a final state, and mirrors AWB / status / checkpoints onto the order.
 * Runs alongside the real-time tracking webhook — whichever updates first wins.
 */

const Order = require("../models/Order");
const nimbus = require("../lib/nimbus");

const FINAL = ["delivered", "cancelled"];

function mapStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (["delivered"].includes(s)) return "delivered";
  if (["cancelled", "canceled", "rto", "rto_delivered", "rto_initiated", "lost"].includes(s)) return "cancelled";
  if (["out_for_delivery", "ofd", "in_transit", "intransit", "shipped", "manifested", "pickup_scheduled", "picked_up", "picked"].includes(s)) return "shipped";
  if (["created", "new", "pickup_pending", "ready_to_ship"].includes(s)) return "processing";
  return null;
}

async function refreshActiveShipments(limit = 150) {
  if (!nimbus.isConfigured()) return { skipped: "nimbus not configured" };

  const orders = await Order.find({
    "shipment.nimbusOrderId": { $exists: true, $ne: "" },
    status: { $nin: FINAL },
  })
    .limit(limit)
    .exec();
  if (!orders.length) return { refreshed: 0, updated: 0 };

  const byId = new Map(orders.map((o) => [o.shipment.nimbusOrderId, o]));
  const tracked = await nimbus.trackByOrderIds([...byId.keys()]);

  let updated = 0;
  for (const t of tracked) {
    if (t.error) continue;
    const order = byId.get(t.nimbusOrderId);
    if (!order) continue;

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
        { status: mapped, note: `NimbusPost: ${t.currentStatus}`, updatedBy: "system-cron" },
      ];
    }

    await order.save();
    updated += 1;
  }
  return { refreshed: orders.length, updated };
}

/**
 * Start the periodic refresher. First run 60s after boot, then every intervalMs.
 * No-op when NimbusPost isn't configured.
 */
function startTrackingCron(intervalMs = 30 * 60 * 1000) {
  const run = () =>
    refreshActiveShipments()
      .then((r) => {
        if (r && (r.updated || r.refreshed)) console.log(`[cron] tracking refresh: ${JSON.stringify(r)}`);
      })
      .catch((e) => console.error("[cron] tracking refresh failed:", e.message));
  setTimeout(run, 60 * 1000).unref();
  const timer = setInterval(run, intervalMs);
  timer.unref();
  return timer;
}

module.exports = { refreshActiveShipments, startTrackingCron };
