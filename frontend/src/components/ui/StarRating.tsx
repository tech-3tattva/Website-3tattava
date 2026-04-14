"use client";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export default function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const s = size === "sm" ? 14 : 18;
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-gold" style={{ fontSize: s }}>
          ★
        </span>
      ))}
      {half > 0 && (
        <span className="text-gold" style={{ fontSize: s }}>
          ★
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-border" style={{ fontSize: s }}>
          ★
        </span>
      ))}
      {showValue && (
        <span className="ml-1 text-text-light text-sm">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
