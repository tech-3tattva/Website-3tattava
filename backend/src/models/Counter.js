const mongoose = require("mongoose");

/**
 * Atomic named sequences.
 *
 * Invoice numbers have to be unique and gap-free enough to defend at a GST
 * audit, so they cannot be derived by counting existing invoices: two orders
 * paid in the same instant would both count N and both claim N+1. A single
 * findOneAndUpdate with $inc is atomic in MongoDB, so each caller gets a
 * distinct number even under concurrent checkouts.
 *
 * One document per series per financial year, e.g. `invoice:3TW:26-27`, so a
 * new year starts cleanly at 1 without touching the previous year's counter.
 */
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

/**
 * Returns the next value for `key`, creating the counter on first use.
 *
 * Deliberately called only once a payment is captured. Allocating at checkout
 * would burn a number on every abandoned attempt and leave visible gaps in the
 * series, which is exactly what an auditor asks about.
 */
counterSchema.statics.next = async function next(key) {
  const doc = await this.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();
  return doc.seq;
};

/** Reads a counter without consuming a number. For reporting only. */
counterSchema.statics.peek = async function peek(key) {
  const doc = await this.findById(key).lean().exec();
  return doc?.seq ?? 0;
};

module.exports = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
