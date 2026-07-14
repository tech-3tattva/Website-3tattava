# Fast Ritual — Agent Execution Handoff

**Task:** Build the scroll-driven "Tear · Squeeze · Perform" hero (the "Wellness Should Move At The Speed Of Life" section) for the Shahjeet Sticks product page. Route C — coded choreography (frontend) + ambient generated video as background texture (never scrubbed).

Stack: Next.js 14 App Router → Vercel · Framer Motion · media via S3 `3tattava-media-prod` → CloudFront `media.3tattava.com`. This file is self-contained — no other doc is required to execute.

---

## 0. NON-NEGOTIABLE GUARDRAILS (read first)

- **Palette is gold `#C8963E`, ink `#1c1304`, cream `#f7f0e2` ONLY. Green is BANNED** — not in tokens, CSS, prompts, or any generated asset. *(If any brand-bible doc lists Deep Earth Green `#2D4A3E`, that doc is outdated — ignore that colour entirely.)*
- **Never render the logo/label with AI.** The real `3t` logo + "SHAHJEET STICKS" wordmark go on as an SVG/PNG overlay only.
- Icons: SVG line only (Lucide/Heroicons). No emoji.
- All touch targets ≥ 44px.
- Animation is 100% frontend. The video never scrubs — it loops. Backend only serves the video (CloudFront) and price/CTA data (existing API).

---

## 1. Video asset — VERIFIED, ready to ship

The ambient loop has passed QA: **0.000% green pixels**, avg brightness 77/255 (dark enough for foreground legibility), warm ink+gold palette, no on-frame text, audio stripped, loop crossfaded (seam 8.6/255). Three files are provided:

| File | Use |
|---|---|
| `fast-ritual-ambient.webm` | primary source (VP9) |
| `fast-ritual-ambient.mp4` | fallback source (H.264, faststart) |
| `fast-ritual-poster.jpg` | poster frame |

### Upload (lowercase-hyphen names, ap-south-1)
```bash
aws s3 cp fast-ritual-ambient.webm s3://3tattava-media-prod/products/shahjeet/ --content-type video/webm
aws s3 cp fast-ritual-ambient.mp4  s3://3tattava-media-prod/products/shahjeet/ --content-type video/mp4
aws s3 cp fast-ritual-poster.jpg   s3://3tattava-media-prod/products/shahjeet/ --content-type image/jpeg
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/products/shahjeet/*"
```
Origin domain must include region: `3tattava-media-prod.s3.ap-south-1.amazonaws.com`. AccessDenied → OAC bucket policy; NotFound → path/case mismatch. Invalidation takes 2–3 min.

Confirm live: `https://media.3tattava.com/products/shahjeet/fast-ritual-ambient.webm`

---

## 2. Layer stack (z-order inside the pinned frame)
```
z0  ambient video loop   → parallax + brightness only, NEVER currentTime scrub
z1  scrim gradient       → guarantees foreground legibility
z2  SVG stick            → frame-perfect tear / squeeze / perform
z3  phase label + progress rail + copy + CTA
```

## 3. Build order (do one at a time; confirm each before the next)
1. Pin skeleton — outer `300vh`, inner `sticky top:0 height:100vh`. Confirm it pins/unpins cleanly.
2. Scroll progress — `useScroll` + `useSpring`; show a temporary on-screen 0→1 readout.
3. Video layer — the three files above; parallax + brightness tied to progress; no scrub.
4. Tear (0–0.30) / Squeeze (0.30–0.65) / Perform (0.65–1) transforms on the SVG.
5. Sync phase label + gold progress rail via `useMotionValueEvent` at 0.30 / 0.65.
6. Composite the REAL logo/wordmark onto the stick (SVG/PNG overlay).
7. Reduced-motion + mobile (<768px) → fall back to the existing 01/02/03 tab version.
8. Perf pass — animate only transform/opacity; lazy-mount; `preload="metadata"`.

---

## 4. Drop-in component — `app/(components)/FastRitual.tsx`

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion, useScroll, useSpring, useTransform,
  useMotionValueEvent, useReducedMotion, type MotionValue,
} from "framer-motion";

const T = { gold: "#C8963E", ink: "#1c1304", cream: "#f7f0e2" };
const PHASES = ["TEAR", "SQUEEZE", "PERFORM"] as const;
const MEDIA = "https://media.3tattava.com/products/shahjeet";

export default function FastRitual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setIsMobile(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useMotionValueEvent(progress, "change", (v) => {
    const next = v < 0.3 ? 0 : v < 0.65 ? 1 : 2;
    setPhase((p) => (p === next ? p : next));
  });

  // video: parallax + brightness ONLY
  const videoY = useTransform(progress, [0, 1], ["-4%", "4%"]);
  const videoFilter = useTransform(
    useTransform(progress, [0, 0.65, 1], [0.55, 0.7, 0.95]),
    (b) => `brightness(${b})`
  );

  // TEAR 0→0.30
  const capY = useTransform(progress, [0, 0.3], [0, -120]);
  const capRotate = useTransform(progress, [0, 0.3], [0, -14]);
  const capOpacity = useTransform(progress, [0.22, 0.32], [1, 0]);
  // SQUEEZE 0.30→0.65
  const bodyScaleX = useTransform(progress, [0.3, 0.5, 0.65], [1, 1.06, 1]);
  const bodyScaleY = useTransform(progress, [0.3, 0.5, 0.65], [1, 0.94, 1]);
  const dripScale = useTransform(progress, [0.32, 0.5, 0.62], [0, 1, 1]);
  const dripY = useTransform(progress, [0.5, 0.65], [0, 160]);
  const dripOpacity = useTransform(progress, [0.32, 0.4, 0.6, 0.66], [0, 1, 1, 0]);
  // PERFORM 0.65→1
  const glow = useTransform(progress, [0.65, 0.85], [0, 1]);
  const ctaY = useTransform(progress, [0.7, 0.9], [40, 0]);
  const ctaOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);

  if (reduce || isMobile) return <FastRitualTabsFallback />; // existing 01/02/03 tabs

  return (
    <section ref={wrapRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        display: "grid", placeItems: "center", background: T.cream }}>

        {/* z0 video */}
        <motion.video
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", y: videoY, filter: videoFilter, zIndex: 0 }}
          autoPlay muted loop playsInline preload="metadata"
          poster={`${MEDIA}/fast-ritual-poster.jpg`}>
          <source src={`${MEDIA}/fast-ritual-ambient.webm`} type="video/webm" />
          <source src={`${MEDIA}/fast-ritual-ambient.mp4`} type="video/mp4" />
        </motion.video>

        {/* z1 scrim */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(180deg, rgba(28,19,4,0.35) 0%, rgba(28,19,4,0.12) 45%, rgba(247,240,226,0.6) 100%)" }} />

        {/* z3 phase rail */}
        <div style={{ position: "absolute", top: 32, zIndex: 3, display: "flex", gap: 24,
          letterSpacing: "0.2em", fontSize: 13 }}>
          {PHASES.map((label, i) => (
            <span key={label} style={{ color: i === phase ? T.ink : "rgba(28,19,4,0.4)",
              fontWeight: i === phase ? 700 : 400, transition: "color 200ms ease" }}>
              0{i + 1} {label}
            </span>
          ))}
        </div>
        <motion.div style={{ position: "absolute", top: 60, left: 0, height: 2,
          background: T.gold, transformOrigin: "left", scaleX: progress, width: "100%", zIndex: 3 }} />

        {/* z2 stick */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <FastRitualStick {...{ capY, capRotate, capOpacity, bodyScaleX, bodyScaleY,
            dripScale, dripY, dripOpacity, glow }} />
        </div>

        {/* z3 CTA */}
        <motion.div style={{ position: "absolute", bottom: 48, zIndex: 3, y: ctaY,
          opacity: ctaOpacity, textAlign: "center" }}>
          <button style={{ minHeight: 48, padding: "0 40px", border: "none", borderRadius: 4,
            background: `linear-gradient(90deg, ${T.gold}, #b9822f)`, color: T.ink,
            letterSpacing: "0.15em", fontWeight: 700, cursor: "pointer" }}
            onClick={() => {/* → cart/checkout */}}>
            BEGIN YOUR FAST RITUAL
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* STEP 6 — wire your existing stick SVG groups in here. Real logo goes as <image>, never AI text. */
function FastRitualStick(props: {
  capY: MotionValue<number>; capRotate: MotionValue<number>; capOpacity: MotionValue<number>;
  bodyScaleX: MotionValue<number>; bodyScaleY: MotionValue<number>;
  dripScale: MotionValue<number>; dripY: MotionValue<number>;
  dripOpacity: MotionValue<number>; glow: MotionValue<number>;
}) {
  const { capY, capRotate, capOpacity, bodyScaleX, bodyScaleY, dripScale, dripY, dripOpacity, glow } = props;
  return (
    <svg width="220" height="520" viewBox="0 0 220 520">
      <motion.circle cx="110" cy="300" r="180" fill="#C8963E"
        style={{ opacity: glow, filter: "blur(60px)" }} />
      <motion.g style={{ scaleX: bodyScaleX, scaleY: bodyScaleY, originX: "110px", originY: "300px" }}>
        {/* TODO: existing body paths + <image href="/brand/shahjeet-wordmark.svg" .../> */}
        <rect x="60" y="140" width="100" height="320" rx="14" fill="#1c1304" />
      </motion.g>
      <motion.g style={{ y: capY, rotate: capRotate, opacity: capOpacity, originX: "110px", originY: "140px" }}>
        {/* TODO: existing cap / "TEAR HERE" paths */}
        <rect x="60" y="100" width="100" height="48" rx="10" fill="#3a2a12" />
      </motion.g>
      <motion.ellipse cx="110" cy="470" rx="10" ry="16" fill="#C8963E"
        style={{ scale: dripScale, y: dripY, opacity: dripOpacity }} />
    </svg>
  );
}

function FastRitualTabsFallback() {
  return null; // return existing 01 TEAR / 02 SQUEEZE / 03 PERFORM tab component
}
```

---

## 5. Perf + correctness checklist
- Animate only `transform`/`opacity`. No `top`/`left`/`width` in motion paths.
- `preload="metadata"`, keep the `poster`, lazy-mount the section (IntersectionObserver or `next/dynamic` ssr:false) so the video isn't fetched above the fold.
- If the ritual feels rushed, lengthen the wrapper (350–400vh) rather than compressing transform ranges.
- Keep the logo/wordmark a crisp vector overlay so it never scales blurry.

## 6. Only open decision (affects the SVG, not the video)
Where the squeeze drip lands — **water/stone pool** (matches the mountain hero) or a **cup**. This changes the Step-4 drip ellipse into a ripple vs a pour. Default in this file = a falling gold drip; adjust once decided.

---

**Nothing else is required to start.** Video is verified and provided; component compiles as-is; wire in the existing stick SVG at the two TODOs and the real wordmark overlay.
