"use strict";

/**
 * Welcome offer — a unique, one-time ₹200-OFF coupon issued to every new user.
 *
 * Design:
 *  - One Coupon document per user (kind:"welcome", type:"flat", value:200,
 *    usageLimit:1, perUserLimit:1, user:<owner>). The Coupon collection is the
 *    authoritative single-use ledger via `usedBy` + `usedCount`.
 *  - User.welcomeCoupon is a denormalised view model for fast homepage display
 *    (code / used / usedAt) — kept in sync at issue + redeem time.
 *  - Enforcement (owner + single-use) lives in coupon validate/apply; redemption
 *    marking happens at order capture.
 */

const crypto = require("crypto");
const Coupon = require("../models/Coupon");
const User = require("../models/User");

const WELCOME_VALUE = 200; // rupees off
const WELCOME_MIN_ORDER = 0; // usable on any first order; checkout clamps net >= 0
const WELCOME_TTL_DAYS = 90;
// Unambiguous alphabet (no 0/O/1/I/L) so a support agent can read codes aloud.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function genCode() {
  const bytes = crypto.randomBytes(6);
  let s = "";
  for (let i = 0; i < 6; i += 1) s += ALPHABET[bytes[i] % ALPHABET.length];
  return `W200${s}`;
}

function toView(user) {
  const wc = user.welcomeCoupon || {};
  const expiresAt = wc.expiresAt || null;
  return {
    code: wc.code || null,
    value: wc.value ?? WELCOME_VALUE,
    used: !!wc.used,
    usedAt: wc.usedAt || null,
    usedOrderNumber: wc.usedOrderNumber || null,
    issuedAt: wc.issuedAt || null,
    expiresAt,
    expired: expiresAt ? new Date(expiresAt).getTime() < Date.now() : false,
    minOrderAmount: WELCOME_MIN_ORDER,
  };
}

/** Idempotently allocate a welcome coupon for a user doc. Mutates + saves `user`. */
async function issueWelcomeCoupon(user) {
  if (user.welcomeCoupon && user.welcomeCoupon.code) return toView(user);

  const expiresAt = new Date(Date.now() + WELCOME_TTL_DAYS * 24 * 60 * 60 * 1000);
  let code = null;
  for (let attempt = 0; attempt < 6 && !code; attempt += 1) {
    const candidate = genCode();
    try {
      await Coupon.create({
        code: candidate,
        type: "flat",
        value: WELCOME_VALUE,
        minOrderAmount: WELCOME_MIN_ORDER,
        usageLimit: 1,
        usedCount: 0,
        perUserLimit: 1,
        usedBy: [],
        expiresAt,
        isActive: true,
        kind: "welcome",
        user: user._id,
      });
      code = candidate;
    } catch (err) {
      if (err.code !== 11000) throw err; // 11000 = code collision, retry
    }
  }
  if (!code) throw new Error("Could not allocate a unique welcome coupon code");

  user.welcomeCoupon = {
    code,
    value: WELCOME_VALUE,
    used: false,
    issuedAt: new Date(),
    expiresAt,
  };
  await user.save();
  return toView(user);
}

/** Fetch (lazily issuing for pre-existing accounts) the user's welcome offer view. */
async function getWelcomeCoupon(userId) {
  const user = await User.findById(userId).exec();
  if (!user) return null;
  if (!user.welcomeCoupon || !user.welcomeCoupon.code) {
    return issueWelcomeCoupon(user);
  }
  return toView(user);
}

/**
 * Mark a welcome coupon as redeemed for a user (idempotent). Called at order
 * capture. No-op if the code is not this user's welcome coupon.
 */
async function markWelcomeCouponUsed(userId, code, orderNumber) {
  if (!userId || !code) return;
  const coupon = await Coupon.findOne({
    code: String(code).toUpperCase(),
    kind: "welcome",
  }).exec();
  if (!coupon) return;
  if (coupon.user && String(coupon.user) !== String(userId)) return;
  // Already redeemed by this user (e.g. webhook + verify both fired) — no double count.
  if ((coupon.usedBy || []).some((id) => String(id) === String(userId))) return;

  await Coupon.updateOne(
    { _id: coupon._id },
    { $addToSet: { usedBy: userId }, $inc: { usedCount: 1 }, $set: { isActive: false } }
  ).exec();

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        "welcomeCoupon.used": true,
        "welcomeCoupon.usedOrderNumber": orderNumber || null,
        "welcomeCoupon.usedAt": new Date(),
      },
    }
  ).exec();
}

/**
 * Server-side eligibility check for a welcome coupon at validate/apply time.
 * Returns { ok, discountAmount, message }. `subtotal` is in rupees.
 */
function evaluateWelcome(coupon, userId, subtotal) {
  if (!userId) return { ok: false, discountAmount: 0, message: "Sign in to use this offer" };
  if (coupon.user && String(coupon.user) !== String(userId)) {
    return { ok: false, discountAmount: 0, message: "This offer belongs to another account" };
  }
  const alreadyUsed =
    (coupon.usedBy || []).some((id) => String(id) === String(userId)) ||
    (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit);
  if (alreadyUsed) return { ok: false, discountAmount: 0, message: "You've already used your welcome offer" };
  const discountAmount = Math.min(Number(coupon.value) || 0, Math.max(0, subtotal));
  return { ok: true, discountAmount, message: "Welcome offer applied" };
}

module.exports = {
  WELCOME_VALUE,
  issueWelcomeCoupon,
  getWelcomeCoupon,
  markWelcomeCouponUsed,
  evaluateWelcome,
  toView,
};
