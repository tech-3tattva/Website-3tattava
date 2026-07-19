"use strict";

/**
 * Cashfree Payment Gateway client (cashfree-pg SDK).
 *
 * Env-gated: if the client id/secret are missing, empty, or still the
 * "xxxx" template placeholder, getCashfree() returns null and callers
 * respond 503 instead of crashing.
 *
 * Required env vars:
 *   CASHFREE_CLIENT_ID       — Cashfree App ID
 *   CASHFREE_CLIENT_SECRET   — Cashfree Secret Key
 *   CASHFREE_ENVIRONMENT     — SANDBOX (default) | PRODUCTION
 */

const { Cashfree, CFEnvironment } = require("cashfree-pg");

// Pinned Cashfree API version used for every request.
const CASHFREE_API_VERSION = "2025-01-01";

/** A value is usable only if present, non-empty, and not a template placeholder. */
function isConfigured(value) {
  if (!value) return false;
  const v = String(value).trim();
  if (!v) return false;
  if (/placeholder/i.test(v)) return false;
  if (/x{4,}/i.test(v)) return false; // "xxxxxxxx" .env template placeholder
  return true;
}

/**
 * Build a configured Cashfree client from env, or null when creds are absent.
 * Returning null lets callers respond 503 instead of crashing on checkout.
 */
function getCashfree() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  if (!isConfigured(clientId) || !isConfigured(clientSecret)) return null;

  const environment =
    String(process.env.CASHFREE_ENVIRONMENT || "SANDBOX").toUpperCase() === "PRODUCTION"
      ? CFEnvironment.PRODUCTION
      : CFEnvironment.SANDBOX;

  const cf = new Cashfree(environment, clientId, clientSecret);
  cf.XApiVersion = CASHFREE_API_VERSION;
  return cf;
}

/** Create a Cashfree order. Returns the order entity, or null if unconfigured. */
async function createOrder(payload) {
  const cf = getCashfree();
  if (!cf) return null;
  const { data } = await cf.PGCreateOrder(payload);
  return data;
}

/** Fetch a Cashfree order by its merchant order_id. Returns null if unconfigured. */
async function fetchOrder(cfOrderId) {
  const cf = getCashfree();
  if (!cf) return null;
  const { data } = await cf.PGFetchOrder(cfOrderId);
  return data;
}

module.exports = { getCashfree, createOrder, fetchOrder, CASHFREE_API_VERSION };
