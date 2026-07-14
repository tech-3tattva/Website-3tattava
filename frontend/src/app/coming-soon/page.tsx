import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming Soon | 3TATTAVA",
  description: "This part of 3TATTAVA is launching soon.",
  robots: { index: false, follow: false },
};

const F = "var(--font-primary), system-ui, sans-serif";

export default function ComingSoonPage() {
  return (
    <main
      style={{
        minHeight: "80vh",
        background: "#f7f0e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <p
          style={{
            fontFamily: F,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#cd872a",
            margin: "0 0 18px",
          }}
        >
          3TATTAVA
        </p>
        <h1
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 800",
            fontSize: "clamp(34px, 6vw, 60px)",
            lineHeight: 1.05,
            color: "#442a1b",
            margin: "0 0 18px",
          }}
        >
          Launching soon.
        </h1>
        <p
          style={{
            fontFamily: F,
            fontSize: "clamp(15px, 1.9vw, 18px)",
            lineHeight: 1.7,
            color: "rgba(68,42,27,0.72)",
            margin: "0 0 32px",
          }}
        >
          This part of the 3TATTAVA experience is on its way. In the meantime,
          explore our rituals and doctor-led Shilajit.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontFamily: F,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#442a1b",
              background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
              border: "none",
              padding: "13px 30px",
              borderRadius: 50,
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            style={{
              fontFamily: F,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#cd872a",
              border: "1.5px solid #cd872a",
              padding: "13px 30px",
              borderRadius: 50,
              textDecoration: "none",
            }}
          >
            Shop Rituals
          </Link>
        </div>
      </div>
    </main>
  );
}
