// Idempotent upsert for the Founding Bundle Pack product.
// Safe to re-run: matches by slug, touches only this one product.
//   node src/scripts/add-bundle-product.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const Product = require("../models/Product");

const BUNDLE = {
  slug: "founding-bundle-pack",
  sku: "founding-bundle-pack",
  name: "FOUNDING BUNDLE PACK",
  category: "shilajit",
  categoryLabel: "BUNDLE",
  price: 2398,
  mrp: 2998,
  images: ["https://media.3tattava.com/products/Boxess%20copy%201.png"],
  shortDescription: "RockResin® resin + Shahjeet® honey sticks — the complete Balance · Build · Become ritual in one pack.",
  description:
    "The Founding Bundle Pack brings the full 3TATTAVA ritual together: one RockResin® 20g classically-purified Shilajit resin jar (40–50 daily servings) and one box of 30 Shahjeet® honey sticks (600mg purified Shilajit each). Save ₹600 vs buying separately; founding members (first 200) pay ₹2,198 with the welcome code.",
  stockQuantity: 100,
  lowStockThreshold: 10,
  isActive: true,
  isFeatured: true,
  isBundle: true,
  bundleItems: [
    { slug: "shodhit-shilajit-resin", name: "RockResin® 20g Resin Jar", unit: "20g jar (40–50 servings)", quantity: 1 },
    { slug: "shahjeet-sticks", name: "Shahjeet® Honey Sticks", unit: "30 sticks · 600mg each", quantity: 1 },
  ],
};

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await Product.updateOne({ slug: BUNDLE.slug }, { $set: BUNDLE }, { upsert: true });
  const saved = await Product.findOne({ slug: BUNDLE.slug }).lean();
  console.log("[bundle] upsert:", JSON.stringify({ matched: res.matchedCount, upserted: res.upsertedCount, modified: res.modifiedCount }));
  console.log("[bundle] product:", JSON.stringify({
    id: String(saved._id), slug: saved.slug, sku: saved.sku, price: saved.price, mrp: saved.mrp,
    stock: saved.stockQuantity, isActive: saved.isActive, isBundle: saved.isBundle,
    bundleItems: saved.bundleItems,
  }, null, 2));
  await mongoose.disconnect();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });
