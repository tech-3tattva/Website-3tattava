"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Mountain,
  Leaf,
  Activity,
  BookOpen,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PILLARS, CLUSTERS, type Cluster } from "@/data/education/pillars";
import { BLOGS } from "@/data/education/blogs";
import { FAQS } from "@/data/education/faqs";

// ─── Tokens ─────────────────────────────────────────────────────────────────
const GOLD = "#cd872a";
const GOLD_DARK = "#a67b2f";
const CREAM = "#f7f0e2";
const INK = "#442a1b";
const ESPRESSO = "#5b3c23";
const TAUPE = "#8a7355";
const F = "var(--font-primary), system-ui, sans-serif";

const CLUSTER_META: Record<Cluster, { icon: LucideIcon; color: string }> = {
  Shilajit: { icon: Mountain, color: GOLD },
  Ayurveda: { icon: Leaf, color: "#6b8e4e" },
  Application: { icon: Activity, color: ESPRESSO },
};

const norm = (s: string) => s.toLowerCase();

// FAQ topic chips — the highest-volume categories from the 524-answer library.
const FAQ_TOPICS = [
  "All",
  "Fundamentals",
  "Safety & Contraindications",
  "Dosage & Timing",
  "Women's Health",
  "Men's Health",
  "Fitness & Sports",
  "Triphala Knowledge",
  "Prakriti & Dosha",
  "Authenticity & Buying",
];

const STATS = [
  { n: PILLARS.length, label: "Knowledge pillars" },
  { n: BLOGS.length, label: "In-depth guides" },
  { n: FAQS.length, label: "Answered questions" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KnowledgeCenterClient() {
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState<Cluster | "All">("All");
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [faqTopic, setFaqTopic] = useState("All");
  const [faqLimit, setFaqLimit] = useState(24);

  const query = norm(q.trim());

  // Guides filtered by search (pillar filter handled per-card).
  const blogMatch = useMemo(() => {
    if (!query) return null;
    return BLOGS.filter(
      (b) =>
        norm(b.title).includes(query) ||
        norm(b.metaDesc).includes(query) ||
        norm(b.keyword).includes(query) ||
        norm(b.pillar).includes(query)
    );
  }, [query]);

  const guidesByPillar = useMemo(() => {
    const map: Record<string, typeof BLOGS> = {};
    const src = blogMatch ?? BLOGS;
    for (const b of src) (map[b.pillar] ||= []).push(b);
    return map;
  }, [blogMatch]);

  const visiblePillars = useMemo(
    () =>
      PILLARS.filter((p) => cluster === "All" || p.cluster === cluster).filter(
        (p) => !query || (guidesByPillar[p.pillar]?.length ?? 0) > 0
      ),
    [cluster, query, guidesByPillar]
  );

  // FAQs
  const faqs = useMemo(() => {
    let list = FAQS;
    if (faqTopic !== "All") list = list.filter((f) => f.category === faqTopic);
    if (query)
      list = list.filter(
        (f) => norm(f.q).includes(query) || norm(f.a).includes(query) || norm(f.category).includes(query)
      );
    // Surface highest-priority answers first.
    return [...list].sort((a, b) => a.priority.localeCompare(b.priority));
  }, [faqTopic, query]);

  const autoOpen = query.length > 0;

  return (
    <main style={{ background: CREAM, color: INK, fontFamily: F }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          background: `linear-gradient(180deg,#fbf6ea 0%,${CREAM} 100%)`,
          padding: "clamp(84px,10vw,140px) 24px clamp(40px,5vw,64px)",
          borderBottom: "1px solid rgba(68,42,27,.08)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontVariationSettings: "'wght' 700", letterSpacing: ".22em", textTransform: "uppercase", fontSize: 12, color: GOLD_DARK, marginBottom: 18 }}
          >
            3Tattava Knowledge Center
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{ fontVariationSettings: "'wght' 800", fontSize: "clamp(34px,5.5vw,64px)", lineHeight: 1.04, letterSpacing: "-0.02em", margin: "0 auto 20px", maxWidth: "16ch" }}
          >
            The Performance Ayurveda™ Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.6, color: TAUPE, maxWidth: "60ch", margin: "0 auto clamp(28px,4vw,40px)" }}
          >
            Evidence-informed answers on Shilajit, Triphala, digestion, women&rsquo;s and men&rsquo;s
            health, and personalised Ayurvedic living — structured across {PILLARS.length} pillars and
            reviewed by {`Dr. Kashish Gupta, BAMS`}.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}
          >
            <Search size={18} color={TAUPE} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides & answers — e.g. fulvic acid, dosage, PCOS…"
              aria-label="Search the knowledge center"
              style={{
                width: "100%",
                padding: "16px 20px 16px 52px",
                borderRadius: 999,
                border: "1px solid rgba(68,42,27,.16)",
                background: "#fff",
                fontFamily: F,
                fontSize: 15,
                color: INK,
                outline: "none",
                boxShadow: "0 8px 24px rgba(68,42,27,.06)",
              }}
            />
          </motion.div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(20px,4vw,56px)", marginTop: "clamp(32px,4vw,48px)" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontVariationSettings: "'wght' 800", fontSize: "clamp(28px,4vw,42px)", color: GOLD_DARK, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: TAUPE, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────────── */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px" }}>
        <style dangerouslySetInnerHTML={{ __html: `
.kc-pillar{transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease,border-color .35s ease;position:relative;overflow:hidden;}
.kc-pillar::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--kc-accent);opacity:.9;}
.kc-pillar:hover{transform:translateY(-6px);box-shadow:0 24px 54px rgba(68,42,27,.15);border-color:var(--kc-accent);}
.kc-pillar:hover .kc-ic{transform:scale(1.08) rotate(-5deg);}
.kc-ic{transition:transform .35s cubic-bezier(.16,1,.3,1);}
` }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHead
            icon={BookOpen}
            eyebrow="Browse by pillar"
            title="Explore the library"
            sub="A hub-and-spoke system: each pillar is a topic cluster of connected, cross-linked guides."
          />

          {/* Cluster tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", margin: "0 0 clamp(32px,4vw,48px)" }}>
            {(["All", ...CLUSTERS.map((c) => c.key)] as (Cluster | "All")[]).map((key) => {
              const active = cluster === key;
              const label = key === "All" ? "All topics" : CLUSTERS.find((c) => c.key === key)!.label;
              return (
                <button
                  key={key}
                  onClick={() => setCluster(key)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: `1px solid ${active ? GOLD : "rgba(68,42,27,.16)"}`,
                    background: active ? GOLD : "transparent",
                    color: active ? "#fff" : INK,
                    fontFamily: F,
                    fontVariationSettings: "'wght' 600",
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all .25s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {visiblePillars.length === 0 ? (
            <p style={{ textAlign: "center", color: TAUPE }}>No guides match &ldquo;{q}&rdquo;. Try a broader term.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "clamp(16px,2vw,24px)" }}>
              {visiblePillars.map((p) => {
                const guides = guidesByPillar[p.pillar] ?? [];
                const isOpen = autoOpen || openPillar === p.pillar;
                const meta = CLUSTER_META[p.cluster];
                const Icon = meta.icon;
                return (
                  <div
                    key={p.pillar}
                    className="kc-pillar"
                    style={{
                      ["--kc-accent"]: meta.color,
                      background: "linear-gradient(180deg,#ffffff 0%,#fdfaf2 100%)",
                      border: "1px solid rgba(68,42,27,.1)",
                      borderRadius: 22,
                      padding: "clamp(24px,2.6vw,32px)",
                      boxShadow: "0 8px 22px rgba(68,42,27,.06)",
                    } as CSSProperties}
                  >
                    <button
                      onClick={() => setOpenPillar(isOpen && !autoOpen ? null : p.pillar)}
                      aria-expanded={isOpen}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: F, color: INK }}
                    >
                      <span className="kc-ic" style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg, ${meta.color}26, ${meta.color}0d)`, border: `1px solid ${meta.color}33`, display: "grid", placeItems: "center" }}>
                        <Icon size={24} color={meta.color} strokeWidth={1.9} />
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontVariationSettings: "'wght' 700", fontSize: 18 }}>{p.pillar}</span>
                          <ChevronDown size={18} color={TAUPE} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .3s ease", flexShrink: 0 }} />
                        </span>
                        <span style={{ display: "block", fontSize: 13.5, color: TAUPE, lineHeight: 1.5, marginTop: 6 }}>{p.blurb}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: meta.color, fontVariationSettings: "'wght' 700", background: `${meta.color}14`, borderRadius: 999, padding: "5px 12px" }}>
                          {guides.length} {guides.length === 1 ? "guide" : "guides"}
                        </span>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ listStyle: "none", margin: "18px 0 0", padding: "18px 0 0", borderTop: "1px solid rgba(68,42,27,.08)", overflow: "hidden" }}
                        >
                          {guides.map((g) => (
                            <li key={g.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(68,42,27,.05)" }}>
                              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                <span style={{ fontVariationSettings: "'wght' 600", fontSize: 14.5, lineHeight: 1.4, color: INK }}>{g.title}</span>
                                {g.priority === "P1" && (
                                  <span style={{ flexShrink: 0, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: GOLD_DARK, border: `1px solid ${GOLD}55`, borderRadius: 5, padding: "1px 6px", fontVariationSettings: "'wght' 700" }}>Start here</span>
                                )}
                              </div>
                              <p style={{ fontSize: 12.5, color: TAUPE, lineHeight: 1.5, margin: "4px 0 0" }}>{g.metaDesc}</p>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ Library ──────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(180deg,#fff 0%,#fbf6ea 100%)", padding: "clamp(48px,6vw,88px) 24px", borderTop: "1px solid rgba(68,42,27,.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHead
            icon={Sparkles}
            eyebrow="Answer engine"
            title="Ask Ayurveda anything"
            sub={`${FAQS.length} concise, doctor-reviewed answers — structured for search engines and AI assistants.`}
          />

          {/* Topic chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: "clamp(28px,3.5vw,40px)" }}>
            {FAQ_TOPICS.map((t) => {
              const active = faqTopic === t;
              return (
                <button
                  key={t}
                  onClick={() => { setFaqTopic(t); setFaqLimit(24); }}
                  style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${active ? GOLD : "rgba(68,42,27,.16)"}`, background: active ? GOLD : "#fff", color: active ? "#fff" : INK, fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 13, cursor: "pointer", transition: "all .25s ease" }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: TAUPE, marginBottom: 20 }}>
            {faqs.length} {faqs.length === 1 ? "answer" : "answers"}
            {(query || faqTopic !== "All") ? " match your filter" : " in the library"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.slice(0, faqLimit).map((f) => (
              <FaqRow key={f.id} q={f.q} a={f.a} category={f.category} />
            ))}
          </div>

          {faqs.length > faqLimit && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={() => setFaqLimit((n) => n + 24)}
                style={{ padding: "13px 28px", borderRadius: 999, border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DARK, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 14, cursor: "pointer" }}
              >
                Show more answers
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Trust footer ─────────────────────────────────────── */}
      <section style={{ padding: "clamp(40px,5vw,64px) 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: TAUPE, fontSize: 13.5, lineHeight: 1.6 }}>
          <ShieldCheck size={20} color={GOLD} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <span>
            Every health page is reviewed against classical texts and current literature by
            <strong style={{ color: INK, fontVariationSettings: "'wght' 700" }}> Dr. Kashish Gupta, BAMS</strong>. Educational content — not a substitute for personalised medical advice.
          </span>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, eyebrow, title, sub }: { icon: LucideIcon; eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "clamp(28px,3.5vw,44px)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD_DARK, marginBottom: 12 }}>
        <Icon size={16} strokeWidth={1.8} />
        <span style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", fontVariationSettings: "'wght' 700" }}>{eyebrow}</span>
      </div>
      <h2 style={{ fontVariationSettings: "'wght' 800", fontSize: "clamp(26px,3.5vw,40px)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>{title}</h2>
      <p style={{ fontSize: "clamp(14px,1.6vw,17px)", color: TAUPE, lineHeight: 1.6, maxWidth: "56ch", margin: "0 auto" }}>{sub}</p>
    </div>
  );
}

function FaqRow({ q, a, category }: { q: string; a: string; category: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(68,42,27,.1)", borderRadius: 16, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, width: "100%", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: F, color: INK }}
      >
        <span style={{ fontVariationSettings: "'wght' 600", fontSize: 15.5, lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={18} color={TAUPE} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease", flexShrink: 0 }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 22px 20px" }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#5a4636", margin: 0 }}>{a}</p>
              <span style={{ display: "inline-block", marginTop: 12, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: TAUPE }}>{category}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
