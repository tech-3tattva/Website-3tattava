const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled", "no-show", "rescheduled"],
      default: "confirmed",
      index: true,
    },

    doctor: {
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
      name: { type: String, required: true },
      clinic: { type: String, required: true },
    },

    patient: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      age: { type: Number, required: true },
      gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], default: "prefer-not-to-say" },
    },

    appointment: {
      date: { type: String, required: true, index: true },
      timeSlot: { type: String, required: true },
      endTime: { type: String, required: true },
      type: { type: String, enum: ["in-clinic", "online"], default: "in-clinic" },
      fee: { type: Number, required: true },
      healthConcern: { type: String, default: "" },
      isFirstAyurvedaVisit: { type: Boolean, default: false },
      meetLink: { type: String, default: "" },
      isFreeConsultation: { type: Boolean, default: false },
    },

    // Prakriti (body-type) intake — collected for online consultations.
    prakriti: {
      healthGoal: { type: String, default: "" },
      primaryConcern: { type: String, default: "" },
      bodyFrame: { type: String, default: "" },
      appetite: { type: String, default: "" },
      digestion: { type: String, default: "" },
      sleep: { type: String, default: "" },
      energyPattern: { type: String, default: "" },
      bowelMovement: { type: String, default: "" },
      dietPreference: { type: String, default: "" },
      activityLevel: { type: String, default: "" },
      currentMedications: { type: String, default: "" },
      notes: { type: String, default: "" },
    },

    notifications: {
      patientConfirmation: {
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
      },
      doctorNotification: {
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
      },
      reminderSent: {
        patient24hr: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
      },
      postVisitSent: {
        reviewRequest: { type: Boolean, default: false },
        productRecommendation: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
      },
    },

    review: {
      rating: { type: Number, min: 1, max: 5, default: null },
      text: { type: String, default: "" },
      createdAt: { type: Date, default: null },
      isVerified: { type: Boolean, default: false },
    },

    source: {
      type: String,
      enum: ["website", "instagram", "whatsapp", "referral"],
      default: "website",
    },
  },
  { timestamps: true },
);

// Prevent double-booking: one confirmed booking per doctor + date + timeSlot.
bookingSchema.index(
  { "doctor.doctorId": 1, "appointment.date": 1, "appointment.timeSlot": 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
