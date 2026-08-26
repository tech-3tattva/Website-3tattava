/**
 * Issuing invoices and handing batches to Tally.
 *
 * Two rules hold this together:
 *
 * 1. An invoice is issued ONCE, when payment is captured, and never reissued.
 *    The figures are frozen onto the order because an invoice is a legal
 *    document -- it must keep showing what it showed when it was issued, even
 *    if a price or rate changes later.
 *
 * 2. An order is exported to Tally at most once. The historical orders were
 *    keyed into Tally by hand, so re-sending them would double-count revenue in
 *    the books. `tallyExportedAt` is the guard, and it is only stamped after a
 *    file has actually been generated.
 */

const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Counter = require("../models/Counter");
const series = require("./invoiceSeries");
const invoiceLib = require("./invoice");
const invoicePdf = require("./invoicePdf");
const tally = require("./tally");
const gst = require("./gst");
const mailer = require("./mailer");

/** Only a captured payment earns an invoice. Samples are documented separately
 *  (nil value) because they move stock without being a sale. */
function isInvoiceable(order) {
  if (!order) return false;
  if (order.status === "cancelled") return false;
  if (order.isSample) return true;
  return order.payment?.status === "captured";
}

/** Per-line HSN and rate, read from the catalogue at issue time.
 *
 *  Real order items carry `productId` (the catalogue _id as a string, written
 *  at checkout) but never `product`. Keying only on `product` therefore missed
 *  every real order and fell through to null HSN and the default rate, which
 *  silently defeats the per-product tax field. Resolve on whichever is set. */
function lineProductId(item) {
  return item.product || item.productId || null;
}

async function rateResolver(orders) {
  const ids = new Set();
  for (const order of orders) {
    for (const item of order.items || []) {
      const id = lineProductId(item);
      if (id && mongoose.Types.ObjectId.isValid(String(id))) ids.add(String(id));
    }
  }
  const products = ids.size
    ? await Product.find({ _id: { $in: [...ids] } }).select("hsnCode gstRatePercent").lean().exec()
    : [];
  const byId = new Map(products.map((p) => [String(p._id), p]));

  return (item) => {
    const product = byId.get(String(lineProductId(item)));
    return {
      hsnCode: product?.hsnCode ?? null,
      // Fall back to the catalogue default rather than zero: silently issuing a
      // zero-tax invoice is worse than a rate that can be corrected.
      gstRatePercent: product?.gstRatePercent ?? 5,
    };
  };
}

/**
 * Issues an invoice for one order, or returns the existing one.
 *
 * The number is allocated from an atomic counter only after we know the order
 * qualifies, so abandoned checkouts never burn a number and leave a gap.
 *
 * `options` exists only for the historical backfill (scripts/backfill-invoices.js)
 * and defaults to normal live behaviour:
 *   - `number`: record this exact invoice number instead of allocating from the
 *     website counter. Used to mirror a sale already keyed into Tally under the
 *     owner's own series, so one supply keeps one number across both books.
 *   - `allowCancelledIfPaid`: issue for a status==="cancelled" order whose
 *     payment is nonetheless captured -- a real paid sale whose courier shipment
 *     was cancelled afterwards. The guard still refuses everything else.
 */
async function issueInvoice(orderId, { number: forcedNumber = null, allowCancelledIfPaid = false } = {}) {
  const order = await Order.findById(orderId).exec();
  if (!order) throw new Error("Order not found");
  if (order.invoice?.number) return { order, invoiceNumber: order.invoice.number, created: false };
  if (!isInvoiceable(order)) {
    const paidButCancelled =
      allowCancelledIfPaid && order.status === "cancelled" && order.payment?.status === "captured";
    if (!paidButCancelled) {
      throw new Error(`Order ${order.orderNumber} is not invoiceable (status ${order.status}, payment ${order.payment?.status})`);
    }
  }

  const issuedAt = order.payment?.capturedAt || order.createdAt || new Date();
  let number;
  if (forcedNumber) {
    series.assertValid(forcedNumber);
    number = forcedNumber;
  } else {
    const fy = series.financialYear(issuedAt);
    const sequence = await Counter.next(`invoice:${series.WEB_PREFIX}:${fy}`);
    number = series.formatInvoiceNumber({ sequence, date: issuedAt });
  }

  const rateFor = await rateResolver([order]);
  const built = invoiceLib.buildInvoice({
    order: order.toObject(),
    rateFor,
    invoiceNumber: number,
    invoiceDate: issuedAt,
  });

  order.invoice = {
    number,
    issuedAt,
    placeOfSupply: built.placeOfSupply,
    supplyType: built.supplyType,
    taxableValue: built.totals.taxableValue,
    cgst: built.totals.cgst,
    sgst: built.totals.sgst,
    igst: built.totals.igst,
    totalTax: built.totals.totalTax,
    lines: built.lines.map((l) => ({
      name: l.name,
      hsnCode: l.hsnCode,
      ratePercent: l.ratePercent,
      quantity: l.quantity,
      taxableValue: l.taxableValue,
      cgst: l.cgst,
      sgst: l.sgst,
      igst: l.igst,
    })),
  };
  // Keep the header figure consistent with the invoice that was issued.
  order.gstAmount = built.totals.totalTax;

  await order.save();

  // Issuing never emails. The customer receives exactly one message -- the
  // order confirmation with this invoice attached -- sent by onPaymentCaptured.
  // (An admin re-issuing from the panel must not re-notify the customer either.)
  return { order, invoiceNumber: number, created: true, invoice: built };
}

/** Rebuilds the printable invoice from an order that already has one. */
async function renderExisting(order) {
  const rateFor = await rateResolver([order]);
  return invoiceLib.buildInvoice({
    order: order.toObject ? order.toObject() : order,
    rateFor,
    invoiceNumber: order.invoice.number,
    invoiceDate: order.invoice.issuedAt,
  });
}

/**
 * Orders that carry an invoice and have not yet been handed to Tally.
 *
 * `from`/`to` filter on the invoice date, not the order date, because the books
 * are organised by when the invoice was issued.
 */
async function pendingForTally({ from, to } = {}) {
  const query = { "invoice.number": { $exists: true }, tallyExportedAt: { $exists: false } };
  if (from || to) {
    query["invoice.issuedAt"] = {};
    if (from) query["invoice.issuedAt"].$gte = new Date(from);
    if (to) query["invoice.issuedAt"].$lte = new Date(to);
  }
  return Order.find(query).sort({ "invoice.issuedAt": 1 }).exec();
}

/**
 * Builds the Tally file for everything pending.
 *
 * `commit: false` is the default so the file can be previewed without marking
 * anything exported. Only an explicit commit stamps the orders, and it happens
 * after the XML exists -- never before, or a failure would silently strand
 * orders that never made it into the books.
 */
async function buildTallyBatch({ from, to, commit = false } = {}) {
  const orders = await pendingForTally({ from, to });
  if (!orders.length) {
    return { voucherCount: 0, xml: null, orders: [], batchId: null, committed: false };
  }

  const rateFor = await rateResolver(orders);
  const invoices = orders.map((order) =>
    invoiceLib.buildInvoice({
      order: order.toObject(),
      rateFor,
      invoiceNumber: order.invoice.number,
      invoiceDate: order.invoice.issuedAt,
    }),
  );

  const out = tally.buildTallyXml({ invoices });
  const batchId = `TALLY-${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`;

  if (commit) {
    const now = new Date();
    await Order.updateMany(
      { _id: { $in: orders.map((o) => o._id) } },
      { $set: { tallyExportedAt: now, tallyBatchId: batchId } },
    ).exec();
  }

  return {
    ...out,
    batchId,
    committed: commit,
    orders: orders.map((o) => ({
      orderNumber: o.orderNumber,
      invoiceNumber: o.invoice.number,
      issuedAt: o.invoice.issuedAt,
      total: o.total,
    })),
  };
}

/**
 * GST summary for a period, from the frozen invoice figures.
 *
 * Reads what the invoices actually said rather than recomputing from current
 * prices, so the summary always reconciles to the documents the customer holds.
 */
async function gstSummary({ from, to }) {
  const query = { "invoice.number": { $exists: true } };
  if (from || to) {
    query["invoice.issuedAt"] = {};
    if (from) query["invoice.issuedAt"].$gte = new Date(from);
    if (to) query["invoice.issuedAt"].$lte = new Date(to);
  }
  const orders = await Order.find(query).sort({ "invoice.issuedAt": 1 }).lean().exec();

  const hsn = new Map();
  const totals = { taxableValue: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0, invoiceTotal: 0 };
  let sales = 0;
  let samples = 0;

  for (const order of orders) {
    const inv = order.invoice;
    totals.taxableValue = gst.round2(totals.taxableValue + (inv.taxableValue || 0));
    totals.cgst = gst.round2(totals.cgst + (inv.cgst || 0));
    totals.sgst = gst.round2(totals.sgst + (inv.sgst || 0));
    totals.igst = gst.round2(totals.igst + (inv.igst || 0));
    totals.totalTax = gst.round2(totals.totalTax + (inv.totalTax || 0));
    totals.invoiceTotal = gst.round2(totals.invoiceTotal + (order.total || 0));
    if (order.isSample) samples += 1;
    else sales += 1;

    for (const line of inv.lines || []) {
      const key = `${line.hsnCode || "-"}|${line.ratePercent}`;
      const row = hsn.get(key) || {
        hsnCode: line.hsnCode,
        ratePercent: line.ratePercent,
        quantity: 0,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
      };
      row.quantity += line.quantity || 0;
      row.taxableValue = gst.round2(row.taxableValue + (line.taxableValue || 0));
      row.cgst = gst.round2(row.cgst + (line.cgst || 0));
      row.sgst = gst.round2(row.sgst + (line.sgst || 0));
      row.igst = gst.round2(row.igst + (line.igst || 0));
      hsn.set(key, row);
    }
  }

  return {
    period: { from: from || null, to: to || null },
    invoiceCount: orders.length,
    salesCount: sales,
    sampleCount: samples,
    totals,
    hsnSummary: [...hsn.values()],
    // Named to match what the CA fills in, so the mapping is obvious.
    gstr1: {
      b2cSmallTaxableValue: totals.taxableValue,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
    },
  };
}

/**
 * Everything that must happen exactly once when a payment is captured.
 *
 * Called from BOTH announcements of the same event: the browser hitting
 * verify-cashfree on redirect, and Cashfree's webhook. Previously each sent its
 * own confirmation from a different template, so whichever arrived second
 * produced a duplicate email -- the browser path checked whether payment was
 * already captured, the webhook did not.
 *
 * The send is claimed atomically before it goes out: findOneAndUpdate only
 * matches an order with no confirmationSentAt, so of two concurrent callers
 * exactly one wins. On a genuine send failure the claim is released so a
 * webhook retry can try again -- losing a customer's invoice is worse than a
 * rare duplicate.
 */
async function onPaymentCaptured(orderId) {
  const result = { invoice: null, email: null };

  // Issue first: the invoice must exist before it can be attached, and
  // issueInvoice is itself idempotent.
  try {
    const issued = await issueInvoice(orderId);
    result.invoice = { number: issued.invoiceNumber, created: issued.created };
  } catch (err) {
    // A missing invoice must not stop the customer being told they paid.
    result.invoice = { error: err.message };
  }

  const claimed = await Order.findOneAndUpdate(
    { _id: orderId, confirmationSentAt: { $exists: false } },
    { $set: { confirmationSentAt: new Date() } },
    { new: true },
  ).exec();

  if (!claimed) {
    result.email = { skipped: "confirmation already sent" };
    return result;
  }

  const to = claimed.shippingAddress?.email || claimed.guestEmail;
  if (!to || /@offline\.3tattava\.local$/i.test(to)) {
    result.email = { skipped: "no real email address" };
    return result;
  }

  try {
    const built = claimed.invoice?.number ? await renderExisting(claimed) : null;
    const pdf = built ? await invoicePdf.renderInvoicePdf(built) : null;
    const sent = await mailer.sendOrderConfirmation({
      to,
      order: claimed,
      invoice: built,
      invoicePdf: pdf,
    });
    await Order.updateOne({ _id: orderId }, { $set: { confirmationMessageId: sent.messageId || null } }).exec();
    result.email = sent;
  } catch (err) {
    // Release the claim so a webhook retry can send it.
    await Order.updateOne({ _id: orderId }, { $unset: { confirmationSentAt: "" } }).exec();
    console.error(`[invoice-email] ${claimed.orderNumber} failed, claim released:`, err.message);
    result.email = { error: err.message };
  }

  return result;
}

module.exports = {
  isInvoiceable,
  // Exported so the historical backfill can render an identical dry-run preview
  // (same HSN/rate resolution) without writing anything.
  rateResolver,
  issueInvoice,
  renderExisting,
  pendingForTally,
  buildTallyBatch,
  gstSummary,
  onPaymentCaptured,
};
