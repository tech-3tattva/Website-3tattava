"use strict";
const mongoose = require("mongoose");

/**
 * Redemption — one document per successful payment capture event.
 *
 * Idempotency: eventId has a unique index.
 * The webhook handler inserts with this field; duplicate events get
 * an E11000 → caught and silently ignored.
 */
const redemptionSchema = new mongoose.Schema(
  {
    // Cashfree webhook event id (cf_payment_id) — dedup key
    eventId: { type: String, required: true },

    // Cashfree order + payment IDs from the webhook payload
    providerOrderId: { type: String, required: true },
    providerPaymentId: { type: String, required: true },

    // Internal order reference
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    orderNumber: { type: String },

    // Promo code used
    code: { type: String, uppercase: true },
    discountPercent: { type: Number, default: 0 },

    // Influencer attribution
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      default: null,
    },

    // Denormalised: parent micro influencer (for rollup queries on micro docs)
    parentInfluencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      default: null,
    },

    // Financial amounts in rupees
    grossAmount: { type: Number, required: true }, // before discount
    discountAmount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true }, // what Cashfree actually captured

    status: {
      type: String,
      enum: ["completed", "refunded"],
      default: "completed",
    },

    refundedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Idempotency — duplicate event → E11000, caught in webhook handler
redemptionSchema.index({ eventId: 1 }, { unique: true });
redemptionSchema.index({ code: 1, createdAt: -1 });
redemptionSchema.index({ influencerId: 1, createdAt: -1 });
redemptionSchema.index({ parentInfluencerId: 1, createdAt: -1 });
redemptionSchema.index({ providerOrderId: 1 });

redemptionSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Redemption", redemptionSchema);
