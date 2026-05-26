const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

const N8N_WEBHOOK = process.env.N8N_LEAD_WEBHOOK_URL;

// Reuse the app's existing mongoose connection — no second MongoClient needed
const leadSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, required: true },
  interest:    { type: String, default: 'not_specified' },
  source:      { type: String, default: 'website' },
  ip:          String,
  user_agent:  String,
  offer_code:  { type: String, default: 'EARLY3T' },
  converted:   { type: Boolean, default: false },
  last_seen:   { type: Date, default: Date.now },
}, { timestamps: true });

leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ source: 1 });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// POST /api/leads
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, interest, source } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'name, email, phone required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await Lead.findOne({ email: normalizedEmail });
    if (existing) {
      await Lead.updateOne({ email: normalizedEmail }, { $set: { last_seen: new Date() } });
      return res.json({ success: true, duplicate: true });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.replace(/\D/g, ''),
      interest: interest || 'not_specified',
      source: source || 'website',
      ip: req.ip,
      user_agent: req.headers['user-agent'],
    });

    if (N8N_WEBHOOK) {
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          interest: lead.interest,
          source: lead.source,
          offer_code: lead.offer_code,
          timestamp: lead.createdAt.toISOString(),
        }),
      }).catch(err => console.error('[leads] n8n webhook failed:', err.message));
    }

    return res.json({ success: true, duplicate: false });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — race condition, treat as duplicate
      return res.json({ success: true, duplicate: true });
    }
    next(err);
  }
});

// GET /api/leads/count — live "X of 100 spots taken" counter
router.get('/count', async (req, res, next) => {
  try {
    const count = await Lead.countDocuments();
    return res.json({ count, target: 100, remaining: Math.max(0, 100 - count) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
