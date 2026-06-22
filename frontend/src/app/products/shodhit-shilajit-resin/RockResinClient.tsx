"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const F    = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const PRODUCT = {
  id: "shodhit-shilajit-resin",
  name: "SHODHIT SHILAJIT RESIN",
  image: "https://media.3tattava.com/products/Rockresin-hero.jpeg",
  price: 1299,
  mrp: 1499,
  slug: "shodhit-shilajit-resin",
};

// ─── UTILITIES ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p style={{
      fontFamily: F,
      fontVariationSettings: "'wdth' 75,'wght' 500",
      fontSize: "9px",
      letterSpacing: ".30em",
      textTransform: "uppercase",
      color: light ? "rgba(247,240,226,.50)" : "#C8963E",
      marginBottom: "12px",
    }}>
      {text}
    </p>
  );
}

function GoldPill({ text }: { text: string }) {
  return (
    <span style={{
      fontFamily: F,
      fontVariationSettings: "'wdth' 75,'wght' 600",
      fontSize: "9px",
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "#C8963E",
      border: "1px solid rgba(200,150,62,.35)",
      background: "rgba(200,150,62,.08)",
      padding: "4px 12px",
    }}>
      {text}
    </span>
  );
}

// ─── S1 — HERO ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [purchase, setPurchase] = useState<'once'|'bundle'|'subscribe'>('once');
  const { addItem } = useCart();

  const handleAdd = async () => {
    await addItem({
      id: PRODUCT.id,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      image: PRODUCT.image,
      price: PRODUCT.price,
      mrp: PRODUCT.mrp,
      quantity: qty,
      slug: PRODUCT.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "#1c1304", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle,rgba(228,192,121,.8) 1px,transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(64px,8vh,112px) 24px clamp(56px,7vh,96px)", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}
        >
          <span style={{
            background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
            color: "#1c1304",
            fontFamily: F,
            fontVariationSettings: "'wdth' 75,'wght' 700",
            fontSize: "8px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            padding: "5px 14px",
          }}>
            Doctor-Led Performance Ayurveda™
          </span>
        </motion.div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}
          className="grid-cols-1 md:grid-cols-2">

          {/* Left — H1 + copy + CTA */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "clamp(36px,5.5vw,68px)",
                letterSpacing: "-.03em",
                lineHeight: 1.04,
                color: "#f7f0e2",
                marginBottom: "16px",
              }}
            >
              RockResin<sup style={{ fontSize: "40%", verticalAlign: "super" }}>®</sup>
              <br />
              <span style={{ color: "#C8963E" }}>One Resin.</span>
              <br />
              Complete Vitality.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "clamp(14px,1.5vw,17px)",
                lineHeight: 1.75,
                color: "rgba(247,240,226,.72)",
                marginBottom: "28px",
                maxWidth: "480px",
              }}
            >
              Authentic Himalayan Shilajit, Triphala Shodhana-purified, crafted for energy, recovery, resilience, and vitality.
            </motion.p>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "28px" }}
            >
              {["≥70% Fulvic Acid", "Triphala Purified", "NABL Tested", "Himalayan Source", "Men & Women", "Doctor Reviewed"].map((t) => (
                <GoldPill key={t} text={t} />
              ))}
            </motion.div>

            {/* Purchase Options + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.48, ease: EASE }}
            >
              {/* Option cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                {/* One-time */}
                <button
                  type="button"
                  onClick={() => setPurchase('once')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'once' ? "rgba(200,150,62,.10)" : "transparent",
                    border: purchase === 'once' ? "1px solid rgba(200,150,62,.55)" : "1px solid rgba(247,240,226,.14)",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'once' ? "4px solid #C8963E" : "2px solid rgba(247,240,226,.35)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>One-time Purchase</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>20g jar · no commitment</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#f7f0e2" }}>₹{PRODUCT.price}</span>
                </button>

                {/* Subscribe Monthly — Most Popular */}
                <button
                  type="button"
                  onClick={() => setPurchase('subscribe')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'subscribe' ? "rgba(200,150,62,.13)" : "rgba(200,150,62,.04)",
                    border: purchase === 'subscribe' ? "1px solid #C8963E" : "1px solid rgba(200,150,62,.28)",
                    borderLeft: "3px solid #C8963E",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", top: "-9px", left: "14px",
                    background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                    color: "#1c1304", fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700",
                    fontSize: "7px", letterSpacing: ".18em", textTransform: "uppercase",
                    padding: "2px 8px",
                  }}>Most Popular</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'subscribe' ? "4px solid #C8963E" : "2px solid rgba(200,150,62,.55)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>Subscribe Monthly</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>Auto-delivered · Cancel anytime · Save 20%</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#C8963E", margin: 0 }}>₹1,039<span style={{ fontSize: "10px", fontVariationSettings: "'wdth' 75,'wght' 400" }}>/mo</span></p>
                    <p style={{ fontFamily: F, fontSize: "9px", color: "rgba(247,240,226,.35)", margin: "2px 0 0", textDecoration: "line-through" }}>₹{PRODUCT.price}</p>
                  </div>
                </button>

                {/* Bundle */}
                <button
                  type="button"
                  onClick={() => setPurchase('bundle')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'bundle' ? "rgba(200,150,62,.10)" : "transparent",
                    border: purchase === 'bundle' ? "1px solid rgba(200,150,62,.55)" : "1px solid rgba(247,240,226,.14)",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'bundle' ? "4px solid #C8963E" : "2px solid rgba(247,240,226,.35)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>The Complete Ritual</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>RockResin + Shahjeet Sticks · Save 21%</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#f7f0e2", margin: 0 }}>₹1,799</p>
                    <p style={{ fontFamily: F, fontSize: "9px", color: "rgba(247,240,226,.35)", margin: "2px 0 0", textDecoration: "line-through" }}>₹2,298</p>
                  </div>
                </button>
              </div>

              {/* Price display */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
                <span style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 800",
                  fontSize: "clamp(28px,3.5vw,38px)",
                  color: purchase === 'subscribe' ? "#C8963E" : "#f7f0e2",
                }}>
                  {purchase === 'once' ? `₹${PRODUCT.price}` : purchase === 'subscribe' ? '₹1,039/mo' : '₹1,799'}
                </span>
                {purchase !== 'bundle' && (
                  <span style={{ fontFamily: F, fontSize: "16px", color: "rgba(247,240,226,.30)", textDecoration: "line-through" }}>
                    {purchase === 'subscribe' ? `₹${PRODUCT.price}` : `₹${PRODUCT.mrp}`}
                  </span>
                )}
                <span style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "9px",
                  letterSpacing: ".14em",
                  background: "rgba(200,150,62,.18)",
                  border: "1px solid rgba(200,150,62,.35)",
                  color: "#C8963E",
                  padding: "3px 8px",
                }}>
                  {purchase === 'once' ? 'SAVE 13%' : purchase === 'subscribe' ? 'SAVE 20%' : 'SAVE 21%'}
                </span>
              </div>

              {/* Qty + Add */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                {purchase !== 'subscribe' && (
                  <div style={{
                    display: "flex",
                    border: "1px solid rgba(247,240,226,.18)",
                    background: "rgba(247,240,226,.05)",
                  }}>
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
                      style={{ width: "38px", height: "44px", color: "#f7f0e2", background: "transparent", border: "none", cursor: "pointer", fontSize: "18px" }}>−</button>
                    <span style={{ width: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "15px", color: "#f7f0e2" }}>{qty}</span>
                    <button type="button" onClick={() => setQty(qty + 1)}
                      style={{ width: "38px", height: "44px", color: "#f7f0e2", background: "transparent", border: "none", cursor: "pointer", fontSize: "18px" }}>+</button>
                  </div>
                )}

                {purchase === 'subscribe' ? (
                  <Link
                    href="/subscribe-waitlist"
                    style={{
                      flex: 1,
                      display: "block",
                      background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                      color: "#1c1304",
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 85,'wght' 700",
                      fontSize: "11px",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      padding: "14px 24px",
                      textDecoration: "none",
                      textAlign: "center",
                      minWidth: "180px",
                    }}
                  >
                    {/* TODO: Connect Razorpay subscription API post-KYC */}
                    Join Subscribe Waitlist
                  </Link>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => void handleAdd()}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1,
                      background: added
                        ? "rgba(200,150,62,.22)"
                        : "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                      color: "#1c1304",
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 85,'wght' 700",
                      fontSize: "11px",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      padding: "14px 24px",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "180px",
                    }}
                  >
                    {added ? "✓ Added to Ritual" : purchase === 'bundle' ? "Add The Complete Ritual" : "Begin Your Ritual"}
                  </motion.button>
                )}

                <Link
                  href="#lab-reports"
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 600",
                    fontSize: "10px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(247,240,226,.55)",
                    textDecoration: "none",
                    border: "1px solid rgba(247,240,226,.20)",
                    padding: "14px 18px",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Lab Reports
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right — product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.65, ease: EASE }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PRODUCT.image}
              alt="RockResin — Shodhit Himalayan Shilajit"
              style={{
                width: "100%",
                maxWidth: "460px",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 40px 80px rgba(200,150,62,.22))",
              }}
            />
          </motion.div>
        </div>

        {/* Ritual signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{
            borderTop: "1px solid rgba(247,240,226,.08)",
            marginTop: "clamp(36px,5vh,56px)",
            paddingTop: "28px",
            textAlign: "center",
          }}
        >
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(16px,2vw,22px)",
            color: "rgba(247,240,226,.55)",
            marginBottom: "6px",
          }}>
            Dip. Hook. Swirl.
          </p>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontSize: "13px",
            color: "rgba(247,240,226,.32)",
            letterSpacing: ".06em",
          }}>
            Not a supplement. A daily ritual for becoming. — Designed for people who understand that lasting vitality is built daily — not instantly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── S2 — WHY MODERN PERFORMANCE FEELS HARDER ──────────────────────────────
const PROBLEMS = [
  { icon: "🌙", title: "Poor Sleep", body: "Disrupted recovery cycles leave you running on empty. Energy without rest is borrowed — not earned." },
  { icon: "⚡", title: "Constant Stress", body: "Chronic cortisol depletes your mineral reserves and exhausts your adrenal response before the day ends." },
  { icon: "🧠", title: "Mental Fatigue", body: "Decision fatigue, digital overload, and lack of recovery time reduce your cognitive edge steadily." },
];

function ModernPerformanceSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <Eyebrow text="The Problem" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,48px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "16px",
            }}>
              Modern Life Demands More Than Ever.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "clamp(14px,1.6vw,17px)",
              color: "rgba(247,240,226,.60)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.72,
            }}>
              The challenge isn&apos;t always effort. The challenge is often recovery, resilience and maintaining the foundations that modern living slowly depletes.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px", marginBottom: "52px" }}>
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  background: "rgba(247,240,226,.04)",
                  border: "1px solid rgba(247,240,226,.08)",
                  padding: "28px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{p.icon}</div>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "18px",
                  color: "#f7f0e2",
                  marginBottom: "10px",
                }}>{p.title}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13.5px",
                  lineHeight: 1.72,
                  color: "rgba(247,240,226,.55)",
                }}>{p.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div style={{
            background: "rgba(200,150,62,.06)",
            border: "1px solid rgba(200,150,62,.18)",
            padding: "32px 36px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(16px,2vw,22px)",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Performance Starts With Foundations.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "15px",
              color: "rgba(247,240,226,.55)",
              maxWidth: "560px",
              margin: "0 auto 20px",
              lineHeight: 1.7,
            }}>
              Energy without recovery is temporary. Motivation without resilience is fragile. The body must be supported at its foundations before it can truly perform.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(18px,2.5vw,26px)",
              background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Balance · Build · Become
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S3 — NOT ALL SHILAJITS ARE THE SAME ───────────────────────────────────
const COMPARE_ROWS = [
  { metric: "Sourcing", generic: "Unknown origin, unverified altitude", rockresin: "Himalayan deposits, above 16,000ft, documented" },
  { metric: "Purification", generic: "Variable — often absent", rockresin: "Classical Triphala Shodhana, AYUSH-GMP facility" },
  { metric: "Fulvic Acid Content", generic: "Rarely disclosed", rockresin: "≥70% verified per NABL lab report" },
  { metric: "Heavy Metal Testing", generic: "Inconsistent or self-reported", rockresin: "NABL-accredited independent 3rd-party laboratory" },
  { metric: "Lab Report Access", generic: "Rarely provided", rockresin: "Batch-specific NABL COA, downloadable via QR" },
  { metric: "Batch Traceability", generic: "None", rockresin: "Every jar carries unique batch identity" },
  { metric: "Doctor Review", generic: "Marketing-led", rockresin: "Formulated by Dr. Kashish Gupta, BAMS" },
];

function ComparisonSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Quality Comparison" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "12px",
            }}>
              Not All Shilajits Are The Same.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "16px",
              color: "rgba(28,19,4,.50)",
            }}>
              Quality is a process. Not a label.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <style suppressHydrationWarning>{`
            @media (max-width: 640px) {
              .rr-compare-table td:first-child,
              .rr-compare-table th:first-child {
                position: sticky;
                left: 0;
                background: #fff;
                z-index: 2;
                box-shadow: 4px 0 8px rgba(28,19,4,0.06);
              }
            }
          `}</style>
          <div style={{ overflowX: "auto" }}>
            <table className="rr-compare-table" style={{ width: "100%", borderCollapse: "collapse", fontFamily: F }}>
              <thead>
                <tr>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(28,19,4,.45)", background: "#fff", borderBottom: "2px solid rgba(28,19,4,.08)", width: "28%" }}>Quality Factor</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(28,19,4,.45)", background: "#fff", borderBottom: "2px solid rgba(28,19,4,.08)", width: "36%" }}>Generic Market Shilajit</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#C8963E", background: "rgba(200,150,62,.06)", borderBottom: "2px solid rgba(200,150,62,.35)", width: "36%" }}>RockResin®</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.metric} style={{ background: i % 2 === 0 ? "#fff" : "rgba(247,240,226,.55)" }}>
                    <td style={{ padding: "14px 20px", fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "13px", color: "#1c1304", borderBottom: "1px solid rgba(28,19,4,.06)" }}>{row.metric}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "12px", color: "rgba(28,19,4,.50)", borderBottom: "1px solid rgba(28,19,4,.06)", lineHeight: 1.5 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ color: "rgba(180,50,30,.55)", fontWeight: 700 }}>✗</span> {row.generic}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "12px", color: "rgba(28,19,4,.75)", background: "rgba(200,150,62,.04)", borderBottom: "1px solid rgba(200,150,62,.12)", lineHeight: 1.5 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ color: "#C8963E", fontWeight: 700 }}>✓</span> {row.rockresin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.6vw,17px)",
            textAlign: "center",
            color: "rgba(28,19,4,.45)",
            marginTop: "28px",
          }}>
            &ldquo;Because authenticity should never require blind trust.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S4 — THE DEEP RITUAL ──────────────────────────────────────────────────
const RITUAL_STEPS = [
  { word: "DIP", num: "01", title: "Unlock the Purity Within", body: "A precision spatula is included with every jar. Dip it gently into the resin — designed specifically for this ritual." },
  { word: "HOOK", num: "02", title: "Hands-Free. Mess-Free.", body: "Hook a pea-sized amount (300–500mg). The spatula rests on the glass rim — no mess, no guesswork, effortless every morning." },
  { word: "SWIRL", num: "03", title: "A Smooth Golden Ritual", body: "Drop into warm water or milk. Swirl gently. RockResin dissolves completely — no residue, no bitterness. Just a clean golden ritual." },
  { word: "SIP", num: "04", title: "Small Ritual. Meaningful Habit.", body: "Sip slowly. Let the habit compound. Repeated daily, this single ritual becomes the foundation that every other performance habit rests on." },
];

function RitualSection() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <Eyebrow text="The Deep Ritual" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,48px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              Dip. Hook. Swirl.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "16px",
              color: "rgba(28,19,4,.50)",
            }}>
              Four steps. One ritual. A daily anchor for becoming.
            </p>
          </div>
        </Reveal>

        {/* Step selector */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px", flexWrap: "wrap" }}>
          {RITUAL_STEPS.map((s, i) => (
            <button
              key={s.word}
              type="button"
              onClick={() => setActive(i)}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "10px 20px",
                border: "1px solid",
                cursor: "pointer",
                background: active === i ? "#1c1304" : "transparent",
                color: active === i ? "#f7f0e2" : "rgba(28,19,4,.45)",
                borderColor: active === i ? "#1c1304" : "rgba(28,19,4,.18)",
                transition: "all .22s ease",
              }}
            >
              {s.word}
            </button>
          ))}
        </div>

        {/* Active step detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              background: "#1c1304",
              padding: "clamp(28px,4vw,52px)",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "32px",
              alignItems: "center",
              maxWidth: "720px",
              margin: "0 auto 40px",
            }}
          >
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "clamp(48px,8vw,80px)",
                lineHeight: 1,
                background: "linear-gradient(135deg,#A67B2F,#E4C079)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{RITUAL_STEPS[active].num}</p>
            </div>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "8px",
              }}>{RITUAL_STEPS[active].word}</p>
              <h3 style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(18px,2.2vw,24px)",
                color: "#f7f0e2",
                marginBottom: "10px",
              }}>{RITUAL_STEPS[active].title}</h3>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "15px",
                lineHeight: 1.72,
                color: "rgba(247,240,226,.70)",
              }}>{RITUAL_STEPS[active].body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Why Rituals Matter */}
        <Reveal delay={0.1}>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(16px,2vw,20px)",
              color: "rgba(28,19,4,.35)",
              fontStyle: "italic",
            }}>
              People rarely struggle because they lack information. They struggle because they lack consistency.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S5 — WHY TRIPHALA ─────────────────────────────────────────────────────
const TRIPHALA_INGREDIENTS = [
  { name: "Haritaki", latin: "Terminalia chebula", desc: "Polyphenol-rich. Supports elimination of unwanted compounds through Shodhana." },
  { name: "Bibhitaki", latin: "Terminalia bellirica", desc: "Contains gallic acid and ellagic acid. Supports purification at a molecular level." },
  { name: "Amalaki", latin: "Emblica officinalis", desc: "Natural antioxidant activity via chebulinic acid. Supports biological integrity of the resin." },
];

const TRIPHALA_BENEFITS = [
  { title: "Removes Unwanted Impurities", body: "Classical Shodhana eliminates heavy metal traces and rock impurities that are present in raw ore." },
  { title: "Preserves Active Compounds", body: "Unlike harsh chemical purification, Triphala-based Shodhana preserves fulvic acid integrity." },
  { title: "Rooted in Ayurvedic Wisdom", body: "Prescribed in Rasa Ratna Samuccaya and Rasatarangini as the correct preparation for Rasayana use." },
  { title: "Commitment to Process", body: "Classical preparation requires patience. It is slower than shortcuts. That is precisely the point." },
];

function TriphalaSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="The Purification Science" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Why We Purify With Triphala
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "15px",
              color: "rgba(247,240,226,.52)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Classical Ayurvedic texts describe Shodhana as essential before Shilajit is used as Rasayana. Purification has always been central to Ayurveda.
            </p>
          </div>
        </Reveal>

        {/* 3 ingredients */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "40px" }}>
          {TRIPHALA_INGREDIENTS.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.07}>
              <div style={{
                border: "1px solid rgba(200,150,62,.22)",
                padding: "24px",
                background: "rgba(200,150,62,.04)",
              }}>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "18px",
                  color: "#f7f0e2",
                  marginBottom: "3px",
                }}>{ing.name}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "11px",
                  color: "#C8963E",
                  marginBottom: "10px",
                  letterSpacing: ".04em",
                }}>{ing.latin}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "rgba(247,240,226,.60)",
                }}>{ing.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 4 benefits */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "36px" }}>
          {TRIPHALA_BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div style={{
                background: "rgba(247,240,226,.03)",
                border: "1px solid rgba(247,240,226,.07)",
                padding: "22px",
              }}>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "10px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "8px",
                }}>✓ {b.title}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "rgba(247,240,226,.55)",
                }}>{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            color: "#C8963E",
            textAlign: "center",
          }}>
            Triphala Purified™ — A process. Not a marketing claim.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S6 — SEVEN PILLARS ────────────────────────────────────────────────────
const PILLARS = [
  { icon: "⛰", num: "01", title: "Himalayan Sourcing", body: "Above 16,000ft. Natural emergence over centuries through plant and mineral transformation under geological conditions. Source selection is the first step in quality — not the last." },
  { icon: "🌿", num: "02", title: "Triphala Purification", body: "Every batch undergoes Triphala-based Shodhana before becoming RockResin. Preparation matters as much as sourcing." },
  { icon: "💎", num: "03", title: "Authentic Resin Form", body: "Traditional, minimally processed form. No capsules, no fillers, no shortcuts. The form Ayurveda has always prescribed." },
  { icon: "🔬", num: "04", title: "Laboratory Verification", body: "Every batch tested before reaching customers. Trust should be verified — not assumed.", cta: "View Reports" },
  { icon: "⚗", num: "05", title: "Heavy Metal Screening", body: "Purity isn't only about what should be present. It is also about what should not. Screened to established quality standards." },
  { icon: "📦", num: "06", title: "Batch Traceability", body: "Every jar carries its own batch identity, traceable from sourcing through packaging. Transparency should never end after purchase." },
  { icon: "👨‍⚕️", num: "07", title: "Doctor Review", body: "Developed under Dr. Kashish Gupta, BAMS. Every element designed with a simple objective: to create a product worthy of daily use." },
];

function PillarsSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <Eyebrow text="Performance Purity™" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "10px",
            }}>
              The Seven Pillars of Performance Purity™
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "15px",
              color: "rgba(28,19,4,.45)",
            }}>
              Seven pillars. One standard.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.055}>
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(200,150,62,.10)" }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(183,163,146,.24)",
                  padding: "26px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg,#A67B2F,#E4C079,#C8963E)",
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "22px" }}>{p.icon}</span>
                  <span style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "30px",
                    color: "rgba(28,19,4,.08)",
                    lineHeight: 1,
                  }}>{p.num}</span>
                </div>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "17px",
                  color: "#1c1304",
                  marginBottom: "8px",
                }}>{p.title}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13.5px",
                  lineHeight: 1.70,
                  color: "rgba(28,19,4,.58)",
                }}>{p.body}</p>
                {p.cta && (
                  <Link
                    href="#lab-reports"
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 75,'wght' 700",
                      fontSize: "9px",
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "#C8963E",
                      textDecoration: "none",
                    }}
                  >
                    {p.cta} →
                  </Link>
                )}
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700',",
            fontStyle: "italic",
            fontSize: "clamp(16px,2vw,20px)",
            textAlign: "center",
            color: "rgba(28,19,4,.28)",
            marginTop: "44px",
          }}>
            Seven Pillars. One Standard. True quality is defined by the discipline behind every step.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S7 — EVIDENCE BEFORE CLAIMS ───────────────────────────────────────────
const DOCS = [
  "NABL Accredited Lab Testing",
  "Heavy Metal Screening",
  "Microbial Analysis",
  "Raw Material Verification",
  "Batch Traceability",
  "Manufacturing Documentation",
  "QR-Based Authentication",
];

const VERIFY_STEPS = [
  { num: "1", text: "Locate the QR code on your RockResin jar lid or label." },
  { num: "2", text: "Scan with any smartphone camera app." },
  { num: "3", text: "Access your batch-specific NABL lab report." },
  { num: "4", text: "Verify fulvic acid content, heavy metal status, and batch identity." },
];

function EvidenceSection() {
  return (
    <section id="lab-reports" style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Transparency" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Evidence Before Claims™
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "16px",
              color: "rgba(247,240,226,.50)",
            }}>
              Trust is earned through transparency. Not promises.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="grid-cols-1 md:grid-cols-2">
          {/* Left — checklist */}
          <Reveal delay={0.05}>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "10px",
                letterSpacing: ".20em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "20px",
              }}>Quality Documentation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {DOCS.map((d) => (
                  <div key={d} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 18px",
                    background: "rgba(247,240,226,.04)",
                    border: "1px solid rgba(247,240,226,.07)",
                  }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(135deg,#A67B2F,#E4C079)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="#1c1304" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 75,'wght' 500",
                      fontSize: "13px",
                      color: "rgba(247,240,226,.78)",
                    }}>{d}</span>
                  </div>
                ))}
              </div>

              {/* Report links */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
                {["NABL Report", "Heavy Metal Report", "Batch COA"].map((label) => (
                  <Link
                    key={label}
                    href="/lab-reports"
                    style={{
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 75,'wght' 600",
                      fontSize: "9px",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "#C8963E",
                      border: "1px solid rgba(200,150,62,.35)",
                      padding: "6px 14px",
                      textDecoration: "none",
                    }}
                  >
                    View {label} →
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — QR verify steps */}
          <Reveal delay={0.10}>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "10px",
                letterSpacing: ".20em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "20px",
              }}>How To Verify Your RockResin</p>

              {VERIFY_STEPS.map((s, i) => (
                <div key={s.num} style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: i < VERIFY_STEPS.length - 1 ? "20px" : 0,
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    background: "linear-gradient(135deg,#A67B2F,#E4C079)",
                    color: "#1c1304",
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}>{s.num}</div>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "14px",
                    lineHeight: 1.65,
                    color: "rgba(247,240,226,.70)",
                  }}>{s.text}</p>
                </div>
              ))}

              {/* Authenticity tests */}
              <div style={{
                marginTop: "28px",
                padding: "20px",
                background: "rgba(200,150,62,.06)",
                border: "1px solid rgba(200,150,62,.18)",
              }}>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "10px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "10px",
                }}>Authenticity Tests</p>
                <p style={{
                  fontFamily: F,
                  fontSize: "13px",
                  color: "rgba(247,240,226,.65)",
                  lineHeight: 1.65,
                  marginBottom: "8px",
                }}>
                  <strong style={{ color: "#f7f0e2" }}>Mixability Test:</strong> Drop in warm water. RockResin should dissolve smoothly into a golden-brown liquid with no artificial residue or chemical smell.
                </p>
                <p style={{
                  fontFamily: F,
                  fontSize: "13px",
                  color: "rgba(247,240,226,.65)",
                  lineHeight: 1.65,
                }}>
                  <strong style={{ color: "#f7f0e2" }}>Resin Behaviour:</strong> Authentic Shilajit resin softens with warmth and firms when cooled. This is a natural property of genuine mineral resin.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            textAlign: "center",
            color: "rgba(247,240,226,.35)",
            marginTop: "44px",
          }}>
            Quality Creates Confidence. Confidence Creates Consistency. And consistency creates results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S8 — BALANCE · BUILD · BECOME ─────────────────────────────────────────
const BBB = [
  {
    word: "BALANCE", sanskrit: "समत्व", eng: "Samatva",
    headline: "Restore The Foundation",
    sub: "Before strength comes stability.",
    body: "Late nights, constant notifications, irregular routines, mental overload, poor recovery. Before the body can perform, the foundations must be restored. Consistent energy, quality recovery, sustainable vitality, resilience under stress.",
    close: "Every Structure Requires A Foundation. Balance is yours.",
  },
  {
    word: "BUILD", sanskrit: "बल", eng: "Bala",
    headline: "Develop Strength & Resilience",
    sub: "Once foundations are restored, growth becomes possible.",
    body: "Not just physical strength. Mental and emotional resilience. Stronger habits, greater consistency, improved focus, sustainable performance, long-term endurance.",
    close: "Strength Is Built. Not Borrowed.",
  },
  {
    word: "BECOME", sanskrit: "उत्कर्ष", eng: "Utkarsha",
    headline: "Pursue Your Highest Potential",
    sub: "Performance as continuous progression.",
    body: "True vitality is measured not only by how long we live, but by how fully we live. Lifelong vitality, purposeful living, consistent growth, leadership through example.",
    close: "Becoming Never Ends. It evolves.",
  },
];

function BBBSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Eyebrow text="The Philosophy" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,52px)",
              letterSpacing: "-.025em",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Balance · Build · Become
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "16px",
              color: "rgba(247,240,226,.45)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}>
              One Resin. One Ritual. A Lifetime Of Becoming.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
          {BBB.map((b, i) => (
            <Reveal key={b.word} delay={i * 0.09}>
              <div style={{
                borderTop: "3px solid",
                borderImage: "linear-gradient(90deg,#A67B2F,#E4C079,#C8963E) 1",
                paddingTop: "28px",
                height: "100%",
              }}>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 800",
                  fontSize: "9px",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "6px",
                }}>{b.word}</p>
                <p style={{
                  fontFamily: "'Noto Serif Devanagari','Noto Sans Devanagari',serif",
                  fontSize: "clamp(32px,4vw,48px)",
                  color: "rgba(200,150,62,.55)",
                  lineHeight: 1.2,
                  marginBottom: "2px",
                }}>{b.sanskrit}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "11px",
                  color: "rgba(247,240,226,.28)",
                  marginBottom: "16px",
                  letterSpacing: ".06em",
                }}>{b.eng}</p>
                <div style={{ height: "1px", background: "linear-gradient(90deg,#C8963E,transparent)", opacity: 0.3, marginBottom: "16px" }} />
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "clamp(18px,2.2vw,22px)",
                  color: "#f7f0e2",
                  marginBottom: "6px",
                }}>{b.headline}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "rgba(247,240,226,.45)",
                  marginBottom: "12px",
                }}>{b.sub}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13.5px",
                  lineHeight: 1.72,
                  color: "rgba(247,240,226,.58)",
                  marginBottom: "16px",
                }}>{b.body}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "#C8963E",
                }}>{b.close}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── S9 — WHAT TO EXPECT ────────────────────────────────────────────────────
const PHASES = [
  {
    phase: "Week 1", label: "FOUNDATION",
    headline: "Establishing The Ritual",
    points: ["Establishing routine", "Building consistency", "Creating daily awareness", "Beginning the ritual"],
    note: "Before the body changes, the habit changes.",
  },
  {
    phase: "Week 2–4", label: "MOMENTUM",
    headline: "Discipline Becomes Habit",
    points: ["Daily consistency", "Routine adherence", "Sustainable habits", "Long-term commitment"],
    note: "Discipline starts turning into habit.",
  },
  {
    phase: "Month 2–3", label: "PERFORMANCE",
    headline: "Stronger Every Day",
    points: ["Stronger habits", "Improved discipline", "Sustainable wellness", "Greater self-awareness"],
    note: "The compounding of small rituals.",
  },
  {
    phase: "Long Term", label: "BECOMING",
    headline: "An Identity, Not An Event",
    points: ["Lifelong vitality", "Purposeful living", "Consistent growth", "Long-term wellbeing"],
    note: "Wellness is not an event. It is an identity.",
  },
];

function ExpectationSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Eyebrow text="The Journey" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              Small Rituals. Meaningful Change.
            </h2>
          </div>
        </Reveal>

        {/* Disclaimer */}
        <Reveal delay={0.04}>
          <div style={{
            background: "rgba(28,19,4,.04)",
            border: "1px solid rgba(28,19,4,.10)",
            padding: "14px 20px",
            marginBottom: "44px",
            maxWidth: "720px",
            margin: "0 auto 44px",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 400",
              fontSize: "12px",
              lineHeight: 1.65,
              color: "rgba(28,19,4,.52)",
              textAlign: "center",
            }}>
              Every individual is different. Consistency is what drives outcomes — not a single dose. RockResin is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </Reveal>

        {/* Phase grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" }}>
          {PHASES.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.07}>
              <div style={{
                background: "#fff",
                border: "1px solid rgba(183,163,146,.28)",
                padding: "28px",
                height: "100%",
                position: "relative",
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                  padding: "4px 12px",
                  marginBottom: "16px",
                }}>
                  <span style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 700",
                    fontSize: "8px",
                    letterSpacing: ".20em",
                    textTransform: "uppercase",
                    color: "#1c1304",
                  }}>{p.phase}</span>
                </div>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "9px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "8px",
                }}>{p.label}</p>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "17px",
                  color: "#1c1304",
                  marginBottom: "14px",
                }}>{p.headline}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 100,'wght' 400",
                      fontSize: "13px",
                      color: "rgba(28,19,4,.60)",
                      lineHeight: 1.6,
                      paddingLeft: "14px",
                      position: "relative",
                      marginBottom: "4px",
                    }}>
                      <span style={{ position: "absolute", left: 0, color: "#C8963E" }}>·</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "12px",
                  color: "rgba(28,19,4,.40)",
                  borderTop: "1px solid rgba(28,19,4,.08)",
                  paddingTop: "12px",
                }}>{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── S10 — THE ROCKRESIN DIFFERENCE ─────────────────────────────────────────
const DIFFERENCES = [
  { heading: "Authenticity Over Shortcuts", body: "Traditional resin form. No fillers, no unnecessary processing, no shortcuts that compromise what Ayurveda has always prescribed." },
  { heading: "Purification Before Promotion", body: "The Shodhana philosophy: what matters is not only where Shilajit comes from — it is also how it is prepared. Triphala-based Shodhana before anything else." },
  { heading: "Transparency Before Trust", body: "Trust should never depend on marketing. It should depend on evidence. Every batch report is accessible before, during, and after purchase." },
  { heading: "Ritual Before Routine", body: "Dip. Hook. Swirl. This ritual transforms daily consumption into a moment of intention. Consistency is often more powerful than intensity." },
  { heading: "Performance Before Hype", body: "We are not interested in shortcuts. We are interested in helping people build sustainable foundations. That is a slower path. It is also a better one." },
  { heading: "Doctor-Led. Experience-Driven.", body: "Every element of RockResin was designed asking: \"Would this be worthy of becoming someone's daily ritual?\" The answer had to be yes before the product existed." },
];

function DifferenceSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "52px" }}>
            <Eyebrow text="Why RockResin" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "10px",
              maxWidth: "660px",
            }}>
              Not All Shilajits Are Created Equal. Neither Is The Process Behind It.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "0", border: "1px solid rgba(183,163,146,.24)" }}>
          {DIFFERENCES.map((d, i) => (
            <Reveal key={d.heading} delay={i * 0.05}>
              <motion.div
                whileHover={{ background: "#fff" }}
                style={{
                  padding: "32px 28px",
                  borderRight: (i % 2 === 0) ? "1px solid rgba(183,163,146,.24)" : "none",
                  borderBottom: i < DIFFERENCES.length - 2 ? "1px solid rgba(183,163,146,.24)" : "none",
                  transition: "background .22s ease",
                }}
              >
                <div style={{
                  width: "3px",
                  height: "28px",
                  background: "linear-gradient(to bottom,#A67B2F,#E4C079)",
                  marginBottom: "14px",
                }} />
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "17px",
                  color: "#1c1304",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                }}>{d.heading}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13.5px",
                  lineHeight: 1.72,
                  color: "rgba(28,19,4,.62)",
                }}>{d.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(16px,2vw,22px)",
            textAlign: "center",
            color: "rgba(28,19,4,.28)",
            marginTop: "44px",
          }}>
            We didn&apos;t change the resin. We changed everything around it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S11 — REAL PEOPLE REAL JOURNEYS ────────────────────────────────────────
const PERSONAS = [
  { icon: "🏆", title: "The Athlete", name: "Mona Agarwal", desc: "Paralympic Bronze Medalist. Performance is earned daily — not gifted once. Daily discipline, daily recovery, daily ritual.", quote: "Success is not built on one great day. It is built on what you do consistently every day." },
  { icon: "💼", title: "The Entrepreneur", name: "The decision-maker", desc: "Deadlines, decisions, responsibility. The daily ritual becomes a reminder that performance starts within — not in the boardroom.", quote: "The greatest businesses are built by people who invest in themselves first." },
  { icon: "🏢", title: "The Professional", name: "The consistent one", desc: "Focus, adaptability, resilience. In competitive environments, consistency is the ultimate competitive advantage.", quote: "In a world of peaks and crashes, the consistent always outlast the brilliant." },
  { icon: "👨‍👩‍👧", title: "The Parent", name: "The caregiver", desc: "Caring for others starts with caring for yourself. Every morning ritual is an act of self-investment that makes everything else possible.", quote: "You cannot pour from an empty vessel. Fill yourself first." },
  { icon: "📚", title: "The Student", name: "The long-game player", desc: "Success belongs to those who remain consistent — every day, for years. The ritual starts now.", quote: "The student who shows up every day for years will always outperform the one who studies only before exams." },
];

function PersonasSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <Eyebrow text="Community" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,42px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Real People. Real Journeys.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "15px",
              color: "rgba(247,240,226,.45)",
            }}>
              Thousands of small decisions shape who we become.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "18px" }}>
          {PERSONAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{
                  background: "rgba(247,240,226,.04)",
                  border: "1px solid rgba(247,240,226,.08)",
                  padding: "28px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{p.icon}</div>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "9px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "4px",
                }}>{p.title}</p>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "17px",
                  color: "#f7f0e2",
                  marginBottom: "10px",
                }}>{p.name}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.68,
                  color: "rgba(247,240,226,.55)",
                  marginBottom: "14px",
                }}>{p.desc}</p>
                <div style={{
                  borderLeft: "2px solid rgba(200,150,62,.40)",
                  paddingLeft: "14px",
                }}>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 300",
                    fontStyle: "italic",
                    fontSize: "12px",
                    color: "rgba(247,240,226,.42)",
                    lineHeight: 1.65,
                  }}>
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(16px,2vw,20px)",
              color: "rgba(247,240,226,.28)",
              fontStyle: "italic",
              marginBottom: "16px",
            }}>
              Performance Lives In Communities.
            </p>
            <Link
              href="/community"
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "10px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#C8963E",
                border: "1px solid rgba(200,150,62,.35)",
                padding: "11px 22px",
                textDecoration: "none",
              }}
            >
              Join The Journey →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S12 — FAQs ─────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What is RockResin?", a: "RockResin is a doctor-formulated Shodhit Himalayan Shilajit resin — purified using classical Triphala Shodhana as prescribed in Ashtanga Hridayam. Every batch is NABL lab-tested for fulvic acid content (≥70%), heavy metals, and microbial safety before it reaches you." },
  { q: "How should I consume RockResin?", a: "Dip the included spatula into the jar and hook a pea-sized amount (approx. 300–500mg). Drop into warm water or milk and swirl gently until dissolved. The spatula rests on the glass rim — hands-free, mess-free, effortless." },
  { q: "When is the best time to take it?", a: "Most users prefer the morning — taken as a conscious daily ritual before food or with warm water. Ayurveda recommends consistent timing for Rasayana use. Morning or evening work equally well; what matters most is daily consistency." },
  { q: "Can it be taken daily?", a: "Yes. Shilajit is a classical Rasayana — a category of Ayurvedic substances specifically designed for daily long-term use to support vitality, longevity, and resilience. RockResin is formulated for daily ritual use." },
  { q: "Is RockResin suitable for both men and women?", a: "Yes. Shilajit is recommended in classical Ayurvedic texts for both men and women as a Rasayana. There is no classical restriction on gender. RockResin is designed for any adult looking to support their daily energy, recovery, and wellbeing." },
  { q: "Can women specifically benefit from Shilajit?", a: "Classical texts describe Shilajit as a Yogavahi — an amplifier that enhances the properties of whatever it is taken with. Women may benefit in the areas of energy metabolism, antioxidant activity, mineral support, and healthy ageing. It is not recommended during pregnancy or breastfeeding without medical advice." },
  { q: "Does it increase testosterone?", a: "Testosterone is not the primary framing in Ayurveda for Shilajit use. We prefer the classical Rasayana framework: supporting energy, vitality, resilience, and long-term health. Individual hormonal responses vary and depend on multiple factors. We make no specific testosterone claims." },
  { q: "Are there any side effects?", a: "Side effects with genuine, purified Shilajit are uncommon when taken at recommended doses. Issues are more likely with impure, unverified product or excessive consumption. If you have kidney conditions, are pregnant or breastfeeding, or take regular medication, consult a qualified physician before use." },
  { q: "What does Ayurveda say about incorrect Rasayana use?", a: "Classical texts describe contraindications including incorrect Shodhana, improper dosage, wrong timing, incompatible Prakriti, weak Agni, and unhealthy lifestyle. This is why we emphasise purification, doctor review, and consistent daily use — not a casual supplement approach." },
  { q: "Who should consult a healthcare professional first?", a: "Anyone with chronic kidney conditions, autoimmune conditions, who takes blood-thinning or immunosuppressant medication, who is pregnant or breastfeeding, or who has a known iron-storage disorder should consult a qualified physician before use." },
  { q: "How is RockResin different from other Shilajit products?", a: "Most differences are process differences: Himalayan source documentation, Triphala Shodhana purification by AYUSH-GMP facility (URMI Lifesciences LLP), independent NABL 3rd-party lab testing, batch-specific QR verification, glass packaging, and formulation by Dr. Kashish Gupta BAMS. These are not marketing claims — they are documented processes." },
  { q: "Why Triphala Shodhana specifically?", a: "Triphala Shodhana is the purification method prescribed in classical Rasashastra texts for Shilajit. The polyphenols, gallic acid, and ellagic acid in Triphala support the removal of heavy metal traces and rock impurities while preserving the fulvic acid matrix that gives Shilajit its bioactivity." },
  { q: "Can I view your testing reports?", a: "Yes. Every batch carries a QR code on the jar linking to the batch-specific NABL lab report. You can also visit our Lab Reports page to view available reports before purchasing. NABL Batch Reference: #RK2024-08." },
  { q: "What does ≥70% fulvic acid mean?", a: "Fulvic acid is the primary active compound in Shilajit — a natural electrolyte transporter that carries minerals into cells. Our NABL-certified lab report verifies every batch contains at least 70% fulvic acid by dry weight. Most competitors either don't test for this or don't disclose the result." },
  { q: "Where is RockResin sourced and manufactured?", a: "Raw Shilajit: Himalayan deposits at 10,000–16,000ft altitude (Asphaltum Punjabanum). Purified and manufactured by URMI Lifesciences LLP (Mfg. Lic. No. RJ-926AYU E, Rajasthan) — AYUSH-GMP certified. Marketed by SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1 Kabool Nagar, Shahdara, Delhi." },
];

function FAQItem({ faq, i }: { faq: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(28,19,4,.10)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "18px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 85,'wght' 600",
          fontSize: "clamp(14px,1.6vw,16px)",
          color: "#1c1304",
          lineHeight: 1.4,
        }}>
          <span style={{ color: "rgba(28,19,4,.25)", marginRight: "10px", fontVariationSettings: "'wdth' 75,'wght' 500", fontSize: "11px" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "inline-flex",
            width: "22px",
            height: "22px",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(200,150,62,.35)",
            color: "#C8963E",
            fontSize: "18px",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 400",
              fontSize: "14px",
              lineHeight: 1.78,
              color: "rgba(28,19,4,.62)",
              paddingBottom: "18px",
              paddingLeft: "32px",
            }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Questions" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
            }}>
              Common Questions
            </h2>
          </div>
        </Reveal>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} i={i} />
          ))}
        </div>

        <Reveal delay={0.08}>
          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Link
              href="/education"
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "12px",
                letterSpacing: ".12em",
                color: "rgba(28,19,4,.45)",
                textDecoration: "none",
              }}
            >
              Looking for deeper answers? → Explore the Performance Ayurveda Knowledge Hub
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S13 — FINAL CTA ────────────────────────────────────────────────────────
function FinalCTASection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = async () => {
    await addItem({
      id: PRODUCT.id,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      image: PRODUCT.image,
      price: PRODUCT.price,
      mrp: PRODUCT.mrp,
      quantity: qty,
      slug: PRODUCT.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px", textAlign: "center" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="Begin Your Ritual" light />
          <h2 style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontSize: "clamp(26px,4vw,48px)",
            letterSpacing: "-.025em",
            lineHeight: 1.1,
            color: "#f7f0e2",
            marginBottom: "10px",
          }}>
            Ready To Begin?
          </h2>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(16px,2vw,20px)",
            background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "32px",
          }}>
            One Resin. Complete Vitality.
          </p>
        </Reveal>

        {/* 6 trust checkmarks */}
        <Reveal delay={0.06}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "36px" }}>
            {[
              "NABL Lab-Tested",
              "Triphala Purified",
              "Himalayan Sourced",
              "Doctor Formulated",
              "Batch Traceable",
              "Glass Jar Packaged",
            ].map((t) => (
              <span key={t} style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "rgba(247,240,226,.55)",
                border: "1px solid rgba(247,240,226,.12)",
                padding: "5px 12px",
              }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Price */}
        <Reveal delay={0.09}>
          <div style={{ marginBottom: "20px" }}>
            <span style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 800",
              fontSize: "38px",
              color: "#f7f0e2",
            }}>₹{PRODUCT.price}</span>
            <span style={{
              fontFamily: F,
              fontSize: "16px",
              color: "rgba(247,240,226,.28)",
              textDecoration: "line-through",
              marginLeft: "10px",
            }}>₹{PRODUCT.mrp}</span>
          </div>
        </Reveal>

        {/* Qty + CTA */}
        <Reveal delay={0.12}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              border: "1px solid rgba(247,240,226,.18)",
            }}>
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width: "42px", height: "48px", background: "transparent", border: "none", color: "#f7f0e2", cursor: "pointer", fontSize: "20px" }}>−</button>
              <span style={{ width: "42px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "16px", color: "#f7f0e2" }}>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)}
                style={{ width: "42px", height: "48px", background: "transparent", border: "none", color: "#f7f0e2", cursor: "pointer", fontSize: "20px" }}>+</button>
            </div>
            <motion.button
              type="button"
              onClick={() => void handleAdd()}
              whileTap={{ scale: 0.97 }}
              style={{
                background: added ? "rgba(200,150,62,.22)" : "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                color: "#1c1304",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "15px 36px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {added ? "✓ Added to Ritual" : "Begin Your Ritual"}
            </motion.button>
            <Link
              href="/lab-reports"
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 600",
                fontSize: "10px",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "rgba(247,240,226,.45)",
                textDecoration: "none",
                border: "1px solid rgba(247,240,226,.15)",
                padding: "15px 20px",
              }}
            >
              View Reports
            </Link>
          </div>
        </Reveal>

        {/* Brand statement */}
        <Reveal delay={0.16}>
          <div style={{ marginTop: "32px", paddingTop: "28px", borderTop: "1px solid rgba(247,240,226,.08)" }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(16px,2vw,20px)",
              color: "rgba(247,240,226,.30)",
              marginBottom: "8px",
            }}>
              We don&apos;t believe in quick fixes. We believe in daily rituals.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(12px,1.4vw,14px)",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "rgba(247,240,226,.18)",
            }}>
              Dip · Hook · Swirl
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "11px",
              color: "rgba(247,240,226,.22)",
              marginTop: "10px",
              letterSpacing: ".06em",
            }}>
              Balance your foundations. Build your resilience. Become your strongest self.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function RockResinClient() {
  return (
    <div style={{ fontFamily: F, color: "#1c1304" }}>
      {/* S1 — Hero */}
      <HeroSection />
      {/* S2 — Why Modern Performance */}
      <ModernPerformanceSection />
      {/* S3 — Comparison */}
      <ComparisonSection />
      {/* S4 — The Deep Ritual */}
      <RitualSection />
      {/* S5 — Why Triphala */}
      <TriphalaSection />
      {/* S6 — Seven Pillars */}
      <PillarsSection />
      {/* S7 — Evidence */}
      <EvidenceSection />
      {/* S8 — Balance Build Become */}
      <BBBSection />
      {/* S9 — What To Expect */}
      <ExpectationSection />
      {/* S10 — RockResin Difference */}
      <DifferenceSection />
      {/* S11 — Real People */}
      <PersonasSection />
      {/* S12 — FAQs */}
      <FAQSection />
      {/* S13 — Final CTA */}
      <FinalCTASection />
    </div>
  );
}
