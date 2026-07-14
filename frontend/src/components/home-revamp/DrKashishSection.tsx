"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import RevealHeading from "@/components/ui/RevealHeading";

const F = "var(--font-primary), system-ui, sans-serif";

/* ─── Colors ─── */
const INK = "#442a1b";
const GOLD = "#cd872a";
const CREAM = "#f7f0e2";
const TAUPE = "#b7a392";

/* ─── Credential chips ─── */
interface Credential {
  label: string;
}

const credentials: Credential[] = [
  { label: "BAMS" },
  { label: "CBPACS, New Delhi" },
  { label: "Ex-Consultant, NCISM — Ministry of AYUSH" },
];

export default function DrKashishSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const reveal = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  return (
    <section
      ref={sectionRef}
      style={{
        background: CREAM,
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(32px, 4vw, 64px)",
          alignItems: "center",
        }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ flex: "1 1 480px", minWidth: 280 }}>
          {/* Eyebrow */}
          <motion.p
            {...reveal(0)}
            style={{
              fontFamily: F,
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            The Doctor Behind the Brand
          </motion.p>

          {/* Heading */}
          <RevealHeading
            as="h2"
            by="word"
            style={{
              fontFamily: F,
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.15,
              marginBottom: 20,
            }}
            lines={["Dr. Kashish Gupta"]}
          />

          {/* Credential pills */}
          <motion.div
            {...reveal(0.2)}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 28,
            }}
          >
            {credentials.map((cred, i) => (
              <span
                key={i}
                style={{
                  fontFamily: F,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  color: GOLD,
                  border: `1.5px solid ${GOLD}`,
                  borderRadius: 24,
                  padding: "6px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                {cred.label}
              </span>
            ))}
          </motion.div>

          {/* Paragraph */}
          <motion.p
            {...reveal(0.3)}
            style={{
              fontFamily: F,
              fontSize: "clamp(15px, 1.8vw, 17px)",
              lineHeight: 1.8,
              color: INK,
              opacity: 0.85,
              marginBottom: 28,
              maxWidth: 560,
            }}
          >
            An Ayurveda physician who stopped seeing patients one at a time — to
            build formulations that reach a generation. 3Tattava is his answer to
            modern exhaustion: classical preparation, verified quality, zero
            shortcuts.
          </motion.p>

          {/* Pull quote */}
          <motion.blockquote
            {...reveal(0.4)}
            style={{
              fontFamily: F,
              fontSize: "clamp(16px, 2vw, 19px)",
              fontStyle: "italic",
              lineHeight: 1.7,
              color: INK,
              margin: "0 0 32px",
              padding: "12px 0 12px 24px",
              borderLeft: `3px solid ${GOLD}`,
            }}
          >
            &ldquo;I don&rsquo;t ask you to believe in Ayurveda. I ask you to
            verify it.&rdquo;
          </motion.blockquote>

          {/* CTA */}
          <motion.div {...reveal(0.5)}>
            <Link
              href="/about"
              style={{
                display: "inline-block",
                fontFamily: F,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#ffffff",
                background: GOLD,
                borderRadius: 8,
                padding: "12px 28px",
                textDecoration: "none",
                transition: "opacity 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Read His Story →
            </Link>
          </motion.div>
        </div>

        {/* ─── RIGHT COLUMN — Video placeholder ─── */}
        <motion.div
          {...reveal(0.25)}
          style={{
            flex: "1 1 400px",
            maxWidth: 520,
            minWidth: 280,
          }}
        >
          <div
            style={{
              position: "relative",
              background: INK,
              borderRadius: 16,
              aspectRatio: "16/9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Gold play icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `2px solid ${GOLD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {/* Play triangle */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: `20px solid ${GOLD}`,
                  marginLeft: 4,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: F,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: TAUPE,
                margin: 0,
              }}
            >
              Video Coming Soon
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
