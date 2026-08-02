/**
 * Post-purchase product-review request emailer.
 *
 * Sends two plain-text, compliant emails per captured order (NO health claims):
 *   • Day 7  — friendly "how's it going" check-in.
 *   • Day 21 — review request linking to each purchased product's PDP #reviews.
 *
 * Idempotent: each Order carries reviewEmail7Sent / reviewEmail21Sent flags, so
 * re-runs never double-send. Only orders with payment.status "captured" qualify.
 * SES is env-gated — with no SES config the script is a safe no-op (flags stay
 * unset so the emails go out once credentials are added).
 *
 * Run:   node src/scripts/send-review-requests.js
 *
 * Cron (run once daily; server assumed UTC → 04:00 UTC ≈ 09:30 IST):
 *   0 4 * * *  cd /srv/3tattava/backend && /usr/bin/node src/scripts/send-review-requests.js >> /var/log/3t-review-emails.log 2>&1
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const Order = require("../models/Order");

const DAY = 24 * 60 * 60 * 1000;
const FROM = process.env.AWS_SES_FROM_EMAIL;
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://3tattava.com").replace(/\/+$/, "");

// Mirrors the SES gating used in bookings.routes.js — no-op unless fully configured.
function makeSesClient() {
  const hasSes =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_SES_FROM_EMAIL;
  if (!hasSes) return null;
  return new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

function orderEmail(order) {
  return order.shippingAddress?.email || order.guestEmail || null;
}

function firstName(order) {
  return order.shippingAddress?.firstName || "there";
}

async function sendEmail(client, to, subject, text) {
  await client.send(
    new SendEmailCommand({
      Source: FROM,
      Destination: { ToAddresses: [to] },
      Message: { Subject: { Data: subject }, Body: { Text: { Data: text } } },
    })
  );
}

function day7Text(order) {
  return (
    `Hi ${firstName(order)},\n\n` +
    `Thank you for your order ${order.orderNumber} from 3TATTAVA.\n\n` +
    `We just wanted to check in and make sure everything arrived safely and you're settling in with your products. ` +
    `If anything isn't quite right, simply reply to this email and our team will be glad to help.\n\n` +
    `Warm regards,\n3TATTAVA`
  );
}

function day21Text(order) {
  const links = (order.items || [])
    .filter((it) => it.slug)
    .map((it) => `  • ${it.name}: ${FRONTEND_URL}/products/${it.slug}#reviews`)
    .join("\n");
  const linkBlock = links || `  • ${FRONTEND_URL}/products`;
  return (
    `Hi ${firstName(order)},\n\n` +
    `It's been a few weeks since your order ${order.orderNumber} arrived, and we'd love to hear how you've been getting on.\n\n` +
    `If you have a moment, would you share an honest review? It genuinely helps other customers choose with confidence:\n\n` +
    `${linkBlock}\n\n` +
    `A line or two is plenty. Thank you for being part of the 3TATTAVA family.\n\n` +
    `Warm regards,\n3TATTAVA`
  );
}

async function processBatch({ client, filter, subject, buildText, flag, label }) {
  const orders = await Order.find(filter).exec();
  let sent = 0;
  let failed = 0;
  for (const order of orders) {
    const to = orderEmail(order);
    if (!to) {
      // No deliverable address — mark done so we don't re-scan it forever.
      order[flag] = true;
      await order.save();
      continue;
    }
    try {
      await sendEmail(client, to, subject, buildText(order));
      order[flag] = true;
      await order.save();
      sent += 1;
    } catch (err) {
      failed += 1;
      console.error(`[review-emails] ${label} failed for ${order.orderNumber}: ${err.message}`);
    }
  }
  return { sent, failed };
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");

  const client = makeSesClient();
  if (!client) {
    console.log("[review-emails] SES not configured — no-op. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SES_FROM_EMAIL to enable.");
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * DAY);
  const twentyOneDaysAgo = new Date(now - 21 * DAY);

  const r7 = await processBatch({
    client,
    filter: {
      "payment.status": "captured",
      reviewEmail7Sent: { $ne: true },
      createdAt: { $lte: sevenDaysAgo },
    },
    subject: "How are you getting on with your 3TATTAVA order?",
    buildText: day7Text,
    flag: "reviewEmail7Sent",
    label: "day7",
  });

  const r21 = await processBatch({
    client,
    filter: {
      "payment.status": "captured",
      reviewEmail21Sent: { $ne: true },
      createdAt: { $lte: twentyOneDaysAgo },
    },
    subject: "Would you share a review of your 3TATTAVA products?",
    buildText: day21Text,
    flag: "reviewEmail21Sent",
    label: "day21",
  });

  console.log(
    `[review-emails] done — day7 sent: ${r7.sent} (failed ${r7.failed}), day21 sent: ${r21.sent} (failed ${r21.failed})`
  );
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("[review-emails] failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
