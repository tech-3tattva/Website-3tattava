const express = require("express");
const { z } = require("zod");

const Address = require("../models/Address");
const { verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

const addressSchema = z.object({
  title: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(10),
  line1: z.string().min(1),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
  country: z.string().min(1).default("India"),
  isDefault: z.boolean().optional(),
  label: z.enum(["Home", "Work", "Other"]).optional(),
});

async function unsetExistingDefault(userId, excludeId) {
  const filter = { user: userId, isDefault: true };
  if (excludeId) filter._id = { $ne: excludeId };
  await Address.updateMany(filter, { $set: { isDefault: false } });
}

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort({ isDefault: -1, updatedAt: -1 })
      .exec();
    return res.json(addresses);
  } catch (err) {
    return next(err);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const parsed = addressSchema.parse(req.body);
    const hasAnyAddress = await Address.exists({ user: req.user.id });
    const shouldBeDefault = parsed.isDefault ?? !hasAnyAddress;

    if (shouldBeDefault) {
      await unsetExistingDefault(req.user.id);
    }

    const address = await Address.create({
      ...parsed,
      line2: parsed.line2 || undefined,
      user: req.user.id,
      isDefault: shouldBeDefault,
      country: parsed.country || "India",
      label: parsed.label || "Home",
    });

    return res.status(201).json(address);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const parsed = addressSchema.partial().parse(req.body);
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id }).exec();
    if (!address) throw new ApiError(404, "Address not found");

    if (parsed.isDefault) {
      await unsetExistingDefault(req.user.id, address._id);
    }

    Object.assign(address, {
      ...parsed,
      line2: parsed.line2 === "" ? undefined : parsed.line2,
    });

    await address.save();
    return res.json(address);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id }).exec();
    if (!address) throw new ApiError(404, "Address not found");

    const wasDefault = address.isDefault;
    await Address.deleteOne({ _id: address._id });

    if (wasDefault) {
      const nextDefault = await Address.findOne({ user: req.user.id }).sort({ updatedAt: -1 }).exec();
      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

