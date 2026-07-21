const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// Optional: mirror waitlist joins into the same automation used for leads.
const N8N_WEBHOOK = process.env.N8N_LEAD_WEBHOOK_URL;

// Pre-launch product waitlist. Products are hidden while the site collects
// interest; each submission records which product the visitor wants.
const waitlistSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, lowercase: true, trim: true },
  phone:      { type: String, required: true },
  product:    { type: String, default: 'not_specified' },
  source:     { type: String, default: 'website' },
  ip:         String,
  user_agent: String,
}, { timestamps: true });

// One entry per email+product; re-submits refresh the record instead of duplicating.
waitlistSchema.index({ email: 1, product: 1 }, { unique: true });
waitlistSchema.index({ createdAt: -1 });

const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);

// POST /api/waitlist — public join
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, product, source } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'name, email, phone required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const productVal = (product || 'not_specified').toString().trim().slice(0, 120);

    const existing = await Waitlist.findOne({ email: normalizedEmail, product: productVal });

    const doc = await Waitlist.findOneAndUpdate(
      { email: normalizedEmail, product: productVal },
      {
        $set: {
          name: name.toString().trim().slice(0, 120),
          phone: phone.toString().replace(/\D/g, '').slice(0, 15),
          source: (source || 'website').toString().slice(0, 60),
          ip: req.ip,
          user_agent: req.headers['user-agent'],
        },
        $setOnInsert: { email: normalizedEmail, product: productVal },
      },
      { new: true, upsert: true },
    );

    if (!existing && N8N_WEBHOOK) {
      fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          interest: doc.product,
          source: 'waitlist',
          timestamp: doc.createdAt.toISOString(),
        }),
      }).catch(err => console.error('[waitlist] n8n webhook failed:', err.message));
    }

    return res.json({ success: true, duplicate: Boolean(existing) });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ success: true, duplicate: true });
    }
    next(err);
  }
});

// GET /api/waitlist/count — total joins
router.get('/count', async (req, res, next) => {
  try {
    const count = await Waitlist.countDocuments();
    return res.json({ count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
