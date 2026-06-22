import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { getKnowledge } from "../lib/api";

const CATS = ["all", "Performance Ayurveda", "Shilajit Science", "Recovery", "Nutrition", "Women's Wellness", "Athlete Mindset"];

export default function KnowledgeCenter() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("all");
  useEffect(() => { getKnowledge({ category: cat }).then(setItems).catch(() => {}); }, [cat]);

  return (
    <div data-testid="knowledge-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6">The Performance Ayurveda Knowledge Center</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Learn Before <span className="gold-gradient-text">You Buy.</span>
          </h1>
          <p className="font-italic-light text-xl text-cream/75 mt-6 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            The best decisions are informed decisions. Explore Ayurveda, performance, recovery and modern wellness through evidence-backed resources.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-12 border-b border-ink/10 pb-6">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} data-testid={`knowledge-filter-${c.replace(/\s+/g, "-").toLowerCase()}`} className={`eyebrow text-[10px] px-4 py-2 border transition-all ${cat === c ? "bg-ink text-cream border-ink" : "border-ink/15 hover:border-gold"}`}>{c === "all" ? "All" : c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {items.map((a) => (
              <Link key={a.slug} to={`/education/${a.slug}`} className="luxe-card overflow-hidden group" data-testid={`knowledge-card-${a.slug}`}>
                <div className="h-60 overflow-hidden bg-ink">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div className="p-6">
                  <div className="eyebrow text-gold-dark mb-3 text-[10px] flex items-center gap-2"><Clock size={11} /> {a.read_time} · {a.category}</div>
                  <div className="font-display text-xl mb-3 group-hover:text-gold-dark transition-colors" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{a.title}</div>
                  <p className="text-sm text-ink/70 mb-5">{a.excerpt}</p>
                  <div className="eyebrow text-gold-dark inline-flex items-center gap-2">Read <ArrowRight size={12} /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-cream text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-italic-light text-2xl md:text-3xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>The goal is not to sell more products. The goal is to create better decisions.</p>
        </div>
      </section>
    </div>
  );
}
