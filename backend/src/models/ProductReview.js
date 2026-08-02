const mongoose = require("mongoose");

/**
 * Customer-submitted PRODUCT reviews (separate from the doctor/booking Review model).
 * Powers the on-PDP star rating + review list. Reviews are only ever created from
 * real customer submissions — never seeded/fabricated — so a product with no
 * submissions shows a clean empty state (average 0, count 0).
 */
const productReviewSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, index: true, trim: true }, // Product.slug

    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true },
    body: { type: String, required: true, trim: true },

    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, lowercase: true, trim: true },

    // Set true only when a captured Order for this email contains this product.
    verifiedBuyer: { type: Boolean, default: false },

    photos: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["pending", "approved", "hidden"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// Primary read path: approved reviews for a slug, newest first.
productReviewSchema.index({ slug: 1, status: 1, createdAt: -1 });

productReviewSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.authorEmail; // never expose reviewer email
  },
});

module.exports = mongoose.model("ProductReview", productReviewSchema);
