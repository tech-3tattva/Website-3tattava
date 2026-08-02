const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const Coupon = require("../models/Coupon");
const { ApiError } = require("../middleware/errorHandler");
const { evaluateWelcome, getWelcomeRedeemedCount, WELCOME_GLOBAL_LIMIT } = require("../utils/welcomeCoupon");

const router = express.Router();

/** Read the user id from an optional Bearer token (welcome codes require login). */
function optionalUserId(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

/** Rupees off for a coupon given a cart subtotal (flat or percent + maxDiscount cap). */
function computeDiscountAmount(coupon, cartTotal) {
  if (coupon.type === "flat") return Math.min(Number(coupon.value) || 0, Math.max(0, cartTotal));
  const raw = Math.round((cartTotal * (Number(coupon.value) || 0)) / 100);
  return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
}

router.post("/validate", async (req, res, next) => {
  try {
    const schema = z.object({
      code: z.string().min(1),
      cartTotal: z.number().positive(),
    });
    const { code, cartTotal } = schema.parse(req.body);

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase() }).exec();
    if (!coupon || !coupon.isActive) {
      return res.json({ valid: false, discount: 0, discountAmount: 0, message: "Invalid coupon" });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.json({ valid: false, discount: 0, discountAmount: 0, message: "Coupon expired" });
    }
    if (cartTotal < (coupon.minOrderAmount || 0)) {
      return res.json({
        valid: false,
        discount: 0,
        discountAmount: 0,
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
      });
    }

    // Per-user welcome codes: require the owner and enforce single use.
    if (coupon.kind === "welcome" || coupon.user) {
      const check = await evaluateWelcome(coupon, optionalUserId(req), cartTotal);
      if (!check.ok) return res.json({ valid: false, discount: 0, discountAmount: 0, message: check.message });
    }

    const discountAmount = computeDiscountAmount(coupon, cartTotal);
    return res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      // `discount` kept for the legacy percent-based CartContext; flat coupons report 0.
      discount: coupon.type === "percent" ? Number(coupon.value) || 0 : 0,
      discountAmount,
      message: "Applied",
    });
  } catch (err) {
    return next(err instanceof ApiError ? err : err);
  }
});

/**
 * GET /founding-status — public, real-time founding-program status (no auth).
 * The welcome coupon IS the ₹200 founding discount, capped at WELCOME_GLOBAL_LIMIT
 * globally. Returns how many of the founding slots have been redeemed + remain.
 */
router.get("/founding-status", async (req, res, next) => {
  try {
    const redeemed = await getWelcomeRedeemedCount();
    const limit = WELCOME_GLOBAL_LIMIT;
    res.json({ redeemed, limit, remaining: Math.max(0, limit - redeemed) });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

