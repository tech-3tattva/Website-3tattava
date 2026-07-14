"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";

const WHATSAPP_LINK = "https://chat.whatsapp.com/FI9HnCNNPF3Fp20mU9avG1";
const FONT = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── DATA ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: "🏋️",
    label: "Athletes",
    teaser: "Competitive performers. Performance-obsessed.",
    desc: "Competitive lifters, endurance athletes, and gym-goers who have built Shilajit into their performance stack. From first-time ritualists to elite performers.",
    examples: ["Mona Agarwal — Founding Athlete", "WTF Gym members (28 centers)", "Competitive powerlifters & runners"],
  },
  {
    icon: "📋",
    label: "Trainers",
    teaser: "136+ certified coaches. 28 WTF centers.",
    desc: "Strength coaches, personal trainers, and nutritionists who recommend Performance Ayurveda™ protocols to their clients. Our 136+ WTF-trained coaches are the front line.",
    examples: ["136+ WTF Certified Trainers", "Strength & conditioning coaches", "Sports nutritionists"],
  },
  {
    icon: "⚕️",
    label: "Experts",
    teaser: "BAMS doctors. Dieticians. Practitioners.",
    desc: "Vaidyas and BAMS practitioners who endorse classical Shodhit Shilajit for clinical outcomes. Sports dieticians who integrate Shilajit into evidence-based nutrition protocols.",
    examples: ["Dr. Kashish Gupta, BAMS (Founder)", "AYUSH-affiliated practitioners", "Sports dieticians"],
  },
  {
    icon: "🌱",
    label: "Transformations",
    teaser: "Real stories. Real outcomes. Documented.",
    desc: "Customer transformation stories — 30, 60, 90-day documented outcomes. We collect blood work, performance metrics, and self-reported energy data. These are case studies, not testimonials.",
    examples: ["90-day documented protocols", "Blood work before/after", "Performance metric tracking"],
  },
  {
    icon: "📅",
    label: "Events",
    teaser: "In-person activations. WTF × 3TATTAVA.",
    desc: "Offline activations at WTF Gym Experience Centers. Performance Ayurveda™ workshops led by Dr. Kashish. Community challenges, podcasts, webinars, and athlete sessions.",
    examples: ["Dr. Kashish live workshops", "WTF gym activations", "Community challenges & podcasts"],
  },
];

const STORIES = [
  {
    name: "Arjun S.",
    role: "Competitive Powerlifter",
    city: "Delhi",
    duration: "12 Weeks · RockResin",
    quote: "Week 4 I stopped needing afternoon coffee. By week 8 my pull numbers were climbing in a way that diet alone couldn't explain. Week 12 blood work showed the change.",
    verified: true,
  },
  {
    name: "Priya M.",
    role: "Marathon Runner",
    city: "Gurgaon",
    duration: "10 Weeks · RockResin",
    quote: "I was iron-deficient for three years. Doctor-diagnosed, supplement-resistant. Two months of Shilajit + iron-rich diet and my ferritin is finally in range. The fatigue is gone.",
    verified: true,
  },
  {
    name: "Rohit K.",
    role: "Strength Coach",
    city: "Noida",
    duration: "8 Weeks · Shahjeet",
    quote: "I give these to clients who travel and can't commit to a ritual. Consistency is the hardest variable in supplementation. The stick format solves it.",
    verified: false,
  },
  {
    name: "Sneha T.",
    role: "Yoga Teacher & Ayurveda Student",
    city: "Mumbai",
    duration: "6 Weeks · RockResin",
    quote: "I have studied classical texts on Shilajit for years. 3TATTAVA is the first modern product I trust — the Triphala Shodhan process is done correctly. The COA proves it.",
    verified: true,
  },
];

const FUTURE = [
  { icon: "📅", title: "Events",          desc: "Live Performance Ayurveda™ workshops with Dr. Kashish at WTF Gym centers across NCR." },
  { icon: "🏆", title: "Challenges",      desc: "90-day documented transformation challenges with community tracking and expert check-ins." },
  { icon: "🎙️", title: "Podcasts",        desc: "The 3TATTAVA Podcast — Dr. Kashish in long-form on performance, Ayurveda, and mineral science." },
  { icon: "💻", title: "Webinars",        desc: "Monthly live Q&As with Dr. Kashish, guest practitioners, and performance experts." },
  { icon: "🤝", title: "Athlete Sessions", desc: "Mona Agarwal and community athletes sharing training protocols, recovery rituals, and results." },
];

const UGC = [
  { handle: "@3tattava",      topic: "Morning Ritual",     bg: "#f7f0e2" },
  { handle: "@dr.kash.gupta", topic: "Clinical Insights",  bg: "#ffffff" },
  { handle: "@3tattava",      topic: "WTF Gym Stories",    bg: "#f7f0e2" },
  { handle: "@3tattava",      topic: "Transformation",     bg: "#ffffff" },
  { handle: "@dr.kash.gupta", topic: "Ayurveda Education", bg: "#f7f0e2" },
  { handle: "@3tattava",      topic: "Community Events",   bg: "#ffffff" },
];

// ─── BACKGROUND ──────────────────────────────────────────────────────────────

function CommBg() {
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes cs-cw  { to { transform:rotate(360deg); } }
        @keyframes cs-ccw { to { transform:rotate(-360deg); } }
        @keyframes cs-fl  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes cs-pu  { 0%,100%{opacity:.22} 50%{opacity:.60} }
        @keyframes cs-dot-ping { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
      `}</style>

      {/* Large mandala — top right */}
      <div style={{
        position:"absolute", top:"-80px", right:"-80px",
        width:"520px", height:"520px",
        animation:"cs-cw 200s linear infinite",
        opacity:.055, pointerEvents:"none", zIndex:0,
      }}>
        <svg viewBox="0 0 520 520">
          {[44,88,132,176,218,248].map((r,i)=>(
            <circle key={r} cx={260} cy={260} r={r} fill="none" stroke="#cd872a" strokeWidth={i%2===0?1.2:.5}/>
          ))}
          {Array.from({length:12}).map((_,i)=>(
            <line key={i} x1={260} y1={10} x2={260} y2={510} stroke="#cd872a" strokeWidth={.4} transform={`rotate(${i*30} 260 260)`}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <ellipse key={i} cx={260} cy={130} rx={20} ry={68} fill="none" stroke="#cd872a" strokeWidth={.5} transform={`rotate(${i*45} 260 260)`}/>
          ))}
        </svg>
      </div>

      {/* Small mandala — bottom left */}
      <div style={{
        position:"absolute", bottom:"80px", left:"-50px",
        width:"300px", height:"300px",
        animation:"cs-ccw 150s linear infinite",
        opacity:.04, pointerEvents:"none", zIndex:0,
      }}>
        <svg viewBox="0 0 300 300">
          {[30,60,90,120].map(r=>(
            <circle key={r} cx={150} cy={150} r={r} fill="none" stroke="#b7a392" strokeWidth={.8}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <line key={i} x1={150} y1={8} x2={150} y2={292} stroke="#b7a392" strokeWidth={.4} transform={`rotate(${i*45} 150 150)`}/>
          ))}
        </svg>
      </div>

      {/* Floating gold particles */}
      {([
        {top:"18%",left:"4%",  s:5, d:"cs-fl 7s ease-in-out infinite"},
        {top:"42%",left:"1.5%",s:3, d:"cs-fl 9s ease-in-out infinite 1.8s"},
        {top:"68%",right:"3%", s:4, d:"cs-pu 5.5s ease-in-out infinite"},
        {top:"22%",right:"5%", s:3, d:"cs-fl 8s ease-in-out infinite 0.9s"},
        {top:"80%",left:"7%",  s:5, d:"cs-pu 6s ease-in-out infinite 2.2s"},
      ] as Array<{top:string; left?:string; right?:string; s:number; d:string}>).map((p,i)=>(
        <div key={i} style={{
          position:"absolute", top:p.top, left:p.left, right:p.right,
          width:p.s, height:p.s, borderRadius:"50%",
          background:"radial-gradient(circle,#E4C079,#cd872a)",
          animation:p.d, pointerEvents:"none", zIndex:0,
        }}/>
      ))}
    </>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────

function AnimCount({ target, suffix="" }: { target:number; suffix?:string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once:true });

  useEffect(()=>{
    if (!inView) return;
    const dur=1800, start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/dur,1);
      setN(Math.round((1-Math.pow(1-p,3))*target));
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[inView,target]);

  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// ─── PILLAR CARD ─────────────────────────────────────────────────────────────

function PillarCard({ pillar, idx }: { pillar:typeof PILLARS[0]; idx:number }) {
  const [open,setOpen]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  const inView=useInView(ref,{once:true,margin:"-40px"});

  return (
    <TiltCard radius={4} max={8}>
    <motion.div
      ref={ref}
      initial={{opacity:0,y:28}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.5,delay:idx*.09,ease:EASE}}
      onMouseEnter={()=>setOpen(true)}
      onMouseLeave={()=>setOpen(false)}
      style={{
        fontFamily:FONT,
        background:"#fff",
        border:open?"1.5px solid rgba(205,135,42,.55)":"1px solid rgba(183,163,146,.28)",
        borderRadius:"4px",
        padding:"28px 24px",
        cursor:"default",
        transform:open?"translateY(-5px)":"translateY(0)",
        boxShadow:open
          ?"0 18px 44px rgba(205,135,42,.14),0 4px 14px rgba(28,19,4,.07)"
          :"0 1px 4px rgba(28,19,4,.04)",
        transition:"all .28s cubic-bezier(.16,1,.3,1)",
        position:"relative", overflow:"hidden",
      }}
    >
      {/* Gold top bar */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2px",
        background:"linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)",
        opacity:open?1:0,transition:"opacity .25s",
      }}/>

      <div style={{fontSize:"26px",marginBottom:"10px"}}>{pillar.icon}</div>
      <h3 style={{
        fontVariationSettings:"'wdth' 85,'wght' 700",
        fontSize:"17px",color:"#442a1b",marginBottom:"6px",
      }}>
        {pillar.label}
      </h3>
      <p style={{
        fontSize:"12px",color:"rgba(28,19,4,.48)",
        fontVariationSettings:"'wdth' 100,'wght' 300",
        lineHeight:1.5,marginBottom:"12px",
      }}>
        {pillar.teaser}
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,height:0}}
            animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            transition={{duration:.32,ease:EASE}}
            style={{overflow:"hidden"}}
          >
            <div style={{borderTop:"1px solid rgba(183,163,146,.22)",paddingTop:"12px"}}>
              <p style={{
                fontSize:"12.5px",lineHeight:1.72,color:"rgba(28,19,4,.68)",
                fontVariationSettings:"'wdth' 100,'wght' 300",
                marginBottom:"12px",
              }}>
                {pillar.desc}
              </p>
              <ul style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                {pillar.examples.map(ex=>(
                  <li key={ex} style={{
                    display:"flex",alignItems:"center",gap:"6px",
                    fontSize:"11px",color:"#cd872a",
                    fontVariationSettings:"'wdth' 75,'wght' 600",
                    letterSpacing:".06em",listStyle:"none",
                  }}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:"#cd872a",flexShrink:0}}/>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </TiltCard>
  );
}

// ─── STORY CARD ──────────────────────────────────────────────────────────────

function StoryCard({ s, idx }: { s:typeof STORIES[0]; idx:number }) {
  const [hov,setHov]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  const inView=useInView(ref,{once:true,margin:"-50px"});

  return (
    <TiltCard radius={4} max={7}>
    <motion.div
      ref={ref}
      initial={{opacity:0,y:40}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.55,delay:(idx%2)*.13,ease:EASE}}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        fontFamily:FONT,
        background:hov?"#442a1b":"#fff",
        border:"1px solid rgba(183,163,146,.28)",
        borderRadius:"4px",
        padding:"28px",
        display:"flex",flexDirection:"column",gap:"14px",
        transform:hov?"translateY(-6px)":"translateY(0)",
        boxShadow:hov?"0 22px 52px rgba(28,19,4,.25)":"0 1px 4px rgba(28,19,4,.05)",
        transition:"all .32s cubic-bezier(.16,1,.3,1)",
        cursor:"default",position:"relative",overflow:"hidden",
      }}
    >
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2px",
        background:"linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)",
        opacity:hov?1:0,transition:"opacity .25s",
      }}/>

      {s.verified && (
        <div style={{
          display:"inline-flex",alignItems:"center",gap:"5px",
          fontSize:"9px",letterSpacing:".15em",textTransform:"uppercase",
          color:hov?"#86efac":"#166534",
          background:hov?"rgba(134,239,172,.12)":"rgba(22,101,52,.08)",
          border:`1px solid ${hov?"rgba(134,239,172,.30)":"rgba(22,101,52,.22)"}`,
          padding:"3px 8px",borderRadius:"2px",
          fontVariationSettings:"'wdth' 75,'wght' 600",
          width:"fit-content",transition:"all .3s",
        }}>
          ✓ Dr. Kashish Verified
        </div>
      )}

      <p style={{
        fontSize:"14px",lineHeight:1.7,fontStyle:"italic",
        color:hov?"rgba(247,240,226,.85)":"rgba(28,19,4,.72)",
        fontVariationSettings:"'wdth' 100,'wght' 300",
        transition:"color .32s",flex:1,
      }}>
        &ldquo;{s.quote}&rdquo;
      </p>

      <div style={{
        borderTop:`1px solid ${hov?"rgba(247,240,226,.10)":"rgba(183,163,146,.22)"}`,
        paddingTop:"12px",transition:"border-color .3s",
        display:"flex",justifyContent:"space-between",alignItems:"flex-end",
        flexWrap:"wrap",gap:"6px",
      }}>
        <div>
          <p style={{
            fontVariationSettings:"'wdth' 85,'wght' 700",
            fontSize:"13px",color:hov?"#f7f0e2":"#442a1b",
            transition:"color .3s",marginBottom:"3px",
          }}>
            {s.name}
          </p>
          <p style={{
            fontSize:"11px",
            color:hov?"rgba(247,240,226,.42)":"rgba(28,19,4,.40)",
            fontVariationSettings:"'wdth' 75,'wght' 400",
            transition:"color .3s",
          }}>
            {s.role} · {s.city}
          </p>
        </div>
        <span style={{
          fontSize:"9px",letterSpacing:".15em",textTransform:"uppercase",
          color:"#cd872a",fontVariationSettings:"'wdth' 75,'wght' 600",
        }}>
          {s.duration}
        </span>
      </div>
    </motion.div>
    </TiltCard>
  );
}

// ─── EVENT CARD ──────────────────────────────────────────────────────────────

type EventData = {
  type: string;
  title: string;
  location: string;
  date: string;
  desc: string;
  spots: string;
};

function EventCard({ ev, idx, inView }: { ev: EventData; idx: number; inView: boolean }) {
  const [hov, setHov] = useState(false);
  const isLimited = ev.spots === "Limited Seats";
  const month = ev.date.split(" ")[0];
  const year  = ev.date.split(" ")[1] ?? "";

  return (
    <motion.div
      initial={{ opacity:0, y:36 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.58, delay:idx*.15, ease:EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: FONT,
        background: "#f7f0e2",
        borderRadius: "20px",
        padding: "32px",
        display: "flex",
        gap: "28px",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        boxShadow: hov
          ? "20px 20px 42px rgba(183,163,146,.55),-20px -20px 42px rgba(255,255,255,1),0 0 0 1.5px rgba(205,135,42,.40)"
          : "12px 12px 28px rgba(183,163,146,.42),-12px -12px 28px rgba(255,255,255,.92)",
        transform: hov ? "translateY(-7px)" : "translateY(0)",
        transition: "all .38s cubic-bezier(.16,1,.3,1)",
        cursor: "default",
      }}
    >
      {/* Inner radial highlight on hover */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"55%",
        background: hov
          ? "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.48),transparent 72%)"
          : "none",
        borderRadius: "20px 20px 0 0",
        pointerEvents:"none",
        transition:"background .38s",
      }}/>

      {/* Animated gold border ring on hover */}
      <div style={{
        position:"absolute", inset:0,
        borderRadius:"20px",
        border:"1.5px solid rgba(205,135,42,.55)",
        opacity: hov ? 1 : 0,
        transition:"opacity .38s",
        pointerEvents:"none",
      }}/>

      {/* Date circle — neumorphic inset resting, gold gradient on hover */}
      <div style={{
        flexShrink: 0,
        width: "78px", height: "78px",
        borderRadius: "50%",
        background: hov
          ? "linear-gradient(145deg,#A67B2F,#E4C079)"
          : "#f7f0e2",
        boxShadow: hov
          ? "6px 6px 14px rgba(166,123,47,.42),-6px -6px 14px rgba(228,192,121,.28)"
          : "inset 6px 6px 12px rgba(183,163,146,.38),inset -6px -6px 12px rgba(255,255,255,.90)",
        display: "flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        transition:"all .38s cubic-bezier(.16,1,.3,1)",
        position:"relative",
      }}>
        <div style={{
          fontVariationSettings:"'wdth' 85,'wght' 800",
          fontFamily:FONT,
          fontSize:"17px", lineHeight:1,
          color: hov ? "#442a1b" : "#cd872a",
          transition:"color .3s",
          marginBottom:"2px",
        }}>
          {month}
        </div>
        {year && (
          <div style={{
            fontSize:"9px", letterSpacing:".10em", textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 500",
            fontFamily:FONT,
            color: hov ? "rgba(28,19,4,.55)" : "rgba(28,19,4,.38)",
            transition:"color .3s",
          }}>
            {year}
          </div>
        )}

        {/* Status dot — gold pulse for limited, green for open */}
        <div style={{
          position:"absolute", top:3, right:3,
          width:11, height:11,
          borderRadius:"50%",
          background: isLimited ? "#cd872a" : "#86efac",
          border:"2px solid #f7f0e2",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {isLimited && (
            <div style={{
              position:"absolute", inset:0, borderRadius:"50%",
              background:"#cd872a",
              animation:"cs-dot-ping 1.8s ease-out infinite",
            }}/>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, position:"relative", zIndex:1 }}>
        {/* Badges row */}
        <div style={{
          display:"flex", gap:"8px", alignItems:"center",
          marginBottom:"12px", flexWrap:"wrap",
        }}>
          {/* Neumorphic pill badge */}
          <span style={{
            fontSize:"9px", letterSpacing:".18em", textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            fontFamily:FONT,
            color:"#A67B2F",
            background:"#f7f0e2",
            boxShadow:"3px 3px 7px rgba(183,163,146,.42),-3px -3px 7px rgba(255,255,255,.90)",
            padding:"4px 11px",
            borderRadius:"20px",
            display:"inline-block",
            transition:"box-shadow .25s, color .25s",
          }}>
            {ev.type}
          </span>

          {/* Spots indicator */}
          <span style={{
            fontSize:"9px", letterSpacing:".12em", textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 500",
            fontFamily:FONT,
            color: isLimited ? "#cd872a" : "rgba(28,19,4,.40)",
            display:"flex", alignItems:"center", gap:"5px",
          }}>
            {isLimited && (
              <span style={{
                display:"inline-block",
                width:5, height:5,
                borderRadius:"50%",
                background:"#cd872a",
                flexShrink:0,
              }}/>
            )}
            {ev.spots}
          </span>
        </div>

        <h3 style={{
          fontVariationSettings:"'wdth' 85,'wght' 700",
          fontFamily:FONT,
          fontSize:"19px", color:"#442a1b",
          marginBottom:"8px", lineHeight:1.2,
        }}>
          {ev.title}
        </h3>

        <p style={{
          fontSize:"11px", color:"rgba(28,19,4,.40)",
          fontVariationSettings:"'wdth' 75,'wght' 400",
          fontFamily:FONT,
          letterSpacing:".05em", marginBottom:"12px",
          display:"flex", alignItems:"center", gap:"4px",
        }}>
          📍 {ev.location}
        </p>

        {/* Gold gradient divider */}
        <div style={{
          height:"1px",
          background:"linear-gradient(90deg,transparent,#cd872a,transparent)",
          opacity: hov ? 0.55 : 0.20,
          marginBottom:"12px",
          transition:"opacity .32s",
        }}/>

        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,
          fontSize:"13.5px", lineHeight:1.68,
          color:"rgba(28,19,4,.62)",
          marginBottom:"22px",
        }}>
          {ev.desc}
        </p>

        {/* CTA buttons */}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale:0.97,
              boxShadow:"inset 4px 4px 8px rgba(183,163,146,.38),inset -4px -4px 8px rgba(255,255,255,.70)",
            }}
            whileTap={{ scale:0.93 }}
            transition={{ type:"spring", stiffness:380, damping:22 }}
            style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              background:"#f7f0e2",
              color:"#442a1b",
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"10px", letterSpacing:".14em", textTransform:"uppercase",
              padding:"10px 20px",
              borderRadius:"8px",
              textDecoration:"none",
              boxShadow:"6px 6px 12px rgba(183,163,146,.40),-6px -6px 12px rgba(255,255,255,.90)",
            }}
          >
            Reserve Seat →
          </motion.a>
          <motion.button
            whileHover={{
              scale:1.04,
              boxShadow:"8px 8px 16px rgba(166,123,47,.32),-2px -2px 6px rgba(228,192,121,.22)",
            }}
            whileTap={{
              scale:0.96,
              boxShadow:"inset 3px 3px 7px rgba(166,123,47,.30),inset -2px -2px 5px rgba(228,192,121,.18)",
            }}
            transition={{ type:"spring", stiffness:380, damping:22 }}
            style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              background:"linear-gradient(145deg,#cd872a,#A67B2F)",
              color:"#442a1b",
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"10px", letterSpacing:".14em", textTransform:"uppercase",
              padding:"10px 20px",
              borderRadius:"8px",
              border:"none",
              cursor:"pointer",
              boxShadow:"6px 6px 12px rgba(166,123,47,.30),-2px -2px 6px rgba(228,192,121,.18)",
            }}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WA ICON ─────────────────────────────────────────────────────────────────

function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────


export default function CommunityClient() {
  const pillarsRef   = useRef<HTMLElement>(null);
  const athleteRef   = useRef<HTMLElement>(null);
  const ugcRef       = useRef<HTMLElement>(null);
  const eventsRef    = useRef<HTMLElement>(null);
  const futureRef    = useRef<HTMLElement>(null);

  const pillarsInView = useInView(pillarsRef, {once:true, margin:"-60px"});
  const athleteInView = useInView(athleteRef, {once:true, margin:"-60px"});
  const ugcInView     = useInView(ugcRef,     {once:true, margin:"-60px"});
  const eventsInView  = useInView(eventsRef,  {once:true, margin:"-60px"});
  const futureInView  = useInView(futureRef,  {once:true, margin:"-60px"});

  const eyebrow = (text:string) => (
    <p style={{
      fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
      fontVariationSettings:"'wdth' 75,'wght' 500",
      color:"#cd872a",marginBottom:"12px",fontFamily:FONT,
    }}>
      {text}
    </p>
  );

  const h2 = (text:string, sub?:string) => (
    <>
      <h2 style={{
        fontVariationSettings:"'wdth' 85,'wght' 700",
        fontFamily:FONT,
        fontSize:"clamp(26px,3.5vw,40px)",
        letterSpacing:"-.02em",lineHeight:1.1,
        color:"#442a1b",marginBottom:sub?"14px":"0",
      }}>
        {text}
      </h2>
      {sub && (
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,
          fontSize:"15px",color:"rgba(28,19,4,.52)",
          maxWidth:"480px",margin:"0 auto",lineHeight:1.65,
        }}>
          {sub}
        </p>
      )}
    </>
  );

  return (
    <div style={{fontFamily:FONT,color:"#442a1b",background:"#f7f0e2"}}>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        position:"relative",overflow:"hidden",
        background:"url('https://media.3tattava.com/banners/preview-3.webp') center/cover no-repeat #f7f0e2",
        padding:"104px 24px 88px",textAlign:"center",
      }}>
        {/* Overlay to keep dark text readable over warm community banner */}
        <div style={{position:"absolute",inset:0,background:"rgba(247,240,226,0.65)",zIndex:0}}/>
        <CommBg/>

        <div style={{position:"relative",zIndex:1,maxWidth:"780px",margin:"0 auto"}}>
          <motion.p
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,ease:EASE}}
            style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              color:"#cd872a",marginBottom:"20px",fontFamily:FONT,
            }}
          >
            Balance · Build · Become
          </motion.p>

          <motion.h1
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:.65,delay:.1,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontFamily:FONT,
              fontSize:"clamp(32px,6vw,64px)",
              lineHeight:1.06,letterSpacing:"-.025em",
              color:"#442a1b",marginBottom:"22px",
            }}
          >
            Products Can Be Purchased<br/>
            In Minutes.{" "}
            <span style={{
              background:"linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>
              Transformation Is Built Daily.
            </span>
          </motion.h1>

          <motion.p
            initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
            transition={{duration:.55,delay:.22,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"clamp(15px,2vw,18px)",lineHeight:1.65,
              color:"rgba(28,19,4,.60)",
              maxWidth:"560px",margin:"0 auto 36px",
            }}
          >
            The 3TATTAVA Community isn&apos;t a loyalty program. It is a movement — built inside WTF Gym&apos;s 28 Experience Centers across NCR and online for athletes, coaches, and practitioners who do the work.
          </motion.p>

          <motion.div
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,delay:.32,ease:EASE}}
            style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap",marginBottom:"52px"}}
          >
            <a
              href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                background:"linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
                backgroundSize:"200% auto",
                color:"#442a1b",
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
                padding:"14px 32px",textDecoration:"none",
              }}
            >
              <WaIcon/> Join WhatsApp Community
            </a>
            <Link
              href="/find-us"
              style={{
                display:"inline-flex",alignItems:"center",gap:"6px",
                background:"transparent",color:"#442a1b",
                fontVariationSettings:"'wdth' 85,'wght' 600",
                fontFamily:FONT,
                fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
                padding:"14px 28px",textDecoration:"none",
                border:"1px solid rgba(28,19,4,.22)",
              }}
            >
              Find Nearest Center →
            </Link>
          </motion.div>

          {/* Hero counters */}
          <motion.div
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,delay:.44,ease:EASE}}
            style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}
          >
            {[
              {n:29,  suf:"+", label:"Experience Centers"},
              {n:1000,suf:"+", label:"Community Members"},
              {n:136, suf:"+", label:"Certified Trainers"},
            ].map(s=>(
              <div key={s.label} style={{
                background:"#fff",
                border:"1px solid rgba(205,135,42,.28)",
                padding:"14px 22px",textAlign:"center",minWidth:"130px",
              }}>
                <div style={{
                  fontVariationSettings:"'wdth' 85,'wght' 800",
                  fontFamily:FONT,
                  fontSize:"28px",lineHeight:1,
                  background:"linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  marginBottom:"4px",
                }}>
                  <AnimCount target={s.n} suffix={s.suf}/>
                </div>
                <div style={{
                  fontSize:"10px",letterSpacing:".12em",textTransform:"uppercase",
                  fontVariationSettings:"'wdth' 75,'wght' 500",
                  fontFamily:FONT,
                  color:"rgba(28,19,4,.42)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GOLD COUNTER STRIP ─────────────────────────────────────────────── */}
      <section style={{
        background:"linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
        padding:"32px 24px",
      }}>
        <div style={{
          maxWidth:"1100px",margin:"0 auto",
          display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
          gap:"32px",
        }}>
          {[
            {n:29,  suf:"+", label:"Experience Centers"},
            {n:1000,suf:"+", label:"Community Members"},
            {n:136, suf:"+", label:"Certified Trainers"},
            {n:5,   suf:"",  label:"Cities Across NCR"},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center"}}>
              <div style={{
                fontVariationSettings:"'wdth' 85,'wght' 800",
                fontFamily:FONT,
                fontSize:"38px",lineHeight:1,color:"#442a1b",marginBottom:"4px",
              }}>
                <AnimCount target={s.n} suffix={s.suf}/>
              </div>
              <div style={{
                fontSize:"10px",letterSpacing:".18em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 600",
                fontFamily:FONT,
                color:"rgba(28,19,4,.60)",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY PILLARS ──────────────────────────────────────────────── */}
      <section ref={pillarsRef} style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={pillarsInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"56px"}}
          >
            {eyebrow("Who We Are")}
            {h2(
              "Five Kinds of People. One Standard.",
              "Hover each card to learn more. Every pillar is accountable to the same thing — results you can measure."
            )}
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(196px,1fr))",
            gap:"16px",
          }}>
            {PILLARS.map((p,i)=>(
              <PillarCard key={p.label} pillar={p} idx={i}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDING ATHLETE ───────────────────────────────────────────────── */}
      <section ref={athleteRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{
          maxWidth:"1100px",margin:"0 auto",
          display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",
          gap:"64px",alignItems:"center",
        }}>
          {/* Left: placeholder portrait card */}
          <motion.div
            initial={{opacity:0,x:-32}}
            animate={athleteInView?{opacity:1,x:0}:{}}
            transition={{duration:.65,ease:EASE}}
            style={{
              background:"#f7f0e2",
              border:"1px solid rgba(205,135,42,.25)",
              padding:"48px 36px",
              display:"flex",flexDirection:"column",alignItems:"center",
              gap:"18px",textAlign:"center",position:"relative",
            }}
          >
            <div style={{
              position:"absolute",top:0,left:0,right:0,height:"3px",
              background:"linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)",
            }}/>
            <div style={{
              width:"120px",height:"120px",borderRadius:"50%",
              background:"linear-gradient(145deg,#A67B2F,#E4C079)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 8px 32px rgba(205,135,42,.28)",
            }}>
              <span style={{
                fontVariationSettings:"'wdth' 85,'wght' 800",
                fontFamily:FONT,
                fontSize:"52px",color:"#442a1b",lineHeight:1,
              }}>M</span>
            </div>
            <div>
              <h3 style={{
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"22px",color:"#442a1b",marginBottom:"8px",
              }}>
                Mona Agarwal
              </h3>
              <div style={{
                display:"inline-flex",alignItems:"center",
                background:"linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)",
                padding:"4px 14px",
              }}>
                <span style={{
                  fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",
                  fontVariationSettings:"'wdth' 75,'wght' 700",
                  fontFamily:FONT,
                  color:"#442a1b",
                }}>
                  Founding Athlete
                </span>
              </div>
            </div>
            <div style={{
              display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center",
            }}>
              {[
                {label:"Protocol",  value:"12 Weeks"},
                {label:"Product",   value:"RockResin"},
                {label:"Gym",       value:"WTF NCR"},
              ].map(s=>(
                <div key={s.label} style={{textAlign:"center"}}>
                  <div style={{
                    fontSize:"9px",letterSpacing:".15em",textTransform:"uppercase",
                    fontVariationSettings:"'wdth' 75,'wght' 500",
                    fontFamily:FONT,
                    color:"rgba(28,19,4,.38)",marginBottom:"3px",
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontVariationSettings:"'wdth' 85,'wght' 700",
                    fontFamily:FONT,
                    fontSize:"14px",color:"#442a1b",
                  }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <p style={{
              fontSize:"11px",color:"rgba(28,19,4,.42)",
              fontVariationSettings:"'wdth' 75,'wght' 400",
              fontFamily:FONT,
              letterSpacing:".05em",lineHeight:1.6,
            }}>
              Portrait coming soon — currently documenting<br/>her 90-day protocol at WTF Gym
            </p>
          </motion.div>

          {/* Right: bio */}
          <motion.div
            initial={{opacity:0,x:32}}
            animate={athleteInView?{opacity:1,x:0}:{}}
            transition={{duration:.65,delay:.12,ease:EASE}}
          >
            {eyebrow("Founding Athlete")}
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(24px,3vw,36px)",
              letterSpacing:"-.02em",lineHeight:1.15,
              color:"#442a1b",marginBottom:"20px",
            }}>
              She Didn&apos;t Wait for Perfect Conditions.
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 400",
              fontFamily:FONT,
              fontSize:"15px",lineHeight:1.72,
              color:"rgba(28,19,4,.68)",marginBottom:"20px",
            }}>
              Mona Agarwal is 3TATTAVA&apos;s Founding Athlete — the first community member to publicly document her Shilajit protocol at WTF Gym. She didn&apos;t sign up for a sponsorship. She signed up for results. Her 12-week documented protocol became the template for what we now call a Community Case Study.
            </p>
            <blockquote style={{
              borderLeft:"2px solid #cd872a",
              paddingLeft:"20px",margin:"0 0 28px",
            }}>
              <p style={{
                fontVariationSettings:"'wdth' 100,'wght' 300",
                fontFamily:FONT,
                fontSize:"16px",fontStyle:"italic",
                lineHeight:1.65,color:"rgba(28,19,4,.72)",marginBottom:"8px",
              }}>
                &ldquo;I didn&apos;t feel different on week one. I felt different on week four. That&apos;s when I knew this was real.&rdquo;
              </p>
              <cite style={{
                fontSize:"11px",color:"#cd872a",
                fontVariationSettings:"'wdth' 75,'wght' 600",
                fontFamily:FONT,
                letterSpacing:".08em",fontStyle:"normal",
              }}>
                — Mona Agarwal, WTF Gym
              </cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── TRANSFORMATION STORIES ─────────────────────────────────────────── */}
      <section style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-60px"}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"56px"}}
          >
            {eyebrow("Not Testimonials — Case Studies")}
            {h2(
              "Transformation Stories",
              "Hover a card to see the dark-reveal. Verified by Dr. Kashish, BAMS — where indicated."
            )}
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
            gap:"20px",
          }}>
            {STORIES.map((s,i)=>(
              <StoryCard key={s.name} s={s} idx={i}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM UGC ──────────────────────────────────────────────────── */}
      <section ref={ugcRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={ugcInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"48px"}}
          >
            {eyebrow("@3tattava · @dr.kash.gupta")}
            {h2(
              "Community in the Wild",
              "Follow for daily ritual content, clinical insights, and real community stories."
            )}
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(3,1fr)",
            gap:"12px",marginBottom:"36px",
          }}>
            {UGC.map((post,i)=>(
              <motion.div
                key={i}
                initial={{opacity:0,scale:.95}}
                animate={ugcInView?{opacity:1,scale:1}:{}}
                transition={{duration:.4,delay:i*.07,ease:EASE}}
                whileHover={{scale:1.03}}
                style={{
                  background:post.bg,
                  border:"1px solid rgba(183,163,146,.25)",
                  aspectRatio:"1/1",
                  display:"flex",flexDirection:"column",
                  justifyContent:"flex-end",
                  padding:"14px",position:"relative",overflow:"hidden",cursor:"pointer",
                }}
              >
                {/* Placeholder grid lines */}
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:"1px",height:"100%",background:"rgba(183,163,146,.18)",position:"absolute"}}/>
                  <div style={{height:"1px",width:"100%",background:"rgba(183,163,146,.18)",position:"absolute"}}/>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="6" width="20" height="20" rx="2" stroke="#b7a392" strokeWidth="1.2"/>
                    <circle cx="21" cy="11" r="2.5" stroke="#b7a392" strokeWidth="1"/>
                    <path d="M6 22l7-7 4 4 3-3 6 6" stroke="#b7a392" strokeWidth="1"/>
                  </svg>
                </div>
                <div style={{position:"relative",zIndex:1}}>
                  <p style={{
                    fontSize:"10px",fontVariationSettings:"'wdth' 75,'wght' 600",
                    fontFamily:FONT,
                    color:"#cd872a",letterSpacing:".08em",marginBottom:"2px",
                  }}>
                    {post.handle}
                  </p>
                  <p style={{
                    fontSize:"11px",fontVariationSettings:"'wdth' 100,'wght' 300",
                    fontFamily:FONT,
                    color:"rgba(28,19,4,.50)",
                  }}>
                    {post.topic}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{textAlign:"center"}}>
            <a
              href="https://www.instagram.com/3tattava"
              target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                border:"1px solid rgba(28,19,4,.22)",
                padding:"12px 28px",textDecoration:"none",
                color:"#442a1b",
                fontVariationSettings:"'wdth' 85,'wght' 600",
                fontFamily:FONT,
                fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
              }}
            >
              Follow @3tattava →
            </a>
          </div>
        </div>
      </section>

      {/* ── EVENTS TIMELINE ────────────────────────────────────────────────── */}
      <section ref={eventsRef} style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"860px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={eventsInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"56px"}}
          >
            {eyebrow("In-Person Activations")}
            {h2("Upcoming Events")}
          </motion.div>

          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
            {([
              {
                type:"WTF × 3TATTAVA",
                title:"Performance Ayurveda™ Workshop",
                location:"WTF World Trade Tower, Sector 16, Noida",
                date:"July 2026",
                desc:"Dr. Kashish live — Shilajit fundamentals, ritual practice, and personalised dosage guidance. Limited to 40 attendees.",
                spots:"Limited Seats",
              },
              {
                type:"Community Drop",
                title:"Community Launch Day",
                location:"Online · WhatsApp Community",
                date:"Coming Soon",
                desc:"First-access pricing, lab report deep-dive, and a live Q&A with Dr. Kashish. 300+ members already waiting.",
                spots:"Open to All",
              },
            ] as EventData[]).map((ev,i)=>(
              <EventCard key={ev.title} ev={ev} idx={i} inView={eventsInView}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUTURE FEATURES ────────────────────────────────────────────────── */}
      <section ref={futureRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={futureInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"48px"}}
          >
            {eyebrow("What's Coming")}
            {h2("The Community Roadmap")}
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
            gap:"16px",
          }}>
            {FUTURE.map((f,i)=>(
              <motion.div
                key={f.title}
                initial={{opacity:0,y:20}}
                animate={futureInView?{opacity:1,y:0}:{}}
                transition={{duration:.45,delay:i*.09,ease:EASE}}
                style={{
                  background:"#f7f0e2",
                  border:"1px solid rgba(183,163,146,.28)",
                  padding:"24px 20px",textAlign:"center",
                }}
              >
                <div style={{fontSize:"24px",marginBottom:"10px"}}>{f.icon}</div>
                <h3 style={{
                  fontVariationSettings:"'wdth' 85,'wght' 700",
                  fontFamily:FONT,
                  fontSize:"15px",color:"#442a1b",marginBottom:"8px",
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontVariationSettings:"'wdth' 100,'wght' 300",
                  fontFamily:FONT,
                  fontSize:"12px",lineHeight:1.6,color:"rgba(28,19,4,.52)",
                  marginBottom:"12px",
                }}>
                  {f.desc}
                </p>
                <div style={{
                  fontSize:"9px",letterSpacing:".14em",textTransform:"uppercase",
                  fontVariationSettings:"'wdth' 75,'wght' 600",
                  fontFamily:FONT,
                  color:"rgba(205,135,42,.55)",
                }}>
                  Coming Soon
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section style={{
        background:"linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
        padding:"88px 24px",textAlign:"center",
      }}>
        <motion.div
          initial={{opacity:0,y:24}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.55,ease:EASE}}
        >
          <p style={{
            fontSize:"10px",letterSpacing:".3em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            fontFamily:FONT,
            color:"rgba(28,19,4,.52)",marginBottom:"16px",
          }}>
            3TATTAVA Community
          </p>
          <h2 style={{
            fontVariationSettings:"'wdth' 85,'wght' 800",
            fontFamily:FONT,
            fontSize:"clamp(30px,5vw,52px)",
            letterSpacing:"-.025em",lineHeight:1.1,
            color:"#442a1b",marginBottom:"16px",
          }}>
            Join the Community.<br/>Do the Work.
          </h2>
          <p style={{
            fontVariationSettings:"'wdth' 100,'wght' 400",
            fontFamily:FONT,
            fontSize:"16px",lineHeight:1.6,
            color:"rgba(28,19,4,.60)",
            maxWidth:"440px",margin:"0 auto 36px",
          }}>
            300+ members already inside. Launch pricing drops to community members first.
          </p>
          <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
            <a
              href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                background:"#442a1b",color:"#f7f0e2",
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
                padding:"15px 36px",textDecoration:"none",
              }}
            >
              <WaIcon/> Join WhatsApp Community
            </a>
            <Link
              href="/find-us"
              style={{
                display:"inline-flex",alignItems:"center",gap:"6px",
                background:"transparent",color:"#442a1b",
                fontVariationSettings:"'wdth' 85,'wght' 600",
                fontFamily:FONT,
                fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
                padding:"15px 28px",textDecoration:"none",
                border:"1.5px solid rgba(28,19,4,.35)",
              }}
            >
              Find a WTF Gym →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── DISCLAIMER ─────────────────────────────────────────────────────── */}
      <section style={{
        background:"#f7f0e2",padding:"28px 24px",
        borderTop:"1px solid rgba(28,19,4,.07)",textAlign:"center",
      }}>
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,
          fontSize:"11px",lineHeight:1.7,color:"rgba(28,19,4,.38)",
          maxWidth:"640px",margin:"0 auto",
        }}>
          Transformation stories shared with participant consent. Individual results vary. 3TATTAVA products are dietary supplements, not medicines. Consult a qualified healthcare practitioner before use.
        </p>
      </section>

    </div>
  );
}
