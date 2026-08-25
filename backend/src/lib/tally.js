/**
 * Tally XML export for website sales.
 *
 * Produces a file the owner imports through TallyPrime's own Import Data menu.
 * Deliberately a file and not a live connection: Tally's XML gateway on port
 * 9000 has no authentication of any kind, so anything able to reach it can read
 * the whole ledger and post vouchers. A file keeps the books unreachable from
 * the internet and leaves the owner reviewing before anything is committed.
 *
 * Everything below is matched against the live company as it actually exists,
 * read off the running Tally session -- not assumed:
 *
 *   Company            Sankalpasiddhi Ayupharma Pvt Ltd   (the "(c)" shown in
 *                      Tally means "connected for online access", not part of
 *                      the name; the Cloud Access account name is different
 *                      again and must not be used here)
 *   Financial year     1-Apr-2026 to 31-Mar-2027
 *   Series in use      3T/2026-27/NNN, last issued 043
 *   Rate               5% (CGST 2.5 + SGST 2.5 intra-state, IGST 5 interstate)
 *
 * Ledger names are reproduced character for character, including the
 * inconsistent spacing around "@" -- Tally matches these exactly and a
 * mismatch silently creates a duplicate ledger instead of failing loudly.
 */

const gst = require("./gst");
const series = require("./invoiceSeries");

const COMPANY_NAME = "Sankalpasiddhi Ayupharma Pvt Ltd";

const LEDGERS = {
  salesIntra: "SALES STATE",
  salesInter: "SALES CENTRAL",
  cgst: "CGST OUTPUT @2.5%",
  sgst: "SGST OUTPUT@2.5%",
  igst: "IGST OUTPUT@5%",
  discount: "DISCOUNT ALLOWED",
  roundOff: "ROUND OFF",
  // Free doctor and trainer sampling is already booked against a single debtor
  // ledger rather than a ledger per recipient. Keeping that convention.
  samples: "SAMPLES",
};

/** Group new customer ledgers are created under, matching existing practice. */
const DEBTOR_GROUP = "Sundry Debtors";

/** Tally dates are YYYYMMDD with no separators. */
function tallyDate(value) {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function xmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]),
  );
}

/**
 * A voucher's ledger entries must sum to zero or Tally rejects the import.
 *
 * Sign convention: ISDEEMEDPOSITIVE=Yes with a negative AMOUNT is a debit,
 * ISDEEMEDPOSITIVE=No with a positive AMOUNT is a credit. A sales invoice
 * debits the customer for the gross and credits sales plus each tax head.
 */
function buildEntries({ invoice, partyLedger }) {
  const intra = invoice.supplyType === "intra";
  const entries = [
    { ledger: partyLedger, debit: true, amount: invoice.totals.invoiceTotal },
    { ledger: intra ? LEDGERS.salesIntra : LEDGERS.salesInter, debit: false, amount: invoice.totals.taxableValue },
  ];

  if (intra) {
    if (invoice.totals.cgst) entries.push({ ledger: LEDGERS.cgst, debit: false, amount: invoice.totals.cgst });
    if (invoice.totals.sgst) entries.push({ ledger: LEDGERS.sgst, debit: false, amount: invoice.totals.sgst });
  } else if (invoice.totals.igst) {
    entries.push({ ledger: LEDGERS.igst, debit: false, amount: invoice.totals.igst });
  }

  // Any residue from per-line rounding lands on Round Off so the voucher
  // balances to the paisa. Without this Tally refuses the whole import.
  const credited = entries.filter((e) => !e.debit).reduce((sum, e) => sum + e.amount, 0);
  const residue = gst.round2(invoice.totals.invoiceTotal - credited);
  if (residue !== 0) {
    entries.push({ ledger: LEDGERS.roundOff, debit: residue < 0, amount: Math.abs(residue) });
  }

  return entries;
}

function renderEntry({ ledger, debit, amount }) {
  const signed = debit ? -gst.round2(amount) : gst.round2(amount);
  return `
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${xmlEscape(ledger)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${debit ? "Yes" : "No"}</ISDEEMEDPOSITIVE>
          <AMOUNT>${signed.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`;
}

/**
 * Emits a customer ledger master.
 *
 * Vouchers referencing a ledger that does not exist are rejected, so masters
 * for first-time customers ship in the same file, ahead of the vouchers.
 * ACTION="Create" is idempotent for an existing name -- Tally keeps the
 * existing master rather than duplicating it.
 */
function renderLedgerMaster(name) {
  return `
      <TALLYMESSAGE xmlns:UDF="TallyUDF">
        <LEDGER NAME="${xmlEscape(name)}" ACTION="Create">
          <NAME>${xmlEscape(name)}</NAME>
          <PARENT>${xmlEscape(DEBTOR_GROUP)}</PARENT>
          <ISBILLWISEON>No</ISBILLWISEON>
        </LEDGER>
      </TALLYMESSAGE>`;
}

/**
 * Builds the complete import file for a batch of invoices.
 *
 * `invoices` are the objects produced by lib/invoice.js, each already carrying
 * the invoice number it was issued under.
 *
 * The number is NOT allocated here, for two reasons. First, the customer is
 * given their invoice the moment they pay, so the number has to exist then --
 * not weeks later when someone exports to Tally. Second, the owner keys B2B
 * deals straight into Tally, which consumes the next number in his own series
 * as he does; anything allocated at export time would collide with whatever he
 * entered in the meantime. The website therefore runs its own series
 * (lib/invoiceSeries.js), which Rule 46(b) expressly permits, and this export
 * only carries that number across.
 *
 * Free samples are booked against the existing SAMPLES debtor at their real
 * zero value: they move stock but earn nothing, and inflating them into revenue
 * is exactly the error that made the website report 6,198 when 1,100 had been
 * received.
 */
function buildTallyXml({ invoices, companyName = COMPANY_NAME }) {
  const assigned = invoices.map((invoice) => {
    if (!invoice.invoiceNumber) {
      throw new Error(`Order ${invoice.orderNumber} has no invoice number; it cannot be exported`);
    }
    series.assertValid(invoice.invoiceNumber);
    return {
      invoice,
      voucherNumber: invoice.invoiceNumber,
      partyLedger: invoice.isSample
        ? LEDGERS.samples
        : invoice.buyer.name && invoice.buyer.name !== "—"
          ? invoice.buyer.name
          : LEDGERS.samples,
    };
  });

  // Masters first: a voucher naming a ledger that does not yet exist is
  // rejected, and Tally processes the file top to bottom.
  const newParties = [...new Set(assigned.map((a) => a.partyLedger))].filter(
    (name) => name !== LEDGERS.samples,
  );

  const masters = newParties.map(renderLedgerMaster).join("");

  const vouchers = assigned
    .map(({ invoice, voucherNumber, partyLedger }) => {
      const entries = buildEntries({ invoice, partyLedger });
      const stateName = invoice.placeOfSupply ? invoice.placeOfSupply.split("-").slice(1).join("-") : "";
      return `
      <TALLYMESSAGE xmlns:UDF="TallyUDF">
        <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Invoice Voucher View">
          <DATE>${tallyDate(invoice.invoiceDate)}</DATE>
          <EFFECTIVEDATE>${tallyDate(invoice.invoiceDate)}</EFFECTIVEDATE>
          <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
          <VOUCHERNUMBER>${xmlEscape(voucherNumber)}</VOUCHERNUMBER>
          <REFERENCE>${xmlEscape(invoice.orderNumber)}</REFERENCE>
          <PARTYLEDGERNAME>${xmlEscape(partyLedger)}</PARTYLEDGERNAME>
          <PARTYNAME>${xmlEscape(invoice.buyer.name)}</PARTYNAME>
          <PLACEOFSUPPLY>${xmlEscape(stateName)}</PLACEOFSUPPLY>
          <ISINVOICE>Yes</ISINVOICE>
          <NARRATION>Website order ${xmlEscape(invoice.orderNumber)}${invoice.isSample ? " (free sample, nil value)" : ""}</NARRATION>${entries
            .map(renderEntry)
            .join("")}
        </VOUCHER>
      </TALLYMESSAGE>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${xmlEscape(companyName)}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>${masters}${vouchers}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>
`;

  return {
    xml,
    voucherCount: assigned.length,
    firstVoucher: assigned.length ? assigned[0].voucherNumber : null,
    lastVoucher: assigned.length ? assigned[assigned.length - 1].voucherNumber : null,
    newLedgers: newParties,
    assigned: assigned.map(({ invoice, voucherNumber, partyLedger }) => ({
      orderNumber: invoice.orderNumber,
      voucherNumber,
      partyLedger,
      total: invoice.totals.invoiceTotal,
    })),
  };
}

module.exports = {
  COMPANY_NAME,
  LEDGERS,
  DEBTOR_GROUP,
  tallyDate,
  buildEntries,
  renderEntry,
  renderLedgerMaster,
  buildTallyXml,
  xmlEscape,
};
