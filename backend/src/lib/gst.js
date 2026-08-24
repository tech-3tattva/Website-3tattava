/**
 * GST computation for a registered Delhi seller.
 *
 * Two things here are load-bearing for compliance:
 *
 * 1. PLACE OF SUPPLY. Whether a sale is CGST+SGST or IGST is decided by the
 *    buyer's state, not the shipping courier. Orders currently store the state
 *    as free text with inconsistent casing ("DELHI", "Delhi", "UTTAR PRADESH",
 *    "Uttar Pradesh"), so matching on the raw string silently mis-classifies
 *    tax. Everything routes through normaliseState() to a numeric state code.
 *
 * 2. PRICES ARE TAX-INCLUSIVE. Customers are shown "inclusive of all taxes"
 *    and that promise must not change, so tax is back-calculated out of the
 *    price rather than added on top. The customer's total is identical before
 *    and after this module exists; only the breakup is newly recorded.
 *
 * Rounding follows the invoice convention: compute tax per line, round each
 * line to 2 decimals, then sum. Rounding the total instead produces figures
 * that do not tie back to the line items on the printed invoice.
 */

/** Seller's own registration: GSTIN 07ABSCS9652C1ZU -> state code 07, Delhi. */
const SELLER_STATE_CODE = "07";

/**
 * GST state codes as published by the GSTN. Keyed by the canonical name; the
 * alias list carries the spellings that actually appear in the order data and
 * the ones customers type.
 */
const STATES = [
  { code: "01", name: "Jammu and Kashmir", aliases: ["j&k", "jammu kashmir", "jk"] },
  { code: "02", name: "Himachal Pradesh", aliases: ["hp"] },
  { code: "03", name: "Punjab", aliases: [] },
  { code: "04", name: "Chandigarh", aliases: [] },
  { code: "05", name: "Uttarakhand", aliases: ["uttaranchal"] },
  { code: "06", name: "Haryana", aliases: [] },
  { code: "07", name: "Delhi", aliases: ["new delhi", "nct of delhi", "delhi ncr"] },
  { code: "08", name: "Rajasthan", aliases: [] },
  { code: "09", name: "Uttar Pradesh", aliases: ["up"] },
  { code: "10", name: "Bihar", aliases: [] },
  { code: "11", name: "Sikkim", aliases: [] },
  { code: "12", name: "Arunachal Pradesh", aliases: [] },
  { code: "13", name: "Nagaland", aliases: [] },
  { code: "14", name: "Manipur", aliases: [] },
  { code: "15", name: "Mizoram", aliases: [] },
  { code: "16", name: "Tripura", aliases: [] },
  { code: "17", name: "Meghalaya", aliases: [] },
  { code: "18", name: "Assam", aliases: [] },
  { code: "19", name: "West Bengal", aliases: ["wb"] },
  { code: "20", name: "Jharkhand", aliases: [] },
  { code: "21", name: "Odisha", aliases: ["orissa"] },
  { code: "22", name: "Chhattisgarh", aliases: ["chattisgarh"] },
  { code: "23", name: "Madhya Pradesh", aliases: ["mp"] },
  { code: "24", name: "Gujarat", aliases: [] },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu", aliases: ["daman and diu", "dadra and nagar haveli"] },
  { code: "27", name: "Maharashtra", aliases: [] },
  { code: "29", name: "Karnataka", aliases: [] },
  { code: "30", name: "Goa", aliases: [] },
  { code: "31", name: "Lakshadweep", aliases: [] },
  { code: "32", name: "Kerala", aliases: [] },
  { code: "33", name: "Tamil Nadu", aliases: ["tamilnadu", "tn"] },
  { code: "34", name: "Puducherry", aliases: ["pondicherry"] },
  { code: "35", name: "Andaman and Nicobar Islands", aliases: ["andaman and nicobar"] },
  { code: "36", name: "Telangana", aliases: [] },
  { code: "37", name: "Andhra Pradesh", aliases: ["ap"] },
  { code: "38", name: "Ladakh", aliases: [] },
];

const BY_KEY = new Map();
for (const state of STATES) {
  BY_KEY.set(state.name.toLowerCase(), state);
  BY_KEY.set(state.code, state);
  for (const alias of state.aliases) BY_KEY.set(alias, state);
}

/** First two digits of a pincode are not a state code, but the leading digit
 *  narrows the region enough to catch a clearly wrong state on a Delhi order.
 *  Used only for warnings, never to override what the customer entered. */
const DELHI_PIN_PREFIX = "11";

/**
 * Resolves free-text state input to a canonical name and GST state code.
 * Returns null rather than guessing when the input is unrecognised — a wrong
 * state code produces a wrong tax head, which is worse than a flagged order.
 */
function normaliseState(input) {
  if (!input) return null;
  const key = String(input).trim().toLowerCase().replace(/\s+/g, " ");
  return BY_KEY.get(key) || null;
}

/** True when the supply is intra-state, so CGST+SGST applies instead of IGST. */
function isIntraState(buyerStateCode) {
  return buyerStateCode === SELLER_STATE_CODE;
}

function round2(value) {
  // Number.EPSILON guards against 1.005 style values landing a paisa low.
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Splits a tax-inclusive amount into taxable value and tax.
 *
 * taxable = inclusive * 100 / (100 + rate)
 *
 * The customer paid `inclusive`; this only decides how it is reported.
 */
function splitInclusive(inclusiveAmount, ratePercent) {
  const gross = Number(inclusiveAmount) || 0;
  const rate = Number(ratePercent) || 0;
  if (gross <= 0 || rate <= 0) {
    return { taxableValue: round2(gross), taxAmount: 0 };
  }
  const taxable = round2((gross * 100) / (100 + rate));
  // Derive tax by subtraction so taxable + tax always equals what was charged.
  return { taxableValue: taxable, taxAmount: round2(gross - taxable) };
}

/**
 * Builds the tax breakup for one invoice line.
 *
 * `lineTotal` is what the customer is charged for the line, inclusive of tax
 * and net of any discount already applied to it.
 */
function computeLineTax({ lineTotal, ratePercent, buyerStateCode, hsnCode }) {
  const { taxableValue, taxAmount } = splitInclusive(lineTotal, ratePercent);
  const intra = isIntraState(buyerStateCode);

  // Half each to CGST and SGST on an intra-state supply. Splitting the already
  // rounded tax (rather than rounding each half) keeps the halves summing to
  // the line's tax exactly; the odd paisa lands on SGST.
  const half = round2(taxAmount / 2);

  return {
    hsnCode: hsnCode || null,
    ratePercent: Number(ratePercent) || 0,
    taxableValue,
    cgst: intra ? half : 0,
    sgst: intra ? round2(taxAmount - half) : 0,
    igst: intra ? 0 : taxAmount,
    totalTax: taxAmount,
    inclusiveTotal: round2(Number(lineTotal) || 0),
  };
}

/**
 * Aggregates line-level tax into invoice totals plus the HSN-wise summary that
 * GSTR-1 requires. Returns `unresolvedState: true` when the buyer's state could
 * not be mapped, so the order can be flagged instead of silently taxed wrong.
 */
function computeInvoiceTax({ lines, stateInput, pincode }) {
  const state = normaliseState(stateInput);
  const buyerStateCode = state?.code ?? null;
  const intra = buyerStateCode ? isIntraState(buyerStateCode) : null;

  const computed = lines.map((line) =>
    computeLineTax({
      lineTotal: line.lineTotal,
      ratePercent: line.ratePercent,
      buyerStateCode,
      hsnCode: line.hsnCode,
    }),
  );

  const sum = (key) => round2(computed.reduce((total, line) => total + line[key], 0));

  // HSN-wise summary: GSTR-1 wants one row per HSN + rate combination.
  const hsnSummary = [];
  for (const line of computed) {
    const key = `${line.hsnCode || "-"}|${line.ratePercent}`;
    let row = hsnSummary.find((r) => r.key === key);
    if (!row) {
      row = {
        key,
        hsnCode: line.hsnCode,
        ratePercent: line.ratePercent,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
      };
      hsnSummary.push(row);
    }
    row.taxableValue = round2(row.taxableValue + line.taxableValue);
    row.cgst = round2(row.cgst + line.cgst);
    row.sgst = round2(row.sgst + line.sgst);
    row.igst = round2(row.igst + line.igst);
  }

  return {
    placeOfSupply: state ? `${state.code}-${state.name}` : null,
    placeOfSupplyCode: buyerStateCode,
    unresolvedState: !state,
    // Surfaced for review, never used to override the customer's own entry.
    pincodeStateMismatch:
      !!state &&
      state.code === SELLER_STATE_CODE &&
      !!pincode &&
      !String(pincode).startsWith(DELHI_PIN_PREFIX),
    supplyType: intra === null ? null : intra ? "intra" : "inter",
    taxableValue: sum("taxableValue"),
    cgst: sum("cgst"),
    sgst: sum("sgst"),
    igst: sum("igst"),
    totalTax: sum("totalTax"),
    invoiceTotal: sum("inclusiveTotal"),
    lines: computed.map(({ ...line }) => line),
    hsnSummary: hsnSummary.map(({ key, ...row }) => row),
  };
}

module.exports = {
  SELLER_STATE_CODE,
  STATES,
  normaliseState,
  isIntraState,
  splitInclusive,
  computeLineTax,
  computeInvoiceTax,
  round2,
};
