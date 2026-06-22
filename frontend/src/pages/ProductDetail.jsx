import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Check, ShieldCheck, FlaskConical, ScanLine, ArrowRight } from "lucide-react";
import { getProduct } from "../lib/api";
import { useCart } from "../context/CartContext";
import ScrollReveal from "../components/ScrollReveal";

export default function ProductDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    setP(null);
    getProduct(slug).then(setP).catch(() => {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!p) return <div className="min-h-[60vh] flex items-center justify-center text-ink/40 eyebrow">Loading the ritual...</div>;

  return (
    <div data-testid={`product-page-${slug}`} className="bg-cream">
      {/* Hero — sticky product, scrolling narrative on the right */}
      <section className="px-6 md:px-16 pt-10 pb-16 grid md:grid-cols-2 gap-10 md:gap-14 relative overflow-hidden">
        {/* Accent radial backdrop */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(closest-side, ${p.accent_color}22, transparent 70%)`, filter: "blur(12px)" }}
        />
        <div className="md:sticky md:top-28 md:self-start max-w-7xl">
          <Link to="/shop" className="eyebrow text-ink/60 inline-flex items-center gap-2 mb-6 hover:text-gold-dark transition-colors"><ArrowLeft size={12} /> All Rituals</Link>
          <ScrollReveal direction="scale" duration={1000}>
            <div className="bg-3t-black p-8 md:p-12 grain relative overflow-hidden shadow-[0_30px_80px_rgba(28,19,4,0.18)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-50"
                style={{ background: `radial-gradient(55% 55% at 50% 60%, ${p.accent_color}33, transparent 70%)` }}
              />
              <img src={p.image} alt={p.name} className="w-full h-[420px] md:h-[480px] object-contain relative z-10 transition-transform duration-700 hover:scale-[1.02]" data-testid="product-image" />
              <div className="absolute top-4 left-4 eyebrow text-cream/90 text-[10px]" style={{ color: p.accent_color }}>{p.ritual_name}</div>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {p.gallery?.slice(0, 3).map((g, i) => (
              <ScrollReveal key={i} delay={120 + i * 100} className="aspect-square bg-cream-deep/40 overflow-hidden group cursor-pointer">
                <img src={g} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow text-ink/60 mb-2">{p.category}</div>
          <h1 className="font-display text-5xl md:text-6xl mb-3" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>{p.name}</h1>
          <p className="font-italic-light text-xl text-ink/75 mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{p.tagline}</p>

          <div className="flex items-end gap-3 mb-8 border-y border-ink/10 py-5">
            <span className="font-display text-4xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>₹{p.price.toLocaleString("en-IN")}</span>
            {p.compare_at && <span className="text-base text-ink/40 line-through mb-1">₹{p.compare_at.toLocaleString("en-IN")}</span>}
            {p.compare_at && <span className="eyebrow text-[10px] bg-gold text-ink px-2 py-1 mb-1">Save ₹{(p.compare_at - p.price).toLocaleString("en-IN")}</span>}
          </div>

          <p className="text-ink/80 text-base mb-8 leading-relaxed">{p.short_desc}</p>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {p.benefits.map((b) => (
              <div key={b} className="flex items-start gap-2 text-sm"><Check size={14} className="text-gold mt-1 shrink-0" /><span>{b}</span></div>
            ))}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-ink/20">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3" aria-label="dec"><Minus size={14} /></button>
              <div className="px-5 text-sm">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3" aria-label="inc"><Plus size={14} /></button>
            </div>
            <button data-testid="add-to-cart" onClick={() => add(p, qty)} className="btn-primary flex-1">Add To Cart · ₹{(p.price * qty).toLocaleString("en-IN")}</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {p.badges.map((b) => (
              <div key={b} className="eyebrow text-[10px] text-center py-3 border border-ink/15">{b}</div>
            ))}
          </div>

          {/* Ritual usage — sequential reveal */}
          <div className="mt-10 border-t border-ink/10 pt-8">
            <div className="eyebrow text-ink/60 mb-4">The Ritual</div>
            <div className="grid grid-cols-3 gap-3">
              {p.how_to_use?.map((s, i) => (
                <ScrollReveal key={s.step} delay={i * 180} direction="up" className="bg-cream-deep/40 p-5 relative overflow-hidden group">
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ background: `radial-gradient(closest-side, ${p.accent_color}, transparent)` }}
                  />
                  <div className="font-display text-3xl mb-2 relative" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700", color: p.accent_color }}>{s.step}</div>
                  <div className="font-display text-base mb-1 relative" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{s.title}</div>
                  <p className="text-xs text-ink/70 relative">{s.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Long description — quiet, italic moment */}
      <section className="section bg-cream-deep/30 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="eyebrow text-ink/60 mb-4">The Story</div>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="font-italic-light text-xl md:text-2xl lg:text-3xl leading-relaxed" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{p.long_desc}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pillars — cinematic stagger on dark */}
      {p.pillars?.length > 0 && (
        <section className="section bg-ink text-cream grain relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-30"
            style={{ background: `radial-gradient(closest-side, ${p.accent_color}55, transparent 70%)`, filter: "blur(20px)" }}
          />
          <div className="max-w-7xl mx-auto relative">
            <ScrollReveal>
              <div className="eyebrow mb-4" style={{ color: p.accent_color }}>The Pillars of Quality</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-12 max-w-3xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
                Quality doesn&apos;t happen by accident. <span style={{ color: p.accent_color }}>It happens by design.</span>
              </h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {p.pillars.map((pillar, i) => (
                <ScrollReveal key={pillar.title} delay={i * 100} direction="up" className="bg-3t-black-2/70 backdrop-blur-sm p-5 md:p-6 border border-cream/8 hover:border-cream/25 transition-all duration-500 hover:-translate-y-1">
                  <div className="font-display text-3xl mb-3" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700", color: p.accent_color }}>0{i + 1}</div>
                  <div className="font-display text-base mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{pillar.title}</div>
                  <p className="text-xs text-cream/65">{pillar.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specs + Ingredients tabs */}
      <section className="section bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-6 border-b border-ink/10 mb-8">
            {["Specifications", "Ingredients", "Lab Testing"].map((t, i) => (
              <button key={t} onClick={() => setTab(i)} data-testid={`product-tab-${i}`} className={`eyebrow py-4 ${tab === i ? "border-b-2 border-gold text-ink" : "text-ink/50"}`}>{t}</button>
            ))}
          </div>
          {tab === 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {p.specs.map((s) => (
                <div key={s.label} className="flex justify-between border-b border-ink/10 py-4">
                  <span className="eyebrow text-[10px] text-ink/60">{s.label}</span>
                  <span className="text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 1 && (
            <div className="space-y-4">
              {p.ingredients?.map((ing) => (
                <div key={ing.name} className="border-b border-ink/10 pb-4">
                  <div className="font-display text-xl" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{ing.name}</div>
                  <div className="text-sm text-ink/70 mt-1">{ing.benefit}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 2 && (
            <div className="grid md:grid-cols-3 gap-4">
              {["NABL Heavy Metals", "Microbial Safety", "Fulvic Acid Verification", "Identity Verification", "AYUSH GMP Certificate", "US-FDA Facility"].map((r) => (
                <div key={r} className="border border-ink/10 p-5">
                  <FlaskConical size={16} className="text-gold mb-3" />
                  <div className="font-display text-sm mb-2" style={{ fontVariationSettings: "'wdth' 90, 'wght' 600" }}>{r}</div>
                  <div className="eyebrow text-[10px] text-gold-dark">Passed</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 bg-ink text-cream p-8 grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <div className="eyebrow text-gold mb-2"><ScanLine size={12} className="inline mr-2" /> Scan · Verify · Trust</div>
              <p className="text-cream/85">Every batch is QR-linked to lab reports.</p>
            </div>
            <Link to="/research-testing" className="btn-primary">View Lab Reports <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-cream-deep/30 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="eyebrow text-ink/60 mb-4">FAQs</div>
            <h2 className="font-display text-3xl md:text-4xl mb-10" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>The honest answers.</h2>
          </ScrollReveal>
          <div className="border-y border-ink/10 divide-y divide-ink/10">
            {p.faqs?.map((f, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full text-left py-5 flex items-start gap-6 group">
                  <div className="flex-1">
                    <div className="font-display text-base md:text-lg group-hover:text-gold-dark transition-colors" style={{ fontVariationSettings: "'wdth' 88, 'wght' 600" }}>{f.q}</div>
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{ maxHeight: openFaq === i ? "320px" : "0px", opacity: openFaq === i ? 1 : 0 }}
                    >
                      <p className="text-sm text-ink/70 mt-3">{f.a}</p>
                    </div>
                  </div>
                  <span className="mt-1 transition-transform duration-500" style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                    {openFaq === i ? <Minus size={16} className="text-gold" /> : <Plus size={16} className="text-ink/50" />}
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory / Packaging info */}
      {p.regulatory && (
        <section className="section bg-ink text-cream" data-testid="product-regulatory">
          <div className="max-w-5xl mx-auto">
            <div className="eyebrow text-gold mb-4">Regulatory · Packaging</div>
            <h2 className="font-display text-2xl md:text-3xl mb-10" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>What&apos;s on the pack.</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-sm">
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Manufacturing License</div>
                <div className="text-cream/90">{p.regulatory.mfg_lic}</div>
              </div>
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Product Type</div>
                <div className="text-cream/90">Ayurvedic Proprietary Medicine</div>
              </div>
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Manufactured By</div>
                <div className="text-cream/85 leading-relaxed">{p.regulatory.manufacturer}</div>
              </div>
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Marketed By</div>
                <div className="text-cream/85 leading-relaxed">{p.regulatory.marketer}</div>
              </div>
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Customer Care</div>
                <div className="text-cream/85">
                  <a href={`mailto:${p.regulatory.care_email}`} className="hover:text-gold">{p.regulatory.care_email}</a><br />
                  <a href={`tel:${p.regulatory.care_phone}`} className="hover:text-gold">{p.regulatory.care_phone}</a>
                </div>
              </div>
              <div>
                <div className="eyebrow text-gold-dark text-[10px] mb-2">Storage</div>
                <div className="text-cream/85">Cool & dry place, away from direct sunlight and moisture. Keep tightly closed.</div>
              </div>
            </div>
            <div className="mt-10 p-6 border border-gold/20 bg-3t-black-2/60">
              <div className="eyebrow text-gold-dark text-[10px] mb-3">Disclaimer</div>
              <p className="text-xs text-cream/70 leading-relaxed">{p.regulatory.disclaimer}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
