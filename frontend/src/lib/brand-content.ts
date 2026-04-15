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
  text: "FREE SHIPPING ABOVE \u20B9999  \u00B7  LAB-CERTIFIED PURITY  \u00B7  DOCTOR-FORMULATED BY DR. KASHISH (BAMS)",
} as const;

export const HERO = {
  headline: "Performance Ayurveda.",
  headlineAccent: "Engineered for the Way You Actually Live.",
  subheadline:
    "Pure Himalayan Shilajit \u2014 80+ trace minerals, 60%+ fulvic acid \u2014 in two formats your body will actually absorb. Resin for the purist. Honey Sticks for the daily ritual.",
  primaryCta: { label: "SHOP SHILAJIT RESIN", href: "/products/shilajit-resin" },
  secondaryCta: { label: "TRY HONEY STICKS", href: "/products/shilajit-honey-sticks" },
} as const;

export const TRUST_BADGES = [
  { icon: "mountain", label: "Sourced at 10,000\u201316,000 ft" },
  { icon: "flask", label: "NABL Lab-Certified Purity" },
  { icon: "stethoscope", label: "Doctor-Formulated (BAMS)" },
  { icon: "droplet", label: "80+ Trace Minerals" },
  { icon: "shield-check", label: "FSSAI & GMP Certified" },
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
      body: "This isn't a 30-day experiment. It's a daily ritual that compounds \u2014 testosterone support, hormonal balance, recovery, and resilience that builds month over month.",
    },
  ],
} as const;

export const PRODUCT_SHOWCASE = {
  header: "Two Formats. Zero Excuses.",
  subheader: "We solved all three problems with Shilajit: form, source, and delivery.",
  comparisonCallout:
    "Not sure which format? Resin = maximum potency for the committed ritualist. Honey Sticks = daily convenience for the person who'll actually stick with it. Both deliver the same 80+ minerals and 60%+ fulvic acid.",
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
      body: "Hormonal support, testosterone optimization (men), iron levels and hormonal balance (women). Blood work tells the story.",
    },
  ],
  cta: { label: "Start Your 90-Day Ritual", href: "/products" },
} as const;

export const TESTIMONIALS = {
  header: "Real Results. Real People. Real Blood Work.",
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
        "My iron was at 8.2. My doctor said supplements. I tried everything \u2014 they all upset my stomach. The honey sticks were the first thing I could actually take daily. Iron at 11.4 after 90 days.",
      rating: 5,
    },
  ],
} as const;

export const FOUNDER = {
  header: "Formulated by Dr. Kashish Gupta, BAMS",
  quote:
    "I stopped seeing patients because one consultation can't fix a generation. The same pattern in 20 people every day \u2014 no real energy, broken sleep, dependency on stimulants. They all thought this was normal. It's not. Your cells are starving for minerals. I built 3TATTAVA to fix the foundation.",
  credentials:
    "Qualified Ayurveda Doctor (BAMS) \u00B7 90-day personal Shilajit protocol with clinical blood work documentation \u00B7 Founder, 3TATTAVA",
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
      title: "50% of Indian Women Are Iron Deficient. Nobody's Talking About It.",
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
        { label: "Shilajit Resin", href: "/products/shilajit-resin" },
        { label: "Shilajit Honey Sticks", href: "/products/shilajit-honey-sticks" },
        { label: "The Starter Kit", href: "/products/starter-kit" },
        { label: "Subscribe & Save", href: "/products/honey-sticks-subscription" },
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
        { label: "What Is Shilajit?", href: "/education/what-is-shilajit" },
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
    fssaiLicense: "FSSAI Lic. No. [XXXXX]",
    certifications: ["FSSAI Licensed", "GMP Certified", "NABL Lab Tested"],
    companyLine:
      "3TATTAVA Ayurveda Pvt. Ltd. \u00B7 Registered under MCA \u00B7 DPIIT Startup India Recognized \u00B7 Udyam MSME Registered",
  },
} as const;

export const NOT_FOUND = {
  headline: "This page took a wrong turn somewhere in the Himalayas.",
  subheadline: "The page you're looking for doesn't exist. But these do:",
  ctas: [
    { label: "SHOP SHILAJIT RESIN", href: "/products/shilajit-resin" },
    { label: "SHOP HONEY STICKS", href: "/products/shilajit-honey-sticks" },
    { label: "READ THE EDUCATION HUB", href: "/education" },
  ],
  homeLink: { label: "Or go back to the homepage", href: "/" },
} as const;

export const SHOP_PAGE = {
  h1: "The Performance Ayurveda Collection",
  subheading:
    "Two formats. Same pure Himalayan Shilajit. Choose the ritual that fits your life.",
  filters: ["All Products", "Shilajit Resin", "Honey Sticks", "Bundles", "Subscribe & Save"],
  featuredBanners: [
    { label: "NEW: Shilajit Honey Sticks \u2014 India's First", href: "/products/shilajit-honey-sticks" },
    { label: "Save \u20B9499 with The Starter Kit", href: "/products/starter-kit" },
  ],
} as const;

export const OUR_STORY = {
  h1: "Why an Ayurveda Doctor Stopped Seeing Patients",
  subheadline: "And built India's first Performance Ayurveda brand instead.",
  problemHeader: "The Problem Nobody's Fixing",
  problemBody: [
    "Sitting in his clinic, Dr. Kashish saw the same pattern in 20 patients every day. No real energy. Broken sleep. Dependency on stimulants. Hormonal disasters. And the worst part \u2014 they all thought this was normal.",
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
        body: "Our Shilajit is harvested from high-altitude Himalayan deposits between 10,000\u201316,000 feet \u2014 the altitude range where resin maturity and mineral concentration peak.",
      },
      {
        number: "02",
        title: "Purification",
        body: "Every batch undergoes traditional Shodhana purification \u2014 the same process used for centuries to remove impurities while preserving bioactive compounds. No chemicals. No shortcuts.",
      },
      {
        number: "03",
        title: "Lab Testing",
        body: "Before a single jar ships, it passes NABL-accredited testing for: fulvic acid concentration (60%+), heavy metals (below WHO limits), microbial contamination, and stability.",
      },
      {
        number: "04",
        title: "Your Ritual",
        body: "Glass jar (never plastic). Gold-standard packaging. QR code on every pack linking to batch-specific lab reports.",
      },
    ],
    certifications: ["NABL Lab Tested", "GMP Certified", "FSSAI Licensed", "Export Quality"],
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
        "Natural Testosterone Support: The Ayurvedic Approach",
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
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-certified, doctor-formulated. 80+ trace minerals. Shop now.",
  },
  shop: {
    title: "Shop Shilajit Resin & Honey Sticks | 3TATTAVA Performance Ayurveda",
    description:
      "Pure Himalayan Shilajit in two formats \u2014 resin jar and daily honey sticks. Lab-certified purity. 60%+ fulvic acid. Free shipping above \u20B9999.",
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
    title: "Pure Himalayan Shilajit Resin 20g | Lab-Certified | 3TATTAVA",
    description:
      "100% pure Himalayan Shilajit resin. 60%+ fulvic acid, 80+ trace minerals. NABL lab-tested. Doctor-formulated by Dr. Kashish. \u20B91,299. Free shipping.",
  },
  honeySticks: {
    title: "Shilajit Honey Sticks 30-Pack | Daily Energy Ritual | 3TATTAVA",
    description:
      "India's first Shilajit Honey Sticks. Tear, squeeze, perform. 80+ minerals in a 10-second daily ritual. No mess, no bad taste. \u20B9999 for 30 sticks.",
  },
} as const;
