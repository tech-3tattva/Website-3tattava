"use client";

/**
 * A branded loading spinner for 3TATTAVA.
 * Shows a pulsing lotus/herb icon with "3TATTAVA" text and a rotating ring.
 */
export default function AyurvedaLoader({ message = "Loading…" }: { message?: string }) {
  const F = "var(--font-primary), system-ui, sans-serif";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "40px 20px",
        minHeight: 200,
      }}
    >
      {/* Animated ring + icon */}
      <div style={{ position: "relative", width: 64, height: 64 }}>
        {/* Rotating ring */}
        <svg
          viewBox="0 0 64 64"
          width={64}
          height={64}
          style={{ position: "absolute", inset: 0, animation: "loader-ring 2s linear infinite" }}
        >
          <circle cx="32" cy="32" r="28" fill="none" stroke="#cd872a" strokeWidth="2" strokeDasharray="40 136" strokeLinecap="round" opacity="0.6" />
        </svg>
        {/* Pulsing center icon */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "loader-pulse 1.6s ease-in-out infinite",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/herb.svg" alt="" width={28} height={28} />
        </div>
      </div>
      {/* Message */}
      <p
        style={{
          fontFamily: F,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#b7a392",
          fontWeight: 600,
          animation: "loader-fade 1.6s ease-in-out infinite",
        }}
      >
        {message}
      </p>
      <style jsx>{`
        @keyframes loader-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loader-pulse { 0%, 100% { transform: scale(0.85); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes loader-fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
