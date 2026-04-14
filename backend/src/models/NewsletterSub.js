const mongoose = require("mongoose");

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String },
    source: { type: String, enum: ["homepage", "education", "footer", "checkout", "dosha-quiz"] },
    doshaInterest: { type: String },
    isActive: { type: Boolean, default: true },
    unsubscribeToken: { type: String },
  },
  { timestamps: true }
);

newsletterSubscriberSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);

