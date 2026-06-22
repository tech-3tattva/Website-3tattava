"use strict";
const mongoose = require("mongoose");

/**
 * PromoCode — separate from the existing Coupon model.
 * Coupons are generic discount codes (flat/percent, any order).
 * PromoCodes are influencer-owned attribution codes.
 *
 * codeType:
 *   "micro"  — root code for a micro influencer (e.g. PRIYA)
 *   "nano"   — child code for a nano influencer  (e.g. PRIYA-A)
 *   "admin"  — manually created campaign code with no influencer
 */
const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true },

    codeType: {
      type: String,
      enum: ["micro", "nano", "admin"],
      required: true,
    },

    // nano codes point to their parent micro code string
    parentCode: { type: String, uppercase: true, trim: true, default: null },

    // The influencer who owns this code
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      default: null,
    },

    // Denormalised for fast rollup queries
    parentInfluencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      default: null,
    },

    discountPercent: { type: Number, required: true, min: 0, max: 100 },

    maxRedemptions: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },

    expiresAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["active", "paused", "expired", "exhausted"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Case-insensitive unique index on code
promoCodeSchema.index({ code: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
promoCodeSchema.index({ influencerId: 1 });
promoCodeSchema.index({ parentInfluencerId: 1 });
promoCodeSchema.index({ status: 1 });

promoCodeSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
