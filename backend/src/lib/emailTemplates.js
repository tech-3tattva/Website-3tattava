/**
 * HTML/text for transactional emails.
 *
 * Kept apart from the transport (lib/mailer.js) so the design can be iterated on
 * without touching send logic. Built for real email clients, not browsers:
 *   - tables + inline styles only (no fla, grid, external CSS, or <style> media
 *     queries, which Gmail/Outlook strip or ignore)
 *   - single column, body text >= 14px, tap targets >= 44px
 *   - every image carries alt text and the layout reads with images OFF
 *
 * Palette is the current 3TATTAVA dark brand system (globals.css): ink #0E0C09,
 * gold #C9A84C, cream #FAF7F2, beige #F5EFE6.
 */

const path = require("path");

const BRAND = {
  ink: "#0E0C09",
  ink2: "#1A1710",
  gold: "#C9A84C",
  goldPale: "#F5E8C4",
  cream: "#FAF7F2",
  beige: "#F5EFE6",
  card: "#FFFFFF",
  border: "#E2D9CE",
  text: "#3A2D18",
  muted: "#7A6F5A",
  footMuted: "#8A7F6A",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const DEFAULT_SITE = process.env.PUBLIC_SITE_URL || "https://www.3tattava.com";

const SUPPORT_EMAIL = "support@3tattava.com";
const SUPPORT_PHONE = "+91 95601 49956";
const LEGAL_NAME = "SankalpaSiddhi Ayupharma Pvt. Ltd.";
const GSTIN = "07ABSCS9652C1ZU";
const ADDRESS = "690A/1, Kabool Nagar, Shahdara, Delhi 110032";
// The whole header is one baked image (ink band + gold kicker + cream logo).
// Delivered inline (cid), because a light logo over a dark background disappears
// when Gmail's dark mode recolours the header cell to light -- it recolours
// backgrounds but never image pixels, so a single image is the only thing that
// renders identically in every client and colour scheme.
const HEADER_IMG = path.join(__dirname, "..", "assets", "logo", "email-header.png");
const HEADER_CID = "hdr@3tattava";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function inr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  const dt = d ? new Date(d) : new Date();
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Resolve the best delivery/tracking facts available on the order. */
function trackingOf(order) {
  const t = order.tracking || {};
  const s = order.shipment || {};
  const awb = t.trackingNumber || s.awbNumber || null;
  const courier = t.courierName || s.courierName || null;
  const url = t.trackingUrl || (awb ? `https://ship.nimbuspost.com/tracking/${awb}` : null);
  const eta = t.estimatedDelivery || null;
  return { awb, courier, url, eta, delivered: order.status === "delivered" };
}

/**
 * The order-confirmation email: subject, html, text.
 * `invoice` is the built invoice object (may be null if issue failed).
 */
function orderConfirmation({ order, invoice, site = DEFAULT_SITE }) {
  const addr = order.shippingAddress || {};
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ") || "there";
  const first = addr.firstName || "there";
  const orderUrl = `${site}/order-confirmation/${encodeURIComponent(order.orderNumber)}`;
  const track = trackingOf(order);
  const invNo = invoice?.invoiceNumber || null;

  const subject = `Order confirmed \u2713 ${order.orderNumber} \u00b7 3TATTAVA`;
  const preheader = `Thank you, ${first} \u2014 your 3TATTAVA order ${order.orderNumber} is confirmed. Items, total and delivery details inside.`;

  // ── Items ──
  const itemRows = (order.items || [])
    .map((i) => {
      const qty = Number(i.quantity) || 0;
      const amount = i.subtotal ?? (Number(i.price) || 0) * qty;
      const thumb = i.image
        ? `<img src="${esc(i.image)}" width="76" alt="${esc(i.name)}" style="display:block;width:76px;height:auto;border-radius:8px;background:${BRAND.beige};border:1px solid ${BRAND.border}">`
        : `<div style="width:76px;height:76px;border-radius:8px;background:${BRAND.beige};border:1px solid ${BRAND.border}"></div>`;
      return `
      <tr>
        <td width="76" style="padding:14px 14px 14px 0;vertical-align:middle">${thumb}</td>
        <td style="padding:12px 14px;vertical-align:top;font-family:${BRAND.sans};font-size:15px;color:${BRAND.text};line-height:1.4">
          ${esc(i.name)}${i.variant ? `<div style="font-size:12px;color:${BRAND.muted};margin-top:2px">${esc(i.variant)}</div>` : ""}
          <div style="font-size:12px;color:${BRAND.muted};margin-top:2px">Qty ${qty}</div>
        </td>
        <td style="padding:12px 0;vertical-align:top;text-align:right;font-family:${BRAND.sans};font-size:15px;color:${BRAND.text};white-space:nowrap">${inr(amount)}</td>
      </tr>`;
    })
    .join("");

  // ── Price summary rows ──
  const sumRow = (label, value, opts = {}) => `
      <tr>
        <td style="padding:5px 0;font-family:${BRAND.sans};font-size:${opts.big ? "16px" : "14px"};color:${opts.big ? BRAND.ink : BRAND.muted};${opts.big ? "font-weight:700" : ""}">${esc(label)}</td>
        <td style="padding:5px 0;text-align:right;font-family:${BRAND.sans};font-size:${opts.big ? "16px" : "14px"};color:${opts.big ? BRAND.ink : BRAND.text};${opts.big ? "font-weight:700" : ""}">${value}</td>
      </tr>`;

  const discount = Number(order.discountAmount) || 0;
  const shipping = Number(order.shippingFee) || 0;
  const summary =
    sumRow("Subtotal", inr(order.subtotal)) +
    (discount > 0 ? sumRow(`Discount${order.coupon?.code ? ` (${order.coupon.code})` : ""}`, `\u2212${inr(discount)}`) : "") +
    sumRow("Shipping", shipping > 0 ? inr(shipping) : "FREE") +
    sumRow("Total paid", inr(order.total), { big: true });

  // ── Delivery block ──
  let deliveryHtml;
  if (track.delivered) {
    deliveryHtml = `<div style="font-family:${BRAND.sans};font-size:14px;color:${BRAND.text};line-height:1.6">Delivered${track.courier ? ` via ${esc(track.courier)}` : ""}.${track.awb ? `<br>AWB ${esc(track.awb)}` : ""}</div>`;
  } else if (track.awb || track.url) {
    deliveryHtml = `<div style="font-family:${BRAND.sans};font-size:14px;color:${BRAND.text};line-height:1.6">${track.courier ? `${esc(track.courier)} \u00b7 ` : ""}${track.awb ? `AWB ${esc(track.awb)}` : "In transit"}${track.eta ? `<br>Est. delivery ${fmtDate(track.eta)}` : ""}</div>`;
  } else {
    deliveryHtml = `<div style="font-family:${BRAND.sans};font-size:14px;color:${BRAND.muted};line-height:1.6">Your parcel is being prepared. We'll email tracking the moment it ships.</div>`;
  }

  const btn = (label, href, primary) => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 8px 10px 0;display:inline-block"><tr><td style="border-radius:4px;background:${primary ? BRAND.gold : "transparent"};border:1px solid ${primary ? BRAND.gold : BRAND.ink}">
      <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${BRAND.sans};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;text-decoration:none;color:${primary ? BRAND.ink : BRAND.ink}">${esc(label)}</a>
    </td></tr></table>`;

  const ctas = btn("View your order", orderUrl, true) + (track.url ? btn(track.delivered ? "View tracking" : "Track shipment", track.url, false) : "");

  const invoiceNote = invoice
    ? `<tr><td style="padding:0 32px 8px"><div style="font-family:${BRAND.sans};font-size:13px;color:${BRAND.muted};line-height:1.6;background:${BRAND.beige};border:1px solid ${BRAND.border};border-radius:6px;padding:12px 14px">📎 Your GST tax invoice <b style="color:${BRAND.text}">${esc(invNo)}</b> is attached (PDF).</div></td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>Order confirmed \u2014 ${esc(order.orderNumber)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.beige};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BRAND.beige};font-size:1px;line-height:1px">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.beige};padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden">

      <!-- Header -->
      <tr><td style="padding:0;font-size:0;line-height:0">
        <img src="cid:${HEADER_CID}" width="600" alt="3TATTAVA \u2014 Doctor-Led Performance Ayurveda \u2014 Balance. Build. Become." style="display:block;width:100%;max-width:600px;height:auto;border:0">
      </td></tr>

      <!-- Hero -->
      <tr><td style="padding:34px 32px 6px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td width="44" style="vertical-align:middle"><div style="width:38px;height:38px;border-radius:50%;background:${BRAND.ink};color:${BRAND.gold};font-family:${BRAND.sans};font-size:20px;line-height:38px;text-align:center">\u2713</div></td>
          <td style="vertical-align:middle;padding-left:12px"><div style="font-family:${BRAND.serif};font-size:24px;color:${BRAND.ink};line-height:1.2">Order confirmed</div></td>
        </tr></table>
        <p style="font-family:${BRAND.sans};font-size:15px;color:${BRAND.text};line-height:1.6;margin:16px 0 0">Thank you, <b>${esc(first)}</b>. We've received your order and your ritual is being prepared.</p>
      </td></tr>

      <!-- Order meta -->
      <tr><td style="padding:16px 32px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:6px">
          <tr>
            <td style="padding:12px 16px;font-family:${BRAND.sans};font-size:12px;color:${BRAND.muted}">ORDER NUMBER<div style="font-size:15px;color:${BRAND.ink};font-weight:700;margin-top:3px">${esc(order.orderNumber)}</div></td>
            <td style="padding:12px 16px;font-family:${BRAND.sans};font-size:12px;color:${BRAND.muted};text-align:right">ORDER DATE<div style="font-size:15px;color:${BRAND.ink};font-weight:700;margin-top:3px">${fmtDate(order.payment?.capturedAt || order.createdAt)}</div></td>
          </tr>
        </table>
      </td></tr>

      <!-- Items -->
      <tr><td style="padding:12px 32px 0">
        <div style="font-family:${BRAND.sans};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};padding-bottom:4px;border-bottom:1px solid ${BRAND.border}">Your items</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
      </td></tr>

      <!-- Summary -->
      <tr><td style="padding:8px 32px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.border};padding-top:8px">${summary}</table>
      </td></tr>

      <!-- Address + delivery -->
      <tr><td style="padding:18px 32px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="vertical-align:top;padding-right:10px">
              <div style="font-family:${BRAND.sans};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:6px">Shipping to</div>
              <div style="font-family:${BRAND.sans};font-size:14px;color:${BRAND.text};line-height:1.6">
                <b>${esc(name)}</b><br>
                ${[addr.line1, addr.line2].filter(Boolean).map(esc).join("<br>")}<br>
                ${esc([addr.city, addr.state, addr.pincode].filter(Boolean).join(", "))}${addr.phone ? `<br>${esc(addr.phone)}` : ""}
              </div>
            </td>
            <td width="50%" style="vertical-align:top;padding-left:10px">
              <div style="font-family:${BRAND.sans};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:6px">Delivery</div>
              ${deliveryHtml}
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:22px 32px 6px">${ctas}</td></tr>

      ${invoiceNote}

      <!-- Support -->
      <tr><td style="padding:8px 32px 26px">
        <div style="font-family:${BRAND.sans};font-size:13px;color:${BRAND.muted};line-height:1.7;border-top:1px solid ${BRAND.border};padding-top:14px">
          Need help with this order? Reply to this email or reach us at
          <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND.ink};text-decoration:underline">${SUPPORT_EMAIL}</a> \u00b7 ${SUPPORT_PHONE}.
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${BRAND.ink};padding:22px 32px;text-align:center">
        <div style="font-family:${BRAND.sans};font-size:11px;letter-spacing:0.06em;color:${BRAND.footMuted};line-height:1.7">
          ${esc(LEGAL_NAME)} \u00b7 GSTIN ${GSTIN}<br>
          ${esc(ADDRESS)}<br>
          Doctor-Led \u00b7 Lab-Tested \u00b7 AYUSH GMP \u00b7 Made in India
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  // ── Plain-text fallback (every client renders this if HTML is stripped) ──
  const textLines = [
    `Order confirmed — ${order.orderNumber}`,
    ``,
    `Thank you, ${first}. We've received your order and it's being prepared.`,
    ``,
    `Order number: ${order.orderNumber}`,
    `Order date  : ${fmtDate(order.payment?.capturedAt || order.createdAt)}`,
    ``,
    `ITEMS`,
    ...(order.items || []).map((i) => `  ${i.name} x${i.quantity}  ${inr(i.subtotal ?? i.price * i.quantity)}`),
    ``,
    `  Subtotal   ${inr(order.subtotal)}`,
    discount > 0 ? `  Discount   -${inr(discount)}` : null,
    `  Shipping   ${shipping > 0 ? inr(shipping) : "FREE"}`,
    `  Total paid ${inr(order.total)}`,
    ``,
    `SHIPPING TO`,
    `  ${name}`,
    `  ${[addr.line1, addr.line2].filter(Boolean).join(", ")}`,
    `  ${[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}`,
    addr.phone ? `  ${addr.phone}` : null,
    ``,
    track.delivered
      ? `DELIVERED${track.courier ? ` via ${track.courier}` : ""}${track.awb ? ` (AWB ${track.awb})` : ""}`
      : track.awb
        ? `DELIVERY: ${track.courier || "In transit"}${track.awb ? ` AWB ${track.awb}` : ""}${track.url ? ` — ${track.url}` : ""}`
        : `DELIVERY: your parcel is being prepared; we'll email tracking when it ships.`,
    ``,
    `View your order: ${orderUrl}`,
    invoice ? `Your GST tax invoice ${invNo} is attached (PDF).` : null,
    ``,
    `Questions? ${SUPPORT_EMAIL} · ${SUPPORT_PHONE}`,
    ``,
    `${LEGAL_NAME} · GSTIN ${GSTIN}`,
    `${ADDRESS}`,
  ].filter((l) => l !== null);

  return {
    subject,
    html,
    text: textLines.join("\n"),
    inlineImages: [{ cid: HEADER_CID, path: HEADER_IMG, filename: "3tattava-header.png" }],
  };
}

module.exports = { orderConfirmation };
