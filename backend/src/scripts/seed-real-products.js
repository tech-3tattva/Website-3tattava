// Seeds ONLY the two live products (Shahjeet Sticks + Shodhit Shilajit Resin)
// so the order/checkout flow can resolve them and the shop reflects the real
// catalog. Run: `node src/scripts/seed-real-products.js`
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoose = require("mongoose");
const Product = require("../models/Product");
const { connectDb } = require("../config/db");

const products = [
  {
    slug: "shahjeet-sticks",
    name: "SHAHJEET STICKS",
    category: "shilajit",
    categoryLabel: "HONEY STICKS",
    price: 1399,
    mrp: 1599,
    images: ["/hero/shahjeet-product.png"],
    rating: 4.8,
    reviewCount: 218,
    shortDescription:
      "600mg pure Himalayan Shilajit per honey stick, Triphala-purified and NABL lab-tested. Tear. Squeeze. Perform.",
    stockQuantity: 150,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "shodhit-shilajit-resin",
    name: "SHODHIT SHILAJIT RESIN",
    category: "shilajit",
    categoryLabel: "SHILAJIT RESIN",
    price: 1299,
    mrp: 1499,
    images: ["https://media.3tattava.com/products/Rockresin-hero.jpeg"],
    rating: 4.9,
    reviewCount: 312,
    shortDescription:
      "Classical Triphala-Shodhit Himalayan Shilajit resin, ≥70% fulvic acid, AYUSH-GMP + NABL certified.",
    stockQuantity: 100,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
  },
];

async function run() {
  await connectDb();
  for (const p of products) {
    await Product.updateOne(
      { slug: p.slug },
      { $set: { ...p, sku: p.slug } },
      { upsert: true }
    );
    // eslint-disable-next-line no-console
    console.log("upserted", p.slug);
  }
  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log("[backend] real-products seed completed");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[backend] real-products seed failed:", err);
    process.exit(1);
  });
