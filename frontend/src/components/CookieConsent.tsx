"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "3t_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage unavailable — stay hidden */
    }
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  // The admin portal is a private tool, not public marketing surface — the
  // banner there just covers the dashboard data.
  if (!visible || pathname?.startsWith("/admin")) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: "#2a1a08",
        color: "#f7f0e2",
        borderTop: "1px solid rgba(200,150,62,.4)",
        padding: "16px clamp(16px,4vw,32px) calc(16px + env(safe-area-inset-bottom))",
        fontFamily: "var(--font-primary), system-ui, sans-serif",
        boxShadow: "0 -8px 24px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, flex: "1 1 320px", color: "rgba(247,240,226,.85)" }}>
          We use cookies to run this site, remember your cart and improve your experience. You can
          accept all cookies or continue with only those necessary for the site to work. See our{" "}
          <Link href="/cookies" style={{ color: "#E4C079", textDecoration: "underline" }}>
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" style={{ color: "#E4C079", textDecoration: "underline" }}>
            Privacy Policy
          </Link>
          .
        </p>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => decide("declined")}
            style={{
              padding: "10px 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              background: "transparent",
              color: "#f7f0e2",
              border: "1px solid rgba(247,240,226,.4)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            style={{
              padding: "10px 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
              color: "#2a1a08",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
