import React, { useEffect, useRef, useState } from "react";

/**
 * PillarJourney — a fixed-right scroll companion that ties the page to the
 * Balance → Build → Become philosophy. Shows the active pillar as the user
 * scrolls. Auto-hides at the very top + footer. Mobile collapses to a slim
 * dot column.
 */
const PILLARS = [
  { key: "balance", label: "Balance", sub: "Samatva", accent: "#7AAA8A" },
  { key: "build", label: "Build", sub: "Bala", accent: "#CD872A" },
  { key: "become", label: "Become", sub: "Utkarsha", accent: "#C9A84C" },
];

export default function PillarJourney() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef();

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        setProgress(ratio);
        setVisible(window.scrollY > 380 && ratio < 0.94);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // 0-0.33 balance, 0.33-0.66 build, 0.66-1 become
  const activeIdx = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  return (
    <div
      aria-hidden="true"
      data-testid="pillar-journey"
      className={`hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* progress thread */}
      <div className="absolute right-[7px] top-0 bottom-0 w-[1.5px] bg-ink/10 rounded-full overflow-hidden">
        <div
          className="w-full bg-gradient-to-b from-[#7AAA8A] via-[#CD872A] to-[#C9A84C] transition-[height] duration-300"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {PILLARS.map((p, i) => {
        const active = i === activeIdx;
        return (
          <div key={p.key} className="relative flex items-center gap-3 group">
            <div
              className={`overflow-hidden transition-all duration-500 ${active ? "max-w-[200px] opacity-100 mr-2" : "max-w-0 opacity-0"}`}
            >
              <div className="text-right pr-1">
                <div className="font-display text-sm leading-tight" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", color: p.accent }}>{p.label}.</div>
                <div className="font-sanskrit text-[10px] text-ink/55 mt-0.5">{p.sub}</div>
              </div>
            </div>
            <div
              className={`relative w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 ${active ? "scale-[1.55] shadow-[0_0_0_6px_rgba(200,150,62,0.12)]" : "scale-100"}`}
              style={{
                borderColor: active ? p.accent : "rgba(28,19,4,0.22)",
                background: active ? p.accent : "transparent",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
