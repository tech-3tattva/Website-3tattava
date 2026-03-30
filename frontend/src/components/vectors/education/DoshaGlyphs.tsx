const stroke = "#5c4033";

export function VataGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M10 32 Q24 8 38 32 M14 36 Q24 18 34 36"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}

export function PittaGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 10c-6 10-10 18-8 26 1 5 4 8 8 10 4-2 7-5 8-10 2-8-2-16-8-26Z"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KaphaGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <ellipse cx="24" cy="26" rx="14" ry="10" stroke={stroke} strokeWidth={1.5} />
      <path
        d="M16 18 Q24 10 32 18"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EducationSectionDivider({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 24"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M0 12 H400"
        stroke="#D4A574"
        strokeWidth={0.75}
        opacity={0.45}
      />
      <circle cx="200" cy="12" r="3" fill="#D4A574" opacity={0.5} />
    </svg>
  );
}
