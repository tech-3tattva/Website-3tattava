#!/usr/bin/env node
/**
 * Safe admin account management (replaces createAdmin.js -- issues H4 and H3).
 *
 * The old createAdmin.js hard-coded the admin password IN THE PUBLIC REPO and
 * deleted the existing admin on every run. This script instead:
 *   - never stores a password in code -- it reads ADMIN_PASSWORD from the
 *     environment, or generates a strong random one and prints it once;
 *   - is additive/idempotent -- it upserts and NEVER deletes an account;
 *   - supports multiple named admins so logins need not be shared (H3);
 *   - can rotate a password or revoke admin access.
 *
 * Usage:
 *   node src/scripts/manage-admin.js --email a@b.com [--name "Name"] [--role admin|superadmin] [--rotate]
 *       Create the admin, or update its name/role. A password is set on create,
 *       or on --rotate: from ADMIN_PASSWORD if set, otherwise generated+printed.
 *   node src/scripts/manage-admin.js --list
 *       List every admin / superadmin.
 *   node src/scripts/manage-admin.js --email a@b.com --disable
 *       Revoke admin access (demote to customer). The account is kept.
 *
 * Examples:
 *   ADMIN_PASSWORD='...' node src/scripts/manage-admin.js --email admin@3tattava.com --role superadmin --rotate
 *   node src/scripts/manage-admin.js --email ops@3tattava.com --name "Ops Team" --role admin
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(flag) {
  return process.argv.includes(flag);
}

// Strong, password-manager-friendly (base64url alphabet is copy/paste safe).
function generatePassword() {
  return crypto.randomBytes(15).toString("base64url") + "@7";
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
  await mongoose.connect(process.env.MONGODB_URI);

  if (has("--list")) {
    const admins = await User.find({ role: { $in: ["admin", "superadmin"] } })
      .select("email name role lastLogin")
      .sort({ role: 1, email: 1 })
      .lean()
      .exec();
    console.log(`admins (${admins.length}):`);
    for (const a of admins) {
      const last = a.lastLogin ? new Date(a.lastLogin).toISOString() : "never";
      console.log(`  ${a.role.padEnd(10)} ${a.email.padEnd(30)} ${(a.name || "").padEnd(24)} last:${last}`);
    }
    return;
  }

  const email = (arg("--email") || "").toLowerCase().trim();
  if (!email) throw new Error("--email is required (or use --list)");

  if (has("--disable")) {
    const u = await User.findOne({ email }).exec();
    if (!u) throw new Error(`no user with email ${email}`);
    if (!["admin", "superadmin"].includes(u.role)) {
      console.log(`${email} is not an admin (role=${u.role}); nothing to do.`);
      return;
    }
    u.role = "customer";
    await u.save();
    console.log(`revoked admin access: ${email} is now role=customer`);
    return;
  }

  const requestedRole = arg("--role");
  if (requestedRole && !["admin", "superadmin"].includes(requestedRole)) {
    throw new Error("--role must be admin or superadmin");
  }

  const existing = await User.findOne({ email }).exec();
  const role = requestedRole || (existing && ["admin", "superadmin"].includes(existing.role) ? existing.role : "admin");
  const mustSetPassword = !existing || has("--rotate");

  const set = { role, isVerified: true };
  const setOnInsert = { email };
  if (arg("--name")) set.name = arg("--name");
  else setOnInsert.name = "3TATTAVA Admin";

  let plainToShow = null;
  if (mustSetPassword) {
    const plain = process.env.ADMIN_PASSWORD || generatePassword();
    if (!process.env.ADMIN_PASSWORD) plainToShow = plain;
    set.passwordHash = await bcrypt.hash(plain, 12);
  }

  const doc = await User.findOneAndUpdate(
    { email },
    { $set: set, $setOnInsert: setOnInsert },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  console.log(existing ? "admin updated:" : "admin created:");
  console.log(`  email: ${doc.email}`);
  console.log(`  name:  ${doc.name}`);
  console.log(`  role:  ${doc.role}`);
  console.log(`  id:    ${doc._id.toString()}`);
  if (plainToShow) {
    console.log("  ----------------------------------------------------------------");
    console.log(`  PASSWORD (generated, shown ONCE -- save it now): ${plainToShow}`);
    console.log("  ----------------------------------------------------------------");
  } else if (mustSetPassword) {
    console.log("  password: set from ADMIN_PASSWORD env");
  } else {
    console.log("  password: unchanged (pass --rotate to set a new one)");
  }
}

main()
  .catch((err) => {
    console.error("manage-admin FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (_) {}
  });
