"use strict";
const mongoose = require("mongoose");

/**
 * Two-tier influencer:
 *   tier = "micro"  → owns their own code + can have nano children
 *   tier = "nano"   → belongs to a micro parent; has their own sub-code
 */
const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true }, // E.164: 91XXXXXXXXXX
    email: { type: String, lowercase: true, trim: true },

    tier: { type: String, enum: ["micro", "nano"], required: true },

    // nano-only: reference to parent micro influencer
    parentInfluencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      default: null,
    },

    // Root promo code string owned by this influencer (PRIYA, PRIYA-A, etc.)
    promoCode: { type: String, required: true, uppercase: true, trim: true },

    whatsappOptIn: { type: Boolean, default: false },

    deal: {
      discountPercent: { type: Number, required: true }, // 20 for micro, 15 for nano
      goalRedemptions: { type: Number, default: 0 }, // e.g. 50 → trigger reward
      rewardStatus: {
        type: String,
        enum: ["none", "pending", "earned", "fulfilled"],
        default: "none",
      },
      rewardNote: { type: String }, // e.g. "₹5000 bank transfer"
    },

    counters: {
      // Redemptions from this influencer's own code only
      directRedemptions: { type: Number, default: 0 },
      directRevenue: { type: Number, default: 0 },

      // micro-only: aggregated from all nano children
      rollupRedemptions: { type: Number, default: 0 },
      rollupRevenue: { type: Number, default: 0 },
    },

    status: { type: String, enum: ["active", "paused", "banned"], default: "active" },
  },
  { timestamps: true }
);

influencerSchema.index({ promoCode: 1 }, { unique: true });
influencerSchema.index({ tier: 1, status: 1 });
influencerSchema.index({ parentInfluencerId: 1 });

influencerSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Influencer", influencerSchema);
