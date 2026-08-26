/**
 * Builds a GST tax invoice from an order.
 *
 * Field list is driven by Rule 46 of the CGST Rules — the mandatory particulars
 * of a tax invoice. Anything missing here is a defective invoice, so the shape
 * is deliberate rather than cosmetic:
 *
 *   - "Tax Invoice" heading, invoice number and date
 *   - supplier name, address and GSTIN
 *   - recipient name and address
 *   - place of supply with its state code (decides CGST+SGST vs IGST)
 *   - per line: description, HSN, quantity, rate, taxable value, tax rate/amount
 *   - total tax and total invoice value
 *   - value in words
 *   - whether tax is payable on reverse charge
 *   - signature block
 *
 * Tax figures come from lib/gst.js, which back-calculates out of the
 * tax-inclusive price so the customer's total never moves.
 */

const gst = require("./gst");

/** Seller particulars. Must match the Google Business Profile and the GST
 *  registration exactly — mismatched addresses across sources are what turn a
 *  routine query into a full assessment. */
const SELLER = {
  legalName: "SankalpaSiddhi Ayupharma Pvt. Ltd.",
  tradeName: "3TATTAVA",
  // Espresso wordmark for the white invoice sheet (absolute URL for the HTML
  // view; the PDF embeds the same artwork from src/assets/logo).
  logoUrl: "https://www.3tattava.com/logos/logo-full-espresso.png",
  gstin: "07ABSCS9652C1ZU",
  address: ["690A/1, Kabool Nagar", "Shahdara, Delhi 110032"],
  stateName: "Delhi",
  stateCode: "07",
  email: "support@3tattava.com",
  phone: "+91-95601-49956",

  // The COMPANY name as it exists inside TallyPrime, which is not necessarily
  // the Cloud Access account name ("SANKALPASIDDHI AYUPHARMA PVT LTD") and not
  // necessarily the legal name printed above. Tally's XML import matches this
  // string exactly and fails silently-ish on a mismatch, so it must be read off
  // the running Tally session rather than assumed.
  tallyCompanyName: process.env.TALLY_COMPANY_NAME || null,
};

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`;
}

/**
 * Rupees in words using the Indian numbering system (crore/lakh/thousand),
 * because "Rupees One Lakh Twenty Thousand" is what an Indian invoice must read
 * — not "One Hundred Twenty Thousand".
 */
function amountInWords(amount) {
  const rounded = gst.round2(Number(amount) || 0);
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && paise === 0) return "Rupees Zero Only";

  const parts = [];
  let left = rupees;
  const crore = Math.floor(left / 10000000); left %= 10000000;
  const lakh = Math.floor(left / 100000); left %= 100000;
  const thousand = Math.floor(left / 1000); left %= 1000;
  const hundred = Math.floor(left / 100); left %= 100;

  if (crore) parts.push(`${twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (left) parts.push(twoDigits(left));

  let words = `Rupees ${parts.join(" ")}`.replace(/\s+/g, " ").trim();
  if (paise) words += ` and ${twoDigits(paise)} Paise`;
  return `${words} Only`;
}

/**
 * Assembles the invoice.
 *
 * `order` is a plain order document. `rateFor` resolves a line's GST rate and
 * HSN from the catalogue — passed in rather than looked up here so this stays
 * synchronous and unit-testable.
 *
 * Discounts are apportioned across lines in proportion to line value, because
 * an order-level discount has to land somewhere for the taxable value to be
 * correct per line.
 */
function buildInvoice({ order, rateFor, invoiceNumber, invoiceDate }) {
  const address = order.shippingAddress || {};

  const rawLines = (order.items || []).map((item) => {
    const meta = rateFor(item) || {};
    return {
      name: item.name,
      hsnCode: meta.hsnCode || null,
      ratePercent: Number(meta.gstRatePercent) || 0,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.price) || 0,
      gross: gst.round2((Number(item.price) || 0) * (Number(item.quantity) || 0)),
    };
  });

  const grossTotal = gst.round2(rawLines.reduce((sum, l) => sum + l.gross, 0));
  const discount = gst.round2(Number(order.discountAmount) || 0);

  // Apportion the discount by line share. The last line absorbs the rounding
  // remainder so the apportioned amounts sum exactly to the discount.
  let allocated = 0;
  const lines = rawLines.map((line, index) => {
    const isLast = index === rawLines.length - 1;
    let lineDiscount;
    if (discount <= 0 || grossTotal <= 0) {
      lineDiscount = 0;
    } else if (isLast) {
      lineDiscount = gst.round2(discount - allocated);
    } else {
      lineDiscount = gst.round2((line.gross / grossTotal) * discount);
      allocated = gst.round2(allocated + lineDiscount);
    }
    return { ...line, discount: lineDiscount, lineTotal: gst.round2(line.gross - lineDiscount) };
  });

  const tax = gst.computeInvoiceTax({
    lines: lines.map((l) => ({ lineTotal: l.lineTotal, ratePercent: l.ratePercent, hsnCode: l.hsnCode })),
    stateInput: address.state,
    pincode: address.pincode,
  });

  const shippingFee = gst.round2(Number(order.shippingFee) || 0);
  const invoiceTotal = gst.round2(tax.invoiceTotal + shippingFee);

  const detailed = lines.map((line, i) => ({ ...line, ...tax.lines[i] }));

  return {
    seller: SELLER,
    invoiceNumber,
    invoiceDate: invoiceDate || order.createdAt,
    orderNumber: order.orderNumber,
    reverseCharge: false,
    buyer: {
      name: [address.firstName, address.lastName].filter(Boolean).join(" ") || "—",
      addressLines: [address.line1, address.line2].filter(Boolean),
      cityLine: [address.city, address.state, address.pincode].filter(Boolean).join(", "),
      phone: address.phone || null,
      email: address.email || order.guestEmail || null,
      // A B2C buyer has no GSTIN. Present so the field exists on the invoice.
      gstin: order.buyerGstin || null,
    },
    placeOfSupply: tax.placeOfSupply,
    supplyType: tax.supplyType,
    unresolvedState: tax.unresolvedState,
    lines: detailed,
    hsnSummary: tax.hsnSummary,
    totals: {
      taxableValue: tax.taxableValue,
      cgst: tax.cgst,
      sgst: tax.sgst,
      igst: tax.igst,
      totalTax: tax.totalTax,
      shippingFee,
      discount,
      invoiceTotal,
    },
    amountInWords: amountInWords(invoiceTotal),
    isSample: !!order.isSample,
  };
}

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/**
 * Renders the invoice as self-contained, print-ready A4 HTML.
 *
 * HTML rather than a PDF library: it prints to PDF identically from any
 * browser, stays diffable in review, and avoids a binary dependency for what is
 * ultimately a table.
 */
function renderInvoiceHtml(inv, { watermark } = {}) {
  const intra = inv.supplyType === "intra";

  const rows = inv.lines
    .map(
      (l, i) => `
      <tr>
        <td class="c">${i + 1}</td>
        <td>${esc(l.name)}${l.discount > 0 ? `<div class="sub">less discount ${money(l.discount)}</div>` : ""}</td>
        <td class="c mono">${esc(l.hsnCode || "—")}</td>
        <td class="c">${l.quantity}</td>
        <td class="r">${money(l.unitPrice)}</td>
        <td class="r">${money(l.taxableValue)}</td>
        <td class="c">${l.ratePercent}%</td>
        <td class="r">${money(intra ? l.cgst : 0)}</td>
        <td class="r">${money(intra ? l.sgst : 0)}</td>
        <td class="r">${money(intra ? 0 : l.igst)}</td>
        <td class="r">${money(l.inclusiveTotal)}</td>
      </tr>`,
    )
    .join("");

  const hsnRows = inv.hsnSummary
    .map(
      (h) => `
      <tr>
        <td class="mono">${esc(h.hsnCode || "—")}</td>
        <td class="c">${h.ratePercent}%</td>
        <td class="r">${money(h.taxableValue)}</td>
        <td class="r">${money(h.cgst)}</td>
        <td class="r">${money(h.sgst)}</td>
        <td class="r">${money(h.igst)}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Tax Invoice ${esc(inv.invoiceNumber)}</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1b1b1b; margin: 0; font-size: 11px; background: #fff; }
  .sheet { position: relative; max-width: 780px; margin: 0 auto; padding: 18px; border: 1px solid #cfcfcf; }
  .wm { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .wm span { font-size: 76px; font-weight: 800; color: rgba(200,60,60,0.11); transform: rotate(-24deg); letter-spacing: 4px; white-space: nowrap; }
  h1 { font-size: 15px; text-align: center; margin: 0 0 12px; letter-spacing: 2px; text-transform: uppercase; }
  .head { display: flex; justify-content: space-between; gap: 18px; border-bottom: 1px solid #d8d8d8; padding-bottom: 10px; }
  .brand { font-size: 16px; font-weight: 800; letter-spacing: 1px; }
  .muted { color: #5d5d5d; }
  .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; }
  .kv b { font-weight: 600; }
  .parties { display: flex; gap: 18px; margin: 12px 0; }
  .party { flex: 1 1 0; border: 1px solid #e2e2e2; padding: 9px; }
  .party h3 { margin: 0 0 5px; font-size: 9.5px; letter-spacing: 1.2px; text-transform: uppercase; color: #6a6a6a; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #d8d8d8; padding: 5px 6px; vertical-align: top; }
  th { background: #f4f2ed; font-size: 9px; letter-spacing: 0.5px; text-transform: uppercase; text-align: left; }
  .c { text-align: center; } .r { text-align: right; }
  .mono { font-family: ui-monospace, Menlo, monospace; font-size: 10px; }
  .sub { color: #7a7a7a; font-size: 9.5px; }
  tfoot td { background: #fbfaf7; font-weight: 600; }
  .words { margin-top: 9px; padding: 7px 9px; background: #fbfaf7; border: 1px solid #ececec; }
  .foot { display: flex; justify-content: space-between; gap: 18px; margin-top: 16px; }
  .decl { flex: 1 1 60%; font-size: 9.5px; color: #4a4a4a; line-height: 1.5; }
  .sign { flex: 0 0 34%; text-align: center; border: 1px solid #e2e2e2; padding: 9px; }
  .sign .space { height: 42px; }
  .flag { margin-top: 10px; padding: 7px 9px; border: 1px solid #e6b800; background: #fffbe8; font-size: 10px; }
  h2.sec { font-size: 9.5px; letter-spacing: 1.2px; text-transform: uppercase; color: #6a6a6a; margin: 16px 0 0; }
</style></head>
<body><div class="sheet">
  ${watermark ? `<div class="wm"><span>${esc(watermark)}</span></div>` : ""}
  <h1>Tax Invoice</h1>

  <div class="head">
    <div>
      <img src="${esc(inv.seller.logoUrl)}" alt="${esc(inv.seller.tradeName)}" style="height:44px;width:auto;display:block;margin-bottom:5px">
      <div class="muted">${esc(inv.seller.legalName)}</div>
      <div class="muted">${inv.seller.address.map(esc).join("<br>")}</div>
      <div class="muted">${esc(inv.seller.phone)} &middot; ${esc(inv.seller.email)}</div>
      <div style="margin-top:5px"><b>GSTIN:</b> <span class="mono">${esc(inv.seller.gstin)}</span></div>
      <div><b>State:</b> ${esc(inv.seller.stateName)} (${esc(inv.seller.stateCode)})</div>
    </div>
    <div class="kv" style="min-width:250px">
      <b>Invoice No.</b><span class="mono">${esc(inv.invoiceNumber)}</span>
      <b>Invoice Date</b><span>${new Date(inv.invoiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
      <b>Order No.</b><span class="mono">${esc(inv.orderNumber)}</span>
      <b>Place of Supply</b><span>${esc(inv.placeOfSupply || "—")}</span>
      <b>Supply Type</b><span>${intra ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"}</span>
      <b>Reverse Charge</b><span>${inv.reverseCharge ? "Yes" : "No"}</span>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Billed &amp; Shipped To</h3>
      <div><b>${esc(inv.buyer.name)}</b></div>
      ${inv.buyer.addressLines.map((l) => `<div class="muted">${esc(l)}</div>`).join("")}
      <div class="muted">${esc(inv.buyer.cityLine)}</div>
      ${inv.buyer.phone ? `<div class="muted">Phone: ${esc(inv.buyer.phone)}</div>` : ""}
      <div class="muted">GSTIN: ${esc(inv.buyer.gstin || "Unregistered (B2C)")}</div>
    </div>
    <div class="party">
      <h3>Summary</h3>
      <div class="kv">
        <b>Taxable Value</b><span class="r">${money(inv.totals.taxableValue)}</span>
        ${intra
          ? `<b>CGST</b><span class="r">${money(inv.totals.cgst)}</span><b>SGST</b><span class="r">${money(inv.totals.sgst)}</span>`
          : `<b>IGST</b><span class="r">${money(inv.totals.igst)}</span>`}
        ${inv.totals.shippingFee > 0 ? `<b>Shipping</b><span class="r">${money(inv.totals.shippingFee)}</span>` : ""}
        <b>Total Tax</b><span class="r">${money(inv.totals.totalTax)}</span>
        <b>Invoice Total</b><span class="r"><b>${money(inv.totals.invoiceTotal)}</b></span>
      </div>
    </div>
  </div>

  <table>
    <thead><tr>
      <th class="c">#</th><th>Description</th><th class="c">HSN</th><th class="c">Qty</th>
      <th class="r">Rate</th><th class="r">Taxable</th><th class="c">GST</th>
      <th class="r">CGST</th><th class="r">SGST</th><th class="r">IGST</th><th class="r">Total</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="5" class="r">Totals</td>
      <td class="r">${money(inv.totals.taxableValue)}</td><td></td>
      <td class="r">${money(inv.totals.cgst)}</td>
      <td class="r">${money(inv.totals.sgst)}</td>
      <td class="r">${money(inv.totals.igst)}</td>
      <td class="r">${money(gst.round2(inv.totals.invoiceTotal - inv.totals.shippingFee))}</td>
    </tr></tfoot>
  </table>

  <h2 class="sec">HSN / SAC Summary</h2>
  <table>
    <thead><tr><th>HSN</th><th class="c">Rate</th><th class="r">Taxable Value</th><th class="r">CGST</th><th class="r">SGST</th><th class="r">IGST</th></tr></thead>
    <tbody>${hsnRows}</tbody>
  </table>

  <div class="words"><b>Invoice Total (in words):</b> ${esc(inv.amountInWords)}</div>

  ${inv.isSample ? `<div class="flag"><b>Free sample &mdash; not a sale.</b> Supplied at nil value for professional evaluation. Input tax credit treatment to be confirmed with the accountant.</div>` : ""}
  ${inv.unresolvedState ? `<div class="flag"><b>Place of supply could not be determined</b> from the address on this order, so the tax head is unverified. Correct the state before issuing.</div>` : ""}

  <div class="foot">
    <div class="decl">
      <b>Declaration.</b> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
      Prices are inclusive of GST; the tax shown above is the portion included in the price charged.
      <div style="margin-top:6px">Goods once sold are subject to our published returns policy. Ayurvedic proprietary medicine &mdash; use only as directed on the label.</div>
    </div>
    <div class="sign">
      <div class="muted">For ${esc(inv.seller.tradeName)}</div>
      <div class="space"></div>
      <div><b>Authorised Signatory</b></div>
    </div>
  </div>
</div></body></html>`;
}

module.exports = { SELLER, buildInvoice, renderInvoiceHtml, amountInWords };
