"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import Logo from "@/components/layout/Logo";

const F = "var(--font-primary), system-ui, sans-serif";

const glassPanel: React.CSSProperties = {
  background: "linear-gradient(155deg, rgba(255,253,248,0.92), rgba(247,240,226,0.88))",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 24,
  boxShadow: "0 24px 64px rgba(28,19,4,0.20), inset 0 1px 0 rgba(255,255,255,0.75)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: F,
  fontSize: 15,
  padding: "10px 14px",
  border: "1px solid #b7a392",
  borderRadius: 4,
  outline: "none",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[74vh] flex items-start justify-center px-3 sm:px-4 pt-28 pb-12 sm:pt-32 sm:pb-16" style={{ background: "radial-gradient(120% 120% at 50% 0%, #fbf6ec 0%, #f2e8d4 100%)" }}>
      <div className="relative z-10 w-full max-w-[28rem] p-5 sm:p-6 md:p-8" style={glassPanel}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Logo variant="dark" size="lg" />
        </div>

        {sent ? (
          <>
            <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(24px,4vw,32px)", textAlign: "center", color: "#442a1b", marginBottom: 8 }}>
              Check your inbox
            </h1>
            <p style={{ fontFamily: F, fontSize: 14, color: "#6f5a48", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
              If that email is registered with us, a password reset link is on its way. It expires in 60 minutes.
            </p>
            <div style={{ textAlign: "center" }}>
              <Link href="/login" style={{ fontFamily: F, fontSize: 13, color: "#cd872a", fontWeight: 700, textDecoration: "none" }}>
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(24px,4vw,32px)", textAlign: "center", color: "#442a1b", marginBottom: 4 }}>
              Reset your password
            </h1>
            <p style={{ fontFamily: F, fontSize: 13, color: "#6f5a48", textAlign: "center", marginBottom: 20 }}>
              Enter your account email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontFamily: F, fontSize: 12, fontWeight: 600, color: "#442a1b", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              {error && <p style={{ fontFamily: F, fontSize: 12, color: "#b4452a" }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 14, color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", border: "none", padding: "14px", borderRadius: 4, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Link href="/login" style={{ fontFamily: F, fontSize: 13, color: "#cd872a", fontWeight: 700, textDecoration: "none" }}>
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
