const express = require("express");
const multer = require("multer");
const { z } = require("zod");

const { verifyAdmin } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");
const { upload } = require("../middleware/productUpload");
const { blogUpload } = require("../middleware/blogUpload");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const InventoryLog = require("../models/InventoryLog");
const mongoose = require("mongoose");
const Influencer = require("../models/Influencer");
const Redemption = require("../models/Redemption");
const NewsletterSub = require("../models/NewsletterSub");
const Booking = require("../models/Booking");
const Blog = require("../models/Blog");
const Assessment = require("../models/Assessment");
const invoicing = require("../lib/invoicing");
const invoiceLib = require("../lib/invoice");
// Lead model is registered by leads.routes.js at startup — access lazily
function getLead() { return mongoose.models.Lead || null; }
function getWaitlist() { return mongoose.models.Waitlist || null; }

const router = express.Router();

router.use(verifyAdmin);

const uploadImages = upload.array("images", 5);

function uploadMiddleware(req, res, next) {
  uploadImages(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new ApiError(400, err.message));
    }
    if (err) return next(err);
    return next();
  });
}

function publicUploadBase() {
  const port = process.env.PORT || 5000;
  return (process.env.PUBLIC_UPLOAD_BASE_URL || `http://localhost:${port}`).replace(/\/$/, "");
}

function imageUrlsFromFiles(files) {
  const base = publicUploadBase();
  return (files || []).map((f) => `${base}/uploads/products/${f.filename}`);
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDosha(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((d) => ["Vata", "Pitta", "Kapha"].includes(d));
  try {
    const parsed = JSON.parse(String(raw));
    if (Array.isArray(parsed)) {
      return parsed.filter((d) => ["Vata", "Pitta", "Kapha"].includes(d));
    }
  } catch {
    /* fall through */
  }
  return String(raw)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((d) => ["Vata", "Pitta", "Kapha"].includes(d));
}

const boolish = z.preprocess((v) => {
  if (v === true || v === "true" || v === "on" || v === "1") return true;
  if (v === false || v === "false" || v === "0" || v === "") return false;
  return Boolean(v);
}, z.boolean());

const productCreateBody = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  price: z.preprocess((v) => Number(v), z.number().nonnegative()),
  mrp: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().nonnegative().optional()
  ),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  stockQuantity: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? 0 : Number(v)),
    z.number().int().nonnegative()
  ),
  lowStockThreshold: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? 5 : Number(v)),
    z.number().int().nonnegative()
  ),
  isActive: boolish.optional().default(true),
  isFeatured: boolish.optional().default(false),
  isGiftable: boolish.optional().default(false),
  badge: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.enum(["Best Seller", "New", "20% Off"]).optional()
  ),
  dosha: z.string().optional(),
  sku: z.string().optional(),
});

const productPatchBody = productCreateBody.partial();

function getRangeStart(period) {
  const now = new Date();
  if (period === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(now.getFullYear(), 0, 1);
}

async function revenueFor(period) {
  const start = getRangeStart(period);
  const rows = await Order.aggregate([
    // Revenue means money actually captured by the gateway. Counting every
    // non-cancelled order (including `pending` ones that were abandoned at
    // checkout) overstated takings on the dashboard.
    {
      $match: {
        createdAt: { $gte: start },
        status: { $ne: "cancelled" },
        "payment.status": "captured",
        // Doctor sampling carries no money, and pre-launch gateway tests are not
        // sales — counting either overstates what the business actually earned.
        isSample: { $ne: true },
        isTest: { $ne: true },
      },
    },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  return rows[0]?.total || 0;
}

// Accepts `YYYY-MM-DD` (snapped to the local day so a founder picking "today"
// gets the whole day) as well as a full ISO timestamp.
function parseBoundary(raw, endOfDay) {
  const value = String(raw).trim();
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, y, m, d] = dateOnly.map(Number);
    const at = endOfDay
      ? new Date(y, m - 1, d, 23, 59, 59, 999)
      : new Date(y, m - 1, d, 0, 0, 0, 0);
    // Reject rolled-over dates such as 2026-02-31.
    if (at.getFullYear() !== y || at.getMonth() !== m - 1 || at.getDate() !== d) return null;
    return at;
  }
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms);
}

// Same revenue rule as revenueFor(), over an arbitrary window: captured money
// only, no cancellations, no doctor samples and no pre-launch gateway tests.
async function totalsForWindow(from, to) {
  const match = {
    status: { $ne: "cancelled" },
    "payment.status": "captured",
    isSample: { $ne: true },
    isTest: { $ne: true },
  };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = from;
    if (to) match.createdAt.$lte = to;
  }
  const rows = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
        units: { $sum: { $sum: "$items.quantity" } },
      },
    },
  ]);
  return {
    revenue: Math.round(rows[0]?.revenue || 0),
    orders: rows[0]?.orders || 0,
    units: rows[0]?.units || 0,
  };
}

router.get("/dashboard", async (req, res, next) => {
  try {
    // Optional window on top of the fixed today/month/year buckets. Both bounds
    // are optional individually so "all time up to today" needs no fake start.
    const { from: fromRaw, to: toRaw } = req.query;
    let windowFrom = null;
    let windowTo = null;
    if (fromRaw !== undefined || toRaw !== undefined) {
      if (fromRaw !== undefined && String(fromRaw).trim() !== "") {
        windowFrom = parseBoundary(fromRaw, false);
        if (!windowFrom) throw new ApiError(400, "`from` must be a YYYY-MM-DD or ISO date");
      }
      if (toRaw !== undefined && String(toRaw).trim() !== "") {
        windowTo = parseBoundary(toRaw, true);
        if (!windowTo) throw new ApiError(400, "`to` must be a YYYY-MM-DD or ISO date");
      }
      if (windowFrom && windowTo && windowFrom > windowTo) {
        throw new ApiError(400, "`from` must not be later than `to`");
      }
      if (!windowFrom && !windowTo) {
        throw new ApiError(400, "`from` or `to` must carry a date");
      }
    }
    const rangeRequested = Boolean(windowFrom || windowTo);

    const [
      today,
      month,
      year,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      newCustomers,
      inventoryValueAgg,
      totalActive,
      totalFeatured,
      topProducts,
      ordersByStatus,
      rangeTotals,
    ] = await Promise.all([
      revenueFor("today"),
      revenueFor("month"),
      revenueFor("year"),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["pending", "confirmed", "processing"] } }),
      Product.countDocuments({
        isActive: true,
        $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] },
      }),
      User.countDocuments({ createdAt: { $gte: getRangeStart("month") }, role: "customer" }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$price", "$stockQuantity"] } },
          },
        },
      ]),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isFeatured: true, isActive: true }),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            let: { pid: "$items.productId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: [{ $toString: "$_id" }, "$$pid"] },
                      { $eq: ["$slug", "$$pid"] },
                      { $eq: ["$sku", "$$pid"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: "matchedProduct",
          },
        },
        {
          $addFields: {
            groupKey: {
              $cond: {
                if: { $gt: [{ $size: "$matchedProduct" }, 0] },
                then: { $toString: { $arrayElemAt: ["$matchedProduct._id", 0] } },
                else: "$items.productId",
              },
            },
            productName: {
              $cond: {
                if: { $gt: [{ $size: "$matchedProduct" }, 0] },
                then: { $arrayElemAt: ["$matchedProduct.name", 0] },
                else: "$items.name",
              },
            },
          },
        },
        {
          $group: {
            _id: "$groupKey",
            name: { $first: "$productName" },
            unitsSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      rangeRequested ? totalsForWindow(windowFrom, windowTo) : null,
    ]);

    const inventoryValue = Math.round(inventoryValueAgg[0]?.total || 0);
    const ordersByStatusMap = {};
    for (const row of ordersByStatus) {
      if (row._id) ordersByStatusMap[row._id] = row.count;
    }

    const topProductsOut = topProducts.map((row) => ({
      productId: row._id,
      name: row.name || row._id,
      unitsSold: row.unitsSold,
      revenue: Math.round(row.revenue || 0),
    }));

    return res.json({
      revenue: { today, month, year },
      orders: { total: totalOrders, pending: pendingOrders },
      inventory: { lowStockProducts, inventoryValue },
      products: { totalActive, totalFeatured },
      topProducts: topProductsOut,
      ordersByStatus: ordersByStatusMap,
      customers: { newThisMonth: newCustomers },
      range: rangeRequested
        ? {
            from: windowFrom ? windowFrom.toISOString() : null,
            to: windowTo ? windowTo.toISOString() : null,
            ...rangeTotals,
          }
        : null,
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/orders", async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    });
    const { status, page = "1", limit = "20" } = schema.parse(req.query);
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));

    const filter = {};
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    return res.json({
      orders,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/admin/orders/manual
 *
 * Records an order taken outside the website (phone, WhatsApp, in person, or
 * doctor sampling) so it lives in the same order book as web checkouts. Before
 * this existed, staff keyed such orders straight into the courier panel and
 * they never appeared in reporting at all.
 *
 * Line prices are read from the catalogue, never from the request body, so an
 * offline order cannot invent revenue. Sample orders are forced to zero.
 */
const MANUAL_PAYMENT_MODES = ["upi_direct", "bank_transfer", "cash", "card_machine", "cod", "sample"];

router.post("/orders/manual", async (req, res, next) => {
  try {
    const schema = z.object({
      items: z
        .array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() }))
        .min(1),
      shippingAddress: z.object({
        title: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1).default("-"),
        email: z.string().email().optional(),
        phone: z.string().min(10),
        line1: z.string().min(1),
        line2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        pincode: z.string().min(6),
        country: z.string().min(1).optional(),
      }),
      paymentMode: z.enum(MANUAL_PAYMENT_MODES),
      paid: z.boolean().default(false),
      shippingFee: z.number().nonnegative().default(0),
      discountAmount: z.number().nonnegative().default(0),
      note: z.string().max(500).optional(),
    });
    const body = schema.parse(req.body);
    const isSample = body.paymentMode === "sample";

    // Resolve every line against the catalogue so name/price/slug are trustworthy.
    const items = [];
    for (const line of body.items) {
      const product = mongoose.isValidObjectId(line.productId)
        ? await Product.findById(line.productId).lean().exec()
        : await Product.findOne({ $or: [{ sku: line.productId }, { slug: line.productId }] }).lean().exec();
      if (!product) throw new ApiError(400, `Product not found: ${line.productId}`);
      const price = isSample ? 0 : Number(product.price) || 0;
      items.push({
        product: product._id,
        productId: product._id.toString(),
        name: product.name,
        image: (product.images && product.images[0]) || "/placeholder.svg",
        slug: product.slug,
        price,
        mrp: Number(product.mrp) || price,
        quantity: line.quantity,
        subtotal: price * line.quantity,
      });
    }

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const shippingFee = isSample ? 0 : body.shippingFee;
    const discountAmount = isSample ? 0 : Math.min(body.discountAmount, subtotal);
    const total = Math.max(0, subtotal + shippingFee - discountAmount);

    // A sample is "settled" by definition; otherwise trust the paid flag.
    const captured = isSample || body.paid;
    const now = new Date();
    const adminEmail = req.user?.email || "admin";
    // Offline buyers (doctors, walk-ins) often give a phone number only, but the
    // Order schema requires an address email. Synthesise an obviously-internal
    // placeholder rather than making staff invent a real-looking address —
    // mirrors the existing @otp.3tattava.local convention used for phone signups.
    const contactEmail =
      body.shippingAddress.email ||
      `p${body.shippingAddress.phone.replace(/\D/g, "")}@offline.3tattava.local`;

    const order = await Order.create({
      orderNumber: `3T-${Date.now()}`,
      user: null,
      guestEmail: body.shippingAddress.email || undefined,
      items,
      shippingAddress: { country: "India", ...body.shippingAddress, email: contactEmail },
      subtotal,
      shippingFee,
      gstAmount: 0,
      discountAmount,
      total,
      status: "confirmed",
      statusHistory: [{ status: "confirmed", updatedBy: adminEmail, timestamp: now }],
      payment: {
        provider: "offline",
        method: body.paymentMode,
        status: captured ? "captured" : "pending",
        capturedAt: captured ? now : undefined,
      },
      source: "offline-admin",
      isSample,
      createdByAdmin: adminEmail,
      adminNote: body.note,
    });

    // Mirror the web checkout: decrement stock and leave an inventory trail.
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      ).exec();
      if (!updated) continue; // insufficient stock: order still stands, flagged by the log gap
      await InventoryLog.create({
        product: item.product,
        changeType: "sale",
        quantityBefore: updated.stockQuantity + item.quantity,
        quantityChange: -item.quantity,
        quantityAfter: updated.stockQuantity,
        reason: `Offline order ${order.orderNumber} (${body.paymentMode}) by ${adminEmail}`,
        orderId: order._id,
        adminId: mongoose.isValidObjectId(req.user?.id) ? req.user.id : undefined,
      });
    }

    return res.status(201).json(order.toJSON());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, err.issues[0]?.message || "Invalid order payload"));
    }
    return next(err);
  }
});

router.put("/orders/:id/status", async (req, res, next) => {
  try {
    const bodySchema = z.object({
      status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
      note: z.string().optional(),
      courierName: z.string().optional(),
      trackingNumber: z.string().optional(),
      trackingUrl: z.string().optional(),
      estimatedDelivery: z.string().optional(),
    });
    const parsed = bodySchema.parse(req.body);

    const order = await Order.findById(req.params.id).exec();
    if (!order) throw new ApiError(404, "Order not found");

    order.status = parsed.status;
    order.statusHistory = [
      ...(order.statusHistory || []),
      {
        status: parsed.status,
        note: parsed.note,
        updatedBy: req.user?.email || "admin",
      },
    ];

    if (parsed.courierName !== undefined) order.tracking.courierName = parsed.courierName;
    if (parsed.trackingNumber !== undefined) order.tracking.trackingNumber = parsed.trackingNumber;
    if (parsed.trackingUrl !== undefined) order.tracking.trackingUrl = parsed.trackingUrl;
    if (parsed.estimatedDelivery !== undefined) order.tracking.estimatedDelivery = parsed.estimatedDelivery;

    await order.save();
    return res.json(order);
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /api/admin/orders/:id
 *
 * Corrects an order after the fact. Until now the only mutation was the status
 * dropdown, so a wrong pincode or a mis-keyed quantity meant cancelling and
 * re-recording the order, which broke the audit trail and double-counted stock.
 *
 * Rules that keep the books honest:
 *  - line prices are re-read from the catalogue, never taken from the body, so
 *    an edit cannot invent or discount revenue;
 *  - stock is reconciled by the delta only, and every change writes an
 *    InventoryLog row naming the admin who made it;
 *  - delivered and cancelled orders are frozen. Editing a shipped order would
 *    desync the courier's manifest from ours.
 */
router.patch("/orders/:id", async (req, res, next) => {
  try {
    const schema = z.object({
      shippingAddress: z
        .object({
          title: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
          firstName: z.string().min(1).optional(),
          lastName: z.string().min(1).optional(),
          email: z.string().email().optional(),
          phone: z.string().min(10).optional(),
          line1: z.string().min(1).optional(),
          line2: z.string().optional(),
          city: z.string().min(1).optional(),
          state: z.string().min(1).optional(),
          pincode: z.string().min(6).optional(),
          country: z.string().optional(),
        })
        .optional(),
      items: z
        .array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() }))
        .min(1)
        .optional(),
      adminNote: z.string().max(2000).optional(),
    });

    const body = schema.parse(req.body ?? {});
    if (!body.shippingAddress && !body.items && body.adminNote === undefined) {
      throw new ApiError(400, "Nothing to update");
    }

    const order = await Order.findById(req.params.id).exec();
    if (!order) throw new ApiError(404, "Order not found");

    const frozen = ["delivered", "cancelled"];
    if (frozen.includes(order.status)) {
      throw new ApiError(
        409,
        `A ${order.status} order cannot be edited. Its stock and courier record are already settled.`
      );
    }

    const adminEmail = req.user?.email || "admin";
    const changes = [];

    if (body.shippingAddress) {
      for (const [key, value] of Object.entries(body.shippingAddress)) {
        const before = order.shippingAddress?.[key];
        if (value !== undefined && String(before ?? "") !== String(value)) {
          changes.push(`${key}: "${before ?? ""}" -> "${value}"`);
          order.shippingAddress[key] = value;
        }
      }
    }

    if (body.items) {
      // Re-price from the catalogue and reconcile stock by the delta so an edit
      // never double-decrements or silently loses units.
      const ids = body.items.map((line) => line.productId);
      const products = await Product.find({ _id: { $in: ids } }).exec();
      const byId = new Map(products.map((p) => [p._id.toString(), p]));
      if (byId.size !== new Set(ids).size) throw new ApiError(404, "Product not found");

      const previous = new Map(
        order.items.map((line) => [String(line.productId), line.quantity])
      );

      const rebuilt = body.items.map((line) => {
        const product = byId.get(line.productId);
        const unit = order.isSample ? 0 : product.price;
        return {
          productId: product._id.toString(),
          product: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || "",
          price: unit,
          quantity: line.quantity,
          mrp: product.mrp,
          subtotal: unit * line.quantity,
        };
      });

      const subtotal = rebuilt.reduce((sum, line) => sum + line.subtotal, 0);
      changes.push(
        `items: ${order.items.map((l) => `${l.name} x${l.quantity}`).join(", ")} -> ${rebuilt
          .map((l) => `${l.name} x${l.quantity}`)
          .join(", ")}`
      );

      order.items = rebuilt;
      order.subtotal = subtotal;
      // discountAmount, not discount: the latter is the coupon's percent value.
      order.total = subtotal + (order.shippingFee || 0) - (order.discountAmount || 0);

      const touched = new Set([...previous.keys(), ...rebuilt.map((l) => String(l.product))]);
      for (const productId of touched) {
        const was = previous.get(productId) || 0;
        const now = rebuilt.find((l) => String(l.product) === productId)?.quantity || 0;
        const delta = now - was;
        if (delta === 0) continue;
        // Ordering more units takes them out of stock, hence the negated delta.
        const updated = await Product.findOneAndUpdate(
          { _id: productId },
          { $inc: { stockQuantity: -delta } },
          { new: true }
        ).exec();
        if (!updated) continue;
        await InventoryLog.create({
          product: productId,
          changeType: "adjustment",
          quantityBefore: updated.stockQuantity + delta,
          quantityChange: -delta,
          quantityAfter: updated.stockQuantity,
          reason: `Order ${order.orderNumber} edited by ${adminEmail}`,
          orderId: order._id,
          adminId: mongoose.isValidObjectId(req.user?.id) ? req.user.id : undefined,
        });
      }
    }

    if (body.adminNote !== undefined) order.adminNote = body.adminNote;

    if (changes.length) {
      // Keep the correction visible next to the status history rather than
      // overwriting the record silently.
      order.statusHistory = [
        ...(order.statusHistory || []),
        {
          status: order.status,
          timestamp: new Date(),
          updatedBy: adminEmail,
          note: `Edited — ${changes.join("; ")}`,
        },
      ];
    }

    await order.save();
    return res.json(order);
  } catch (err) {
    return next(err);
  }
});

/* ── Invoicing and the Tally hand-off ───────────────────────────────────── */

/**
 * POST /api/admin/orders/:id/invoice
 *
 * Issues the tax invoice for an order, or returns the existing one. Idempotent
 * on purpose: an invoice number is never reissued, so pressing the button twice
 * cannot produce two documents for one sale.
 */
router.post("/orders/:id/invoice", async (req, res, next) => {
  try {
    const result = await invoicing.issueInvoice(req.params.id);
    return res.status(result.created ? 201 : 200).json({
      invoiceNumber: result.invoiceNumber,
      created: result.created,
      invoice: result.order.invoice,
    });
  } catch (err) {
    if (/not invoiceable|not found/i.test(err.message)) throw new ApiError(400, err.message);
    return next(err);
  }
});

/**
 * GET /api/admin/orders/:id/invoice.html
 *
 * The printable invoice. HTML rather than a generated PDF: it prints to PDF
 * identically from any browser and needs no binary dependency on the server.
 */
router.get("/orders/:id/invoice.html", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) throw new ApiError(404, "Order not found");
    if (!order.invoice?.number) throw new ApiError(400, "No invoice has been issued for this order yet");
    const built = await invoicing.renderExisting(order);
    res.type("html");
    return res.send(invoiceLib.renderInvoiceHtml(built));
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/admin/tally/pending
 *
 * What the next export would contain. Read-only, so the owner can look before
 * committing anything.
 */
router.get("/tally/pending", async (req, res, next) => {
  try {
    const orders = await invoicing.pendingForTally({ from: req.query.from, to: req.query.to });
    return res.json({
      count: orders.length,
      orders: orders.map((o) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        invoiceNumber: o.invoice.number,
        issuedAt: o.invoice.issuedAt,
        customer: [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" "),
        placeOfSupply: o.invoice.placeOfSupply,
        supplyType: o.invoice.supplyType,
        total: o.total,
        isSample: !!o.isSample,
      })),
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/admin/tally/export.xml
 *
 * Downloads the import file. `commit=true` marks the orders as handed over so a
 * later export cannot send them again -- several historical orders were keyed
 * into Tally by hand, and re-sending would double-count revenue.
 *
 * Marking happens only after the XML has been built.
 */
router.get("/tally/export.xml", async (req, res, next) => {
  try {
    const commit = req.query.commit === "true";
    const batch = await invoicing.buildTallyBatch({ from: req.query.from, to: req.query.to, commit });
    if (!batch.voucherCount) throw new ApiError(404, "Nothing to export: no invoiced orders are pending");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tally-${batch.batchId}${commit ? "" : "-preview"}.xml"`
    );
    return res.send(batch.xml);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/admin/gst/summary
 *
 * The figures the CA needs for GSTR-1, read from the frozen invoice values so
 * the summary always reconciles to the documents customers hold.
 */
router.get("/gst/summary", async (req, res, next) => {
  try {
    return res.json(await invoicing.gstSummary({ from: req.query.from, to: req.query.to }));
  } catch (err) {
    return next(err);
  }
});

router.get("/inventory", async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ updatedAt: -1 })
      .select(
        "name slug sku stockQuantity lowStockThreshold isActive updatedAt images price"
      )
      .exec();
    return res.json(products);
  } catch (err) {
    return next(err);
  }
});

router.put("/inventory/:productId", async (req, res, next) => {
  try {
    const schema = z.object({
      quantityChange: z.number().int(),
      reason: z.string().optional(),
      changeType: z.enum(["restock", "sale", "adjustment", "return", "damage"]).optional(),
    });
    const { quantityChange, reason, changeType } = schema.parse(req.body);

    const product = await Product.findById(req.params.productId).exec();
    if (!product) throw new ApiError(404, "Product not found");

    const before = Number(product.stockQuantity || 0);
    const after = before + quantityChange;
    if (after < 0) throw new ApiError(400, "Stock cannot be negative");

    product.stockQuantity = after;
    await product.save();

    await InventoryLog.create({
      product: product._id,
      changeType: changeType || "adjustment",
      quantityBefore: before,
      quantityChange,
      quantityAfter: after,
      reason: reason || "Manual admin update",
      adminId: req.user?.id,
    });

    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

router.put("/inventory/:productId/set", async (req, res, next) => {
  try {
    const schema = z.object({
      setQuantity: z.number().int().nonnegative(),
      reason: z.string().optional(),
    });
    const { setQuantity, reason } = schema.parse(req.body);

    const product = await Product.findById(req.params.productId).exec();
    if (!product) throw new ApiError(404, "Product not found");

    const before = Number(product.stockQuantity || 0);
    const quantityChange = setQuantity - before;
    product.stockQuantity = setQuantity;
    await product.save();

    await InventoryLog.create({
      product: product._id,
      changeType: "adjustment",
      quantityBefore: before,
      quantityChange,
      quantityAfter: setQuantity,
      reason: reason || "Set stock (admin)",
      adminId: req.user?.id,
    });

    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    if (!product) throw new ApiError(404, "Product not found");
    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

router.post("/products", uploadMiddleware, async (req, res, next) => {
  try {
    const parsed = productCreateBody.parse(req.body);
    const slug = (parsed.slug && parsed.slug.trim()) || slugify(parsed.name);
    if (!slug) throw new ApiError(400, "Could not derive slug from name");

    const existing = await Product.findOne({ slug }).exec();
    if (existing) throw new ApiError(409, "A product with this slug already exists");

    const dosha = parseDosha(parsed.dosha);
    const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
    let urls = imageUrlsFromFiles(req.files);
    if (urls.length === 0) {
      urls = [`${frontend.replace(/\/$/, "")}/placeholder.svg`];
    }

    const sku = (parsed.sku && parsed.sku.trim()) || slug;
    const skuTaken = await Product.findOne({ sku }).exec();
    if (skuTaken) throw new ApiError(409, "A product with this SKU already exists");

    const primary = dosha[0];
    const vataPct = primary === "Vata" ? 100 : 0;
    const pittaPct = primary === "Pitta" ? 100 : 0;
    const kaphaPct = primary === "Kapha" ? 100 : 0;

    const product = await Product.create({
      slug,
      name: parsed.name.trim(),
      category: parsed.category.trim(),
      categoryLabel: parsed.categoryLabel.trim(),
      price: parsed.price,
      mrp: parsed.mrp,
      images: urls,
      shortDescription: parsed.shortDescription?.trim(),
      description: parsed.description?.trim(),
      stockQuantity: parsed.stockQuantity,
      lowStockThreshold: parsed.lowStockThreshold,
      isActive: parsed.isActive,
      isFeatured: parsed.isFeatured,
      isGiftable: parsed.isGiftable,
      badge: parsed.badge && String(parsed.badge).trim() ? parsed.badge : undefined,
      dosha,
      vataPct,
      pittaPct,
      kaphaPct,
      sku,
    });

    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
});

router.patch("/products/:id", uploadMiddleware, async (req, res, next) => {
  try {
    const parsed = productPatchBody.parse(req.body);
    const product = await Product.findById(req.params.id).exec();
    if (!product) throw new ApiError(404, "Product not found");

    if (parsed.name !== undefined) product.name = parsed.name.trim();
    if (parsed.category !== undefined) product.category = parsed.category.trim();
    if (parsed.categoryLabel !== undefined) product.categoryLabel = parsed.categoryLabel.trim();
    if (parsed.price !== undefined) product.price = parsed.price;
    if (parsed.mrp !== undefined) product.mrp = parsed.mrp;
    if (parsed.shortDescription !== undefined) product.shortDescription = parsed.shortDescription?.trim();
    if (parsed.description !== undefined) product.description = parsed.description?.trim();
    if (parsed.stockQuantity !== undefined) product.stockQuantity = parsed.stockQuantity;
    if (parsed.lowStockThreshold !== undefined) product.lowStockThreshold = parsed.lowStockThreshold;
    if (parsed.isActive !== undefined) product.isActive = parsed.isActive;
    if (parsed.isFeatured !== undefined) product.isFeatured = parsed.isFeatured;
    if (parsed.isGiftable !== undefined) product.isGiftable = parsed.isGiftable;

    if (parsed.badge !== undefined) {
      product.badge =
        parsed.badge && String(parsed.badge).trim() ? parsed.badge : undefined;
    }

    if (parsed.slug !== undefined && parsed.slug.trim()) {
      const nextSlug = parsed.slug.trim();
      if (nextSlug !== product.slug) {
        const taken = await Product.findOne({ slug: nextSlug }).exec();
        if (taken) throw new ApiError(409, "Slug already in use");
        product.slug = nextSlug;
      }
    }

    if (parsed.sku !== undefined && parsed.sku.trim()) {
      const nextSku = parsed.sku.trim();
      if (nextSku !== product.sku) {
        const takenSku = await Product.findOne({ sku: nextSku }).exec();
        if (takenSku) throw new ApiError(409, "SKU already in use");
        product.sku = nextSku;
      }
    }

    if (parsed.dosha !== undefined) {
      const dosha = parseDosha(parsed.dosha);
      product.dosha = dosha;
      const primary = dosha[0];
      product.vataPct = primary === "Vata" ? 100 : 0;
      product.pittaPct = primary === "Pitta" ? 100 : 0;
      product.kaphaPct = primary === "Kapha" ? 100 : 0;
    }

    const newUrls = imageUrlsFromFiles(req.files);
    if (newUrls.length > 0) {
      product.images = [...(product.images || []), ...newUrls];
    }

    await product.save();
    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

// ==========================================================================
// SHIPMENTS PANEL
// ==========================================================================

// GET /api/admin/shipments — list orders with shipment data
router.get("/shipments", async (req, res, next) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Number(limit) || 20);

    const filter = {};
    if (status) filter["shipment.nimbusStatus"] = status;

    // Orders that have been shipped (have a shipment subdocument)
    if (!status) filter["shipment.awbNumber"] = { $exists: true };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select("orderNumber status shipment tracking shippingAddress total createdAt")
        .lean()
        .exec(),
      Order.countDocuments(filter),
    ]);

    return res.json({ orders, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/shipments/pending — orders paid but not yet shipped
router.get("/shipments/pending", async (req, res, next) => {
  try {
    const orders = await Order.find({
      "payment.status": "captured",
      "shipment.awbNumber": { $exists: false },
      status: { $in: ["confirmed", "processing"] },
    })
      .sort({ createdAt: -1 })
      .select("orderNumber shippingAddress items total payment createdAt")
      .lean()
      .exec();

    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/shipments/ndr — NDR orders
router.get("/shipments/ndr", async (req, res, next) => {
  try {
    const orders = await Order.find({ "shipment.nimbusStatus": { $in: ["ndr", "rto", "rto_initiated"] } })
      .sort({ createdAt: -1 })
      .select("orderNumber status shipment shippingAddress total")
      .lean()
      .exec();

    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

// ==========================================================================
// LEADS & FORM SUBMISSIONS PANEL
// ==========================================================================

// GET /api/admin/leads — all lead captures from the modal
router.get("/leads", async (req, res, next) => {
  try {
    const Lead = getLead();
    if (!Lead) return res.json({ leads: [], total: 0, note: "Lead model not loaded yet" });

    const { converted, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Number(limit) || 50);

    const filter = {};
    if (converted !== undefined) filter.converted = converted === "true";

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean()
        .exec(),
      Lead.countDocuments(filter),
    ]);

    return res.json({ leads, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/admin/leads/:id/convert — mark lead as converted
router.patch("/leads/:id/convert", async (req, res, next) => {
  try {
    const Lead = getLead();
    if (!Lead) throw new ApiError(503, "Lead model not available");

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: { converted: true } },
      { new: true }
    ).exec();

    if (!lead) throw new ApiError(404, "Lead not found");
    return res.json(lead);
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/waitlist — all pre-launch waitlist submissions
router.get("/waitlist", async (req, res, next) => {
  try {
    const Waitlist = getWaitlist();
    if (!Waitlist) return res.json({ waitlist: [], total: 0, note: "Waitlist model not loaded yet" });

    const { page = "1", limit = "1000" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(5000, Number(limit) || 1000);

    const [entries, total] = await Promise.all([
      Waitlist.find({})
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean()
        .exec(),
      Waitlist.countDocuments(),
    ]);

    return res.json({ waitlist: entries, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/assessments — all performance-assessment submissions
router.get("/assessments", async (req, res, next) => {
  try {
    const { page = "1", limit = "500" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(1000, Number(limit) || 500);
    const [assessments, total] = await Promise.all([
      Assessment.find({})
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .exec(),
      Assessment.countDocuments(),
    ]);
    return res.json({ assessments, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/admin/assessments/:id/scoring — doctor fills Section 12 (Final Prakriti Scoring)
router.patch("/assessments/:id/scoring", async (req, res, next) => {
  try {
    const vpk = z
      .object({ vata: z.number().min(0).max(5).optional(), pitta: z.number().min(0).max(5).optional(), kapha: z.number().min(0).max(5).optional() })
      .partial()
      .optional();
    const schema = z.object({
      bodyType: vpk, digestion: vpk, sleep: vpk, mind: vpk, skin: vpk, energy: vpk,
      analysis: z.string().max(4000).optional(),
      doshaResult: z.string().max(200).optional(),
    });
    const data = schema.parse(req.body);
    const assessment = await Assessment.findById(req.params.id).exec();
    if (!assessment) throw new ApiError(404, "Assessment not found");

    assessment.doctorScoring = {
      filled: true,
      filledAt: new Date(),
      filledBy: req.user?.email || "doctor",
      bodyType: data.bodyType || {}, digestion: data.digestion || {}, sleep: data.sleep || {},
      mind: data.mind || {}, skin: data.skin || {}, energy: data.energy || {},
      analysis: data.analysis || "", doshaResult: data.doshaResult || "",
    };
    await assessment.save();
    return res.json({ assessment });
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid scoring"));
    return next(err);
  }
});

// GET /api/admin/newsletter — newsletter subscribers
router.get("/newsletter", async (req, res, next) => {
  try {
    const { page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Number(limit) || 50);

    const [subscribers, total] = await Promise.all([
      NewsletterSub.find({})
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean()
        .exec(),
      NewsletterSub.countDocuments(),
    ]);

    return res.json({ subscribers, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/bookings — doctor consultation bookings
router.get("/bookings", async (req, res, next) => {
  try {
    const { status, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Number(limit) || 50);

    const filter = {};
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("doctor", "name specialization")
        .lean()
        .exec(),
      Booking.countDocuments(filter),
    ]);

    return res.json({ bookings, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/influencers/overview — quick stats for admin dashboard
router.get("/influencers/overview", async (req, res, next) => {
  try {
    const [micros, totalRedemptions, totalRevenue, rewardQueue] = await Promise.all([
      Influencer.find({ tier: "micro", status: "active" })
        .select("name promoCode deal counters")
        .lean()
        .exec(),
      Redemption.countDocuments({ status: "completed" }),
      Redemption.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$netAmount" } } },
      ]),
      Influencer.countDocuments({ "deal.rewardStatus": "earned" }),
    ]);

    const totalRevenueVal = totalRevenue[0]?.total || 0;

    return res.json({
      micros: micros.map((m) => ({
        id: m._id,
        name: m.name,
        code: m.promoCode,
        directRedemptions: m.counters.directRedemptions,
        rollupRedemptions: m.counters.rollupRedemptions,
        rollupRevenue: m.counters.rollupRevenue,
        goalPct: m.deal.goalRedemptions
          ? Math.round((m.counters.rollupRedemptions / m.deal.goalRedemptions) * 100)
          : null,
        rewardStatus: m.deal.rewardStatus,
      })),
      totals: { redemptions: totalRedemptions, revenue: Math.round(totalRevenueVal) },
      rewardQueueCount: rewardQueue,
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/inventory/logs — full inventory log with pagination
router.get("/inventory/logs", async (req, res, next) => {
  try {
    const { productId, changeType, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Number(limit) || 50);

    const filter = {};
    if (productId) filter.product = productId;
    if (changeType) filter.changeType = changeType;

    const [logs, total] = await Promise.all([
      InventoryLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("product", "name sku")
        .lean()
        .exec(),
      InventoryLog.countDocuments(filter),
    ]);

    return res.json({ logs, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// ==========================================================================
// CUSTOMERS / USERS PANEL
// ==========================================================================

// Samples carry no money and pre-launch tests are not sales, so neither may
// contribute to a customer's spend. Order counts still include them so the
// panel reflects everything actually shipped to that person.
const REAL_SALE_COND = {
  $and: [
    { $eq: ["$payment.status", "captured"] },
    { $ne: ["$isSample", true] },
    { $ne: ["$isTest", true] },
  ],
};

const CUSTOMER_ORDER_STATS = {
  orderCount: { $sum: 1 },
  sampleOrders: { $sum: { $cond: [{ $eq: ["$isSample", true] }, 1, 0] } },
  paidOrders: { $sum: { $cond: [REAL_SALE_COND, 1, 0] } },
  totalSpent: { $sum: { $cond: [REAL_SALE_COND, "$total", 0] } },
  firstOrderAt: { $min: "$createdAt" },
  lastOrderAt: { $max: "$createdAt" },
};

function emailMatchKey(value) {
  return String(value || "").trim().toLowerCase();
}

/** Subscriber part of a phone number, or "" when it isn't a full 10-digit one.
 *  Checkout stores phones as "9876543210", "+919876543210" or "098765 43210",
 *  so only the last ten digits are comparable between an order and an account. */
function phoneMatchKey(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : "";
}

function earlierDate(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return new Date(a) <= new Date(b) ? a : b;
}

function laterDate(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return new Date(a) >= new Date(b) ? a : b;
}

/**
 * Guest checkouts and offline orders keep the buyer's contact details on the
 * order but carry no `user` reference, so one human shows up twice: as a
 * registered account with no purchases, and as an unattributed order. These
 * groups are the raw material for stitching the two halves back together.
 */
function guestOrderContactGroups() {
  return Order.aggregate([
    // `user: null` also covers documents where the field was never set.
    {
      $match: {
        user: null,
        $or: [
          { "shippingAddress.email": { $type: "string", $ne: "" } },
          { "shippingAddress.phone": { $type: "string", $ne: "" } },
        ],
      },
    },
    {
      // Grouped in the database so the payload scales with distinct guest
      // contacts rather than with every guest order ever placed.
      $group: Object.assign({ _id: {
        email: { $toLower: { $ifNull: ["$shippingAddress.email", ""] } },
        phone: { $ifNull: ["$shippingAddress.phone", ""] },
      }, orderIds: { $push: "$_id" } }, CUSTOMER_ORDER_STATS),
    },
  ]).exec();
}

/**
 * Attributes guest contact groups to registered accounts, keyed by user id.
 *
 * Deliberately conservative: an exact lowercased email or a full ten-digit
 * phone, never a name. Email wins when both could point somewhere, and a
 * contact shared by two accounts is left unlinked rather than guessed at.
 * `contacts` must be every account, not one page of them, so the same guest
 * order can never be credited to two different customers.
 */
function linkGuestGroupsToUsers(contacts, groups) {
  const byEmail = new Map();
  const byPhone = new Map();
  for (const c of contacts) {
    const id = c._id.toString();
    const email = emailMatchKey(c.email);
    if (email) byEmail.set(email, byEmail.has(email) ? null : id);
    const phone = phoneMatchKey(c.phone);
    if (phone) byPhone.set(phone, byPhone.has(phone) ? null : id);
  }

  const linked = new Map();
  for (const g of groups) {
    const email = emailMatchKey(g._id && g._id.email);
    const phone = phoneMatchKey(g._id && g._id.phone);
    let userId = null;
    if (email && byEmail.has(email)) userId = byEmail.get(email);
    else if (phone) userId = byPhone.get(phone) || null;
    if (!userId) continue;

    const cur = linked.get(userId) || {
      orderCount: 0,
      paidOrders: 0,
      sampleOrders: 0,
      totalSpent: 0,
      firstOrderAt: null,
      lastOrderAt: null,
      orderIds: [],
    };
    cur.orderCount += g.orderCount;
    cur.paidOrders += g.paidOrders;
    cur.sampleOrders += g.sampleOrders;
    cur.totalSpent += g.totalSpent;
    cur.firstOrderAt = earlierDate(cur.firstOrderAt, g.firstOrderAt);
    cur.lastOrderAt = laterDate(cur.lastOrderAt, g.lastOrderAt);
    for (const id of g.orderIds) cur.orderIds.push(id);
    linked.set(userId, cur);
  }
  return linked;
}

/** Owned and guest-matched orders read as one customer history. */
function mergedCustomerStats(owned, linked) {
  return {
    orderCount: (owned ? owned.orderCount : 0) + (linked ? linked.orderCount : 0),
    paidOrders: (owned ? owned.paidOrders : 0) + (linked ? linked.paidOrders : 0),
    sampleOrders: (owned ? owned.sampleOrders : 0) + (linked ? linked.sampleOrders : 0),
    totalSpent: Math.round((owned ? owned.totalSpent : 0) + (linked ? linked.totalSpent : 0)),
    firstOrderAt: earlierDate(owned && owned.firstOrderAt, linked && linked.firstOrderAt),
    lastOrderAt: laterDate(owned && owned.lastOrderAt, linked && linked.lastOrderAt),
    linkedGuestOrders: linked ? linked.orderCount : 0,
  };
}

// GET /api/admin/users — all registered users, including Google sign-ins
router.get("/users", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Number(req.query.limit) || 200);
    const [rows, total, orderAgg, contacts, guestGroups] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { user: { $ne: null } } },
        { $group: Object.assign({ _id: "$user" }, CUSTOMER_ORDER_STATS) },
      ]),
      User.find({}, { email: 1, phone: 1 }).lean().exec(),
      guestOrderContactGroups(),
    ]);
    const ownedByUser = new Map(orderAgg.map((o) => [o._id.toString(), o]));
    const linkedByUser = linkGuestGroupsToUsers(contacts, guestGroups);
    const statsFor = (id) => mergedCustomerStats(ownedByUser.get(id), linkedByUser.get(id));

    const users = rows.map((u) => {
      const stats = statsFor(u._id.toString());
      return {
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: u.role,
        authMethod: u.googleId ? "google" : u.passwordHash ? "email" : "otp",
        isVerified: !!u.isVerified,
        wellnessPoints: u.wellnessPoints || 0,
        lastLogin: u.lastLogin || null,
        createdAt: u.createdAt,
        orderCount: stats.orderCount,
        paidOrders: stats.paidOrders,
        sampleOrders: stats.sampleOrders,
        totalSpent: stats.totalSpent,
        firstOrderAt: stats.firstOrderAt || null,
        lastOrderAt: stats.lastOrderAt || null,
        linkedGuestOrders: stats.linkedGuestOrders,
      };
    });

    // Global summary (independent of pagination)
    let purchasers = 0;
    let totalRevenue = 0;
    for (const id of new Set([...ownedByUser.keys(), ...linkedByUser.keys()])) {
      const stats = statsFor(id);
      if (stats.paidOrders > 0) purchasers += 1;
      totalRevenue += stats.totalSpent;
    }
    return res.json({ users, total, page, limit, summary: { registered: total, purchasers, totalRevenue } });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/users/:id — full profile + order history for the customer detail card
router.get("/users/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Invalid user id");
    const user = await User.findById(req.params.id).lean().exec();
    if (!user) throw new ApiError(404, "User not found");

    // Same linking rule as the list, evaluated against every account, so the
    // detail card and the row it was opened from can never disagree.
    const [contacts, guestGroups] = await Promise.all([
      User.find({}, { email: 1, phone: 1 }).lean().exec(),
      guestOrderContactGroups(),
    ]);
    const linked = linkGuestGroupsToUsers(contacts, guestGroups).get(user._id.toString());
    const orders = await Order.find({
      $or: [{ user: user._id }, { _id: { $in: linked ? linked.orderIds : [] } }],
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Only genuine sales count toward spend — samples are free and pre-launch
    // tests were not customer purchases.
    const paid = orders.filter(
      (o) => o.payment && o.payment.status === "captured" && !o.isSample && !o.isTest
    );
    const totalSpent = Math.round(paid.reduce((s, o) => s + (o.total || 0), 0));
    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        authMethod: user.googleId ? "google" : user.passwordHash ? "email" : "otp",
        isVerified: !!user.isVerified,
        wellnessPoints: user.wellnessPoints || 0,
        lastLogin: user.lastLogin || null,
        createdAt: user.createdAt,
      },
      orders: orders.map((o) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        date: o.createdAt,
        status: o.status,
        paymentStatus: (o.payment && o.payment.status) || "pending",
        paymentMethod: (o.payment && o.payment.method) || "",
        total: o.total,
        // Matched on contact details rather than owned outright, so the card can
        // say so instead of quietly presenting it as an account purchase.
        linkedGuest: !o.user,
        items: (o.items || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          subtotal: it.subtotal,
        })),
      })),
      summary: {
        orderCount: orders.length,
        paidOrders: paid.length,
        totalSpent,
        linkedGuestOrders: orders.filter((o) => !o.user).length,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────
// EDUCATION BLOG (founder-authored articles)
// ─────────────────────────────────────────────
function blogUploadMw(req, res, next) {
  blogUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) return next(new ApiError(400, err.message));
    if (err) return next(err);
    return next();
  });
}

function blogImageUrl(filename) {
  return `${publicUploadBase()}/uploads/blog/${filename}`;
}

const blogBody = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  pillar: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  readTime: z.string().optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
});

function toBool(v, dflt) {
  if (v === undefined) return dflt;
  return v === true || v === "true";
}

// GET /api/admin/blogs -> all blogs (incl. unpublished), newest first
router.get("/blogs", async (_req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1, createdAt: -1 });
    return res.json({ blogs });
  } catch (err) {
    return next(err);
  }
});

// POST /api/admin/blogs -> create (multipart: coverImage + images[])
router.post("/blogs", blogUploadMw, async (req, res, next) => {
  try {
    const parsed = blogBody.parse(req.body);
    const slug = (parsed.slug && parsed.slug.trim()) || slugify(parsed.title);
    if (!slug) throw new ApiError(400, "A title or slug is required");

    const exists = await Blog.findOne({ slug });
    if (exists) throw new ApiError(409, `A blog with slug "${slug}" already exists`);

    const files = req.files || {};
    const cover = files.coverImage && files.coverImage[0];
    const gallery = files.images || [];

    const doc = await Blog.create({
      slug,
      title: parsed.title.trim(),
      pillar: (parsed.pillar || "Ayurveda").trim(),
      summary: parsed.summary || "",
      content: parsed.content || "",
      author: (parsed.author || "3TATTAVA").trim(),
      readTime: parsed.readTime || "",
      coverImage: cover ? blogImageUrl(cover.filename) : "",
      images: gallery.map((f) => blogImageUrl(f.filename)),
      isPublished: toBool(parsed.isPublished, true),
      publishedAt: new Date(),
    });
    return res.status(201).json(doc);
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid blog payload"));
    return next(err);
  }
});

// PUT /api/admin/blogs/:id -> update (optional new cover/images appended)
router.put("/blogs/:id", blogUploadMw, async (req, res, next) => {
  try {
    const parsed = blogBody.partial().parse(req.body);
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    if (parsed.title !== undefined) blog.title = parsed.title.trim();
    if (parsed.slug && parsed.slug.trim()) blog.slug = parsed.slug.trim();
    if (parsed.pillar !== undefined) blog.pillar = parsed.pillar.trim();
    if (parsed.summary !== undefined) blog.summary = parsed.summary;
    if (parsed.content !== undefined) blog.content = parsed.content;
    if (parsed.author !== undefined) blog.author = parsed.author.trim();
    if (parsed.readTime !== undefined) blog.readTime = parsed.readTime;
    if (parsed.isPublished !== undefined) blog.isPublished = toBool(parsed.isPublished, blog.isPublished);

    const files = req.files || {};
    if (files.coverImage && files.coverImage[0]) blog.coverImage = blogImageUrl(files.coverImage[0].filename);
    if (files.images && files.images.length) {
      blog.images = [...blog.images, ...files.images.map((f) => blogImageUrl(f.filename))];
    }

    await blog.save();
    return res.json(blog);
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid blog payload"));
    return next(err);
  }
});

// DELETE /api/admin/blogs/:id
router.delete("/blogs/:id", async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, "Blog not found");
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
