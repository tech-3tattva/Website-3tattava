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
   DEFAULT EXPORT — RockResin story
   ══════════════════════════════════════════════════════════════════ */
export default function ProductDisclaimerSplit() {
  return (
    <>
      <RockResinStory />
    </>
  );
}
