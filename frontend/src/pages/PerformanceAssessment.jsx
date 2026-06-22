import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { submitAssessment } from "../lib/api";

const SCALE = [1, 2, 3, 4, 5];
const Q = [
  { id: "energy", q: "Rate your average daily energy.", left: "Drained", right: "Fully Charged" },
  { id: "sleep", q: "Rate your sleep quality this week.", left: "Restless", right: "Restorative" },
  { id: "recovery", q: "Rate your recovery after training/stress.", left: "Slow", right: "Fast" },
  { id: "stress", q: "Rate your current stress level.", left: "Calm", right: "Overwhelmed" },
];

export default function PerformanceAssessment() {
  const [answers, setAnswers] = useState({ energy: 3, sleep: 3, recovery: 3, stress: 3 });
  const [user, setUser] = useState({ name: "", email: "", whatsapp: "" });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitAssessment({ ...user, answers });
      setResult(res.result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => { setAnswers({ energy: 3, sleep: 3, recovery: 3, stress: 3 }); setUser({ name: "", email: "", whatsapp: "" }); setResult(null); };

  if (result) {
    return (
      <div className="bg-cream min-h-[80vh]" data-testid="assessment-result">
        <section className="bg-ink text-cream py-20 px-6 md:px-16 grain text-center">
          <div className="max-w-3xl mx-auto">
            <div className="eyebrow text-gold mb-4">Your Performance Score</div>
            <div className="font-display text-9xl md:text-[180px] gold-gradient-text leading-none my-6" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{result.score}</div>
            <div className="eyebrow text-cream/70 mb-8">/ 100</div>
            <div className="inline-block border border-gold/30 px-6 py-3 mb-8">
              <div className="eyebrow text-gold text-[10px]">Stage</div>
              <div className="font-display text-2xl mt-1" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{result.stage}</div>
            </div>
            <p className="font-italic-light text-xl text-cream/80 max-w-xl mx-auto" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{result.summary}</p>
          </div>
        </section>
        <section className="section">
          <div className="max-w-2xl mx-auto text-center">
            <div className="eyebrow text-gold-dark mb-4">Recommended Ritual</div>
            <h2 className="font-display text-4xl mb-8" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{result.recommended_product}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to={`/products/${result.recommended_product === "RockResin" ? "rockresin" : "shahjeet-sticks"}`} className="btn-primary">Begin The Ritual <ArrowRight size={14} /></Link>
              <Link to="/vaidyaconnect" className="btn-outline-dark">Book A Consultation</Link>
              <button onClick={restart} className="btn-outline-dark"><RefreshCw size={12} /> Retake</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[90vh]" data-testid="assessment-page">
      <section className="bg-ink text-cream py-16 px-6 md:px-16 grain">
        <div className="max-w-3xl mx-auto">
          <div className="eyebrow text-gold mb-4">Performance Assessment</div>
          <h1 className="font-display text-4xl md:text-6xl mb-4" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Discover Your <span className="gold-gradient-text">Starting Point.</span>
          </h1>
          <p className="font-italic-light text-cream/75 text-lg" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            2 minutes. 4 questions. Personalized recommendation.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-10">
          {Q.map((q, i) => (
            <div key={q.id} data-testid={`assess-q-${q.id}`}>
              <div className="eyebrow text-gold-dark mb-3 text-[10px]">Question 0{i + 1}</div>
              <h3 className="font-display text-xl md:text-2xl mb-6" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{q.q}</h3>
              <div className="flex items-center justify-between gap-3 mb-3">
                {SCALE.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: s }))}
                    data-testid={`assess-${q.id}-${s}`}
                    className={`flex-1 py-5 border transition-all ${answers[q.id] === s ? "bg-ink text-cream border-ink" : "bg-white border-ink/15 hover:border-gold"}`}
                  >
                    <span className="font-display text-xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>{s}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] eyebrow text-ink/50">
                <span>{q.left}</span><span>{q.right}</span>
              </div>
            </div>
          ))}

          <div className="border-t border-ink/10 pt-10">
            <div className="eyebrow text-gold-dark mb-6">Where should we send your result?</div>
            <div className="grid md:grid-cols-2 gap-5">
              <input required className="luxe-input" placeholder="FULL NAME" value={user.name} data-testid="assess-name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
              <input required type="email" className="luxe-input" placeholder="EMAIL" value={user.email} data-testid="assess-email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
              <input className="luxe-input md:col-span-2" placeholder="WHATSAPP (OPTIONAL)" value={user.whatsapp} data-testid="assess-whatsapp" onChange={(e) => setUser({ ...user, whatsapp: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full" data-testid="assess-submit">{submitting ? "Calculating..." : "Reveal My Performance Score"} <ArrowRight size={14} /></button>
        </div>
      </form>
    </div>
  );
}
