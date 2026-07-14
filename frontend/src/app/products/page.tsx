import { media } from "@/lib/media";
import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_METADATA } from "@/lib/brand-content";

export const metadata: Metadata = {
  title: PAGE_METADATA.shop.title,
  description: PAGE_METADATA.shop.description,
  alternates: { canonical: "https://www.3tattava.com/products" },
  openGraph: {
    title: PAGE_METADATA.shop.title,
    description: PAGE_METADATA.shop.description,
    url: "https://www.3tattava.com/products",
  },
};

// ─── Static product catalogue ────────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: "shodhit-shilajit-resin",
    badge: "DOCTOR-LED",
    badgeGold: true,
    name: "SHODHIT SHILAJIT RESIN",
    label: "RockResin®",
    subtitle: "Pure Himalayan Shilajit · 20g Jar",
    tagline: "Ancient Mineral Elixir for Modern Vitality",
    price: 1299,
    mrp: 1499,
    discount: "13% OFF",
    image: media("/home/homepage-rockresins.png"),
    pills: ["≥70% Fulvic Acid", "NABL Tested", "Triphala Purified"],
    cta: "Begin Your Ritual",
    rating: 4.9,
    reviewCount: 312,
    hideInfo: false,
  },
  {
    slug: "shahjeet-sticks",
    badge: "INDIA'S FIRST",
    badgeGold: false,
    name: "SHAHJEET STICKS",
    label: "Shahjeet™",
    subtitle: "Honey-Shilajit · 30 Single-Serve Sticks",
    tagline: "Tear. Squeeze. Perform.",
    price: 999,
    mrp: 1199,
    discount: "17% OFF",
    image: media("/hero/shahjeet-hero.png"),
    pills: ["600mg Per Stick", "NABL Tested", "AYUSH GMP"],
    cta: "Start Your Ritual",
    rating: 4.8,
    reviewCount: 218,
    hideInfo: false,
  },
] as const;

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: `https://www.3tattava.com/products/${p.slug}`,
  })),
};

const F = "var(--font-primary), system-ui, sans-serif";

// ─── Star helper ─────────────────────────────────────────────────────────────
function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={i < full ? "#C8963E" : "none"}
          stroke="#C8963E"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p }: { p: (typeof PRODUCTS)[number] }) {
  return (
    <Link
      href={`/products/${p.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        background: "#ffffff",
        border: "1px solid rgba(183,163,146,.30)",
        borderRadius: "0",
        overflow: "hidden",
        transition: "transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease",
        position: "relative",
      }}
      className="group shop-card"
    >
      <style suppressHydrationWarning>{`
        .shop-card:hover { transform: translateY(-5px); box-shadow: 0 22px 60px rgba(28,19,4,.11); }
        .shop-card-img { transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .shop-card:hover .shop-card-img { transform: scale(1.04); }
        .shop-cta { transition: background .24s ease, transform .24s ease; }
        .shop-card:hover .shop-cta { background: #1c1304 !important; }
      `}</style>

      {/* Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 2,
          background: p.badgeGold
            ? "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)"
            : "#1c1304",
          color: p.badgeGold ? "#1c1304" : "#f7f0e2",
          fontFamily: F,
          fontVariationSettings: "'wdth' 75,'wght' 700",
          fontSize: "8px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          padding: "4px 10px",
        }}
      >
        {p.badge}
      </div>


      {/* Image */}
      <div
        style={{
          background: "linear-gradient(135deg,#1c1304 0%,#2a1f14 100%)",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          className="shop-card-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Info panel */}
      <div style={{ padding: "24px 24px 28px" }}>
        {/* Label + subtitle */}
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 800",
            fontSize: "clamp(22px,2.5vw,28px)",
            letterSpacing: "-.01em",
            color: "#1c1304",
            marginBottom: "2px",
          }}
        >
          {p.label}
        </p>
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 75,'wght' 500",
            fontSize: "11px",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "rgba(28,19,4,.45)",
            marginBottom: "10px",
          }}
        >
          {p.subtitle}
        </p>

        {p.hideInfo ? (
          <div style={{ marginTop: "4px" }}>
            <span
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 700",
                fontSize: "10px",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#6f5a48",
                border: "1px solid rgba(183,163,146,.55)",
                background: "rgba(183,163,146,.14)",
                padding: "6px 14px",
                display: "inline-block",
              }}
            >
              Coming Soon
            </span>
          </div>
        ) : (
          <>
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <Stars value={p.rating} />
          <span
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 75,'wght' 600",
              fontSize: "11px",
              color: "rgba(28,19,4,.55)",
            }}
          >
            {p.rating} ({p.reviewCount})
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontStyle: "italic",
            fontSize: "14px",
            color: "rgba(28,19,4,.60)",
            marginBottom: "14px",
            lineHeight: 1.5,
          }}
        >
          {p.tagline}
        </p>

        {/* Attribute pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {p.pills.map((pill) => (
            <span
              key={pill}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#C8963E",
                border: "1px solid rgba(200,150,62,.32)",
                background: "rgba(200,150,62,.06)",
                padding: "3px 10px",
              }}
            >
              ✓ {pill}
            </span>
          ))}
        </div>


        {/* CTA */}
        <div
          className="shop-cta"
          style={{
            background: "#C8963E",
            color: "#1c1304",
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontSize: "11px",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            padding: "13px 0",
            textAlign: "center",
            width: "100%",
          }}
        >
          {p.cta} →
        </div>
          </>
        )}
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Hero banner */}
      <section
        style={{
          background: "#1c1304",
          padding: "clamp(60px,8vw,100px) 24px clamp(48px,6vw,80px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle, rgba(228,192,121,.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 75,'wght' 500",
              fontSize: "9px",
              letterSpacing: ".32em",
              textTransform: "uppercase",
              color: "rgba(247,240,226,.45)",
              marginBottom: "16px",
            }}
          >
            Performance Ayurveda
          </p>
          <h1
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 800",
              fontSize: "clamp(30px,5vw,56px)",
              letterSpacing: "-.025em",
              color: "#f7f0e2",
              marginBottom: "14px",
              lineHeight: 1.08,
            }}
          >
            The Performance Ayurveda Collection
          </h1>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "clamp(15px,1.8vw,18px)",
              color: "#C8963E",
              marginBottom: "36px",
            }}
          >
            Two formats. Same pure Himalayan Shilajit. Choose the ritual that fits your life.
          </p>

          {/* Trust strip */}
          <div
            style={{
              display: "flex",
              gap: "clamp(12px,2vw,28px)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "NABL Lab-Tested Purity",
              "AYUSH-GMP Certified",
              "Doctor Formulated",
              "Himalayan Sourced",
            ].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "9px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(247,240,226,.50)",
                }}
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ background: "#f7f0e2", padding: "clamp(48px,6vw,80px) 24px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "28px",
          }}
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>

        {/* Bundle banner */}
        <div
          style={{
            maxWidth: "900px",
            margin: "28px auto 0",
            background: "#1c1304",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "6px",
              }}
            >
              Best Value
            </p>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(16px,2vw,20px)",
                color: "#f7f0e2",
                marginBottom: "4px",
              }}
            >
              The Complete Ritual Bundle
            </p>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontSize: "13px",
                color: "rgba(247,240,226,.55)",
              }}
            >
              RockResin Jar + 30 Shahjeet Sticks · Save ₹499
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <span
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 800",
                  fontSize: "24px",
                  color: "#f7f0e2",
                }}
              >
                ₹1,799
              </span>
              <span
                style={{
                  fontFamily: F,
                  fontSize: "14px",
                  color: "rgba(247,240,226,.35)",
                  textDecoration: "line-through",
                  marginLeft: "8px",
                }}
              >
                ₹2,298
              </span>
            </div>
            <Link
              href="/products/shodhit-shilajit-resin"
              style={{
                background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                color: "#1c1304",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "10px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "12px 22px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              SAVE 21% →
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy strip */}
      <section
        style={{
          background: "#f7f0e2",
          borderTop: "1px solid rgba(183,163,146,.25)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(16px,2vw,22px)",
            color: "rgba(28,19,4,.30)",
            letterSpacing: "-.01em",
          }}
        >
          Balance Your Foundations. Build Your Resilience. Become Your Strongest Self.
        </p>
      </section>
    </div>
  );
}
