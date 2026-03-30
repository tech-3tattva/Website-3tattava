const express = require("express");

const Product = require("../models/Product");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

function toTitleCaseDosha(d) {
  if (!d) return d;
  const s = String(d).trim().toLowerCase();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

router.get("/", async (req, res, next) => {
  try {
    const {
      category,
      dosha,
      search,
      sort = "newest",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(50, Number(limit) || 10));

    const filter = { isActive: true };
    if (category) filter.category = String(category);
    if (dosha) filter.dosha = { $in: [toTitleCaseDosha(dosha)] };
    if (search) {
      const q = String(search).trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
      ];
    }

    const sortOptions = (() => {
      switch (String(sort)) {
        case "price-asc":
          return { price: 1 };
        case "price-desc":
          return { price: -1 };
        case "rating":
          return { rating: -1 };
        case "newest":
        default:
          return { createdAt: -1 };
      }
    })();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    return res.json({
      products,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/featured", async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .exec();
    return res.json(products);
  } catch (err) {
    return next(err);
  }
});

router.get("/:slugOrId", async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const product = await Product.findOne({ slug: slugOrId, isActive: true }).exec();
    if (!product) throw new ApiError(404, "Product not found");
    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

router.get("/:slugOrId/related", async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const current = await Product.findOne({ slug: slugOrId, isActive: true }).exec();
    if (!current) return res.json([]);

    const related = await Product.find({
      isActive: true,
      category: current.category,
      _id: { $ne: current._id },
    })
      .limit(4)
      .exec();

    return res.json(related);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

