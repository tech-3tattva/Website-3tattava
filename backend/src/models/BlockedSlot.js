const mongoose = require("mongoose");

const blockedSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    slots: [{ type: String }],
    reason: {
      type: String,
      enum: ["personal", "leave", "emergency", "holiday"],
      default: "personal",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

blockedSlotSchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("BlockedSlot", blockedSlotSchema);
