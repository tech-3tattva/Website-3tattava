import React from "react";

/**
 * BalanceBuildBecome — animated SVG glyph trio used as a vector replacement
 * for text-heavy "What we do" cards. Three minimalist marks connected by a
 * flowing gold line — circle (balance), upward chevron (build), starburst
 * (become).
 */
export default function BalanceBuildBecomeGlyph({ active = 0, size = 220 }) {
  return (
    <svg viewBox="0 0 360 120" width={size} height={(size / 360) * 120} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="select-none">
      <defs>
        <linearGradient id="bbgGold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7AAA8A" />
          <stop offset="50%" stopColor="#CD872A" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>

      {/* Connecting thread */}
      <path d="M 50 60 Q 130 30 180 60 T 310 60" stroke="url(#bbgGold)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="240" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" from="240" to="0" dur="2.4s" begin="0s" fill="freeze" />
      </path>

      {/* Balance — circle */}
      <g transform="translate(50 60)" opacity={active >= 0 ? 1 : 0.35} style={{ transition: "opacity .5s" }}>
        <circle r="18" fill="none" stroke="#7AAA8A" strokeWidth={active === 0 ? 2.5 : 1.5} />
        <circle r="3" fill="#7AAA8A" />
      </g>

      {/* Build — upward chevron */}
      <g transform="translate(180 60)" opacity={active >= 1 ? 1 : 0.35} style={{ transition: "opacity .5s" }}>
        <path d="M -16 8 L 0 -10 L 16 8" stroke="#CD872A" strokeWidth={active === 1 ? 2.5 : 1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M -10 16 L 0 4 L 10 16" stroke="#CD872A" strokeWidth={active === 1 ? 2.5 : 1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      </g>

      {/* Become — starburst */}
      <g transform="translate(310 60)" opacity={active >= 2 ? 1 : 0.35} style={{ transition: "opacity .5s" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line key={deg} x1="0" y1="0" x2={Math.cos((deg * Math.PI) / 180) * 18} y2={Math.sin((deg * Math.PI) / 180) * 18} stroke="#C9A84C" strokeWidth={active === 2 ? 2.5 : 1.5} strokeLinecap="round" />
        ))}
        <circle r="3" fill="#C9A84C" />
      </g>
    </svg>
  );
}
