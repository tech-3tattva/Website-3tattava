"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { media } from "@/lib/media";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";
import { getAttribution } from "@/lib/attribution";

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const GOLD = "#C8963E";
const INK = "#1c1304";

const PROMO_STORAGE_KEY = "checkoutPromoCode";

const DISCLAIMER =
  "Ayurvedic Proprietary Medicine. Not intended to diagnose, treat, cure or prevent any disease. Not a substitute for medical advice. Consult a qualified physician if you are pregnant, nursing, or on medication.";

const TRUST =
  "Third-party NABL tested · Formulated by a BAMS physician · Triphala purified · Batch reports public";

interface Sku {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  slug: string;
  composition: string;
}

const PRODUCTS: Sku[] = [
  {
    id: "shodhit-shilajit-resin",
    name: "RockResin™ — Classically Purified Shilajit Resin",
    image: media("/home/rockresin-marquee.png"),
    price: 1199,
    mrp: 1399,
    slug: "shodhit-shilajit-resin",
    composition: "Classically purified Shilajit resin. 20 g jar.",
  },
  {
    id: "shahjeet-sticks",
    name: "Shahjeet™ — Honey Shilajit Sticks",
    image: media("/hero/shahjeet-product.png"),
    price: 1399,
    mrp: 1599,
    slug: "shahjeet-sticks",
    composition: "600 mg purified Shilajit in an 8 g honey base. 30 sticks · 240 g net.",
  },
];

// RockResin shows a struck-through MRP; Shahjeet's MRP is unconfirmed so it is
// never rendered as a strike-through (only the sell price is shown).
const SHOW_MRP: Record<string, boolean> = {
  "shodhit-shilajit-resin": true,
  "shahjeet-sticks": false,
};

function ProductCard({ sku }: { sku: Sku }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const showMrp = SHOW_MRP[sku.id];

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addItem({
        id: sku.id,
        productId: sku.id,
        name: sku.name,
        image: sku.image,
        price: sku.price,
        mrp: sku.mrp,
        quantity: 1,
        slug: sku.slug,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid rgba(200,150,62,0.28)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(28,19,4,0.06)",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: CREAM }}>
        <Image
          src={sku.image}
          alt={sku.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 420px"
          style={{ objectFit: "contain", padding: 12 }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "18px 18px 20px" }}>
        <h3
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontSize: "clamp(17px,2.2vw,20px)",
            lineHeight: 1.25,
            color: INK,
            margin: 0,
          }}
        >
          {sku.name}
        </h3>
        <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.55, color: "#5a4a2f", margin: 0 }}>
          {sku.composition}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 24, color: INK }}>
            ₹{sku.price}
          </span>
          {showMrp && (
            <span
              style={{
                fontFamily: F,
                fontSize: 16,
                color: "#9b8a6b",
                textDecoration: "line-through",
              }}
            >
              ₹{sku.mrp}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          aria-label={`Add ${sku.name} to cart`}
          style={{
            marginTop: 8,
            width: "100%",
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontSize: 15,
            letterSpacing: "0.02em",
            color: CREAM,
            background: adding ? "#a97f2f" : GOLD,
            border: "none",
            borderRadius: 999,
            padding: "14px 18px",
            cursor: adding ? "default" : "pointer",
          }}
        >
          {adding ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

function WtfContent() {
  const searchParams = useSearchParams();
  const [promoCode, setPromoCode] = useState("");
  const trackedRef = useRef(false);

  // Fire ViewContent + view_item exactly once, and persist ad attribution so
  // fbclid/UTMs survive into checkout.
  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackPixel("ViewContent", {
      content_name: "wtf_landing",
      content_type: "product",
      currency: "INR",
    });
    trackGa("view_item", { currency: "INR" });
    getAttribution();
  }, []);

  // Prefill the trainer code from ?code= and hydrate any previously saved code.
  useEffect(() => {
    const fromUrl = (searchParams.get("code") ?? "").trim();
    let stored = "";
    try {
      stored = localStorage.getItem(PROMO_STORAGE_KEY) ?? "";
    } catch {
      /* localStorage unavailable */
    }
    const initial = fromUrl || stored;
    if (!initial) return;
    setPromoCode(initial);
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, initial);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  const handlePromoChange = (value: string) => {
    setPromoCode(value);
    try {
      if (value.trim()) localStorage.setItem(PROMO_STORAGE_KEY, value.trim());
      else localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <main style={{ background: CREAM, minHeight: "100vh" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(28px,6vw,56px) 20px 64px" }}>
        {/* 1. Brand lock-up */}
        <header style={{ textAlign: "center", marginBottom: "clamp(24px,5vw,40px)" }}>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wght' 800",
              fontSize: "clamp(15px,2.4vw,18px)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: GOLD,
              margin: 0,
            }}
          >
            WTF Gyms <span style={{ color: INK }}>+</span> 3Tattava
          </p>
        </header>

        {/* 2. Headline */}
        <h1
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 800",
            fontSize: "clamp(28px,6vw,48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: INK,
            textAlign: "center",
            margin: "0 auto",
            maxWidth: 720,
          }}
        >
          Purified Shilajit, lab-verified, made for people who train.
        </h1>

        {/* 3. Trust strip */}
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 600",
            fontSize: "clamp(12px,1.8vw,14px)",
            lineHeight: 1.6,
            color: "#5a4a2f",
            textAlign: "center",
            margin: "18px auto 0",
            maxWidth: 640,
          }}
        >
          {TRUST}
        </p>

        {/* 4. Products */}
        <section
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            marginTop: "clamp(28px,5vw,44px)",
          }}
        >
          {PRODUCTS.map((sku) => (
            <ProductCard key={sku.id} sku={sku} />
          ))}
        </section>

        {/* 5. Proof block */}
        <section
          style={{
            marginTop: "clamp(28px,5vw,44px)",
            textAlign: "center",
            background: "rgba(200,150,62,0.10)",
            border: "1px solid rgba(200,150,62,0.25)",
            borderRadius: 16,
            padding: "22px 20px",
          }}
        >
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wght' 700",
              fontSize: "clamp(17px,2.6vw,22px)",
              color: INK,
              margin: 0,
            }}
          >
            Scan the jar, read its batch report
          </p>
          <Link
            href="/lab-reports"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontFamily: F,
              fontVariationSettings: "'wght' 700",
              fontSize: 14,
              letterSpacing: "0.02em",
              color: CREAM,
              background: GOLD,
              borderRadius: 999,
              padding: "11px 22px",
              textDecoration: "none",
            }}
          >
            View lab reports
          </Link>
        </section>

        {/* 6. Trainer discount code */}
        <section style={{ marginTop: "clamp(24px,4vw,36px)", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
          <label
            htmlFor="wtf-trainer-code"
            style={{
              display: "block",
              fontFamily: F,
              fontVariationSettings: "'wght' 700",
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: INK,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Your trainer&apos;s code
          </label>
          <input
            id="wtf-trainer-code"
            type="text"
            value={promoCode}
            onChange={(e) => handlePromoChange(e.target.value)}
            placeholder="Enter code"
            autoComplete="off"
            style={{
              width: "100%",
              fontFamily: F,
              fontSize: 16,
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INK,
              background: "#fff",
              border: "1.5px solid rgba(200,150,62,0.45)",
              borderRadius: 12,
              padding: "13px 16px",
              outline: "none",
            }}
          />
          <p style={{ fontFamily: F, fontSize: 12, color: "#7a6a4c", textAlign: "center", margin: "8px 0 0" }}>
            Applied automatically at checkout.
          </p>
        </section>

        {/* 7. Disclaimer */}
        <p
          style={{
            fontFamily: F,
            fontSize: 12,
            lineHeight: 1.7,
            color: "#6a5a3c",
            textAlign: "center",
            margin: "clamp(28px,5vw,44px) auto 0",
            maxWidth: 620,
          }}
        >
          {DISCLAIMER}
        </p>
      </div>
    </main>
  );
}

export default function WtfClient() {
  return (
    <Suspense fallback={<div style={{ background: CREAM, minHeight: "100vh" }} />}>
      <WtfContent />
    </Suspense>
  );
}
