const mongoose = require("mongoose");

/**
 * Performance Assessment — a user's completed VaidyaConnect/assessment quiz.
 * Persists who filled it and their computed result so it shows on the user's
 * profile and in the admin panel. name/email/phone are denormalised from the
 * User at save time so the admin table needs no join.
 */

const ritualSchema = new mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    tagline: { type: String },
    why: { type: String },
  },
  { _id: false }
);

const answerSchema = new mongoose.Schema(
  {
    id: { type: String },
    question: { type: String },
    answer: { type: String },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    phone: { type: String },

    stage: { type: String }, // Balance | Build | Become
    sanskrit: { type: String },
    stageLine: { type: String },
    energyScore: { type: Number },
    recoveryScore: { type: Number },

    ritual: ritualSchema,
    other: ritualSchema,
    answers: { type: [answerSchema], default: [] },

    source: { type: String, default: "assessment" },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

assessmentSchema.index({ createdAt: -1 });

assessmentSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
