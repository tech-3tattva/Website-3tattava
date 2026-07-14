"use client";

// Auto-playing poster slideshow. Preloads each poster and only shows the ones
// that actually load, so pages with no posters yet render nothing (no broken
// band, no layout shift). Newest-first: pass posters most-recent-first.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface PosterSlideshowProps {
  posters: { src: string; alt?: string }[];
  interval?: number; // ms between slides
  aspect?: string; // CSS aspect-ratio, e.g. "16 / 6"
}

export default function PosterSlideshow({ posters, interval = 5000, aspect = "16 / 6" }: PosterSlideshowProps) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Preload — only posters that resolve get shown.
  useEffect(() => {
    let alive = true;
    posters.forEach((p) => {
      const im = new window.Image();
      im.onload = () => {
        if (alive) setLoaded((g) => (g.includes(p.src) ? g : [...g, p.src]));
      };
      im.src = p.src;
    });
    return () => {
      alive = false;
    };
  }, [posters]);

  const valid = posters.filter((p) => loaded.includes(p.src));

  useEffect(() => {
    if (valid.length <= 1 || paused || reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % valid.length), interval);
    return () => clearInterval(t);
  }, [valid.length, paused, reduce, interval]);

  if (valid.length === 0) return null;
  const active = idx % valid.length;
  const cur = valid[active];

  return (
    <section
      aria-label="Latest posters"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: "relative", width: "100%", aspectRatio: aspect, maxHeight: "72vh", overflow: "hidden", background: "#1c1304" }}
    >
      <AnimatePresence>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={cur.src}
          src={cur.src}
          alt={cur.alt ?? "3TATTAVA poster"}
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: interval / 1000 + 1.2, ease: "linear" } }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AnimatePresence>
      {/* soft top/bottom scrim so the floating nav + any overlaid text stay legible */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(28,19,4,.28) 0%, transparent 34%, rgba(28,19,4,.34) 100%)", pointerEvents: "none" }} />
      {valid.length > 1 && (
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", gap: 8, justifyContent: "center", zIndex: 2 }}>
          {valid.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show poster ${i + 1}`}
              onClick={() => setIdx(i)}
              style={{
                width: active === i ? 22 : 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: active === i ? "#e4c079" : "rgba(247,240,226,.5)",
                transition: "all .3s ease",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
