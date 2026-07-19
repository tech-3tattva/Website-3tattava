"use strict";

/**
 * /api/webhooks — Cashfree inbound webhook handler
 *
 * CRITICAL: Cashfree must send the raw body for HMAC verification.
 * The /api/webhooks/cashfree route is mounted BEFORE express.json() in app.js
 * and uses express.raw() instead.
 *
 * Signature check:
 *   base64(HMAC_SHA256(x-webhook-timestamp + rawBody, secret)) === x-webhook-signature
 *
 * Required env vars:
 *   CASHFREE_WEBHOOK_SECRET   — Cashfree Dashboard → Developers → Webhooks
 *                               (falls back to CASHFREE_CLIENT_SECRET)
 *   N8N_INFLUENCER_WEBHOOK    — (optional) n8n URL for WhatsApp notifications
 */

const crypto = require("crypto");
const express = require("express");

const Order = require("../models/Order");
const Influencer = require("../models/Influencer");
const PromoCode = require("../models/PromoCode");
const Redemption = require("../models/Redemption");
const Product = require("../models/Product");
const InventoryLog = require("../models/InventoryLog");
const nimbus = require("../lib/nimbus");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const router = express.Router();

// --------------------------------------------------------------------------
// HMAC verification helper
// --------------------------------------------------------------------------
function verifyCashfreeSignature(rawBody, timestamp, receivedSig) {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_CLIENT_SECRET;
  if (!secret) {
    console.warn("[webhook] CASHFREE_WEBHOOK_SECRET/CASHFREE_CLIENT_SECRET not set — skipping HMAC verification (INSECURE)");
    return true;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(String(timestamp) + rawBody.toString("utf8"))
    .digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSig || ""));
  } catch {
    return false;
  }
}

// --------------------------------------------------------------------------
// Email helper (same pattern as order.routes.js)
// --------------------------------------------------------------------------
async function sendOrderEmail({ toEmail, orderNumber, total }) {
  const hasSes =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_SES_FROM_EMAIL;

  if (!hasSes) return;

  try {
    const client = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    await client.send(
      new SendEmailCommand({
        Source: process.env.AWS_SES_FROM_EMAIL,
        Destination: { ToAddresses: [toEmail] },
        Message: {
          Subject: { Data: `Your order ${orderNumber} is confirmed — 3TATTAVA` },
          Body: {
            Html: {
              Data: `
                <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
                  <h2 style="color:#1c1304">Order Confirmed ✓</h2>
                  <p>Thank you for your order from <strong>3TATTAVA Performance Ayurveda</strong>.</p>
                  <p><strong>Order ID:</strong> ${orderNumber}</p>
                  <p><strong>Total Paid:</strong> ₹${total}</p>
                  <p>You'll receive a tracking number once your shipment is booked.</p>
                  <p style="margin-top:24px;color:#888;font-size:12px">
                    3TATTAVA · care@3tattava.com · +91 95601 49956
                  </p>
                </div>
              `,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("[webhook] SES email failed:", err.message);
  }
}

// --------------------------------------------------------------------------
// n8n WhatsApp notification helper
// --------------------------------------------------------------------------
async function notifyWhatsApp(webhookUrl, payload) {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[webhook] n8n WhatsApp notification failed:", err.message);
  }
}

// --------------------------------------------------------------------------
// Atomic goal trigger — exactly-once, guarded update
// --------------------------------------------------------------------------
async function maybeTriggerGoal(influencerId, rollupCount) {
  const inf = await Influencer.findOneAndUpdate(
    {
      _id: influencerId,
      "deal.rewardStatus": "pending",
      "deal.goalRedemptions": { $gt: 0 },
      "counters.rollupRedemptions": { $gte: "$deal.goalRedemptions" },
    },
    { $set: { "deal.rewardStatus": "earned" } },
    { new: true }
  ).exec();

  if (inf) {
    console.log(`[webhook] 🎯 Goal reached! Influencer ${inf.name} (${inf._id}) reward = earned`);

    // Notify via n8n if configured
    await notifyWhatsApp(process.env.N8N_INFLUENCER_WEBHOOK, {
      event: "goal_reached",
      influencerName: inf.name,
      influencerPhone: inf.phone,
      code: inf.promoCode,
      rollupRedemptions: inf.counters.rollupRedemptions,
      rewardNote: inf.deal.rewardNote,
    });
  }
}

// --------------------------------------------------------------------------
// POST /api/webhooks/cashfree
// Mounted with express.raw({ type: "application/json" }) in app.js
// --------------------------------------------------------------------------
router.post("/cashfree", async (req, res) => {
  // 1. Verify signature: base64(HMAC_SHA256(timestamp + rawBody, secret))
  const sig = req.headers["x-webhook-signature"] || "";
  const timestamp = req.headers["x-webhook-timestamp"] || "";
  if (!verifyCashfreeSignature(req.body, timestamp, sig)) {
    console.warn("[webhook] Invalid Cashfree signature — rejected");
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 2. Parse payload
  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // 3. Acknowledge immediately — Cashfree retries on non-2xx
  res.status(200).json({ ok: true });

  // 4. Handle specific events async (errors don't affect the 200 response)
  try {
    if (event.type === "PAYMENT_SUCCESS_WEBHOOK") {
      const eventId = event.data?.payment?.cf_payment_id
        ? String(event.data.payment.cf_payment_id)
        : `cf-${Date.now()}`;
      await handlePaymentCaptured(event, eventId);
    } else if (event.type === "REFUND_STATUS_WEBHOOK") {
      await handleRefundProcessed(event);
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err.message, err.stack);
  }
});

// --------------------------------------------------------------------------
// PAYMENT_SUCCESS_WEBHOOK handler
// --------------------------------------------------------------------------
async function handlePaymentCaptured(event, eventId) {
  const cfOrder = event.data?.order;
  const cfPayment = event.data?.payment;
  if (!cfOrder || !cfPayment) return;

  const orderNumber = cfOrder.order_id;
  const cfPaymentId = String(cfPayment.cf_payment_id);
  const cfOrderId = cfOrder.order_id;
  const tags = cfOrder.order_tags || {};

  const promoCode = tags.promoCode || "";
  const influencerId = tags.influencerId || null;
  const parentInfluencerId = tags.parentInfluencerId || null;
  const discountPercent = Number(tags.discountPercent || 0);
  const grossAmountRupees = Number(tags.grossAmountRupees || cfPayment.payment_amount || cfOrder.order_amount || 0);
  const netAmountRupees = Number(cfPayment.payment_amount ?? cfOrder.order_amount ?? 0);
  const discountAmount = grossAmountRupees - netAmountRupees;

  // Find the order in our DB (Cashfree order_id === our orderNumber)
  const order = await Order.findOne({ orderNumber }).exec();
  if (order) {
    // Update payment status
    order.set("payment.cashfree.cfPaymentId", cfPaymentId);
    order.payment.status = "captured";
    order.payment.capturedAt = new Date();

    if (promoCode && !order.promoCode?.code) {
      order.promoCode = {
        code: promoCode,
        influencerId: influencerId || null,
        parentInfluencerId: parentInfluencerId || null,
        discountPercent,
      };
    }

    if (order.status === "pending") {
      order.status = "confirmed";
      order.statusHistory = [
        ...(order.statusHistory || []),
        { status: "confirmed", note: `Payment captured: ${cfPaymentId}`, updatedBy: "cashfree-webhook" },
      ];
    }

    await order.save();

    // Send order confirmation email
    if (order.guestEmail || order.shippingAddress?.email) {
      await sendOrderEmail({
        toEmail: order.guestEmail || order.shippingAddress.email,
        orderNumber: order.orderNumber,
        total: netAmountRupees,
      });
    }

    // Auto-create the order in NimbusPost (ops assigns courier + AWB in the
    // dashboard). Idempotent: skip if we've already pushed it.
    if (nimbus.isConfigured() && !order.shipment?.nimbusOrderId) {
      try {
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
          createdAt: new Date(),
          lastTrackedAt: new Date(),
        };
        await order.save();
        console.log(`[webhook] NimbusPost order created: ${result.nimbusOrderNumber || result.nimbusOrderId} for ${order.orderNumber}`);
      } catch (npErr) {
        console.error("[webhook] NimbusPost auto-create failed:", npErr.message);
      }
    }
  }

  // ---- Promo code redemption recording ----
  if (!promoCode) return;

  // Insert redemption — unique index on eventId prevents duplicates
  try {
    await Redemption.create({
      eventId,
      providerOrderId: cfOrderId,
      providerPaymentId: cfPaymentId,
      orderId: order?._id || null,
      orderNumber: order?.orderNumber || null,
      code: promoCode,
      discountPercent,
      influencerId: influencerId || null,
      parentInfluencerId: parentInfluencerId || null,
      grossAmount: grossAmountRupees,
      discountAmount,
      netAmount: netAmountRupees,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate event — already processed, silently ignore
      console.log(`[webhook] Duplicate event ${eventId} — skipped`);
      return;
    }
    throw err;
  }

  // Increment PromoCode.usedCount
  await PromoCode.updateOne(
    { code: promoCode },
    { $inc: { usedCount: 1 } }
  );

  // Increment influencer direct counters
  if (influencerId) {
    await Influencer.updateOne(
      { _id: influencerId },
      {
        $inc: {
          "counters.directRedemptions": 1,
          "counters.directRevenue": netAmountRupees,
        },
      }
    );
  }

  // Increment micro parent rollup counters
  if (parentInfluencerId) {
    const updated = await Influencer.findOneAndUpdate(
      { _id: parentInfluencerId },
      {
        $inc: {
          "counters.rollupRedemptions": 1,
          "counters.rollupRevenue": netAmountRupees,
        },
      },
      { new: true }
    ).exec();

    if (updated) {
      await maybeTriggerGoal(updated._id, updated.counters.rollupRedemptions);
    }
  } else if (influencerId) {
    // This influencer is a micro — also roll up to their own rollup counter
    const updated = await Influencer.findOneAndUpdate(
      { _id: influencerId, tier: "micro" },
      {
        $inc: {
          "counters.rollupRedemptions": 1,
          "counters.rollupRevenue": netAmountRupees,
        },
      },
      { new: true }
    ).exec();

    if (updated) {
      await maybeTriggerGoal(updated._id, updated.counters.rollupRedemptions);
    }
  }

  console.log(`[webhook] Redemption recorded: ${promoCode} → ${netAmountRupees} INR (event ${eventId})`);
}

// --------------------------------------------------------------------------
// REFUND_STATUS_WEBHOOK handler — clawback
// --------------------------------------------------------------------------
async function handleRefundProcessed(event) {
  const refund = event.data?.refund;
  if (!refund) return;
  if (refund.refund_status && refund.refund_status !== "SUCCESS") return;

  const cfPaymentId = String(refund.cf_payment_id);
  const refundAmount = Number(refund.refund_amount || 0);

  const redemption = await Redemption.findOneAndUpdate(
    { providerPaymentId: cfPaymentId, status: "completed" },
    { $set: { status: "refunded", refundedAt: new Date() } },
    { new: true }
  ).exec();

  if (!redemption) return;

  // Reverse counters
  if (redemption.influencerId) {
    await Influencer.updateOne(
      { _id: redemption.influencerId },
      {
        $inc: {
          "counters.directRedemptions": -1,
          "counters.directRevenue": -refundAmount,
        },
      }
    );
  }

  if (redemption.parentInfluencerId) {
    await Influencer.updateOne(
      { _id: redemption.parentInfluencerId },
      {
        $inc: {
          "counters.rollupRedemptions": -1,
          "counters.rollupRevenue": -refundAmount,
        },
      }
    );
  } else if (redemption.influencerId) {
    await Influencer.updateOne(
      { _id: redemption.influencerId, tier: "micro" },
      {
        $inc: {
          "counters.rollupRedemptions": -1,
          "counters.rollupRevenue": -refundAmount,
        },
      }
    );
  }

  if (redemption.code) {
    await PromoCode.updateOne({ code: redemption.code }, { $inc: { usedCount: -1 } });
  }

  console.log(`[webhook] Refund clawback processed for payment ${cfPaymentId}`);
}

// --------------------------------------------------------------------------
// POST /api/webhooks/nimbus — NimbusPost pushes shipment/tracking updates here.
// Mounted under /api/webhooks with express.raw() so parse the Buffer manually.
// Optional: set NP_WEBHOOK_SECRET to require a matching x-nimbus-signature header.
// --------------------------------------------------------------------------
function mapNimbusStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (/deliver/.test(s)) return "delivered";
  if (/cancel/.test(s)) return "cancelled";
  if (/out.?for.?delivery|dispatch|in.?transit|shipped|picked|manifest|booked/.test(s)) return "shipped";
  return null; // unknown → record checkpoint only, don't change order.status
}

router.post("/nimbus", async (req, res) => {
  let body;
  try {
    body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf8")) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Optional shared-secret check (skipped until NP_WEBHOOK_SECRET is set)
  const secret = process.env.NP_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers["x-nimbus-signature"] || req.headers["x-webhook-secret"] || body.secret;
    if (provided !== secret) {
      console.warn("[webhook] Invalid NimbusPost secret — rejected");
      return res.status(401).json({ error: "Invalid secret" });
    }
  }

  // Acknowledge immediately — NimbusPost retries on non-2xx
  res.status(200).json({ ok: true });

  try {
    const d = body.data || body;
    const awb = String(d.awb_number || d.awb || body.awb_number || body.awb || "").trim();
    if (!awb) return;

    const order = await Order.findOne({ "shipment.awbNumber": awb }).exec();
    if (!order) {
      console.warn(`[webhook] NimbusPost: no order for AWB ${awb}`);
      return;
    }

    const statusText = d.status || d.current_status || d.status_code || body.status || "";
    const location = d.location || d.current_location || d.city || "";
    const remarks = d.message || d.remark || d.activity || d.status_description || "";
    const tsRaw = d.status_date_time || d.event_time || d.timestamp || d.date || Date.now();
    const ts = new Date(tsRaw);

    order.shipment = order.shipment || {};
    order.shipment.checkpoints = order.shipment.checkpoints || [];
    order.shipment.checkpoints.push({
      status: String(statusText),
      location: String(location),
      timestamp: isNaN(ts.getTime()) ? new Date() : ts,
      remarks: String(remarks),
    });
    order.shipment.nimbusStatus = String(statusText).toLowerCase();
    order.shipment.lastTrackedAt = new Date();

    const mapped = mapNimbusStatus(statusText);
    if (mapped && order.status !== "cancelled") {
      order.status = mapped;
      order.statusHistory = [
        ...(order.statusHistory || []),
        { status: mapped, note: `NimbusPost: ${statusText}`, updatedBy: "nimbus-webhook" },
      ];
    }
    await order.save();
    console.log(`[webhook] NimbusPost update ${order.orderNumber} (AWB ${awb}): ${statusText}`);
  } catch (err) {
    console.error("[webhook] NimbusPost handler error:", err.message);
  }
});

module.exports = router;
