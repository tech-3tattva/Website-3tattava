"use strict";

/**
 * /api/webhooks — Razorpay + NimbusPost inbound webhook handlers
 *
 * CRITICAL: Razorpay must send raw body for HMAC verification.
 * The /api/webhooks/razorpay route is mounted BEFORE express.json() in app.js
 * and uses express.raw() instead.
 *
 * Required env vars:
 *   RAZORPAY_WEBHOOK_SECRET   — from Razorpay Dashboard → Webhooks → secret
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
function verifyRazorpaySignature(rawBody, receivedSig) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping HMAC verification (INSECURE)");
    return true;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(receivedSig || "", "hex"));
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
// POST /api/webhooks/razorpay
// Mounted with express.raw({ type: "application/json" }) in app.js
// --------------------------------------------------------------------------
router.post("/razorpay", async (req, res) => {
  // 1. Verify signature
  const sig = req.headers["x-razorpay-signature"] || "";
  if (!verifyRazorpaySignature(req.body, sig)) {
    console.warn("[webhook] Invalid Razorpay signature — rejected");
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 2. Parse payload
  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const eventId = req.headers["x-razorpay-event-id"] || `rz-${Date.now()}`;

  // 3. Acknowledge immediately — Razorpay retries on non-2xx within 5s
  res.status(200).json({ ok: true });

  // 4. Handle specific events async (errors don't affect the 200 response)
  try {
    if (event.event === "payment.captured") {
      await handlePaymentCaptured(event, eventId);
    } else if (event.event === "refund.processed") {
      await handleRefundProcessed(event, eventId);
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err.message, err.stack);
  }
});

// --------------------------------------------------------------------------
// payment.captured handler
// --------------------------------------------------------------------------
async function handlePaymentCaptured(event, eventId) {
  const payment = event.payload?.payment?.entity;
  if (!payment) return;

  const rzOrderId = payment.order_id;
  const rzPaymentId = payment.id;
  const notes = payment.notes || {};

  const promoCode = notes.promoCode || "";
  const influencerId = notes.influencerId || null;
  const parentInfluencerId = notes.parentInfluencerId || null;
  const discountPercent = Number(notes.discountPercent || 0);
  const grossAmountRupees = Number(notes.grossAmountRupees || payment.amount / 100);
  const netAmountRupees = payment.amount / 100;
  const discountAmount = grossAmountRupees - netAmountRupees;

  // Find the order in our DB
  const order = await Order.findOne({ "payment.razorpayOrderId": rzOrderId }).exec();
  if (order) {
    // Update payment status
    order.payment.razorpayPaymentId = rzPaymentId;
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
        { status: "confirmed", note: `Payment captured: ${rzPaymentId}`, updatedBy: "razorpay-webhook" },
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

    // Auto-create NimbusPost shipment if env is configured
    if (process.env.NP_EMAIL && process.env.NP_PASSWORD) {
      try {
        if (!order.shipment?.awbNumber) {
          const payload = {
            order_number: order.orderNumber,
            payment_type: "prepaid",
            package_weight: 500,
            package_length: 15,
            package_breadth: 10,
            package_height: 10,
            order_amount: netAmountRupees,
            consignee: {
              name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
              address: order.shippingAddress.line1 + (order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""),
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              pincode: order.shippingAddress.pincode,
              phone: order.shippingAddress.phone,
              email: order.shippingAddress.email,
              country: order.shippingAddress.country || "India",
            },
            pickup_address: { warehouse_name: process.env.NP_WAREHOUSE_NAME || "warehouse 1" },
            product_description: order.items[0]?.name || "3TATTAVA Product",
            courier_id: 0,
          };
          const npResp = await nimbus.createShipment(payload);
          const s = npResp.data || npResp;
          order.shipment = {
            awbNumber: s.awb_number,
            shipmentId: String(s.shipment_id || ""),
            courierName: s.courier_name || "",
            labelUrl: s.label || "",
            paymentType: "prepaid",
            nimbusStatus: "booked",
            checkpoints: [],
            createdAt: new Date(),
            lastTrackedAt: new Date(),
          };
          order.tracking = {
            courierName: s.courier_name || "",
            trackingNumber: s.awb_number,
            trackingUrl: `https://www.nimbuspost.com/tracking/?awb=${s.awb_number}`,
          };
          await order.save();
          console.log(`[webhook] NimbusPost shipment booked: AWB ${s.awb_number} for order ${order.orderNumber}`);
        }
      } catch (npErr) {
        console.error("[webhook] NimbusPost auto-shipment failed:", npErr.message);
      }
    }
  }

  // ---- Promo code redemption recording ----
  if (!promoCode) return;

  // Insert redemption — unique index on razorpayEventId prevents duplicates
  try {
    await Redemption.create({
      razorpayEventId: eventId,
      razorpayOrderId: rzOrderId,
      razorpayPaymentId: rzPaymentId,
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
// refund.processed handler — clawback
// --------------------------------------------------------------------------
async function handleRefundProcessed(event, eventId) {
  const refund = event.payload?.refund?.entity;
  if (!refund) return;

  const rzPaymentId = refund.payment_id;
  const refundAmount = refund.amount / 100;

  const redemption = await Redemption.findOneAndUpdate(
    { razorpayPaymentId: rzPaymentId, status: "completed" },
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

  console.log(`[webhook] Refund clawback processed for payment ${rzPaymentId}`);
}

module.exports = router;
