"use strict";

/**
 * /api/promo — Two-tier influencer referral engine
 *
 * Public:
 *   POST /api/promo/validate          — validate a code and return discount %
 *   POST /api/promo/cashfree-order    — create Cashfree order with server-side discount
 *
 * Admin (verifyAdmin):
 *   POST   /api/promo/influencers           — create influencer + auto-create their code
 *   GET    /api/promo/influencers           — list all influencers
 *   GET    /api/promo/influencers/:id       — single influencer with nano children
 *   PATCH  /api/promo/influencers/:id       — update status, deal, etc.
 *   GET    /api/promo/codes                 — all promo codes
 *   GET    /api/promo/redemptions           — redemption ledger (filterable)
 *   GET    /api/promo/rewards/queue         — earned-but-unfulfilled reward queue
 *   POST   /api/promo/rewards/:id/fulfill   — mark reward fulfilled
 */

const express = require("express");
const { z } = require("zod");
const cashfree = require("../lib/cashfree");

const Influencer = require("../models/Influencer");
const PromoCode = require("../models/PromoCode");
const Redemption = require("../models/Redemption");
const { verifyAdmin } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

// --------------------------------------------------------------------------
// Helper: resolve a promo code and return its details
// Returns null if code doesn't exist / is not usable
// --------------------------------------------------------------------------
async function resolveCode(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return null;

  const pc = await PromoCode.findOne(
    { code },
    null,
    { collation: { locale: "en", strength: 2 } }
  )
    .populate("influencerId")
    .lean()
    .exec();

  if (!pc) return null;
  if (pc.status !== "active") return null;
  if (pc.expiresAt && pc.expiresAt < new Date()) return null;
  if (pc.maxRedemptions !== null && pc.usedCount >= pc.maxRedemptions) return null;

  // Influencer must be active
  if (pc.influencerId && pc.influencerId.status !== "active") return null;

  return pc;
}

// --------------------------------------------------------------------------
// POST /api/promo/validate
// Body: { code: "PRIYA" }
// Returns: { valid, discountPercent, message }
// --------------------------------------------------------------------------
router.post("/validate", async (req, res, next) => {
  try {
    const { code } = z.object({ code: z.string().min(1) }).parse(req.body);

    const pc = await resolveCode(code);
    if (!pc) {
      return res.json({ valid: false, discountPercent: 0, message: "Invalid or expired code" });
    }

    return res.json({
      valid: true,
      code: pc.code,
      discountPercent: pc.discountPercent,
      message: `Code applied — ${pc.discountPercent}% off`,
    });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/promo/cashfree-order
// Creates a Cashfree order with server-side discount applied.
// Body: { grossAmountRupees, code?, currency?, receipt?, notes?, customer? }
// Returns: Cashfree order object + paymentSessionId + discountApplied
// --------------------------------------------------------------------------
router.post("/cashfree-order", async (req, res, next) => {
  try {
    const body = z.object({
      grossAmountRupees: z.number().positive(),
      code: z.string().optional(),
      currency: z.string().default("INR"),
      receipt: z.string().optional(),
      notes: z.record(z.string()).optional(),
      customer: z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }).optional(),
    }).parse(req.body);

    if (!cashfree.getCashfree()) throw new ApiError(503, "Online payments are not configured yet.");

    let discountPercent = 0;
    let codeDoc = null;

    if (body.code) {
      codeDoc = await resolveCode(body.code);
      if (codeDoc) discountPercent = codeDoc.discountPercent;
    }

    const discountAmount = Math.round(body.grossAmountRupees * (discountPercent / 100));
    const netAmountRupees = body.grossAmountRupees - discountAmount;

    const orderId = body.receipt || `3T-${Date.now()}`;
    const cfOrder = await cashfree.createOrder({
      order_id: orderId,
      order_amount: Number(netAmountRupees.toFixed(2)),
      order_currency: body.currency,
      customer_details: {
        customer_id: body.customer?.id || orderId,
        customer_name: body.customer?.name,
        customer_email: body.customer?.email,
        customer_phone: body.customer?.phone,
      },
      order_tags: {
        ...(body.notes || {}),
        promoCode: codeDoc?.code || "",
        influencerId: codeDoc?.influencerId ? String(codeDoc.influencerId._id || codeDoc.influencerId) : "",
        parentInfluencerId: codeDoc?.parentInfluencerId ? String(codeDoc.parentInfluencerId) : "",
        discountPercent: String(discountPercent),
        grossAmountRupees: String(body.grossAmountRupees),
      },
    });

    return res.json({
      ...cfOrder,
      paymentSessionId: cfOrder.payment_session_id,
      discountPercent,
      discountAmount,
      netAmountRupees,
      grossAmountRupees: body.grossAmountRupees,
    });
  } catch (err) {
    return next(err);
  }
});

// ==========================================================================
// ADMIN ROUTES
// ==========================================================================

// --------------------------------------------------------------------------
// POST /api/promo/influencers — create influencer + promo code
// --------------------------------------------------------------------------
router.post("/influencers", verifyAdmin, async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(1),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      tier: z.enum(["micro", "nano"]),
      parentInfluencerId: z.string().optional(), // required when tier = "nano"
      promoCode: z.string().min(2),
      discountPercent: z.number().min(1).max(100),
      goalRedemptions: z.number().int().nonnegative().optional(),
      rewardNote: z.string().optional(),
      whatsappOptIn: z.boolean().optional(),
    }).parse(req.body);

    const codeUpper = body.promoCode.trim().toUpperCase();

    // Guard: code must be unique
    const existing = await PromoCode.findOne(
      { code: codeUpper },
      null,
      { collation: { locale: "en", strength: 2 } }
    ).exec();
    if (existing) throw new ApiError(409, `Promo code ${codeUpper} already exists`);

    let parentInfluencer = null;
    if (body.tier === "nano") {
      if (!body.parentInfluencerId) {
        throw new ApiError(400, "parentInfluencerId is required for nano influencers");
      }
      parentInfluencer = await Influencer.findById(body.parentInfluencerId).exec();
      if (!parentInfluencer) throw new ApiError(404, "Parent influencer not found");
      if (parentInfluencer.tier !== "micro") {
        throw new ApiError(400, "Parent must be a micro influencer");
      }
    }

    // Create influencer document
    const influencer = await Influencer.create({
      name: body.name,
      phone: body.phone,
      email: body.email,
      tier: body.tier,
      parentInfluencerId: parentInfluencer?._id || null,
      promoCode: codeUpper,
      whatsappOptIn: body.whatsappOptIn ?? false,
      deal: {
        discountPercent: body.discountPercent,
        goalRedemptions: body.goalRedemptions ?? 0,
        rewardNote: body.rewardNote,
        rewardStatus: body.goalRedemptions ? "pending" : "none",
      },
    });

    // Create corresponding PromoCode document
    await PromoCode.create({
      code: codeUpper,
      codeType: body.tier,
      parentCode: parentInfluencer?.promoCode || null,
      influencerId: influencer._id,
      parentInfluencerId: parentInfluencer?._id || null,
      discountPercent: body.discountPercent,
      status: "active",
    });

    return res.status(201).json(influencer);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/promo/influencers — list all
// --------------------------------------------------------------------------
router.get("/influencers", verifyAdmin, async (req, res, next) => {
  try {
    const { tier, status, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Number(limit) || 50);

    const filter = {};
    if (tier) filter.tier = tier;
    if (status) filter.status = status;

    const [influencers, total] = await Promise.all([
      Influencer.find(filter)
        .sort({ tier: 1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("parentInfluencerId", "name promoCode")
        .lean()
        .exec(),
      Influencer.countDocuments(filter),
    ]);

    return res.json({ influencers, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/promo/influencers/:id — single + nano children + recent redemptions
// --------------------------------------------------------------------------
router.get("/influencers/:id", verifyAdmin, async (req, res, next) => {
  try {
    const influencer = await Influencer.findById(req.params.id)
      .populate("parentInfluencerId", "name promoCode")
      .lean()
      .exec();
    if (!influencer) throw new ApiError(404, "Influencer not found");

    const children =
      influencer.tier === "micro"
        ? await Influencer.find({ parentInfluencerId: influencer._id }).lean().exec()
        : [];

    const redemptions = await Redemption.find({ influencerId: influencer._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
      .exec();

    // Bifurcation: breakdown per nano code under this micro
    const bifurcation =
      influencer.tier === "micro"
        ? await Redemption.aggregate([
            {
              $match: {
                parentInfluencerId: influencer._id,
                status: "completed",
              },
            },
            {
              $group: {
                _id: "$influencerId",
                code: { $first: "$code" },
                redemptions: { $sum: 1 },
                revenue: { $sum: "$netAmount" },
              },
            },
            { $sort: { redemptions: -1 } },
          ])
        : [];

    return res.json({ influencer, children, redemptions, bifurcation });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// PATCH /api/promo/influencers/:id
// --------------------------------------------------------------------------
router.patch("/influencers/:id", verifyAdmin, async (req, res, next) => {
  try {
    const body = z.object({
      status: z.enum(["active", "paused", "banned"]).optional(),
      discountPercent: z.number().min(1).max(100).optional(),
      goalRedemptions: z.number().int().nonnegative().optional(),
      rewardNote: z.string().optional(),
      whatsappOptIn: z.boolean().optional(),
    }).parse(req.body);

    const influencer = await Influencer.findById(req.params.id).exec();
    if (!influencer) throw new ApiError(404, "Influencer not found");

    if (body.status !== undefined) influencer.status = body.status;
    if (body.discountPercent !== undefined) influencer.deal.discountPercent = body.discountPercent;
    if (body.goalRedemptions !== undefined) influencer.deal.goalRedemptions = body.goalRedemptions;
    if (body.rewardNote !== undefined) influencer.deal.rewardNote = body.rewardNote;
    if (body.whatsappOptIn !== undefined) influencer.whatsappOptIn = body.whatsappOptIn;

    await influencer.save();

    // Keep PromoCode.discountPercent in sync
    if (body.discountPercent !== undefined) {
      await PromoCode.updateOne(
        { influencerId: influencer._id },
        { $set: { discountPercent: body.discountPercent } }
      );
    }

    // Sync PromoCode status when influencer is paused/banned
    if (body.status && body.status !== "active") {
      await PromoCode.updateOne(
        { influencerId: influencer._id },
        { $set: { status: "paused" } }
      );
    } else if (body.status === "active") {
      await PromoCode.updateOne(
        { influencerId: influencer._id },
        { $set: { status: "active" } }
      );
    }

    return res.json(influencer);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/promo/codes — full code registry
// --------------------------------------------------------------------------
router.get("/codes", verifyAdmin, async (req, res, next) => {
  try {
    const codes = await PromoCode.find({})
      .sort({ codeType: 1, createdAt: -1 })
      .populate("influencerId", "name tier")
      .lean()
      .exec();
    return res.json(codes);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/promo/redemptions — ledger
// ?code=&influencerId=&from=&to=&status=&page=&limit=
// --------------------------------------------------------------------------
router.get("/redemptions", verifyAdmin, async (req, res, next) => {
  try {
    const { code, influencerId, from, to, status, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Number(limit) || 50);

    const filter = {};
    if (code) filter.code = String(code).toUpperCase();
    if (influencerId) filter.influencerId = influencerId;
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [redemptions, total] = await Promise.all([
      Redemption.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("influencerId", "name tier")
        .populate("parentInfluencerId", "name promoCode")
        .lean()
        .exec(),
      Redemption.countDocuments(filter),
    ]);

    return res.json({ redemptions, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// GET /api/promo/rewards/queue — earned-but-unfulfilled rewards
// --------------------------------------------------------------------------
router.get("/rewards/queue", verifyAdmin, async (req, res, next) => {
  try {
    const queue = await Influencer.find({ "deal.rewardStatus": "earned" })
      .sort({ updatedAt: 1 })
      .lean()
      .exec();
    return res.json(queue);
  } catch (err) {
    return next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/promo/rewards/:id/fulfill — mark reward fulfilled
// --------------------------------------------------------------------------
router.post("/rewards/:id/fulfill", verifyAdmin, async (req, res, next) => {
  try {
    const { note } = z.object({ note: z.string().optional() }).parse(req.body);

    const influencer = await Influencer.findOneAndUpdate(
      { _id: req.params.id, "deal.rewardStatus": "earned" },
      {
        $set: {
          "deal.rewardStatus": "fulfilled",
          "deal.rewardNote": note || "Fulfilled by admin",
        },
      },
      { new: true }
    ).exec();

    if (!influencer) throw new ApiError(404, "Influencer not found or reward not in earned state");
    return res.json(influencer);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
