const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    badgeNumber: { type: String, required: true, unique: true, index: true, trim: true },
    productSlug: { type: String, required: true, trim: true, index: true },
    reportUrl: { type: String, trim: true },
    batchCode: { type: String, trim: true },
    testedAt: { type: Date },
    summary: { type: String, trim: true },
  },
  { timestamps: true }
);

labReportSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("LabReport", labReportSchema);
