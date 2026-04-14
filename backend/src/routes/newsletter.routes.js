const express = require("express");
const crypto = require("crypto");
const { z } = require("zod");

const NewsletterSubscriber = require("../models/NewsletterSub");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1).optional(),
      source: z
        .enum(["homepage", "education", "footer", "checkout", "dosha-quiz"])
        .optional(),
      doshaInterest: z.string().min(1).optional(),
    });

    const { email, name, source, doshaInterest } = schema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail }).exec();

    if (existing) {
      existing.isActive = true;
      if (name) existing.name = name;
      if (source) existing.source = source;
      if (doshaInterest) existing.doshaInterest = doshaInterest;
      await existing.save();
      return res.json({ ok: true, message: "You are already subscribed." });
    }

    await NewsletterSubscriber.create({
      email: normalizedEmail,
      name,
      source: source || "footer",
      doshaInterest,
      isActive: true,
      unsubscribeToken: crypto.randomBytes(16).toString("hex"),
    });

    return res.status(201).json({ ok: true, message: "Subscription successful." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, "Please enter a valid email address."));
    }
    return next(err);
  }
});

module.exports = router;
