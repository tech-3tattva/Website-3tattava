"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const GOLD = "#C8963E";
const GOLD_DARK = "#A67B2F";
const GOLD_SOFT = "#E4C079";
const GOLD_GRAD = `linear-gradient(105deg,${GOLD_DARK},${GOLD_SOFT},${GOLD},${GOLD_DARK})`;
const CREAM = "#f7f0e2";
const TAUPE = "#b7a392";
const INK = "#1c1304";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 22 };

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  readTime: string;
  tag: string;
  reviewed?: boolean;
  startHere?: boolean;
}

const PILLAR_DATA: {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  articles: Article[];
}[] = [
  {
    id: "performance-ayurveda",
    label: "Performance Ayurveda",
    icon: "⚡",
    tagline: "Ancient system. Modern outcome.",
    articles: [
      {
        slug: "what-is-performance-ayurveda",
        title: "What Is Performance Ayurveda™?",
        subtitle: "Balance · Build · Become",
        excerpt: "A philosophy that bridges classical Ayurvedic medicine with modern performance science. Not wellness as aesthetics — wellness as function.",
        readTime: "6 min",
        tag: "Philosophy",
        reviewed: true,
        startHere: true,
      },
      {
        slug: "ayurveda-beyond-disease-management",
        title: "Ayurveda Beyond Disease Management",
        subtitle: "Ancient System, Modern Purpose",
        excerpt: "Classical Ayurveda was never designed only for the sick. It was designed for the optimiser. Here is what that means in practice.",
        readTime: "8 min",
        tag: "Philosophy",
        reviewed: true,
      },
      {
        slug: "balance-build-become-explained",
        title: "Balance · Build · Become Explained",
        subtitle: "The 3TATTAVA Framework",
        excerpt: "Three words. One protocol. The framework behind every product, formulation, and recommendation we make — unpacked.",
        readTime: "7 min",
        tag: "Framework",
        reviewed: true,
        startHere: true,
      },
      {
        slug: "ancient-wisdom-modern-lifestyles",
        title: "Ancient Wisdom for Modern Lifestyles",
        subtitle: "Adapting Classical Protocols",
        excerpt: "Adapting 2,000-year-old Ayurvedic rituals for the urban athlete. What translates, what doesn't, and what Dr. Kashish changed.",
        readTime: "5 min",
        tag: "Ritual",
        reviewed: true,
      },
    ],
  },
  {
    id: "shilajit-science",
    label: "Shilajit Science",
    icon: "🔬",
    tagline: "19 evidence-backed topics.",
    articles: [
      {
        slug: "what-is-shilajit",
        title: "What Is Shilajit?",
        subtitle: "The Science Behind the Mineral Pitch",
        excerpt: "Fulvic acid, 80+ ionic trace minerals, Asphaltum Punjabanum. Why this resin has been the cornerstone of classical Ayurveda for centuries — and what modern research confirms.",
        readTime: "7 min",
        tag: "Foundation",
        reviewed: true,
        startHere: true,
      },
      {
        slug: "how-shilajit-is-formed",
        title: "How Shilajit Is Formed",
        subtitle: "300 Years in the Making",
        excerpt: "Centuries of compression, decomposition, and mineral accumulation at high altitude. The geological process behind the mineral pitch.",
        readTime: "5 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "what-shilajit-does",
        title: "What Shilajit Does",
        subtitle: "Cellular Energy & Mineral Transport",
        excerpt: "Fulvic acid carries trace minerals across cell membranes directly into the mitochondria. Here is the mechanism — not the marketing.",
        readTime: "8 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "what-is-fulvic-acid",
        title: "What Is Fulvic Acid?",
        subtitle: "The Carrier Molecule That Changes Everything",
        excerpt: "Fulvic acid isn't just a buzzword. It is the electrolyte transporter that moves trace minerals across cell membranes. Why ≥60% is the benchmark.",
        readTime: "6 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "trace-minerals-explained",
        title: "80+ Trace Minerals in Shilajit",
        subtitle: "What They Are and Why They Matter",
        excerpt: "Iron, zinc, magnesium, copper, selenium — and 76 more. Why mineral-depleted modern diets make Shilajit more relevant than ever.",
        readTime: "6 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "shilajit-for-women",
        title: "Shilajit for Women",
        subtitle: "Iron, Hormones & Cellular Energy",
        excerpt: "The most underreported use of Shilajit in India. Iron-deficiency anaemia affects 57% of Indian women. Here is what clinical literature says.",
        readTime: "9 min",
        tag: "Women's Health",
        reviewed: true,
      },
      {
        slug: "is-shilajit-safe",
        title: "Is Shilajit Safe?",
        subtitle: "What You Need to Know Before Starting",
        excerpt: "Purity, heavy metals, and purification matter more than source claims. The difference between raw and Shodhit (purified) Shilajit — and why it is non-negotiable.",
        readTime: "7 min",
        tag: "Safety",
        reviewed: true,
      },
      {
        slug: "shilajit-resin-vs-capsules-vs-powder",
        title: "Resin vs Capsules vs Powder",
        subtitle: "Which Form of Shilajit Is Most Effective?",
        excerpt: "The format you choose determines bioavailability. Resin is the classical, unprocessed form — here is why that matters and what the research shows.",
        readTime: "8 min",
        tag: "Comparison",
        reviewed: true,
      },
      {
        slug: "how-to-take-shilajit",
        title: "How to Take Shilajit",
        subtitle: "Dosage, Timing & Anupana",
        excerpt: "300–500mg of purified Shilajit resin, dissolved in warm milk or water. The Anupana (carrier) you choose changes the outcome.",
        readTime: "5 min",
        tag: "Ritual",
        reviewed: true,
      },
      {
        slug: "shilajit-honey-sticks-india",
        title: "Shilajit + Honey: The Anupana Advantage",
        subtitle: "Why We Built Shahjeet Sticks",
        excerpt: "Honey is one of Ayurveda's most powerful Anupana — a carrier that amplifies mineral absorption. The science and formulation philosophy behind Shahjeet.",
        readTime: "5 min",
        tag: "Product Science",
        reviewed: true,
      },
      {
        slug: "why-purification-matters",
        title: "Why Purification Matters",
        subtitle: "Shodhit vs Raw — A Clinical View",
        excerpt: "Raw Shilajit contains heavy metals and organic impurities. Classical Shodhan (purification) is not optional — it is what makes Shilajit medicine.",
        readTime: "7 min",
        tag: "Safety",
        reviewed: true,
        startHere: true,
      },
      {
        slug: "triphala-purification-vs-water",
        title: "Triphala Purification vs Water Purification",
        subtitle: "Classical Methods Compared",
        excerpt: "Why 3TATTAVA uses classical Triphala Shodhan over modern water purification — and what each method removes (and leaves behind).",
        readTime: "8 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "himalayan-sourcing",
        title: "Himalayan Sourcing at 16,000ft",
        subtitle: "Why Altitude and Geography Matter",
        excerpt: "Not all Himalayan Shilajit is equal. Altitude, geology, and biodiversity at the source determine mineral density. Our sourcing standard — explained.",
        readTime: "6 min",
        tag: "Foundation",
        reviewed: true,
      },
      {
        slug: "how-3tattava-is-different",
        title: "How 3TATTAVA Is Different",
        subtitle: "The Six-Layer Testing Protocol",
        excerpt: "NABL lab testing, AYUSH-GMP certification, US-FDA registered facility, classical Triphala Shodhan, Himalayan sourcing, batch-level COA. Six layers. Not one.",
        readTime: "6 min",
        tag: "Comparison",
        reviewed: true,
      },
      {
        slug: "shilajit-with-creatine",
        title: "Shilajit + Creatine Stack",
        subtitle: "Performance Combination Science",
        excerpt: "Two clinically studied ergogenic aids — different mechanisms, potentially additive effects. What the research says and how to stack them intelligently.",
        readTime: "7 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "shilajit-for-hypertensive-patients",
        title: "Shilajit for Hypertensive Patients",
        subtitle: "Clinical Considerations & Contraindications",
        excerpt: "High blood pressure is not an automatic contraindication — but dose, form, and monitoring matter. Dr. Kashish on clinical protocol.",
        readTime: "8 min",
        tag: "Clinical",
        reviewed: true,
      },
      {
        slug: "shilajit-research-papers",
        title: "Shilajit Research Papers: A Reading Guide",
        subtitle: "Navigating the Clinical Literature",
        excerpt: "A curated guide to the most significant clinical studies on Shilajit — what they studied, what they found, and how to read them critically.",
        readTime: "10 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "shilajit-side-effects",
        title: "Shilajit Side Effects",
        subtitle: "Understanding the Literature Honestly",
        excerpt: "Every compound has a safety profile. Shilajit's known side effects, who should avoid it, and how purification eliminates the most serious risks.",
        readTime: "6 min",
        tag: "Safety",
        reviewed: true,
      },
      {
        slug: "shilajit-for-diabetic-patients",
        title: "Shilajit & Glucose Metabolism",
        subtitle: "Fulvic Acid and Insulin Sensitivity",
        excerpt: "Preliminary research suggests fulvic acid may influence glucose uptake. What the studies actually say — and what remains unproven.",
        readTime: "8 min",
        tag: "Clinical",
        reviewed: true,
      },
    ],
  },
  {
    id: "recovery",
    label: "Recovery",
    icon: "🌙",
    tagline: "You don't grow during training. You grow during recovery.",
    articles: [
      {
        slug: "recovery-vs-rest",
        title: "Recovery vs Rest",
        subtitle: "Not the Same Thing",
        excerpt: "Passive rest stops the breakdown. Active recovery accelerates the rebuild. Understanding the difference is the gap between plateau and progress.",
        readTime: "6 min",
        tag: "Foundation",
        reviewed: true,
      },
      {
        slug: "why-modern-people-feel-exhausted",
        title: "Why Modern People Feel Exhausted",
        subtitle: "Mineral Depletion & Lifestyle Load",
        excerpt: "Urban lifestyles, processed food, and chronic low-grade stress create a mineral deficit that no amount of sleep fully resolves. Dr. Kashish on the clinical pattern.",
        readTime: "7 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "sleep-and-athletic-performance",
        title: "Sleep & Athletic Performance",
        subtitle: "Recovery Starts Before You Close Your Eyes",
        excerpt: "Growth hormone, cortisol, muscle protein synthesis — all regulated during deep sleep. The evidence for sleep as the most underused performance lever.",
        readTime: "8 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "recovery-habits-that-work",
        title: "Recovery Habits That Actually Work",
        subtitle: "Evidence vs Ritual",
        excerpt: "Separating evidence-based recovery protocols from wellness theatre. What clinical research confirms — and what is just expensive placebo.",
        readTime: "7 min",
        tag: "Framework",
        reviewed: true,
      },
    ],
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: "🌿",
    tagline: "Eat by your Prakriti. Perform by your protocol.",
    articles: [
      {
        slug: "ayurvedic-nutrition",
        title: "Ayurvedic Nutrition",
        subtitle: "Eating by Prakriti",
        excerpt: "Ayurvedic nutrition is not a diet plan. It is a framework for understanding how your constitution responds to food — and optimising accordingly.",
        readTime: "8 min",
        tag: "Philosophy",
        reviewed: true,
      },
      {
        slug: "daily-food-habits-for-performance",
        title: "Daily Food Habits That Support Performance",
        subtitle: "A Practical Ayurvedic Framework",
        excerpt: "Dr. Falguni Chauhan's evidence-backed daily food framework: what to eat, when to eat, and why the timing matters as much as the food.",
        readTime: "7 min",
        tag: "Ritual",
        reviewed: true,
      },
      {
        slug: "gut-health-and-mineral-absorption",
        title: "Gut Health & Mineral Absorption",
        subtitle: "Why Your Gut Is Your Engine",
        excerpt: "Compromised gut lining = compromised mineral absorption. Why the best supplement in the world fails without gut integrity — and how to build it.",
        readTime: "9 min",
        tag: "Science",
        reviewed: true,
      },
      {
        slug: "energy-supporting-foods",
        title: "Energy-Supporting Foods",
        subtitle: "What Amplifies Shilajit's Effects",
        excerpt: "Certain foods enhance the bioavailability of Shilajit's fulvic acid. A practical guide to building meals that work with — not against — your supplementation.",
        readTime: "6 min",
        tag: "Science",
        reviewed: true,
      },
    ],
  },
  {
    id: "athlete-mindset",
    label: "Athlete Mindset",
    icon: "🧠",
    tagline: "The body follows the mind. Build both.",
    articles: [
      {
        slug: "discipline-is-not-motivation",
        title: "Discipline Is Not Motivation",
        subtitle: "Building the Long Game",
        excerpt: "Motivation is a feeling. Discipline is a decision. The difference between athletes who perform for 12 weeks and those who perform for 12 years.",
        readTime: "6 min",
        tag: "Mindset",
      },
      {
        slug: "resilience-in-training",
        title: "Resilience in Training",
        subtitle: "The Ayurvedic Perspective on Stress",
        excerpt: "Classical Ayurveda has a nuanced view of stress — some builds; some destroys. How to train the nervous system to distinguish between the two.",
        readTime: "7 min",
        tag: "Framework",
        reviewed: true,
      },
      {
        slug: "consistency-over-intensity",
        title: "Consistency Over Intensity",
        subtitle: "Mona Agarwal on Showing Up Every Day",
        excerpt: "WTF-certified trainer and 3TATTAVA founding athlete Mona Agarwal on what changed when she stopped optimising for peak days and started building unbreakable baselines.",
        readTime: "8 min",
        tag: "Story",
      },
      {
        slug: "mental-strength-and-recovery",
        title: "Mental Strength & Recovery",
        subtitle: "The Mind-Body Protocol",
        excerpt: "Perceived effort, recovery markers, and the neurological dimension of physical performance. Why mental training is physiologically inseparable from physical recovery.",
        readTime: "7 min",
        tag: "Ritual",
        reviewed: true,
      },
    ],
  },
];

const START_HERE = [
  {
    slug: "what-is-performance-ayurveda",
    title: "What Is Performance Ayurveda™?",
    tag: "Philosophy",
    readTime: "6 min",
    excerpt: "The foundational philosophy that drives every product, protocol, and partnership at 3TATTAVA.",
  },
  {
    slug: "why-purification-matters",
    title: "Why We Use Triphala Purification",
    tag: "Science",
    readTime: "8 min",
    excerpt: "Classical Shodhan over modern water purification. The clinical reason — not the marketing version.",
  },
  {
    slug: "what-is-shilajit",
    title: "Shilajit: Beyond The Hype",
    tag: "Foundation",
    readTime: "7 min",
    excerpt: "Fulvic acid, ionic trace minerals, Asphaltum Punjabanum. What research actually confirms — and what is still overstated.",
  },
  {
    slug: "balance-build-become-explained",
    title: "Balance · Build · Become Explained",
    tag: "Framework",
    readTime: "7 min",
    excerpt: "Three words. The complete framework behind every decision 3TATTAVA makes.",
  },
];

const PODCAST_EPISODES = [
  {
    ep: "EP 01",
    title: "Why I Built 3TATTAVA",
    guest: "Dr. Kashish Gupta, BAMS",
    guestType: "Doctor",
    desc: "On 90 days of personal clinical documentation, mineral depletion in urban India, and why Performance Ayurveda™ had to exist.",
    duration: "38 min",
    initial: "K",
  },
  {
    ep: "EP 02",
    title: "What It Takes to Show Up Every Day",
    guest: "Mona Agarwal",
    guestType: "Athlete",
    desc: "3TATTAVA's founding athlete on consistency, recovery, and what changed in her training when she stopped chasing motivation and started building discipline.",
    duration: "44 min",
    initial: "M",
  },
  {
    ep: "EP 03",
    title: "Nutrition, Prakriti & The Performance Diet",
    guest: "Dr. Falguni Chauhan, BAMS",
    guestType: "Doctor",
    desc: "Performance dietician and Ayurvedic physician Dr. Falguni on how Prakriti determines nutritional needs — and why generic meal plans fail most athletes.",
    duration: "41 min",
    initial: "F",
  },
];

// ─── Micro Components ─────────────────────────────────────────────────────────

function KcBg() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes kc-spin { to { transform: rotate(360deg); } }
        @keyframes kc-ccw { to { transform: rotate(-360deg); } }
        @keyframes kc-float {
          0%,100% { transform: translateY(0px) translateX(0px); opacity:.55; }
          33% { transform: translateY(-18px) translateX(8px); opacity:.75; }
          66% { transform: translateY(10px) translateX(-6px); opacity:.45; }
        }
        @keyframes kc-pulse { 0%,100%{opacity:.35} 50%{opacity:.65} }
      `}</style>
      {/* Rotating mandala rings */}
      <svg
        viewBox="0 0 500 500"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "clamp(400px,80vw,700px)",
          height: "clamp(400px,80vw,700px)",
          opacity: 0.06,
          animation: "kc-spin 60s linear infinite",
        }}
      >
        {[220, 170, 120, 70].map((r, i) => (
          <circle key={i} cx={250} cy={250} r={r}
            fill="none" stroke={GOLD}
            strokeWidth={i % 2 === 0 ? "0.8" : "1.2"}
            strokeDasharray={i % 2 === 0 ? "4 12" : "8 20"}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return <line key={i} x1={250} y1={250}
            x2={250 + 220 * Math.cos(a)} y2={250 + 220 * Math.sin(a)}
            stroke={GOLD} strokeWidth="0.4" opacity="0.6"
          />;
        })}
      </svg>
      {/* Counter-rotating inner ring */}
      <svg
        viewBox="0 0 300 300"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "clamp(200px,40vw,380px)",
          height: "clamp(200px,40vw,380px)",
          opacity: 0.05,
          animation: "kc-ccw 40s linear infinite",
        }}
      >
        {[130, 95, 60].map((r, i) => (
          <circle key={i} cx={150} cy={150} r={r}
            fill="none" stroke={GOLD}
            strokeWidth="1" strokeDasharray={`${6 + i * 4} ${14 + i * 6}`}
          />
        ))}
      </svg>
      {/* Floating particles */}
      {[
        { top: "15%", left: "8%", size: 6, delay: "0s" },
        { top: "70%", left: "6%", size: 4, delay: "1.4s" },
        { top: "30%", right: "7%", size: 5, delay: "0.7s" },
        { top: "80%", right: "10%", size: 7, delay: "2.1s" },
        { top: "50%", left: "50%", size: 3, delay: "1s" },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: (p as any).left,
            right: (p as any).right,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: GOLD_GRAD,
            animation: `kc-float 6s ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function TagBadge({ label }: { label: string }) {
  const tagColors: Record<string, string> = {
    Foundation: "#6B5D43",
    Philosophy: "#5C4D7A",
    "Women's Health": "#7A4D5C",
    Comparison: "#4D6B5C",
    Ritual: "#6B4D43",
    Science: "#435E6B",
    Clinical: "#436B5C",
    Safety: "#6B5643",
    Framework: "#4D6B7A",
    Mindset: "#5C6B4D",
    Story: "#7A5C4D",
    "Product Science": "#6B6B43",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 4,
        background: `${tagColors[label] ?? "#6B5D43"}18`,
        border: `1px solid ${tagColors[label] ?? "#6B5D43"}30`,
        color: tagColors[label] ?? "#6B5D43",
        fontSize: 10,
        fontVariationSettings: "'wdth' 75, 'wght' 600",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function ReviewedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 4,
        background: "rgba(74,143,74,0.08)",
        border: "1px solid rgba(74,143,74,0.25)",
        color: "#2E7D2E",
        fontSize: 10,
        fontVariationSettings: "'wdth' 75, 'wght' 600",
        letterSpacing: "0.08em",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <circle cx="4" cy="4" r="3.5" fill="#2E7D2E" opacity="0.15" />
        <path d="M2.5 4L3.5 5L5.5 3" stroke="#2E7D2E" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Dr. Kashish Reviewed
    </span>
  );
}

function ArticleCard({ article, idx }: { article: Article; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#ffffff",
        borderRadius: 12,
        padding: "22px 22px 20px",
        border: "1px solid rgba(183,163,146,0.25)",
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? "0 12px 40px rgba(28,19,4,0.10)"
          : "0 2px 8px rgba(28,19,4,0.04)",
        borderColor: hovered ? `rgba(200,150,62,0.3)` : "rgba(183,163,146,0.25)",
        overflow: "hidden",
      }}
    >
      {/* Gold left border that slides in on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: GOLD_GRAD,
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          borderRadius: "4px 0 0 4px",
        }}
      />

      <Link href={`/education/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        {/* Top badges row */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <TagBadge label={article.tag} />
          {article.reviewed && <ReviewedBadge />}
        </div>

        {/* Title */}
        <h3
          style={{
            fontVariationSettings: "'wdth' 85, 'wght' 700",
            fontSize: 16,
            lineHeight: 1.3,
            color: INK,
            marginBottom: 4,
            transition: "color 0.2s ease",
          }}
        >
          {article.title}
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontVariationSettings: "'wdth' 75, 'wght' 500",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 10,
          }}
        >
          {article.subtitle}
        </p>

        {/* Excerpt */}
        <p
          style={{
            fontVariationSettings: "'wdth' 100, 'wght' 300",
            fontSize: 13.5,
            lineHeight: 1.65,
            color: "rgba(28,19,4,0.65)",
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontVariationSettings: "'wdth' 75, 'wght' 500",
              color: TAUPE,
              letterSpacing: "0.05em",
            }}
          >
            {article.readTime} read
          </span>
          <motion.span
            animate={{ x: hovered ? 3 : 0 }}
            transition={SPRING}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontVariationSettings: "'wdth' 75, 'wght' 600",
              color: GOLD,
              letterSpacing: "0.05em",
            }}
          >
            Read
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3.5L9 6l-2.5 2.5" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

function PopBtn({
  children,
  href,
  onClick,
  variant = "gold",
  style: extStyle,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "gold" | "ghost" | "ink";
  style?: React.CSSProperties;
}) {
  const styles: Record<string, React.CSSProperties> = {
    gold: {
      background: GOLD_GRAD,
      backgroundSize: "200% 100%",
      color: "#fff",
      border: "none",
    },
    ghost: {
      background: "transparent",
      color: GOLD,
      border: `1.5px solid ${GOLD}`,
    },
    ink: {
      background: INK,
      color: CREAM,
      border: "none",
    },
  };

  const base: React.CSSProperties = {
    ...styles[variant],
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 6,
    fontSize: 13,
    fontVariationSettings: "'wdth' 75, 'wght' 600",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    textDecoration: "none",
    ...extStyle,
  };

  const content = href ? (
    <Link href={href} style={base}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} style={base}>
      {children}
    </button>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      style={{ display: "inline-block" }}
    >
      {content}
    </motion.div>
  );
}

function PodcastCard({ ep, idx }: { ep: typeof PODCAST_EPISODES[0]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  const guestTypeColor: Record<string, string> = {
    Doctor: "#2E7D2E",
    Athlete: "#7A4D43",
    Coach: "#435E6B",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: "28px 24px",
        border: "1px solid rgba(183,163,146,0.25)",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered
          ? "0 16px 50px rgba(28,19,4,0.09)"
          : "0 2px 8px rgba(28,19,4,0.04)",
      }}
    >
      {/* Guest type badge */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 4,
            fontSize: 10,
            fontVariationSettings: "'wdth' 75, 'wght' 600",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: `${guestTypeColor[ep.guestType] ?? "#6B5D43"}12`,
            border: `1px solid ${guestTypeColor[ep.guestType] ?? "#6B5D43"}30`,
            color: guestTypeColor[ep.guestType] ?? "#6B5D43",
          }}
        >
          {ep.guestType}
        </span>
        <span
          style={{
            fontSize: 11,
            fontVariationSettings: "'wdth' 75, 'wght' 500",
            color: TAUPE,
          }}
        >
          {ep.duration}
        </span>
      </div>

      {/* Episode label */}
      <p
        style={{
          fontSize: 11,
          fontVariationSettings: "'wdth' 75, 'wght' 600",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 6,
        }}
      >
        {ep.ep}
      </p>

      <h3
        style={{
          fontVariationSettings: "'wdth' 85, 'wght' 700",
          fontSize: 18,
          lineHeight: 1.3,
          color: INK,
          marginBottom: 8,
        }}
      >
        {ep.title}
      </h3>

      <p
        style={{
          fontSize: 12,
          fontVariationSettings: "'wdth' 75, 'wght' 600",
          color: TAUPE,
          marginBottom: 12,
          letterSpacing: "0.04em",
        }}
      >
        with {ep.guest}
      </p>

      <p
        style={{
          fontSize: 13.5,
          fontVariationSettings: "'wdth' 100, 'wght' 300",
          color: "rgba(28,19,4,0.62)",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {ep.desc}
      </p>

      {/* Play button */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING}
          onClick={() => setPlaying(!playing)}
          style={{
            position: "relative",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: GOLD_GRAD,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Pulsing ring on hover */}
          {hovered && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `1.5px solid ${GOLD}`,
              }}
            />
          )}
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3.5" y="3" width="3" height="10" rx="1" fill="#fff" />
              <rect x="9.5" y="3" width="3" height="10" rx="1" fill="#fff" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="#fff" />
            </svg>
          )}
        </motion.button>

        <div>
          <p style={{ fontSize: 12, fontVariationSettings: "'wdth' 75, 'wght' 600", color: INK, marginBottom: 2 }}>
            {playing ? "Now Playing" : "Listen Now"}
          </p>
          <p style={{ fontSize: 11, color: TAUPE, fontVariationSettings: "'wdth' 75, 'wght' 400" }}>
            Coming Soon · Subscribe to be notified
          </p>
        </div>
      </div>

      {/* Guest avatar */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: GOLD_GRAD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontVariationSettings: "'wdth' 85, 'wght' 700",
          color: "#fff",
        }}
      >
        {ep.initial}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KnowledgeCenterClient() {
  const [activePillar, setActivePillar] = useState("shilajit-science");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentPillar = PILLAR_DATA.find((p) => p.id === activePillar)!;

  const pillarsRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        fontFamily: "var(--font-primary), system-ui, sans-serif",
        background: CREAM,
        color: INK,
        overflowX: "hidden",
      }}
    >
      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: "#fff",
          padding: "80px 24px 72px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <KcBg />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 10,
              fontVariationSettings: "'wdth' 75, 'wght' 600",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 16,
            }}
          >
            Performance Ayurveda™ · Knowledge Center
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontVariationSettings: "'wdth' 85, 'wght' 800",
              fontSize: "clamp(32px, 6vw, 60px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: INK,
              marginBottom: 20,
            }}
          >
            The Goal Is Not To Sell More Products.{" "}
            <span
              style={{
                background: GOLD_GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Goal Is To Create Better Decisions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            style={{
              fontVariationSettings: "'wdth' 100, 'wght' 300",
              fontSize: "clamp(15px, 2vw, 17px)",
              color: "rgba(28,19,4,0.62)",
              maxWidth: 520,
              margin: "0 auto 36px",
              lineHeight: 1.65,
            }}
          >
            Evidence-backed articles reviewed by Dr. Kashish Gupta, BAMS.
            Updated continuously.
          </motion.p>

          {/* Start Here quick pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 0,
            }}
          >
            {[
              { label: "What Is Performance Ayurveda", slug: "what-is-performance-ayurveda" },
              { label: "Shilajit: Beyond The Hype", slug: "what-is-shilajit" },
              { label: "Triphala Purification", slug: "why-purification-matters" },
              { label: "Balance · Build · Become", slug: "balance-build-become-explained" },
            ].map((item, i) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28 + i * 0.06 }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={`/education/${item.slug}`}
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: `rgba(200,150,62,0.08)`,
                    border: `1px solid rgba(200,150,62,0.28)`,
                    color: GOLD_DARK,
                    fontSize: 12,
                    fontVariationSettings: "'wdth' 75, 'wght' 600",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.label} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Decorative gold strip */}
      <div
        style={{
          height: 3,
          background: GOLD_GRAD,
          backgroundSize: "200% 100%",
        }}
      />

      {/* ─── PILLAR NAVIGATION ─────────────────────────────────────────────── */}
      <section ref={pillarsRef} style={{ background: "#fff" }}>
        {/* Tab bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            borderBottom: "1px solid rgba(183,163,146,0.2)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 0,
              minWidth: "max-content",
            }}
          >
            {PILLAR_DATA.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(p.id)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "18px 22px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-primary), system-ui, sans-serif",
                  fontSize: 13,
                  fontVariationSettings:
                    activePillar === p.id
                      ? "'wdth' 85, 'wght' 700"
                      : "'wdth' 85, 'wght' 500",
                  color: activePillar === p.id ? INK : TAUPE,
                  transition: "color 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 15 }}>{p.icon}</span>
                {p.label}
                {/* Animated gold underline */}
                {activePillar === p.id && (
                  <motion.div
                    layoutId="pillar-underline"
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: GOLD_GRAD,
                      backgroundSize: "200% 100%",
                      borderRadius: 2,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar headline + article grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 64px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pillar intro */}
              <div style={{ marginBottom: 36 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontVariationSettings: "'wdth' 75, 'wght' 600",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: GOLD,
                    marginBottom: 8,
                  }}
                >
                  {currentPillar.icon} {currentPillar.label}
                </p>
                <p
                  style={{
                    fontVariationSettings: "'wdth' 100, 'wght' 300",
                    fontSize: "clamp(15px, 2vw, 18px)",
                    color: "rgba(28,19,4,0.60)",
                    fontStyle: "italic",
                  }}
                >
                  {currentPillar.tagline}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: TAUPE,
                    fontVariationSettings: "'wdth' 75, 'wght' 500",
                    marginTop: 6,
                  }}
                >
                  {currentPillar.articles.length} articles
                </p>
              </div>

              {/* Article grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {currentPillar.articles.map((article, i) => (
                  <ArticleCard key={article.slug} article={article} idx={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── START HERE ────────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              style={{
                fontSize: 10,
                fontVariationSettings: "'wdth' 75, 'wght' 600",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 12,
              }}
            >
              Your Entry Point
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06, duration: 0.5 }}
              style={{
                fontVariationSettings: "'wdth' 85, 'wght' 800",
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.02em",
                color: INK,
                lineHeight: 1.1,
              }}
            >
              Start Here
            </motion.h2>
          </div>

          {/* 2×2 featured cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {START_HERE.map((item, i) => (
              <StartHereCard key={item.slug} item={item} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PODCAST HUB ───────────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: 10,
                fontVariationSettings: "'wdth' 75, 'wght' 600",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 12,
              }}
            >
              Listen & Learn
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              style={{
                fontVariationSettings: "'wdth' 85, 'wght' 800",
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.02em",
                color: INK,
                marginBottom: 12,
              }}
            >
              Conversations Worth Your Hour
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              style={{
                fontSize: 15,
                fontVariationSettings: "'wdth' 100, 'wght' 300",
                color: "rgba(28,19,4,0.58)",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Athletes, doctors, coaches, and founders on performance, Ayurveda, and the long game.
            </motion.p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {PODCAST_EPISODES.map((ep, i) => (
              <div key={ep.ep} style={{ position: "relative" }}>
                <PodcastCard ep={ep} idx={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─────────────────────────────────────────────────────── */}
      <section
        ref={newsletterRef}
        style={{
          background: CREAM,
          padding: "80px 24px 72px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 10,
              fontVariationSettings: "'wdth' 75, 'wght' 600",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 12,
            }}
          >
            Knowledge Circle
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            style={{
              fontVariationSettings: "'wdth' 85, 'wght' 800",
              fontSize: "clamp(26px, 4vw, 40px)",
              letterSpacing: "-0.02em",
              color: INK,
              marginBottom: 14,
            }}
          >
            Join The Performance Ayurveda Circle
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 15,
              fontVariationSettings: "'wdth' 100, 'wght' 300",
              color: "rgba(28,19,4,0.60)",
              lineHeight: 1.65,
              marginBottom: 32,
            }}
          >
            Educational insights, performance protocols, new research, and podcast episodes — delivered to serious practitioners.
          </motion.p>

          {/* Benefit pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {[
              "Educational Insights",
              "Performance Protocols",
              "New Research",
              "Podcast Episodes",
            ].map((b) => (
              <span
                key={b}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "rgba(200,150,62,0.08)",
                  border: "1px solid rgba(200,150,62,0.22)",
                  fontSize: 11,
                  fontVariationSettings: "'wdth' 75, 'wght' 500",
                  color: GOLD_DARK,
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: GOLD,
                    flexShrink: 0,
                  }}
                />
                {b}
              </span>
            ))}
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name && email) setSubmitted(true);
                }}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "32px 28px",
                  border: "1px solid rgba(183,163,146,0.25)",
                  boxShadow: "0 4px 24px rgba(28,19,4,0.05)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: "1px solid rgba(183,163,146,0.35)",
                      background: CREAM,
                      fontSize: 14,
                      fontFamily: "var(--font-primary), system-ui, sans-serif",
                      fontVariationSettings: "'wdth' 100, 'wght' 400",
                      color: INK,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: "1px solid rgba(183,163,146,0.35)",
                      background: CREAM,
                      fontSize: 14,
                      fontFamily: "var(--font-primary), system-ui, sans-serif",
                      fontVariationSettings: "'wdth' 100, 'wght' 400",
                      color: INK,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 8,
                    background: GOLD_GRAD,
                    backgroundSize: "200% 100%",
                    border: "none",
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "var(--font-primary), system-ui, sans-serif",
                    fontVariationSettings: "'wdth' 75, 'wght' 700",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Join The Circle →
                </motion.button>
                <p
                  style={{
                    fontSize: 11,
                    color: TAUPE,
                    marginTop: 12,
                    fontVariationSettings: "'wdth' 75, 'wght' 400",
                    lineHeight: 1.5,
                  }}
                >
                  No spam. No daily emails. Only what's worth your time.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SPRING}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "44px 28px",
                  border: "1px solid rgba(200,150,62,0.3)",
                  boxShadow: "0 4px 24px rgba(200,150,62,0.08)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: GOLD_GRAD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M5 11L9 15L17 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontVariationSettings: "'wdth' 85, 'wght' 700",
                    fontSize: 20,
                    color: INK,
                    marginBottom: 8,
                  }}
                >
                  Welcome to the Circle.
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    fontVariationSettings: "'wdth' 100, 'wght' 300",
                    color: "rgba(28,19,4,0.60)",
                    lineHeight: 1.6,
                  }}
                >
                  You'll hear from us when it's worth your time — not before.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── BRAND STATEMENT ──────────────────────────────────────────────── */}
      <section
        style={{
          background: INK,
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              width: 40,
              height: 1,
              background: GOLD_GRAD,
              margin: "0 auto 28px",
            }}
          />
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontVariationSettings: "'wdth' 100, 'wght' 300",
              fontStyle: "italic",
              fontSize: "clamp(20px, 3.5vw, 34px)",
              lineHeight: 1.45,
              color: "rgba(247,240,226,0.92)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            "The Goal Is Not To Sell More Products.{" "}
            <span
              style={{
                background: GOLD_GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Goal Is To Create Better Decisions."
            </span>
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: 24,
              fontSize: 12,
              fontVariationSettings: "'wdth' 75, 'wght' 500",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: TAUPE,
            }}
          >
            — Dr. Kashish Gupta, BAMS · Founder, 3TATTAVA
          </motion.p>
        </div>
      </section>

      {/* ─── DISCLAIMER ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: CREAM,
          padding: "24px 24px",
          borderTop: "1px solid rgba(183,163,146,0.2)",
        }}
      >
        <p
          style={{
            maxWidth: 960,
            margin: "0 auto",
            fontSize: 11,
            fontVariationSettings: "'wdth' 75, 'wght' 400",
            color: "rgba(28,19,4,0.40)",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          All articles are for educational purposes only. Content reviewed by Dr. Kashish Gupta, BAMS, is noted where applicable. This information does not constitute medical advice and is not a substitute for consultation with a qualified health professional. Individual results vary.
        </p>
      </section>
    </div>
  );
}

// ─── StartHereCard (extracted to avoid closure issues) ───────────────────────

function StartHereCard({
  item,
  idx,
}: {
  item: { slug: string; title: string; tag: string; readTime: string; excerpt: string };
  idx: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(183,163,146,0.2)",
        cursor: "pointer",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered
          ? "0 16px 50px rgba(28,19,4,0.09)"
          : "0 2px 8px rgba(28,19,4,0.04)",
      }}
    >
      {/* Gold gradient top strip */}
      <div
        style={{
          height: 4,
          background: GOLD_GRAD,
          backgroundSize: "200% 100%",
          transform: hovered ? "scaleX(1)" : "scaleX(0.6)",
          transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <Link
        href={`/education/${item.slug}`}
        style={{ display: "block", padding: "26px 24px 24px", textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <TagBadge label={item.tag} />
          <span
            style={{
              fontSize: 11,
              fontVariationSettings: "'wdth' 75, 'wght' 500",
              color: TAUPE,
            }}
          >
            {item.readTime} read
          </span>
        </div>

        <h3
          style={{
            fontVariationSettings: "'wdth' 85, 'wght' 700",
            fontSize: 19,
            lineHeight: 1.25,
            color: INK,
            marginBottom: 10,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontSize: 13.5,
            fontVariationSettings: "'wdth' 100, 'wght' 300",
            color: "rgba(28,19,4,0.62)",
            lineHeight: 1.65,
            marginBottom: 18,
          }}
        >
          {item.excerpt}
        </p>

        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={SPRING}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontVariationSettings: "'wdth' 75, 'wght' 700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          Start Reading
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4.5L10.5 7 8 9.5" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  );
}
