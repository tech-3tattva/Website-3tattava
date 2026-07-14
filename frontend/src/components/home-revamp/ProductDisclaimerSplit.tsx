"use client";
import { media } from "@/lib/media";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";

const F = "var(--font-primary), system-ui, sans-serif";

/* ─── Colors ─── */
const INK = "#442a1b";
const GOLD = "#cd872a";
const CREAM = "#f7f0e2";
const TAUPE = "#b7a392";

/* ─── Performance Pillars ─── */
const PILLARS = [
  {
    label: "Discipline",
    desc: "Structured routines that compound over time",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="1.5" />
        <path d="M14 6v12M10 14l4 4 4-4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Recovery",
    desc: "Intentional rest that restores the body",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="1.5" />
        <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill={GOLD} />
      </svg>
    ),
  },
  {
    label: "Resilience",
    desc: "The strength to persist through adversity",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="1.5" />
        <path d="M9 19l5-10 5 10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="11" y1="16" x2="17" y2="16" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Consistency",
    desc: "Showing up every single day without exception",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="1.5" />
        <path d="M9 14h10M14 9v10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

/* ─── Trust items ─── */
const TRUST_ITEMS = [
  "Founding Athlete Ambassador",
  "Expert-Led Guidance",
  "Fitness Community Partnerships",
  "Evidence-Based Ayurveda",
];

/* ─── Reveal helper ─── */
function useReveal(ref: React.RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: inView
      ? { opacity: 1, y: 0 }
      : reduce
        ? { opacity: 0 }
        : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });
}

/* ══════════════════════════════════════════════════════════════════
   PART 1 — RockResin Story (dark)
   ══════════════════════════════════════════════════════════════════ */
function RockResinStory() {
  const ref = useRef<HTMLElement>(null);
  const reveal = useReveal(ref);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={ref}
      style={{
        background: INK,
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(32px, 4vw, 56px)",
          alignItems: "center",
        }}
      >
        {/* Teaser image with parallax */}
        <motion.div
          style={{
            y: reduce ? 0 : imgY,
            flex: "0 0 auto",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("/hero/rockresin-teaser.png")}
            alt="RockResin teaser"
            width={280}
            height={210}
            style={{
              width: "clamp(180px, 28vw, 280px)",
              height: "auto",
              borderRadius: 16,
              opacity: 0.92,
            }}
          />
        </motion.div>

        {/* Copy */}
        <div style={{ flex: "1 1 340px", minWidth: 260 }}>
          <motion.h2
            {...reveal(0)}
            style={{
              fontFamily: F,
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            <span style={{ color: GOLD }}>Rasayanam</span>
            <span style={{ color: TAUPE, margin: "0 12px", fontWeight: 400 }}>|</span>
            <span style={{ color: GOLD }}>Balyam</span>
            <span style={{ color: TAUPE, margin: "0 12px", fontWeight: 400 }}>|</span>
            <span style={{ color: GOLD }}>Jeevnay</span>
          </motion.h2>

          <motion.p
            {...reveal(0.15)}
            style={{
              fontFamily: F,
              fontSize: "clamp(15px, 1.8vw, 18px)",
              lineHeight: 1.8,
              color: CREAM,
              opacity: 0.85,
              marginBottom: 16,
            }}
          >
            Energy to your body at the core
            <br />
            Strength that builds within
            <br />
            Longevity for the long run
          </motion.p>

          <motion.p
            {...reveal(0.25)}
            style={{
              fontFamily: F,
              fontSize: 14,
              color: TAUPE,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Harvested from mineral-rich rocks at elevations above 16,000 ft.
          </motion.p>

          <motion.div {...reveal(0.35)}>
            <Link
              href="/education/what-is-fulvic-acid"
              style={{
                display: "inline-block",
                fontFamily: F,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: GOLD,
                border: `1.5px solid ${GOLD}`,
                borderRadius: 8,
                padding: "12px 28px",
                textDecoration: "none",
                transition: "background 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = GOLD;
              }}
            >
              Learn the Secret →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PART 2 — Mona Agarwal (standalone, cream bg)
   NO product images, NO product names, NO benefit claims
   ══════════════════════════════════════════════════════════════════ */
function MonaSection() {
  const ref = useRef<HTMLElement>(null);
  const reveal = useReveal(ref);

  return (
    <section
      ref={ref}
      style={{
        background: CREAM,
        padding: "clamp(64px, 8vw, 120px) clamp(20px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        {/* Section label */}
        <motion.p
          {...reveal(0)}
          style={{
            fontFamily: F,
            fontSize: "clamp(11px, 1.2vw, 13px)",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 12,
          }}
        >
          Athlete Ambassador
        </motion.p>

        {/* Section title */}
        <motion.h2
          {...reveal(0.05)}
          style={{
            fontFamily: F,
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 700,
            lineHeight: 1.25,
            color: INK,
            marginBottom: "clamp(40px, 5vw, 64px)",
          }}
        >
          Built For People Who Demand More From Themselves
        </motion.h2>

        {/* ─── Avatar + identity ─── */}
        <motion.div {...reveal(0.1)}>
          {/* MA avatar */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GOLD}30, ${TAUPE}20)`,
              border: `2.5px solid ${GOLD}`,
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: F,
                fontSize: 34,
                fontWeight: 700,
                color: GOLD,
              }}
            >
              MA
            </span>
          </div>

          <h3
            style={{
              fontFamily: F,
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 700,
              color: INK,
              marginBottom: 8,
            }}
          >
            Mona Agarwal
          </h3>

          <p
            style={{
              fontFamily: F,
              fontSize: "clamp(13px, 1.4vw, 15px)",
              fontWeight: 500,
              color: GOLD,
              letterSpacing: "0.03em",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Paralympic Bronze Medalist · Founding Athlete Ambassador
          </p>
        </motion.div>

        {/* ─── Quote ─── */}
        <motion.blockquote
          {...reveal(0.2)}
          style={{
            fontFamily: F,
            fontSize: "clamp(15px, 1.8vw, 19px)",
            fontStyle: "italic",
            color: INK,
            opacity: 0.82,
            lineHeight: 1.75,
            maxWidth: 700,
            margin: "0 auto 48px",
            padding: "24px 0",
            borderTop: `1px solid ${GOLD}44`,
            borderBottom: `1px solid ${GOLD}44`,
          }}
        >
          &ldquo;Elite performance is rarely about motivation. It is built
          through consistency, recovery, discipline and showing up every day.
          These same principles form the foundation of Performance
          Ayurveda.&rdquo;
        </motion.blockquote>

        {/* ─── Performance Pillars ─── */}
        <motion.div
          {...reveal(0.3)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "clamp(16px, 2vw, 28px)",
            marginBottom: 48,
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.label}
              style={{
                background: `${INK}08`,
                border: `1px solid ${GOLD}22`,
                borderRadius: 14,
                padding: "clamp(20px, 2.5vw, 28px) 16px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: 12 }}>{p.icon}</div>
              <p
                style={{
                  fontFamily: F,
                  fontSize: 15,
                  fontWeight: 700,
                  color: INK,
                  marginBottom: 6,
                }}
              >
                {p.label}
              </p>
              <p
                style={{
                  fontFamily: F,
                  fontSize: 13,
                  color: TAUPE,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ─── Trust bar ─── */}
        <motion.div
          {...reveal(0.4)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px 24px",
            padding: "20px 0 0",
            borderTop: `1px solid ${GOLD}22`,
          }}
        >
          {TRUST_ITEMS.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: F,
                fontSize: "clamp(11px, 1.2vw, 13px)",
                color: INK,
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: GOLD, marginRight: 6 }}>✓</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — renders both sections in sequence
   ══════════════════════════════════════════════════════════════════ */
export default function ProductDisclaimerSplit() {
  return (
    <>
      <RockResinStory />
      <MonaSection />
    </>
  );
}
