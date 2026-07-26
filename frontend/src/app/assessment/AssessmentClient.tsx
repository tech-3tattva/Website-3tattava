"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LeadForm from "@/components/forms/LeadForm";
import { useAuth } from "@/context/AuthContext";
import { api, saveAssessment } from "@/lib/api";
import type { Order } from "@shared/types";

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

type Goal = "balance" | "build" | "become" | "explore";

interface Option {
  label: string;
  energy?: number;
  recovery?: number;
  foundation?: number;
  performance?: number;
  prefersDeep?: number;
  goal?: Goal;
}
interface Question {
  id: string;
  question: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "energy",
    question: "How are your energy levels through the day?",
    options: [
      { label: "I crash by the afternoon", energy: 20, foundation: 3 },
      { label: "Inconsistent — good days and bad", energy: 45, foundation: 2 },
      { label: "Generally steady", energy: 70, foundation: 1 },
      { label: "Strong and sustained", energy: 92, foundation: 0 },
    ],
  },
  {
    id: "sleep",
    question: "How restorative is your sleep and recovery?",
    options: [
      { label: "Poor — I wake up tired", recovery: 20, foundation: 3 },
      { label: "Inconsistent", recovery: 45, foundation: 2 },
      { label: "Decent most nights", recovery: 70, foundation: 1 },
      { label: "Deep and restorative", recovery: 92, foundation: 0 },
    ],
  },
  {
    id: "activity",
    question: "How active is your routine?",
    options: [
      { label: "Mostly sedentary", performance: 0 },
      { label: "Light movement", performance: 1 },
      { label: "Regular training", performance: 2 },
      { label: "Intense / competitive", performance: 3 },
    ],
  },
  {
    id: "stress",
    question: "How is your stress and resilience?",
    options: [
      { label: "Often overwhelmed", foundation: 3 },
      { label: "Variable", foundation: 2 },
      { label: "Mostly manageable", foundation: 1 },
      { label: "Calm under pressure", foundation: 0 },
    ],
  },
  {
    id: "goal",
    question: "What matters most to you right now?",
    options: [
      { label: "Restore energy, sleep & calm", foundation: 2, goal: "balance" },
      { label: "Build strength & consistency", performance: 2, goal: "build" },
      { label: "Longevity & peak potential", performance: 1, prefersDeep: 1, goal: "become" },
      { label: "Still figuring it out", goal: "explore" },
    ],
  },
  {
    id: "time",
    question: "How much time do you have for a daily ritual?",
    options: [
      { label: "Almost none — keep it fast", prefersDeep: 0 },
      { label: "A couple of minutes", prefersDeep: 1 },
      { label: "I enjoy a slower, deeper ritual", prefersDeep: 3 },
      { label: "Flexible", prefersDeep: 2 },
    ],
  },
];

interface Ritual {
  name: string;
  slug: string;
  tagline: string;
  why: string;
}
const ROCKRESIN: Ritual = {
  name: "RockResin®",
  slug: "shodhit-shilajit-resin",
  tagline: "The Deep Ritual",
  why: "You have the time and intent for a traditional, immersive practice. Pure Himalayan resin, Dip · Hook · Swirl — built for depth and long-term vitality.",
};
const SHAHJEET: Ritual = {
  name: "Shahjeet®",
  slug: "shahjeet-sticks",
  tagline: "The Fast Ritual",
  why: "Your days move fast and consistency is the challenge. A portable honey-Shilajit stick — Tear · Squeeze · Perform — so the ritual travels with you.",
};

interface Result {
  stage: string;
  sanskrit: string;
  stageLine: string;
  energyScore: number;
  recoveryScore: number;
  ritual: Ritual;
  other: Ritual;
}

function computeResult(answers: Option[]): Result {
  const sum = (k: keyof Option) =>
    answers.reduce((t, o) => t + (typeof o[k] === "number" ? (o[k] as number) : 0), 0);
  const energyScore = answers.find((o) => typeof o.energy === "number")?.energy ?? 50;
  const recoveryScore = answers.find((o) => typeof o.recovery === "number")?.recovery ?? 50;
  const foundation = sum("foundation");
  const performance = sum("performance");
  const prefersDeep = sum("prefersDeep");
  const goal = answers.find((o) => o.goal)?.goal ?? "explore";

  let stage = "Build";
  let sanskrit = "बल (Bala)";
  let stageLine = "Develop strength, focus and consistency.";
  if (foundation >= 7) {
    stage = "Balance";
    sanskrit = "समत्व (Samatva)";
    stageLine = "Restore your foundations first — energy, sleep, recovery and calm.";
  } else if (performance >= 4 || goal === "become") {
    stage = "Become";
    sanskrit = "उत्कर्ष (Utkarsha)";
    stageLine = "Optimise toward longevity, vitality and peak potential.";
  }

  const deepScore = prefersDeep + (goal === "become" ? 2 : 0) + (goal === "build" ? -1 : 0);
  const ritual = deepScore >= 3 ? ROCKRESIN : SHAHJEET;
  const other = ritual === ROCKRESIN ? SHAHJEET : ROCKRESIN;

  return { stage, sanskrit, stageLine, energyScore, recoveryScore, ritual, other };
}

function ScoreRing({ label, value }: { label: string; value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="92" height="92" viewBox="0 0 92 92" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(183,163,146,.35)" strokeWidth="7" />
        <motion.circle
          cx="46" cy="46" r={r} fill="none" stroke="#cd872a" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 22, color: "#442a1b", margin: "-58px 0 38px", position: "relative" }}>{value}</p>
      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#6f5a48", margin: 0 }}>{label}</p>
    </div>
  );
}

function useHasPurchased(): "loading" | "purchased" | "none" {
  const { isLoggedIn, isLoading } = useAuth();
  const [state, setState] = useState<"loading" | "purchased" | "none">("loading");
  useEffect(() => {
    if (isLoading) { setState("loading"); return; }
    if (!isLoggedIn) { setState("none"); return; }
    let cancelled = false;
    setState("loading");
    (async () => {
      try {
        const orders = await api.get<Order[]>("/orders", true);
        const has = Array.isArray(orders) && orders.some((o) => o.status !== "cancelled");
        if (!cancelled) setState(has ? "purchased" : "none");
      } catch {
        if (!cancelled) setState("none");
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, isLoading]);
  return state;
}

function AssessmentGateLoading() {
  return (
    <div style={{ background: "#f7f0e2", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: F, fontSize: 14, letterSpacing: ".08em", color: "#6f5a48" }}>Checking your ritual…</p>
    </div>
  );
}

function AssessmentTeaser() {
  const { isLoggedIn } = useAuth();
  return (
    <div style={{ background: "#f7f0e2", minHeight: "82vh", position: "relative", overflow: "hidden" }}>
      {/* Blurred preview of the real assessment behind the lock */}
      <div aria-hidden style={{ position: "absolute", inset: 0, filter: "blur(8px)", opacity: 0.4, pointerEvents: "none", transform: "scale(1.03)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 24px" }}>
        <div style={{ width: "min(560px,92%)", background: "#442a1b", padding: "34px", textAlign: "center" }}>
          <p style={{ fontFamily: F, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,240,226,.55)", margin: "0 0 8px" }}>Your Stage</p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 44, color: "#cd872a", margin: 0 }}>Balance</p>
        </div>
        <div style={{ width: "min(560px,92%)", background: "#fff", border: "1px solid #b7a392", padding: "28px", display: "flex", justifyContent: "center", gap: 48 }}>
          {["Energy", "Recovery"].map((l) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "7px solid rgba(205,135,42,.5)", margin: "0 auto 10px" }} />
              <p style={{ fontFamily: F, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#6f5a48", margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lock overlay */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto", padding: "clamp(72px,14vh,150px) 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#442a1b", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 22, boxShadow: "0 10px 30px rgba(68,42,27,.25)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#cd872a", marginBottom: 14 }}>
          Performance Assessment · Locked
        </p>
        <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(28px,4.6vw,46px)", letterSpacing: "-.02em", color: "#442a1b", lineHeight: 1.1, margin: "0 0 16px" }}>
          A Surprise Awaits Your First Ritual.
        </h1>
        <p style={{ fontFamily: F, fontSize: "clamp(15px,1.9vw,18px)", lineHeight: 1.7, color: "#6f5a48", maxWidth: 500, margin: "0 auto 30px" }}>
          Your personalized Performance Assessment — your Balance · Build · Become stage, your energy &amp; recovery baseline, and a ritual plan from Dr. Kashish — unlocks the moment you begin your first ritual. Complete your first purchase to reveal it, plus a little something extra.
        </p>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "15px 28px", textDecoration: "none" }}>
          Shop The Ritual
          <motion.span aria-hidden animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>→</motion.span>
        </Link>
        {!isLoggedIn && (
          <p style={{ fontFamily: F, fontSize: 13, color: "#6f5a48", marginTop: 18 }}>
            Already purchased?{" "}
            <Link href="/login" style={{ color: "#cd872a", fontWeight: 600, textDecoration: "none" }}>Sign in to unlock →</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function AssessmentClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const purchase = useHasPurchased();
  const done = step >= QUESTIONS.length;
  const result = done ? computeResult(answers) : null;
  const savedRef = useRef(false);

  // Persist the completed assessment once per completion (auth is guaranteed by the purchase gate).
  useEffect(() => {
    if (!done || !result || savedRef.current) return;
    savedRef.current = true;
    const answersPayload = QUESTIONS.map((q, i) => ({
      id: q.id,
      question: q.question,
      answer: answers[i]?.label,
    }));
    void (async () => {
      try {
        await saveAssessment({
          stage: result.stage,
          sanskrit: result.sanskrit,
          stageLine: result.stageLine,
          energyScore: result.energyScore,
          recoveryScore: result.recoveryScore,
          ritual: result.ritual,
          other: result.other,
          answers: answersPayload,
          source: "assessment",
        });
      } catch {
        // Non-fatal: a save failure must never break the result UI.
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, result]);

  const choose = (opt: Option) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = opt;
      return next;
    });
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers([]); setStep(0); savedRef.current = false; };

  const progress = Math.min(100, Math.round((step / QUESTIONS.length) * 100));
  if (purchase === "loading") return <AssessmentGateLoading />;
  if (purchase === "none") return <AssessmentTeaser />;

  return (
    <div style={{ background: "#f7f0e2", minHeight: "80vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(48px,7vh,84px) 24px clamp(56px,9vh,96px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#cd872a", marginBottom: 12 }}>
            Performance Assessment
          </p>
          <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(28px,4.5vw,46px)", letterSpacing: "-.02em", color: "#442a1b", lineHeight: 1.1, margin: 0 }}>
            {done ? "Your Starting Point" : "Discover Your Starting Point"}
          </h1>
          {!done && (
            <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.7, color: "#6f5a48", maxWidth: 520, margin: "12px auto 0" }}>
              Six quick questions. No medical claims — just a practical sense of where to begin your Balance · Build · Become journey.
            </p>
          )}
        </div>

        {/* Progress */}
        {!done && (
          <div style={{ height: 3, background: "rgba(183,163,146,.4)", marginBottom: 32, overflow: "hidden" }}>
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: EASE }} style={{ height: "100%", background: "linear-gradient(90deg,#A67B2F,#cd872a)" }} />
          </div>
        )}

        {/* Questions */}
        {!done && (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#b7a392", marginBottom: 8 }}>
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "clamp(20px,2.8vw,30px)", color: "#442a1b", lineHeight: 1.25, margin: "0 0 22px" }}>
                {QUESTIONS[step].question}
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {QUESTIONS[step].options.map((opt) => {
                  const selected = answers[step]?.label === opt.label;
                  return (
                    <motion.button
                      key={opt.label}
                      type="button"
                      onClick={() => choose(opt)}
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
              {step > 0 && (
                <button type="button" onClick={back} style={{ marginTop: 20, fontFamily: F, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#6f5a48", background: "none", border: "none", cursor: "pointer" }}>
                  ← Back
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Result */}
        {done && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            {/* Stage */}
            <div style={{ textAlign: "center", background: "#442a1b", padding: "32px 26px", marginBottom: 18 }}>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,240,226,.55)", margin: "0 0 8px" }}>Your Stage</p>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(30px,5vw,48px)", color: "#cd872a", margin: 0, lineHeight: 1 }}>{result.stage}</p>
              <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: 18, color: "rgba(247,240,226,.8)", margin: "8px 0 6px" }}>{result.sanskrit}</p>
              <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.6, color: "rgba(247,240,226,.7)", maxWidth: 460, margin: "0 auto" }}>{result.stageLine}</p>
            </div>

            {/* Scores */}
            <div style={{ display: "flex", justifyContent: "center", gap: 48, background: "#fff", border: "1px solid #b7a392", padding: "26px", marginBottom: 18 }}>
              <ScoreRing label="Energy" value={result.energyScore} />
              <ScoreRing label="Recovery" value={result.recoveryScore} />
            </div>

            {/* Recommended ritual */}
            <div style={{ background: "#fff", border: "1px solid #cd872a", padding: "28px 26px", marginBottom: 18 }}>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#cd872a", margin: "0 0 6px" }}>Recommended Ritual</p>
              <h3 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 26, color: "#442a1b", margin: "0 0 2px" }}>{result.ritual.name}</h3>
              <p style={{ fontFamily: F, fontStyle: "italic", fontSize: 14, color: "#cd872a", margin: "0 0 12px" }}>{result.ritual.tagline}</p>
              <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: "#6f5a48", margin: "0 0 18px" }}>{result.ritual.why}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href={`/products/${result.ritual.slug}`} style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "13px 22px", textDecoration: "none" }}>
                  Shop {result.ritual.name}
                </Link>
                <Link href="/find-us" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "transparent", border: "1px solid #b7a392", padding: "13px 22px", textDecoration: "none" }}>
                  Find a Center
                </Link>
              </div>
            </div>

            {/* Secondary links */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }} className="assess-secondary">
              <Link href={`/products/${result.other.slug}`} style={{ display: "block", background: "#fff", border: "1px solid #b7a392", padding: "16px 18px", textDecoration: "none" }}>
                <p style={{ fontFamily: F, fontSize: 13, fontVariationSettings: "'wdth' 85,'wght' 700", color: "#442a1b", margin: "0 0 2px" }}>Or explore {result.other.name}</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "#6f5a48", margin: 0 }}>{result.other.tagline} →</p>
              </Link>
              <Link href="/knowledge-center" style={{ display: "block", background: "#fff", border: "1px solid #b7a392", padding: "16px 18px", textDecoration: "none" }}>
                <p style={{ fontFamily: F, fontSize: 13, fontVariationSettings: "'wdth' 85,'wght' 700", color: "#442a1b", margin: "0 0 2px" }}>Learn before you buy</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "#6f5a48", margin: 0 }}>Performance Ayurveda Knowledge Center →</p>
              </Link>
            </div>

            {/* Lead capture for full report */}
            <div style={{ background: "rgba(205,135,42,.06)", border: "1px solid rgba(205,135,42,.25)", padding: "24px 22px", marginBottom: 20 }}>
              <h3 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 18, color: "#442a1b", margin: "0 0 6px" }}>Get your full report</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, lineHeight: 1.6, color: "#6f5a48", margin: "0 0 16px" }}>
                Receive a personalized Performance Ayurveda starter guide and ritual plan over WhatsApp and email.
              </p>
              <LeadForm interest={`assessment_${result.stage.toLowerCase()}`} source="assessment" cta="Send My Report" successTitle="On its way." successBody="Check your WhatsApp and email shortly for your personalized starter guide." />
            </div>

            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={restart} style={{ fontFamily: F, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#6f5a48", background: "none", border: "none", cursor: "pointer" }}>
                ↺ Retake the assessment
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
