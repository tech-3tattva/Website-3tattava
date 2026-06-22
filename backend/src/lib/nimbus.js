"use strict";

/**
 * NimbusPost API helper
 *
 * Responsibilities:
 *  - Login + cached Bearer token (auto-refresh on 401)
 *  - 10 req/s rate limiter (token-bucket, non-blocking queue)
 *  - Thin wrappers around every endpoint used by the platform
 *
 * Required env vars:
 *   NP_EMAIL      — NimbusPost seller account email
 *   NP_PASSWORD   — NimbusPost seller account password
 */

const BASE = "https://api.nimbuspost.com/v1";

// --------------------------------------------------------------------------
// Token-bucket rate limiter (10 req/s)
// --------------------------------------------------------------------------
let _tokens = 10;
let _lastRefill = Date.now();
const _queue = [];

function _refill() {
  const now = Date.now();
  const elapsed = (now - _lastRefill) / 1000;
  _tokens = Math.min(10, _tokens + elapsed * 10);
  _lastRefill = now;
}

async function _consume() {
  _refill();
  if (_tokens >= 1) {
    _tokens -= 1;
    return;
  }
  // Wait until a token is available
  await new Promise((resolve) => _queue.push(resolve));
}

// Drains queue every 100ms — simple tick to wake sleeping callers
setInterval(() => {
  _refill();
  while (_tokens >= 1 && _queue.length > 0) {
    _tokens -= 1;
    _queue.shift()();
  }
}, 100).unref();

// --------------------------------------------------------------------------
// Auth token cache
// --------------------------------------------------------------------------
let _bearerToken = null;
let _tokenExpiry = 0; // epoch ms

async function _login() {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.NP_EMAIL,
      password: process.env.NP_PASSWORD,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NimbusPost login failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  // NimbusPost returns { status: true, token: "..." }
  if (!data.token) throw new Error("NimbusPost login: no token in response");

  _bearerToken = data.token;
  // Treat token as valid for 23 hours (NP docs don't specify TTL, 24h is safe default)
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

  return _bearerToken;
}

async function _getToken() {
  if (_bearerToken && Date.now() < _tokenExpiry) return _bearerToken;
  return _login();
}

// --------------------------------------------------------------------------
// Core request helper
// --------------------------------------------------------------------------
async function _request(method, path, body, retry = true) {
  await _consume();

  const token = await _getToken();
  const url = `${BASE}${path}`;

  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);

  if (res.status === 401 && retry) {
    // Token expired mid-session — force re-login and retry once
    _bearerToken = null;
    _tokenExpiry = 0;
    return _request(method, path, body, false);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || data.error || JSON.stringify(data);
    const err = new Error(`NimbusPost ${method} ${path} → ${res.status}: ${msg}`);
    err.statusCode = res.status;
    err.npResponse = data;
    throw err;
  }

  return data;
}

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

/**
 * POST /v1/shipments
 * Creates a shipment and returns AWB, shipmentId, courierName, labelUrl.
 *
 * @param {object} payload  — See NimbusPost docs for full shape
 * @returns {object}        — NimbusPost response (includes .data.awb_number, .data.label)
 */
async function createShipment(payload) {
  return _request("POST", "/shipments", payload);
}

/**
 * POST /v1/shipments/track/bulk
 * @param {string[]} awbNumbers
 */
async function trackBulk(awbNumbers) {
  return _request("POST", "/shipments/track/bulk", { awb_numbers: awbNumbers });
}

/**
 * POST /v1/shipments/track
 * Single AWB tracking
 * @param {string} awbNumber
 */
async function trackSingle(awbNumber) {
  return _request("POST", "/shipments/track", { awb_number: awbNumber });
}

/**
 * POST /v1/shipments/cancel
 * @param {string[]} awbNumbers
 */
async function cancelShipments(awbNumbers) {
  return _request("POST", "/shipments/cancel", { awb_numbers: awbNumbers });
}

/**
 * GET /v1/courier/serviceability
 * @param {{ pickup_pincode, delivery_pincode, weight, cod }} params
 */
async function checkServiceability(params) {
  const qs = new URLSearchParams(params).toString();
  return _request("GET", `/courier/serviceability?${qs}`);
}

/**
 * GET /v1/ndr
 * Fetch NDR (Non-Delivery Report) list
 */
async function getNDRList() {
  return _request("GET", "/ndr");
}

/**
 * POST /v1/ndr/action
 * @param {{ awb_number, action, remarks }} payload
 */
async function ndrAction(payload) {
  return _request("POST", "/ndr/action", payload);
}

/**
 * POST /v1/manifests
 * Generate manifest for given AWBs
 * @param {string[]} awbNumbers
 */
async function createManifest(awbNumbers) {
  return _request("POST", "/manifests", { awb_numbers: awbNumbers });
}

module.exports = {
  createShipment,
  trackBulk,
  trackSingle,
  cancelShipments,
  checkServiceability,
  getNDRList,
  ndrAction,
  createManifest,
};
