"use strict";

/**
 * /api/welcome — the per-user ₹200 welcome offer.
 *
 * GET  /api/welcome        → current user's offer (lazily issues one if missing)
 * POST /api/welcome/claim  → idempotent claim (explicit "claim my code" action)
 *
 * Both require a logged-in user. The offer view includes the unique code and its
 * used/unused state so the homepage notification can render the right message.
 */

const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getWelcomeCoupon } = require("../utils/welcomeCoupon");

const router = express.Router();

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const offer = await getWelcomeCoupon(req.user.id);
    if (!offer) return res.status(404).json({ message: "No offer available" });
    return res.json({ offer });
  } catch (err) {
    return next(err);
  }
});

router.post("/claim", verifyToken, async (req, res, next) => {
  try {
    const offer = await getWelcomeCoupon(req.user.id);
    if (!offer) return res.status(404).json({ message: "No offer available" });
    return res.json({ offer, claimed: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
