const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String },
    sanskritName: { type: String },
    benefit: { type: String },
    sourceRegion: { type: String },
    iconUrl: { type: String },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },

    category: { type: String, required: true, index: true },
    categoryLabel: { type: String, required: true },

    price: { type: Number, required: true }, // RUPEES (not paise)
    mrp: { type: Number },

    images: { type: [String], default: [] }, // string[] URLs

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    badge: { type: String, enum: ["Best Seller", "New", "20% Off"], default: undefined },

    dosha: {
      type: [String],
      enum: ["Vata", "Pitta", "Kapha"],
      default: [],
    },

    vataPct: { type: Number, default: 0 },
    pittaPct: { type: Number, default: 0 },
    kaphaPct: { type: Number, default: 0 },

    shortDescription: { type: String },
    description: { type: String },
    ingredients: { type: [ingredientSchema], default: [] },
    howToUse: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },

    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    sku: { type: String, unique: true },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isGiftable: { type: Boolean, default: false },

    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ dosha: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: "text", shortDescription: "text" });

productSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Product", productSchema);

