"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import BgVideo from "@/components/ui/BgVideo";

const FONT = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 22 } as const;
const GOLD = "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)";
const GOLD_BORDER = "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)";

// ─── DATA ────────────────────────────────────────────────────────────────────

const LAB_RESULTS = [
  {
    test: "Purity Verification",
    icon: "◎",
    result: "PASSED",
    detail: "Fulvic acid content ≥70% · zero adulterant markers detected.",
  },
  {
    test: "Heavy Metal Testing",
    icon: "⚗",
    result: "PASSED",
    detail: "Arsenic · Lead · Mercury · Cadmium — all within WHO/AYUSH limits.",
  },
  {
    test: "Microbial Safety",
    icon: "🛡",
    result: "PASSED",
    detail: "Total plate count · E. coli · Salmonella — all within safety standards.",
  },
  {
    test: "Identity Verification",
    icon: "◈",
    result: "PASSED",
    detail: "100% Asphaltum Punjabanum (Himalayan Shilajit). No substitution detected.",
  },
];

// ─── LAB REPORT CONFIG ───────────────────────────────────────────────────────
// Drop the public PDF URL (or /lab-reports/<file>.pdf) into pdfUrl below and the
// "View … COA" buttons open it inline. Empty pdfUrl shows a tasteful pending state.
interface LabReport { id: string; label: string; pdfUrl: string }
const LAB_REPORTS: Record<"rockresin" | "shahjeet", LabReport> = {
  rockresin: { id: "rockresin", label: "RockResin — Eurofins NABL Certificate of Analysis", pdfUrl: "/lab-reports/rockresin-coa.pdf" },
  shahjeet:  { id: "shahjeet",  label: "Shahjeet — Full NABL Certificate of Analysis",  pdfUrl: "" },
};

const PILLARS = [
  {
    num: "01",
    icon: "⛰️",
    title: "Himalayan Sourcing",
    badge: "Above 16,000 ft",
    partner: "Primary Mineral Deposit",
    desc: "Raw Shilajit sourced exclusively from primary deposits above 16,000 ft in the Himalayan range. No valley-floor scraping. No industrial corridor proximity. Altitude determines mineral density and heavy metal exposure profile.",
    detail: "Primary Himalayan deposits formed over 50+ million years of geological compression. Fulvic acid concentration is directly correlated with source altitude and geological age. We do not source from secondary deposits.",
  },
  {
    num: "02",
    icon: "🌿",
    title: "Classical Shodhana",
    badge: "Classical Shodhit",
    partner: "Triphala Purification Protocol",
    desc: "Shodhan is the purification process prescribed in classical Ayurvedic texts — Charaka Samhita and Ashtanga Hridayam — to remove impurities from raw Shilajit before therapeutic use.",
    detail: "We use Triphala decoction for Shodhana — a three-fruit Ayurvedic compound (Amla, Haritaki, Bibhitaki) that binds and removes heavy metals and organic contaminants. This is the classical process, not a modern workaround.",
  },
  {
    num: "03",
    icon: "🔬",
    title: "NABL 3rd-Party Lab",
    badge: "NABL Accredited",
    partner: "Eurofins Scientific",
    desc: "Every batch is tested by an NABL-accredited independent laboratory — Eurofins Scientific. Not an in-house lab. Not a self-certification. An independent third party with no commercial interest in the result.",
    detail: "Tests: Fulvic acid content (≥60% benchmark), heavy metals (As, Pb, Hg, Cd), microbial load (TPC, E. coli, Salmonella), moisture content, adulterant screening. QR code on every jar links to the batch-specific COA.",
  },
  {
    num: "04",
    icon: "🏛️",
    title: "US-FDA Registered",
    badge: "US-FDA Registered",
    partner: "International Compliance",
    desc: "Our manufacturing facility is registered with the US Food and Drug Administration. This is a facility-level registration that subjects the plant to US FDA audit standards.",
    detail: "US-FDA registration is not required for India-only distribution — we pursue it because it represents the highest internationally recognised facility standard and signals our commitment to global-grade manufacturing.",
  },
  {
    num: "05",
    icon: "✅",
    title: "AYUSH-GMP Certified",
    badge: "AYUSH-GMP",
    partner: "Mfg. Lic. No. RJ-926AYU E",
    desc: "Manufactured at an AYUSH-GMP certified facility — the Good Manufacturing Practice standard set by the Ministry of AYUSH, Government of India, for Ayurvedic products.",
    detail: "GMP certification covers manufacturing environment, equipment calibration, batch documentation, quality control procedures, and staff training. This is the baseline standard — not a marketing claim.",
  },
  {
    num: "06",
    icon: "📋",
    title: "Transparency First",
    badge: "QR-Verified",
    partner: "Batch-Level Verification",
    desc: "Every ROCKRESIN jar carries a QR code that links to the NABL Certificate of Analysis for that specific batch. Not a generic certificate. Not a brand COA. The exact batch you purchased.",
    detail: "Scan the QR on your jar → view the COA for batch #, fulvic acid %, heavy metal results, microbial results, and the Eurofins report PDF. Full chain of custody visible to every customer.",
  },
];

const COMPLIANCE_BADGES = [
  { label: "NABL Accredited", sub: "Eurofins Scientific" },
  { label: "AYUSH-GMP Certified", sub: "Ministry of AYUSH" },
  { label: "US-FDA Registered", sub: "Facility Level" },
  { label: "Heavy Metal Tested", sub: "As · Pb · Hg · Cd" },
  { label: "Microbial Screened", sub: "E. coli · Salmonella" },
  { label: "Classical Shodhit", sub: "Triphala Decoction" },
];

// ─── CITED RESEARCH ──────────────────────────────────────────────────────────
// Every study links to its primary source on PubMed. Strength is stated honestly
// (single RCT → mechanistic/no-human-trial). All were run on Shilajit or Triphala
// as INGREDIENTS — not on our finished products (see the honesty note in-section).
type Strength = "Moderate" | "Limited" | "Review" | "Mechanistic";
interface Study { topic: string; finding: string; strength: Strength; sources: { label: string; url: string }[] }
const STRENGTH_COLOR: Record<Strength, string> = {
  Moderate: "#cd872a",
  Limited: "#b07d2b",
  Review: "#8a7355",
  Mechanistic: "#b7a392",
};
const SHILAJIT_STUDIES: Study[] = [
  { topic: "Testosterone (men 45–55)", finding: "A randomised, placebo-controlled trial found purified Shilajit (250 mg ×2/day, 90 days) raised total and free testosterone in men aged 45–55. One trial, older men.", strength: "Moderate", sources: [{ label: "Pandit 2016 · Andrologia · PMID 26395129", url: "https://pubmed.ncbi.nlm.nih.gov/26395129/" }] },
  { topic: "Strength & connective tissue", finding: "An 8-week RCT found 500 mg/day helped retain strength after fatigue and lowered a collagen-breakdown marker.", strength: "Moderate", sources: [{ label: "Keller 2019 · J Int Soc Sports Nutr · PMID 30728074", url: "https://pubmed.ncbi.nlm.nih.gov/30728074/" }] },
  { topic: "Muscle recovery (mechanism)", finding: "Shilajit upregulated collagen and extracellular-matrix genes in human muscle — a plausible recovery mechanism.", strength: "Limited", sources: [{ label: "Das 2016 · J Med Food · PMID 27414521", url: "https://pubmed.ncbi.nlm.nih.gov/27414521/" }] },
  { topic: "Male fertility", finding: "An uncontrolled trial in men with low sperm counts reported improved sperm parameters — promising, but no placebo group.", strength: "Limited", sources: [{ label: "Biswas 2010 · Andrologia · PMID 20078516", url: "https://pubmed.ncbi.nlm.nih.gov/20078516/" }] },
  { topic: "Safety, antioxidant, anti-fatigue", finding: "A review documents antioxidant, adaptogenic and anti-fatigue signals, with fulvic acid and DBPs as key actives; it stresses purification.", strength: "Review", sources: [{ label: "Stohs 2014 · Phytother Res · PMID 23733436", url: "https://pubmed.ncbi.nlm.nih.gov/23733436/" }] },
  { topic: "Composition & standardisation", finding: "Characterises fulvic acid, dibenzo-\u03b1-pyrones and minerals — the basis for identity and standardisation.", strength: "Review", sources: [{ label: "Agarwal 2007 · Phytother Res · PMID 17295385", url: "https://pubmed.ncbi.nlm.nih.gov/17295385/" }] },
  { topic: "Cognition", finding: "Mechanism only — a review proposes fulvic acid may be pro-cognitive, and lab work shows it interferes with tau aggregation. No human trial exists.", strength: "Mechanistic", sources: [{ label: "Carrasco-Gallardo 2012 · PMID 22482077", url: "https://pubmed.ncbi.nlm.nih.gov/22482077/" }, { label: "Cornejo 2011 · PMID 21785188", url: "https://pubmed.ncbi.nlm.nih.gov/21785188/" }] },
  { topic: "Bone (mechanism)", finding: "In a lab study, Shilajit accelerated bone-cell formation from human stem cells. In-vitro only — not a clinical bone result.", strength: "Mechanistic", sources: [{ label: "Kangari 2022 · J Orthop Surg Res · PMID 36153551", url: "https://pubmed.ncbi.nlm.nih.gov/36153551/" }] },
];
const TRIPHALA_STUDIES: Study[] = [
  { topic: "Gut microbiome", finding: "A double-blind RCT pilot found Triphala shifted some gut-bacteria measures — but effects were highly individualised.", strength: "Limited", sources: [{ label: "Peterson 2020 · J Altern Complement Med · PMID 32955913", url: "https://pubmed.ncbi.nlm.nih.gov/32955913/" }] },
  { topic: "Oral health", finding: "An RCT found a Triphala mouthwash reduced plaque and gingivitis comparably to chlorhexidine (topical use).", strength: "Moderate", sources: [{ label: "Pradeep 2016 · J Periodontol · PMID 27442086", url: "https://pubmed.ncbi.nlm.nih.gov/27442086/" }] },
  { topic: "Overview (digestion, antioxidant)", finding: "A review summarises digestive, antioxidant and antimicrobial rationale — mostly preclinical.", strength: "Review", sources: [{ label: "Peterson 2017 · J Altern Complement Med · PMID 28696777", url: "https://pubmed.ncbi.nlm.nih.gov/28696777/" }] },
];

function StudyCard({ s, idx }: { s: Study; idx: number }) {
  const color = STRENGTH_COLOR[s.strength];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (idx % 3) * 0.06, ease: EASE }}
      style={{ background: "#fff", border: "1px solid rgba(28,19,4,.08)", borderLeft: `3px solid ${color}`, padding: "22px 24px", display: "flex", flexDirection: "column", boxShadow: "0 1px 4px rgba(28,19,4,.05)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
        <h4 style={{ fontFamily: FONT, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 15.5, lineHeight: 1.3, color: "#442a1b", margin: 0 }}>{s.topic}</h4>
        <span style={{ flexShrink: 0, fontFamily: FONT, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", fontVariationSettings: "'wght' 700", color, background: `${color}18`, border: `1px solid ${color}55`, padding: "3px 8px", whiteSpace: "nowrap" }}>{s.strength}</span>
      </div>
      <p style={{ fontFamily: FONT, fontVariationSettings: "'wght' 300", fontSize: 13.5, lineHeight: 1.6, color: "rgba(28,19,4,.66)", margin: "0 0 16px", flex: 1 }}>{s.finding}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {s.sources.map((src) => (
          <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: 12, fontVariationSettings: "'wght' 600", color: "#a67b2f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
            {src.label}
            <span aria-hidden style={{ fontSize: 11 }}>↗</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

// ─── BACKGROUND MANDALA ──────────────────────────────────────────────────────

function HeroBg() {
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes rt-spin  { to { transform:rotate(360deg); } }
        @keyframes rt-scan  { 0%{top:8%} 100%{top:92%} }
        @keyframes rt-pulse { 0%,100%{opacity:.15} 50%{opacity:.55} }
        @keyframes rt-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>

      {/* Large mandala */}
      <div style={{
        position:"absolute", top:"-60px", right:"-60px",
        width:"560px", height:"560px",
        animation:"rt-spin 220s linear infinite",
        opacity:.05, pointerEvents:"none", zIndex:0,
      }}>
        <svg viewBox="0 0 560 560">
          {[46,92,138,184,228,262].map((r,i)=>(
            <circle key={r} cx={280} cy={280} r={r} fill="none" stroke="#E4C079" strokeWidth={i%2===0?1.2:.5}/>
          ))}
          {Array.from({length:16}).map((_,i)=>(
            <line key={i} x1={280} y1={10} x2={280} y2={550} stroke="#E4C079" strokeWidth={.35} transform={`rotate(${i*22.5} 280 280)`}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <ellipse key={i} cx={280} cy={130} rx={22} ry={80} fill="none" stroke="#E4C079" strokeWidth={.45} transform={`rotate(${i*45} 280 280)`}/>
          ))}
        </svg>
      </div>

      {/* Particles */}
      {([
        {top:"20%",left:"3%",  s:4, d:"rt-float 7s ease-in-out infinite"},
        {top:"55%",left:"2%",  s:3, d:"rt-pulse 5s ease-in-out infinite"},
        {top:"75%",right:"4%", s:5, d:"rt-float 9s ease-in-out infinite 1.5s"},
        {top:"30%",right:"5%", s:3, d:"rt-pulse 6s ease-in-out infinite .8s"},
      ] as Array<{top:string;left?:string;right?:string;s:number;d:string}>).map((p,i)=>(
        <div key={i} style={{
          position:"absolute",top:p.top,left:p.left,right:p.right,
          width:p.s,height:p.s,borderRadius:"50%",
          background:"radial-gradient(circle,#E4C079,#cd872a)",
          animation:p.d,pointerEvents:"none",zIndex:0,
        }}/>
      ))}
    </>
  );
}

// ─── SCAN QR ELEMENT ─────────────────────────────────────────────────────────

function ScanElement() {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",gap:"16px",
      border:"1px solid rgba(205,135,42,.35)",
      background:"rgba(205,135,42,.06)",
      padding:"14px 22px",
    }}>
      {/* QR placeholder */}
      <div style={{
        width:"56px",height:"56px",position:"relative",flexShrink:0,
        border:"1.5px solid rgba(205,135,42,.50)",
      }}>
        {/* QR grid pattern */}
        <svg viewBox="0 0 56 56" width="56" height="56">
          <rect x="4" y="4" width="18" height="18" rx="1" fill="none" stroke="#cd872a" strokeWidth="1.5"/>
          <rect x="8" y="8" width="10" height="10" rx="0.5" fill="#cd872a" opacity=".8"/>
          <rect x="34" y="4" width="18" height="18" rx="1" fill="none" stroke="#cd872a" strokeWidth="1.5"/>
          <rect x="38" y="8" width="10" height="10" rx="0.5" fill="#cd872a" opacity=".8"/>
          <rect x="4" y="34" width="18" height="18" rx="1" fill="none" stroke="#cd872a" strokeWidth="1.5"/>
          <rect x="8" y="38" width="10" height="10" rx="0.5" fill="#cd872a" opacity=".8"/>
          <g stroke="#cd872a" strokeWidth="1" opacity=".6">
            {[34,38,42,46].map(x=>[28,32,36,40,44,48].map(y=>(
              <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx=".3"/>
            )))}
          </g>
        </svg>
        {/* Scanning line */}
        <div style={{
          position:"absolute",left:"4px",right:"4px",height:"1.5px",
          background:"linear-gradient(90deg,transparent,#E4C079,transparent)",
          animation:"rt-scan 2s ease-in-out infinite alternate",
          boxShadow:"0 0 8px rgba(228,192,121,.8)",
        }}/>
      </div>
      <div>
        <div style={{
          fontSize:"14px",fontVariationSettings:"'wdth' 85,'wght' 700",
          fontFamily:FONT,
          letterSpacing:".05em",color:"#E4C079",marginBottom:"2px",
        }}>
          Scan · Verify · Trust
        </div>
        <div style={{
          fontSize:"11px",fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,
          color:"rgba(247,240,226,.50)",lineHeight:1.5,
        }}>
          Every jar carries a batch-specific QR<br/>linked to the NABL Certificate of Analysis
        </div>
      </div>
    </div>
  );
}

// ─── PASSED CARD ─────────────────────────────────────────────────────────────

function PassedCard({ item, idx }: { item:typeof LAB_RESULTS[0]; idx:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-40px" });
  const [shown, setShown] = useState(false);

  useEffect(()=>{ if (inView) setTimeout(()=>setShown(true), idx*120); },[inView,idx]);

  return (
    <motion.div
      ref={ref}
      initial={{opacity:0,y:32}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.5,delay:idx*.1,ease:EASE}}
      whileHover={{ y:-5, boxShadow:"0 20px 48px rgba(205,135,42,.16),0 4px 16px rgba(28,19,4,.08)" }}
      style={{
        background:"#fff",
        border:"1px solid rgba(183,163,146,.28)",
        borderRadius:"4px",
        padding:"28px 24px",
        position:"relative",overflow:"hidden",cursor:"default",
        boxShadow:"0 1px 4px rgba(28,19,4,.05)",
        transition:"box-shadow .3s,transform .3s",
        fontFamily:FONT,
      }}
    >
      {/* Top gold bar */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2.5px",
        background:GOLD_BORDER,
      }}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
        <div style={{
          fontVariationSettings:"'wdth' 85,'wght' 700",
          fontSize:"17px",color:"#442a1b",flex:1,lineHeight:1.3,
        }}>
          {item.test}
        </div>

        {/* Animated PASSED badge */}
        <AnimatePresence>
          {shown && (
            <motion.div
              initial={{scale:0,rotate:-20}}
              animate={{scale:1,rotate:0}}
              transition={{type:"spring",stiffness:400,damping:18}}
              style={{
                display:"flex",alignItems:"center",gap:"5px",
                background:"rgba(22,101,52,.09)",
                border:"1px solid rgba(22,101,52,.30)",
                padding:"4px 10px",borderRadius:"2px",flexShrink:0,marginLeft:"10px",
              }}
            >
              <motion.span
                initial={{scale:0}}
                animate={{scale:1}}
                transition={{type:"spring",stiffness:600,damping:15,delay:.1}}
                style={{fontSize:"12px"}}
              >
                ✓
              </motion.span>
              <span style={{
                fontSize:"9px",letterSpacing:".18em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 700",
                color:"#166534",
              }}>
                Passed
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        fontSize:"24px",marginBottom:"12px",opacity:.6,
      }}>
        {item.icon}
      </div>

      <p style={{
        fontSize:"12.5px",lineHeight:1.65,
        color:"rgba(28,19,4,.55)",
        fontVariationSettings:"'wdth' 100,'wght' 300",
      }}>
        {item.detail}
      </p>
    </motion.div>
  );
}

// ─── 3D TILT PILLAR CARD ─────────────────────────────────────────────────────

function PillarCard({ p, idx }: { p:typeof PILLARS[0]; idx:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);
  const springRX = useSpring(rotateX, { stiffness:300, damping:28 });
  const springRY = useSpring(rotateY, { stiffness:300, damping:28 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width/2) / rect.width);
    y.set((e.clientY - rect.top - rect.height/2) / rect.height);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{opacity:0,y:36}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.55,delay:idx*.08,ease:EASE}}
      onMouseMove={onMove}
      onMouseLeave={()=>{ onLeave(); setHov(false); }}
      onMouseEnter={()=>setHov(true)}
      style={{
        rotateX:springRX,rotateY:springRY,
        transformStyle:"preserve-3d",perspective:900,
        fontFamily:FONT,
      }}
    >
      <div style={{
        background:"#fff",
        border:hov?"1.5px solid rgba(205,135,42,.55)":"1px solid rgba(183,163,146,.28)",
        borderRadius:"4px",
        padding:"32px 28px",
        position:"relative",overflow:"hidden",
        boxShadow:hov
          ?"0 24px 56px rgba(205,135,42,.16),0 6px 20px rgba(28,19,4,.09)"
          :"0 1px 4px rgba(28,19,4,.05)",
        transition:"border .25s,box-shadow .28s",
        height:"100%",
      }}>
        {/* Gold top bar */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"2.5px",
          background:GOLD_BORDER,
          opacity:hov?1:0,transition:"opacity .25s",
        }}/>

        {/* Large faded number */}
        <div style={{
          position:"absolute",top:"12px",right:"16px",
          fontVariationSettings:"'wdth' 85,'wght' 900",
          fontSize:"68px",lineHeight:1,
          color:"rgba(205,135,42,.08)",
          pointerEvents:"none",userSelect:"none",
        }}>
          {p.num}
        </div>

        <div style={{fontSize:"26px",marginBottom:"12px"}}>{p.icon}</div>

        <h3 style={{
          fontVariationSettings:"'wdth' 85,'wght' 700",
          fontSize:"18px",color:"#442a1b",marginBottom:"6px",lineHeight:1.3,
        }}>
          {p.title}
        </h3>

        <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"14px",flexWrap:"wrap"}}>
          <span style={{
            fontSize:"9px",letterSpacing:".18em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            color:"#cd872a",
            background:"rgba(205,135,42,.10)",
            border:"1px solid rgba(205,135,42,.28)",
            padding:"3px 8px",
          }}>
            {p.badge}
          </span>
          <span style={{
            fontSize:"9px",letterSpacing:".12em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 400",
            color:"rgba(28,19,4,.35)",
          }}>
            {p.partner}
          </span>
        </div>

        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 400",
          fontSize:"13.5px",lineHeight:1.7,
          color:"rgba(28,19,4,.68)",marginBottom:"14px",
        }}>
          {p.desc}
        </p>

        <div style={{
          borderLeft:"2px solid rgba(205,135,42,.35)",
          paddingLeft:"14px",
          background:"rgba(28,19,4,.02)",
          padding:"10px 12px 10px 14px",
        }}>
          <p style={{
            fontVariationSettings:"'wdth' 100,'wght' 300",
            fontSize:"12px",lineHeight:1.7,
            color:"rgba(28,19,4,.48)",
          }}>
            {p.detail}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ANIMATED DATA BAR ───────────────────────────────────────────────────────

function DataBar({ label, value, pct }: { label:string; value:string; pct:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true });

  return (
    <div ref={ref} style={{marginBottom:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
        <span style={{
          fontSize:"12px",fontVariationSettings:"'wdth' 75,'wght' 500",
          fontFamily:FONT,
          color:"rgba(28,19,4,.65)",letterSpacing:".06em",textTransform:"uppercase",
        }}>
          {label}
        </span>
        <span style={{
          fontSize:"13px",fontVariationSettings:"'wdth' 85,'wght' 700",
          fontFamily:FONT,
          color:"#442a1b",
        }}>
          {value}
        </span>
      </div>
      <div style={{height:"6px",background:"rgba(183,163,146,.25)",borderRadius:"3px",overflow:"hidden"}}>
        <motion.div
          initial={{width:"0%"}}
          animate={inView?{width:`${pct}%`}:{}}
          transition={{duration:1.2,delay:.2,ease:[.16,1,.3,1]}}
          style={{
            height:"100%",borderRadius:"3px",
            background:GOLD_BORDER,
          }}
        />
      </div>
    </div>
  );
}

// ─── POPABLE BUTTON ──────────────────────────────────────────────────────────

function PopButton({
  href, onClick, children, variant = "gold",
}: {
  href?: string; onClick?: () => void; children: React.ReactNode; variant?: "gold" | "ghost";
}) {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: variant === "gold" ? "linear-gradient(145deg,#cd872a,#A67B2F)" : "transparent",
    color: variant === "gold" ? "#442a1b" : "#f7f0e2",
    fontVariationSettings: "'wdth' 85,'wght' 700", fontFamily: FONT,
    fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase",
    padding: "15px 36px", textDecoration: "none",
    border: variant === "ghost" ? "1.5px solid rgba(247,240,226,.30)" : "none",
    cursor: "pointer",
  };
  const hover = { scale: 1.06, y: -3, boxShadow: variant === "gold" ? "0 12px 32px rgba(205,135,42,.45)" : "0 8px 24px rgba(28,19,4,.18)" };
  if (onClick) {
    return (
      <motion.button type="button" onClick={onClick} whileHover={hover} whileTap={{ scale: 0.96 }} transition={SPRING} style={style}>
        {children}
      </motion.button>
    );
  }
  return (
    <motion.a href={href} whileHover={hover} whileTap={{ scale: 0.96 }} transition={SPRING} style={style}>
      {children}
    </motion.a>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

function LabReportModal({ report, onClose }: { report: LabReport | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {report && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(26,18,8,.72)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.35, ease: EASE }}
            style={{ width: "min(880px,96vw)", height: "min(80vh,820px)", background: "#f7f0e2", borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", background: "#442a1b" }}>
              <p style={{ fontFamily: FONT, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 13, color: "#f7f0e2", margin: 0 }}>{report.label}</p>
              <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "#cd872a", fontSize: 22, lineHeight: 1, cursor: "pointer" }}>×</button>
            </div>
            {report.pdfUrl ? (
              <iframe title={report.label} src={report.pdfUrl} style={{ flex: 1, width: "100%", border: "none", background: "#fff" }} />
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 28px", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(205,135,42,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </div>
                <p style={{ fontFamily: FONT, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 18, color: "#442a1b", margin: 0 }}>Report being finalized</p>
                <p style={{ fontFamily: FONT, fontSize: 13.5, lineHeight: 1.6, color: "#6f5a48", maxWidth: 380, margin: 0 }}>The full NABL Certificate of Analysis for this batch will be available here shortly. For immediate access, request it from our team.</p>
                <a href="mailto:orders@3tattava.com" style={{ fontFamily: FONT, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "12px 22px", textDecoration: "none" }}>Request the COA →</a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function ResearchClient() {
  const complianceRef = useRef<HTMLElement>(null);
  const eduRef = useRef<HTMLElement>(null);
  const compInView = useInView(complianceRef, { once:true, margin:"-60px" });
  const eduInView   = useInView(eduRef,       { once:true, margin:"-60px" });
  const [report, setReport] = useState<LabReport | null>(null);

  return (
    <div style={{fontFamily:FONT,color:"#442a1b"}}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        position:"relative",overflow:"hidden",
        background:"url('/posters/research/1.jpg') center/cover no-repeat #442a1b",
        padding:"96px 24px 80px",textAlign:"center",
      }}>
        <BgVideo src="/videos/research-hero.mp4" />
        {/* Dark overlay to keep light text readable over lab banner */}
        <div style={{position:"absolute",inset:0,background:"rgba(20,14,4,0.72)",zIndex:0}}/>
        <HeroBg/>
        <div style={{position:"relative",zIndex:1,maxWidth:"780px",margin:"0 auto"}}>
          <motion.p
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,ease:EASE}}
            style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#cd872a",marginBottom:"20px",
            }}
          >
            Evidence Before Claims™
          </motion.p>

          <motion.h1
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:.65,delay:.1,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontFamily:FONT,
              fontSize:"clamp(36px,6.5vw,72px)",
              lineHeight:1.05,letterSpacing:"-.025em",
              color:"#f7f0e2",marginBottom:"20px",
            }}
          >
            Ancient Wisdom Deserves<br/>
            <span style={{
              background:GOLD,backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>
              Modern Verification.
            </span>
          </motion.h1>

          <motion.p
            initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
            transition={{duration:.55,delay:.22,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"clamp(14px,2vw,17px)",lineHeight:1.65,
              color:"rgba(247,240,226,.60)",
              maxWidth:"520px",margin:"0 auto 12px",
            }}
          >
            We do not make claims and then find evidence. We start with evidence and then make claims. Every batch. Every product. No exceptions.
          </motion.p>

          <motion.p
            initial={{opacity:0}} animate={{opacity:1}}
            transition={{duration:.5,delay:.35,ease:EASE}}
            style={{
              fontSize:"13px",fontStyle:"italic",
              color:"rgba(247,240,226,.38)",
              fontVariationSettings:"'wdth' 100,'wght' 400",
              fontFamily:FONT,
              marginBottom:"40px",
            }}
          >
            — Dr. Kashish Gupta, BAMS · Founder, 3TATTAVA
          </motion.p>

          <motion.div
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,delay:.44,ease:EASE}}
            style={{display:"flex",justifyContent:"center"}}
          >
            <ScanElement/>
          </motion.div>
        </div>
      </section>

      {/* ── LAB RESULTS ──────────────────────────────────────────────────── */}
      <section style={{background:"#f7f0e2",padding:"80px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-60px"}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"52px"}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#cd872a",marginBottom:"12px",
            }}>
              Batch Lab Results · ROCKRESIN
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(24px,3.5vw,38px)",
              letterSpacing:"-.02em",lineHeight:1.1,color:"#442a1b",
            }}>
              <img src="/icons/lab-flask.svg" alt="" role="presentation" width={20} height={20} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }} />Four Tests. Four Passes.
            </h2>
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
            gap:"20px",
          }}>
            {LAB_RESULTS.map((item,i)=>(
              <PassedCard key={item.test} item={item} idx={i}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE BADGES ────────────────────────────────────────────── */}
      <section ref={complianceRef} style={{background:"#fff",padding:"48px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{
            display:"flex",flexWrap:"wrap",gap:"10px",justifyContent:"center",
          }}>
            {COMPLIANCE_BADGES.map((b,i)=>(
              <motion.div
                key={b.label}
                initial={{opacity:0,scale:.92}}
                animate={compInView?{opacity:1,scale:1}:{}}
                transition={{duration:.4,delay:i*.07,ease:EASE}}
                whileHover={{ scale:1.07, y:-2, boxShadow:"0 8px 24px rgba(205,135,42,.20)" }}
                whileTap={{ scale:.96 }}
                style={{
                  background:"#fff",
                  border:"1px solid rgba(205,135,42,.35)",
                  padding:"12px 20px",textAlign:"center",
                  minWidth:"148px",cursor:"default",
                  boxShadow:"0 1px 4px rgba(28,19,4,.05)",
                }}
              >
                <p style={{
                  fontSize:"10.5px",letterSpacing:".08em",
                  fontVariationSettings:"'wdth' 85,'wght' 700",
                  fontFamily:FONT,
                  color:"#442a1b",marginBottom:"3px",
                }}>
                  ✓ {b.label}
                </p>
                <p style={{
                  fontSize:"10px",
                  color:"rgba(28,19,4,.40)",
                  fontVariationSettings:"'wdth' 75,'wght' 400",
                  fontFamily:FONT,
                }}>
                  {b.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX PILLAR CARDS ─────────────────────────────────────────────── */}
      <section style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-60px"}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"60px"}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#cd872a",marginBottom:"12px",
            }}>
              Our Protocol
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(26px,3.5vw,40px)",
              letterSpacing:"-.02em",lineHeight:1.1,color:"#442a1b",marginBottom:"14px",
            }}>
              <img src="/icons/lab-microscope.svg" alt="" role="presentation" width={20} height={20} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }} />Six Layers of Verification
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"15px",color:"rgba(28,19,4,.52)",
              maxWidth:"440px",margin:"0 auto",lineHeight:1.65,
            }}>
              Hover each card to see 3D depth. Every pillar is independently verifiable.
            </p>
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
            gap:"20px",
          }}>
            {PILLARS.map((p,i)=>(
              <PillarCard key={p.num} p={p} idx={i}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TESTING MATTERS ──────────────────────────────────────────── */}
      <section ref={eduRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{
          maxWidth:"1100px",margin:"0 auto",
          display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",
          gap:"72px",alignItems:"center",
        }}>
          {/* Left: pull quote */}
          <motion.div
            initial={{opacity:0,x:-32}}
            animate={eduInView?{opacity:1,x:0}:{}}
            transition={{duration:.65,ease:EASE}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#cd872a",marginBottom:"20px",
            }}>
              <img src="/icons/lab-test-tube.svg" alt="" role="presentation" width={20} height={20} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }} />Why Testing Matters
            </p>
            <blockquote style={{
              borderLeft:"3px solid #cd872a",paddingLeft:"24px",margin:0,
            }}>
              <p style={{
                fontVariationSettings:"'wdth' 85,'wght' 600",
                fontFamily:FONT,
                fontSize:"clamp(18px,2.5vw,26px)",
                lineHeight:1.45,color:"#442a1b",
                fontStyle:"italic",marginBottom:"16px",
              }}>
                &ldquo;Not all Shilajit is created equal. Source quality, purification methods, and laboratory verification all influence product quality and consistency.&rdquo;
              </p>
              <cite style={{
                fontSize:"12px",color:"#cd872a",
                fontVariationSettings:"'wdth' 75,'wght' 600",
                fontFamily:FONT,
                letterSpacing:".08em",fontStyle:"normal",
              }}>
                — Evidence Before Claims™ · 3TATTAVA
              </cite>
            </blockquote>

            <div style={{
              marginTop:"32px",padding:"20px 24px",
              background:"#f7f0e2",
              border:"1px solid rgba(183,163,146,.28)",
            }}>
              <p style={{
                fontVariationSettings:"'wdth' 100,'wght' 300",
                fontFamily:FONT,
                fontSize:"13px",lineHeight:1.7,color:"rgba(28,19,4,.62)",
              }}>
                The Shilajit supplement category has minimal regulatory enforcement. This creates a market where brand claims often go unverified. Our protocol exists precisely because we cannot assume other brands meet our standard.
              </p>
            </div>
          </motion.div>

          {/* Right: animated bars */}
          <motion.div
            initial={{opacity:0,x:32}}
            animate={eduInView?{opacity:1,x:0}:{}}
            transition={{duration:.65,delay:.12,ease:EASE}}
          >
            <h3 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"20px",color:"#442a1b",marginBottom:"32px",letterSpacing:"-.01em",
            }}>
              ROCKRESIN Batch Performance
            </h3>
            <DataBar label="Fulvic Acid Content"         value="≥70%"  pct={70}/>
            <DataBar label="Heavy Metal Safety"           value="100%"  pct={100}/>
            <DataBar label="Microbial Safety"             value="100%"  pct={100}/>
            <DataBar label="Batch Consistency (3 batches)" value="100%" pct={100}/>

            <p style={{
              fontSize:"11px",color:"rgba(28,19,4,.38)",
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              lineHeight:1.65,marginTop:"20px",
            }}>
              Data from NABL-accredited Eurofins Scientific lab reports (Batch #RK2024-08 and subsequent). Full COA available on request.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── THE SCIENCE, CITED ───────────────────────────────────────────── */}
      <section style={{ background:"#f7f0e2", padding:"88px 24px", borderTop:"1px solid rgba(28,19,4,.07)" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <motion.div
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-60px"}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"52px"}}
          >
            <p style={{ fontSize:"10px", letterSpacing:".32em", textTransform:"uppercase", fontVariationSettings:"'wdth' 75,'wght' 500", fontFamily:FONT, color:"#cd872a", marginBottom:"12px" }}>
              The Evidence, Cited
            </p>
            <h2 style={{ fontVariationSettings:"'wdth' 85,'wght' 700", fontFamily:FONT, fontSize:"clamp(26px,3.5vw,40px)", letterSpacing:"-.02em", lineHeight:1.1, color:"#442a1b", marginBottom:"14px" }}>
              The Research Behind Our Ingredients
            </h2>
            <p style={{ fontVariationSettings:"'wdth' 100,'wght' 300", fontFamily:FONT, fontSize:"15px", color:"rgba(28,19,4,.55)", maxWidth:"600px", margin:"0 auto", lineHeight:1.65 }}>
              We separate two things most brands blur: how strong the evidence is, and whether it is about the ingredient or our specific product. Every study below links to its primary source — read it yourself.
            </p>
          </motion.div>

          <h3 style={{ fontFamily:FONT, fontVariationSettings:"'wdth' 85,'wght' 700", fontSize:"18px", color:"#442a1b", letterSpacing:".02em", margin:"0 0 20px", display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ width:8, height:8, background:"#cd872a", display:"inline-block" }} />Shilajit
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"16px", marginBottom:"48px" }}>
            {SHILAJIT_STUDIES.map((s,i)=>(<StudyCard key={s.topic} s={s} idx={i}/>))}
          </div>

          <h3 style={{ fontFamily:FONT, fontVariationSettings:"'wdth' 85,'wght' 700", fontSize:"18px", color:"#442a1b", letterSpacing:".02em", margin:"0 0 20px", display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ width:8, height:8, background:"#6b8e4e", display:"inline-block" }} />Triphala
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"16px" }}>
            {TRIPHALA_STUDIES.map((s,i)=>(<StudyCard key={s.topic} s={s} idx={i}/>))}
          </div>

          <motion.div
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-40px"}}
            transition={{duration:.5,ease:EASE}}
            style={{ marginTop:"40px", padding:"28px 30px", background:"#fff", border:"1px solid rgba(183,163,146,.32)", borderLeft:"3px solid #cd872a" }}
          >
            <p style={{ fontFamily:FONT, fontVariationSettings:"'wdth' 85,'wght' 700", fontSize:"13px", letterSpacing:".04em", textTransform:"uppercase", color:"#442a1b", margin:"0 0 10px" }}>
              The honest part: ingredient evidence vs product evidence
            </p>
            <p style={{ fontFamily:FONT, fontVariationSettings:"'wght' 300", fontSize:"13.5px", lineHeight:1.7, color:"rgba(28,19,4,.62)", margin:0 }}>
              The studies above were run on Shilajit and Triphala as <em>ingredients</em>, using various preparations — not on RockResin or Shahjeet specifically. Our products are made from purified, third-party-tested Shilajit, but we have not run our own clinical trial and we won&rsquo;t imply otherwise. What we can show you is exactly what is in each batch — via the lab reports above. Ingredient evidence, shown transparently; product quality, verified per batch.
            </p>
            <p style={{ fontFamily:FONT, fontVariationSettings:"'wght' 300", fontSize:"12.5px", lineHeight:1.7, color:"rgba(28,19,4,.5)", margin:"14px 0 0" }}>
              Context on why we test: an independent analysis in <em>JAMA</em> found detectable lead, mercury or arsenic in about one in five Ayurvedic products sold online — the exact risk third-party testing removes (<a href="https://pubmed.ncbi.nlm.nih.gov/18728265/" target="_blank" rel="noopener noreferrer" style={{color:"#a67b2f",fontVariationSettings:"'wght' 600",textDecoration:"none"}}>Saper 2008, JAMA · PMID 18728265 ↗</a>). Every citation across our site maps to our master reference library of 39 verified sources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background:"#442a1b",padding:"88px 24px",textAlign:"center",
        position:"relative",overflow:"hidden",
      }}>
        {/* Subtle bg pattern */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:"radial-gradient(rgba(205,135,42,.06) 1px,transparent 1px)",
          backgroundSize:"32px 32px",pointerEvents:"none",
        }}/>
        <div style={{position:"relative",zIndex:1}}>
          <motion.div
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            transition={{duration:.55,ease:EASE}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#cd872a",marginBottom:"16px",
            }}>
              Certificate of Analysis
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(26px,4vw,44px)",
              color:"#f7f0e2",letterSpacing:"-.02em",marginBottom:"16px",
            }}>
              <img src="/icons/lab-certificate.svg" alt="" role="presentation" width={20} height={20} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }} />View the Full Lab Report
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"15px",color:"rgba(247,240,226,.55)",
              maxWidth:"480px",margin:"0 auto 36px",lineHeight:1.6,
            }}>
              Every ROCKRESIN jar carries a QR code linking to the NABL COA for that specific batch. No generic certificates — batch-specific verification you can scan and check.
            </p>
            <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
              <PopButton onClick={() => setReport(LAB_REPORTS.rockresin)} variant="gold">
                View RockResin COA →
              </PopButton>
              <PopButton onClick={() => setReport(LAB_REPORTS.shahjeet)} variant="ghost">
                View Shahjeet COA →
              </PopButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <section style={{
        background:"#f7f0e2",padding:"32px 24px",
        borderTop:"1px solid rgba(28,19,4,.07)",textAlign:"center",
      }}>
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,
          fontSize:"11px",lineHeight:1.7,color:"rgba(28,19,4,.38)",
          maxWidth:"640px",margin:"0 auto",
        }}>
          AYUSH-GMP Certified Facility · US-FDA Registered Facility · NABL 3rd-Party Lab Tested (Eurofins) · Heavy Metal &amp; Microbial Tested. These statements have not been evaluated by any regulatory authority for therapeutic claims. 3TATTAVA products are dietary supplements, not medicines.
        </p>
      </section>

      <LabReportModal report={report} onClose={() => setReport(null)} />
    </div>
  );
}
