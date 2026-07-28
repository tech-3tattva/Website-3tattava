"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveAssessment } from "@/lib/api";
import {
  PRAKRITI_STEPS,
  PATIENT_KEYS,
  MEDICAL_KEYS,
  computePreliminaryDosha,
  type Dosha,
} from "@/data/prakriti";

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const DOSHA_META: Record<Dosha, { label: string; sanskrit: string; color: string; note: string }> = {
  vata: { label: "Vata", sanskrit: "वात", color: "#6f8fb8", note: "Air & Space — movement, creativity, lightness." },
  pitta: { label: "Pitta", sanskrit: "पित्त", color: "#cd872a", note: "Fire & Water — metabolism, focus, intensity." },
  kapha: { label: "Kapha", sanskrit: "कफ", color: "#6f8f5a", note: "Earth & Water — structure, stability, calm." },
};

const PATIENT = PATIENT_KEYS as readonly string[];
const MEDICAL = MEDICAL_KEYS as readonly string[];
const TOTAL = PRAKRITI_STEPS.length;

type Preliminary = { vata: number; pitta: number; kapha: number; primary: Dosha };

/* ── Login gate ─────────────────────────────────────────────────────────── */
function SignInGate() {
  return (
    <div style={{ background: "#fff", border: "1px solid #b7a392", padding: "clamp(32px,5vw,48px)", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#442a1b", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#cd872a", marginBottom: 12 }}>
        Prakriti Analysis
      </p>
      <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(22px,3.4vw,32px)", color: "#442a1b", lineHeight: 1.15, margin: "0 0 12px" }}>
        Sign in to begin your analysis
      </h2>
      <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.7, color: "#6f5a48", maxWidth: 440, margin: "0 auto 26px" }}>
        Your answers are saved to your account so our Ayurvedic doctor can review them and finalise your Prakriti — you&apos;ll see the result in your profile.
      </p>
      <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "15px 30px", textDecoration: "none" }}>
        Sign in to start →
      </Link>
    </div>
  );
}

/* ── Result screen ──────────────────────────────────────────────────────── */
function ResultScreen({ name, pre, onRestart }: { name: string; pre: Preliminary; onRestart: () => void }) {
  const max = Math.max(pre.vata, pre.pitta, pre.kapha, 1);
  const order: Dosha[] = ["vata", "pitta", "kapha"];
  const primary = DOSHA_META[pre.primary];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
      <div style={{ textAlign: "center", background: "#442a1b", padding: "36px 26px", marginBottom: 18 }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(247,240,226,.55)", margin: "0 0 10px" }}>
          Thank you{name ? `, ${name.split(" ")[0]}` : ""} — analysis received
        </p>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(26px,4.4vw,42px)", color: "#cd872a", margin: 0, lineHeight: 1.05 }}>
          Preliminary: {primary.label}-leaning
        </p>
        <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: 20, color: "rgba(247,240,226,.8)", margin: "8px 0 0" }}>{primary.sanskrit}</p>
      </div>

      {/* Preliminary dosha bars */}
      <div style={{ background: "#fff", border: "1px solid #b7a392", padding: "26px 24px", marginBottom: 18 }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#cd872a", margin: "0 0 16px" }}>
          Your preliminary balance
        </p>
        <div style={{ display: "grid", gap: 14 }}>
          {order.map((d) => {
            const meta = DOSHA_META[d];
            const val = pre[d];
            const pct = Math.round((val / max) * 100);
            return (
              <div key={d}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 14, color: "#442a1b" }}>
                    {meta.label} <span style={{ fontFamily: "var(--font-devanagari), serif", color: "#6f5a48" }}>{meta.sanskrit}</span>
                  </span>
                  <span style={{ fontFamily: F, fontSize: 12, color: "#6f5a48" }}>{val}</span>
                </div>
                <div style={{ height: 8, background: "rgba(183,163,146,.3)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: EASE }} style={{ height: "100%", background: meta.color, borderRadius: 4 }} />
                </div>
                <p style={{ fontFamily: F, fontSize: 11.5, color: "#8a7663", margin: "5px 0 0" }}>{meta.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Doctor-review note */}
      <div style={{ background: "rgba(205,135,42,.07)", border: "1px solid rgba(205,135,42,.28)", padding: "22px 22px", marginBottom: 20 }}>
        <h3 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 17, color: "#442a1b", margin: "0 0 6px" }}>
          Your Vaidya will finalise your Prakriti
        </h3>
        <p style={{ fontFamily: F, fontSize: 13.5, lineHeight: 1.65, color: "#6f5a48", margin: 0 }}>
          This is a preliminary reading. Our Ayurvedic doctor reviews your full submission and completes your final Prakriti scoring
          (body type, digestion, sleep, mind, skin &amp; energy) with a personalised analysis. Once done, it appears in your profile under
          <strong> My Prakriti Report</strong>.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/account" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "14px 24px", textDecoration: "none" }}>
          View in my profile
        </Link>
        <Link href="/find-us" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "transparent", border: "1px solid #b7a392", padding: "14px 24px", textDecoration: "none" }}>
          Find a Center
        </Link>
      </div>

      <div style={{ textAlign: "center", marginTop: 22 }}>
        <button type="button" onClick={onRestart} style={{ fontFamily: F, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#6f5a48", background: "none", border: "none", cursor: "pointer" }}>
          ↺ Retake the analysis
        </button>
      </div>
    </motion.div>
  );
}

function Shell({ embedded, children }: { embedded: boolean; children: React.ReactNode }) {
  if (embedded) return <div>{children}</div>;
  return (
    <div style={{ background: "#f7f0e2", minHeight: "80vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(48px,7vh,84px) 24px clamp(56px,9vh,96px)" }}>{children}</div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function PrakritiAssessment({ embedded = false }: { embedded?: boolean }) {
  const { isLoggedIn, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pre, setPre] = useState<Preliminary | null>(null);
  const savedRef = useRef(false);

  const current = PRAKRITI_STEPS[step];
  const value = current ? answers[current.key] ?? "" : "";
  const isChoice = current?.type === "single" || current?.type === "select";
  const canContinue = !current?.required || value.trim() !== "";
  const progress = Math.round((step / TOTAL) * 100);

  async function submit(finalAnswers: Record<string, string>) {
    if (savedRef.current) return;
    savedRef.current = true;
    setSubmitting(true);

    const patient: Record<string, string> = {};
    PATIENT.forEach((k) => { patient[k] = finalAnswers[k] ?? ""; });
    const medicalHistory: Record<string, string> = {};
    MEDICAL.forEach((k) => { medicalHistory[k] = finalAnswers[k] ?? ""; });

    const prakritiAnswers = PRAKRITI_STEPS
      .filter((s) => !PATIENT.includes(s.key) && !MEDICAL.includes(s.key))
      .map((s) => {
        const answer = finalAnswers[s.key] ?? "";
        const opt = s.options?.find((o) => o.label === answer);
        return { section: s.section, key: s.key, question: s.question, answer, dosha: opt?.dosha };
      });

    const preliminary = computePreliminaryDosha(prakritiAnswers);
    setPre(preliminary);

    try {
      await saveAssessment({
        kind: "prakriti",
        patient,
        prakritiAnswers,
        medicalHistory,
        preliminaryDosha: preliminary,
        source: "vaidya-connect",
      });
    } catch {
      // Non-fatal: a save failure must never block the user's result view.
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  const advance = (next: Record<string, string>) => {
    if (step + 1 >= TOTAL) void submit(next);
    else setStep((s) => s + 1);
  };
  const choose = (label: string) => {
    const next = { ...answers, [current.key]: label };
    setAnswers(next);
    advance(next);
  };
  const setText = (val: string) => setAnswers((p) => ({ ...p, [current.key]: val }));
  const continueText = () => { if (canContinue) advance(answers); };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers({}); setStep(0); setSubmitted(false); setPre(null); savedRef.current = false; };

  if (isLoading) {
    return (
      <Shell embedded={embedded}>
        <p style={{ fontFamily: F, fontSize: 14, letterSpacing: ".08em", color: "#6f5a48", textAlign: "center", padding: "40px 0" }}>Loading…</p>
      </Shell>
    );
  }
  if (!isLoggedIn) return <Shell embedded={embedded}><SignInGate /></Shell>;

  if (submitted && pre) {
    return <Shell embedded={embedded}><ResultScreen name={answers.fullName ?? ""} pre={pre} onRestart={restart} /></Shell>;
  }

  return (
    <Shell embedded={embedded}>
      {!embedded && (
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#cd872a", marginBottom: 12 }}>
            Prakriti Analysis
          </p>
          <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(28px,4.5vw,46px)", letterSpacing: "-.02em", color: "#442a1b", lineHeight: 1.1, margin: 0 }}>
            Discover Your Prakriti
          </h1>
          <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.7, color: "#6f5a48", maxWidth: 520, margin: "12px auto 0" }}>
            One question at a time. Answer honestly — your Vaidya reviews every submission and finalises your Prakriti.
          </p>
        </div>
      )}

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#cd872a" }}>
            Section {current.sectionNo} of 11 · {current.section}
          </span>
          <span style={{ fontFamily: F, fontSize: 11, color: "#8a7663" }}>{step + 1} / {TOTAL}</span>
        </div>
        <div style={{ height: 3, background: "rgba(183,163,146,.4)", overflow: "hidden" }}>
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: EASE }} style={{ height: "100%", background: "linear-gradient(90deg,#A67B2F,#cd872a)" }} />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "clamp(20px,2.8vw,30px)", color: "#442a1b", lineHeight: 1.25, margin: "0 0 6px" }}>
            {current.question}
            {current.required && <span style={{ color: "#cd872a" }}> *</span>}
          </h2>
          {current.hint && (
            <p style={{ fontFamily: F, fontSize: 13.5, lineHeight: 1.6, color: "#8a7663", margin: "0 0 18px" }}>{current.hint}</p>
          )}
          <div style={{ marginTop: current.hint ? 0 : 20 }}>
            {isChoice ? (
              <div style={{ display: "grid", gap: 10 }}>
                {current.options!.map((opt) => {
                  const selected = value === opt.label;
                  return (
                    <motion.button
                      key={opt.label}
                      type="button"
                      onClick={() => choose(opt.label)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        textAlign: "left",
                        fontFamily: F,
                        fontSize: 15,
                        color: "#442a1b",
                        background: selected ? "rgba(205,135,42,.12)" : "#ffffff",
                        border: `1px solid ${selected ? "#cd872a" : "#b7a392"}`,
                        padding: "16px 18px",
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            ) : current.type === "textarea" ? (
              <textarea
                autoFocus
                value={value}
                onChange={(e) => setText(e.target.value)}
                placeholder={current.placeholder}
                rows={4}
                style={{ width: "100%", fontFamily: F, fontSize: 16, color: "#442a1b", background: "#fff", border: "1px solid #b7a392", padding: "14px 16px", resize: "vertical", boxSizing: "border-box" }}
              />
            ) : (
              <input
                autoFocus
                type={current.type === "number" ? "number" : "text"}
                value={value}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); continueText(); } }}
                placeholder={current.placeholder}
                style={{ width: "100%", fontFamily: F, fontSize: 16, color: "#442a1b", background: "#fff", border: "1px solid #b7a392", padding: "14px 16px", boxSizing: "border-box" }}
              />
            )}
          </div>

          {/* Controls for text-type steps */}
          {!isChoice && (
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
              <button
                type="button"
                onClick={continueText}
                disabled={!canContinue || submitting}
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: 12,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#442a1b",
                  background: canContinue ? "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)" : "rgba(183,163,146,.5)",
                  border: "none",
                  padding: "14px 28px",
                  cursor: canContinue && !submitting ? "pointer" : "not-allowed",
                }}
              >
                {step + 1 >= TOTAL ? (submitting ? "Submitting…" : "Submit analysis") : "Continue"}
              </button>
              {!current.required && !value && (
                <button type="button" onClick={() => advance(answers)} style={{ fontFamily: F, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#8a7663", background: "none", border: "none", cursor: "pointer" }}>
                  Skip
                </button>
              )}
            </div>
          )}

          {step > 0 && (
            <button type="button" onClick={back} style={{ marginTop: 20, fontFamily: F, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#6f5a48", background: "none", border: "none", cursor: "pointer" }}>
              ← Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}
