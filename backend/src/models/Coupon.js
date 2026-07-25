const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, required: true, enum: ["percent", "flat"] },
    value: { type: Number, required: true },

    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },

    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },

    perUserLimit: { type: Number, default: 1 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },

    // Per-user "welcome" offer support. kind:"welcome" codes are owned by one
    // user and enforced single-use via usedBy/usedCount at validate + capture.
    kind: { type: String, enum: ["generic", "welcome"], default: "generic", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

couponSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Coupon", couponSchema);

