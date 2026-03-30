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

async function runCheck(pincode) {
  const normalized = pincodeSchema.parse(pincode);
  const row = await ServiceablePincode.findOne({ pincode: normalized, isActive: true }).lean().exec();

  if (!row) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "We do not deliver to this pincode yet. You can still place an order — our team may contact you.",
    };
  }

  const eta =
    row.etaDays != null
      ? `Estimated delivery in about ${row.etaDays} business day${row.etaDays === 1 ? "" : "s"}.`
      : undefined;

  return {
    serviceable: true,
    pincode: normalized,
    zoneLabel: row.zoneLabel || undefined,
    etaDays: row.etaDays ?? undefined,
    message: row.zoneLabel
      ? `Yes — we deliver to ${row.zoneLabel}.${eta ? ` ${eta}` : ""}`
      : `Yes — we deliver to this pincode.${eta ? ` ${eta}` : ""}`,
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
