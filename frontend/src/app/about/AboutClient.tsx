"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const F    = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/** Word-by-word slide-up reveal — inspired by VerticalCutReveal */
function WordReveal({
  text,
  delay = 0,
  style,
}: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.28em",
        ...style,
      }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            initial={{ y: "112%" }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 28,
              delay: delay + i * 0.09,
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Scroll-triggered fade-up reveal */
function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-55px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Gold eyebrow label */
function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p
      style={{
        fontFamily: F,
        fontSize: "10px",
        letterSpacing: ".28em",
        textTransform: "uppercase",
        fontVariationSettings: "'wdth' 75,'wght' 500",
        color: light ? "rgba(247,240,226,.55)" : "#cd872a",
        marginBottom: "14px",
      }}
    >
      {text}
    </p>
  );
}

// ─── SECTION 1 — HERO ────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(to bottom, #d27038, #824026)",
        padding: "clamp(80px,12vh,140px) 24px clamp(80px,10vh,120px)",
        textAlign: "center",
        overflow: "hidden",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle mandala bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(228,192,121,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            fontFamily: F,
            fontSize: "10px",
            letterSpacing: ".32em",
            textTransform: "uppercase",
            fontVariationSettings: "'wdth' 75,'wght' 500",
            color: "rgba(247,240,226,.60)",
            marginBottom: "24px",
          }}
        >
          The 3TATTAVA Story
        </motion.p>

        {/* H1 — WordReveal */}
        <h1
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 800",
            fontSize: "clamp(36px,6.5vw,76px)",
            lineHeight: 1.05,
            letterSpacing: "-.025em",
            color: "#f7f0e2",
            marginBottom: "24px",
          }}
        >
          <WordReveal text="Why an Ayurveda Doctor Stopped Seeing Patients" delay={0.2} />
        </h1>

        {/* Italic gold subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.2, ease: EASE }}
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontStyle: "italic",
            fontSize: "clamp(17px,2.2vw,22px)",
            color: "#cd872a",
            marginBottom: "36px",
            lineHeight: 1.5,
          }}
        >
          And built India&apos;s first Performance Ayurveda brand instead.
        </motion.p>

        {/* Credential line */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.45, ease: EASE }}
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontSize: "15px",
            lineHeight: 1.72,
            color: "rgba(247,240,226,.68)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Dr. Kashish Gupta. BAMS, CBPACS (Govt. of NCT Delhi).
          <br />
          90-day personal Shilajit protocol with clinical blood work documentation.
          <br />
          Former Consultant, National Commission for Indian System of Medicine,
          <br />
          Ministry of AYUSH, Government of India.
        </motion.p>
      </div>

      {/* Scroll chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M1 1L10 10L19 1"
            stroke="rgba(247,240,226,0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}

// ─── SECTION 2 — FOUNDER STORY ────────────────────────────────────────────────

function FounderStorySection() {
  return (
    <section
      id="founder"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
      className="md:grid-cols-2 grid-cols-1"
    >
      {/* Left — video placeholder */}
      <div
        style={{
          position: "relative",
          minHeight: "380px",
          background: "linear-gradient(135deg,#3d2e26 0%,#1f1915 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(205,135,42,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(205,135,42,.05) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <motion.div
          whileHover={{ scale: 1.12 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "rgba(205,135,42,.22)",
            border: "1.5px solid rgba(205,135,42,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 3l14 9-14 9V3z" fill="#E4C079" />
          </svg>
        </motion.div>
        <span
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            fontSize: "9px",
            letterSpacing: ".24em",
            textTransform: "uppercase",
            fontVariationSettings: "'wdth' 75,'wght' 500",
            fontFamily: F,
            color: "rgba(247,240,226,.55)",
          }}
        >
          Watch Dr. Kashish&apos;s Story
        </span>
      </div>

      {/* Right — text */}
      <div
        style={{
          background: "#8c4826",
          color: "#f4efdc",
          padding: "clamp(40px,6vw,88px) clamp(28px,5vw,72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Reveal>
          <Eyebrow text="Founder Story" light />
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.5vw,38px)",
              letterSpacing: "-.02em",
              lineHeight: 1.15,
              color: "#f4efdc",
              marginBottom: "24px",
            }}
          >
            The Problem Nobody&apos;s Fixing
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Sitting in his clinic, Dr. Kashish saw the same pattern in 20 patients every day. No real energy. Broken sleep. Dependency on stimulants. Hormonal disasters. And the worst part — they all thought this was normal.",
              "One consultation can't fix a generation. So he stopped seeing patients and started building something.",
              "Something rooted in what actually works — Ayurveda's mineral science and adaptogenic intelligence — but designed for the way people actually live. Not powders you'll forget. Not capsules you don't trust. Something you'll actually want to take every single morning.",
              "That's 3TATTAVA.",
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "clamp(14px,1.4vw,16px)",
                  lineHeight: 1.75,
                  color: "rgba(244,239,220,.90)",
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 3 — THE REAL JOURNEY ────────────────────────────────────────────

function JourneySection() {
  return (
    <section
      style={{
        background: "#f7f0e2",
        padding: "clamp(72px,10vw,120px) 24px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="The Journey" />
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(30px,4.5vw,52px)",
              letterSpacing: "-.02em",
              lineHeight: 1.1,
              color: "#442a1b",
              marginBottom: "48px",
            }}
          >
            From Government Office to Glass Jar
          </h2>
        </Reveal>

        {[
          "Most people discover Ayurveda after something goes wrong. Dr. Kashish wanted to explore what happens when Ayurvedic wisdom is used before problems begin — to support energy, longevity, recovery, resilience and long-term performance.",
          "He entered Ayurveda expecting to learn medicine. What he discovered was something much bigger. During five years of BAMS education at CBPACS (Govt. of NCT Delhi), he realized Ayurveda was never only about treating illness. At its core, it was about helping people function at their highest potential.",
          "After graduation, he joined the National Commission for Indian System of Medicine (NCISM) under the Ministry of AYUSH as a Junior Technical Officer — assigned to manage assessment, teacher promotions, appointments, and college accreditations for the state of Maharashtra. Over 100 colleges. Technical Officer code 0067.",
          "He completed in one hour what took others three days. The efficiency didn't go unnoticed. When the previous officer left, he was handed the Unani department. When a senior consultant went on maternity leave, he stepped in again. When the Appeal Section had a backlog of 100 college appeals, he cleared it in under two months.",
        ].map((para, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "#442a1b",
                marginBottom: "26px",
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}

        {/* Pull quote */}
        <Reveal delay={0.1}>
          <blockquote
            style={{
              margin: "52px 0",
              paddingLeft: "28px",
              borderLeft: "4px solid #cd872a",
            }}
          >
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "clamp(20px,2.8vw,30px)",
                lineHeight: 1.5,
                color: "#442a1b",
                marginBottom: "14px",
              }}
            >
              &ldquo;I entered the Commission as a mouse. I wanted to leave as an elephant — regardless of the hardships.&rdquo;
            </p>
            <cite
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 500",
                fontSize: "13px",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#cd872a",
                fontStyle: "normal",
              }}
            >
              — Dr. Kashish Gupta
            </cite>
          </blockquote>
        </Reveal>

        {[
          "The Chairman and Secretary promoted him to Consultant — the youngest NCISM had ever seen. He managed four national boards simultaneously: Ayurveda, Ethics and Registration, Unani Sidha Sopa, and the Medical Assessment Rating Board. He handled legal issues, high court matters, counselling problems, and the grievance portal for the entire AYUSH system. A staff of 128 people. Pan-India responsibility.",
          "But the salary stayed at ₹35,000. He accepted it because he was never after money. He wanted position, influence, and the ability to see the system from the inside.",
          "And from the inside, what he saw troubled him deeply.",
        ].map((para, i) => (
          <Reveal key={`b${i}`} delay={i * 0.06}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "#442a1b",
                marginBottom: "26px",
                fontStyle: i === 2 ? "italic" : "normal",
                fontWeight: i === 2 ? "300" : undefined,
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 4 — THE MARKET PROBLEM ──────────────────────────────────────────

function MarketProblemSection() {
  return (
    <section
      style={{
        background: "#442a1b",
        padding: "clamp(72px,10vw,120px) 24px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="What He Saw From The Inside" light />
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,48px)",
              letterSpacing: "-.02em",
              lineHeight: 1.12,
              color: "#f7f0e2",
              marginBottom: "40px",
            }}
          >
            The Ayurvedic Market Had Become a Bubble
          </h2>
        </Reveal>

        {[
          "Working at NCISM gave Dr. Kashish a view that no brand founder has ever had. He watched the entire AYUSH regulatory system from the inside — every compliance gap, every shortcut, every brand selling products under the Ayurvedic label that were filled with modern nutraceuticals and only a fraction of actual Ayurvedic ingredients.",
          "Brands were using permitted food additives to bypass strict AYUSH regulations. Influencers and showmanship replaced substance. Products lacked a solid foundation. Transparency was almost nonexistent.",
          "He had reached the highest position possible at NCISM without a postgraduate degree. He could have stayed — power, position, Pan-India authority. Instead, he decided to build what the market was missing.",
        ].map((para, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "rgba(247,240,226,.82)",
                marginBottom: "24px",
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}

        {/* Gold pull quote */}
        <Reveal delay={0.12}>
          <div style={{ margin: "56px 0", textAlign: "center" }}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "clamp(22px,3vw,34px)",
                lineHeight: 1.52,
                color: "#cd872a",
                maxWidth: "620px",
                margin: "0 auto",
              }}
            >
              &ldquo;Most brands just used influencers and showmanship while their products lacked a solid foundation. I decided to build the foundation first.&rdquo;
            </p>
          </div>
        </Reveal>

        {[
          "This was not his first attempt. In 2022, he had tried a brand called Gymveda. It failed — a lack of patience, regularity, and a ₹1 lakh loan from his uncle that didn't stretch far enough. That failure taught him everything the Commission couldn't: that building a brand requires the same discipline he demanded from the 128 people who worked under him.",
          "3TATTAVA was born from that second attempt. Not from marketing strategy. From frustration with an industry he knew from the inside out.",
        ].map((para, i) => (
          <Reveal key={`b${i}`} delay={i * 0.06}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "rgba(247,240,226,.82)",
                marginBottom: "24px",
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 5 — PHILOSOPHY ───────────────────────────────────────────────────

function PhilosophySection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,120px) 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="The Philosophy" />
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,48px)",
              letterSpacing: "-.02em",
              lineHeight: 1.12,
              color: "#442a1b",
              marginBottom: "40px",
            }}
          >
            What Performance Ayurveda Actually Means
          </h2>
        </Reveal>

        {[
          "To Dr. Kashish, Performance Ayurveda is not a marketing term. It is the application of natural healthcare to solve the day-to-day problems that hamper a person's performance — energy, recovery, sleep, stress, resilience, and long-term vitality.",
          "It is based on a classical Ayurvedic concept that has guided Indian medicine for millennia:",
        ].map((para, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "#442a1b",
                marginBottom: "26px",
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}

        {/* Sanskrit block */}
        <Reveal delay={0.1}>
          <div
            style={{
              margin: "48px 0",
              textAlign: "center",
              background: "rgba(205,135,42,.07)",
              border: "1px solid rgba(205,135,42,.22)",
              borderRadius: "12px",
              padding: "36px 28px",
            }}
          >
            {/* Devanagari */}
            <p
              style={{
                fontSize: "22px",
                color: "#cd872a",
                lineHeight: 1.65,
                marginBottom: "10px",
                fontFamily: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif",
              }}
            >
              स्वस्थस्य स्वास्थ्य रक्षणम्, आतुरस्य विकार प्रशमनम्
            </p>
            {/* Transliteration */}
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "14px",
                color: "rgba(28,19,4,.50)",
                marginBottom: "16px",
                letterSpacing: ".04em",
              }}
            >
              Swasthasya Swasthya Rakshanam, Aturasya Vikara Prashamanam
            </p>
            {/* English translation */}
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontStyle: "italic",
                fontSize: "18px",
                color: "#442a1b",
                lineHeight: 1.6,
              }}
            >
              &ldquo;Protect the health of the healthy.
              <br />
              Manage the ailments of the ill.&rdquo;
            </p>
          </div>
        </Reveal>

        {[
          "Most of modern healthcare focuses on the second half — managing problems after they appear. 3TATTAVA focuses on the first half — supporting health before problems begin. Making sure a person's daily lifestyle, mineral intake, recovery, and rituals are strong enough that the body can perform at its natural best.",
          "That is what Balance. Build. Become. means. Not a slogan. A clinical philosophy applied to daily life.",
        ].map((para, i) => (
          <Reveal key={`b${i}`} delay={i * 0.07}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "17px",
                lineHeight: 1.82,
                color: "#442a1b",
                marginBottom: "26px",
              }}
            >
              {para}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 6 — TIMELINE ────────────────────────────────────────────────────

const MILESTONES = [
  {
    date: "Nov 2016 — Oct 2021",
    title: "Ayurveda Education — BAMS",
    body: "Alumni of Chaudhary Brahm Prakash Ayurvedic Charak Sansthan (CBPACS), Govt. of NCT New Delhi. Five years studying a discipline that would reveal something much bigger than medicine.",
    quote: "I entered Ayurveda expecting to learn medicine. What I discovered was something much bigger.",
    final: false,
  },
  {
    date: "Oct 2021 — Nov 2022",
    title: "Internship — CBPACS & RTRMH",
    body: "Clinical rotations across Ayurvedic departments. First exposure to the gap between classical Ayurvedic potential and modern patient needs.",
    final: false,
  },
  {
    date: "July 2022 — Nov 2022",
    title: "Founded Gymveda (First Attempt)",
    body: "An early attempt at bridging Ayurveda and fitness. Failed due to lack of patience, regularity, and insufficient capital. The failure became the foundation of everything that followed.",
    final: false,
  },
  {
    date: "Dec 2022 — Jan 2023",
    title: "Clinical Exposure — Resident Medical Officer",
    body: "Bulandshahar. Direct patient care. Saw the same pattern in hundreds of patients: low energy, broken sleep, stimulant dependency, mineral depletion. Everyone thought it was normal.",
    final: false,
  },
  {
    date: "Feb 2023 — Oct 2025",
    title: "Consultant (I/C) — NCISM, Ministry of AYUSH",
    body: "National Commission for Indian System of Medicine. Managed four national boards: Ayurveda, Ethics & Registration, Unani Sidha Sopa, Medical Assessment Rating Board. Pan-India responsibility. Staff of 128. Youngest consultant NCISM had ever seen.",
    final: false,
  },
  {
    date: "July 2022 — Feb 2026",
    title: "Performance Ayurveda Research",
    body: "Parallel to government service: 90-day personal Shilajit protocol with clinical blood work documentation. Researching Shodhana methods, fulvic acid bioavailability, and mineral-based performance support.",
    final: false,
  },
  {
    date: "2026",
    title: "Founded 3TATTAVA",
    body: "India's first Performance Ayurveda brand. Doctor-led. Athlete-backed. Lab-tested. Built from the inside knowledge of what the market was missing: transparency, process, and authentic Ayurvedic preparation.",
    sub: "SankalpaSiddhi Ayupharma Pvt. Ltd.",
    final: true,
  },
];

function TimelineCard({
  m,
  idx,
  side,
}: {
  m: (typeof MILESTONES)[0];
  idx: number;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -32 : 32, y: 12 }}
      animate={inV ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.52, delay: idx * 0.05, ease: EASE }}
      style={{
        background: m.final ? "rgba(205,135,42,.06)" : "#fff",
        border: m.final
          ? "1px solid rgba(205,135,42,.35)"
          : "1px solid rgba(28,19,4,.07)",
        borderLeft: m.final ? "4px solid #cd872a" : undefined,
        borderRadius: "10px",
        padding: "28px 28px 24px",
        boxShadow: "0 4px 22px rgba(28,19,4,.055)",
        maxWidth: m.final ? "600px" : "400px",
        width: "100%",
      }}
    >
      <p
        style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 75,'wght' 600",
          fontSize: "10px",
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#cd872a",
          marginBottom: "8px",
        }}
      >
        {m.date}
      </p>
      <h3
        style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 85,'wght' 700",
          fontSize: m.final ? "22px" : "18px",
          color: "#442a1b",
          marginBottom: "10px",
          lineHeight: 1.25,
        }}
      >
        {m.title}
      </h3>
      <p
        style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 100,'wght' 400",
          fontSize: "14px",
          lineHeight: 1.72,
          color: "rgba(28,19,4,.72)",
        }}
      >
        {m.body}
      </p>
      {m.quote && (
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontStyle: "italic",
            fontSize: "13px",
            color: "rgba(28,19,4,.50)",
            marginTop: "12px",
            lineHeight: 1.6,
          }}
        >
          &ldquo;{m.quote}&rdquo;
        </p>
      )}
      {m.sub && (
        <p
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 75,'wght' 600",
            fontSize: "11px",
            letterSpacing: ".09em",
            color: "#cd872a",
            marginTop: "12px",
          }}
        >
          {m.sub}
        </p>
      )}
    </motion.div>
  );
}

function TimelineSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,104px) 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <Eyebrow text="Career Journey" />
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(26px,3.5vw,40px)",
                letterSpacing: "-.02em",
                color: "#442a1b",
              }}
            >
              The Path That Built 3TATTAVA
            </h2>
          </div>
        </Reveal>

        {/* Timeline container */}
        <div style={{ position: "relative" }}>
          {/* Centre gold line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "2px",
              background:
                "linear-gradient(to bottom,transparent,#cd872a 8%,#cd872a 92%,transparent)",
              transform: "translateX(-50%)",
            }}
            className="hidden md:block"
          />

          {/* Mobile left line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "20px",
              width: "2px",
              background:
                "linear-gradient(to bottom,transparent,#cd872a 4%,#cd872a 96%,transparent)",
            }}
            className="block md:hidden"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {MILESTONES.map((m, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      m.final
                        ? "center"
                        : side === "left"
                        ? "flex-start"
                        : "flex-end",
                    position: "relative",
                    paddingLeft: "48px",
                  }}
                  className="md:pl-0"
                >
                  {/* Desktop dot on centre line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: m.final
                        ? "linear-gradient(135deg,#A67B2F,#E4C079)"
                        : "#f7f0e2",
                      border: "2px solid #cd872a",
                      boxShadow: m.final
                        ? "0 0 12px rgba(205,135,42,.50)"
                        : "none",
                      zIndex: 2,
                    }}
                    className="hidden md:block"
                  />
                  {/* Mobile dot on left line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "13px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: m.final
                        ? "linear-gradient(135deg,#A67B2F,#E4C079)"
                        : "#f7f0e2",
                      border: "2px solid #cd872a",
                      zIndex: 2,
                    }}
                    className="block md:hidden"
                  />

                  {/* Card */}
                  <TimelineCard m={m} idx={i} side={side} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 7 — MONA AGARWAL ────────────────────────────────────────────────
/* COMPLIANCE NOTE: DO NOT write that Mona uses RockResin or Shahjeet unless confirmed.
   DO NOT link her medal to any product. DO NOT make sports-performance claims.
   She is an ambassador for the PHILOSOPHY, not the product. */

const PILLARS = [
  { icon: "⚡", title: "Discipline",   desc: "Doing the work daily." },
  { icon: "🔄", title: "Recovery",    desc: "Preparing for tomorrow." },
  { icon: "🏔", title: "Resilience",  desc: "Performing under pressure." },
  { icon: "📈", title: "Consistency", desc: "Small actions. Big results." },
];

function AthleteSection() {
  return (
    <section
      style={{
        background: "#442a1b",
        padding: "clamp(72px,10vw,104px) 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px,5vw,72px)",
          alignItems: "center",
        }}
        className="grid-cols-1 md:grid-cols-2"
      >
        {/* Left — placeholder image frame (SVG-framed) */}
        <Reveal>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "115%",
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(145deg,#2a1f14,#442a1b)",
              border: "1px solid rgba(205,135,42,.22)",
            }}
          >
            {/* Animated diagonal grid (inspired by reference) */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}
              viewBox="0 0 100 120"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="atlGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M0 10 L10 0" stroke="#cd872a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#atlGrid)" />
            </svg>

            {/* Centred placeholder text */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                textAlign: "center",
              }}
            >
              {/* Gold circle initial */}
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg,#A67B2F,#E4C079)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: "0 8px 32px rgba(205,135,42,.32)",
                }}
              >
                <span
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "38px",
                    color: "#442a1b",
                    lineHeight: 1,
                  }}
                >
                  M
                </span>
              </div>
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "18px",
                  color: "#f7f0e2",
                  marginBottom: "6px",
                }}
              >
                Mona Agarwal
              </p>
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 500",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#cd872a",
                  marginBottom: "16px",
                }}
              >
                Paralympic Bronze Medalist
              </p>
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 400",
                  fontSize: "11px",
                  color: "rgba(247,240,226,.32)",
                  letterSpacing: ".08em",
                }}
              >
                Photo Coming Soon
              </p>
            </div>
          </div>
        </Reveal>

        {/* Right — text */}
        <div>
          <Reveal>
            <Eyebrow text="Founding Athlete Ambassador" light />
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(26px,3.5vw,40px)",
                lineHeight: 1.12,
                letterSpacing: "-.02em",
                color: "#f7f0e2",
                marginBottom: "10px",
              }}
            >
              Built For People Who Demand More From Themselves
            </h2>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "14px",
                letterSpacing: ".06em",
                color: "#cd872a",
                marginBottom: "24px",
              }}
            >
              Mona Agarwal · Paralympic Bronze Medalist
            </p>
          </Reveal>

          {[
            "Elite performance is rarely about motivation. It is built through consistency, recovery, discipline and showing up every day.",
            "These same principles form the foundation of Performance Ayurveda.",
            "That is why Paralympic Bronze Medalist Mona Agarwal joined 3TATTAVA as our Founding Athlete Ambassador. Together, we aim to promote a culture of sustainable performance, resilience and long-term vitality.",
          ].map((para, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "rgba(247,240,226,.78)",
                  marginBottom: "16px",
                }}
              >
                {para}
              </p>
            </Reveal>
          ))}

          {/* 4 pillar cards */}
          <Reveal delay={0.14}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                margin: "28px 0",
              }}
            >
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  style={{
                    background: "rgba(247,240,226,.06)",
                    border: "1px solid rgba(247,240,226,.10)",
                    borderRadius: "10px",
                    padding: "16px",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{p.icon}</div>
                  <p
                    style={{
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 75,'wght' 700",
                      fontSize: "11px",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#cd872a",
                      marginBottom: "4px",
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    style={{
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 100,'wght' 300",
                      fontSize: "12px",
                      color: "rgba(247,240,226,.52)",
                      lineHeight: 1.5,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pull quote */}
          <Reveal delay={0.18}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "clamp(16px,2vw,20px)",
                color: "#cd872a",
                lineHeight: 1.55,
              }}
            >
              &ldquo;Success is not built on one great day. It is built on what you do consistently every day.&rdquo;
            </p>
          </Reveal>
        </div>
      </div>

      {/* Trust bar */}
      <Reveal delay={0.1}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "56px auto 0",
            borderTop: "1px solid rgba(247,240,226,.10)",
            paddingTop: "32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 75,'wght' 500",
              fontSize: "9px",
              letterSpacing: ".25em",
              textTransform: "uppercase",
              color: "rgba(247,240,226,.32)",
              marginBottom: "14px",
            }}
          >
            Performance Ecosystem — Supported Through
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              "✓ Founding Athlete Ambassador",
              "✓ Expert-Led Guidance",
              "✓ Fitness Community Partnerships",
              "✓ Evidence-Based Ayurveda",
            ].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 500",
                  fontSize: "10px",
                  letterSpacing: ".10em",
                  color: "rgba(247,240,226,.55)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── SECTION 8 — SOURCING & LAB TESTING ──────────────────────────────────────

const SOURCING_STEPS = [
  {
    num: "01",
    title: "Sourcing",
    body: "Raw Shilajit (Asphaltum Punjabanum) is harvested from Himalayan deposits at 10,000–16,000ft altitude — where mineral concentration and resin maturity peak. The ore is sourced from verified Himalayan sites with known geological provenance.",
  },
  {
    num: "02",
    title: "Purification (Triphala Shodhan)",
    body: "Every batch undergoes classical Triphala Shodhan purification — as prescribed in Ashtanga Hridayam. Conducted in an AYUSH-GMP certified facility in Rajasthan. This removes heavy metals and rock impurities while preserving fulvic acid integrity.",
  },
  {
    num: "03",
    title: "NABL Lab Testing",
    body: "Before a single jar ships, every batch is tested by an independent NABL-accredited third-party laboratory for: fulvic acid concentration (≥70%), heavy metals (Lead, Mercury, Arsenic — below AYUSH limits), microbial contamination, and stability. NABL Batch Report: #RK2024-08.",
  },
  {
    num: "04",
    title: "Packaging & QR Verification",
    body: "Glass jar (never plastic — plastic leaches into resin). Every pack carries a QR code linking to the batch-specific NABL 3rd-party lab report. Marketed by SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1 Kabool Nagar, Shahdara, Delhi. Manufactured in an AYUSH-GMP certified, US-FDA registered facility.",
  },
];

function SourcingSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,104px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Eyebrow text="Sourcing & Lab Testing" />
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(26px,3.5vw,40px)",
                letterSpacing: "-.02em",
                color: "#442a1b",
                marginBottom: "12px",
              }}
            >
              From 16,000 Feet to Your Morning Ritual
            </h2>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "16px",
                color: "rgba(28,19,4,.55)",
              }}
            >
              300 years of the Himalayas, compressed into one substance.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "18px",
            marginBottom: "40px",
          }}
        >
          {SOURCING_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.07}>
              <TiltCard radius={12} max={8}>
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(205,135,42,.12)" }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(183,163,146,.28)",
                  borderRadius: "12px",
                  padding: "28px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)",
                  }}
                />
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "36px",
                    color: "rgba(28,19,4,.08)",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {s.num}
                </p>
                <h3
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 700",
                    fontSize: "18px",
                    color: "#442a1b",
                    marginBottom: "10px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "13.5px",
                    lineHeight: 1.72,
                    color: "rgba(28,19,4,.65)",
                  }}
                >
                  {s.body}
                </p>
              </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Trust badges */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
            {["NABL 3rd-Party Lab Tested", "AYUSH-GMP Certified", "US-FDA Registered Facility", "Triphala Shodhan Purified"].map((cert) => (
              <span
                key={cert}
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "10px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#cd872a",
                  border: "1px solid rgba(205,135,42,.35)",
                  background: "rgba(205,135,42,.06)",
                  padding: "5px 14px",
                  borderRadius: "20px",
                }}
              >
                ✓ {cert}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div style={{ textAlign: "center" }}>
            <Link
              href="/research-testing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)",
                color: "#442a1b",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                padding: "13px 28px",
                textDecoration: "none",
              }}
            >
              View Our Latest Lab Report →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 9 — MEET THE FOUNDER ────────────────────────────────────────────

function FounderMeetSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,104px) 24px" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: imgError ? "1fr" : "2fr 3fr",
          gap: "clamp(32px,5vw,72px)",
          alignItems: "center",
        }}
      >
        {/* Photo */}
        {!imgError && (
          <Reveal>
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#ede4d0",
                border: "1px solid rgba(205,135,42,.22)",
                aspectRatio: "4/5",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://media.3tattava.com/dr-kashish/dr-kashish-portrait.jpg"
                alt="Dr. Kashish Gupta, BAMS — Founder of 3TATTAVA"
                onError={() => setImgError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top,rgba(28,19,4,.45),transparent 55%)",
                }}
              />
              <p
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "11px",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#cd872a",
                }}
              >
                Dr. Kashish Gupta, BAMS
              </p>
            </div>
          </Reveal>
        )}

        {/* Text */}
        <div>
          <Reveal>
            <Eyebrow text="Meet the Founder" />
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(24px,3vw,36px)",
                letterSpacing: "-.02em",
                color: "#442a1b",
                marginBottom: "24px",
              }}
            >
              Formulated by Dr. Kashish Gupta, BAMS
            </h2>
          </Reveal>

          {/* Quote */}
          <Reveal delay={0.07}>
            <blockquote
              style={{
                borderLeft: "3px solid #cd872a",
                paddingLeft: "20px",
                margin: "0 0 28px",
              }}
            >
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "clamp(15px,1.8vw,18px)",
                  lineHeight: 1.68,
                  color: "rgba(28,19,4,.72)",
                  marginBottom: "10px",
                }}
              >
                &ldquo;I didn&apos;t start 3TATTAVA to sell Shilajit. I started it because modern life is demanding more energy, more resilience, and more consistency than ever before. Ayurveda has answers. But those answers must be practical, transparent and relevant to today&apos;s world. RockResin is our attempt to bridge that gap.&rdquo;
              </p>
              <cite
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "11px",
                  letterSpacing: ".10em",
                  textTransform: "uppercase",
                  color: "#cd872a",
                  fontStyle: "normal",
                }}
              >
                — Dr. Kashish Gupta, Founder
              </cite>
            </blockquote>
          </Reveal>

          {/* Short credential line */}
          <Reveal delay={0.1}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 500",
                fontSize: "12px",
                color: "rgba(28,19,4,.50)",
                letterSpacing: ".06em",
                marginBottom: "20px",
              }}
            >
              Qualified Ayurveda Doctor (BAMS) · 90-day personal Shilajit protocol with clinical blood work documentation · Founder, 3TATTAVA
            </p>
          </Reveal>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(28,19,4,.10)", margin: "20px 0 20px" }} />

          {/* Full credentials block */}
          <Reveal delay={0.12}>
            <div>
              <p
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "16px",
                  color: "#442a1b",
                  marginBottom: "10px",
                }}
              >
                Dr. Kashish Gupta, BAMS
              </p>
              {[
                "Qualified Ayurveda Doctor (Bachelor of Ayurvedic Medicine and Surgery)",
                "Alumni: CBPACS — Chaudhary Brahm Prakash Ayurvedic Charak Sansthan, Govt. of NCT Delhi",
                "Former Consultant: National Commission for Indian System of Medicine, Ministry of AYUSH, Government of India",
                "90-day personal Shilajit protocol with clinical blood work documentation",
                "Performance Ayurveda Educator · Podcast Host",
              ].map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    color: "rgba(28,19,4,.68)",
                    marginBottom: "4px",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 10 — BALANCE · BUILD · BECOME ───────────────────────────────────

const BBB_CARDS = [
  {
    word: "BALANCE",
    sanskrit: "समत्व",
    transliteration: "Samatva",
    heading: "Restore The Foundation",
    body: "Before strength comes stability. Before performance comes recovery. Before growth comes balance. Support the foundations that modern lifestyles often disrupt: energy, recovery, sleep, digestion, stress resilience.",
  },
  {
    word: "BUILD",
    sanskrit: "बल",
    transliteration: "Bala",
    heading: "Develop Resilience",
    body: "Once the foundation is stable, the next step is growth. Build the capacity to train harder, focus longer and recover better. Physical strength, mental resilience, consistency, endurance, daily performance.",
  },
  {
    word: "BECOME",
    sanskrit: "उत्कर्ष",
    transliteration: "Utkarsha",
    heading: "Reach Higher Potential",
    body: "Performance is not a destination. It is a continuous process of becoming. Support the habits, rituals and mindset that help you evolve into your strongest self. Longevity, vitality, leadership, purpose, lifelong growth.",
  },
];

function BBBSection() {
  return (
    <section
      style={{
        background: "#442a1b",
        padding: "clamp(72px,10vw,104px) 24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Eyebrow text="The Journey of Performance" light />
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(28px,4vw,48px)",
                letterSpacing: "-.02em",
                color: "#f7f0e2",
                marginBottom: "14px",
              }}
            >
              Balance · Build · Become
            </h2>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "clamp(14px,1.6vw,17px)",
                color: "rgba(247,240,226,.58)",
                maxWidth: "560px",
                margin: "0 auto 52px",
                lineHeight: 1.65,
              }}
            >
              Not overnight. Not through shortcuts. Not through hacks. Through daily rituals that help you balance your foundations, build resilience and become your strongest self.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          {BBB_CARDS.map((c, i) => (
            <Reveal key={c.word} delay={i * 0.09}>
              <TiltCard radius={12} max={8}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  background: "rgba(247,240,226,.04)",
                  border: "1px solid rgba(247,240,226,.10)",
                  borderRadius: "12px",
                  padding: "32px 28px",
                  height: "100%",
                }}
              >
                {/* Gold gradient word label */}
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "11px",
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "8px",
                  }}
                >
                  {c.word}
                </p>
                {/* Sanskrit */}
                <p
                  style={{
                    fontFamily: "'Noto Serif Devanagari','Noto Sans Devanagari',serif",
                    fontSize: "28px",
                    color: "#cd872a",
                    lineHeight: 1.3,
                    marginBottom: "2px",
                  }}
                >
                  {c.sanskrit}
                </p>
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 300",
                    fontStyle: "italic",
                    fontSize: "11px",
                    color: "rgba(247,240,226,.35)",
                    marginBottom: "16px",
                    letterSpacing: ".06em",
                  }}
                >
                  {c.transliteration}
                </p>
                <div
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg,#cd872a,transparent)",
                    marginBottom: "16px",
                    opacity: 0.35,
                  }}
                />
                <h3
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 700",
                    fontSize: "17px",
                    color: "#f7f0e2",
                    marginBottom: "10px",
                  }}
                >
                  {c.heading}
                </h3>
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "13.5px",
                    lineHeight: 1.72,
                    color: "rgba(247,240,226,.60)",
                  }}
                >
                  {c.body}
                </p>
              </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Mid statement */}
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(18px,2.5vw,28px)",
              textAlign: "center",
              color: "rgba(247,240,226,.40)",
              marginTop: "56px",
              letterSpacing: "-.01em",
              lineHeight: 1.45,
            }}
          >
            Ayurveda Was Never Just About Treating Illness.
            <br />
            It Was About Supporting Human Potential.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 11 — FINAL CTA ──────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section
      style={{
        background: "#f7f0e2",
        padding: "clamp(72px,10vw,104px) 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "660px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="Begin Your Ritual" />
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(28px,4vw,46px)",
              letterSpacing: "-.02em",
              lineHeight: 1.12,
              color: "#442a1b",
              marginBottom: "16px",
            }}
          >
            Ready To Balance. Build. Become.
          </h2>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "16px",
              lineHeight: 1.68,
              color: "rgba(28,19,4,.58)",
              marginBottom: "40px",
            }}
          >
            You now understand the philosophy, the science, the community, and the rituals. The next step is yours.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)",
                color: "#442a1b",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                padding: "14px 26px",
                textDecoration: "none",
              }}
            >
              Shop Collection
            </Link>
            <Link
              href="/vaidyaconnect"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                color: "#442a1b",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 600",
                fontSize: "11px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                padding: "14px 22px",
                textDecoration: "none",
                border: "1px solid rgba(28,19,4,.28)",
              }}
            >
              Take Assessment
            </Link>
            <Link
              href="/find-us"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                color: "#442a1b",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 600",
                fontSize: "11px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                padding: "14px 22px",
                textDecoration: "none",
                border: "1px solid rgba(28,19,4,.28)",
              }}
            >
              Find Experience Center
            </Link>
          </div>
        </Reveal>

        {/* Brand statement */}
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(20px,2.5vw,28px)",
              color: "rgba(28,19,4,.28)",
              letterSpacing: "-.01em",
              lineHeight: 1.45,
            }}
          >
            We Don&apos;t Believe In Quick Fixes.
            <br />
            We Believe In Daily Rituals.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function AboutClient() {
  return (
    <div style={{ fontFamily: F, color: "#442a1b" }}>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Founder Story */}
      <FounderStorySection />

      {/* 3 — The Real Journey */}
      <JourneySection />

      {/* 4 — The Market Problem */}
      <MarketProblemSection />

      {/* 5 — Philosophy */}
      <PhilosophySection />

      {/* 6 — Timeline */}
      <TimelineSection />

      {/* 7 — Mona Agarwal */}
      <AthleteSection />

      {/* 8 — Sourcing & Lab Testing (repositioned) */}
      <SourcingSection />

      {/* 9 — Meet the Founder */}
      <FounderMeetSection />

      {/* 10 — Balance Build Become */}
      <BBBSection />

      {/* 11 — Final CTA */}
      <FinalCTASection />
    </div>
  );
}
