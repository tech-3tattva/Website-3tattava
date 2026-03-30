const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const { verifyToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

function getItemId(item) {
  return `${item.productId}${item.variant ? `::${item.variant}` : ""}`;
}

function normalizeCart(cart) {
  return {
    items: (cart?.items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      slug: item.slug,
      variant: item.variant,
    })),
    coupon: cart?.coupon?.code ? cart.coupon : null,
  };
}

function setGuestCartCookie(res, guestId) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("guestId", guestId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function getOptionalUser(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

async function getOrCreateCart(req, res) {
  const user = getOptionalUser(req);
  if (user?.id) {
    let cart = await Cart.findOne({ user: user.id }).exec();
    if (!cart) {
      cart = await Cart.create({
        user: user.id,
        items: [],
        coupon: null,
      });
    }
    return cart;
  }

  let guestId = req.cookies?.guestId;
  if (!guestId) {
    guestId = crypto.randomUUID();
    setGuestCartCookie(res, guestId);
  }

  let cart = await Cart.findOne({ guestId }).exec();
  if (!cart) {
    cart = await Cart.create({
      guestId,
      items: [],
      coupon: null,
    });
  }
  return cart;
}

async function validateCouponCode(code, cartTotal) {
  const coupon = await Coupon.findOne({ code: String(code).toUpperCase() }).exec();
  if (!coupon || !coupon.isActive) throw new ApiError(400, "Invalid coupon");
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    throw new ApiError(400, "Coupon expired");
  }
  if (cartTotal < (coupon.minOrderAmount || 0)) {
    throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount}`);
  }
  return {
    code: coupon.code,
    discount: Number(coupon.value) || 0,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req, res);
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const schema = z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      image: z.string().min(1),
      price: z.number().nonnegative(),
      mrp: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      slug: z.string().min(1),
      variant: z.string().optional(),
    });
    const item = schema.parse(req.body);

    const cart = await getOrCreateCart(req, res);
    const itemId = getItemId(item);
    const existing = cart.items.find((cartItem) => getItemId(cartItem) === itemId);

    if (existing) {
      existing.quantity += item.quantity;
      existing.price = item.price;
      existing.mrp = item.mrp;
      existing.image = item.image;
      existing.name = item.name;
      existing.slug = item.slug;
    } else {
      cart.items.push(item);
    }

    await cart.save();
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.put("/items/:itemId", async (req, res, next) => {
  try {
    const schema = z.object({
      qty: z.number().int(),
    });
    const { qty } = schema.parse(req.body);
    const { itemId } = req.params;

    const cart = await getOrCreateCart(req, res);
    if (qty <= 0) {
      cart.items = cart.items.filter((item) => getItemId(item) !== itemId);
    } else {
      const existing = cart.items.find((item) => getItemId(item) === itemId);
      if (!existing) throw new ApiError(404, "Cart item not found");
      existing.quantity = qty;
    }

    await cart.save();
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.delete("/items/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req, res);
    cart.items = cart.items.filter((item) => getItemId(item) !== itemId);
    await cart.save();
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req, res);
    cart.items = [];
    cart.coupon = null;
    await cart.save();
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.post("/coupon", async (req, res, next) => {
  try {
    const schema = z.object({
      code: z.string().min(1),
    });
    const { code } = schema.parse(req.body);

    const cart = await getOrCreateCart(req, res);
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.coupon = await validateCouponCode(code, subtotal);
    await cart.save();

    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.delete("/coupon", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req, res);
    cart.coupon = null;
    await cart.save();
    return res.json(normalizeCart(cart));
  } catch (err) {
    return next(err);
  }
});

router.post("/merge", verifyToken, async (req, res, next) => {
  try {
    const guestId = req.cookies?.guestId;
    let userCart = await Cart.findOne({ user: req.user.id }).exec();
    if (!userCart) {
      userCart = await Cart.create({ user: req.user.id, items: [], coupon: null });
    }

    if (!guestId) {
      return res.json(normalizeCart(userCart));
    }

    const guestCart = await Cart.findOne({ guestId }).exec();
    if (!guestCart) {
      return res.json(normalizeCart(userCart));
    }

    for (const guestItem of guestCart.items) {
      const guestItemId = getItemId(guestItem);
      const existing = userCart.items.find((item) => getItemId(item) === guestItemId);
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        userCart.items.push({
          productId: guestItem.productId,
          name: guestItem.name,
          image: guestItem.image,
          price: guestItem.price,
          mrp: guestItem.mrp,
          quantity: guestItem.quantity,
          slug: guestItem.slug,
          variant: guestItem.variant,
        });
      }
    }

    if (!userCart.coupon && guestCart.coupon?.code) {
      userCart.coupon = guestCart.coupon;
    }

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    return res.json(normalizeCart(userCart));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

