const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true }, // rupees
    mrp: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String },
    slug: { type: String },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    // Omit `user` entirely for guest carts. Storing `user: null` breaks unique indexes:
    // MongoDB indexes null and only one guest cart could exist (E11000 dup key { user: null }).
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestId: { type: String },

    items: { type: [cartItemSchema], default: [] },
    coupon: {
      code: { type: String },
      discount: { type: Number }, // percent
    },

    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

// At most one cart per logged-in user; guest docs without `user` are not in this index.
cartSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { user: { $type: "objectId" } },
  }
);
cartSchema.index({ guestId: 1 }, { sparse: true });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

cartSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Cart", cartSchema);

