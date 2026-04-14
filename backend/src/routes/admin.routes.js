const express = require("express");
const multer = require("multer");
const { z } = require("zod");

const { verifyAdmin } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");
const { upload } = require("../middleware/productUpload");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const InventoryLog = require("../models/InventoryLog");

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
    { $match: { createdAt: { $gte: start }, status: { $ne: "cancelled" } } },
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

module.exports = router;
