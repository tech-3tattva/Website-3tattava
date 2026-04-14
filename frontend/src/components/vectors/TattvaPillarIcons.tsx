/** Abstract marks for Balance · Build · Become — Three Tattvas section */

const c = "currentColor";

export function BalanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M8 28h24M20 10v18"
        stroke={c}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx="14" cy="28" r="3" stroke={c} strokeWidth={1.5} />
      <circle cx="26" cy="28" r="3" stroke={c} strokeWidth={1.5} />
    </svg>
  );
}

export function BuildIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 8 L28 22 H12 Z"
        stroke={c}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M14 26h12M14 30h12" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

export function BecomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="18" r="8" stroke={c} strokeWidth={1.5} />
      <path
        d="M12 32c2-4 5-6 8-6s6 2 8 6"
        stroke={c}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CardCornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 40 Q8 8 40 8"
        stroke="currentColor"
        strokeWidth={0.75}
        opacity={0.2}
      />
      <path
        d="M112 80 Q112 112 80 112"
        stroke="currentColor"
        strokeWidth={0.75}
        opacity={0.2}
      />
    </svg>
  );
}
