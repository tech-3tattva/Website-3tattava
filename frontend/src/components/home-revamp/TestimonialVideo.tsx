"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import RevealHeading from "@/components/ui/RevealHeading";

const F = "var(--font-primary), system-ui, sans-serif";

/* ─── Colors ─── */
const INK = "#442a1b";
const GOLD = "#cd872a";

/* Community testimonial reel (portrait 9/16). Native controls provide sound on play. */
const REVIEW_VIDEO_URL = "https://media.3tattava.com/videos/Review%20Video.mp4";

export default function TestimonialVideo() {
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
        background: "linear-gradient(180deg, #fbf5e9 0%, #f7f0e2 100%)",
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
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
          From Our Community
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
            marginBottom: 16,
          }}
          lines={["Real Results, Real Stories"]}
        />

        {/* Subheading */}
        <motion.p
          {...reveal(0.15)}
          style={{
            fontFamily: F,
            fontSize: "clamp(15px, 1.8vw, 18px)",
            lineHeight: 1.7,
            color: INK,
            opacity: 0.82,
            maxWidth: 520,
            margin: "0 auto clamp(32px, 4vw, 48px)",
          }}
        >
          Hear it straight from the people who made Three Tatva part of their daily ritual.
        </motion.p>

        {/* ─── Video frame (portrait reel) ─── */}
        <motion.div
          {...reveal(0.25)}
          style={{
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              background: INK,
              borderRadius: 16,
              aspectRatio: "9/16",
              overflow: "hidden",
              boxShadow: "0 22px 60px rgba(68,42,27,0.22)",
            }}
          >
            <video
              controls
              playsInline
              preload="metadata"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "inherit",
              }}
            >
              <source src={REVIEW_VIDEO_URL} type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
