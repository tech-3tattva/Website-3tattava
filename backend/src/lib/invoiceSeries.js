/**
 * Invoice numbering for website sales.
 *
 * The website runs its OWN series, deliberately separate from the series the
 * owner types by hand in Tally.
 *
 * Why separate rather than continuing Tally's numbers: the owner keys B2B deals
 * (gym chains, distributors) straight into Tally, and Tally allocates the next
 * number in its own series when he does. If the website also continued that
 * series it would hand out a number Tally is about to use, and two unrelated
 * sales would carry the same invoice number. There is no way to prevent that
 * without the website reading Tally live -- which would mean exposing Tally's
 * unauthenticated XML port. Separate series removes the race entirely: neither
 * system needs to know what the other is doing.
 *
 * This is expressly allowed. Rule 46(b) of the CGST Rules requires "a
 * consecutive serial number not exceeding sixteen characters, in one or
 * multiple series ... unique for a financial year". Multiple series under one
 * GSTIN is normal practice -- the textbook example is one series for the
 * back-office and another for the retail counter.
 *
 * Constraints each series must satisfy, enforced below:
 *   - at most 16 characters
 *   - only letters, digits, hyphen and slash
 *   - consecutive within its own series, never reset mid-year
 *   - restarted at the beginning of each financial year (1 April, India)
 */

/** Rule 46(b): sixteen characters, alphabets/numerals/hyphen/slash only. */
const MAX_LENGTH = 16;
const ALLOWED = /^[A-Za-z0-9/-]+$/;

/**
 * Website series prefix. Kept short on purpose so four digits of sequence still
 * fit inside sixteen characters: "3TW/26-27/0001" is 14.
 *
 * "3TW" reads as 3TATTAVA Web and cannot collide with the hand-typed
 * "3T/2026-27/NNN" series, because the prefixes differ.
 */
const WEB_PREFIX = "3TW";
const SEQUENCE_WIDTH = 4;

/**
 * Indian financial year label for a date: 1 April to 31 March.
 * 14-Aug-2026 -> "26-27".
 */
function financialYear(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  // Months are zero-based, so March is 2. Jan-Mar belong to the year before.
  const startYear = d.getMonth() >= 3 ? year : year - 1;
  const short = (n) => String(n % 100).padStart(2, "0");
  return `${short(startYear)}-${short(startYear + 1)}`;
}

/** Financial year as Tally shows it, for reports and reconciliation. */
function financialYearLong(date) {
  const d = new Date(date);
  const startYear = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

/**
 * Builds an invoice number. `sequence` is the nth website invoice of that
 * financial year, starting at 1.
 */
function formatInvoiceNumber({ sequence, date, prefix = WEB_PREFIX }) {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error(`Invoice sequence must be a positive integer, got ${sequence}`);
  }
  const number = `${prefix}/${financialYear(date)}/${String(sequence).padStart(SEQUENCE_WIDTH, "0")}`;
  assertValid(number);
  return number;
}

/**
 * Rejects a number that would be a defective invoice under Rule 46(b).
 *
 * Thrown rather than silently truncated: an invoice number that breaches the
 * rule is a compliance problem, and it is far better to fail at the point of
 * issue than to discover it across a year of filings.
 */
function assertValid(number) {
  if (typeof number !== "string" || !number) throw new Error("Invoice number is empty");
  if (number.length > MAX_LENGTH) {
    throw new Error(`Invoice number "${number}" is ${number.length} characters; Rule 46(b) allows ${MAX_LENGTH}`);
  }
  if (!ALLOWED.test(number)) {
    throw new Error(`Invoice number "${number}" contains characters other than letters, digits, hyphen and slash`);
  }
  return true;
}

/**
 * Parses one of our numbers back into its parts. Returns null for anything not
 * from this series -- including the owner's hand-typed "3T/2026-27/NNN", which
 * this module must never claim to own.
 */
function parse(number) {
  const match = new RegExp(`^(${WEB_PREFIX})/(\\d{2}-\\d{2})/(\\d+)$`).exec(String(number || ""));
  if (!match) return null;
  return { prefix: match[1], financialYear: match[2], sequence: parseInt(match[3], 10) };
}

module.exports = {
  MAX_LENGTH,
  WEB_PREFIX,
  SEQUENCE_WIDTH,
  financialYear,
  financialYearLong,
  formatInvoiceNumber,
  assertValid,
  parse,
};
