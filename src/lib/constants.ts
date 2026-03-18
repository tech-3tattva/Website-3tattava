export const SITE_NAME = "3Tattva Ayurveda & Wellness";
export const TAGLINE = "Balance. Build. Become.";
export const HINDI_TAGLINE = "हजारों वर्षों की परंपरा, आज के जीवन के लिए";

export const ANNOUNCEMENT_MESSAGES = [
  "Free delivery on orders above ₹999 | Code: WELCOME15 for 15% off your first order",
  "Clinically tested. Authentically Ayurvedic. Crafted in GMP-certified facilities.",
  "Authentic Ayurveda — Formulated by certified Ayurvedacharyas",
];

export const MAIN_NAV_ITEMS = [
  { label: "Shop All", href: "/products", hasMega: true },
  { label: "Skin Care", href: "/products?category=skin-care", hasMega: true },
  { label: "Hair Care", href: "/products?category=hair-care", hasMega: true },
  { label: "Body & Wellness", href: "/products?category=body-wellness", hasMega: true },
  { label: "Doshas", href: "/doshas", hasMega: false, featured: true },
  { label: "Gifting", href: "/gifting", hasMega: true },
  { label: "Our Story", href: "/about", hasMega: false },
  { label: "Education Hub", href: "/education", hasMega: false },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Skin Care", href: "/products?category=skin-care" },
    { label: "Hair Care", href: "/products?category=hair-care" },
    { label: "Body Wellness", href: "/products?category=body-wellness" },
    { label: "Gift Sets", href: "/gifting" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Product Journey", href: "/product-journey" },
    { label: "Ayurveda Education", href: "/education" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  help: [
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
    { label: "Store Locator", href: "/stores" },
  ],
};

export const TRUST_STRIP_ITEMS = [
  { icon: "🌿", text: "100% Natural Ingredients" },
  { icon: "🔬", text: "Clinically Formulated" },
  { icon: "🏭", text: "GMP Certified Manufacturing" },
  { icon: "🐰", text: "Cruelty Free" },
  { icon: "🇮🇳", text: "Made in India" },
];

export const CATEGORIES = [
  { name: "Skin Care", slug: "skin-care", color: "#E8DCC8" },
  { name: "Hair Care", slug: "hair-care", color: "#D4A574" },
  { name: "Body Wellness", slug: "body-wellness", color: "#4A7C59" },
  { name: "Stress & Sleep", slug: "stress-sleep", color: "#2D5A3D" },
  { name: "Digestion", slug: "digestion", color: "#E8C99A" },
  { name: "Immunity", slug: "immunity", color: "#F5EFE6" },
  { name: "Women's Health", slug: "womens-health", color: "#E2D9CE" },
  { name: "Gift Sets", slug: "gift-sets", color: "#FAF7F2" },
];
