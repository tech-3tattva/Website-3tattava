"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import RevealHeading from "@/components/ui/RevealHeading";

const F = "var(--font-primary), system-ui, sans-serif";

/* ─── Colors ─── */
const INK = "#442a1b";
const GOLD = "#cd872a";

/* Community testimonial reels (portrait 9/16). Hover to preview (muted); click to open with sound. */
const TESTIMONIAL_VIDEOS = [
  "https://media.3tattava.com/videos/Client+Testimonials+1.mp4",
  "https://media.3tattava.com/videos/Review%20Video.mp4",
];

/* One reel — shows its first frame (never blank), plays muted on hover, has a pause toggle,
   and opens full-size (with sound) when clicked. */
function TestimonialReel({ src, onExpand }: { src: string; onExpand: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Force the first frame to render so the tile is never a blank dark box.
  const showFirstFrame = useCallback(() => {
    const v = ref.current;
    if (v && v.paused && v.currentTime < 0.05) {
      try { v.currentTime = 0.1; } catch {}
    }
  }, []);

  const play = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  }, []);

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={pause}
      onClick={onExpand}
      role="button"
      tabIndex={0}
      aria-label="Open testimonial in full view"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onExpand(); } }}
      style={{
        position: "relative",
        background: INK,
        borderRadius: 16,
        aspectRatio: "9/16",
        overflow: "hidden",
        boxShadow: "0 22px 60px rgba(68,42,27,0.22)",
        cursor: "pointer",
      }}
    >
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={showFirstFrame}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "inherit" }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Pause control — shown only while playing; no play button (hover starts it) */}
      {playing && (
        <button
          type="button"
          aria-label="Pause"
          onClick={(e) => { e.stopPropagation(); pause(); }}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(28,19,4,.6)",
            color: "#f7f0e2",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ❚❚
        </button>
      )}

      {/* Expand affordance */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          padding: "5px 10px",
          borderRadius: 999,
          background: "rgba(28,19,4,.55)",
          color: "#f7f0e2",
          fontFamily: F,
          fontSize: 10,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        ⤢ Expand
      </span>
    </div>
  );
}

export default function TestimonialVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll + wire Escape while the lightbox is open.
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [expanded]);

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
          style={{ fontFamily: F, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 12 }}
        >
          From Our Community
        </motion.p>

        {/* Heading */}
        <RevealHeading
          as="h2"
          by="word"
          style={{ fontFamily: F, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: INK, lineHeight: 1.15, marginBottom: 16 }}
          lines={["Real Results, Real Stories"]}
        />

        {/* Subheading */}
        <motion.p
          {...reveal(0.15)}
          style={{ fontFamily: F, fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.7, color: INK, opacity: 0.82, maxWidth: 520, margin: "0 auto clamp(32px, 4vw, 48px)" }}
        >
          Hear it straight from the people who made 3Tattava part of their daily ritual.
        </motion.p>

        {/* ─── Video reels (hover to preview · click to expand) ─── */}
        <motion.div
          {...reveal(0.25)}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "clamp(16px, 2.5vw, 28px)", maxWidth: 620, margin: "0 auto" }}
        >
          {TESTIMONIAL_VIDEOS.map((src) => (
            <TestimonialReel key={src} src={src} onExpand={() => setExpanded(src)} />
          ))}
        </motion.div>
      </div>

      {/* ─── Full-view lightbox (with sound) ─── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpanded(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(20,13,4,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,48px)" }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setExpanded(null)}
              style={{ position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(247,240,226,.6)", background: "rgba(28,19,4,.5)", color: "#f7f0e2", fontSize: 24, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
            >
              ×
            </button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              key={expanded}
              src={expanded}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "90vh", maxWidth: "min(100%, 460px)", aspectRatio: "9/16", borderRadius: 14, boxShadow: "0 30px 80px rgba(0,0,0,.55)", background: "#000" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
