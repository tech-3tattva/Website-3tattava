"use client";
import { media } from "@/lib/media";

// ─────────────────────────────────────────────────────────────────────────────
// SHAHJEET — UX Enhancement Primitives
// Motion tokens, reduced-motion gate, scroll progress, word-reveal, ribbon,
// and the fixed conversion banners (desktop side rail + mobile bottom bar).
// Palette locked to the 5 brand tokens.
// ─────────────────────────────────────────────────────────────────────────────

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// ─── Palette (the 5 brand tokens) ────────────────────────────────────────────
export const C = {
  espresso: "#442a1b",
  amber: "#cd872a",
  cream: "#f7f0e2",
  taupe: "#b7a392",
  white: "#ffffff",
  muted: "#6f5a48",
  goldGrad: "linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
} as const;

const F = "var(--font-primary), system-ui, sans-serif";

// ─── Motion tokens ────────────────────────────────────────────────────────────
export const MOTION = {
  ease: [0.16, 1, 0.3, 1] as const,
  dur: { micro: 0.18, base: 0.5, slow: 0.65 },
  stagger: 0.05,
  viewport: { once: true, margin: "-15% 0px -15% 0px" },
} as const;

// ─── Product (single source for the buy banners) ─────────────────────────────
const RAIL_PRODUCT = {
  id: "shahjeet-sticks",
  productId: "shahjeet-sticks",
  name: "SHAHJEET STICKS",
  image: media("/hero/shahjeet-hero.png"),
  price: 1399,
  mrp: 1599,
  slug: "shahjeet-sticks",
} as const;

// ─── Hook: scroll-window visibility ──────────────────────────────────────────
// Shows a banner once the hero is scrolled past, hides near the page bottom
// (so it never overlaps the Final CTA / footer).
function useBuyBannerVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const pastHero = y > vh * 0.9;
      const nearBottom = y + vh > docH - 760;
      setVisible(pastHero && !nearBottom);
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return visible;
}

// ─── Hook: add-to-cart with transient "added" state ──────────────────────────
function useQuickAdd(qty: number): { added: boolean; add: () => Promise<void> } {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const add = async () => {
    await addItem({
      id: RAIL_PRODUCT.id,
      productId: RAIL_PRODUCT.productId,
      name: RAIL_PRODUCT.name,
      image: RAIL_PRODUCT.image,
      price: RAIL_PRODUCT.price,
      mrp: RAIL_PRODUCT.mrp,
      quantity: qty,
      slug: RAIL_PRODUCT.slug,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return { added, add };
}

// ─── Top scroll-progress bar ──────────────────────────────────────────────────
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: "0% 50%",
        scaleX: scrollYProgress,
        background: C.goldGrad,
        zIndex: 1200,
      }}
    />
  );
}

// ─── Word-by-word reveal (mask + rise) ───────────────────────────────────────
export function WordReveal({
  text,
  style,
  delay = 0,
}: {
  text: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span style={{ display: "inline-block", ...style }}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={MOTION.viewport}
            transition={{
              duration: MOTION.dur.slow,
              ease: MOTION.ease,
              delay: delay + i * 0.06,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Full-bleed parallax CTA ribbon ──────────────────────────────────────────
export function Ribbon({
  lines,
  id,
}: {
  lines: string[];
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: C.espresso,
        padding: "clamp(56px,9vh,104px) 24px",
        textAlign: "center",
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-12% 0",
          y: reduce ? 0 : y,
          opacity: 0.10,
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(205,135,42,.9) 0, transparent 38%), radial-gradient(circle at 72% 64%, rgba(228,192,121,.7) 0, transparent 40%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto" }}>
        {lines.map((line, i) => (
          <p
            key={line}
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(20px,3vw,38px)",
              lineHeight: 1.25,
              color: i === lines.length - 1 ? C.amber : C.cream,
              margin: 0,
            }}
          >
            <WordReveal text={line} delay={i * 0.12} />
          </p>
        ))}
      </div>
    </section>
  );
}

// ─── Shared trust row ─────────────────────────────────────────────────────────
const TRUST = ["600mg", "NABL", "AYUSH-GMP", "Doctor Reviewed"];

function TrustRow({ onDark }: { onDark: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px" }}>
      {TRUST.map((t) => (
        <span
          key={t}
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 75,'wght' 600",
            fontSize: "8.5px",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: onDark ? C.amber : C.muted,
          }}
        >
          ✓ {t}
        </span>
      ))}
    </div>
  );
}

// ─── Fixed desktop side rail (the "fixed side banner") ───────────────────────
export function StickyBuyRail() {
  const visible = useBuyBannerVisible();
  const reduce = useReducedMotion();
  const [qty, setQty] = useState(1);
  const { added, add } = useQuickAdd(qty);

  return (
    <div className="shahjeet-rail" style={{ position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 1100 }}>
    <AnimatePresence>
      {visible && (
        <motion.aside
          key="rail"
          aria-label="Buy Shahjeet"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: MOTION.dur.base, ease: MOTION.ease }}
          style={{
            width: 312,
            background: C.white,
            border: `1px solid ${C.taupe}`,
            boxShadow: "0 14px 36px rgba(68,42,27,.16)",
            padding: 18,
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RAIL_PRODUCT.image}
              alt=""
              width={44}
              height={44}
              style={{ objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 13, color: C.espresso, margin: 0 }}>
                Shahjeet®
              </p>
              <p style={{ fontFamily: F, fontSize: 10.5, color: C.muted, margin: "1px 0 0" }}>
                Honey-Shilajit · 30 Sticks
              </p>
            </div>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 26, color: C.espresso, fontVariantNumeric: "tabular-nums" }}>
              ₹{RAIL_PRODUCT.price}
            </span>
            <span style={{ fontFamily: F, fontSize: 13, color: C.taupe, textDecoration: "line-through" }}>
              ₹{RAIL_PRODUCT.mrp}
            </span>
            <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 8.5, letterSpacing: ".12em", color: C.amber, border: `1px solid ${C.amber}`, padding: "2px 6px", marginLeft: "auto" }}>
              SAVE 13%
            </span>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", border: `1px solid ${C.taupe}`, marginBottom: 10, width: "fit-content" }}>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ width: 40, height: 40, background: "transparent", border: "none", cursor: "pointer", fontSize: 18, color: C.espresso }}>−</button>
            <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: 15, color: C.espresso, fontVariantNumeric: "tabular-nums" }}>{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty(qty + 1)}
              style={{ width: 40, height: 40, background: "transparent", border: "none", cursor: "pointer", fontSize: 18, color: C.espresso }}>+</button>
          </div>

          {/* CTA — amber fill + espresso label */}
          <motion.button
            type="button"
            onClick={() => void add()}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            style={{
              width: "100%",
              background: added ? "rgba(205,135,42,.18)" : C.goldGrad,
              color: C.espresso,
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              padding: "13px 18px",
              border: "none",
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            {added ? "✓ Added to Ritual" : "Begin Your Fast Ritual"}
          </motion.button>

          <Link
            href="#lab-reports"
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 600",
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: C.muted,
              textDecoration: "none",
              border: `1px solid ${C.taupe}`,
              padding: "11px 14px",
              marginBottom: 14,
            }}
          >
            View Lab Reports
          </Link>

          <TrustRow onDark={false} />
        </motion.aside>
      )}
    </AnimatePresence>
    </div>
  );
}

// ─── Fixed mobile bottom bar ──────────────────────────────────────────────────
export function MobileBuyBar() {
  const visible = useBuyBannerVisible();
  const reduce = useReducedMotion();
  const { added, add } = useQuickAdd(1);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mobilebar"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 64 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 64 }}
          transition={{ duration: MOTION.dur.base, ease: MOTION.ease }}
          className="shahjeet-mobile-bar"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            gap: 12,
            background: C.espresso,
            padding: "10px 16px calc(10px + env(safe-area-inset-bottom))",
            zIndex: 1100,
            boxShadow: "0 -8px 24px rgba(68,42,27,.28)",
          }}
        >
          <div style={{ lineHeight: 1.1 }}>
            <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 19, color: C.cream, fontVariantNumeric: "tabular-nums" }}>
              ₹{RAIL_PRODUCT.price}
            </span>{" "}
            <span style={{ fontFamily: F, fontSize: 12, color: "rgba(247,240,226,.45)", textDecoration: "line-through" }}>
              ₹{RAIL_PRODUCT.mrp}
            </span>
            <p style={{ fontFamily: F, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: C.amber, margin: "1px 0 0" }}>
              30-Day Supply
            </p>
          </div>
          <motion.button
            type="button"
            onClick={() => void add()}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            style={{
              flex: 1,
              background: added ? "rgba(205,135,42,.22)" : C.goldGrad,
              color: C.espresso,
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              padding: "14px 18px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {added ? "✓ Added" : "Begin Your Fast Ritual"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Amazon-style product gallery (images + video, missing files auto-hide) ──
type GalleryMedia = { type: "image" | "video"; src: string; poster?: string; fit?: "contain" | "cover" };

const GALLERY: GalleryMedia[] = [
  { type: "image", src: media("/hero/shahjeet-hero.png") },
  { type: "image", src: media("/products/shahjeet/04-usage-occasions.jpg"), fit: "cover" },
  { type: "image", src: media("/products/shahjeet/05-swirl-ritual.jpg"), fit: "cover" },
  { type: "image", src: media("/products/shahjeet/01-canister-stick.jpg") },
  { type: "image", src: media("/products/shahjeet/02-stick-honeyrock.jpg") },
  { type: "image", src: media("/products/shahjeet/03-three-sticks-certs.jpg") },
  { type: "video", src: media("/videos/shahjeet-reveal.mp4"), poster: media("/hero/shahjeet-hero.png") },
  { type: "video", src: media("/videos/morning-ritual.mp4"), poster: media("/hero/shahjeet-hero.png") },
];

export function ProductGallery() {
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const visible = GALLERY.map((m, i) => ({ m, i })).filter(({ i }) => !broken[i]);
  const activeItem = !broken[active] ? GALLERY[active] : visible[0]?.m ?? GALLERY[0];

  return (
    <div>
      {/* Main viewer */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: "rgba(247,240,226,.04)",
          border: "1px solid rgba(205,135,42,.18)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {activeItem.type === "video" ? (
          <video
            key={activeItem.src}
            src={activeItem.src}
            poster={activeItem.poster}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={activeItem.src}
            src={activeItem.src}
            alt="Shahjeet — Honey Shilajit Sticks"
            style={{
              width: "100%",
              height: "100%",
              objectFit: activeItem.fit === "cover" ? "cover" : "contain",
              padding: activeItem.fit === "cover" ? 0 : "6%",
              filter: activeItem.fit === "cover" ? "none" : "drop-shadow(0 30px 60px rgba(205,135,42,.22))",
            }}
          />
        )}
      </div>

      {/* Thumbnail rail */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {visible.map(({ m, i }) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View media ${i + 1}`}
            style={{
              position: "relative",
              width: 62,
              height: 62,
              flexShrink: 0,
              cursor: "pointer",
              background: "rgba(247,240,226,.04)",
              border: active === i ? `2px solid ${C.amber}` : "1px solid rgba(183,163,146,.35)",
              padding: 0,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.type === "video" ? m.poster ?? m.src : m.src}
              alt=""
              ref={(el) => {
                if (el && el.complete && el.naturalWidth === 0) {
                  setBroken((b) => (b[i] ? b : { ...b, [i]: true }));
                }
              }}
              onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {m.type === "video" && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(68,42,27,.35)",
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                ▶
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
