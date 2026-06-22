// routes/leads.js — Express route for lead capture
// Add to your EC2 Express app: app.use('/api/leads', require('./routes/leads'));

const express  = require('express');
const router   = express.Router();
const { MongoClient } = require('mongodb');
const axios    = require('axios');

// ── CONFIG (use env vars — never hardcode) ──────────────────────────────────
const MONGODB_URI   = process.env.MONGODB_URI;           // from .env
const N8N_WEBHOOK   = process.env.N8N_LEAD_WEBHOOK_URL;  // from n8n → your webhook URL
const DB_NAME       = '3tattava';
const COLLECTION    = 'leads';

// ── DB client (singleton) ────────────────────────────────────────────────────
let db;
async function getDB() {
  if (!db) {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
  }
  return db;
}

// ── POST /api/leads ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, phone, interest, source } = req.body;

  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email, phone required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const database = await getDB();
    const collection = database.collection(COLLECTION);

    // Check for duplicate
    const existing = await collection.findOne({ email: email.toLowerCase().trim() });

    const leadDoc = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\D/g, ''),
      interest: interest || 'not_specified',
      source: source || 'website',
      ip: req.ip,
      user_agent: req.headers['user-agent'],
      created_at: new Date(),
      last_seen: new Date(),
      offer_code: 'EARLY3T',
      converted: false,
    };

    if (existing) {
      // Update last_seen, don't re-trigger email
      await collection.updateOne(
        { email: email.toLowerCase().trim() },
        { $set: { last_seen: new Date() } }
      );
      return res.json({ success: true, duplicate: true });
    }

    // New lead — save
    await collection.insertOne(leadDoc);

    // Trigger n8n webhook (non-blocking — don't wait)
    if (N8N_WEBHOOK) {
      axios.post(N8N_WEBHOOK, {
        name: leadDoc.name,
        email: leadDoc.email,
        phone: leadDoc.phone,
        interest: leadDoc.interest,
        source: leadDoc.source,
        offer_code: leadDoc.offer_code,
        timestamp: leadDoc.created_at.toISOString(),
      }).catch(err => console.error('n8n webhook failed:', err.message));
    }

    return res.json({ success: true, duplicate: false });

  } catch (err) {
    console.error('Lead save error:', err);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
});

// ── GET /api/leads/count ─────────────────────────────────────────────────────
// Used to show real "X of 100 spots taken" counter on frontend
router.get('/count', async (req, res) => {
  try {
    const database = await getDB();
    const count = await database.collection(COLLECTION).countDocuments();
    return res.json({ count, target: 100, remaining: Math.max(0, 100 - count) });
  } catch {
    return res.status(500).json({ error: 'Count failed' });
  }
});

module.exports = router;

/*
─────────────────────────────────────────────────────────────────
ENVIRONMENT VARIABLES NEEDED (add to EC2 .env):

N8N_LEAD_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/3tattava-lead

─────────────────────────────────────────────────────────────────
n8n WORKFLOW — import this JSON into n8n → Workflows → Import

The flow:
  [Webhook] → [Set/Format] → [Send Email via Gmail] → [Google Sheets Append]

For the email, use Gmail node with:
  To: {{$json.email}}
  Subject: "You're in the first 100. Here's what that means."
  HTML: (see email template in master plan)

─────────────────────────────────────────────────────────────────
MONGODB INDEX to add (run once in Atlas or mongosh):

db.leads.createIndex({ email: 1 }, { unique: true })
db.leads.createIndex({ created_at: -1 })
db.leads.createIndex({ source: 1 })
─────────────────────────────────────────────────────────────────
*/
