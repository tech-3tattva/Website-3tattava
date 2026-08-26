#!/usr/bin/env node
/**
 * Automated MongoDB backup for the website database (issue H2).
 *
 * Atlas M0 has no built-in automated backups, so a bad script or an accidental
 * delete against the live cluster would be unrecoverable. This dumps the whole
 * database to a single gzipped EJSON file, keeps a rolling window locally, and
 * (optionally) copies each dump off-box to a PRIVATE S3 bucket.
 *
 * EJSON (not plain JSON) is used so ObjectIds, Dates and other BSON types round
 * -trip exactly -- a plain JSON dump could not be restored faithfully.
 *
 * Modes:
 *   node src/scripts/backup-db.js
 *       Dump every collection -> BACKUP_DIR/3tattva-db-<ts>.json.gz, rotate, and
 *       upload to S3 if BACKUP_S3_BUCKET is set. This is what cron runs nightly.
 *
 *   node src/scripts/backup-db.js --verify <file.json.gz>
 *       Read a dump back and print collection -> document counts. Proves the
 *       backup is intact and restorable without touching any database.
 *
 *   node src/scripts/backup-db.js --restore <file.json.gz> --target <uri> [--drop] --yes
 *       Restore a dump INTO an explicit target database. Requires --target and
 *       --yes so it can never run against production by accident. Documents are
 *       upserted by _id; --drop clears each collection first. NEVER point this
 *       at the live cluster unless you mean it.
 *
 * Env:
 *   MONGODB_URI          source cluster (backup) -- same var the API uses
 *   BACKUP_DIR           where dumps are written (default: ~/db-backups)
 *   BACKUP_KEEP          how many dumps to retain locally (default: 30)
 *   BACKUP_S3_BUCKET     optional PRIVATE bucket for off-box copies (unset = local only)
 *   BACKUP_S3_PREFIX     key prefix in that bucket (default: db-backups/)
 *   AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY   used only if S3 is enabled
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");

require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoose = require("mongoose");
const { EJSON } = require("bson");

const FILE_PREFIX = "3tattva-db-";
const FILE_SUFFIX = ".json.gz";

function backupDir() {
  return process.env.BACKUP_DIR || path.join(os.homedir(), "db-backups");
}

function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`
  );
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function assertUri(name) {
  const uri = process.env[name];
  if (!uri) throw new Error(`Missing required environment variable ${name}`);
  return uri;
}

/** Reads every collection into a plain object keyed by collection name. */
async function dumpAll(db) {
  const collections = (await db.listCollections().toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith("system."))
    .sort();

  const dump = {};
  const counts = {};
  for (const name of collections) {
    const docs = await db.collection(name).find({}).toArray();
    dump[name] = docs;
    counts[name] = docs.length;
  }
  return { dump, counts };
}

async function uploadToS3(filePath, fileName) {
  const bucket = process.env.BACKUP_S3_BUCKET;
  if (!bucket) return null;

  const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
  const region = process.env.AWS_REGION || "ap-south-1";
  const prefix = (process.env.BACKUP_S3_PREFIX || "db-backups/").replace(/^\/+/, "");
  const key = `${prefix}${fileName}`;

  const s3 = new S3Client({ region });
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fs.readFileSync(filePath),
      ContentType: "application/gzip",
    })
  );
  return `s3://${bucket}/${key}`;
}

/** Deletes old local dumps, keeping the newest `keep`. */
function rotate(dir, keep) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(FILE_PREFIX) && f.endsWith(FILE_SUFFIX))
    .sort(); // timestamped names sort chronologically
  const toDelete = files.slice(0, Math.max(0, files.length - keep));
  for (const f of toDelete) fs.unlinkSync(path.join(dir, f));
  return { kept: files.length - toDelete.length, deleted: toDelete.length };
}

async function runBackup() {
  const uri = assertUri("MONGODB_URI");
  const dir = backupDir();
  const keep = Number(process.env.BACKUP_KEEP || 30);
  fs.mkdirSync(dir, { recursive: true });

  mongoose.set("strictQuery", false);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const { dump, counts } = await dumpAll(db);
  const totalDocs = Object.values(counts).reduce((s, n) => s + n, 0);

  const fileName = `${FILE_PREFIX}${stamp()}${FILE_SUFFIX}`;
  const filePath = path.join(dir, fileName);
  const gz = zlib.gzipSync(Buffer.from(EJSON.stringify(dump, { relaxed: false })));
  fs.writeFileSync(filePath, gz);

  await mongoose.disconnect();

  let s3Url = null;
  try {
    s3Url = await uploadToS3(filePath, fileName);
  } catch (err) {
    console.error(`[backup] S3 upload FAILED (local copy is safe): ${err.message}`);
  }

  const rot = rotate(dir, keep);

  console.log("======================================================================");
  console.log(`db backup OK -> ${filePath}`);
  console.log(`  collections : ${Object.keys(counts).length}   documents: ${totalDocs}`);
  console.log(`  size        : ${humanSize(gz.length)}`);
  console.log(`  per-coll    : ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  console.log(`  retention   : keeping ${rot.kept}, deleted ${rot.deleted} old (limit ${keep})`);
  console.log(`  off-box S3  : ${s3Url || "(disabled -- set BACKUP_S3_BUCKET to a PRIVATE bucket)"}`);
  console.log("======================================================================");
}

async function runVerify(file) {
  if (!file || !fs.existsSync(file)) throw new Error(`--verify needs an existing file (got: ${file})`);
  const dump = EJSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8"));
  const counts = Object.fromEntries(Object.entries(dump).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0]));
  const totalDocs = Object.values(counts).reduce((s, n) => s + n, 0);
  console.log(`verify ${file}`);
  console.log(`  collections : ${Object.keys(counts).length}   documents: ${totalDocs}`);
  console.log(`  per-coll    : ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  console.log("  -> readable and intact.");
}

async function runRestore(file, target, drop, yes) {
  if (!file || !fs.existsSync(file)) throw new Error(`--restore needs an existing file (got: ${file})`);
  if (!target) throw new Error("--restore requires an explicit --target <uri> (never defaults to production)");
  if (!yes) throw new Error("--restore is destructive; re-run with --yes to confirm");

  const dump = EJSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8"));
  mongoose.set("strictQuery", false);
  await mongoose.connect(target);
  const db = mongoose.connection.db;
  console.log(`restore ${file} -> ${db.databaseName}${drop ? " (dropping collections first)" : " (upsert by _id)"}`);

  for (const [name, docs] of Object.entries(dump)) {
    if (!Array.isArray(docs)) continue;
    const coll = db.collection(name);
    if (drop) await coll.deleteMany({});
    if (docs.length) {
      const ops = docs.map((d) => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } }));
      await coll.bulkWrite(ops, { ordered: false });
    }
    console.log(`  ${name}: ${docs.length}`);
  }
  await mongoose.disconnect();
  console.log("  -> restore complete.");
}

function argVal(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

(async () => {
  try {
    if (process.argv.includes("--verify")) {
      await runVerify(argVal("--verify"));
    } else if (process.argv.includes("--restore")) {
      await runRestore(
        argVal("--restore"),
        argVal("--target"),
        process.argv.includes("--drop"),
        process.argv.includes("--yes")
      );
    } else {
      await runBackup();
    }
  } catch (err) {
    console.error(`[backup] FAILED: ${err.message}`);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
})();
