const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("[admin] connected to MongoDB");

  await User.deleteOne({ email: "admin@3tattava.com" });

  const passwordHash = await bcrypt.hash("3Tattava@Admin2025!", 12);
  const admin = await User.create({
    email: "admin@3tattava.com",
    name: "Dr. Kashish — 3TATTAVA Admin",
    passwordHash,
    role: "superadmin",
    isVerified: true,
  });

  console.log("✅ Admin user created:");
  console.log("   Email:    admin@3tattava.com");
  console.log("   Password: 3Tattava@Admin2025!");
  console.log("   Role:     superadmin");
  console.log("   ID:      ", admin._id.toString());

  mongoose.connection.close();
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
