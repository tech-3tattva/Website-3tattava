const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const bcrypt = require("bcryptjs");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const LabReport = require("../models/LabReport");
const ServiceablePincode = require("../models/ServiceablePincode");
const { connectDb } = require("../config/db");

async function seed() {
  await connectDb();

  // Categories are sourced from the existing frontend constants.
  const categories = [
    { name: "Skin Care", slug: "skin-care", color: "#E8DCC8" },
    { name: "Hair Care", slug: "hair-care", color: "#D4A574" },
    { name: "Body & Wellness", slug: "body-wellness", color: "#4A7C59" },
    { name: "Stress & Sleep", slug: "stress-sleep", color: "#2D5A3D" },
    { name: "Digestion", slug: "digestion", color: "#E8C99A" },
    { name: "Immunity", slug: "immunity", color: "#F5EFE6" },
    { name: "Women's Health", slug: "womens-health", color: "#E2D9CE" },
    { name: "Gift Sets", slug: "gift-sets", color: "#FAF7F2" },
  ];

  for (const cat of categories) {
    await Category.updateOne(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          slug: cat.slug,
          color: cat.color,
          imageUrl: "/placeholder.svg",
          sortOrder: 0,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  const placeholderProducts = [
    {
      id: "1",
      slug: "kumkumadi-serum",
      name: "Kumkumadi Revitalizing Face Serum",
      category: "skin-care",
      categoryLabel: "FACE SERUM",
      price: 2499,
      mrp: 2999,
      image: "/placeholder.svg",
      rating: 4.8,
      reviewCount: 33,
      badge: "Best Seller",
      dosha: ["Vata", "Pitta"],
    },
    {
      id: "2",
      slug: "ashwagandha-body-oil",
      name: "Ashwagandha Calming Body Oil",
      category: "body-wellness",
      categoryLabel: "BODY OIL",
      price: 899,
      image: "/placeholder.svg",
      rating: 4.6,
      reviewCount: 21,
      badge: "New",
      dosha: ["Vata"],
    },
    {
      id: "3",
      slug: "neem-face-wash",
      name: "Neem & Turmeric Purifying Face Wash",
      category: "skin-care",
      categoryLabel: "CLEANSER",
      price: 499,
      image: "/placeholder.svg",
      rating: 4.5,
      reviewCount: 48,
      dosha: ["Pitta", "Kapha"],
    },
    {
      id: "4",
      slug: "brahmi-hair-oil",
      name: "Brahmi Hair Growth Oil",
      category: "hair-care",
      categoryLabel: "HAIR OIL",
      price: 699,
      image: "/placeholder.svg",
      rating: 4.7,
      reviewCount: 29,
      badge: "20% Off",
      dosha: ["Vata", "Kapha"],
    },
    {
      id: "5",
      slug: "triphala-digestive",
      name: "Triphala Digestive Wellness Capsules",
      category: "body-wellness",
      categoryLabel: "WELLNESS",
      price: 599,
      image: "/placeholder.svg",
      rating: 4.4,
      reviewCount: 15,
      dosha: ["Pitta", "Kapha"],
    },
    {
      id: "6",
      slug: "sandalwood-face-pack",
      name: "Sandalwood & Rose Ubtan Face Pack",
      category: "skin-care",
      categoryLabel: "FACE PACK",
      price: 749,
      image: "/placeholder.svg",
      rating: 4.9,
      reviewCount: 42,
      badge: "Best Seller",
      dosha: ["Vata", "Pitta", "Kapha"],
    },
    {
      id: "7",
      slug: "amla-hair-mask",
      name: "Amla & Hibiscus Hair Mask",
      category: "hair-care",
      categoryLabel: "HAIR CARE",
      price: 549,
      image: "/placeholder.svg",
      rating: 4.5,
      reviewCount: 18,
      dosha: ["Pitta"],
    },
    {
      id: "8",
      slug: "shilajit-energy",
      name: "Himalayan Shilajit Resin",
      category: "body-wellness",
      categoryLabel: "WELLNESS",
      price: 1999,
      image: "/placeholder.svg",
      rating: 4.8,
      reviewCount: 56,
      badge: "New",
      dosha: ["Vata", "Kapha"],
    },
    {
      id: "9",
      slug: "rose-face-mist",
      name: "Kannauj Rose Hydrating Face Mist",
      category: "skin-care",
      categoryLabel: "FACE MIST",
      price: 649,
      image: "/placeholder.svg",
      rating: 4.6,
      reviewCount: 24,
      dosha: ["Pitta", "Vata"],
    },
    {
      id: "10",
      slug: "vata-balance-oil",
      name: "Vata Balance Abhyanga Oil",
      category: "body-wellness",
      categoryLabel: "BODY OIL",
      price: 1299,
      image: "/placeholder.svg",
      rating: 4.7,
      reviewCount: 31,
      dosha: ["Vata"],
    },
    {
      id: "11",
      slug: "bhringraj-oil",
      name: "Bhringraj Hair Oil",
      category: "hair-care",
      categoryLabel: "HAIR OIL",
      price: 599,
      image: "/placeholder.svg",
      rating: 4.5,
      reviewCount: 27,
      dosha: ["Vata", "Pitta"],
    },
    {
      id: "12",
      slug: "turmeric-moisturizer",
      name: "Turmeric & Manjistha Glow Cream",
      category: "skin-care",
      categoryLabel: "MOISTURIZER",
      price: 899,
      image: "/placeholder.svg",
      rating: 4.6,
      reviewCount: 19,
      dosha: ["Pitta", "Kapha"],
    },
  ];

  for (const p of placeholderProducts) {
    const primaryDosha = Array.isArray(p.dosha) && p.dosha.length ? p.dosha[0] : undefined;

    const isFeatured = Number(p.id) <= 8;
    const vataPct = primaryDosha === "Vata" ? 100 : 0;
    const pittaPct = primaryDosha === "Pitta" ? 100 : 0;
    const kaphaPct = primaryDosha === "Kapha" ? 100 : 0;

    await Product.updateOne(
      { slug: p.slug },
      {
        $set: {
          slug: p.slug,
          sku: p.slug,
          name: p.name,
          category: p.category,
          categoryLabel: p.categoryLabel,
          price: p.price,
          mrp: p.mrp,
          images: [p.image],
          rating: p.rating,
          reviewCount: p.reviewCount,
          badge: p.badge,
          dosha: p.dosha || [],
          vataPct,
          pittaPct,
          kaphaPct,
          stockQuantity: 99,
          lowStockThreshold: 5,
          isActive: true,
          isFeatured,
        },
      },
      { upsert: true }
    );
  }

  const labReportSamples = [
    {
      badgeNumber: "3T-LAB-001",
      productSlug: "kumkumadi-serum",
      reportUrl: "https://www.w3.org/WAI/WCAG21/working-examples/pdf-note/note.pdf",
      batchCode: "BATCH-KK-2025-01",
      testedAt: new Date("2025-01-15"),
      summary:
        "Independent lab verification: identity and key actives within specification; heavy metals below regulatory limits.",
    },
    {
      badgeNumber: "3T-LAB-002",
      productSlug: "ashwagandha-body-oil",
      reportUrl: null,
      batchCode: "BATCH-AW-2025-03",
      testedAt: new Date("2025-03-01"),
      summary:
        "Batch tested for microbial limits and rancidity markers. Results on file — full PDF available on request via care@3tattva.com.",
    },
    {
      badgeNumber: "3T-LAB-003",
      productSlug: "neem-face-wash",
      reportUrl: "https://www.w3.org/WAI/WCAG21/working-examples/pdf-table/table.pdf",
      batchCode: "BATCH-NM-2024-12",
      testedAt: new Date("2024-12-10"),
      summary: "pH and preservative efficacy within label claims.",
    },
  ];

  for (const row of labReportSamples) {
    const setDoc = {
      badgeNumber: row.badgeNumber,
      productSlug: row.productSlug,
      batchCode: row.batchCode,
      testedAt: row.testedAt,
      summary: row.summary,
    };
    if (row.reportUrl) {
      setDoc.reportUrl = row.reportUrl;
    } else {
      setDoc.reportUrl = null;
    }
    await LabReport.updateOne({ badgeNumber: row.badgeNumber }, { $set: setDoc }, { upsert: true });
  }

  // Coupon: WELCOME15
  await Coupon.updateOne(
    { code: "WELCOME15" },
    {
      $set: {
        code: "WELCOME15",
        type: "percent",
        value: 15,
        minOrderAmount: 0,
        isActive: true,
        perUserLimit: 1,
        usedCount: 0,
      },
    },
    { upsert: true }
  );

  const samplePincodes = [
    { pincode: "110001", zoneLabel: "Delhi NCR", etaDays: 3 },
    { pincode: "201301", zoneLabel: "Noida / Ghaziabad", etaDays: 4 },
    { pincode: "560001", zoneLabel: "Bengaluru", etaDays: 5 },
    { pincode: "400001", zoneLabel: "Mumbai", etaDays: 4 },
    { pincode: "700001", zoneLabel: "Kolkata", etaDays: 5 },
  ];

  for (const row of samplePincodes) {
    await ServiceablePincode.updateOne(
      { pincode: row.pincode },
      {
        $set: {
          pincode: row.pincode,
          zoneLabel: row.zoneLabel,
          etaDays: row.etaDays,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  // Admin user (for later admin panel work)
  const adminEmail = "admin@3tattva.com";
  const adminPassword = "Admin@123";
  const existingAdmin = await User.findOne({ email: adminEmail }).exec();
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      email: adminEmail,
      name: "3Tattva Admin",
      passwordHash,
      role: "admin",
      isVerified: true,
      wellnessPoints: 0,
      wellnessClub: false,
    });
  }

  // eslint-disable-next-line no-console
  console.log("[backend] seed completed");
  await require("mongoose").disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[backend] seed failed:", err);
    process.exit(1);
  });

