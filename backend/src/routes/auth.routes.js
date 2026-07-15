const express = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const twilio = require("twilio");

const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Twilio Verify (phone OTP) ───────────────────────────────────────────────
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
const VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// Normalise an Indian mobile number to E.164 (+91XXXXXXXXXX).
function toE164(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (d.length === 10) return `+91${d}`;
  if (d.length === 11 && d.startsWith("0")) return `+91${d.slice(1)}`;
  if (d.length === 12 && d.startsWith("91")) return `+${d}`;
  return null;
}

// SMS costs money — throttle sends harder than logins.
const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many OTP requests. Please wait a few minutes." },
});

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
}

function signRefreshToken(userId, role) {
  return jwt.sign(
    { id: userId, role },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRES_IN || "30d" }
  );
}

function setRefreshCookie(res, token) {
  // Secure only over real HTTPS. Keying off NODE_ENV alone marks the cookie
  // Secure on http://localhost too, where Safari/Firefox silently drop it and
  // the refresh flow breaks (session appears "missing"). Deployed HTTPS still
  // gets a Secure cookie via req.secure / x-forwarded-proto.
  const req = res.req;
  const isHttps = !!(req && (req.secure || req.headers["x-forwarded-proto"] === "https"));
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/api/auth",
  });
}

async function establishSession(user, res) {
  const refreshToken = signRefreshToken(user._id.toString(), user.role);
  const decoded = jwt.decode(refreshToken);
  const expSeconds = decoded?.exp;

  user.refreshToken = refreshToken;
  user.refreshTokenExp = expSeconds ? new Date(expSeconds * 1000) : null;
  user.lastLogin = new Date();
  await user.save();

  setRefreshCookie(res, refreshToken);

  return {
    accessToken: signAccessToken(user),
    user,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1).optional(),
    });
    const { email, password, name } = schema.parse(req.body);

    const existing = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (existing) throw new ApiError(409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 12);

    // For local testing we consider the account verified.
    const user = await User.create({
      email: email.toLowerCase().trim(),
      name: name || email.split("@")[0],
      passwordHash,
      role: "customer",
      isVerified: true,
    });

    return res.json(await establishSession(user, res));
  } catch (err) {
    return next(err);
  }
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const { email, password } = schema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (!user || !user.passwordHash) throw new ApiError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    if (user.isVerified === false) {
      // In production we'd block login until email verification.
      // For MVP dev/testing we still allow login.
    }

    return res.json(await establishSession(user, res));
  } catch (err) {
    return next(err);
  }
});

router.post("/send-otp", otpSendLimiter, async (req, res, next) => {
  try {
    const phone = typeof req.body?.phone === "string" ? req.body.phone : "";
    const to = toE164(phone);
    if (!to) throw new ApiError(400, "Enter a valid 10-digit Indian mobile number.");
    if (!twilioClient || !VERIFY_SID) throw new ApiError(503, "OTP service is not configured.");

    await twilioClient.verify.v2
      .services(VERIFY_SID)
      .verifications.create({ to, channel: "sms" });

    return res.json({ status: "pending" });
  } catch (err) {
    if (err && typeof err.code === "number" && err.status >= 400 && err.status < 500) {
      return next(new ApiError(400, err.message || "Could not send OTP."));
    }
    return next(err);
  }
});

router.post("/verify-otp", loginLimiter, async (req, res, next) => {
  try {
    const phone = typeof req.body?.phone === "string" ? req.body.phone : "";
    const otp = typeof req.body?.otp === "string" ? req.body.otp : "";
    const to = toE164(phone);
    if (!to) throw new ApiError(400, "Invalid phone number.");
    if (!/^\d{4,10}$/.test(otp)) throw new ApiError(400, "Enter the code sent to your phone.");
    if (!twilioClient || !VERIFY_SID) throw new ApiError(503, "OTP service is not configured.");

    let check;
    try {
      check = await twilioClient.verify.v2
        .services(VERIFY_SID)
        .verificationChecks.create({ to, code: otp });
    } catch {
      throw new ApiError(401, "This code expired. Please request a new OTP.");
    }
    if (!check || check.status !== "approved") {
      throw new ApiError(401, "Invalid OTP. Please try again.");
    }

    const last10 = to.replace(/\D/g, "").slice(-10);
    let user =
      (await User.findOne({ phone: to }).exec()) ||
      (await User.findOne({ phone: last10 }).exec());

    if (!user) {
      user = await User.create({
        email: `p${to.replace(/\D/g, "")}@otp.3tattava.local`,
        name: `Member ${last10.slice(-4)}`,
        phone: to,
        role: "customer",
        isVerified: true,
      });
    } else if (user.phone !== to) {
      user.phone = to;
    }

    return res.json(await establishSession(user, res));
  } catch (err) {
    return next(err);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new ApiError(500, "Google login is not configured");
    }

    const schema = z.object({
      credential: z.string().min(1),
    });
    const { credential } = schema.parse(req.body);

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new ApiError(401, "Invalid Google credential");
    }

    if (payload.email_verified === false) {
      throw new ApiError(401, "Google email is not verified");
    }

    const email = payload.email.toLowerCase().trim();
    const googleId = payload.sub;
    const name = payload.name || email.split("@")[0];

    let user =
      (await User.findOne({ googleId }).exec()) ||
      (await User.findOne({ email }).exec());

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        role: "customer",
        isVerified: true,
      });
    } else {
      user.googleId = googleId;
      user.email = email;
      user.name = user.name || name;
      user.isVerified = true;
      await user.save();
    }

    return res.json(await establishSession(user, res));
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.json({ ok: true });

    const user = await User.findOne({ refreshToken }).exec();
    if (user) {
      user.refreshToken = undefined;
      user.refreshTokenExp = undefined;
      await user.save();
    }

    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new ApiError(401, "No refresh token");

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    }).exec();
    if (!user) throw new ApiError(401, "Refresh token not recognized");

    const accessToken = signAccessToken(user);
    return res.json({ accessToken, user });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).exec();
    if (!user) throw new ApiError(404, "User not found");
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

// The following endpoints are part of the PRD, but are not required for basic local testing.
router.get("/verify-email", async (req, res, next) => {
  try {
    // TODO: Implement SES token verification.
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.post("/forgot-password", async (req, res) => {
  res.status(501).json({ message: "Not implemented in local MVP" });
});

router.post("/reset-password", async (req, res) => {
  res.status(501).json({ message: "Not implemented in local MVP" });
});

router.post("/admin/auth/login", async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const { email, password } = schema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (!user || !user.passwordHash) throw new ApiError(401, "Invalid admin credentials");
    if (!["admin", "superadmin"].includes(user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid admin credentials");

    const adminToken = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "8h" }
    );

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/api/admin",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      token: adminToken, // also returned in body so client can use Bearer when cross-origin
      admin: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/admin/auth/logout", async (req, res) => {
  res.clearCookie("adminToken", { path: "/api/admin" });
  return res.json({ ok: true });
});

module.exports = router;

