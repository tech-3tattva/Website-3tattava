"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";
import { getAttribution } from "@/lib/attribution";

// ── Palette / type (matches the promo popups + lab-reports page) ──
const CREAM = "#f7f0e2";
const INK = "#442a1b";
const GOLD = "#cd872a";
const MUTED = "#6f5a48";
const F = "var(--font-primary), system-ui, sans-serif";
const BORDER = "rgba(68,42,27,.22)";
const ERR = "#c0392b";

// Mobile-only sticky bar + input focus ring. Inline styles can't do media
// queries, so a tiny scoped stylesheet handles the responsive bits.
const CSS = `
.wl-sticky { display: none; }
@media (max-width: 720px) {
  .wl-sticky { display: block; }
  .wl-page { padding-bottom: 88px; }
}
.wl-input:focus { outline: none; border-color: ${GOLD}; box-shadow: 0 0 0 3px rgba(205,135,42,.18); }
.wl-cta:active { transform: translateY(1px); }
`;

const WAITLIST_COUNT_PATH = "/waitlist/count";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

const eyebrow: CSSProperties = {
  fontFamily: F,
  fontVariationSettings: "'wght' 600",
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: GOLD,
  margin: 0,
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: F,
  fontSize: 16,
  color: INK,
  background: "#fff",
  border: `1.5px solid ${BORDER}`,
  borderRadius: 12,
  padding: "14px 16px",
  transition: "border-color .15s, box-shadow .15s",
};

const primaryBtn: CSSProperties = {
  width: "100%",
  cursor: "pointer",
  fontFamily: F,
  fontVariationSettings: "'wght' 700",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: CREAM,
  background: INK,
  border: "none",
  borderRadius: 999,
  padding: "16px 24px",
  transition: "transform .08s, opacity .15s",
};

const WHAT_YOU_GET = [
  "First-access updates before public launch",
  "A \u20B9200 founding-member discount code on your first order",
  "The published third-party lab reports to review",
  "Founding-allocation priority",
];

const PRODUCTS = [
  {
    name: "RockResin\u00AE",
    subtitle: "Classically Purified Shilajit Resin",
    body: "An authentic Himalayan Shilajit resin, classically purified through Triphala Shodhana \u2014 the deep, traditional ritual for the purist.",
  },
  {
    name: "Shahjeet\u00AE",
    subtitle: "Honey Shilajit Sticks",
    body: "Classically purified Shilajit in a single-serve honey stick \u2014 tear, squeeze, perform, the fast daily ritual that travels with you.",
  },
];

const FAQS = [
  {
    q: "When does 3TATTAVA launch?",
    a: "We\u2019re finalizing our founding batch. Join the waitlist and we\u2019ll email you the launch timing and first-access window \u2014 all updates come through the waitlist.",
  },
  {
    q: "Who is this for?",
    a: "Any adult looking for a doctor-formulated, third-party-tested Shilajit ritual \u2014 RockResin\u00AE for the deep ritual, Shahjeet\u00AE for the fast one.",
  },
  {
    q: "How will you use my details?",
    a: "Only to send launch and product updates. We don\u2019t sell your data, and you can unsubscribe from any email in one click. See our Privacy Policy.",
  },
  {
    q: "What will it cost?",
    a: "Final pricing will be announced at launch (TBA). Waitlist members get a \u20B9200 founding-member discount on their first order.",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export default function WaitlistLanding() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);

  const formRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const viewFiredRef = useRef(false);
  const startFiredRef = useRef(false);

  // Fire form_view / ViewContent exactly once on mount.
  useEffect(() => {
    if (viewFiredRef.current) return;
    viewFiredRef.current = true;
    trackGa("form_view");
    trackPixel("ViewContent", { content_name: "waitlist_lp" });
  }, []);

  // Non-blocking social-proof count. Ignore any failure.
  useEffect(() => {
    let active = true;
    api
      .get<{ count: number }>(WAITLIST_COUNT_PATH)
      .then((res) => {
        if (active && res && typeof res.count === "number") setCount(res.count);
      })
      .catch(() => {
        /* social proof is optional */
      });
    return () => {
      active = false;
    };
  }, []);

  const handleFirstFocus = () => {
    if (startFiredRef.current) return;
    startFiredRef.current = true;
    trackGa("form_start");
    trackPixel("InitiateCheckout", { content_name: "waitlist_form_start" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailRef.current?.focus(), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, "");
    const nextErrors: { email?: string; phone?: string } = {};
    if (!EMAIL_RE.test(cleanEmail)) nextErrors.email = "Enter a valid email address.";
    if (!PHONE_RE.test(cleanPhone)) nextErrors.phone = "Enter a valid 10-digit mobile number.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const name = firstName.trim() || cleanEmail.split("@")[0] || "Founding Member";

    try {
      await api.post("/waitlist", {
        name,
        email: cleanEmail,
        phone: cleanPhone,
        product: "Founding Waitlist",
        source: "waitlist_lp",
        ...getAttribution(),
      });
      setSubmitted(true);
      trackPixel("Lead", {
        content_name: "Waitlist LP",
        content_category: "Founding Waitlist",
      });
      trackGa("generate_lead", { currency: "INR", value: 0 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "submit_failed";
      setErrors({ email: "Something went wrong. Please try again." });
      trackGa("form_error", { message });
      trackPixel("form_error", { content_name: "waitlist_lp" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="wl-page" style={{ background: CREAM, color: INK, fontFamily: F, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── HERO ── */}
      <section
        ref={formRef}
        style={{ maxWidth: 560, margin: "0 auto", padding: "clamp(40px,8vh,72px) 20px clamp(32px,5vh,48px)" }}
      >
        <motion.div {...fade}>
          <p style={{ ...eyebrow, marginBottom: 14 }}>Founding Waitlist</p>

          {submitted ? (
            <ThankYou />
          ) : (
            <>
              <h1
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wght' 800",
                  fontWeight: 800,
                  fontSize: "clamp(30px,7vw,46px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: INK,
                  margin: "0 0 16px",
                }}
              >
                The Waitlist Gets the Dose First.
              </h1>
              <p
                style={{
                  fontFamily: F,
                  fontSize: "clamp(15px,4vw,18px)",
                  lineHeight: 1.55,
                  color: MUTED,
                  margin: "0 0 24px",
                }}
              >
                Read the published lab reports and get first-access updates for
                3TATTAVA’s doctor-formulated Shilajit rituals — plus ₹200 off
                your first order at launch.
              </p>

              {count > 0 && (
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wght' 600",
                    fontWeight: 600,
                    fontSize: 13,
                    color: GOLD,
                    margin: "0 0 18px",
                  }}
                >
                  Join {count.toLocaleString("en-IN")}+ others on the founding list
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 12 }}>
                <input
                  className="wl-input"
                  style={inputStyle}
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="First name (optional)"
                  value={firstName}
                  onFocus={handleFirstFocus}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div>
                  <input
                    ref={emailRef}
                    className="wl-input"
                    style={{ ...inputStyle, borderColor: errors.email ? ERR : BORDER }}
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email address"
                    aria-invalid={Boolean(errors.email)}
                    value={email}
                    onFocus={handleFirstFocus}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <FieldError text={errors.email} />}
                </div>
                <div>
                  <input
                    className="wl-input"
                    style={{ ...inputStyle, borderColor: errors.phone ? ERR : BORDER }}
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    aria-invalid={Boolean(errors.phone)}
                    value={phone}
                    onFocus={handleFirstFocus}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  {errors.phone && <FieldError text={errors.phone} />}
                </div>
                <button className="wl-cta" type="submit" style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? "Joining\u2026" : "Join the Waitlist"}
                </button>
              </form>

              <p style={{ fontFamily: F, fontSize: 12, lineHeight: 1.55, color: MUTED, margin: "14px 0 0" }}>
                By joining, you agree to receive launch and product updates.
                Unsubscribe anytime. See{" "}
                <a href="/privacy" style={{ color: GOLD, textDecoration: "underline" }}>
                  Privacy Policy
                </a>
                .
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ background: INK, padding: "14px 20px" }}>
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 600",
            fontWeight: 600,
            fontSize: "clamp(11px,3vw,13px)",
            letterSpacing: ".04em",
            color: CREAM,
            textAlign: "center",
            margin: "0 auto",
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          NABL third-party tested · Doctor formulated · Triphala purified ·
          Reports available to review
        </p>
      </section>

      {/* ── WHAT YOU GET ── */}
      <motion.section {...fade} style={{ maxWidth: 560, margin: "0 auto", padding: "clamp(40px,7vh,64px) 20px" }}>
        <p style={{ ...eyebrow, marginBottom: 16 }}>What You Get</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
          {WHAT_YOU_GET.map((item) => (
            <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span aria-hidden style={{ color: GOLD, fontVariationSettings: "'wght' 800", fontWeight: 800, fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>
                {"\u2713"}
              </span>
              <span style={{ fontFamily: F, fontSize: "clamp(15px,4vw,17px)", lineHeight: 1.5, color: INK }}>{item}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* ── PRODUCT CLARITY ── */}
      <motion.section {...fade} style={{ background: "#fbf6ea", padding: "clamp(40px,7vh,64px) 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 20, textAlign: "center" }}>Two Rituals, One Standard</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(68,42,27,.12)",
                  borderRadius: 18,
                  padding: 22,
                  boxShadow: "0 8px 24px rgba(68,42,27,.06)",
                }}
              >
                <h3 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontWeight: 800, fontSize: 20, color: INK, margin: "0 0 2px" }}>
                  {p.name}
                </h3>
                <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontWeight: 600, fontSize: 12, letterSpacing: ".04em", textTransform: "uppercase", color: GOLD, margin: "0 0 10px" }}>
                  {p.subtitle}
                </p>
                <p style={{ fontFamily: F, fontSize: 14.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PROOF ── */}
      <motion.section {...fade} style={{ maxWidth: 560, margin: "0 auto", padding: "clamp(36px,6vh,56px) 20px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: "clamp(15px,4vw,18px)", lineHeight: 1.55, color: INK, margin: "0 0 18px" }}>
          Every batch is NABL third-party lab tested. We publish the reports so you can read them before you ever buy.
        </p>
        <a
          href="/lab-reports"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: INK,
            border: `1.5px solid ${INK}`,
            borderRadius: 999,
            padding: "12px 24px",
            textDecoration: "none",
          }}
        >
          View the Lab Reports {"\u2192"}
        </a>
      </motion.section>

      {/* ── SHORT FAQ ── */}
      <motion.section {...fade} style={{ maxWidth: 620, margin: "0 auto", padding: "clamp(36px,6vh,56px) 20px" }}>
        <p style={{ ...eyebrow, marginBottom: 20, textAlign: "center" }}>Questions</p>
        <div style={{ display: "grid", gap: 14 }}>
          {FAQS.map((f) => (
            <div key={f.q} style={{ borderBottom: "1px solid rgba(68,42,27,.12)", paddingBottom: 14 }}>
              <h3 style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontWeight: 700, fontSize: 16, color: INK, margin: "0 0 6px" }}>{f.q}</h3>
              <p style={{ fontFamily: F, fontSize: 14.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── REPEAT CTA ── */}
      {!submitted && (
        <motion.section {...fade} style={{ background: INK, padding: "clamp(40px,7vh,64px) 20px", textAlign: "center" }}>
          <h2 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontWeight: 800, fontSize: "clamp(22px,6vw,32px)", color: CREAM, margin: "0 0 10px" }}>
            The dose goes to the list first.
          </h2>
          <p style={{ fontFamily: F, fontSize: "clamp(14px,4vw,17px)", lineHeight: 1.55, color: "rgba(247,240,226,.8)", margin: "0 auto 22px", maxWidth: 440 }}>
            Founding members get first access and ₹200 off their first order.
          </p>
          <button
            type="button"
            className="wl-cta"
            onClick={scrollToForm}
            style={{ ...primaryBtn, width: "auto", background: GOLD, color: INK, padding: "16px 40px" }}
          >
            Join the Waitlist
          </button>
        </motion.section>
      )}

      {/* ── STICKY MOBILE BAR ── */}
      {!submitted && (
        <div
          className="wl-sticky"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
            background: CREAM,
            borderTop: "1px solid rgba(68,42,27,.14)",
            boxShadow: "0 -6px 20px rgba(68,42,27,.1)",
          }}
        >
          <button type="button" className="wl-cta" onClick={scrollToForm} style={primaryBtn}>
            Join the Waitlist
          </button>
        </div>
      )}
    </main>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: F, fontSize: 12.5, color: ERR, margin: "6px 2px 0" }}>{text}</p>
  );
}

function ThankYou() {
  return (
    <div style={{ textAlign: "center", padding: "clamp(12px,4vw,24px) 0" }}>
      <div
        aria-hidden
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "rgba(205,135,42,.16)",
          color: GOLD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        {"\u2713"}
      </div>
      <h1 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontWeight: 800, fontSize: "clamp(26px,6vw,38px)", color: INK, margin: "0 0 12px" }}>
        You’re on the list.
      </h1>
      <p style={{ fontFamily: F, fontSize: "clamp(15px,4vw,18px)", lineHeight: 1.55, color: MUTED, margin: "0 auto 26px", maxWidth: 420 }}>
        Watch your inbox for timing, product details, and first-access updates.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a
          href="https://instagram.com/3tattava"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: ".04em",
            color: CREAM,
            background: INK,
            borderRadius: 999,
            padding: "12px 22px",
            textDecoration: "none",
          }}
        >
          Follow on Instagram
        </a>
        <a
          href="/lab-reports"
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: ".04em",
            color: INK,
            border: `1.5px solid ${INK}`,
            borderRadius: 999,
            padding: "12px 22px",
            textDecoration: "none",
          }}
        >
          View Lab Reports
        </a>
      </div>
    </div>
  );
}
