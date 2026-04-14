/** Minimal Pancha Mahabhuta marks for intro splash — inline SVG, no network. */

const stroke = "var(--splash-gold, #D4A574)";
const sw = 1.6;

export function EarthGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 32 L24 14 L40 32 Z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M14 32h20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

export function WaterGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M6 28c6-8 12-8 18 0s12 8 18 0"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M6 34c6-6 12-6 18 0s12 6 18 0"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        opacity={0.65}
      />
    </svg>
  );
}

export function FireGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 8c-4 8-12 12-8 22 2 6 6 8 8 10 2-2 6-4 8-10 4-10-4-14-8-22Z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AirGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M10 18h22M8 24h28M12 30h20"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EtherGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="14" stroke={stroke} strokeWidth={sw} opacity={0.5} />
      <circle cx="24" cy="24" r="6" stroke={stroke} strokeWidth={sw} />
      <circle cx="24" cy="24" r="2" fill="#D4A574" />
    </svg>
  );
}

export const MAHABHUTA_SEQUENCE = [
  { id: "earth", label: "Earth", Glyph: EarthGlyph },
  { id: "water", label: "Water", Glyph: WaterGlyph },
  { id: "fire", label: "Fire", Glyph: FireGlyph },
  { id: "air", label: "Air", Glyph: AirGlyph },
  { id: "ether", label: "Ether", Glyph: EtherGlyph },
] as const;
