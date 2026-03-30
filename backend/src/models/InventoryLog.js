const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    changeType: {
      type: String,
      enum: ["restock", "sale", "adjustment", "return", "damage"],
      required: true,
    },

    quantityBefore: { type: Number },
    quantityChange: { type: Number },
    quantityAfter: { type: Number },

    reason: { type: String },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });
inventoryLogSchema.index({ orderId: 1 }, { sparse: true });

inventoryLogSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);

