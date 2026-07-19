"use strict";

/**
 * NimbusPost api-v2 client — https://api-v2.nimbuspost.com
 *
 * Auth: `x-api-key` + `x-api-secret` headers (Settings -> API -> Generate API Key).
 *
 * Shipping model:
 *   - We AUTO-CREATE the order in NimbusPost when payment is captured
 *     (POST /orders/api/v1/orders -> order_status "created").
 *   - The ops team assigns a courier + generates the AWB from the NimbusPost
 *     dashboard (bulk-ship). Auto-assigning couriers is intentionally NOT done
 *     server-side: it is an async, wallet-charging batch operation and belongs
 *     to a human review step.
 *   - Tracking (AWB, status, delivery timestamps) is read back from the order
 *     detail (GET /orders/api/v1/orders/:id) and/or the tracking webhook.
 *
 * Everything is env-gated: with NP_API_KEY / NP_API_SECRET unset, isConfigured()
 * is false and callers skip NimbusPost cleanly (shipping stays manual).
 */

const BASE = (process.env.NP_API_BASE || "https://api-v2.nimbuspost.com").replace(/\/$/, "");

function creds() {
  return {
    key: process.env.NP_API_KEY || "",
    secret: process.env.NP_API_SECRET || "",
    warehouseId: process.env.NP_WAREHOUSE_ID || "",
  };
}

function isConfigured() {
  const { key, secret } = creds();
  return Boolean(key && secret);
}

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
  return new Promise((resolve) => {
    const attempt = () => {
      _refill();
      if (_tokens >= 1) {
        _tokens -= 1;
        resolve();
      } else {
        _queue.push(attempt);
      }
    };
    attempt();
  });
}

setInterval(() => {
  _refill();
  while (_tokens >= 1 && _queue.length) {
    _queue.shift()();
  }
}, 100).unref();

// --------------------------------------------------------------------------
// Core request helper
// --------------------------------------------------------------------------
async function _request(method, path, body) {
  if (!isConfigured()) {
    const err = new Error("NimbusPost not configured (NP_API_KEY / NP_API_SECRET missing)");
    err.statusCode = 503;
    throw err;
  }
  await _consume();
  const { key, secret } = creds();
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "x-api-secret": secret,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok || json?.success === false) {
    const detail = json?.error?.detail || json?.message || text || `HTTP ${res.status}`;
    const err = new Error(`NimbusPost ${method} ${path} -> ${res.status}: ${detail}`);
    err.statusCode = res.status;
    err.detail = detail;
    throw err;
  }
  return json;
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
// api-v2 expects weight in KG. Order weights are often stored in grams.
function toKg(w) {
  const n = Number(w) || 0;
  if (!n) return 0.5;
  return n > 50 ? Number((n / 1000).toFixed(3)) : n; // > 50 => treat as grams
}

// api-v2 wants pincode/phone as plain numbers.
function digits(v) {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Build the api-v2 create-order payload from an Order document.
 */
function buildCreatePayload(order) {
  const { warehouseId } = creds();
  const addr = order.shippingAddress || {};

  let items = (order.items || []).map((it) => ({
    name: it.name || "3TATTAVA Ayurveda Product",
    quantity: Number(it.quantity) || 1,
    price: Number(it.price) || 0,
    sku: it.sku || it.slug || String(it.productId || it.product || "3T-ITEM"),
  }));
  if (!items.length) {
    items = [{ name: "3TATTAVA Ayurveda Product", quantity: 1, price: Number(order.total) || 0, sku: "3T-ITEM" }];
  }

  const line2 = addr.line2 ? `, ${addr.line2}` : "";

  return {
    order_type: "b2c",
    payment_mode: "prepaid", // all online orders are prepaid
    warehouse_id: warehouseId,
    order_number: order.orderNumber,
    shipping_address: {
      name: `${addr.firstName || ""} ${addr.lastName || ""}`.trim() || "Customer",
      address: `${addr.line1 || ""}${line2}`.trim() || "Address",
      city: addr.city || "",
      state: addr.state || "",
      pincode: digits(addr.pincode),
      phone: digits(addr.phone),
      email: addr.email || order.guestEmail || "",
      country: addr.country || "India",
    },
    items,
    package: {
      weight: toKg(order.packageWeightGrams),
      length: 15,
      width: 12,
      height: 8,
    },
  };
}

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

/**
 * Create the order in NimbusPost (status "created" — no AWB yet).
 * @param {Object} order — Order mongoose document
 * @returns {Promise<{nimbusOrderId,nimbusOrderNumber,awbNumber,courierName,labelUrl,status}>}
 */
async function createShipmentForOrder(order) {
  const payload = buildCreatePayload(order);
  const resp = await _request("POST", "/orders/api/v1/orders", payload);
  const d = resp.data || {};
  const sh = d.shipment || {};
  return {
    nimbusOrderId: d.order_id || "",
    nimbusOrderNumber: d.order_number || "",
    awbNumber: sh.awb || "",
    courierName: sh.courier_name || "",
    labelUrl: sh.label_url || "",
    status: d.order_status || "created",
  };
}

function normalizeTracking(d) {
  const sh = d.shipment || {};
  const checkpoints = [];
  if (sh.picked_at) checkpoints.push({ status: "Picked up", location: sh.zone || "", timestamp: new Date(sh.picked_at), remarks: "" });
  if (sh.ofd_at) checkpoints.push({ status: "Out for delivery", location: "", timestamp: new Date(sh.ofd_at), remarks: "" });
  if (sh.delivered_at) checkpoints.push({ status: "Delivered", location: "", timestamp: new Date(sh.delivered_at), remarks: "" });
  return {
    nimbusOrderId: d.order_id || "",
    orderNumber: d.order_number || "",
    awbNumber: sh.awb || "",
    currentStatus: d.order_status || "",
    courierName: sh.courier_name || "",
    labelUrl: sh.label_url || "",
    edd: sh.edd || null,
    checkpoints,
  };
}

/**
 * Fetch a single NimbusPost order (for tracking) by its order_id.
 */
async function getOrder(nimbusOrderId) {
  const resp = await _request("GET", `/orders/api/v1/orders/${encodeURIComponent(nimbusOrderId)}`);
  return normalizeTracking(resp.data || {});
}

/**
 * Track multiple NimbusPost orders by their order_ids.
 * @param {string[]} ids
 */
async function trackByOrderIds(ids) {
  const out = [];
  for (const id of ids) {
    if (!id) continue;
    try {
      out.push(await getOrder(id));
    } catch (e) {
      out.push({ nimbusOrderId: id, error: e.message });
    }
  }
  return out;
}

/**
 * Cancel NimbusPost orders by their order_ids.
 * @param {string[]} ids
 */
async function cancelByOrderIds(ids) {
  const out = [];
  for (const id of ids) {
    if (!id) continue;
    try {
      await _request("POST", `/orders/api/v1/orders/${encodeURIComponent(id)}/cancel`, {});
      out.push({ id, cancelled: true });
    } catch (e) {
      out.push({ id, cancelled: false, error: e.message });
    }
  }
  return out;
}

/**
 * Rate / serviceability check (best-effort). Returns courier options or an
 * { error } object — never throws, so a checkout pincode check degrades safely.
 * @param {{pickup_pincode,delivery_pincode,weight,cod,codAmount}} params
 */
async function checkServiceability({ pickup_pincode, delivery_pincode, weight = 0.5, cod = false, codAmount = 0 } = {}) {
  try {
    const resp = await _request("POST", "/allocation/api/v1/rate-calculator", {
      pickupPincode: digits(pickup_pincode),
      deliveryPincode: digits(delivery_pincode),
      paymentMode: cod ? "cod" : "prepaid",
      codAmount: Number(codAmount) || 0,
      packages: [{ weight: toKg(weight), length: 15, width: 12, height: 8 }],
    });
    return resp.data || resp;
  } catch (e) {
    return { serviceable: false, error: e.message };
  }
}

module.exports = {
  isConfigured,
  buildCreatePayload,
  createShipmentForOrder,
  getOrder,
  trackByOrderIds,
  cancelByOrderIds,
  checkServiceability,
};
