/**
 * Populate GST classification (HSN + rate) on catalogue products.
 *
 * WHY THIS EXISTS
 * The Product schema declares `hsnCode` (default "13021919") and
 * `gstRatePercent` (default 5), but Mongoose defaults only apply when a
 * document is created or saved -- they do NOT backfill documents that already
 * exist in the database. Every live product predates the GST field, so all of
 * them read back `hsnCode: undefined` / `gstRatePercent: undefined`, and the
 * invoice line then freezes a null HSN. This script persists the values once.
 *
 * SAFETY
 *   - Dry run by DEFAULT. Pass --commit to write.
 *   - Only fills a field that is currently missing (null/undefined). A product
 *     with a deliberately-set rate is never overwritten -- the rate is a
 *     per-product tax position, not a global constant.
 *   - Prints the exact target DB (host + database) so you can see whether this
 *     is pointed at local or production before committing.
 *
 * USAGE
 *   node src/scripts/set-product-gst.js            # dry run, no writes
 *   node src/scripts/set-product-gst.js --commit   # apply
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoose = require("mongoose");
const Product = require("../models/Product");

// The catalogue-wide defaults, matching the Tally stock items: HSN 13021919
// (heading 1302, vegetable saps & extracts) at 5%. A product needing a
// different code/rate should be set individually -- this script only fills
// blanks and never overwrites an existing value.
const DEFAULT_HSN = "13021919";
const DEFAULT_RATE = 5;

const COMMIT = process.argv.includes("--commit");

function targetDbLabel() {
  const uri = process.env.MONGODB_URI || "(unset)";
  return uri.replace(/\/\/([^:@/]+):[^@/]*@/, "//$1:***@"); // mask any password
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);

  const conn = mongoose.connection;
  console.log("=".repeat(72));
  console.log(`  set-product-gst  [${COMMIT ? "COMMIT — will write" : "DRY RUN — no writes"}]`);
  console.log(`  target DB : ${conn.host}:${conn.port}/${conn.name}`);
  console.log(`  uri       : ${targetDbLabel()}`);
  console.log("=".repeat(72));

  const products = await Product.find({}).select("slug name hsnCode gstRatePercent").lean().exec();
  let toWrite = 0;

  for (const p of products) {
    const set = {};
    if (p.hsnCode == null || p.hsnCode === "") set.hsnCode = DEFAULT_HSN;
    if (p.gstRatePercent == null) set.gstRatePercent = DEFAULT_RATE;

    const cur = `hsn=${p.hsnCode ?? "—"} rate=${p.gstRatePercent ?? "—"}`;
    if (!Object.keys(set).length) {
      console.log(`  keep   ${p.slug.padEnd(26)} ${cur}  (already set)`);
      continue;
    }
    toWrite += 1;
    const next = `hsn=${set.hsnCode ?? p.hsnCode} rate=${set.gstRatePercent ?? p.gstRatePercent}`;
    console.log(`  ${COMMIT ? "SET " : "would"} ${p.slug.padEnd(26)} ${cur}  ->  ${next}`);
    if (COMMIT) await Product.updateOne({ _id: p._id }, { $set: set }).exec();
  }

  console.log("-".repeat(72));
  console.log(`  products: ${products.length}   needing values: ${toWrite}   ${COMMIT ? "written" : "(dry run — nothing written)"}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
