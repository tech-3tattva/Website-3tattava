import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sunrise, Moon, Wind, Mountain, Activity, Zap, Compass, Infinity as InfinityIcon, Trophy } from "lucide-react";

const ACTS = [
  {
    key: "balance",
    chapter: "Act I",
    sanskrit: "समत्व",
    transliteration: "Samatva",
    title: "Balance.",
    directive: "Restore the foundations.",
    line: "Before strength comes stability. Before performance comes recovery.",
    accent: "#7AAA8A",
    bg: "radial-gradient(60% 60% at 35% 30%, rgba(122,170,138,0.18), transparent 70%)",
    icons: [
      { Icon: Sunrise, label: "Energy" },
      { Icon: Moon, label: "Sleep" },
      { Icon: Wind, label: "Calm" },
    ],
    // SVG path for Sanskrit "समत्व" — stylised geometric approximation (decorative)
    glyphPath: "M30 80 Q70 20 110 80 T190 80 M50 50 L90 50 M140 50 L180 50 M220 80 Q250 30 280 80 M310 50 L350 50",
  },
  {
    key: "build",
    chapter: "Act II",
    sanskrit: "बल",
    transliteration: "Bala",
    title: "Build.",
    directive: "Develop strength.",
    line: "Compounding rituals. Stacking days. The body that responds when called.",
    accent: "#CD872A",
    bg: "radial-gradient(60% 60% at 65% 40%, rgba(205,135,42,0.18), transparent 70%)",
    icons: [
      { Icon: Activity, label: "Stamina" },
      { Icon: Zap, label: "Focus" },
      { Icon: Compass, label: "Discipline" },
    ],
    glyphPath: "M80 90 L80 30 M80 30 Q140 30 140 60 Q140 90 80 90 M200 30 L260 30 L260 90 L200 90 Z M230 30 L230 90",
  },
  {
    key: "become",
    chapter: "Act III",
    sanskrit: "उत्कर्ष",
    transliteration: "Utkarsha",
    title: "Become.",
    directive: "Reach higher potential.",
    line: "A lifetime of becoming. Not a destination — a daily practice.",
    accent: "#C9A84C",
    bg: "radial-gradient(60% 60% at 50% 60%, rgba(201,168,76,0.22), transparent 70%)",
    icons: [
      { Icon: Mountain, label: "Peak" },
      { Icon: Trophy, label: "Mastery" },
      { Icon: InfinityIcon, label: "Longevity" },
    ],
    glyphPath: "M40 30 L100 30 M70 30 L70 90 M130 30 L160 90 L190 30 M230 30 L290 30 L260 30 L260 90 M320 30 L320 90 M320 60 L370 60 M320 90 L370 30",
  },
];

/**
 * ThreeActs — a tall, scroll-pinned narrative that lets the user
 * physically experience Balance → Build → Become.
 *
 * Implementation: the section is 3 × 100vh tall. As the user scrolls
 * past each third, the sticky stage swaps which act is "active" and
 * smoothly cross-fades.
 */
export default function ThreeActs() {
  const wrapRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProg, setScrollProg] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const passed = Math.min(total, Math.max(0, -rect.top));
      const ratio = total > 0 ? passed / total : 0;
      setScrollProg(ratio);
      setActiveIdx(ratio < 0.34 ? 0 : ratio < 0.67 ? 1 : 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      data-testid="three-acts"
      className="relative bg-3t-black text-cream"
      style={{ height: "300vh" }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen overflow-hidden grain">
        {/* Cross-fading hue backdrops */}
        {ACTS.map((a, i) => (
          <div
            key={a.key}
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700"
            style={{ background: a.bg, opacity: activeIdx === i ? 1 : 0 }}
          />
        ))}

        {/* Left progress rail */}
        <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-8 items-start">
          {ACTS.map((a, i) => (
            <button
              key={a.key}
              onClick={() => {
                const el = wrapRef.current;
                if (!el) return;
                const target = el.offsetTop + el.offsetHeight * ((i + 0.5) / 3) - window.innerHeight / 2;
                window.scrollTo({ top: target, behavior: "smooth" });
              }}
              className="group flex items-center gap-3 text-left"
              data-testid={`act-jump-${a.key}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                style={{
                  background: activeIdx === i ? a.accent : "rgba(232,224,208,0.25)",
                  boxShadow: activeIdx === i ? `0 0 0 5px ${a.accent}22` : "none",
                  transform: activeIdx === i ? "scale(1.5)" : "scale(1)",
                }}
              />
              <span
                className={`eyebrow text-[10px] transition-all duration-500 ${activeIdx === i ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-1"}`}
                style={{ color: activeIdx === i ? a.accent : "rgba(232,224,208,0.55)" }}
              >
                {a.chapter}
              </span>
            </button>
          ))}
        </div>

        {/* Stage content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center">
          {ACTS.map((a, i) => (
            <ActPanel key={a.key} act={a} isActive={activeIdx === i} idx={i} />
          ))}

          {/* Manifesto at end */}
          <div
            className={`absolute inset-x-6 md:inset-x-16 bottom-12 transition-all duration-700 ${activeIdx === 2 && scrollProg > 0.85 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <div className="max-w-3xl">
              <div className="font-italic-light text-base md:text-xl text-cream/75 mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
                "Performance is not a destination. It is a continuous process of becoming."
              </div>
              <Link to="/assessment" className="btn-primary inline-flex" data-testid="three-acts-cta">
                Find Your Starting Stage <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom scroll progress thread */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream/5 z-20">
          <div
            className="h-full transition-[width] duration-150"
            style={{
              width: `${scrollProg * 100}%`,
              background: `linear-gradient(90deg, #7AAA8A 0%, #CD872A 50%, #C9A84C 100%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ActPanel({ act, isActive, idx }) {
  return (
    <div
      aria-hidden={!isActive}
      className={`absolute inset-0 px-6 md:px-16 flex flex-col justify-center transition-all duration-[900ms] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      data-testid={`act-${act.key}`}
    >
      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <div className="max-w-2xl">
          <div className="eyebrow mb-5" style={{ color: act.accent }}>{act.chapter} · {act.transliteration}</div>
          <div className="font-sanskrit text-6xl md:text-8xl mb-6 leading-none" style={{ color: act.accent, textShadow: `0 0 50px ${act.accent}44` }}>
            {act.sanskrit}
          </div>
          <h2 className="font-display text-cream text-6xl sm:text-7xl md:text-9xl mb-5" style={{ fontVariationSettings: "'wdth' 78, 'wght' 800", lineHeight: 0.92, letterSpacing: "-0.025em" }}>
            {act.title}
          </h2>
          <div className="text-xl md:text-2xl mb-6" style={{ color: act.accent, fontVariationSettings: "'wdth' 88, 'wght' 500" }}>
            {act.directive}
          </div>
          <div className="font-italic-light text-base md:text-lg text-cream/70 max-w-md" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            {act.line}
          </div>
          {/* Icon trio replaces text bullets */}
          <div className="flex items-center gap-5 md:gap-7 mt-8">
            {act.icons.map(({ Icon, label }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 transition-all duration-700"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: isActive ? `${300 + i * 120}ms` : "0ms",
                }}
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center"
                  style={{ borderColor: `${act.accent}66`, background: `${act.accent}12` }}
                >
                  <Icon size={18} style={{ color: act.accent }} />
                </div>
                <span className="eyebrow text-[9.5px] text-cream/65">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Big decorative glyph + chapter index — anchor on the right */}
        <div className="hidden md:flex flex-col items-end gap-4 pr-2">
          <div className="font-display text-cream/5 text-[260px] leading-none -mr-6" style={{ fontVariationSettings: "'wdth' 75, 'wght' 800" }}>
            0{idx + 1}
          </div>
          <ChapterRing accent={act.accent} active={isActive} />
        </div>
      </div>
    </div>
  );
}

function ChapterRing({ accent, active }) {
  // A simple decorative ring that draws when its act is active
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" className="opacity-90">
      <circle
        cx="60" cy="60" r="48"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="302"
        strokeDashoffset={active ? 0 : 302}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <circle cx="60" cy="60" r="3" fill={accent} />
    </svg>
  );
}
