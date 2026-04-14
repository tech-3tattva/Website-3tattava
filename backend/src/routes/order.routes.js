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
  return Product.findOne({ sku: raw }).lean().exec();
}

router.post("/place-demo", async (req, res, next) => {
  try {
    const itemSchema = z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      image: z.string().min(1),
      price: z.number().nonnegative(),
      mrp: z.number().nonnegative().optional(),
      quantity: z.number().int().positive(),
      slug: z.string().min(1),
      variant: z.string().optional(),
    });

    const shippingAddressSchema = z.object({
      title: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(6),
      country: z.string().min(1).optional(),
    });

    const schema = z.object({
      items: z.array(itemSchema).min(1),
      shippingAddress: shippingAddressSchema,
      subtotal: z.number().nonnegative(),
      shippingFee: z.number().nonnegative(),
      discountAmount: z.number().nonnegative(),
      total: z.number().nonnegative(),
      coupon: z
        .object({
          code: z.string().min(1),
          discount: z.number().nonnegative(),
        })
        .optional(),
      shippingMethod: z.enum(["standard", "express", "free"]).optional(),
    });

    const parsed = schema.parse(req.body);
    const customerId = getOptionalCustomerId(req);

    const resolvedLines = [];
    for (const item of parsed.items) {
      const product = await resolveProductForOrderLine(item.productId);
      if (!product) {
        return next(
          new ApiError(
            400,
            `Product not found: ${item.name}. Remove it from your cart and add it again from the shop.`
          )
        );
      }
      if (!product.isActive) {
        return next(new ApiError(400, `${item.name} is no longer available.`));
      }
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
      if (stock < need) {
        return next(
          new ApiError(
            400,
            `Not enough stock for ${row?.product.name ?? "a product"}. Available: ${stock}, requested: ${need}.`
          )
        );
      }
    }

    const orderNumber = `3T-${Date.now()}`;
    const normalizedItems = resolvedLines.map(({ item, product }) => ({
      productId: String(product._id),
      name: item.name,
      image: item.image,
      slug: item.slug,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      variant: item.variant,
      subtotal: item.price * item.quantity,
    }));

    const orderPayload = {
      orderNumber,
      user: customerId || null,
      guestEmail: parsed.shippingAddress.email.toLowerCase().trim(),
      items: normalizedItems,
      shippingAddress: {
        title: parsed.shippingAddress.title,
        firstName: parsed.shippingAddress.firstName,
        lastName: parsed.shippingAddress.lastName,
        email: parsed.shippingAddress.email,
        phone: parsed.shippingAddress.phone,
        line1: parsed.shippingAddress.line1,
        line2: parsed.shippingAddress.line2 || undefined,
        city: parsed.shippingAddress.city,
        state: parsed.shippingAddress.state,
        pincode: parsed.shippingAddress.pincode,
        country: parsed.shippingAddress.country || "India",
      },
      subtotal: parsed.subtotal,
      shippingFee: parsed.shippingFee,
      discountAmount: parsed.discountAmount,
      total: parsed.total,
      coupon: parsed.coupon ? { code: parsed.coupon.code, discount: parsed.coupon.discount } : undefined,
      shippingMethod: parsed.shippingMethod,
      status: "confirmed",
      statusHistory: [{ status: "confirmed", updatedBy: "system" }],
      payment: {
        method: "demo",
        status: "captured",
        capturedAt: new Date(),
      },
      tracking: {},
    };

    const session = await mongoose.startSession();
    let order;
    try {
      await session.withTransaction(async () => {
        const [created] = await Order.create([orderPayload], { session });
        order = created;

        for (const [productIdStr, need] of needByProductId) {
          const updated = await Product.findOneAndUpdate(
            { _id: productIdStr, stockQuantity: { $gte: need } },
            { $inc: { stockQuantity: -need } },
            { session, new: true }
          ).exec();

          if (!updated) {
            throw new ApiError(
              400,
              "Stock changed while placing your order. Please refresh and try again."
            );
          }

          const qtyBefore = updated.stockQuantity + need;
          await InventoryLog.create(
            [
              {
                product: productIdStr,
                changeType: "sale",
                quantityBefore: qtyBefore,
                quantityChange: -need,
                quantityAfter: updated.stockQuantity,
                reason: `Order ${orderNumber}`,
                orderId: order._id,
              },
            ],
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    const emailResult = await trySendOrderConfirmationEmail({
      toEmail: parsed.shippingAddress.email,
      orderNumber,
      total: parsed.total,
    });

    console.log("[backend] order confirmation email:", {
      to: parsed.shippingAddress.email,
      orderNumber,
      total: parsed.total,
      sent: emailResult.sent,
      reason: emailResult.sent ? undefined : emailResult.reason,
    });

    const orderJson = order.toJSON();
    orderJson.emailSent = emailResult.sent;
    if (!emailResult.sent) orderJson.emailError = emailResult.reason;

    return res.status(201).json(orderJson);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, err.issues[0]?.message || "Invalid order payload"));
    }
    return next(err);
  }
});

router.get("/:orderNumber", async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).exec();
    if (!order) throw new ApiError(404, "Order not found");
    return res.json(order);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

