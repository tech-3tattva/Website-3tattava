/**
 * 3TATTAVA Performance Ayurveda — Central content source.
 *
 * Single source of truth for marketing copy across the site.
 * Derived from the Website Rewrite spec (April 2026).
 *
 * Brand voice rules (enforced here):
 *   DO use:    Performance Ayurveda, ritual, cellular, foundation, mineral,
 *              real energy, bioavailable, precision, engineered, root cause.
 *   DO NOT:    ancient secret, ancient wisdom, holistic, mindful transformation,
 *              spiritual journey, healing energy, detox, cleanse, miracle, cure.
 *   Brand name is always "3TATTAVA" (all caps, single spelling).
 */

export const BRAND = {
  name: "3TATTAVA",
  tagline: "Performance Ayurveda for Modern Humans.",
  domain: "3tattava.com",
  url: "https://www.3tattava.com",
  email: "care@3tattava.com",
  founderName: "Dr. Kashish Gupta",
  founderCredentials: "BAMS",
} as const;

export const ANNOUNCEMENT_BAR = {
  text: "FREE SHIPPING ABOVE \u20B9999  \u00B7  THIRD-PARTY LAB-TESTED  \u00B7  DOCTOR-FORMULATED BY DR. KASHISH (BAMS)",
} as const;

export const HERO = {
  headline: "Performance Ayurveda.",
  headlineAccent: "Engineered for the Way You Actually Live.",
  subheadline:
    "Pure Himalayan Shilajit \u2014 80+ trace minerals, 70%+ fulvic acid \u2014 as resin and honey sticks your body will actually absorb. Resin for the purist. Honey Sticks for the daily ritual.",
  primaryCta: { label: "SHOP SHILAJIT RESIN", href: "/products/shodhit-shilajit-resin" },
  secondaryCta: { label: "TRY HONEY STICKS", href: "/products/shahjeet-sticks" },
} as const;

export const TRUST_BADGES = [
  { icon: "mountain", label: "Sourced at 10,000\u201316,000 ft" },
  { icon: "flask", label: "NABL-accredited third-party tested" },
  { icon: "stethoscope", label: "Doctor-Formulated (BAMS)" },
  { icon: "droplet", label: "80+ Trace Minerals" },
  { icon: "shield-check", label: "AYUSH-GMP · US-FDA facility registration (not product approval)" },
] as const;

export const THREE_PILLARS = {
  header: "Three Elements. One Performance System.",
  subheader:
    "3TATTAVA is built on the three fundamental energies that govern your body \u2014 Vata, Pitta, Kapha. When they're balanced and fuelled, you perform. When they're depleted, you crash. We fix the foundation.",
  pillars: [
    {
      number: "01",
      name: "BALANCE",
      outcome: "Cellular Energy",
      body: "Your mitochondria need 80+ trace minerals to produce ATP \u2014 your body's real energy currency. Shilajit delivers what caffeine can't: energy that builds over weeks, not minutes.",
    },
    {
      number: "02",
      name: "BUILD",
      outcome: "Physical Performance",
      body: "Fulvic acid increases nutrient absorption by up to 28x. Every supplement you're already taking works harder when your mineral foundation is right.",
    },
    {
      number: "03",
      name: "BECOME",
      outcome: "Long-Term Vitality",
      body: "This isn't a 30-day experiment. It's a daily ritual that compounds \u2014 steady energy, recovery, and resilience that builds month over month.",
    },
  ],
} as const;

export const PRODUCT_SHOWCASE = {
  header: "Resin or Sticks. Zero Excuses.",
  subheader: "We solved all three problems with Shilajit: form, source, and delivery.",
  comparisonCallout:
    "Not sure which format? Resin = maximum potency for the committed ritualist. Honey Sticks = daily convenience for the person who'll actually stick with it. Both deliver the same 80+ minerals and 70%+ fulvic acid.",
  products: [
    {
      slug: "shilajit-resin",
      tag: "PERFORMANCE",
      name: "Himalayan Shilajit Resin \u2014 20g",
      tagline: "The purist's choice. Rice-grain dose, warm water, 30 seconds. 30\u201340 day supply.",
      price: 1299,
      cta: "SHOP RESIN",
    },
    {
      slug: "shilajit-honey-sticks",
      tag: "DAILY RITUAL",
      badge: "INDIA'S FIRST",
      name: "Shilajit + Honey Sticks \u2014 30 Pack",
      tagline: "Tear. Squeeze. Perform. Shilajit + raw honey in a 10-second morning ritual. No taste issue. No measuring. No mess.",
      price: 999,
      cta: "SHOP HONEY STICKS",
    },
    {
      slug: "starter-kit",
      tag: "BEST VALUE",
      name: "The Starter Kit \u2014 Resin + Honey Sticks",
      tagline: "Try both formats. Find your ritual.",
      price: 1799,
      compareAtPrice: 2298,
      savings: 499,
      cta: "GET THE KIT",
    },
    {
      slug: "honey-sticks-subscription",
      tag: "SUBSCRIBE & SAVE 25%",
      name: "Monthly Honey Sticks \u2014 Auto-Delivery",
      tagline: "Never miss a day. Cancel anytime. Free shipping.",
      price: 799,
      compareAtPrice: 999,
      cta: "SUBSCRIBE",
    },
  ],
} as const;

export const RESULTS_TIMELINE = {
  header: "What to Expect \u2014 Week by Week",
  weeks: [
    {
      range: "Week 1\u20132",
      title: "Foundation",
      body: "Your body begins absorbing 80+ trace minerals. Most people notice the afternoon energy crash starting to fade.",
    },
    {
      range: "Week 3\u20134",
      title: "Momentum",
      body: "Sustained energy without caffeine dependency. Better sleep quality. Sharper mornings.",
    },
    {
      range: "Week 6\u20138",
      title: "Performance",
      body: "Measurable improvements in stamina, recovery time, and mental clarity. This is where the compounding begins.",
    },
    {
      range: "Week 10\u201312",
      title: "Transformation",
      body: "The daily mineral ritual has fully compounded. Many people report their steadiest energy, recovery and overall sense of well-being by this stage.",
    },
  ],
  cta: { label: "Start Your 90-Day Ritual", href: "/products" },
} as const;

export const TESTIMONIALS = {
  header: "Real Results. Real People.",
  disclaimer: "These are real customers. We don't edit reviews. We don't pay for testimonials.",
  items: [
    {
      name: "[Placeholder Name]",
      age: 28,
      city: "Bangalore",
      segment: "Fitness",
      quote:
        "I was spending \u20B93,000/month on pre-workouts and recovery supplements. Replaced all of it with one honey stick every morning. Week 4, my trainer noticed the difference before I did.",
      rating: 5,
    },
    {
      name: "[Placeholder Name]",
      age: 34,
      city: "Mumbai",
      segment: "Professional",
      quote:
        "Three coffees before noon was my normal. By week 3 with the resin, I was down to one \u2014 and I wasn't crashing at 3pm anymore. My wife noticed I was sleeping better too.",
      rating: 5,
    },
    {
      name: "[Placeholder Name]",
      age: 31,
      city: "Delhi",
      segment: "Women's Wellness",
      quote:
        "I'd tried so many things that just upset my stomach. The honey sticks were the first thing I could actually take every single day \u2014 and keep taking. It became part of my morning without a second thought.",
      rating: 5,
    },
  ],
} as const;

export const FOUNDER = {
  header: "Formulated by Dr. Kashish Gupta, BAMS",
  quote:
    "I stopped seeing patients because one consultation can't fix a generation. The same pattern in 20 people every day \u2014 no real energy, broken sleep, dependency on stimulants. They all thought this was normal. It's not. Your cells are starving for minerals. I built 3TATTAVA to fix the foundation.",
  credentials:
    "Qualified Ayurveda Doctor (BAMS) \u00B7 90-day personal Shilajit protocol \u00B7 Founder, 3TATTAVA",
  cta: { label: "Read Dr. Kashish's Full Story", href: "/about" },
} as const;

export const EDUCATION_PREVIEW = {
  header: "Learn Before You Buy. We Prefer It That Way.",
  articles: [
    {
      slug: "what-is-performance-ayurveda",
      title: "What Is Performance Ayurveda? (And Why It's Not What You Think)",
      dek: "Ayurveda was never slow healing. It was the original performance science. Here's what that means for you.",
    },
    {
      slug: "shilajit-honey-sticks-format",
      title: "Shilajit Honey Sticks: The Format That Changes Everything",
      dek: "The #1 reason people stop taking Shilajit? The taste. We solved it \u2014 and made it 10 seconds.",
    },
    {
      slug: "iron-deficiency-indian-women",
      title: "Iron Deficiency in Indian Women: The Crisis Nobody's Talking About.",
      dek: "Shilajit was never a men's product. That's just how it was marketed. Here's the science.",
    },
  ],
} as const;

export const NEWSLETTER = {
  headline: "The Performance Ayurveda Brief",
  subheadline:
    "Weekly insights on minerals, energy, and what your body is actually missing. Written by Dr. Kashish. No spam. No fluff. Just science.",
  placeholder: "Your email",
  cta: "JOIN THE BRIEF",
} as const;

export const FOOTER = {
  tagline: "Performance Ayurveda for Modern Humans.",
  email: "care@3tattava.com",
  columns: {
    shop: {
      heading: "Shop",
      links: [
        { label: "Shilajit Resin", href: "/products/shodhit-shilajit-resin" },
        { label: "Shahjeet Honey Sticks", href: "/products/shahjeet-sticks" },
        { label: "All Products", href: "/products" },
      ],
    },
    about: {
      heading: "About",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Dr. Kashish", href: "/about#founder" },
        { label: "Sourcing & Lab Reports", href: "/product-journey" },
        { label: "Blog", href: "/education" },
        { label: "Careers", href: "/careers" },
      ],
    },
    learn: {
      heading: "Learn",
      links: [
        { label: "What Is Shilajit?", href: "/education/what-is-fulvic-acid" },
        { label: "Shilajit for Women", href: "/education/shilajit-for-women" },
        { label: "Performance Ayurveda Guide", href: "/education/what-is-performance-ayurveda" },
        { label: "FAQs", href: "/faq" },
      ],
    },
    support: {
      heading: "Support",
      links: [
        { label: "Track Order", href: "/track-order" },
        { label: "Returns & Refunds", href: "/returns" },
        { label: "Contact Us", href: "/contact" },
        { label: "Shipping Policy", href: "/shipping" },
      ],
    },
  },
  legal: {
    complianceLine:
      "AYUSH-GMP Certified Facility \u00B7 US-FDA facility registration (not product approval) \u00B7 NABL-accredited third-party tested (Eurofins)",
    certifications: ["NABL-accredited third-party tested", "AYUSH-GMP Certified", "US-FDA facility registration (not product approval)"],
    companyLine:
      "3TATTAVA products are Ayurvedic proprietary medicines (APM) manufactured under a valid Ayurveda manufacturing licence. Use only as directed on the label. This information is for general awareness and is not a substitute for professional medical advice.",
  },
} as const;

export const NOT_FOUND = {
  headline: "This page took a wrong turn somewhere in the Himalayas.",
  subheadline: "The page you're looking for doesn't exist. But these do:",
  ctas: [
    { label: "SHOP HONEY STICKS", href: "/products/shahjeet-sticks" },
    { label: "SHOP SHILAJIT RESIN", href: "/products/shodhit-shilajit-resin" },
    { label: "READ THE EDUCATION HUB", href: "/education" },
  ],
  homeLink: { label: "Or go back to the homepage", href: "/" },
} as const;

export const SHOP_PAGE = {
  h1: "The Performance Ayurveda Collection",
  subheading:
    "Resin or honey sticks. Same pure Himalayan Shilajit. Choose the ritual that fits your life.",
  filters: ["All Products", "Shilajit Resin", "Honey Sticks", "Bundles", "Subscribe & Save"],
  featuredBanners: [
    { label: "NEW: Shahjeet Honey Sticks — India's First", href: "/products/shahjeet-sticks" },
    { label: "Classically Purified Shilajit Resin \u2014 The Deep Ritual", href: "/products/shodhit-shilajit-resin" },
  ],
} as const;

export const OUR_STORY = {
  h1: "Why an Ayurveda Doctor Stopped Seeing Patients",
  subheadline: "And built India's first Performance Ayurveda brand instead.",
  problemHeader: "The Problem Nobody's Fixing",
  problemBody: [
    "Sitting in his clinic, Dr. Kashish saw the same pattern in 20 patients every day. No real energy. Broken sleep. Dependency on stimulants. Relentless burnout. And the worst part \u2014 they all thought this was normal.",
    "One consultation can't fix a generation. So he stopped seeing patients and started building something.",
    "Something rooted in what actually works \u2014 Ayurveda's mineral science and adaptogenic intelligence \u2014 but designed for the way people actually live. Not powders you'll forget. Not capsules you don't trust. Something you'll actually want to take every single morning.",
    "That's 3TATTAVA.",
  ],
  sourcing: {
    header: "From 16,000 Feet to Your Morning Ritual",
    subheader: "300 years of the Himalayas, compressed into one substance.",
    steps: [
      {
        number: "01",
        title: "Sourcing",
        body: "Raw Shilajit (Asphaltum Punjabanum) is harvested from Himalayan deposits at 10,000\u201316,000ft altitude \u2014 where mineral concentration and resin maturity peak. The ore is sourced from verified Himalayan sites with known geological provenance.",
      },
      {
        number: "02",
        title: "Purification (Triphala Shodhan)",
        body: "Every batch undergoes classical Triphala Shodhan purification \u2014 as prescribed in Ashtanga Hridayam. Conducted in an AYUSH-GMP certified facility in Rajasthan. This removes heavy metals and rock impurities while preserving fulvic acid integrity.",
      },
      {
        number: "03",
        title: "NABL Lab Testing",
        body: "Before a single jar ships, every batch is tested by an independent NABL-accredited third-party laboratory for: fulvic acid concentration (\u226570%), heavy metals (Lead, Mercury, Arsenic \u2014 below AYUSH limits), microbial contamination, and stability. NABL Batch Report: #RK2024-08.",
      },
      {
        number: "04",
        title: "Packaging & QR Verification",
        body: "Glass jar (never plastic \u2014 plastic leaches into resin). Every pack carries a QR code linking to the batch-specific NABL-accredited third-party lab report. Marketed by SankalpaSiddhi Ayupharma Pvt. Ltd., C-17 Central Market, New Seemapuri, Delhi \u2013 110095. Manufactured in an AYUSH-GMP certified facility with US-FDA facility registration (not product approval).",
      },
    ],
    certifications: ["NABL-accredited third-party tested", "AYUSH-GMP Certified", "US-FDA facility registration (not product approval)", "Triphala Shodhan Purified"],
    cta: { label: "View Our Latest Lab Report", href: "/lab-reports" },
  },
} as const;

export const EDUCATION_HUB = {
  h1: "The Performance Ayurveda Knowledge Center",
  subheadline:
    "Doctor-reviewed guides on Shilajit, minerals, energy, and what your body is actually missing. No fluff. No spiritual woo. Just the science that matters.",
  pillars: [
    {
      name: "Shilajit Science",
      icon: "molecule",
      articles: [
        "What Is Shilajit? The Complete Guide",
        "Shilajit Benefits: What the Research Actually Says",
        "How to Check If Your Shilajit Is Pure (5 Tests)",
        "Shilajit Resin vs. Capsules vs. Honey Sticks: Which Form Is Best?",
        "Shilajit Dosage Guide: How Much Should You Actually Take?",
        "Shilajit Side Effects: What to Know Before You Start",
      ],
    },
    {
      name: "Performance Ayurveda",
      icon: "bolt",
      articles: [
        "What Is Performance Ayurveda? (And Why It's Not What You Think)",
        "Shilajit vs. Pre-Workout Supplements: An Honest Comparison",
        "Shilajit vs. Ashwagandha: Which Should You Take?",
        "Ayurvedic Support for Men's Energy & Stamina",
        "The Mineral Deficiency Crisis: Why You're Always Tired",
      ],
    },
    {
      name: "Women's Wellness",
      icon: "cycle",
      articles: [
        "Shilajit for Women: Everything You Need to Know",
        "Iron Deficiency in Indian Women: The Silent Crisis",
        "Shilajit for PCOS: What the Research Shows",
        "Shilajit During Pregnancy: Safety Guide",
        "Beauty Is a Side Effect of Health: Minerals, Skin & Hair",
      ],
    },
    {
      name: "Dosha Intelligence",
      icon: "elements",
      articles: [
        "Vata Dosha: Signs of Imbalance and How to Restore It",
        "Pitta Dosha: Signs of Imbalance and How to Restore It",
        "Kapha Dosha: Signs of Imbalance and How to Restore It",
        "Take the Dosha Assessment",
      ],
    },
  ],
} as const;

export const PAGE_METADATA = {
  home: {
    title: "3TATTAVA \u2014 Performance Ayurveda | Himalayan Shilajit Resin & Honey Sticks",
    description:
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-tested, doctor-formulated. 80+ trace minerals. Shop now.",
  },
  shop: {
    title: "Shop Shilajit Resin & Honey Sticks | 3TATTAVA Performance Ayurveda",
    description:
      "Pure Himalayan Shilajit \u2014 a resin jar and daily honey sticks. Lab-tested purity. 70%+ fulvic acid. Free shipping above \u20B9999.",
  },
  about: {
    title: "Our Story \u2014 Dr. Kashish & 3TATTAVA | India's Performance Ayurveda Brand",
    description:
      "Why an Ayurveda doctor stopped seeing patients and built India's first Performance Ayurveda brand. Meet Dr. Kashish and the 3TATTAVA mission.",
  },
  education: {
    title: "Shilajit & Ayurveda Education Hub | 3TATTAVA Performance Ayurveda",
    description:
      "Doctor-reviewed guides on Shilajit benefits, dosage, women's health, Performance Ayurveda, and mineral science. Learn before you buy.",
  },
  shilajitResin: {
    title: "Pure Himalayan Shilajit Resin 20g | Lab-Tested | 3TATTAVA",
    description:
      "100% pure Himalayan Shilajit resin. 70%+ fulvic acid, 80+ trace minerals. NABL-accredited third-party tested. Doctor-formulated by Dr. Kashish. \u20B91,299. Free shipping.",
  },
  honeySticks: {
    title: "Shilajit Honey Sticks 30-Pack | Daily Energy Ritual | 3TATTAVA",
    description:
      "India's first Shilajit Honey Sticks. Tear, squeeze, perform. 80+ minerals in a 10-second daily ritual. No mess, no bad taste. \u20B91,399 for 30 sticks.",
  },
} as const;
