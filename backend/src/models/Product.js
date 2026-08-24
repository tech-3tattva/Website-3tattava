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

    // GST classification, used to build the tax breakup on an invoice.
    //
    // Default is HSN 30049011 at 12%: heading 3004 covers Ayurvedic medicaments
    // in retail packs, and the Telangana AAR (Incnut Lifestyle Retail,
    // TSAAR 46/2022) held that products made under an AYUSH licence and used
    // for cure -- rather than cosmetic "care" -- are medicaments at 12%. These
    // products are sold as Ayurvedic proprietary medicines under a valid
    // Ayurveda manufacturing licence, which is that test.
    //
    // Editable per product precisely because it is a tax position, not a
    // constant: a reclassification must be a field change, never a code change.
    hsnCode: { type: String, default: "30049011", trim: true },
    gstRatePercent: { type: Number, default: 12, min: 0, max: 28 },
    // Prices are shown to customers as "inclusive of all taxes", so tax is
    // back-calculated out of `price` rather than added on top. Flip this only
    // if the storefront copy changes too.
    priceIncludesGst: { type: Boolean, default: true },

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

    // Bundle products (e.g. Founding Bundle Pack) — composition + units.
    isBundle: { type: Boolean, default: false },
    bundleItems: {
      type: [
        new mongoose.Schema(
          { slug: { type: String }, name: { type: String }, unit: { type: String }, quantity: { type: Number, default: 1 } },
          { _id: false }
        ),
      ],
      default: [],
    },

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

