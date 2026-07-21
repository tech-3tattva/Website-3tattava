"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CREAM = "#f7f0e2";
const INK = "#442a1b";
const ESPRESSO = "#2a1a08";
const GOLD = "#cd872a";
const GOLD_SOFT = "#E4C079";
const MUTED = "#6f5a48";
const F = "var(--font-primary), system-ui, sans-serif";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const SECTIONS: { heading: string; paras: string[] }[] = [
  {
    heading: "The Question That Started It",
    paras: [
      "During his medical education and early clinical experience, Dr. Kashish observed how difficult it had become for people to maintain consistent routines around nourishment, rest, movement and recovery.",
      "This led him to explore a simple question: How can the wisdom of Ayurveda be translated into practical, credible and thoughtfully designed rituals for modern life?",
      "3Tattava began as an answer\u2014not as a promise of shortcuts or instant transformation, but as a long-term commitment to responsible Ayurveda, better product experiences and transparent communication.",
    ],
  },
  {
    heading: "The Experience Behind the Brand",
    paras: [
      "Dr. Kashish completed his Bachelor of Ayurvedic Medicine and Surgery at Chaudhary Brahm Prakash Ayurved Charak Sansthan, Government of NCT of Delhi.",
      "His education, internship and early clinical responsibilities gave him experience across classical Ayurveda and contemporary patient care. He later served in technical and consulting roles with the National Commission for Indian System of Medicine.",
      "This professional journey strengthened his respect for documentation, institutional processes, quality standards and regulatory responsibility. These principles continue to influence how 3Tattava approaches product development, manufacturing partnerships, testing and consumer communication.",
    ],
  },
  {
    heading: "Contributing to a National Ayurveda Initiative",
    paras: [
      "Dr. Kashish contributed to the Desh Ka Prakriti Parikshan Abhiyaan, a nationwide Ayurveda awareness initiative led by the National Commission for Indian System of Medicine with the support of the Ministry of Ayush.",
      "The first phase of the campaign collectively achieved five Guinness World Records through nationwide participation.",
      "In recognition of his individual contribution to the initiative, Dr. Kashish received a Prashasti Patra and trophy presented by Shri Prataprao Jadhav, Union Minister of State (Independent Charge), Ministry of Ayush.",
      "For him, the recognition represented the growing relevance of Ayurveda education and the responsibility of communicating its principles accurately to a modern audience.",
    ],
  },
  {
    heading: "The First Attempt\u2014and the Lessons It Created",
    paras: [
      "Before founding 3Tattava, Dr. Kashish experimented with an early Ayurveda-and-fitness venture in 2022.",
      "The venture did not continue, but it became an important learning experience. It demonstrated that building a credible wellness company requires patience, regulatory care, capital discipline, consistency and a deep understanding of consumer behaviour.",
      "He returned to the idea with a clearer standard and a longer-term vision. That vision became 3Tattava.",
    ],
  },
];

const PILLARS = [
  { name: "Balance", body: "Create stronger foundations through consistent routines around nourishment, movement, rest and recovery." },
  { name: "Build", body: "Develop the discipline and consistency required for meaningful, sustainable progress." },
  { name: "Become", body: "Continue evolving towards your personal potential\u2014without depending on shortcuts or exaggerated promises." },
];

const QUALITY_POINTS = [
  "Ingredient identity and sourcing documentation",
  "Applicable manufacturing licences and GMP documentation",
  "Batch-specific testing for defined quality and safety parameters",
  "Testing through independent NABL-accredited laboratories, where applicable",
  "Clear usage directions, cautions and traceability information",
  "Accessible batch documentation through QR-based systems, where available",
];

export default function AboutClient() {
  return (
    <main style={{ background: CREAM, color: INK, fontFamily: F }}>
      {/* Hero */}
      <section style={{ padding: "clamp(96px,13vw,160px) 24px clamp(48px,6vw,72px)", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <motion.p {...reveal} style={{ fontSize: 12, letterSpacing: ".28em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 18 }}>Our Story</motion.p>
        <motion.h1 {...reveal} style={{ fontSize: "clamp(34px,6vw,60px)", lineHeight: 1.05, fontWeight: 800, marginBottom: 18 }}>The 3Tattava Story</motion.h1>
        <motion.p {...reveal} style={{ fontSize: "clamp(17px,2.4vw,22px)", color: INK, fontWeight: 600, marginBottom: 26 }}>Built from Ayurveda. Designed for Modern Performance.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.75, color: MUTED, maxWidth: 720, margin: "0 auto 14px" }}>3Tattava was founded by Dr. Kashish Gupta, BAMS, with a clear purpose: to make authentic Ayurveda easier to understand, trust and integrate into modern life.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.75, color: MUTED, maxWidth: 720, margin: "0 auto 28px" }}>Rooted in classical principles and shaped by contemporary expectations of quality, transparency and usability, 3Tattava represents a disciplined approach to everyday wellbeing.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(18px,2.4vw,24px)", fontWeight: 800, color: GOLD, letterSpacing: ".02em" }}>Balance. Build. Become.</motion.p>
      </section>

      {/* Prose sections */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        {SECTIONS.map((s) => (
          <motion.section key={s.heading} {...reveal} style={{ padding: "clamp(28px,4vw,44px) 0", borderTop: "1px solid rgba(183,163,146,.35)" }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, marginBottom: 18, lineHeight: 1.2 }}>{s.heading}</h2>
            {s.paras.map((p, i) => (
              <p key={i} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, marginBottom: 14 }}>{p}</p>
            ))}
          </motion.section>
        ))}
      </div>

      {/* Performance Ayurveda pillars */}
      <section style={{ background: ESPRESSO, color: CREAM, padding: "clamp(56px,7vw,88px) 24px", marginTop: "clamp(40px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.h2 {...reveal} style={{ fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 800, textAlign: "center", marginBottom: 14 }}>What Performance Ayurveda Means to Us</motion.h2>
          <motion.p {...reveal} style={{ textAlign: "center", color: "rgba(247,240,226,.72)", maxWidth: 700, margin: "0 auto", lineHeight: 1.7, fontSize: "clamp(15px,1.7vw,17px)" }}>For 3Tattava, Performance Ayurveda is a philosophy\u2014not a promise of instant results. It is our way of making Ayurvedic principles relevant to people leading demanding lives: professionals, fitness enthusiasts, athletes and individuals committed to their long-term wellbeing.</motion.p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 40 }}>
            {PILLARS.map((p) => (
              <motion.div key={p.name} {...reveal} style={{ background: "rgba(247,240,226,.05)", border: "1px solid rgba(200,150,62,.3)", borderRadius: 12, padding: "28px 24px" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: GOLD_SOFT, marginBottom: 12 }}>{p.name}</p>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(247,240,226,.8)", margin: 0 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...reveal} style={{ textAlign: "center", color: "rgba(247,240,226,.65)", maxWidth: 720, margin: "36px auto 0", lineHeight: 1.7, fontSize: "clamp(14px,1.6vw,16px)" }}>Performance Ayurveda does not replace classical Ayurveda. It is 3Tattava&rsquo;s contemporary expression of its principles through responsible products, education and daily rituals.</motion.p>
        </div>
      </section>

      {/* Quality Before Claims */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(56px,7vw,88px) 24px" }}>
        <motion.h2 {...reveal} style={{ fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 800, marginBottom: 16 }}>Quality Before Claims</motion.h2>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, marginBottom: 12 }}>Trust cannot be built through marketing language alone.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, marginBottom: 20 }}>3Tattava is committed to communicating only those sourcing, manufacturing and testing statements that can be supported by current documentation. Depending on the product, this may include:</motion.p>
        <motion.ul {...reveal} style={{ listStyle: "none", display: "grid", gap: 12, marginBottom: 24, padding: 0 }}>
          {QUALITY_POINTS.map((q) => (
            <li key={q} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: "clamp(14px,1.6vw,16px)", lineHeight: 1.6, color: INK }}>
              <span style={{ color: GOLD, fontWeight: 800, flexShrink: 0 }}>&#10003;</span>{q}
            </li>
          ))}
        </motion.ul>
        <motion.p {...reveal} style={{ fontSize: 14, lineHeight: 1.7, color: MUTED, fontStyle: "italic", borderLeft: `2px solid ${GOLD}`, paddingLeft: 16, margin: 0 }}>A laboratory report relates only to the parameters and batch tested. It should never be presented as government approval, product certification or proof of a therapeutic outcome.</motion.p>
      </section>

      {/* Built for consistency */}
      <section style={{ background: "#fff", padding: "clamp(48px,6vw,72px) 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.h2 {...reveal} style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, marginBottom: 18 }}>Built for People Who Value Consistency</motion.h2>
          <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, marginBottom: 14 }}>3Tattava is inspired by people who show up consistently\u2014in their work, training, recovery and personal growth.</motion.p>
          <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, marginBottom: 14 }}>Its athlete and community collaborations are based on shared values such as preparation, resilience and discipline. These associations are not presented as evidence of medical benefits or guaranteed product outcomes.</motion.p>
          <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.8, color: MUTED, margin: 0 }}>They represent the mindset behind the brand: progress is built through consistent effort.</motion.p>
        </div>
      </section>

      {/* Founder note */}
      <section style={{ background: ESPRESSO, color: CREAM, padding: "clamp(56px,8vw,96px) 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <motion.div {...reveal} style={{ width: 84, height: 84, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28, fontWeight: 800, color: GOLD_SOFT, background: "rgba(200,150,62,.08)", letterSpacing: ".04em" }}>KG</motion.div>
          <motion.p {...reveal} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>A Note from the Founder</motion.p>
          <motion.blockquote {...reveal} style={{ fontSize: "clamp(19px,2.6vw,28px)", lineHeight: 1.5, fontWeight: 300, fontStyle: "italic", margin: "0 0 24px" }}>&ldquo;I founded 3Tattava to make Ayurveda easier to trust and practise in modern life. Our responsibility is not to promise shortcuts. It is to build with clarity, discipline and respect for the tradition.&rdquo;</motion.blockquote>
          <motion.p {...reveal} style={{ fontSize: 15, fontWeight: 700, color: GOLD_SOFT, margin: "0 0 2px" }}>&mdash; Dr. Kashish Gupta, BAMS</motion.p>
          <motion.p {...reveal} style={{ fontSize: 13, color: "rgba(247,240,226,.6)", margin: 0 }}>Founder, 3Tattava</motion.p>
        </div>
      </section>

      {/* Closing */}
      <section style={{ padding: "clamp(56px,7vw,88px) 24px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <motion.h2 {...reveal} style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 800, color: GOLD, marginBottom: 18 }}>Balance. Build. Become.</motion.h2>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.8, color: MUTED, marginBottom: 14 }}>Not overnight. Not through shortcuts.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.8, color: MUTED, marginBottom: 14 }}>Through informed choices, responsible products and daily rituals that can become part of real life.</motion.p>
        <motion.p {...reveal} style={{ fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.8, color: INK, fontWeight: 600, marginBottom: 32 }}>Balance your foundations. Build with consistency. Become through sustained progress.</motion.p>
        <motion.div {...reveal}>
          <Link href="/products" style={{ display: "inline-block", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", color: INK, fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", padding: "16px 34px", textDecoration: "none", borderRadius: 4 }}>Explore Our Rituals &rarr;</Link>
        </motion.div>
      </section>

      {/* Transparency Note */}
      <section style={{ background: CREAM, borderTop: "1px solid rgba(183,163,146,.35)", padding: "clamp(40px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h3 style={{ fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: MUTED, fontWeight: 700, marginBottom: 16 }}>Transparency Note</h3>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: MUTED, marginBottom: 12 }}>Dr. Kashish Gupta&rsquo;s former institutional roles and participation in national initiatives are mentioned solely as part of his professional biography. They do not imply any current government affiliation, preferential relationship, endorsement, certification or approval of 3Tattava or its products.</p>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: MUTED, marginBottom: 12 }}>The Guinness World Records associated with the Desh Ka Prakriti Parikshan Abhiyaan were achieved collectively by the campaign and its organising institutions. 3Tattava does not claim that Dr. Kashish Gupta personally holds a Guinness World Record.</p>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: MUTED, margin: 0 }}>Product information is intended for general awareness. Consumers should follow the product label and seek guidance from an appropriately qualified healthcare professional when required.</p>
        </div>
      </section>
    </main>
  );
}
