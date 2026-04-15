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
  { label: "Shilajit Resin", href: "/products/shilajit-resin", hasMega: false, featured: true },
  { label: "Honey Sticks", href: "/products/shilajit-honey-sticks", hasMega: false },
  { label: "Our Story", href: "/about", hasMega: false },
  { label: "Education", href: "/education", hasMega: false },
] as const;

/** Social profiles — override via NEXT_PUBLIC_* in `.env.local` */
export const SOCIAL_LINKS = [
  {
    id: "instagram" as const,
    label: "Instagram",
    href:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/3tattava",
  },
  {
    id: "email" as const,
    label: "Email",
    href:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL_MAILTO ??
      "mailto:care@3tattava.com?subject=Hello%203TATTAVA",
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    href:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ??
      "https://www.facebook.com/3tattava",
  },
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    href:
      process.env.NEXT_PUBLIC_WHATSAPP_URL ??
      "https://wa.me/919999999999?text=Hi%203TATTAVA%2C%20",
  },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "Shilajit Resin", href: "/products/shilajit-resin" },
    { label: "Shilajit Honey Sticks", href: "/products/shilajit-honey-sticks" },
    { label: "The Starter Kit", href: "/products/starter-kit" },
    { label: "Subscribe & Save", href: "/products/honey-sticks-subscription" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Dr. Kashish", href: "/about#founder" },
    { label: "Sourcing & Lab Reports", href: "/product-journey" },
    { label: "Blog", href: "/education" },
    { label: "Careers", href: "/careers" },
  ],
  help: [
    { label: "What Is Shilajit?", href: "/education/what-is-shilajit" },
    { label: "Shilajit for Women", href: "/education/shilajit-for-women" },
    { label: "Performance Ayurveda Guide", href: "/education/what-is-performance-ayurveda" },
    { label: "FAQs", href: "/faqs" },
    { label: "Track Order", href: "/track-order" },
  ],
};

export const TRUST_STRIP_ITEMS = [
  { icon: "⛰️", text: "Sourced at 10,000–16,000 ft" },
  { icon: "🔬", text: "NABL Lab-Certified" },
  { icon: "⚕️", text: "Doctor-Formulated (BAMS)" },
  { icon: "🍯", text: "80+ Trace Minerals" },
  { icon: "✓", text: "FSSAI & GMP Certified" },
];

export const CATEGORIES = [
  { name: "Shilajit Resin", slug: "shilajit-resin", color: "#5c4033" },
  { name: "Honey Sticks", slug: "honey-sticks", color: "#D4A574" },
  { name: "Bundles", slug: "bundles", color: "#7a5c4e" },
  { name: "Subscribe & Save", slug: "subscribe-save", color: "#E8C99A" },
];
