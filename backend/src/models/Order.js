const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productId: { type: String, required: true }, // serialized id for frontend
    name: { type: String, required: true },
    image: { type: String },
    slug: { type: String },
    price: { type: Number, required: true }, // rupees
    mrp: { type: Number },
    quantity: { type: Number, required: true },
    variant: { type: String },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    title: { type: String, enum: ["Mr.", "Mrs.", "Ms.", "Dr."] },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true, required: true }, // 3T-{timestamp}
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    guestEmail: { type: String },

    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },

    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    coupon: {
      code: { type: String },
      discount: { type: Number }, // percent
    },

    shippingMethod: { type: String, enum: ["standard", "express", "free"], default: "standard" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: { type: [statusHistorySchema], default: [] },

    payment: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      method: { type: String },
      status: { type: String, enum: ["pending", "captured", "failed"], default: "pending" },
      capturedAt: { type: Date },
    },

    tracking: {
      courierName: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: String },
    },

    giftBox: { type: Boolean, default: false },
    giftMessage: { type: String },
    wellnessClub: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

orderSchema.index({ orderNumber: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);

