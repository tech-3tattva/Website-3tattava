import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { submitDoshaQuiz } from "../lib/api";

const Q = [
  { id: "frame", q: "How would you describe your body frame?", opts: [
    { v: "vata", label: "Thin, light, hard to gain weight" },
    { v: "pitta", label: "Medium build, muscular" },
    { v: "kapha", label: "Solid, broader, easily gains weight" },
  ] },
  { id: "skin", q: "Your skin tends to be:", opts: [
    { v: "vata", label: "Dry, rough, cool" },
    { v: "pitta", label: "Warm, freckled, sensitive" },
    { v: "kapha", label: "Smooth, oily, cool" },
  ] },
  { id: "appetite", q: "Your appetite is:", opts: [
    { v: "vata", label: "Variable — sometimes hungry, sometimes not" },
    { v: "pitta", label: "Strong — get irritable if I miss meals" },
    { v: "kapha", label: "Steady but I can skip without issues" },
  ] },
  { id: "sleep", q: "Sleep pattern:", opts: [
    { v: "vata", label: "Light, irregular, sometimes restless" },
    { v: "pitta", label: "Moderate — wake refreshed" },
    { v: "kapha", label: "Deep, long, hard to wake up" },
  ] },
  { id: "stress", q: "Under stress you tend to:", opts: [
    { v: "vata", label: "Worry, overthink, feel anxious" },
    { v: "pitta", label: "Get irritable, angry, frustrated" },
    { v: "kapha", label: "Withdraw, become quiet, slow down" },
  ] },
  { id: "energy", q: "Your energy throughout the day:", opts: [
    { v: "vata", label: "Bursts of high energy, then crash" },
    { v: "pitta", label: "Sustained, focused, intense" },
    { v: "kapha", label: "Slow to start, steady once going" },
  ] },
  { id: "decisions", q: "How do you make decisions?", opts: [
    { v: "vata", label: "Quickly — but I often change my mind" },
    { v: "pitta", label: "Decisively — based on logic and analysis" },
    { v: "kapha", label: "Slowly — I take my time, consider deeply" },
  ] },
];

export default function DoshaQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState({ name: "", email: "" });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isLast = step === Q.length;
  const progress = Math.min(100, ((step + 1) / (Q.length + 1)) * 100);

  const select = (qid, v) => {
    setAnswers((a) => ({ ...a, [qid]: v }));
    setTimeout(() => setStep((s) => Math.min(Q.length, s + 1)), 250);
  };

  const submit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitDoshaQuiz({ name: user.name, email: user.email || undefined, answers });
      setResult(res.result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitting(false);
    }
  };

  const restart = () => { setStep(0); setAnswers({}); setUser({ name: "", email: "" }); setResult(null); setSubmitting(false); };

  if (result) {
    return (
      <div className="bg-cream min-h-[80vh]" data-testid="dosha-result">
        <section className="bg-ink text-cream py-20 px-6 md:px-16 grain">
          <div className="max-w-3xl mx-auto text-center">
            <div className="eyebrow text-gold mb-6">Your Dosha</div>
            <h1 className="font-display text-7xl md:text-9xl gold-gradient-text mb-6 uppercase" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{result.dominant}</h1>
            <p className="font-italic-light text-xl text-cream/80 max-w-xl mx-auto" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{result.description}</p>
          </div>
        </section>
        <section className="section">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-12">
              {Object.entries(result.counts).map(([k, v]) => (
                <div key={k} className="bg-white border border-ink/10 p-5 text-center">
                  <div className="font-display text-3xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{v}</div>
                  <div className="eyebrow text-[10px] text-ink/60 mt-1 uppercase">{k}</div>
                </div>
              ))}
            </div>
            <div className="bg-cream-deep/40 border border-ink/10 p-8 mb-8">
              <div className="eyebrow text-gold-dark mb-3">What This Means</div>
              <p className="text-ink/80 leading-relaxed">Your dosha guides which 3Tattava ritual will integrate best into your lifestyle. Below are your suggested next steps.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Explore Recommended Rituals <ArrowRight size={14} /></Link>
              <Link to="/vaidyaconnect" className="btn-outline-dark">Talk To A Vaidya</Link>
              <button onClick={restart} className="btn-outline-dark"><RefreshCw size={12} /> Retake</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[90vh]" data-testid="dosha-quiz-page">
      <section className="bg-ink text-cream py-16 px-6 md:px-16 grain">
        <div className="max-w-3xl mx-auto">
          <div className="eyebrow text-gold mb-4">Dosha Quiz</div>
          <h1 className="font-display text-4xl md:text-6xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Discover Your <span className="gold-gradient-text">Prakriti.</span>
          </h1>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex-1 h-px bg-ink/10 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 gold-gradient-bg transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="eyebrow text-[10px] text-ink/60">{Math.min(step + 1, Q.length + 1)} / {Q.length + 1}</div>
          </div>

          {!isLast ? (
            <div key={step} className="animate-fade-up" data-testid={`quiz-step-${step}`}>
              <div className="eyebrow text-gold-dark mb-4">Question 0{step + 1}</div>
              <h2 className="font-display text-2xl md:text-3xl mb-10" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700", lineHeight: 1.2 }}>{Q[step].q}</h2>
              <div className="space-y-3">
                {Q[step].opts.map((o) => (
                  <button key={o.v} onClick={() => select(Q[step].id, o.v)} data-testid={`quiz-option-${Q[step].id}-${o.v}`} className="w-full text-left p-5 bg-white border border-ink/15 hover:border-gold hover:bg-cream-deep/30 transition-all flex items-center gap-4 group">
                    <span className="w-4 h-4 rounded-full border-2 border-ink/30 group-hover:border-gold transition" />
                    <span className="text-sm md:text-base">{o.label}</span>
                  </button>
                ))}
              </div>
              {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-8 eyebrow text-ink/60 inline-flex items-center gap-2"><ArrowLeft size={12} /> Back</button>}
            </div>
          ) : (
            <form onSubmit={submit} className="animate-fade-up">
              <div className="eyebrow text-gold-dark mb-4">Almost there</div>
              <h2 className="font-display text-2xl md:text-3xl mb-8" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>Where should we send your result?</h2>
              <div className="space-y-5 mb-8">
                <input className="luxe-input" placeholder="YOUR NAME" data-testid="quiz-name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <input type="email" className="luxe-input" placeholder="EMAIL (OPTIONAL)" data-testid="quiz-email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full" data-testid="quiz-submit">{submitting ? "Calculating..." : "Reveal My Dosha"} <ArrowRight size={14} /></button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
