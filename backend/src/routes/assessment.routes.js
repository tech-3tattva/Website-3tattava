"use strict";

/**
 * /api/assessments — performance-assessment submissions.
 *
 * POST /api/assessments        (auth) — save the current user's assessment result
 * GET  /api/assessments/mine   (auth) — the user's latest assessment (for their profile)
 *
 * The assessment quiz is gated behind purchase (logged-in users only), so these
 * are user-authed. Admin listing lives at GET /api/admin/assessments.
 */

const express = require("express");
const { z } = require("zod");

const Assessment = require("../models/Assessment");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

const ritualSchema = z
  .object({
    name: z.string().optional(),
    slug: z.string().optional(),
    tagline: z.string().optional(),
    why: z.string().optional(),
  })
  .partial()
  .optional();

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const schema = z.object({
      stage: z.string().min(1),
      sanskrit: z.string().optional(),
      stageLine: z.string().optional(),
      energyScore: z.number().optional(),
      recoveryScore: z.number().optional(),
      ritual: ritualSchema,
      other: ritualSchema,
      answers: z
        .array(
          z.object({
            id: z.string().optional(),
            question: z.string().optional(),
            answer: z.string().optional(),
          })
        )
        .optional(),
      source: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const user = await User.findById(req.user.id).exec();
    if (!user) throw new ApiError(401, "User not found");

    const assessment = await Assessment.create({
      user: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      stage: data.stage,
      sanskrit: data.sanskrit,
      stageLine: data.stageLine,
      energyScore: data.energyScore,
      recoveryScore: data.recoveryScore,
      ritual: data.ritual,
      other: data.other,
      answers: data.answers || [],
      source: data.source || "assessment",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(201).json({ assessment });
  } catch (err) {
    if (err instanceof z.ZodError) return next(new ApiError(400, err.issues[0]?.message || "Invalid assessment"));
    return next(err);
  }
});

router.get("/mine", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).exec();
    const orFilter = [{ user: req.user.id }];
    if (user?.email) orFilter.push({ email: user.email.toLowerCase() });

    const assessments = await Assessment.find({ $or: orFilter })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    return res.json({ assessments, latest: assessments[0] || null });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
