"use strict";
const mongoose = require("mongoose");

/**
 * Redemption — one document per successful payment.captured event.
 *
 * Idempotency: razorpayEventId has a unique index.
 * The webhook handler inserts with this field; duplicate events get
 * an E11000 → caught and silently ignored.
 */
const redemptionSchema = new mongoose.Schema(
  {
    // Razorpay x-razorpay-event-id header — dedup key
    razorpayEventId: { type: String, required: true },

    // Razorpay order + payment IDs from the webhook payload
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },

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
    netAmount: { type: Number, required: true }, // what Razorpay actually captured / 100

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
redemptionSchema.index({ razorpayEventId: 1 }, { unique: true });
redemptionSchema.index({ code: 1, createdAt: -1 });
redemptionSchema.index({ influencerId: 1, createdAt: -1 });
redemptionSchema.index({ parentInfluencerId: 1, createdAt: -1 });
redemptionSchema.index({ razorpayOrderId: 1 });

redemptionSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Redemption", redemptionSchema);
