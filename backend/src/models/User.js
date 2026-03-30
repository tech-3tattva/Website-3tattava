const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String },

    // Local auth only
    passwordHash: { type: String, default: null },

    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    isVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },

    doshaProfile: {
      primaryDosha: { type: String, enum: ["Vata", "Pitta", "Kapha"] },
      scores: {
        vata: { type: Number, default: 0 },
        pitta: { type: Number, default: 0 },
        kapha: { type: Number, default: 0 },
      },
      takenAt: { type: Date },
    },

    wellnessPoints: { type: Number, default: 0 },
    wellnessClub: { type: Boolean, default: false },

    refreshToken: { type: String },
    refreshTokenExp: { type: Date },

    verifyToken: { type: String },
    resetToken: { type: String },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    // Never leak sensitive fields to API responses
    delete ret.passwordHash;
    delete ret.refreshToken;
    delete ret.refreshTokenExp;
    delete ret.verifyToken;
    delete ret.resetToken;
  },
});

module.exports = mongoose.model("User", userSchema);

