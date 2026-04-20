/**
 * Seeds 3 sample doctors into the database for demo/working model purposes.
 * Run: node src/scripts/seedDoctors.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { connectDb } = require("../config/db");
const Doctor = require("../models/Doctor");

const SAMPLE_DOCTORS = [
  {
    slug: "dr-anita-sharma-lajpat-nagar",
    status: "active",
    personal: {
      fullName: "Dr. Anita Sharma",
      phone: "+919876543210",
      email: "dr.anita@example.com",
      photo: "",
      gender: "female",
    },
    qualifications: {
      degree: "BAMS",
      university: "Delhi University",
      graduationYear: 2014,
      registrationNumber: "DL-AYU-12345",
      registrationBoard: "Delhi Council of Indian Medicine",
      yearsOfPractice: 12,
      verifiedAt: new Date(),
    },
    clinic: {
      name: "Sharma Ayurveda Clinic",
      address: { line1: "B-24, Lajpat Nagar III", area: "Lajpat Nagar", city: "New Delhi", state: "Delhi", pincode: "110024" },
      location: { type: "Point", coordinates: [77.2373, 28.5700] },
    },
    practice: {
      specializations: ["hormonal-balance", "womens-health", "panchakarma"],
      languages: ["hindi", "english"],
      consultationFee: { inClinic: 500, online: 400 },
      offersOnline: true,
      bio: "Dr. Anita Sharma has been practicing Ayurveda for over 12 years with a focus on women's hormonal health and Panchakarma therapies. She combines classical Ayurvedic principles with modern diagnostic approaches to deliver measurable health outcomes. She is a strong advocate for mineral supplementation through natural sources like Shilajit.",
    },
    workingHours: {
      monday: { closed: false, from: "10:00", to: "18:00", breakFrom: "13:00", breakTo: "14:00" },
      tuesday: { closed: false, from: "10:00", to: "18:00", breakFrom: "13:00", breakTo: "14:00" },
      wednesday: { closed: false, from: "10:00", to: "14:00" },
      thursday: { closed: true },
      friday: { closed: false, from: "10:00", to: "18:00", breakFrom: "13:00", breakTo: "14:00" },
      saturday: { closed: false, from: "10:00", to: "16:00" },
      sunday: { closed: true },
    },
    ratings: { average: 4.8, count: 127, breakdown: { 5: 89, 4: 24, 3: 10, 2: 3, 1: 1 } },
    analytics: { totalBookings: 342, bookingsThisMonth: 28, profileViews: 1580, profileViewsThisMonth: 156 },
  },
  {
    slug: "dr-rajesh-kumar-dwarka",
    status: "active",
    personal: {
      fullName: "Dr. Rajesh Kumar",
      phone: "+919876543211",
      email: "dr.rajesh@example.com",
      photo: "",
      gender: "male",
    },
    qualifications: {
      degree: "MD Ayurveda",
      university: "Banaras Hindu University",
      graduationYear: 2010,
      registrationNumber: "DL-AYU-67890",
      registrationBoard: "Delhi Council of Indian Medicine",
      yearsOfPractice: 16,
      verifiedAt: new Date(),
    },
    clinic: {
      name: "Kumar Ayurveda & Wellness Center",
      address: { line1: "Sector 6, Dwarka", area: "Dwarka", city: "New Delhi", state: "Delhi", pincode: "110075" },
      location: { type: "Point", coordinates: [77.0688, 28.5921] },
    },
    practice: {
      specializations: ["sports-performance", "digestive-health", "stress-anxiety", "general-wellness"],
      languages: ["hindi", "english", "punjabi"],
      consultationFee: { inClinic: 600, online: 500 },
      offersOnline: true,
      bio: "Dr. Rajesh Kumar brings 16 years of Ayurvedic practice with expertise in sports performance optimization and digestive disorders. His approach integrates Rasayana therapy with modern lifestyle guidance. He works with athletes and fitness enthusiasts to optimize recovery and energy through mineral science and adaptogenic protocols.",
    },
    workingHours: {
      monday: { closed: false, from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00" },
      tuesday: { closed: false, from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00" },
      wednesday: { closed: false, from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00" },
      thursday: { closed: false, from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00" },
      friday: { closed: false, from: "09:00", to: "17:00", breakFrom: "13:00", breakTo: "14:00" },
      saturday: { closed: false, from: "10:00", to: "14:00" },
      sunday: { closed: true },
    },
    ratings: { average: 4.6, count: 89, breakdown: { 5: 52, 4: 22, 3: 11, 2: 3, 1: 1 } },
    analytics: { totalBookings: 198, bookingsThisMonth: 15, profileViews: 920, profileViewsThisMonth: 85 },
  },
  {
    slug: "dr-meera-joshi-noida",
    status: "active",
    personal: {
      fullName: "Dr. Meera Joshi",
      phone: "+919876543212",
      email: "dr.meera@example.com",
      photo: "",
      gender: "female",
    },
    qualifications: {
      degree: "BAMS",
      university: "Gujarat Ayurved University",
      graduationYear: 2016,
      registrationNumber: "UP-AYU-11223",
      registrationBoard: "UP Council of Indian Medicine",
      yearsOfPractice: 10,
      verifiedAt: new Date(),
    },
    clinic: {
      name: "Joshi Ayurveda Clinic",
      address: { line1: "C-45, Sector 18", area: "Sector 18", city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
      location: { type: "Point", coordinates: [77.3266, 28.5706] },
    },
    practice: {
      specializations: ["skin-hair", "womens-health", "weight-management"],
      languages: ["hindi", "english"],
      consultationFee: { inClinic: 400, online: 350 },
      offersOnline: true,
      bio: "Dr. Meera Joshi specializes in Ayurvedic dermatology, weight management, and women's health. With 10 years of practice, she focuses on root-cause analysis of skin conditions and hormonal imbalances. Her treatment protocols emphasize mineral sufficiency and daily rituals that patients can maintain long-term.",
    },
    workingHours: {
      monday: { closed: false, from: "11:00", to: "19:00", breakFrom: "14:00", breakTo: "15:00" },
      tuesday: { closed: false, from: "11:00", to: "19:00", breakFrom: "14:00", breakTo: "15:00" },
      wednesday: { closed: true },
      thursday: { closed: false, from: "11:00", to: "19:00", breakFrom: "14:00", breakTo: "15:00" },
      friday: { closed: false, from: "11:00", to: "19:00", breakFrom: "14:00", breakTo: "15:00" },
      saturday: { closed: false, from: "10:00", to: "15:00" },
      sunday: { closed: false, from: "10:00", to: "14:00" },
    },
    ratings: { average: 4.9, count: 64, breakdown: { 5: 50, 4: 10, 3: 3, 2: 1, 1: 0 } },
    analytics: { totalBookings: 156, bookingsThisMonth: 22, profileViews: 710, profileViewsThisMonth: 95 },
  },
];

async function seed() {
  await connectDb();
  console.log("Seeding sample doctors...");

  for (const doc of SAMPLE_DOCTORS) {
    await Doctor.findOneAndUpdate({ slug: doc.slug }, doc, { upsert: true, new: true });
    console.log(`  ✓ ${doc.personal.fullName} (${doc.slug})`);
  }

  console.log(`Done — ${SAMPLE_DOCTORS.length} doctors seeded.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
