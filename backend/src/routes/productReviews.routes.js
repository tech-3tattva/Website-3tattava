const express = require("express");
const { z } = require("zod");

const ProductReview = require("../models/ProductReview");
const Order = require("../models/Order");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

const createSchema = z.object({
  slug: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().min(1).max(5000),
  name: z.string().trim().min(1).max(120),
  email: z.string().email(),
  photos: z.array(z.string().trim().min(1)).max(8).optional(),
});

/**
 * Determine whether `email` is a verified buyer of the product `slug`.
 * True iff an Order exists with a CAPTURED payment whose email (guestEmail or
 * shippingAddress.email — matched case-insensitively, mirroring order.routes.js)
 * contains an item matching this slug (or productId).
 */
async function isVerifiedBuyer(email, slug) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const emailRe = new RegExp(`^${escaped}$`, "i");
  const order = await Order.findOne({
    "payment.status": "captured",
    $or: [{ guestEmail: emailRe }, { "shippingAddress.email": emailRe }],
    items: { $elemMatch: { $or: [{ slug }, { productId: slug }] } },
  })
    .select("_id")
    .lean();
  return Boolean(order);
}

/**
 * POST /api/product-reviews
 * Create a customer product review. Sets verifiedBuyer from real Orders.
 */
router.post("/", async (req, res, next) => {
  try {
    const { slug, rating, title, body, name, email, photos } = createSchema.parse(req.body);
    const emailLc = email.toLowerCase().trim();

    const verifiedBuyer = await isVerifiedBuyer(emailLc, slug);

    const review = await ProductReview.create({
      slug,
      rating,
      title,
      body,
      authorName: name,
      authorEmail: emailLc,
      verifiedBuyer,
      photos: photos || [],
      status: "approved",
    });

    return res.status(201).json({ review, verifiedBuyer });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const first = err.issues && err.issues[0];
      return next(new ApiError(400, (first && first.message) || "Invalid review"));
    }
    return next(err);
  }
});

/**
 * GET /api/product-reviews/:slug
 * Approved reviews for a product, newest first, plus aggregate summary.
 * Empty state when no reviews exist (average 0, count 0) — never fabricated.
 */
router.get("/:slug", async (req, res, next) => {
  try {
    const slug = String(req.params.slug);

    const docs = await ProductReview.find({ slug, status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const r of docs) {
      const rt = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rt] += 1;
      sum += r.rating;
    }

    const count = docs.length;
    const average = count ? Math.round((sum / count) * 10) / 10 : 0;

    const reviews = docs.map((r) => ({
      rating: r.rating,
      title: r.title || "",
      body: r.body,
      authorName: r.authorName,
      verifiedBuyer: Boolean(r.verifiedBuyer),
      photos: r.photos || [],
      createdAt: r.createdAt,
    }));

    return res.json({ average, count, distribution, reviews });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
