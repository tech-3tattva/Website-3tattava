const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { connectDb } = require("./src/config/db");
const { errorHandler } = require("./src/middleware/errorHandler");

const productsRoutes = require("./src/routes/products.routes");
const categoriesRoutes = require("./src/routes/categories.routes");
const authRoutes = require("./src/routes/auth.routes");
const cartRoutes = require("./src/routes/cart.routes");
const addressRoutes = require("./src/routes/address.routes");
const orderRoutes = require("./src/routes/order.routes");
const couponRoutes = require("./src/routes/coupon.routes");
const adminRoutes = require("./src/routes/admin.routes");
const newsletterRoutes = require("./src/routes/newsletter.routes");
const labReportRoutes = require("./src/routes/labReport.routes");
const deliveryRoutes = require("./src/routes/delivery.routes");
const chatRoutes = require("./src/routes/chat.routes");

const app = express();

const uploadsRoot = path.join(__dirname, "uploads");
fs.mkdirSync(path.join(uploadsRoot, "products"), { recursive: true });
app.use("/uploads", express.static(uploadsRoot));

// Basic hardening (allow Next.js to load images from this API origin)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Allow both apex (3tattava.com) and www, plus Vercel preview deploys.
// FRONTEND_URL stays env-driven for primary, but we always include the apex/www pair
// for production to avoid the "you typed it without www" CORS surprise.
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const extraOrigins = (process.env.EXTRA_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [
  frontendUrl,
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.3tattava.com",
  "https://3tattava.com",
  "https://website-3tattava.vercel.app",
  ...extraOrigins,
];
const vercelPreview = /^https:\/\/website-3tattava-[a-z0-9-]+\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || vercelPreview.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// HTTP request logs
app.use(morgan("dev"));

// Public rate limit
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/chat", chatRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handler (must be last)
app.use(errorHandler);

async function start() {
  await connectDb();

  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[backend] failed to start:", err);
  process.exit(1);
});

