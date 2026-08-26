/**
 * Backfill tax invoices for the real production customer orders that were paid
 * before invoicing existed.
 *
 * There are exactly two genuine customer sales on the website (everything else
 * is a doctor sample or a pre-launch test). Neither has an invoice yet. This
 * script issues them, reusing the SAME code path as a live order
 * (invoicing.issueInvoice + lib/invoice + lib/gst), so the figures are computed
 * identically -- tax back-calculated OUT of the inclusive price, at the
 * per-product 5% rate, so the customer's total never moves.
 *
 * READ THIS BEFORE RUNNING WITH --commit
 * --------------------------------------
 * 1. Tushar Shirgave (3T-1786671774243, Maharashtra -> IGST)
 *    Payment IS captured (Cashfree cfPaymentId 6234874959, Rs 1,100 -- the whole
 *    of the website's recorded revenue). The ORDER status is "cancelled" only
 *    because the NimbusPost shipment was cancelled; the money stands and the
 *    sale is ALREADY booked in Tally by hand as voucher 3T/2026-27/039.
 *      - We consciously override the "cancelled" guard (allowCancelledIfPaid).
 *      - We record the invoice under the number Tally already holds
 *        (3T/2026-27/039) so the sale keeps ONE invoice number across both
 *        books. Set useExistingNumber:null to instead allocate a fresh website
 *        number 3TW/26-27/NNNN (this would give the one sale two numbers).
 *      - We pre-mark it exported (tallyExportedAt) so the first website->Tally
 *        download can never re-send it and double-count revenue.
 *
 * 2. Aayushi Bubna (3T-1786893481633, Delhi -> CGST+SGST)
 *    Payment is "pending": there is a Cashfree order but NO capture and NO
 *    cfPaymentId, and Rs 999 is NOT part of the recorded revenue. A tax invoice
 *    presumes a completed, paid supply, so this order is BLOCKED until the real
 *    payment is confirmed. If she paid off-gateway (UPI/bank/COD), fill in
 *    `recordPayment` below with the true date/method/reference; the script will
 *    then record the payment and issue. Left null, it refuses to invoice her.
 *
 * PREREQUISITE
 *    Run scripts/set-product-gst.js --commit first, or the invoice lines freeze
 *    a null HSN (the live product docs predate the hsnCode field).
 *
 * USAGE
 *    node src/scripts/backfill-invoices.js                    # dry run (default)
 *    node src/scripts/backfill-invoices.js --commit --confirm # apply
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoose = require("mongoose");
const Order = require("../models/Order");
const Counter = require("../models/Counter");
const invoicing = require("../lib/invoicing");
const invoiceLib = require("../lib/invoice");
const series = require("../lib/invoiceSeries");

const COMMIT = process.argv.includes("--commit");
const CONFIRM = process.argv.includes("--confirm");

/* ── The plan. Edit these directives, review the dry run, then commit. ─────── */
const PLAN = [
  {
    orderNumber: "3T-1786671774243",
    who: "Tushar Shirgave",
    allowCancelledIfPaid: true,
    useExistingNumber: "3T/2026-27/039",
    markExported: "Already entered in Tally by hand as 3T/2026-27/039",
    recordPayment: null,
  },
  {
    orderNumber: "3T-1786893481633",
    who: "Aayushi Bubna",
    allowCancelledIfPaid: false,
    useExistingNumber: null, // fresh website number 3TW/26-27/NNNN
    markExported: null,
    // Payment is pending. To issue, confirm the real payment here, e.g.:
    //   recordPayment: { capturedAt: "2026-08-17", method: "upi", reference: "..." }
    recordPayment: null,
  },
];

const rupees = (n) => `Rs ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const maskUri = () => (process.env.MONGODB_URI || "(unset)").replace(/\/\/([^:@/]+):[^@/]*@/, "//$1:***@");

async function previewNumber(directive, issuedAt) {
  if (directive.useExistingNumber) return { number: directive.useExistingNumber, provisional: false };
  const fy = series.financialYear(issuedAt);
  const seq = (await Counter.peek(`invoice:${series.WEB_PREFIX}:${fy}`)) + 1;
  return { number: series.formatInvoiceNumber({ sequence: seq, date: issuedAt }), provisional: true };
}

function issuedAtOf(order) {
  return order.payment?.capturedAt || order.createdAt || new Date();
}

async function processOne(directive) {
  console.log("\n" + "─".repeat(72));
  console.log(`  ${directive.who}   (${directive.orderNumber})`);
  console.log("─".repeat(72));

  const order = await Order.findOne({ orderNumber: directive.orderNumber }).exec();
  if (!order) {
    console.log("  ✗ ORDER NOT FOUND — skipped.");
    return { orderNumber: directive.orderNumber, outcome: "not-found" };
  }

  const addr = order.shippingAddress || {};
  console.log(`  status         : ${order.status}`);
  console.log(`  payment.status : ${order.payment?.status}   capturedAt ${order.payment?.capturedAt ? new Date(order.payment.capturedAt).toISOString() : "—"}   cfPaymentId ${order.payment?.cashfree?.cfPaymentId || "—"}`);
  console.log(`  isSample/isTest: ${!!order.isSample} / ${!!order.isTest}`);
  console.log(`  place of supply: ${addr.state || "—"}  pincode ${addr.pincode || "—"}`);
  console.log(`  order total    : ${rupees(order.total)}   (discount ${rupees(order.discountAmount)}, shipping ${rupees(order.shippingFee)})`);

  // Idempotency: never reissue.
  if (order.invoice?.number) {
    console.log(`  ✓ ALREADY ISSUED as ${order.invoice.number} (issued ${order.invoice.issuedAt ? new Date(order.invoice.issuedAt).toISOString().slice(0, 10) : "?"}) — skipped.`);
    console.log(`    tallyExportedAt: ${order.invoice ? order.tallyExportedAt || "—" : "—"}`);
    return { orderNumber: directive.orderNumber, outcome: "already-issued", number: order.invoice.number };
  }

  // Blocker: pending payment.
  const needsPayment = order.payment?.status !== "captured" && !order.isSample;
  if (needsPayment && !directive.recordPayment) {
    console.log("  ⛔ BLOCKED: payment is not captured and no `recordPayment` was supplied.");
    console.log("     A tax invoice presumes a paid supply. Confirm how/when this was paid");
    console.log("     (fill recordPayment) or leave it uninvoiced. Nothing will be written.");
    return { orderNumber: directive.orderNumber, outcome: "blocked-unpaid" };
  }

  // Blocker: cancelled without a conscious override.
  if (order.status === "cancelled" && !directive.allowCancelledIfPaid) {
    console.log("  ⛔ BLOCKED: order is cancelled and allowCancelledIfPaid is not set.");
    return { orderNumber: directive.orderNumber, outcome: "blocked-cancelled" };
  }

  const issuedAt = issuedAtOf(order);
  const { number, provisional } = await previewNumber(directive, issuedAt);

  // Build the exact invoice that would be frozen, using the live resolver.
  const rateFor = await invoicing.rateResolver([order]);
  const built = invoiceLib.buildInvoice({
    order: order.toObject(),
    rateFor,
    invoiceNumber: number,
    invoiceDate: issuedAt,
  });

  console.log("");
  console.log(`  → invoice number : ${number}${provisional ? "  (provisional — allocated atomically on commit)" : "  (recorded from Tally's own series)"}`);
  console.log(`    issue date     : ${new Date(issuedAt).toISOString().slice(0, 10)}`);
  console.log(`    place of supply: ${built.placeOfSupply || "UNRESOLVED"}   supply type: ${built.supplyType || "?"}`);
  if (built.unresolvedState) console.log("    ⚠ STATE DID NOT RESOLVE — tax head cannot be trusted. Fix the address state first.");
  for (const l of built.lines) {
    console.log(`    line: ${l.name}  x${l.quantity}  HSN ${l.hsnCode || "∅(null!)"}  @${l.ratePercent}%`);
    console.log(`          taxable ${rupees(l.taxableValue)}  cgst ${rupees(l.cgst)}  sgst ${rupees(l.sgst)}  igst ${rupees(l.igst)}  line total ${rupees(l.inclusiveTotal)}`);
  }
  console.log(`    TOTALS: taxable ${rupees(built.totals.taxableValue)}  CGST ${rupees(built.totals.cgst)}  SGST ${rupees(built.totals.sgst)}  IGST ${rupees(built.totals.igst)}`);
  console.log(`            total tax ${rupees(built.totals.totalTax)}   invoice total ${rupees(built.totals.invoiceTotal)}  (customer paid ${rupees(order.total)})`);
  if (built.lines.some((l) => !l.hsnCode)) {
    console.log("    ⚠ HSN is null — run scripts/set-product-gst.js --commit first so the line freezes a real HSN.");
  }

  console.log("\n  WOULD WRITE:");
  if (directive.recordPayment) {
    console.log(`    payment.status  = captured   capturedAt = ${directive.recordPayment.capturedAt}   method = ${directive.recordPayment.method}`);
  }
  console.log(`    invoice.number  = ${number}   invoice.issuedAt = ${new Date(issuedAt).toISOString().slice(0, 10)}`);
  console.log(`    invoice.{taxableValue,cgst,sgst,igst,totalTax,lines}  +  gstAmount = ${built.totals.totalTax}`);
  if (directive.markExported) {
    console.log(`    tallyExportedAt = now   tallyBatchId = "BACKFILL-MANUAL"   (reason: ${directive.markExported})`);
    console.log("    => EXCLUDED from the next website->Tally download (cannot double-count).");
  } else {
    console.log("    tallyExportedAt = (unset)  => INCLUDED in the next website->Tally download.");
  }

  if (!COMMIT) {
    console.log("\n  (dry run — nothing written)");
    return { orderNumber: directive.orderNumber, outcome: "dry-preview", number };
  }

  // ── COMMIT ────────────────────────────────────────────────────────────────
  if (directive.recordPayment) {
    order.payment = order.payment || {};
    order.payment.status = "captured";
    order.payment.capturedAt = new Date(directive.recordPayment.capturedAt);
    if (directive.recordPayment.method) order.payment.method = directive.recordPayment.method;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: order.status,
      note: `Payment recorded via backfill: ${directive.recordPayment.method || "manual"} ${directive.recordPayment.reference || ""}`.trim(),
      updatedBy: "backfill-script",
      timestamp: new Date(),
    });
    await order.save();
  }

  const result = await invoicing.issueInvoice(order._id, {
    number: directive.useExistingNumber || null,
    allowCancelledIfPaid: !!directive.allowCancelledIfPaid,
  });

  if (directive.markExported) {
    await Order.updateOne(
      { _id: order._id },
      { $set: { tallyExportedAt: new Date(), tallyBatchId: "BACKFILL-MANUAL" } },
    ).exec();
  }

  const fresh = await Order.findById(order._id).lean().exec();
  console.log(`\n  ✓ WRITTEN: invoice ${result.invoiceNumber} (created=${result.created})`);
  console.log(`    stored invoice.totalTax=${fresh.invoice.totalTax}  gstAmount=${fresh.gstAmount}  tallyExportedAt=${fresh.tallyExportedAt || "—"}`);
  return { orderNumber: directive.orderNumber, outcome: "issued", number: result.invoiceNumber };
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);
  const conn = mongoose.connection;

  console.log("=".repeat(72));
  console.log(`  backfill-invoices  [${COMMIT ? (CONFIRM ? "COMMIT — WILL WRITE" : "COMMIT REQUESTED but --confirm missing") : "DRY RUN — no writes"}]`);
  console.log(`  target DB : ${conn.host}:${conn.port}/${conn.name}`);
  console.log(`  uri       : ${maskUri()}`);
  console.log("=".repeat(72));

  if (COMMIT && !CONFIRM) {
    console.log("\nRefusing to write without --confirm. Re-run with:  --commit --confirm");
    await mongoose.disconnect();
    process.exit(2);
  }

  const results = [];
  for (const directive of PLAN) results.push(await processOne(directive));

  // Show what the next website->Tally download would contain now.
  const pending = await invoicing.pendingForTally();
  console.log("\n" + "=".repeat(72));
  console.log("  Next website->Tally download would contain:");
  if (!pending.length) console.log("    (nothing pending)");
  for (const o of pending) console.log(`    ${o.invoice.number}  ${o.orderNumber}  ${rupees(o.total)}`);
  console.log("\n  Summary:");
  for (const r of results) console.log(`    ${r.orderNumber}  ${r.outcome}${r.number ? "  " + r.number : ""}`);
  console.log("=".repeat(72));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
