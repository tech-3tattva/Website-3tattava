export const SITE_NAME = "3TATTAVA";
export const TAGLINE = "Performance Ayurveda for Modern Humans.";

/** Retained export for backwards-compat — Hindi tagline no longer rendered on hero. */
export const HINDI_TAGLINE = "हजारों वर्षों की परंपरा, आज के जीवन के लिए";

export const ANNOUNCEMENT_MESSAGES = [
  "FREE SHIPPING ABOVE ₹999  ·  LAB-CERTIFIED PURITY  ·  DOCTOR-FORMULATED BY DR. KASHISH (BAMS)",
  "INDIA'S FIRST SHILAJIT HONEY STICKS — TEAR. SQUEEZE. PERFORM.",
  "80+ TRACE MINERALS  ·  60%+ FULVIC ACID  ·  NABL LAB-CERTIFIED",
];

export const MAIN_NAV_ITEMS = [
  { label: "Shop", href: "/products", hasMega: true },
  { label: "Knowledge Center", href: "/knowledge-center", hasMega: false },
  { label: "Our Story", href: "/about", hasMega: false },
  { label: "VaidyaConnect", href: "/vaidyaconnect", hasMega: false, featured: true },
  { label: "Research & Testing", href: "/research-testing", hasMega: false },
  { label: "Community", href: "/community", hasMega: false },
  { label: "Find Us", href: "/find-us", hasMega: false },
] as const;

/** Social profiles — override via NEXT_PUBLIC_* in `.env.local` */
export const SOCIAL_LINKS = [
  {
    id: "instagram" as const,
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/3tattava",
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/3tattava",
  },
  {
    id: "linkedin" as const,
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/company/3tattava",
  },
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    href: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://chat.whatsapp.com/FI9HnCNNPF3Fp20mU9avG1",
  },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "Shilajit Resin", href: "/products/shodhit-shilajit-resin" },
    { label: "Shilajit Honey Sticks", href: "/products/shahjeet-sticks" },
    { label: "All Products", href: "/products" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Dr. Kashish", href: "/about#founder" },
    { label: "Research & Testing", href: "/research-testing" },
    { label: "Community", href: "/community" },
    { label: "Find Us", href: "/find-us" },
  ],
  help: [
    { label: "What Is Shilajit?", href: "/education/what-is-fulvic-acid" },
    { label: "Shilajit for Women", href: "/education/shilajit-for-women" },
    { label: "Performance Ayurveda Guide", href: "/education/what-is-performance-ayurveda" },
    { label: "FAQs", href: "/knowledge-center#faqs" },
    { label: "Track Order", href: "/track-order" },
  ],
};

export const TRUST_STRIP_ITEMS = [
  { icon: "⛰️", text: "Sourced at 10,000–16,000ft, Himalayan Deposits" },
  { icon: "🔬", text: "NABL 3rd-Party Lab Certified" },
  { icon: "⚕️", text: "Doctor-Formulated · Dr. Kashish, BAMS" },
  { icon: "💎", text: "80+ Ionic Trace Minerals" },
  { icon: "✓", text: "AYUSH-GMP Certified Facility" },
];

export const CATEGORIES = [
  { name: "Shilajit Resin", slug: "shilajit-resin", color: "#5c4033" },
  { name: "Honey Sticks", slug: "honey-sticks", color: "#D4A574" },
  { name: "Bundles", slug: "bundles", color: "#7a5c4e" },
  { name: "Subscribe & Save", slug: "subscribe-save", color: "#E8C99A" },
];
