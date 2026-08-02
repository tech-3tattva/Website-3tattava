"use strict";

/**
 * Meta Conversions API (CAPI) — server-side Purchase events.
 *
 * Fires a server-side Purchase to Meta so conversions are still counted when
 * the browser pixel is blocked (ad-blockers, iOS ITP). The server event shares
 * its event_id with the browser Pixel event (order number), so Meta dedups the
 * pair and never double-counts.
 *
 * Env-gated: if the access token or pixel id is missing, empty, or still a
 * template placeholder, sendPurchaseEvent() returns null (no-op) instead of
 * calling the Graph API. Never throws to the request path.
 *
 * Required env vars:
 *   META_CAPI_ACCESS_TOKEN — Conversions API system-user access token
 *   META_PIXEL_ID          — Meta Pixel / dataset id (numeric)
 */

const crypto = require("crypto");

// Pinned Graph API version used for every CAPI request.
const GRAPH_API_VERSION = "v19.0";

/** A value is usable only if present, non-empty, and not a template placeholder. */
function isConfigured(value) {
  if (!value) return false;
  const v = String(value).trim();
  if (!v) return false;
  if (/placeholder|your[-_]|x{4,}/i.test(v)) return false;
  return true;
}

/** sha256 hex digest — Meta's required hashing for PII user_data fields. */
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Normalize (trim + lowercase) then sha256 an email; undefined when empty. */
function hashEmail(email) {
  if (!email) return undefined;
  const normalized = String(email).trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

/** Digits-only then sha256 a phone; undefined when empty. */
function hashPhone(phone) {
  if (!phone) return undefined;
  const digits = String(phone).replace(/\D/g, "");
  return digits ? sha256(digits) : undefined;
}

/**
 * Send a server-side Purchase event to the Meta Conversions API.
 *
 * Returns { ok: true } on success, or null when unconfigured or on any error
 * (logged, never thrown) so callers can fire-and-forget without a try/catch.
 */
async function sendPurchaseEvent({ eventId, value, currency, email, phone, fbc, fbp, clientIp, userAgent, sourceUrl }) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;
  if (!isConfigured(token) || !isConfigured(pixelId)) return null;

  try {
    const em = hashEmail(email);
    const ph = hashPhone(phone);

    const user_data = {};
    if (em) user_data.em = [em];
    if (ph) user_data.ph = [ph];
    if (fbc) user_data.fbc = fbc;
    if (fbp) user_data.fbp = fbp;
    if (clientIp) user_data.client_ip_address = clientIp;
    if (userAgent) user_data.client_user_agent = userAgent;

    const body = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: sourceUrl,
          user_data,
          custom_data: { value, currency },
        },
      ],
    };

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(
      pixelId
    )}/events?access_token=${encodeURIComponent(token)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[meta-capi] Purchase failed: ${res.status} ${text}`);
      return null;
    }
    return { ok: true };
  } catch (err) {
    console.error("[meta-capi] Purchase error:", err instanceof Error ? err.message : err);
    return null;
  }
}

module.exports = { sendPurchaseEvent };
