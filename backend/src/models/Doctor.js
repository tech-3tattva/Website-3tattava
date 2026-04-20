const mongoose = require("mongoose");

const workingDaySchema = new mongoose.Schema(
  {
    closed: { type: Boolean, default: false },
    from: { type: String },
    to: { type: String },
    breakFrom: { type: String, default: null },
    breakTo: { type: String, default: null },
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "active", "suspended", "rejected"],
      default: "pending",
      index: true,
    },

    // Personal
    personal: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      photo: { type: String, default: "" },
      gender: { type: String, enum: ["male", "female", "other"], default: "male" },
    },

    // Qualifications
    qualifications: {
      degree: {
        type: String,
        enum: ["BAMS", "MD Ayurveda", "BNYS", "Yoga & Naturopathy", "Other"],
        required: true,
      },
      university: { type: String, required: true },
      graduationYear: { type: Number },
      registrationNumber: { type: String, required: true },
      registrationBoard: { type: String },
      registrationCertificate: { type: String },
      degreeCertificate: { type: String },
      yearsOfPractice: { type: Number, default: 0 },
      verifiedAt: { type: Date, default: null },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },

    // Clinic
    clinic: {
      name: { type: String, required: true },
      address: {
        line1: { type: String, required: true },
        line2: { type: String, default: "" },
        area: { type: String, required: true, index: true },
        city: { type: String, required: true },
        state: { type: String, default: "Delhi" },
        pincode: { type: String, required: true },
      },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
      googleMapsLink: { type: String, default: "" },
      photos: [{ type: String }],
      inspectedAt: { type: Date, default: null },
      inspectedBy: { type: String, default: null },
    },

    // Practice
    practice: {
      specializations: [{ type: String }],
      languages: [{ type: String }],
      consultationFee: {
        inClinic: { type: Number, required: true },
        online: { type: Number, default: null },
      },
      offersOnline: { type: Boolean, default: false },
      bio: { type: String, default: "" },
    },

    // Working hours
    workingHours: {
      monday: workingDaySchema,
      tuesday: workingDaySchema,
      wednesday: workingDaySchema,
      thursday: workingDaySchema,
      friday: workingDaySchema,
      saturday: workingDaySchema,
      sunday: workingDaySchema,
    },

    // Slot configuration
    slotConfig: {
      durationMinutes: { type: Number, default: 30 },
      bufferMinutes: { type: Number, default: 0 },
      maxAdvanceBookingDays: { type: Number, default: 30 },
      autoConfirm: { type: Boolean, default: true },
    },

    // Ratings (denormalized for fast reads)
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      breakdown: {
        "5": { type: Number, default: 0 },
        "4": { type: Number, default: 0 },
        "3": { type: Number, default: 0 },
        "2": { type: Number, default: 0 },
        "1": { type: Number, default: 0 },
      },
    },

    // Co-branding kit tracking
    coBranding: {
      kitShipped: { type: Boolean, default: false },
      kitShippedAt: { type: Date, default: null },
      prescriptionPadCount: { type: Number, default: 0 },
      posterInstalled: { type: Boolean, default: false },
      standeeInstalled: { type: Boolean, default: false },
      lastRefillRequestAt: { type: Date, default: null },
    },

    // Analytics (denormalized)
    analytics: {
      totalBookings: { type: Number, default: 0 },
      bookingsThisMonth: { type: Number, default: 0 },
      profileViews: { type: Number, default: 0 },
      profileViewsThisMonth: { type: Number, default: 0 },
    },

    // Admin notes (rejection reason, etc.)
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

doctorSchema.index({ "clinic.location": "2dsphere" });
doctorSchema.index({ "practice.specializations": 1 });
doctorSchema.index({ "clinic.address.city": 1, status: 1 });

module.exports = mongoose.model("Doctor", doctorSchema);
