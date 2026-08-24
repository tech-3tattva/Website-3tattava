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
    { $match: { createdAt: { $gte: start }, status: { $ne: "cancelled" }, "payment.status": "captured" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  return rows[0]?.total || 0;
}

router.get("/dashboard", async (req, res, next) => {
  try {
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

// GET /api/admin/users — all registered users, including Google sign-ins
router.get("/users", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Number(req.query.limit) || 200);
    const [rows, total, orderAgg] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { user: { $ne: null } } },
        {
          $group: {
            _id: "$user",
            orderCount: { $sum: 1 },
            paidOrders: { $sum: { $cond: [{ $eq: ["$payment.status", "captured"] }, 1, 0] } },
            totalSpent: { $sum: { $cond: [{ $eq: ["$payment.status", "captured"] }, "$total", 0] } },
            lastOrderAt: { $max: "$createdAt" },
          },
        },
      ]),
    ]);
    const spendByUser = new Map(orderAgg.map((o) => [o._id.toString(), o]));
    const users = rows.map((u) => {
      const agg = spendByUser.get(u._id.toString());
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
        orderCount: agg ? agg.orderCount : 0,
        paidOrders: agg ? agg.paidOrders : 0,
        totalSpent: agg ? Math.round(agg.totalSpent) : 0,
        lastOrderAt: agg ? agg.lastOrderAt : null,
      };
    });
    // Global summary (independent of pagination)
    const purchasers = orderAgg.filter((o) => o.paidOrders > 0).length;
    const totalRevenue = Math.round(orderAgg.reduce((s, o) => s + (o.totalSpent || 0), 0));
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
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).lean().exec();
    const paid = orders.filter((o) => o.payment && o.payment.status === "captured");
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
        items: (o.items || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          subtotal: it.subtotal,
        })),
      })),
      summary: { orderCount: orders.length, paidOrders: paid.length, totalSpent },
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
