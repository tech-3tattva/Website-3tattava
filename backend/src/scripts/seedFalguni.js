/**
 * Seed / upsert Dr. Falguni Chauhan as an active online-consultation doctor.
 * Run:  node src/scripts/seedFalguni.js
 * Notification email defaults to care@3tattava.com (verified via SES domain).
 * Change `personal.email` to Dr. Falguni's real inbox once known.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

const SLUG = "dr-falguni-chauhan";
const openDay = { closed: false, from: "10:00", to: "18:00", breakFrom: "13:00", breakTo: "14:00" };

const data = {
  slug: SLUG,
  status: "active",
  personal: {
    fullName: "Dr. Falguni Chauhan",
    phone: "+919999999999",
    email: process.env.CONSULT_NOTIFY_EMAIL || "care@3tattava.com",
    photo: "/team/dr-falguni-chauhan.jpg",
    gender: "female",
  },
  qualifications: {
    degree: "BAMS",
    university: "Gujarat Ayurved University",
    graduationYear: 2018,
    registrationNumber: "3T-FC-0001",
    registrationBoard: "Board of Ayurvedic & Unani Systems of Medicine",
    yearsOfPractice: 6,
  },
  clinic: {
    name: "3TATTAVA Online Clinic",
    address: {
      line1: "Online video consultation",
      area: "Online",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    location: { type: "Point", coordinates: [77.209, 28.6139] },
  },
  practice: {
    specializations: ["Prakriti Assessment", "Sports Nutrition", "Women's Wellness", "Gut Health"],
    languages: ["English", "Hindi"],
    consultationFee: { inClinic: 800, online: 800 },
    offersOnline: true,
    bio: "Ayurveda Dietician & Performance Nutrition Expert. First consultation is complimentary and includes a personalised Prakriti-based diet chart.",
  },
  workingHours: {
    monday: openDay,
    tuesday: openDay,
    wednesday: openDay,
    thursday: openDay,
    friday: openDay,
    saturday: openDay,
    sunday: { closed: true },
  },
  slotConfig: { durationMinutes: 30, bufferMinutes: 0, maxAdvanceBookingDays: 30, autoConfirm: true },
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI);
  const doc = await Doctor.findOneAndUpdate(
    { slug: SLUG },
    { $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("[seed] Dr. Falguni:", doc.slug, "| status:", doc.status, "| id:", doc._id.toString(), "| notify:", doc.personal.email);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[seed] failed:", err.message);
  process.exit(1);
});
