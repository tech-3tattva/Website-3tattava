const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    body: { type: String, required: true },

    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },

    helpful: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });

reviewSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Review", reviewSchema);

