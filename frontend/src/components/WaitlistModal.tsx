"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { trackPixel } from "@/lib/fbpixel";

const CREAM = "#f7f0e2";
const INK = "#442a1b";
const GOLD = "#cd872a";
const MUTED = "#6f5a48";
const F = "var(--font-primary), system-ui, sans-serif";

export const WAITLIST_PRODUCTS = [
  "RockResin® — Shodhit Shilajit Resin",
  "Shahjeet® — Honey Sticks",
  "Both products",
  "Not sure yet",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: MUTED,
  fontWeight: 700,
  marginBottom: 6,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: F,
  color: INK,
  background: "#fff",
  border: "1px solid rgba(183,163,146,.5)",
  borderRadius: 6,
  outline: "none",
};

export default function WaitlistModal({ isOpen, onClose, initialProduct }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState<string>(WAITLIST_PRODUCTS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProduct(initialProduct && (WAITLIST_PRODUCTS as readonly string[]).includes(initialProduct) ? initialProduct : WAITLIST_PRODUCTS[0]);
      setStatus("idle");
      setError(null);
    }
  }, [isOpen, initialProduct]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanName) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("Please enter a valid email.");
    if (cleanPhone.length < 10) return setError("Please enter a valid phone number.");

    setStatus("submitting");
    try {
      await api.post("/waitlist", {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        product,
        source: "website",
      });
      setStatus("success");
      trackPixel("Lead", { content_name: "Product Waitlist", content_category: product });
      setName(""); setEmail(""); setPhone("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 10060,
            background: "rgba(20,12,4,.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Join the waitlist"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative", width: "100%", maxWidth: 440,
              maxHeight: "calc(100dvh - 40px)", overflowY: "auto",
              background: CREAM, color: INK, borderRadius: 12,
              boxShadow: "0 24px 60px rgba(20,12,4,.45)",
              fontFamily: F,
            }}
          >
            <div style={{ height: 4, background: "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", borderRadius: "12px 12px 0 0" }} />
            <button
              type="button" onClick={onClose} aria-label="Close"
              style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: MUTED, fontSize: 24, lineHeight: 1, cursor: "pointer", padding: 4 }}
            >×</button>

            <div style={{ padding: "clamp(24px,5vw,36px)" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30, color: GOLD }}>✓</div>
                  <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, marginBottom: 12 }}>You&rsquo;re on the list.</h2>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: MUTED, marginBottom: 24 }}>
                    Thank you for your interest in 3TATTAVA. We&rsquo;ll email you the moment your ritual is ready to order.
                  </p>
                  <button type="button" onClick={onClose} style={{ padding: "12px 28px", background: INK, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>Done</button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 10 }}>Join the Waitlist</p>
                  <h2 style={{ fontSize: "clamp(21px,3.2vw,28px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 8 }}>Be first to begin your ritual.</h2>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED, marginBottom: 22 }}>
                    Our rituals are launching soon. Leave your details and we&rsquo;ll notify you the moment they go live.
                  </p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="wl-name" style={labelStyle}>Full name</label>
                      <input id="wl-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={fieldStyle} autoComplete="name" />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="wl-email" style={labelStyle}>Email</label>
                      <input id="wl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={fieldStyle} autoComplete="email" />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="wl-phone" style={labelStyle}>Phone</label>
                      <input id="wl-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" style={fieldStyle} autoComplete="tel" inputMode="numeric" />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label htmlFor="wl-product" style={labelStyle}>Which product are you interested in?</label>
                      <select id="wl-product" value={product} onChange={(e) => setProduct(e.target.value)} style={{ ...fieldStyle, appearance: "auto", cursor: "pointer" }}>
                        {WAITLIST_PRODUCTS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <p style={{ fontSize: 13, color: "#b91c1c", marginBottom: 14 }}>{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      style={{
                        width: "100%", padding: "14px", border: "none", borderRadius: 999,
                        background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
                        color: INK, fontFamily: F, fontWeight: 800, fontSize: 13.5,
                        letterSpacing: ".1em", textTransform: "uppercase",
                        cursor: status === "submitting" ? "wait" : "pointer",
                        opacity: status === "submitting" ? 0.7 : 1,
                      }}
                    >
                      {status === "submitting" ? "Joining…" : "Join the Waitlist"}
                    </button>
                    <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                      We&rsquo;ll only use your details to notify you about your ritual. No spam.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
