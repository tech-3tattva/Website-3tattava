# 3TATTAVA — Website Master Implementation Plan
> **Version:** 1.0 | **Date:** May 2026 | **Stack:** Next.js 14 + EC2 + MongoDB Atlas + n8n

---

## DESIGN SYSTEM EXTRACTED FROM BRAND ASSETS

### Typography
| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Hero | Cormorant Garamond | 300–600 | Headlines, product names, stat numbers |
| Body / UI | DM Sans | 300–500 | Body copy, labels, navigation |
| Eyebrows | DM Sans | 400 | Uppercase, 4px letter-spacing, 10–11px |

### Colour Tokens (confirmed from packaging + content calendar)
```css
:root {
  /* Core brand */
  --black:        #0E0C09;   /* deep background */
  --black-2:      #1A1710;   /* card surfaces */
  --black-3:      #252118;   /* elevated cards */
  --text:         #E8E0D0;   /* primary text */
  --text-muted:   #8A7F6A;   /* secondary / labels */

  /* Gold system */
  --gold:         #C9A84C;   /* primary accent — from content calendar */
  --gold-light:   #E8C97A;   /* highlights */
  --gold-pale:    #F5E8C4;   /* subtle fills */

  /* Shahjeet Sticks packaging */
  --shahjeet-amber:   #CD872A;   /* primary honey gold */
  --shahjeet-dark:    #442A1B;   /* deep brown */
  --shahjeet-cream:   #F7F0E2;   /* off-white */

  /* RockResin packaging */
  --rock-brown:   #442A1B;   /* deep earth */
  --rock-gold:    #C9A84C;   /* metallic */
  --rock-warm:    #B7A392;   /* muted taupe */

  /* Functional */
  --border:       rgba(201,168,76,0.15);
  --border-hover: rgba(201,168,76,0.35);
  --surface:      rgba(255,255,255,0.03);
}
```

### Texture System
- **Noise overlay** on `body::before` — SVG fractalNoise, 0.4 opacity, `pointer-events: none`
- **Gold hairline dividers** — 1px, `rgba(201,168,76,0.2)`
- **Left accent bars** on cards — 3px solid gold, `border-radius: 4px 0 0 4px`
- **Radial glow spots** — `radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)`

---

## TASK LIST — PRIORITY ORDER

### PHASE 0 — FOUNDATION (Do before anything else)
- [ ] Add Google Fonts to `layout.tsx`: Cormorant Garamond + DM Sans
- [ ] Update `globals.css` with the full design token system above
- [ ] Add noise texture layer to root layout
- [ ] Confirm Vercel env vars and redeploy

---

### PHASE 1 — QUICK WINS (Launch blockers that are also UX wins)

---

#### TASK 1.1 — WhatsApp Community Widget
**File:** `components/WhatsAppWidget.tsx`
**Priority:** P0 — builds community before launch

**What it does:**
- Floating button (bottom-right, z-999) with animated pulse ring
- Opens 3Tattava WhatsApp announcement channel (not a bot, direct community link)
- Shows tooltip after 5 seconds: "Join 300+ early members — get launch pricing first"
- On mobile, opens the native WhatsApp app
- Tracks click as a custom event for analytics

**Community link format:**
```
https://chat.whatsapp.com/[YOUR_INVITE_LINK]
```
> Replace with the actual 3Tattava Announcement channel invite link from WhatsApp → Channel info → Invite link

**Design spec:**
- Button: 56px circle, `#25D366` green, gold ring pulse (not green — premium)
- Tooltip: dark card `#1A1710`, gold border, Cormorant Garamond font, 200px wide, arrow pointing right
- Animation: pulse ring expands from 1x to 1.6x over 2s, infinite
- On click: pulse stops, button scales 0.9 briefly, then opens link

**See component file:** `WhatsAppWidget.tsx`

---

#### TASK 1.2 — WhatsApp Segment Groups Setup
**Not a dev task — ops task**

Create these 6 WhatsApp groups under the 3Tattava community:

| Group Name | Target | Entry Point | Content Theme |
|---|---|---|---|
| 3T Performance Community | General / gym audience | Instagram DM keyword JOIN | Product launches, rituals, general |
| 3T Women's Circle | Women 25–40 | Women-specific reel CTA | Iron, energy, hormones, Shatavari |
| 3T Doctor's Network | Ayurveda doctors | VaidyaConnect onboarding | Clinical insights, referral protocol |
| 3T Gym Trainers | WTF Gym + other trainers | WTF in-gym QR | Recovery, performance, client tips |
| 3T Founders & Professionals | Founders, executives | LinkedIn + premium content | Biohacking, focus, stress |
| 3T Early Access | Pre-launch waitlist | Website lead form | Launch pricing, first 100 offer |

**Invite flow:** Website button → opens group-specific link based on button placement context (homepage = general; VaidyaConnect = doctor group; etc.)

---

#### TASK 1.3 — Lead Capture Form (Pop-up)
**File:** `components/LeadCaptureModal.tsx`
**Priority:** P0 — every visitor is a potential pre-order

**Trigger logic:**
- Desktop: fires after **90 seconds** on page
- Mobile: fires after **120 seconds** (less aggressive)
- Never shows twice in same session (`sessionStorage` flag)
- Never shows if user already submitted (localStorage flag)

**Form fields:**
1. Name (text)
2. Email (email)
3. Phone (tel — Indian format, +91 prefix)
4. Interest dropdown: "Energy & Performance" / "Women's Health" / "Gift Someone" / "Just Curious"

**CTA button text:** *"Claim My Early Access Offer"*

**Below button:** "Only 100 spots at launch pricing. 67 claimed so far." (update this number manually weekly)

**On submit:**
1. POST to `/api/leads` on your Express backend
2. Backend saves to MongoDB `leads` collection
3. Backend triggers n8n webhook → n8n sends email
4. Modal closes and shows success state: "You're in. Check your email — the offer is already there."

**n8n webhook payload:**
```json
{
  "name": "Ananya",
  "email": "ananya@gmail.com",
  "phone": "+919876543210",
  "interest": "Women's Health",
  "source": "website_popup",
  "timestamp": "2026-05-23T10:30:00Z"
}
```

**See component file:** `LeadCaptureModal.tsx`
**See backend route file:** `routes/leads.js`

---

#### TASK 1.4 — Launch Email Template
**Triggered by:** n8n on lead form submit
**Subject lines (A/B test these):**

Option A: *"You're in the first 100. Here's what that means."*
Option B: *"Dr. Kashish saved something for you."*

**Email structure:**
```
[3TATTAVA logo — white on black]

You made it.

You're one of the first 100 people who showed up before 
3TATTAVA launched. That matters to us.

Here's what being early gets you:

━━━━━━━━━━━━━━━━━━━━━━━━━
  EARLY ACCESS OFFER
  ₹200 OFF your first order
  Code: EARLY3T
  Valid: Launch day only
━━━━━━━━━━━━━━━━━━━━━━━━━

We launch in [X] days.

You'll get a reminder the morning of launch — 
with one click to order before it goes live to everyone.

— Dr. Kashish Gupta
  Founder, 3TATTAVA
  BAMS (Ayurvedic Doctor)

[3tattava.com] [Instagram @3tattava] [WhatsApp Community]

SankalpaSiddhi Ayupharma Pvt. Ltd.
690A/1, Kabool Nagar, Shahdara, Delhi - 110032
FSSAI: [number] | info@3tattava.com
```

**n8n flow for this email:**
1. Webhook node (receives POST from backend)
2. Set node (format name, format date)
3. Gmail/SES node (send email with template)
4. Google Sheets node (append row to leads tracker)
5. Slack/WhatsApp notification to Dr. Kashish (optional)

**See n8n flow export:** `n8n-lead-capture-flow.json`

---

### PHASE 2 — HERO PRODUCT BANNER (Main visual upgrade)

---

#### TASK 2.1 — Product Hero Section with 3D Scroll Animation
**File:** `components/ProductHeroSection.tsx`
**Page:** Homepage, below the main hero

**Two-product layout — side by side:**

**Left panel: SHAHJEET STICKS**
- Background: `#CD872A` → `#442A1B` gradient (from packaging)
- Floating product box (CSS 3D perspective transform)
- On scroll: box rotates from -15deg to 0deg (Y axis) + translateY(-20px)
- Headline: *"Tear. Squeeze. Perform."* (taken directly from packaging lid)
- Sub: *"600mg of Purified Shilajit. One Honey Stick. Every Morning."*
- Badge: "FOR MEN & WOMEN"
- CTA: "Start the Ritual — ₹999"

**Right panel: ROCKRESIN**
- Background: `#442A1B` → `#1A1710` gradient (from packaging)
- 3D jar rotation on scroll (same mechanic, opposite direction: +15deg to 0deg)
- Headline: *"Dip. Hook. Swirl."* (from packaging)
- Sub: *"Exd.1000mg per serving. Shodhit Shilajit Resin. 20g."*
- Badge: "NABL LAB TESTED"
- CTA: "Experience the Resin — ₹1,299"

**Scroll mechanic (Intersection Observer based):**
```js
// When section enters viewport at 30% threshold:
// - Product boxes animate in with 3D rotation
// - Numbers count up
// - Gold lines expand left-to-right
// Pure CSS + JS, no library needed
```

**AI Image Prompts for this section (generate and upload to S3):**

*Prompt 1 — Shahjeet Sticks hero:*
```
Product photography, 3TATTAVA Shahjeet Sticks honey sachets, 
individual golden stick pack floating in mid-air against deep 
amber-black gradient background (#442A1B to #0E0C09), 
warm cinematic lighting from top-left, honeycomb texture 
bokeh in background, 3D product floating with subtle shadow, 
single drop of honey mid-fall from the stick tip, 
premium luxury supplement photography, no text, 
shot on Hasselblad, 8K resolution
```

*Prompt 2 — RockResin jar hero:*
```
Product photography, dark glass jar of Shilajit resin, 
deep earth-brown amber resin visible through glass, 
dramatic underlighting in dark studio, 
background gradient from #442A1B to pure black, 
single warm golden light source top-right, 
Himalayan mountain silhouette subtly visible in bokeh, 
premium luxury nutraceutical photography, 
no text overlay, shot on Phase One camera, 8K
```

*Prompt 3 — Morning ritual lifestyle:*
```
Close-up hands of a South Asian woman (28-32 years old), 
manicured nails, tearing open a gold honey stick sachet 
over a clear glass of warm water, 
morning light from window casting warm golden shadows, 
minimal white kitchen surface, 
3TATTAVA brand visual style — premium, real, not stock-photo, 
warm amber tones, shallow depth of field, 
editorial photography style, Canon R5
```

*Prompt 4 — Dr. Kashish authority:*
```
Professional portrait, South Asian male doctor (28-35), 
wearing a clean white kurta, not a lab coat, 
confident but warm expression, slight forward lean, 
dark near-black background with subtle warm light, 
gold accent rim lighting, 
shot for premium wellness brand founder photography, 
editorial magazine quality, shallow depth of field, 
NOT stock photography, genuine expression
```

---

### PHASE 3 — VAIDYACONNECT PAGE

---

#### TASK 3.1 — VaidyaConnect Landing Page
**File:** `app/vaidyaconnect/page.tsx`
**Component files:** `components/vaidyaconnect/`

**The vision:** When the page loads, a 3D doctor avatar rotates slowly in a glowing orb. Below it sits a location search. The user types a city, and doctor cards animate in. It should feel like a medical directory from the future.

---

**SECTION 1 — Hero Animation (on page load)**
```
[Revolving Doctor Avatar]
  — SVG/CSS animated orb, 120px, soft gold pulse ring
  — Inside: abstract doctor silhouette (stethoscope icon or custom SVG)
  — Rotates 360° over 8 seconds, infinite, CSS only
  — Gold particle dots orbit slowly around it (CSS keyframes)
  — Below avatar: "3T Verified Ayurveda Doctors Near You"

[Location Search Input]
  — Full-width (max 480px centered)
  — Placeholder: "Enter your city — Delhi, Mumbai, Bengaluru..."
  — Search icon (gold, right side)
  — Dropdown autocomplete for major Indian cities
  — On search: avatar scales down, doctor cards animate in from bottom
```

**SECTION 2 — Doctor Cards Grid**

Each card contains:
- Doctor photo (circular, gold ring border)
- Name: Dr. [Name] (Cormorant Garamond, 20px)
- Qualification: BAMS / MD (Ayurveda)
- Speciality badge: e.g. "Performance Ayurveda" / "Women's Health" / "Sports Medicine"
- Location + distance: "South Delhi · 3.2 km"
- Consultation fee: "₹500 / session" or "₹0 — Community Doctor"
- Trust metrics row:
  - 👤 "142 patients visited" (real counter from DB)
  - ✓ "Recommends 3TATTAVA" (green badge — key trust signal)
  - ⭐ 4.8 (star rating)
- CTA button: "Book Consultation"

**SECTION 3 — Trust Broadcast Panel**
Below the grid, a live ticker (horizontal scroll):

```
"Dr. Pooja Arora from Noida recommended 3TATTAVA Shilajit 
to 23 patients this month"  ·  
"Dr. Rahul Mehta from Bengaluru — 89% patient trust score"  ·  
"3TATTAVA is now available at 12 Ayurveda clinics in Delhi NCR"
```

This is the "announcement kind of" element you asked for — it doubles as social proof and community broadcast.

**Database schema for doctors:**
```js
// MongoDB collection: vaidya_doctors
{
  _id: ObjectId,
  name: "Dr. Pooja Arora",
  photo_url: "https://media.3tattava.com/doctors/pooja-arora.jpg",
  qualification: "BAMS, MD (Ayurveda)",
  speciality: ["Women's Health", "Performance Ayurveda"],
  city: "Noida",
  lat: 28.5355,
  lng: 77.3910,
  consultation_fee: 500,
  is_free: false,
  trusts_3tattava: true,   // ← The key badge
  patients_visited: 142,
  trust_score: 4.8,
  total_reviews: 89,
  booking_link: "https://calendly.com/dr-pooja",
  status: "verified",     // pending | verified | featured
  joined_date: ISODate,
  monthly_recommendations: 23
}
```

**AI Image Prompt — VaidyaConnect hero:**
```
Abstract 3D holographic doctor avatar, gold and deep black, 
glowing orb encasing a minimalist doctor silhouette, 
orbiting gold particle rings, sci-fi meets Ayurveda aesthetic, 
deep black background #0E0C09, 
gold glow #C9A84C radiating outward, 
premium tech-medical UI visual, 
NOT cartoon, NOT realistic face, abstract geometric form, 
suitable for dark luxury D2C brand website, 4K
```

---

### PHASE 4 — ADVANCED FEATURES

---

#### TASK 4.1 — WhatsApp Segment Routing Logic
When users join via different entry points, route them to different groups:

| Page | Button text | Opens |
|---|---|---|
| Homepage (general) | "Join the community" | 3T Performance Community |
| Homepage (women section) | "Join women's circle" | 3T Women's Circle |
| VaidyaConnect | "Doctor onboarding" | 3T Doctor's Network |
| WTF Gym QR | "Join gym community" | 3T Gym Trainers |
| Lead form success | "Join early access" | 3T Early Access |

Each link is simply a different `wa.me/[number]?text=[pre-fill]` or community invite link.

---

#### TASK 4.2 — n8n Complete Workflow Map

**Flow 1: Lead Form Submission**
```
Webhook (POST /n8n/lead) 
→ Format Name + Interest 
→ Check if duplicate (MongoDB lookup) 
→ If new: Save to MongoDB + Google Sheets 
→ Send Email (SES/Gmail) 
→ Notify Dr. Kashish (WhatsApp or Slack)
→ If duplicate: Update last_seen timestamp only
```

**Flow 2: WhatsApp Inbound Query (future — post Interakt setup)**
```
Webhook (POST /n8n/whatsapp-inbound)
→ Extract sender phone + message text
→ Keyword match:
    PRODUCT / SHILAJIT → FAQ reply: "Here's everything about ROCKOIL..."
    PRICE / COST → Price list reply
    ORDER / BUY → Website link reply
    DOCTOR / CONSULT → VaidyaConnect link reply
    WOMEN / IRON → Women's segment reply + Women's Circle group link
    Default → "Hi! I'm 3TATTAVA's assistant. How can I help? Reply with:
                 1 for Products
                 2 for Price
                 3 for Doctors
                 4 for Join community"
→ Save conversation to MongoDB (leads.whatsapp_conversations)
→ If first contact: trigger Email lead flow
```

**Flow 3: VaidyaConnect Doctor Onboarding**
```
Form submit (doctor applies)
→ Save to MongoDB vaidya_doctors (status: pending)
→ Email to Dr. Kashish with doctor details
→ After manual review → status: verified
→ Email to doctor: "You're now a 3T Verified Doctor"
→ Notify doctor's WhatsApp group
```

---

## FILE STRUCTURE FOR ALL NEW COMPONENTS

```
components/
├── WhatsAppWidget.tsx          ← Task 1.1
├── LeadCaptureModal.tsx        ← Task 1.3
├── ProductHeroSection.tsx      ← Task 2.1
└── vaidyaconnect/
    ├── DoctorAvatar.tsx        ← Revolving animation
    ├── LocationSearch.tsx      ← Autocomplete input
    ├── DoctorCard.tsx          ← Individual doctor card
    ├── DoctorGrid.tsx          ← Grid container
    └── TrustTicker.tsx         ← Live broadcast ticker

app/
└── vaidyaconnect/
    └── page.tsx                ← Full VaidyaConnect page

routes/ (Express backend)
├── leads.js                    ← POST /api/leads
├── doctors.js                  ← GET /api/doctors (filtered by city)
└── whatsapp.js                 ← POST /api/whatsapp/webhook

n8n/
├── lead-capture-flow.json      ← Import into n8n
└── whatsapp-bot-flow.json      ← Import into n8n (post Interakt)
```

---

## IMAGE ASSETS TO GENERATE — COMPLETE LIST

Upload all generated images to S3 `3tattava-media-prod` under:
- `brand/hero-[name].jpg` — hero visuals
- `products/shahjeet-[name].jpg` — Shahjeet product images  
- `products/rockresin-[name].jpg` — RockResin product images
- `team/dr-kashish-[name].jpg` — Dr. Kashish portraits
- `vaidyaconnect/[name].jpg` — VaidyaConnect page visuals

| # | Asset | Prompt Reference | S3 Path |
|---|---|---|---|
| 1 | Shahjeet Sticks floating | Prompt 1 above | `products/shahjeet-hero.jpg` |
| 2 | RockResin jar cinematic | Prompt 2 above | `products/rockresin-hero.jpg` |
| 3 | Morning ritual lifestyle | Prompt 3 above | `brand/ritual-lifestyle.jpg` |
| 4 | Dr. Kashish portrait | Prompt 4 above | `team/dr-kashish-hero.jpg` |
| 5 | VaidyaConnect orb | Prompt 5 above | `vaidyaconnect/hero-orb.jpg` |
| 6 | Himalayan sourcing | "Dramatic aerial photo of high-altitude Himalayan mountains above cloud line, sunrise, deep ochre and black tones, no people, cinematic drone photography, 8K, suitable for dark luxury brand" | `brand/himalayan-source.jpg` |
| 7 | Honey drip close-up | "Extreme close-up macro photography of raw dark honey dripping onto pure white surface, warm amber backlight, black background, luxury food photography, no branding" | `products/honey-detail.jpg` |

---

## DEPLOYMENT SEQUENCE (Exact order to follow)

```
Step 1: npm install (add framer-motion if using it for animations)
Step 2: Update globals.css with design tokens
Step 3: Add Google Fonts to layout.tsx
Step 4: Deploy WhatsAppWidget.tsx — test on staging
Step 5: Deploy LeadCaptureModal.tsx — test form + n8n flow
Step 6: Add leads.js Express route — test POST endpoint
Step 7: Set up n8n lead flow (import JSON) — test end-to-end
Step 8: Deploy ProductHeroSection.tsx
Step 9: Generate and upload all images to S3
Step 10: Wire CloudImage component to new S3 assets
Step 11: Build VaidyaConnect page (no live doctors needed — show 3 dummy profiles)
Step 12: Set up Interakt account with new SIM
Step 13: Add WhatsApp bot flows in Interakt
Step 14: Final QA on mobile (iPhone SE breakpoint minimum)
Step 15: Launch
```

---

## DESIGN DECISIONS LOCKED IN

- Font pairing: **Cormorant Garamond (display) + DM Sans (body)** — directly from content calendar, perfect for premium Ayurveda
- Background: **Deep black `#0E0C09`** with noise texture overlay — already established by social media team's calendar
- Gold: **`#C9A84C`** primary, **`#CD872A`** for Shahjeet-specific (matches packaging exactly)
- Border treatment: 1px `rgba(201,168,76,0.2)` — hairline gold, barely visible, premium
- Cards: 3px left accent bar (matches content calendar card design exactly)
- CTAs: Never "Buy Now" — always ritual/benefit language ("Start the Ritual", "Claim My Offer")
- Animations: Scroll-triggered, CSS-first, Framer Motion only where CSS falls short

---

*This document is the single source of truth for the 3TATTAVA website build Phase 2.  
All component files referenced here are in the same `/3tattava-implementation/` folder.*
