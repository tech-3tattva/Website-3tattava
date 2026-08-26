const express = require("express");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

const ServiceablePincode = require("../models/ServiceablePincode");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

const checkLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many pincode checks. Try again shortly." },
});

const pincodeSchema = z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode");

// NimbusPost ships pan-India, so every valid Indian pincode is serviceable by
// default. The ServiceablePincode collection is now only for OVERRIDES: a row
// can set a custom ETA / zone label, or be marked isActive:false to explicitly
// exclude a pincode. No row = serviceable with the default ETA.
const DEFAULT_ETA_DAYS = 5;

async function runCheck(pincode) {
  const normalized = pincodeSchema.parse(pincode);
  const row = await ServiceablePincode.findOne({ pincode: normalized }).lean().exec();

  // Deliberate exclusion: an inactive row means "we don't ship here right now".
  if (row && row.isActive === false) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "We're unable to deliver to this pincode right now. You can still place an order — our team may contact you.",
    };
  }

  const etaDays = row?.etaDays ?? DEFAULT_ETA_DAYS;
  const eta = `Estimated delivery in about ${etaDays} business day${etaDays === 1 ? "" : "s"}.`;
  return {
    serviceable: true,
    pincode: normalized,
    zoneLabel: row?.zoneLabel || undefined,
    etaDays,
    message: row?.zoneLabel
      ? `Yes — we deliver to ${row.zoneLabel}. ${eta}`
      : `Yes — we deliver across India. ${eta}`,
  };
}

router.post("/check", checkLimiter, async (req, res, next) => {
  try {
    const body = z.object({ pincode: z.string() }).parse(req.body);
    const result = await runCheck(body.pincode);
    return res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, err.issues[0]?.message || "Invalid pincode"));
    }
    return next(err);
  }
});

router.get("/check", checkLimiter, async (req, res, next) => {
  try {
    const q = z.object({ pincode: z.string() }).parse(req.query);
    const result = await runCheck(q.pincode);
    return res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new ApiError(400, err.issues[0]?.message || "Invalid pincode"));
    }
    return next(err);
  }
});

module.exports = router;
