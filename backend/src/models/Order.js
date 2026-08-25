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
      provider: { type: String, default: "cashfree" },
      method: { type: String },
      status: { type: String, enum: ["pending", "captured", "failed"], default: "pending" },
      capturedAt: { type: Date },
      cashfree: {
        orderId: { type: String },
        paymentSessionId: { type: String },
        cfPaymentId: { type: String },
      },
    },

    tracking: {
      courierName: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: String },
    },

    // NimbusPost shipment data (populated after payment captured)
    shipment: {
      awbNumber: { type: String },
      shipmentId: { type: String },
      nimbusOrderId: { type: String },
      courierName: { type: String },
      labelUrl: { type: String },
      paymentType: { type: String, enum: ["prepaid", "cod"], default: "prepaid" },
      nimbusStatus: { type: String },
      checkpoints: [
        {
          status: String,
          location: String,
          timestamp: Date,
          remarks: String,
          _id: false,
        },
      ],
      createdAt: { type: Date },
      lastTrackedAt: { type: Date },
    },

    // Influencer referral attribution
    promoCode: {
      code: { type: String },
      influencerId: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
      parentInfluencerId: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
      discountPercent: { type: Number, default: 0 },
    },

    // Paid-ad attribution captured at checkout (mirrors the Waitlist model shape).
    attribution: {
      utm_source: { type: String },
      utm_medium: { type: String },
      utm_campaign: { type: String },
      utm_content: { type: String },
      utm_term: { type: String },
      fbclid: { type: String },
      fbc: { type: String },
      fbp: { type: String },
      referrer: { type: String },
      landing_path: { type: String },
    },

    giftBox: { type: Boolean, default: false },
    giftMessage: { type: String },
    wellnessClub: { type: Boolean, default: false },

    // Post-purchase product-review request emails (see scripts/send-review-requests.js).
    reviewEmail7Sent: { type: Boolean, default: false },
    reviewEmail21Sent: { type: Boolean, default: false },

    // Where the order came from. "website" is a normal customer checkout;
    // "offline-admin" is a phone/WhatsApp/in-person order keyed in by staff;
    // "nimbuspost-import" is a historical record back-filled from the courier
    // panel. Keeping this explicit is what stops manual orders disappearing
    // from reporting the way the pre-launch ones did.
    source: {
      type: String,
      enum: ["website", "offline-admin", "nimbuspost-import"],
      default: "website",
      index: true,
    },
    // Doctor/influencer seeding: shipped at zero value, must never count as revenue.
    isSample: { type: Boolean, default: false },
    // Real money moved (so the accountant still needs the record) but it was a
    // gateway/flow test, not a customer sale. Everything before the 29 Jul 2026
    // launch falls here. Excluded from revenue reporting alongside samples.
    isTest: { type: Boolean, default: false },
    // Admin email that created an offline order (the website has no other audit trail).
    createdByAdmin: { type: String },
    adminNote: { type: String },

    // ── Tax invoice ───────────────────────────────────────────────────────
    // Issued once, when payment is captured. The figures are stored rather
    // than recomputed on read: an invoice is a legal document, so it must keep
    // showing what it showed when it was issued even if a product's rate or
    // price changes afterwards.
    invoice: {
      // Website's own series (3TW/26-27/NNNN), separate from the series typed
      // by hand in Tally, so B2B entry can never collide with it.
      // Index declared once at the bottom as unique+sparse. Adding
      // `index: true` here too creates a second, non-unique index with the
      // same auto-generated name, and syncIndexes then refuses both.
      number: { type: String },
      issuedAt: { type: Date },
      placeOfSupply: { type: String },
      supplyType: { type: String, enum: ["intra", "inter"] },
      taxableValue: { type: Number },
      cgst: { type: Number },
      sgst: { type: Number },
      igst: { type: Number },
      totalTax: { type: Number },
      // Snapshot of rate and HSN per line at the moment of issue.
      lines: {
        type: [
          {
            _id: false,
            name: String,
            hsnCode: String,
            ratePercent: Number,
            quantity: Number,
            taxableValue: Number,
            cgst: Number,
            sgst: Number,
            igst: Number,
          },
        ],
        default: undefined,
      },
    },

    // ── Customer confirmation email ───────────────────────────────────────
    // Set when the single "order confirmed + tax invoice" email has gone out.
    //
    // Needed because a captured payment is announced twice: the browser calls
    // verify-cashfree when the customer is redirected back, and Cashfree also
    // POSTs the webhook. Both used to send their own confirmation from
    // different templates, so whichever arrived second produced a duplicate.
    // Claimed atomically, so a webhook retry cannot send a second copy.
    confirmationSentAt: { type: Date },
    confirmationMessageId: { type: String },

    // ── Tally hand-off ────────────────────────────────────────────────────
    // Set when the order has been included in a downloaded Tally file. Without
    // this an export would re-send orders already in the books and double-count
    // revenue -- the historical orders were keyed in by hand, so several are
    // already there.
    tallyExportedAt: { type: Date },
    tallyBatchId: { type: String, index: true },
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
// Two invoices sharing a number is a GST defect, so the database refuses it
// rather than trusting application code. Sparse: most orders (unpaid, abandoned)
// never get an invoice, and a unique index would otherwise collide on null.
orderSchema.index({ "invoice.number": 1 }, { unique: true, sparse: true });
// Drives the "not yet exported" query that builds each Tally batch.
orderSchema.index({ tallyExportedAt: 1, "invoice.issuedAt": 1 });

module.exports = mongoose.model("Order", orderSchema);

