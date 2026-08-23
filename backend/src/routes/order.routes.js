const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const InventoryLog = require("../models/InventoryLog");
const { verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");
const { z } = require("zod");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const cashfree = require("../lib/cashfree");
const metaCapi = require("../lib/metaCapi");
const { markWelcomeCouponUsed, evaluateWelcome } = require("../utils/welcomeCoupon");
const Coupon = require("../models/Coupon");

const router = express.Router();

/** When checkout sends Bearer token, attach order to that user so /orders lists it. */
function getOptionalCustomerId(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id ? String(decoded.id) : null;
  } catch {
    return null;
  }
}

// Paid-ad attribution sent from the checkout client. Only the declared keys are
// kept, each clipped to a sane length; returns undefined when nothing usable.
const ATTRIBUTION_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "fbc", "fbp", "referrer", "landing_path",
];
function pickAttribution(raw) {
  if (!raw || typeof raw !== "object") return undefined;
  const clip = (v, n = 500) => (v == null ? undefined : String(v).trim().slice(0, n));
  const out = {};
  for (const key of ATTRIBUTION_KEYS) {
    const val = clip(raw[key]);
    if (val) out[key] = val;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Re-validate a founding welcome coupon server-side before granting the discount.
 *  Throws ApiError when the code isn't the buyer's, is already used, or the global
 *  200-redemption cap is reached. No-op for non-welcome (or no) coupons. */
async function assertWelcomeCouponEligible(couponInput, userId, subtotal) {
  if (!couponInput || !couponInput.code) return;
  const coupon = await Coupon.findOne({ code: String(couponInput.code).toUpperCase() }).exec();
  if (!coupon) return; // not a system coupon (e.g. influencer promo) — unchanged
  if (coupon.kind !== "welcome" && !coupon.user) return; // non-welcome coupon — unchanged
  const check = await evaluateWelcome(coupon, userId, Number(subtotal) || 0);
  if (!check.ok) {
    throw new ApiError(400, check.message || "This offer is no longer available. Please remove the code.");
  }
}

async function trySendOrderConfirmationEmail({ toEmail, orderNumber, total }) {
  const hasSes =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_SES_FROM_EMAIL;

  if (!hasSes) {
    return { sent: false, reason: "SES not configured (missing AWS_* env vars)" };
  }

  try {
    const client = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const subject = `Your order ${orderNumber} is confirmed`;
    const text = `Hi,\n\nThank you for your order from 3Tattva Ayurveda & Wellness.\n\nOrder ID: ${orderNumber}\nTotal: ₹${total}\n\nYou can track your order from the website.\n\nThanks!`;

    await client.send(
      new SendEmailCommand({
        Source: process.env.AWS_SES_FROM_EMAIL,
        Destination: { ToAddresses: [toEmail] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: text },
          },
        },
      })
    );

    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : "Failed to send email" };
  }
}

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).select("email").lean().exec();
    const emailNorm = me?.email?.toLowerCase().trim();
    const orConditions = [{ user: req.user.id }];
    if (emailNorm) {
      const escaped = emailNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      orConditions.push({ guestEmail: new RegExp(`^${escaped}$`, "i") });
    }
    const orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .exec();
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

/** Resolve catalog row from cart `productId` (Mongo id string from API, or sku fallback). */
async function resolveProductForOrderLine(productId) {
  const raw = String(productId || "").trim();
  if (!raw) return null;
  if (mongoose.Types.ObjectId.isValid(raw)) {
    const byId = await Product.findById(raw).lean().exec();
    if (byId) return byId;
  }
  const bySku = await Product.findOne({ sku: raw }).lean().exec();
  if (bySku) return bySku;
  return Product.findOne({ slug: raw }).lean().exec();
}

// ── Cashfree helpers + schema ─────────────────────────────────────────────────
const cfItemSchema = z.object({
  productId: z.string().min(1), name: z.string().min(1), image: z.string().min(1),
  price: z.number().nonnegative(), mrp: z.number().nonnegative().optional(),
  quantity: z.number().int().positive(), slug: z.string().min(1), variant: z.string().optional(),
});
const cfOrderSchema = z.object({
  items: z.array(cfItemSchema).min(1),
  shippingAddress: z.object({
    title: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
    firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(),
    phone: z.string().min(10), line1: z.string().min(1), line2: z.string().optional(),
    city: z.string().min(1), state: z.string().min(1), pincode: z.string().min(6), country: z.string().min(1).optional(),
  }),
  subtotal: z.number().nonnegative(), shippingFee: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(), total: z.number().positive(),
  coupon: z.object({ code: z.string().min(1), discount: z.number().nonnegative() }).optional(),
  shippingMethod: z.enum(["standard", "express", "free"]).optional(),
});

// POST /api/orders/create-cashfree — create a Cashfree order + pending DB order
router.post("/create-cashfree", async (req, res, next) => {
  try {
    const parsed = cfOrderSchema.parse(req.body);
    if (!cashfree.getCashfree()) return next(new ApiError(503, "Online payments are not configured yet."));
    const customerId = getOptionalCustomerId(req);
    await assertWelcomeCouponEligible(parsed.coupon, customerId, parsed.subtotal);

    const resolvedLines = [];
    for (const item of parsed.items) {
      const product = await resolveProductForOrderLine(item.productId);
      if (!product) return next(new ApiError(400, `Product not found: ${item.name}.`));
      if (!product.isActive) return next(new ApiError(400, `${item.name} is no longer available.`));
      resolvedLines.push({ item, product });
    }
    const needByProductId = new Map();
    for (const { item, product } of resolvedLines) {
      const id = String(product._id);
      needByProductId.set(id, (needByProductId.get(id) || 0) + item.quantity);
    }
    for (const [id, need] of needByProductId) {
      const row = resolvedLines.find((l) => String(l.product._id) === id);
      const stock = Number(row?.product.stockQuantity ?? 0);
      if (stock < need) return next(new ApiError(400, `Not enough stock for ${row?.product.name ?? "a product"}. Available: ${stock}.`));
    }

    const orderNumber = `3T-${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const cfOrder = await cashfree.createOrder({
      order_id: orderNumber,
      order_amount: Number(parsed.total.toFixed(2)),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId ? String(customerId) : `guest-${orderNumber}`,
        customer_name: `${parsed.shippingAddress.firstName} ${parsed.shippingAddress.lastName}`.trim(),
        customer_email: parsed.shippingAddress.email,
        customer_phone: parsed.shippingAddress.phone,
      },
      order_meta: { return_url: `${frontendUrl}/order-confirmation/${orderNumber}` },
    });

    const normalizedItems = resolvedLines.map(({ item, product }) => ({
      productId: String(product._id), name: item.name, image: item.image, slug: item.slug,
      price: item.price, mrp: item.mrp, quantity: item.quantity, variant: item.variant,
      subtotal: item.price * item.quantity,
    }));

    await Order.create({
      orderNumber,
      user: customerId || null,
      guestEmail: parsed.shippingAddress.email.toLowerCase().trim(),
      items: normalizedItems,
      shippingAddress: {
        ...parsed.shippingAddress,
        line2: parsed.shippingAddress.line2 || undefined,
        country: parsed.shippingAddress.country || "India",
      },
      subtotal: parsed.subtotal, shippingFee: parsed.shippingFee,
      discountAmount: parsed.discountAmount, total: parsed.total,
      coupon: parsed.coupon ? { code: parsed.coupon.code, discount: parsed.coupon.discount } : undefined,
      shippingMethod: parsed.shippingMethod,
      status: "pending",
      statusHistory: [{ status: "pending", updatedBy: "system" }],
      payment: {
        provider: "cashfree",
        status: "pending",
        cashfree: {
          orderId: String(cfOrder.cf_order_id),
          paymentSessionId: cfOrder.payment_session_id,
        },
      },
      tracking: {},
      attribution: pickAttribution(req.body.attribution),
    });

    return res.status(201).json({
      orderNumber,
      paymentSessionId: cfOrder.payment_session_id,
      cfOrderId: String(cfOrder.cf_order_id),
      mode: "cashfree",
    });
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid order payload"));
    return next(err);
  }
});

// POST /api/orders/verify-cashfree — fetch Cashfree order, capture payment, decrement stock
router.post("/verify-cashfree", async (req, res, next) => {
  try {
    const v = z.object({ orderNumber: z.string().min(1) }).parse(req.body);
    if (!cashfree.getCashfree()) return next(new ApiError(503, "Online payments are not configured yet."));

    const cfOrder = await cashfree.fetchOrder(v.orderNumber);
    if (!cfOrder) return next(new ApiError(404, "Order not found."));

    const order = await Order.findOne({ orderNumber: v.orderNumber }).exec();
    if (!order) return next(new ApiError(404, "Order not found."));
    if (order.payment.status === "captured") return res.json(order.toJSON());
    if (cfOrder.order_status !== "PAID") {
      // Not paid yet (ACTIVE) or failed/expired — tell the client which, don't 400.
      return res.json({ captured: false, payment: { status: "pending" }, cashfreeStatus: cfOrder.order_status });
    }

    const need = new Map();
    for (const it of order.items) {
      const id = String(it.productId);
      need.set(id, (need.get(id) || 0) + it.quantity);
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        for (const [productIdStr, qty] of need) {
          const updated = await Product.findOneAndUpdate(
            { _id: productIdStr, stockQuantity: { $gte: qty } },
            { $inc: { stockQuantity: -qty } },
            { session, new: true }
          ).exec();
          if (!updated) throw new ApiError(400, "Stock changed during payment. Our team will reach out.");
          await InventoryLog.create([{
            product: productIdStr, changeType: "sale",
            quantityBefore: updated.stockQuantity + qty, quantityChange: -qty, quantityAfter: updated.stockQuantity,
            reason: `Order ${order.orderNumber}`, orderId: order._id,
          }], { session });
        }
        order.payment.status = "captured";
        order.payment.capturedAt = new Date();
        order.status = "confirmed";
        order.statusHistory.push({ status: "confirmed", updatedBy: "cashfree", note: `Order ${v.orderNumber} paid` });
        await order.save({ session });
      });
    } finally {
      await session.endSession();
    }

    // Best-effort: a bundle sale also draws down its component products' stock
    // (units defined on the bundle Product). Non-fatal — never blocks capture.
    try {
      for (const it of order.items) {
        const bundle = await Product.findById(it.productId).lean().exec();
        if (!bundle?.isBundle || !Array.isArray(bundle.bundleItems)) continue;
        for (const comp of bundle.bundleItems) {
          if (!comp?.slug) continue;
          const dec = (Number(comp.quantity) || 1) * it.quantity;
          const compProd = await Product.findOne({ slug: comp.slug }).exec();
          if (!compProd) continue;
          const before = compProd.stockQuantity;
          compProd.stockQuantity = Math.max(0, before - dec);
          await compProd.save();
          await InventoryLog.create({
            product: compProd._id, changeType: "sale",
            quantityBefore: before, quantityChange: -dec, quantityAfter: compProd.stockQuantity,
            reason: `Bundle ${order.orderNumber} (${bundle.slug})`, orderId: order._id,
          });
        }
      }
    } catch (e) { console.error("[bundle] component stock decrement failed:", e.message); }

    try {
      if (order?.user && order?.coupon?.code) {
        await markWelcomeCouponUsed(order.user, order.coupon.code, order.orderNumber);
      }
    } catch (e) { console.error("[welcome] redeem (cashfree) failed:", e.message); }

    // Server-side Meta Conversions API Purchase. Shares its event_id with the
    // browser Pixel event (orderNumber) so Meta dedups the pair. No-op unless
    // CAPI env is configured; wrapped so it never breaks order verification.
    try {
      await metaCapi.sendPurchaseEvent({
        eventId: order.orderNumber,
        value: order.total,
        currency: "INR",
        email: order.shippingAddress?.email,
        phone: order.shippingAddress?.phone,
        fbc: order.attribution?.fbc,
        fbp: order.attribution?.fbp,
        clientIp: (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip,
        userAgent: req.get("user-agent"),
        sourceUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/order-confirmation/${order.orderNumber}`,
      });
    } catch (e) { console.error("[meta-capi] purchase event failed:", e.message); }

    const emailResult = await trySendOrderConfirmationEmail({
      toEmail: order.shippingAddress.email, orderNumber: order.orderNumber, total: order.total,
    });
    const orderJson = order.toJSON();
    orderJson.emailSent = emailResult.sent;
    if (!emailResult.sent) orderJson.emailError = emailResult.reason;
    return res.json(orderJson);
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid verification payload"));
    return next(err);
  }
});

router.get("/:orderNumber", async (req, res, next) => {
  try {
    // Public guest tracking — require the order email to match so order numbers
    // cannot be enumerated to leak customer PII. Logged-in users use /account/orders.
    const email = String(req.query.email || "").toLowerCase().trim();
    if (!email) throw new ApiError(400, "Enter the email used on the order to track it.");
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).exec();
    if (!order) throw new ApiError(404, "Order not found");
    const emails = [order.shippingAddress?.email, order.guestEmail]
      .filter(Boolean)
      .map((e) => String(e).toLowerCase().trim());
    if (!emails.includes(email)) throw new ApiError(404, "Order not found");
    return res.json(order);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

