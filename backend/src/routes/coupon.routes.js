const express = require("express");
const { z } = require("zod");

const Coupon = require("../models/Coupon");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

router.post("/validate", async (req, res, next) => {
  try {
    const schema = z.object({
      code: z.string().min(1),
      cartTotal: z.number().positive(),
    });
    const { code, cartTotal } = schema.parse(req.body);

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase() }).exec();
    if (!coupon || !coupon.isActive) {
      return res.json({ valid: false, discount: 0, message: "Invalid coupon" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.json({ valid: false, discount: 0, message: "Coupon expired" });
    }

    if (cartTotal < (coupon.minOrderAmount || 0)) {
      return res.json({
        valid: false,
        discount: 0,
        message: `Minimum order amount is ${coupon.minOrderAmount}`,
      });
    }

    // For now, frontend CartContext uses percent-style discount.
    // Seeded coupon WELCOME15 is percent-based, so this matches existing UI logic.
    const discount = Number(coupon.value) || 0;
    return res.json({ valid: true, discount });
  } catch (err) {
    return next(err instanceof ApiError ? err : err);
  }
});

module.exports = router;

