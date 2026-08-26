/**
 * Renders the tax invoice as a real PDF (Buffer), for attaching to the customer
 * email.
 *
 * Pure JS (pdfkit) on purpose: the backend runs on a 1 GB EC2 box with no
 * staging, so a headless-Chrome dependency (per-render ~200 MB, plus system
 * libraries) is too fragile a thing to put in the order-confirmation path. This
 * draws the same fields the HTML invoice shows (lib/invoice.renderInvoiceHtml),
 * from the same built invoice object, so figures never drift between the two.
 *
 * The rupee sign (U+20B9) is not in pdfkit's built-in Helvetica, so a bundled
 * NotoSans (OFL) is embedded — see src/assets/fonts.
 */

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const gst = require("./gst");

const FONT_DIR = path.join(__dirname, "..", "assets", "fonts");
const FONTS = { regular: path.join(FONT_DIR, "NotoSans-Regular.ttf"), bold: path.join(FONT_DIR, "NotoSans-Bold.ttf") };
const LOGO = path.join(__dirname, "..", "assets", "logo", "logo-full-espresso.png");

const INK = "#1A1710";
const GOLD = "#C9A84C";
const MUTED = "#6A6A6A";
const BORDER = "#D8D8D8";
const HEAD_BG = "#F4F2ED";
const SUB = "#7A7A7A";

const inr = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** Draw one table row of cells `[{text, w, align}]` starting at (x,y); returns row height used. */
function drawRow(doc, x, y, cells, { font = "regular", size = 8, pad = 4, headBg = null, lineColor = BORDER, color = INK }) {
  const heights = cells.map((c) => doc.font(FONTS[font]).fontSize(size).heightOfString(String(c.text ?? ""), { width: c.w - pad * 2, align: c.align || "left" }));
  const rowH = Math.max(16, ...heights.map((h) => h + pad * 2));
  let cx = x;
  for (const c of cells) {
    if (headBg) doc.rect(cx, y, c.w, rowH).fill(headBg);
    doc.rect(cx, y, c.w, rowH).strokeColor(lineColor).lineWidth(0.5).stroke();
    doc.font(FONTS[font]).fontSize(size).fillColor(color).text(String(c.text ?? ""), cx + pad, y + pad, { width: c.w - pad * 2, align: c.align || "left" });
    cx += c.w;
  }
  return rowH;
}

/** Returns a Promise<Buffer> of the rendered invoice. */
function renderInvoicePdf(inv) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 36 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const M = 36;
    const W = doc.page.width - M * 2; // ~523
    const intra = inv.supplyType === "intra";

    // ── Title ──
    doc.font(FONTS.bold).fontSize(15).fillColor(INK).text("TAX INVOICE", M, M, { width: W, align: "center", characterSpacing: 2 });
    doc.moveTo(M, doc.y + 4).lineTo(M + W, doc.y + 4).lineWidth(1.5).strokeColor(GOLD).stroke();
    let y = doc.y + 12;

    // ── Header: seller (left) + meta (right) ──
    const rightX = M + 300;
    let ly = y;
    // Brand logo (falls back to the wordmark text if the asset is unreadable so
    // an invoice can never fail to generate over a missing image).
    try {
      doc.image(LOGO, M, ly, { width: 150 });
      ly += 150 * (160 / 483) + 6;
    } catch {
      doc.font(FONTS.bold).fontSize(13).fillColor(INK).text(inv.seller.tradeName, M, ly, { width: 290 });
      ly = doc.y;
    }
    const sellerLines = [inv.seller.legalName, ...inv.seller.address, `${inv.seller.phone}  \u00b7  ${inv.seller.email}`, `GSTIN: ${inv.seller.gstin}`, `State: ${inv.seller.stateName} (${inv.seller.stateCode})`];
    doc.font(FONTS.regular).fontSize(9).fillColor(MUTED);
    for (const l of sellerLines) { doc.text(l, M, ly, { width: 290 }); ly = doc.y + 1; }
    const sellerEnd = ly;

    const meta = [
      ["Invoice No.", inv.invoiceNumber],
      ["Invoice Date", fmtDate(inv.invoiceDate)],
      ["Order No.", inv.orderNumber],
      ["Place of Supply", inv.placeOfSupply || "\u2014"],
      ["Supply Type", intra ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"],
      ["Reverse Charge", inv.reverseCharge ? "Yes" : "No"],
    ];
    let my = y;
    for (const [k, v] of meta) {
      doc.font(FONTS.bold).fontSize(8.5).fillColor(MUTED).text(k, rightX, my, { width: 90 });
      doc.font(FONTS.regular).fontSize(9).fillColor(INK).text(String(v), rightX + 92, my, { width: W - 300 - 92 });
      my = Math.max(doc.y, my + 13) + 1;
    }
    y = Math.max(sellerEnd, my) + 8;
    doc.moveTo(M, y).lineTo(M + W, y).lineWidth(0.5).strokeColor(BORDER).stroke();
    y += 10;

    // ── Parties: Billed to (left) + Summary (right) ──
    const colW = (W - 12) / 2;
    const boxTop = y;
    // Billed to
    doc.rect(M, boxTop, colW, 96).strokeColor(BORDER).lineWidth(0.5).stroke();
    doc.font(FONTS.bold).fontSize(8).fillColor(MUTED).text("BILLED & SHIPPED TO", M + 8, boxTop + 8, { characterSpacing: 1 });
    doc.font(FONTS.bold).fontSize(10).fillColor(INK).text(inv.buyer.name, M + 8, boxTop + 22, { width: colW - 16 });
    let by = doc.y;
    doc.font(FONTS.regular).fontSize(9).fillColor(MUTED);
    for (const l of [...inv.buyer.addressLines, inv.buyer.cityLine, inv.buyer.phone ? `Phone: ${inv.buyer.phone}` : null, `GSTIN: ${inv.buyer.gstin || "Unregistered (B2C)"}`].filter(Boolean)) {
      doc.text(l, M + 8, by, { width: colW - 16 }); by = doc.y + 0.5;
    }
    // Summary
    const sx = M + colW + 12;
    doc.rect(sx, boxTop, colW, 96).strokeColor(BORDER).lineWidth(0.5).stroke();
    doc.font(FONTS.bold).fontSize(8).fillColor(MUTED).text("SUMMARY", sx + 8, boxTop + 8, { characterSpacing: 1 });
    const sumPairs = [
      ["Taxable Value", inr(inv.totals.taxableValue)],
      ...(intra ? [["CGST", inr(inv.totals.cgst)], ["SGST", inr(inv.totals.sgst)]] : [["IGST", inr(inv.totals.igst)]]),
      ...(inv.totals.shippingFee > 0 ? [["Shipping", inr(inv.totals.shippingFee)]] : []),
      ["Total Tax", inr(inv.totals.totalTax)],
    ];
    let sy = boxTop + 24;
    for (const [k, v] of sumPairs) {
      doc.font(FONTS.regular).fontSize(9).fillColor(MUTED).text(k, sx + 8, sy, { width: colW / 2 });
      doc.font(FONTS.regular).fontSize(9).fillColor(INK).text(v, sx + colW / 2, sy, { width: colW / 2 - 8, align: "right" });
      sy += 12;
    }
    doc.font(FONTS.bold).fontSize(10.5).fillColor(INK).text("Invoice Total", sx + 8, sy + 2, { width: colW / 2 });
    doc.font(FONTS.bold).fontSize(10.5).fillColor(INK).text(inr(inv.totals.invoiceTotal), sx + colW / 2, sy + 2, { width: colW / 2 - 8, align: "right" });
    y = boxTop + 96 + 14;

    // ── Line items ──
    // Columns: #, Description, HSN, Qty, Rate, Taxable, GST%, [tax heads], Total
    const taxCols = intra
      ? [{ key: "cgst", label: "CGST", w: 56 }, { key: "sgst", label: "SGST", w: 56 }]
      : [{ key: "igst", label: "IGST", w: 62 }];
    const taxW = taxCols.reduce((s, c) => s + c.w, 0);
    const descW = W - (22 + 52 + 28 + 56 + 58 + 34 + taxW + 62);
    const cols = [
      { key: "no", label: "#", w: 22, align: "center" },
      { key: "name", label: "Description", w: descW, align: "left" },
      { key: "hsn", label: "HSN", w: 52, align: "center" },
      { key: "qty", label: "Qty", w: 28, align: "center" },
      { key: "rate", label: "Rate", w: 58, align: "right" },
      { key: "taxable", label: "Taxable", w: 56, align: "right" },
      { key: "gst", label: "GST", w: 34, align: "center" },
      ...taxCols.map((c) => ({ ...c, align: "right" })),
      { key: "total", label: "Total", w: 62, align: "right" },
    ];
    // Header
    y += drawRow(doc, M, y, cols.map((c) => ({ text: c.label, w: c.w, align: c.align })), { font: "bold", size: 7.5, headBg: HEAD_BG, color: MUTED });
    // Rows
    inv.lines.forEach((l, i) => {
      const cells = cols.map((c) => {
        switch (c.key) {
          case "no": return { text: i + 1, w: c.w, align: c.align };
          case "name": return { text: l.discount > 0 ? `${l.name}  (less discount ${inr(l.discount)})` : l.name, w: c.w, align: c.align };
          case "hsn": return { text: l.hsnCode || "\u2014", w: c.w, align: c.align };
          case "qty": return { text: l.quantity, w: c.w, align: c.align };
          case "rate": return { text: inr(l.unitPrice), w: c.w, align: c.align };
          case "taxable": return { text: inr(l.taxableValue), w: c.w, align: c.align };
          case "gst": return { text: `${l.ratePercent}%`, w: c.w, align: c.align };
          case "total": return { text: inr(l.inclusiveTotal), w: c.w, align: c.align };
          default: return { text: inr(l[c.key]), w: c.w, align: c.align }; // cgst/sgst/igst
        }
      });
      y += drawRow(doc, M, y, cells, { size: 8 });
    });
    // Totals row
    const totalCells = cols.map((c) => {
      if (c.key === "name" || c.key === "no") return { text: c.key === "name" ? "Totals" : "", w: c.w, align: "right" };
      if (c.key === "taxable") return { text: inr(inv.totals.taxableValue), w: c.w, align: "right" };
      if (c.key === "cgst") return { text: inr(inv.totals.cgst), w: c.w, align: "right" };
      if (c.key === "sgst") return { text: inr(inv.totals.sgst), w: c.w, align: "right" };
      if (c.key === "igst") return { text: inr(inv.totals.igst), w: c.w, align: "right" };
      if (c.key === "total") return { text: inr(gst.round2(inv.totals.invoiceTotal - inv.totals.shippingFee)), w: c.w, align: "right" };
      return { text: "", w: c.w, align: c.align };
    });
    y += drawRow(doc, M, y, totalCells, { font: "bold", size: 8, headBg: "#FBFAF7" });
    y += 12;

    // ── HSN summary ──
    doc.font(FONTS.bold).fontSize(8.5).fillColor(MUTED).text("HSN / SAC SUMMARY", M, y, { characterSpacing: 1 });
    y = doc.y + 4;
    const hcols = [
      { key: "hsnCode", label: "HSN", w: W - (60 + 100 + 100 + 100), align: "left" },
      { key: "ratePercent", label: "Rate", w: 60, align: "center" },
      { key: "taxableValue", label: "Taxable Value", w: 100, align: "right" },
      { key: "cgst", label: "CGST", w: 100, align: "right" },
      { key: "sgst", label: "SGST", w: 100, align: "right" },
    ];
    // (IGST folded into the same table via a swap when inter-state)
    const hcolsFinal = intra ? hcols : [hcols[0], hcols[1], hcols[2], { key: "igst", label: "IGST", w: 200, align: "right" }];
    y += drawRow(doc, M, y, hcolsFinal.map((c) => ({ text: c.label, w: c.w, align: c.align })), { font: "bold", size: 7.5, headBg: HEAD_BG, color: MUTED });
    for (const h of inv.hsnSummary) {
      y += drawRow(doc, M, y, hcolsFinal.map((c) => ({ text: c.key === "ratePercent" ? `${h.ratePercent}%` : c.key === "hsnCode" ? (h.hsnCode || "\u2014") : inr(h[c.key]), w: c.w, align: c.align })), { size: 8 });
    }
    y += 12;

    // ── Amount in words ──
    doc.rect(M, y, W, 22).fillAndStroke("#FBFAF7", BORDER);
    doc.font(FONTS.bold).fontSize(9).fillColor(INK).text("Invoice Total (in words): ", M + 8, y + 6, { continued: true }).font(FONTS.regular).fillColor(INK).text(inv.amountInWords);
    y += 30;

    // ── Flags ──
    if (inv.isSample) {
      doc.rect(M, y, W, 26).fillAndStroke("#FFFBE8", "#E6B800");
      doc.font(FONTS.regular).fontSize(8.5).fillColor("#6b5b00").text("Free sample \u2014 not a sale. Supplied at nil value for professional evaluation. ITC treatment to be confirmed with the accountant.", M + 8, y + 6, { width: W - 16 });
      y += 34;
    }

    // ── Declaration + signatory ──
    if (y > doc.page.height - 120) { doc.addPage(); y = M; }
    const declW = W * 0.6;
    doc.font(FONTS.bold).fontSize(8.5).fillColor(INK).text("Declaration.", M, y, { continued: true, width: declW })
      .font(FONTS.regular).fillColor("#4A4A4A")
      .text(" We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Prices are inclusive of GST; the tax shown is the portion included in the price charged.", { width: declW });
    doc.font(FONTS.regular).fontSize(8).fillColor(MUTED).text("Ayurvedic proprietary medicine \u2014 use only as directed on the label.", M, doc.y + 4, { width: declW });

    const signX = M + W - 170;
    doc.rect(signX, y, 170, 70).strokeColor(BORDER).lineWidth(0.5).stroke();
    doc.font(FONTS.regular).fontSize(8.5).fillColor(MUTED).text(`For ${inv.seller.tradeName}`, signX, y + 8, { width: 170, align: "center" });
    doc.font(FONTS.bold).fontSize(8.5).fillColor(INK).text("Authorised Signatory", signX, y + 52, { width: 170, align: "center" });

    doc.end();
  });
}

module.exports = { renderInvoicePdf };
