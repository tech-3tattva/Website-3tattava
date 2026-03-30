const mongoose = require("mongoose");

const serviceablePincodeSchema = new mongoose.Schema(
  {
    pincode: { type: String, required: true, unique: true, index: true, trim: true },
    isActive: { type: Boolean, default: true },
    zoneLabel: { type: String, trim: true },
    etaDays: { type: Number, min: 1 },
  },
  { timestamps: true }
);

serviceablePincodeSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("ServiceablePincode", serviceablePincodeSchema);
