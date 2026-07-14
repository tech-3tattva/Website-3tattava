"use client";

import { useState } from "react";

// Reusable lead-capture form. POSTs to the real backend leads endpoint
// (POST {NEXT_PUBLIC_API_URL}/leads → { name, email, phone, interest, source }).

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.3tattava.com";
const F = "var(--font-primary), system-ui, sans-serif";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: F,
  fontSize: 14,
  color: "#442a1b",
  background: "#ffffff",
  border: "1px solid #b7a392",
  borderRadius: 2,
  padding: "12px 14px",
  outline: "none",
};

export default function LeadForm({
  interest = "not_specified",
  source = "website",
  cta = "Submit",
  successTitle = "You're in.",
  successBody = "Thank you — we'll be in touch shortly.",
}: {
  interest?: string;
  source?: string;
  cta?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) return setErr("Please enter your name.");
    if (!EMAIL_RE.test(email)) return setErr("Please enter a valid email.");
    if (phone.replace(/\D/g, "").length < 10) return setErr("Please enter a valid phone number.");
    setStatus("submitting");
    try {
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), interest, source }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErr("Something went wrong. Please email us at hello@3tattava.com.");
    }
  };

  if (status === "success") {
    return (
      <div style={{ background: "#442a1b", padding: "28px 26px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 20, color: "#cd872a", margin: "0 0 6px" }}>{successTitle}</p>
        <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.6, color: "rgba(247,240,226,.7)", margin: 0 }}>{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 460 }} noValidate>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }} className="lead-form-row">
        <input style={inputStyle} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" autoComplete="name" />
        <input style={inputStyle} type="tel" placeholder="WhatsApp number" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="WhatsApp number" autoComplete="tel" />
      </div>
      <input style={inputStyle} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" autoComplete="email" />
      {err && <p style={{ fontFamily: F, fontSize: 12, color: "#b4452a", margin: "2px 0 0" }}>{err}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 85,'wght' 700",
          fontSize: 12,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#442a1b",
          background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
          border: "none",
          padding: "14px 22px",
          cursor: status === "submitting" ? "wait" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? "Submitting…" : cta}
      </button>
    </form>
  );
}
