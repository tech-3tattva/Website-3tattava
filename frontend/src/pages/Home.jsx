import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Medal, FlaskConical, Mountain, ShieldCheck, Plus, Minus, ScanLine, MapPin, Sparkles, Check } from "lucide-react";
import { getProducts, getKnowledge } from "../lib/api";
import { BRAND, PILLARS, TRUST_STRIP, EVIDENCE_PILLARS, WEEKS, FOUNDER, ATHLETE, COMPARE, TESTIMONIALS, FAQ_HOME } from "../lib/brandContent";

const IconMap = { Stethoscope, Medal, FlaskConical, Mountain, ShieldCheck };

export default function Home() {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getProducts({ featured: true }).then(setProducts).catch(() => {});
    getKnowledge().then((a) => setArticles(a.slice(0, 3))).catch(() => {});
  }, []);

  const rockresin = products.find((p) => p.slug === "rockresin");
  const shahjeet = products.find((p) => p.slug === "shahjeet-sticks");

  return (
    <div data-testid="home-page">
      <Hero />
      <TrustStrip />
      <ProductSplit rockresin={rockresin} shahjeet={shahjeet} />
      <FounderSection />
      <AthleteSection />
      <WTFEcosystem />
      <EvidenceSection />
      <PillarsSection />
      <ChooseRitualSection rockresin={rockresin} shahjeet={shahjeet} />
      <WeeksSection />
      <SupportSystem />
      <TestimonialsMarquee />
      <KnowledgePreview articles={articles} />
      <FAQHome />
      <FinalCTA />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const particlesRef = useRef(null);
  useEffect(() => {
    if (!particlesRef.current) return;
    const el = particlesRef.current;
    el.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement("div");
      dot.className = "gold-particle";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.top = Math.random() * 100 + "%";
      dot.style.animation = `floatUp ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite alternate`;
      dot.style.opacity = (0.2 + Math.random() * 0.6).toString();
      el.appendChild(dot);
    }
  }, []);

  return (
    <section data-testid="hero" className="relative min-h-[92vh] bg-3t-black overflow-hidden grain">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2200&q=85&auto=format&fit=crop"
        alt="Himalayan range"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 hero-overlay" />
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="eyebrow text-gold mb-8 animate-fade-up" style={{ animationDelay: ".1s" }}>
          <Sparkles size={12} className="inline mr-2" /> Performance Ayurveda™
        </div>
        <h1 className="font-display text-cream animate-fade-up" style={{ animationDelay: ".2s", fontSize: "clamp(56px, 9.5vw, 140px)", lineHeight: 0.93 }}>
          Balance.
          <br />
          Build.
          <br />
          <span className="gold-gradient-text">Become.</span>
        </h1>
        <div className="gold-line w-32 mt-10 mb-10 animate-line-grow" style={{ animationDelay: ".4s" }} />
        <p className="font-italic-light text-cream/85 max-w-2xl text-lg md:text-2xl animate-fade-up" style={{ animationDelay: ".5s", fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
          Ancient Ayurvedic intelligence for modern human performance. Doctor-led. Athlete-backed. Lab-tested.
        </p>
        <div className="flex flex-wrap gap-4 mt-12 animate-fade-up" style={{ animationDelay: ".7s" }}>
          <Link to="/shop" data-testid="hero-cta-shop" className="btn-primary">Explore The Ritual <ArrowRight size={14} /></Link>
          <Link to="/knowledge-center" data-testid="hero-cta-learn" className="btn-outline">Learn Before You Buy</Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream/60 eyebrow text-[10px]">
        Scroll
        <div className="w-px h-12 bg-gold/40" />
      </div>
    </section>
  );
}

/* ---------------- TRUST STRIP ---------------- */
function TrustStrip() {
  return (
    <section data-testid="trust-strip" className="bg-ink text-cream border-y border-gold/15 py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 overflow-x-auto">
        {TRUST_STRIP.map((t) => {
          const I = IconMap[t.icon] || Check;
          return (
            <div key={t.label} className="flex items-center gap-3 shrink-0">
              <I size={16} className="text-gold" />
              <span className="eyebrow text-[10.5px]">{t.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- PRODUCT SPLIT ---------------- */
function ProductSplit({ rockresin, shahjeet }) {
  return (
    <section data-testid="product-split" className="grid md:grid-cols-[45fr_55fr] bg-3t-black text-3t-text">
      {/* Shahjeet */}
      <ProductPanel
        slug="shahjeet-sticks"
        eyebrow="The Fast Ritual™"
        title="SHAHJEET"
        sub="Performance In Your Pocket."
        product={shahjeet}
        bg="linear-gradient(135deg, #1A0F05 0%, #2D1A08 50%, #0E0C09 100%)"
        glow="radial-gradient(circle at 70% 30%, rgba(205,135,42,0.18), transparent 60%)"
        accent="#CD872A"
        boxBg="linear-gradient(145deg, #CD872A, #E8A830 50%, #B06820)"
        specs={[{ k: "Shilajit", v: "600mg" }, { k: "Sticks", v: "30" }, { k: "Honey", v: "7.4g" }]}
        cta="Start The Ritual"
        drip
      />
      {/* RockResin */}
      <ProductPanel
        slug="rockresin"
        eyebrow="The Deep Ritual™"
        title="ROCKRESIN"
        sub="One Resin. Complete Vitality."
        product={rockresin}
        bg="linear-gradient(135deg, #0E0C09 0%, #1C1208 50%, #2A1A0A 100%)"
        glow="radial-gradient(circle at 30% 60%, rgba(201,168,76,0.12), transparent 60%)"
        accent="#C9A84C"
        boxBg="linear-gradient(145deg, #2D1A08, #442A1B 50%, #1A0F05)"
        specs={[{ k: "Fulvic", v: "≥70%" }, { k: "Jar", v: "20g" }, { k: "Minerals", v: "80+" }]}
        cta="Experience The Resin"
      />
    </section>
  );
}

function ProductPanel({ slug, eyebrow, title, sub, product, bg, glow, accent, boxBg, specs, cta, drip }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    setTilt({ x, y });
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} className="relative px-6 md:px-16 py-24 overflow-hidden" style={{ background: bg }} data-testid={`panel-${slug}`}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: glow }} />

      <div className="relative z-10 max-w-xl">
        <div className="eyebrow mb-5" style={{ color: accent }}>{eyebrow}</div>
        <h2 className="font-display text-cream text-5xl md:text-7xl mb-3" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800", letterSpacing: "-0.02em" }}>{title}</h2>
        <p className="font-italic-light text-cream/80 text-xl mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{sub}</p>

        <div className="grid grid-cols-3 gap-6 mb-10 border-t border-b border-cream/15 py-5">
          {specs.map((s) => (
            <div key={s.k}>
              <div className="font-display text-2xl" style={{ color: accent, fontVariationSettings: "'wdth' 80, 'wght' 700" }}>{s.v}</div>
              <div className="eyebrow text-cream/60 text-[10px] mt-1">{s.k}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(product?.badges || []).map((b) => (
            <span key={b} className="eyebrow text-[10px] px-3 py-1.5 border border-cream/20 text-cream/85">{b}</span>
          ))}
        </div>

        <Link to={`/products/${slug}`} data-testid={`panel-cta-${slug}`} className="inline-flex items-center gap-3 group" style={{ color: accent }}>
          <span className="eyebrow">{cta} — ₹{product?.price?.toLocaleString("en-IN") || "—"}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
        </Link>
      </div>

      {/* Product visual */}
      <div className="absolute right-[-40px] md:right-[-20px] top-1/2 -translate-y-1/2 w-[220px] md:w-[320px] h-[280px] md:h-[420px] hidden md:block">
        <div
          className="w-full h-full relative transition-transform duration-300"
          style={{ transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`, background: boxBg, borderRadius: 8, boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}
        >
          {drip && (
            <>
              <div className="honey-drip animate-drip" style={{ left: "30%", animationDelay: "0s" }} />
              <div className="honey-drip animate-drip" style={{ left: "55%", animationDelay: "1.3s" }} />
              <div className="honey-drip animate-drip" style={{ left: "75%", animationDelay: "2.4s" }} />
            </>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="font-display text-cream text-3xl tracking-widest" style={{ fontVariationSettings: "'wdth' 75, 'wght' 800" }}>3T</div>
            <div className="eyebrow text-cream/80 mt-2">{title}</div>
            <div className="w-12 h-px bg-cream/40 my-4" />
            <div className="text-cream/70 text-[10px] eyebrow">Doctor-Led · Lab-Tested</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- FOUNDER ---------------- */
function FounderSection() {
  return (
    <section data-testid="founder-section" className="section bg-cream-deep/40 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <img src={FOUNDER.photo} alt={FOUNDER.name} className="w-full h-[520px] object-cover" />
        <div className="absolute -bottom-6 -right-6 bg-ink text-cream p-6 max-w-[280px] hidden md:block">
          <div className="eyebrow text-gold mb-2">Founder</div>
          <div className="font-display text-xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{FOUNDER.name}</div>
          <div className="text-xs text-cream/70 mt-1">{FOUNDER.credentials}</div>
        </div>
      </div>
      <div>
        <div className="eyebrow text-ink/60 mb-4">Section 01 — The Founder</div>
        <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700", lineHeight: 1.05 }}>
          {FOUNDER.headline}
        </h2>
        <p className="font-italic-light text-lg text-ink/80 mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
          "{FOUNDER.quote}"
        </p>
        <div className="space-y-4 mb-8">
          {["Entered Ayurveda expecting medicine — discovered something much larger.", "Saw a disconnect between ancient wisdom and modern lifestyles inside the Ministry of AYUSH.", "Built 3Tattava for people who want performance — not just treatment."].map((t) => (
            <div key={t} className="flex items-start gap-3">
              <div className="w-1 h-1 bg-gold rounded-full mt-2.5 shrink-0" />
              <p className="text-sm text-ink/80">{t}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {["BAMS", "CBPACS", "Ministry of AYUSH", "Founder, 3Tattava", "Podcast Host"].map((b) => (
            <span key={b} className="eyebrow text-[10px] px-3 py-1.5 bg-white border border-ink/10">{b}</span>
          ))}
        </div>
        <Link to="/our-story" data-testid="founder-cta" className="btn-outline-dark">Discover Performance Ayurveda</Link>
      </div>
    </section>
  );
}

/* ---------------- ATHLETE ---------------- */
function AthleteSection() {
  return (
    <section data-testid="athlete-section" className="section bg-3t-black text-3t-text grain">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div className="relative">
          <img src={ATHLETE.photo} alt={ATHLETE.name} className="w-full h-[600px] object-cover grayscale-[20%]" />
          <div className="absolute bottom-6 left-6 right-6 bg-gold/95 text-ink p-5">
            <div className="eyebrow">Founding Athlete Ambassador</div>
            <div className="font-display text-2xl mt-2" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{ATHLETE.name}</div>
            <div className="text-xs mt-1">Paralympic Bronze Medalist</div>
          </div>
        </div>
        <div>
          <div className="eyebrow text-gold mb-4">Section 02 — Performance Validation</div>
          <h2 className="font-display text-cream text-4xl md:text-5xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
            Built For People Who Demand More From Themselves
          </h2>
          <p className="font-italic-light text-cream/75 text-lg mb-10" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            "{ATHLETE.quote}"
          </p>
          <div className="grid grid-cols-2 gap-6">
            {ATHLETE.pillars.map((p) => (
              <div key={p.title} className="border-l-2 border-gold/40 pl-5">
                <div className="font-display text-xl text-cream" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{p.title}</div>
                <div className="text-sm text-cream/65 mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WTF ECOSYSTEM ---------------- */
function WTFEcosystem() {
  return (
    <section data-testid="wtf-section" className="section bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">Section 03 — Experience Centers</div>
        <div className="grid md:grid-cols-2 gap-12 items-end mb-12">
          <h2 className="font-display text-4xl md:text-5xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
            Performance Lives In <span className="gold-gradient-text">Communities</span>
          </h2>
          <p className="text-ink/75 text-base">
            The best transformations don't happen in isolation. They happen where people train, learn, recover and grow together. 3Tattava is building its Performance Ayurveda ecosystem alongside one of NCR's fastest-growing fitness communities.
          </p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10 mb-12">
          {[
            { n: "29+", l: "Experience Centers" },
            { n: "1", l: "Founding Athlete" },
            { n: "1", l: "Doctor-Led Brand" },
            { n: "∞", l: "Future Transformations" },
          ].map((c) => (
            <div key={c.l} className="bg-cream p-8 text-center">
              <div className="font-display text-5xl gold-gradient-text" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{c.n}</div>
              <div className="eyebrow text-ink/60 mt-3 text-[10px]">{c.l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { h: "Community", b: "Train alongside people committed to growth." },
            { h: "Education", b: "Learn how Ayurveda fits into modern performance." },
            { h: "Experience", b: "Explore products before purchasing." },
          ].map((c, i) => (
            <div key={c.h} className="luxe-card p-8">
              <div className="eyebrow text-gold mb-3">0{i + 1}</div>
              <div className="font-display text-2xl mb-2" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{c.h}</div>
              <p className="text-sm text-ink/70">{c.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/find-us" data-testid="wtf-cta-find" className="btn-outline-dark"><MapPin size={14} /> Find Nearest Experience Center</Link>
          <Link to="/community" className="btn-outline-dark">Explore Community Events</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- EVIDENCE ---------------- */
function EvidenceSection() {
  return (
    <section data-testid="evidence-section" className="section bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">Section 04 — Evidence Before Claims™</div>
        <h2 className="font-display text-4xl md:text-6xl max-w-4xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.02 }}>
          Before benefits — <span className="gold-gradient-text">the standards behind them.</span>
        </h2>
        <p className="text-ink/75 max-w-2xl mb-16">
          We believe you deserve to understand the sourcing, testing and processes behind every product. Not after the purchase. Before it.
        </p>

        <div className="grid md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {EVIDENCE_PILLARS.map((p) => (
            <div key={p.title} className="bg-white p-8 hover:bg-cream-deep/30 transition-colors">
              <div className="font-display text-5xl text-gold/40 mb-4" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>{p.num}</div>
              <div className="font-display text-xl mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{p.title}</div>
              <p className="text-sm text-ink/70">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-[2fr_1fr] gap-8 items-center bg-ink text-cream p-10">
          <div>
            <div className="eyebrow text-gold mb-3"><ScanLine size={14} className="inline mr-2" /> Scan · Verify · Trust</div>
            <h3 className="font-display text-3xl md:text-4xl mb-4" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Every batch is QR-linked to lab reports.</h3>
            <p className="text-cream/70 text-sm">Identity. Heavy metals. Microbial safety. Fulvic acid. Every result accessible in one scan.</p>
          </div>
          <Link to="/research-testing" data-testid="evidence-cta" className="btn-primary justify-self-start md:justify-self-end">View Detailed Reports <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PILLARS ---------------- */
function PillarsSection() {
  const [active, setActive] = useState(0);
  return (
    <section data-testid="pillars-section" className="section bg-cream-deep/40">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">Section 05 — The Philosophy</div>
        <h2 className="font-display text-4xl md:text-6xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.02 }}>
          Balance <span className="text-gold">·</span> Build <span className="text-gold">·</span> Become
        </h2>
        <p className="font-italic-light text-lg text-ink/75 max-w-2xl mb-16" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
          Ayurveda was never just about treating illness. It was about supporting human potential.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <button
              key={p.key}
              data-testid={`pillar-${p.key}`}
              onMouseEnter={() => setActive(i)}
              className={`text-left p-10 transition-all duration-500 border ${active === i ? "bg-ink text-cream border-gold" : "bg-white text-ink border-ink/10 hover:border-gold/50"}`}
            >
              <div className="font-sanskrit text-3xl mb-2" style={{ color: active === i ? p.accent : "#1c1304" }}>{p.sanskrit}</div>
              <div className="eyebrow text-[10px] opacity-70 mb-4">{p.transliteration}</div>
              <div className="font-display text-4xl mb-2" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{p.title}</div>
              <div className="font-italic-light text-sm opacity-80 mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{p.headline}</div>
              <p className="text-sm opacity-80 mb-6">{p.body}</p>
              <ul className="space-y-1.5">
                {p.areas.map((a) => (
                  <li key={a} className="eyebrow text-[10px] flex items-center gap-2 opacity-75">
                    <span className="w-1 h-1 rounded-full" style={{ background: p.accent }} /> {a}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/assessment" data-testid="pillars-cta" className="btn-outline-dark">Discover Your Performance Stage <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CHOOSE RITUAL ---------------- */
function ChooseRitualSection({ rockresin, shahjeet }) {
  return (
    <section data-testid="choose-ritual" className="section bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="eyebrow text-ink/60 mb-4">Section 06 — Choose Your Ritual</div>
          <h2 className="font-display text-4xl md:text-6xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>
            Ancient Rituals. <span className="gold-gradient-text">Modern Performance.</span>
          </h2>
          <p className="text-ink/75 max-w-2xl mx-auto">Some people want the traditional depth of Ayurveda. Others need performance support that fits into a busy day. Choose the ritual that fits your lifestyle.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <RitualCard product={rockresin} accent="#C9A84C" badges={["Traditional", "20g Resin", "70%+ Fulvic Acid"]} usage="Dip · Hook · Swirl" cta="Begin The Deep Ritual" />
          <RitualCard product={shahjeet} accent="#CD872A" badges={["Portable", "30 Sticks", "600mg Shilajit + Honey"]} usage="Tear · Squeeze · Perform" cta="Choose The Fast Ritual" />
        </div>

        {/* Comparison */}
        <div className="bg-ink text-cream overflow-hidden">
          <div className="p-6 md:p-10 border-b border-cream/15">
            <div className="eyebrow text-gold mb-2">Different Rituals · Same Philosophy</div>
            <h3 className="font-display text-2xl md:text-3xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Balance · Build · Become.</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-cream/60 eyebrow text-[10px]">
                  <th className="text-left p-5">Feature</th>
                  <th className="text-left p-5">RockResin</th>
                  <th className="text-left p-5">Shahjeet</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, i) => (
                  <tr key={r.feature} className={i % 2 ? "bg-white/[0.02]" : ""}>
                    <td className="p-5 eyebrow text-[10px] text-cream/60">{r.feature}</td>
                    <td className="p-5">{r.resin}</td>
                    <td className="p-5">{r.sticks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function RitualCard({ product, accent, badges, usage, cta }) {
  if (!product) return null;
  return (
    <div className="luxe-card p-8 group" data-testid={`ritual-card-${product.slug}`}>
      <div className="relative h-72 overflow-hidden mb-6 bg-ink">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute top-4 left-4 eyebrow text-cream text-[10px]" style={{ color: accent }}>{product.ritual_name}</div>
      </div>
      <div className="font-display text-3xl mb-1" style={{ fontVariationSettings: "'wdth' 85, 'wght' 800" }}>{product.name}</div>
      <p className="font-italic-light text-sm text-ink/70 mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{product.tagline}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {badges.map((b) => (
          <span key={b} className="eyebrow text-[10px] px-2.5 py-1 bg-cream-deep/50 border border-ink/10">{b}</span>
        ))}
      </div>
      <div className="font-italic-light text-base mb-6 italic" style={{ color: accent }}>{usage}</div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-display text-3xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>₹{product.price.toLocaleString("en-IN")}</div>
          {product.compare_at && <div className="text-xs text-ink/40 line-through">₹{product.compare_at.toLocaleString("en-IN")}</div>}
        </div>
      </div>
      <Link to={`/products/${product.slug}`} className="btn-primary w-full">{cta}</Link>
    </div>
  );
}

/* ---------------- WEEKS ---------------- */
function WeeksSection() {
  return (
    <section data-testid="weeks-section" className="section bg-3t-black text-3t-text grain">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-gold mb-4">Section 07 — What To Expect</div>
        <h2 className="font-display text-cream text-4xl md:text-6xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.02 }}>
          The Journey Looks Different <br /> For Everyone.
        </h2>
        <p className="text-cream/70 max-w-2xl mb-16">However, many people describe a progression that follows a familiar pattern when consistent habits, training, nutrition and daily rituals come together.</p>

        <div className="grid md:grid-cols-4 gap-px bg-cream/10 border border-cream/10">
          {WEEKS.map((w, i) => (
            <div key={w.label} className="bg-3t-black-2 p-8">
              <div className="eyebrow text-gold mb-3 text-[10px]">{w.label}</div>
              <div className="font-display text-3xl text-cream mb-3" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{w.title}</div>
              <div className="font-italic-light text-sm text-cream/70 mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{w.headline}</div>
              <ul className="space-y-2">
                {w.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-cream/75"><Check size={12} className="text-gold mt-0.5 shrink-0" /> {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SUPPORT ---------------- */
function SupportSystem() {
  return (
    <section data-testid="support-section" className="section bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">Section 08 — Your Performance Support System</div>
        <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
          Because Products Don't Create <span className="gold-gradient-text">Transformation Alone.</span>
        </h2>
        <p className="text-ink/75 max-w-2xl mb-12">Performance is built through daily rituals, nutrition, recovery, movement and consistency. 3Tattava is more than a product — it's a support system.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Dr. Kashish Gupta", sub: "Founder · Ayurveda Physician", body: "Learn the principles of Performance Ayurveda through articles, videos, podcasts and educational resources.", cta: "Explore", link: "/our-story", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80" },
            { title: "Performance Nutrition", sub: "Dr. Falguni Chauhan, BAMS", body: "Get a complimentary starter diet guide. Personalized programs available.", cta: "Get Free Guide", link: "/vaidyaconnect", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80" },
            { title: "Performance Assessment", sub: "Discover your starting point", body: "Answer a few questions about energy, sleep, recovery and stress.", cta: "Take Assessment", link: "/assessment", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
            { title: "Community Access", sub: "Athletes · Professionals · Learners", body: "Events, challenges, podcasts, webinars, athlete sessions.", cta: "Join", link: "/community", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80" },
          ].map((c) => (
            <div key={c.title} className="luxe-card overflow-hidden">
              <img src={c.img} alt={c.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="font-display text-xl mb-1" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{c.title}</div>
                <div className="eyebrow text-[10px] text-ink/60 mb-3">{c.sub}</div>
                <p className="text-sm text-ink/70 mb-5">{c.body}</p>
                <Link to={c.link} className="eyebrow text-gold-dark hover:text-gold inline-flex items-center gap-2">{c.cta} <ArrowRight size={12} /></Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-ink text-cream p-10">
          <div className="eyebrow text-gold mb-4">What Happens After You Join?</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {["Take Assessment", "Choose Your Ritual", "Receive Starter Guidance", "Build Consistency", "Balance · Build · Become"].map((s, i) => (
              <div key={s} className="border-l border-gold/40 pl-4">
                <div className="eyebrow text-gold mb-2 text-[10px]">Step 0{i + 1}</div>
                <div className="text-sm font-display" style={{ fontVariationSettings: "'wdth' 88, 'wght' 600" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS MARQUEE ---------------- */
function TestimonialsMarquee() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section data-testid="testimonials-section" className="section-tight bg-cream-deep/60 relative overflow-hidden marquee-fade">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="eyebrow text-ink/60 mb-4">Section 09 — Real People · Real Results</div>
        <h2 className="font-display text-3xl md:text-5xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Performance Looks Different For Everyone.</h2>
      </div>
      <div className="marquee-track animate-marquee" style={{ gap: 24 }}>
        {items.map((t, i) => (
          <div key={i} className="bg-white border border-ink/10 p-7 w-[360px] shrink-0">
            <div className="font-italic-light text-base mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>"{t.quote}"</div>
            <div className="font-display text-sm" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{t.name}</div>
            <div className="eyebrow text-[10px] text-ink/60 mt-1">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- KNOWLEDGE PREVIEW ---------------- */
function KnowledgePreview({ articles }) {
  return (
    <section data-testid="knowledge-preview" className="section bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">Section 10 — Performance Ayurveda Knowledge Center</div>
        <div className="grid md:grid-cols-2 items-end gap-8 mb-12">
          <h2 className="font-display text-4xl md:text-5xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
            Learn Before <span className="gold-gradient-text">You Buy.</span>
          </h2>
          <p className="text-ink/75 max-w-md md:justify-self-end">The strongest decisions are informed decisions. Explore the science, philosophy and practical application of Performance Ayurveda.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.slug} to={`/education/${a.slug}`} className="luxe-card overflow-hidden group" data-testid={`article-card-${a.slug}`}>
              <div className="h-56 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="eyebrow text-gold-dark mb-3 text-[10px]">{a.category} · {a.read_time}</div>
                <div className="font-display text-xl mb-2 group-hover:text-gold-dark transition-colors" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{a.title}</div>
                <p className="text-sm text-ink/70">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/knowledge-center" className="btn-outline-dark">Explore Knowledge Center <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQHome() {
  const [open, setOpen] = useState(0);
  return (
    <section data-testid="faq-section" className="section bg-cream-deep/30">
      <div className="max-w-4xl mx-auto">
        <div className="eyebrow text-ink/60 mb-4">FAQ</div>
        <h2 className="font-display text-3xl md:text-5xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Questions, answered.</h2>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQ_HOME.map((f, i) => (
            <button key={f.q} onClick={() => setOpen(open === i ? -1 : i)} data-testid={`faq-${i}`} className="w-full text-left py-6 flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="font-display text-lg md:text-xl" style={{ fontVariationSettings: "'wdth' 88, 'wght' 600" }}>{f.q}</div>
                {open === i && <p className="text-sm text-ink/70 mt-3 pr-4">{f.a}</p>}
              </div>
              {open === i ? <Minus size={18} className="mt-1 text-gold" /> : <Plus size={18} className="mt-1 text-ink/60" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section data-testid="final-cta" className="section bg-ink text-cream relative overflow-hidden grain">
      <div className="max-w-7xl mx-auto text-center">
        <div className="eyebrow text-gold mb-6">Section 11 — Begin</div>
        <h2 className="font-display text-5xl md:text-7xl mb-6" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800", lineHeight: 1 }}>
          Ready To <span className="gold-gradient-text">Balance. Build. Become.</span>
        </h2>
        <p className="font-italic-light text-xl md:text-2xl text-cream/80 mb-14 max-w-2xl mx-auto" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
          We don't believe in quick fixes. We believe in daily rituals.
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { eyebrow: "Path 1", title: "Start Your Ritual", desc: "For purchase-ready users.", cta: "Shop Collection", to: "/shop" },
            { eyebrow: "Path 2", title: "Discover Your Starting Point", desc: "For those who need guidance.", cta: "Take Performance Assessment", to: "/assessment" },
            { eyebrow: "Path 3", title: "Experience It Offline", desc: "For community-driven users.", cta: "Find Experience Center", to: "/find-us" },
          ].map((p) => (
            <Link key={p.title} to={p.to} className="border border-gold/30 p-8 text-left hover:bg-gold/10 transition-colors group" data-testid={`final-path-${p.eyebrow.toLowerCase().replace(/ /g, "-")}`}>
              <div className="eyebrow text-gold mb-3 text-[10px]">{p.eyebrow}</div>
              <div className="font-display text-2xl mb-3" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{p.title}</div>
              <p className="text-sm text-cream/70 mb-6">{p.desc}</p>
              <div className="eyebrow text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">{p.cta} <ArrowRight size={12} /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
