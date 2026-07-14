"use client";
import { media } from "@/lib/media";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Tokens ─────────────────────────────────────────────────────────────────
const GOLD = "#cd872a";
const GOLD_DARK = "#a67b2f";
const CREAM = "#f7f0e2";
const INK = "#442a1b";
const ESPRESSO = "#5b3c23";
const TAUPE = "#8a7355";
const F = "var(--font-primary), system-ui, sans-serif";

interface TextReview {
  quote: string;
  name: string;
  role: string;
  city: string;
}
interface VideoReview {
  src: string;
  name: string;
  tag: string;
}

const TEXT_REVIEWS: TextReview[] = [
  { quote: "I wasn't looking for another supplement — I was looking for consistency. This became the one ritual I actually kept, and my energy through the afternoon is noticeably steadier.", name: "Rahul M.", role: "Entrepreneur", city: "Delhi" },
  { quote: "As a fitness coach I recommend 3Tattava to all my clients. The purity and potency are unmatched, and the batch lab reports sealed the deal for me.", name: "Priya S.", role: "Fitness Coach", city: "Mumbai" },
  { quote: "I was sceptical about Ayurvedic supplements until I tried the daily ritual. The difference in my recovery time was noticeable within the first week.", name: "Arjun K.", role: "Software Engineer", city: "Bangalore" },
  { quote: "The morning ritual fits perfectly into a busy schedule — no measuring, no mixing, no mess. It just works, every single day.", name: "Sneha P.", role: "Corporate Professional", city: "Pune" },
  { quote: "We keep 3Tattava at our gym and members ask about it daily. The quality genuinely speaks for itself.", name: "Vikram T.", role: "Gym Owner", city: "Noida" },
];

const VIDEO_REVIEWS: VideoReview[] = [
  { src: media("/videos/morning-ritual.mp4"), name: "Aditi R.", tag: "6 weeks into the morning ritual" },
  { src: media("/home/dip-video.mp4"), name: "Karan V.", tag: "The Dip · Hook · Swirl routine" },
  { src: media("/videos/shahjeet-reveal.mp4"), name: "Meera S.", tag: "Performance, on the go" },
];

const REV_CSS = `
.rev-card{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,4vw,64px);align-items:center;background:linear-gradient(135deg,#ffffff 0%,#fbf5ea 100%);border:1px solid rgba(68,42,27,.1);border-radius:28px;padding:clamp(28px,4vw,56px);box-shadow:0 24px 64px rgba(68,42,27,.09);}
.rev-quotewrap{position:relative;min-height:220px;}
.rev-vframe{position:relative;aspect-ratio:4 / 5;width:100%;max-width:400px;margin:0 auto;border-radius:22px;overflow:hidden;background:#e9dec7;box-shadow:0 20px 48px rgba(68,42,27,.22);}
.rev-vframe video{width:100%;height:100%;object-fit:cover;display:block;}
@media(max-width:820px){.rev-card{grid-template-columns:1fr;gap:32px;}.rev-quotewrap{min-height:260px;}}
@media(prefers-reduced-motion:reduce){.rev-card *{animation:none!important;transition:none!important;}}
`;

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" style={{ color: GOLD, fontSize: 18, letterSpacing: 3, display: "block", marginBottom: 14 }}>
      ★★★★★
    </span>
  );
}

export default function ReviewsSection({
  eyebrow = "Real Reviews",
  title = "Real people. Real rituals.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const [ti, setTi] = useState(0);
  const [vi, setVi] = useState(0);
  const [paused, setPaused] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  // Auto-rotate the text reviews (inside the card only).
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTi((i) => (i + 1) % TEXT_REVIEWS.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  // Load + play the selected video frame.
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [vi]);

  const r = TEXT_REVIEWS[ti];
  const vr = VIDEO_REVIEWS[vi];
  const nav = (d: number) => setVi((i) => (i + d + VIDEO_REVIEWS.length) % VIDEO_REVIEWS.length);

  const navBtn: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6, height: 42, padding: "0 16px",
    borderRadius: 999, border: `1.5px solid ${GOLD}`, background: "transparent", color: GOLD_DARK,
    fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, letterSpacing: ".04em",
    textTransform: "uppercase", cursor: "pointer",
  };

  return (
    <section style={{ background: CREAM, padding: "clamp(24px,4vw,44px) 16px clamp(52px,7vw,88px)" }}>
      <style dangerouslySetInnerHTML={{ __html: REV_CSS }} />
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="rev-card">
          {/* LEFT — animated text reviews */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", letterSpacing: ".2em", textTransform: "uppercase", fontSize: 12, color: GOLD_DARK, margin: "0 0 12px" }}>{eyebrow}</p>
            <h2 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ESPRESSO, margin: "0 0 clamp(20px,3vw,28px)", lineHeight: 1.1 }}>{title}</h2>
            <div className="rev-quotewrap">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={ti}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ margin: 0 }}
                >
                  <Stars />
                  <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: "clamp(16px,1.7vw,19px)", lineHeight: 1.6, color: INK, margin: "0 0 18px" }}>
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <footer style={{ fontFamily: F, fontSize: 14, color: TAUPE }}>
                    <span style={{ fontVariationSettings: "'wght' 700", color: ESPRESSO }}>{r.name}</span> · {r.role}, {r.city}
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
              {TEXT_REVIEWS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show review ${i + 1}`}
                  onClick={() => setTi(i)}
                  style={{ width: i === ti ? 26 : 9, height: 9, borderRadius: 999, border: "none", background: i === ti ? GOLD : "rgba(68,42,27,.2)", cursor: "pointer", transition: "all .3s ease", padding: 0 }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — video reviews with next frame */}
          <div>
            <div className="rev-vframe">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video ref={vidRef} src={vr.src} muted loop playsInline autoPlay preload="metadata" />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 18px 14px", background: "linear-gradient(180deg,transparent,rgba(43,26,15,.82))", color: CREAM }}>
                <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 15, margin: 0 }}>{vr.name}</p>
                <p style={{ fontFamily: F, fontSize: 12.5, color: "rgba(247,240,226,.82)", margin: "2px 0 0" }}>{vr.tag}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
              <button type="button" aria-label="Previous video review" onClick={() => nav(-1)} style={{ ...navBtn, padding: "0 14px" }}>
                <ChevronLeft size={17} strokeWidth={2.2} />
              </button>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, color: TAUPE, minWidth: 44, textAlign: "center" }}>
                {vi + 1} / {VIDEO_REVIEWS.length}
              </span>
              <button type="button" onClick={() => nav(1)} style={navBtn}>
                Next Video <ChevronRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
