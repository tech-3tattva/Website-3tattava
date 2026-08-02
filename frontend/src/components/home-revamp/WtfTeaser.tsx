"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const GOLD = "#C8963E";
const INK = "#1c1304";

/**
 * Homepage teaser for the WTF Gyms × 3Tattava launch (offline QR channel going
 * live 3 Aug). Links to the dedicated /wtf landing page. On-brand dark panel
 * with a gentle scroll reveal; no pop-ups or heavy assets.
 */
export default function WtfTeaser() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      aria-label="WTF Gyms × 3Tattava — Launching Soon"
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, #2a1c0d 0%, ${INK} 60%)`,
        padding: "clamp(56px,8vw,110px) 20px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <motion.div {...rise(0)} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 0 6px rgba(200,150,62,.18)`,
            }}
          />
          <span style={{ fontFamily: F, fontSize: 12, letterSpacing: ".28em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>
            WTF Gyms × 3Tattava · Launching Soon
          </span>
        </motion.div>

        <motion.h2
          {...rise(0.08)}
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 800",
            fontSize: "clamp(28px,5vw,56px)",
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: CREAM,
            margin: "0 0 18px",
          }}
        >
          Purified Shilajit,<br />made for people who train.
        </motion.h2>

        <motion.p
          {...rise(0.16)}
          style={{
            fontFamily: F,
            fontSize: "clamp(15px,1.9vw,19px)",
            lineHeight: 1.6,
            color: "rgba(247,240,226,.72)",
            maxWidth: 620,
            margin: "0 auto 14px",
          }}
        >
          We&apos;re bringing doctor-formulated, lab-verified performance Ayurveda to
          WTF gym floors across Delhi-NCR. Scan the code at your gym, claim your
          trainer offer, and start the ritual.
        </motion.p>

        <motion.p
          {...rise(0.22)}
          style={{ fontFamily: F, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 30px" }}
        >
          29 locations · Third-party NABL tested · Batch reports public
        </motion.p>

        <motion.div {...rise(0.28)}>
          <Link
            href="/wtf"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: GOLD,
              color: "#2a1c0d",
              fontFamily: F,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              padding: "16px 32px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 14px 40px rgba(200,150,62,.28)",
            }}
          >
            Preview the WTF drop →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
