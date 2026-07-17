"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import PurchaseGate, { LockedTeaser } from "@/components/purchase/PurchaseGate";
import ConsultationModal from "@/components/vaidyaconnect/ConsultationModal";

// ─── TYPES & CONSTANTS ───────────────────────────────────────────────────────

const FONT   = "var(--font-primary), system-ui, sans-serif";
const EASE   = [0.16, 1, 0.3, 1] as const;
const SPRING = { type:"spring", stiffness:380, damping:22 } as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GOLD   = "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E,#A67B2F)";
const GOLD3  = "linear-gradient(90deg,#A67B2F,#E4C079,#C8963E)";

interface Doctor {
  _id:string; name:string; qualification:string; speciality:string[];
  city:string; consultation_fee:number; is_free:boolean;
  patients_visited:number; trust_score:number;
  monthly_recommendations:number; booking_link:string;
}

const DUMMY_DOCTORS: Doctor[] = [
  { _id:"1", name:"Dr. Pooja Arora",  qualification:"BAMS, MD (Ayurveda)", speciality:["Women's Health","Performance Ayurveda"], city:"New Delhi",  consultation_fee:500, is_free:false, patients_visited:142, trust_score:4.8, monthly_recommendations:23, booking_link:"#" },
  { _id:"2", name:"Dr. Rahul Mehta",  qualification:"BAMS",                speciality:["Sports Medicine","Performance Ayurveda"], city:"Bengaluru", consultation_fee:600, is_free:false, patients_visited:89,  trust_score:4.9, monthly_recommendations:17, booking_link:"#" },
  { _id:"3", name:"Dr. Kavya Nair",   qualification:"BAMS, PhD (Ayurveda)",speciality:["Hormonal Health","Women's Wellness"],      city:"Mumbai",    consultation_fee:0,   is_free:true,  patients_visited:205, trust_score:4.7, monthly_recommendations:34, booking_link:"#" },
  { _id:"4", name:"Dr. Ananya Singh", qualification:"BAMS",                speciality:["Gut Health","Performance Ayurveda"],        city:"Delhi",     consultation_fee:450, is_free:false, patients_visited:78,  trust_score:4.6, monthly_recommendations:12, booking_link:"#" },
];

const CITIES = ["Delhi","Mumbai","Bengaluru","Hyderabad","Chennai","Kolkata","Pune","Jaipur","Noida","Gurgaon","Ahmedabad","Lucknow","Chandigarh"];

const TICKER = [
  "Dr. Pooja Arora from Delhi recommended 3TATTAVA Shilajit to 23 patients this month",
  "Dr. Rahul Mehta from Bengaluru — 89% patient trust score",
  "3TATTAVA is now available at 12 Ayurveda clinics across Delhi NCR",
  "Dr. Kavya Nair from Mumbai — 34 women referred to Shahjeet Sticks in April",
  "VaidyaConnect now has practitioners across 8 Indian cities",
];

const ASSESSMENT_DOMAINS = [
  { icon:"⚡", label:"Energy" },
  { icon:"🌙", label:"Sleep Quality" },
  { icon:"💪", label:"Recovery" },
  { icon:"🏋️", label:"Training Load" },
  { icon:"🧠", label:"Stress" },
  { icon:"🌿", label:"Lifestyle" },
];

// ─── BACKGROUND ──────────────────────────────────────────────────────────────

function VcBg() {
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes vc-spin  { to{transform:rotate(360deg)} }
        @keyframes vc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes vc-pulse { 0%,100%{opacity:.15} 50%{opacity:.45} }
        @keyframes vc-dot-ping { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.4);opacity:0} }
        @keyframes vc-badge-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      {/* Medical concentric ring pattern */}
      <div style={{
        position:"absolute",top:"-60px",right:"-40px",
        width:"480px",height:"480px",
        animation:"vc-spin 240s linear infinite",
        opacity:.04,pointerEvents:"none",zIndex:0,
      }}>
        <svg viewBox="0 0 480 480">
          {[40,80,120,160,200,230].map((r,i)=>(
            <circle key={r} cx={240} cy={240} r={r} fill="none" stroke="#b7a392" strokeWidth={i%2===0?1.2:.6}/>
          ))}
          {Array.from({length:12}).map((_,i)=>(
            <line key={i} x1={240} y1={8} x2={240} y2={472} stroke="#b7a392" strokeWidth={.4} transform={`rotate(${i*30} 240 240)`}/>
          ))}
          {/* Medical cross */}
          <rect x={220} y={90} width={40} height={90} rx={4} fill="#C8963E" opacity={.12}/>
          <rect x={190} y={120} width={100} height={30} rx={4} fill="#C8963E" opacity={.12}/>
        </svg>
      </div>

      {/* Small accent bottom-left */}
      <div style={{
        position:"absolute",bottom:"40px",left:"-30px",
        width:"240px",height:"240px",
        animation:"vc-spin 180s linear infinite reverse",
        opacity:.035,pointerEvents:"none",zIndex:0,
      }}>
        <svg viewBox="0 0 240 240">
          {[30,60,90,110].map(r=>(
            <circle key={r} cx={120} cy={120} r={r} fill="none" stroke="#C8963E" strokeWidth={.8}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <line key={i} x1={120} y1={8} x2={120} y2={232} stroke="#C8963E" strokeWidth={.4} transform={`rotate(${i*45} 120 120)`}/>
          ))}
        </svg>
      </div>

      {/* Floating particles */}
      {([
        {top:"25%",left:"3%",  s:4,d:"vc-float 7s ease-in-out infinite"},
        {top:"60%",left:"2%",  s:3,d:"vc-pulse 5s ease-in-out infinite"},
        {top:"35%",right:"4%", s:4,d:"vc-float 9s ease-in-out infinite 1.5s"},
        {top:"75%",right:"5%", s:3,d:"vc-pulse 6s ease-in-out infinite .8s"},
      ] as Array<{top:string;left?:string;right?:string;s:number;d:string}>).map((p,i)=>(
        <div key={i} style={{
          position:"absolute",top:p.top,left:p.left,right:p.right,
          width:p.s,height:p.s,borderRadius:"50%",
          background:"radial-gradient(circle,#E4C079,#C8963E)",
          animation:p.d,pointerEvents:"none",zIndex:0,
        }}/>
      ))}
    </>
  );
}

// ─── TICKER ──────────────────────────────────────────────────────────────────

function Ticker() {
  const [idx, setIdx] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setIdx(i=>(i+1)%TICKER.length), 4000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{
      background:GOLD3,padding:"10px 24px",
      overflow:"hidden",position:"relative",
    }}>
      <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",alignItems:"center",gap:"12px"}}>
        <span style={{
          fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",
          fontVariationSettings:"'wdth' 75,'wght' 700",
          fontFamily:FONT,color:"rgba(28,19,4,.6)",flexShrink:0,
        }}>
          LIVE ·
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{opacity:0,y:8}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-8}}
            transition={{duration:.35,ease:EASE}}
            style={{
              fontSize:"12px",fontVariationSettings:"'wdth' 100,'wght' 400",
              fontFamily:FONT,color:"#1c1304",margin:0,
            }}
          >
            {TICKER[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── DOCTOR AVATAR (NEUMORPHIC) ───────────────────────────────────────────────

function Avatar({ initial, photo, size=96, verified=false, active=false }: {
  initial:string; photo?:string; size?:number; verified?:boolean; active?:boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", flexShrink:0 }}
    >
      {/* Neumorphic outer ring */}
      <div style={{
        width: size+18, height: size+18, borderRadius:"50%",
        background:"#f7f0e2",
        boxShadow: hov
          ? `inset 5px 5px 10px rgba(183,163,146,.45),inset -5px -5px 10px rgba(255,255,255,.95),0 0 0 2px rgba(200,150,62,.45)`
          : `inset 5px 5px 10px rgba(183,163,146,.38),inset -5px -5px 10px rgba(255,255,255,.88)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"box-shadow .35s ease",
      }}>
        {/* Gold gradient inner circle */}
        <motion.div
          animate={{ scale: hov ? 1.07 : 1 }}
          transition={SPRING}
          style={{
            width:size, height:size, borderRadius:"50%",
            background:"linear-gradient(135deg,#A67B2F 0%,#E4C079 45%,#C8963E 70%,#A67B2F 100%)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow: hov
              ? "0 8px 24px rgba(166,123,47,.45)"
              : "0 4px 14px rgba(166,123,47,.28)",
            transition:"box-shadow .3s ease",
            position:"relative", overflow:"hidden",
          }}
        >
          {/* Glowing pulse ring on hover */}
          {hov && (
            <motion.div
              initial={{scale:1,opacity:.55}}
              animate={{scale:1.6,opacity:0}}
              transition={{duration:1.3,repeat:Infinity,ease:"easeOut"}}
              style={{
                position:"absolute",inset:0,borderRadius:"50%",
                border:"2px solid #E4C079",
              }}
            />
          )}
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={photo} alt={initial} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%", position:"relative", zIndex:1 }} />
          ) : (
            <span style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontFamily:FONT,
              fontSize:size*.42, color:"#442a1b", lineHeight:1,
              position:"relative", zIndex:1,
            }}>
              {initial}
            </span>
          )}
        </motion.div>
      </div>

      {/* Verified star badge */}
      {verified && (
        <motion.div
          animate={{ scale: hov ? 1.18 : 1, rotate: hov ? 15 : 0 }}
          transition={SPRING}
          style={{
            position:"absolute", bottom:4, right:4,
            width:22, height:22, borderRadius:"50%",
            background:"linear-gradient(135deg,#A67B2F,#E4C079)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"2px 2px 6px rgba(166,123,47,.42),0 0 0 2px #f7f0e2",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L6.12 3.4L8.8 3.76L6.9 5.6L7.36 8.3L5 7L2.64 8.3L3.1 5.6L1.2 3.76L3.88 3.4Z" fill="#1c1304"/>
          </svg>
        </motion.div>
      )}

      {/* Active gold pulse dot */}
      {active && (
        <div style={{ position:"absolute", top:6, right:6 }}>
          <div style={{ position:"relative", width:12, height:12 }}>
            <div style={{
              position:"absolute", inset:0, borderRadius:"50%",
              background:"#C8963E",
              border:"2px solid #f7f0e2",
              zIndex:1,
            }}/>
            <div style={{
              position:"absolute", inset:0, borderRadius:"50%",
              background:"#C8963E",
              animation:"vc-dot-ping 1.6s ease-out infinite",
            }}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEUMORPHIC SPECIALTY TAG ─────────────────────────────────────────────────

function NeuTag({ label }: { label:string }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.span
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      animate={{ scale: hov ? 1.05 : 1 }}
      transition={SPRING}
      style={{
        fontSize:"10px", letterSpacing:".08em",
        fontVariationSettings:"'wdth' 75,'wght' 600",
        fontFamily:FONT,
        color: hov ? "#A67B2F" : "rgba(28,19,4,.60)",
        background:"#f7f0e2",
        padding:"5px 13px",
        borderRadius:"999px",
        display:"inline-block",
        cursor:"default",
        boxShadow: hov
          ? "inset 3px 3px 6px rgba(183,163,146,.42),inset -3px -3px 6px rgba(255,255,255,.90)"
          : "4px 4px 8px rgba(183,163,146,.38),-4px -4px 8px rgba(255,255,255,.88)",
        transition:"color .2s ease,box-shadow .25s ease",
      }}
    >
      {label}
    </motion.span>
  );
}

// ─── FLAT TAG (used in search results) ───────────────────────────────────────

function Tag({ label }: { label:string }) {
  return (
    <span style={{
      fontSize:"10px", letterSpacing:".08em",
      fontVariationSettings:"'wdth' 75,'wght' 500",
      fontFamily:FONT,
      color:"rgba(28,19,4,.62)",
      background:"#f7f0e2",
      border:"1px solid rgba(183,163,146,.35)",
      padding:"4px 10px", display:"inline-block",
    }}>
      {label}
    </span>
  );
}

// ─── POPABLE BUTTON ──────────────────────────────────────────────────────────

function PopBtn({
  href="#", onClick, children, variant="gold", style: extraStyle={},
}: {
  href?:string; onClick?:(e: React.MouseEvent)=>void; children:React.ReactNode;
  variant?:"gold"|"ghost"|"ink"; style?:React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    display:"inline-flex",alignItems:"center",gap:"6px",
    fontVariationSettings:"'wdth' 85,'wght' 700",
    fontFamily:FONT,
    fontSize:"11px",letterSpacing:".15em",textTransform:"uppercase",
    padding:"13px 28px",textDecoration:"none",cursor:"pointer",
    border:"none",
    ...extraStyle,
  };
  const styles: Record<string,React.CSSProperties> = {
    gold:  {
      background:"linear-gradient(145deg,#C8963E,#A67B2F)",
      color:"#1c1304",
      borderRadius:"8px",
      boxShadow:"6px 6px 12px rgba(166,123,47,.30),-2px -2px 6px rgba(228,192,121,.18)",
    },
    ghost: {
      background:"#f7f0e2",
      color:"#1c1304",
      borderRadius:"8px",
      boxShadow:"6px 6px 12px rgba(183,163,146,.40),-6px -6px 12px rgba(255,255,255,.90)",
    },
    ink:   { background:"#1c1304", color:"#f7f0e2", borderRadius:"8px" },
  };

  const hoverShadow: Record<string,string> = {
    gold:  "0 10px 28px rgba(200,150,62,.45),3px 3px 8px rgba(166,123,47,.25)",
    ghost: "inset 4px 4px 8px rgba(183,163,146,.38),inset -4px -4px 8px rgba(255,255,255,.85)",
    ink:   "0 6px 20px rgba(28,19,4,.20)",
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: variant==="ghost"?0.97:1.05, y: variant==="ghost"?0:-2, boxShadow: hoverShadow[variant] }}
      whileTap={{ scale:.94 }}
      transition={SPRING}
      style={{ ...base, ...styles[variant] }}
    >
      {children}
    </motion.a>
  );
}

// ─── FEATURED DOCTOR CARD ────────────────────────────────────────────────────

interface FeaturedDoc {
  initial:string; photo?:string; name:string; role:string; credentials:string;
  badge:string; quote:string; specialties:string[];
  ctas:Array<{label:string;variant:"gold"|"ghost"|"ink";href?:string;action?:"consult"}>;
  consultNote?:string;
}

function FeaturedCard({ doc, idx, onConsult }: { doc:FeaturedDoc; idx:number; onConsult?:()=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{opacity:0,y:36}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.6,delay:idx*.15,ease:EASE}}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:"#f7f0e2",
        borderRadius:"20px",
        padding:"36px 32px",
        display:"flex",flexDirection:"column",gap:"22px",
        position:"relative",overflow:"hidden",
        boxShadow:hov
          ? "20px 20px 42px rgba(183,163,146,.55),-20px -20px 42px rgba(255,255,255,1),0 0 0 1.5px rgba(200,150,62,.35)"
          : "12px 12px 28px rgba(183,163,146,.42),-12px -12px 28px rgba(255,255,255,.92)",
        transition:"box-shadow .4s ease,transform .4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-7px)" : "translateY(0)",
        fontFamily:FONT, flex:1,
      }}
    >
      {/* Gold top strip */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,
        height: hov ? "4px" : "3px",
        background:GOLD3,
        transition:"height .25s ease",
      }}/>

      {/* Subtle inner highlight on hover */}
      <div style={{
        position:"absolute",inset:0,borderRadius:"20px",
        background: hov
          ? "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.55) 0%,transparent 55%)"
          : "none",
        pointerEvents:"none",zIndex:0,
      }}/>

      {/* Avatar + header block */}
      <div style={{display:"flex",gap:"20px",alignItems:"flex-start",position:"relative",zIndex:1}}>
        <Avatar initial={doc.initial} photo={doc.photo} size={84} verified active />
        <div style={{flex:1}}>
          {/* Role badge */}
          <div style={{
            display:"inline-flex",alignItems:"center",
            background:"linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
            padding:"3px 12px",marginBottom:"10px",borderRadius:"4px",
            boxShadow:"2px 2px 6px rgba(166,123,47,.28)",
          }}>
            <span style={{
              fontSize:"8px",letterSpacing:".22em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 700",color:"#1c1304",
            }}>
              {doc.badge}
            </span>
          </div>

          <h3 style={{
            fontVariationSettings:"'wdth' 85,'wght' 700",
            fontSize:"20px",color:"#1c1304",marginBottom:"5px",lineHeight:1.2,
          }}>
            {doc.name}
          </h3>
          <p style={{
            fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 500",
            color:"#C8963E",marginBottom:"3px",
          }}>
            {doc.credentials}
          </p>
          <p style={{
            fontSize:"11px",color:"rgba(28,19,4,.45)",
            fontVariationSettings:"'wdth' 75,'wght' 400",letterSpacing:".04em",
          }}>
            {doc.role}
          </p>
        </div>
      </div>

      {/* Quote — with subtle white bg for depth */}
      <blockquote style={{
        borderLeft:"2px solid #C8963E",
        margin:0,
        padding:"12px 16px",
        borderRadius:"0 10px 10px 0",
        background:"rgba(255,255,255,.48)",
        boxShadow:"inset 2px 2px 6px rgba(183,163,146,.18),inset -2px -2px 6px rgba(255,255,255,.6)",
        position:"relative",zIndex:1,
      }}>
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontSize:"14px",fontStyle:"italic",lineHeight:1.7,
          color:"rgba(28,19,4,.70)",
        }}>
          &ldquo;{doc.quote}&rdquo;
        </p>
      </blockquote>

      {/* Specialty tags — neumorphic pills */}
      <div style={{display:"flex",flexWrap:"wrap",gap:"8px",position:"relative",zIndex:1}}>
        {doc.specialties.map(s=><NeuTag key={s} label={s}/>)}
      </div>

      {/* Gold gradient divider */}
      <div style={{
        height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(200,150,62,.35),transparent)",
        position:"relative",zIndex:1,
      }}/>

      {/* CTAs */}
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",position:"relative",zIndex:1}}>
        {doc.ctas.map(c=>(
          <PopBtn key={c.label} href={c.href||"#"} variant={c.variant} onClick={c.action==="consult"?(e)=>{e.preventDefault();onConsult?.();}:undefined}>
            {c.label}
          </PopBtn>
        ))}
      </div>

      {doc.consultNote && (
        <p style={{
          fontSize:"11px",color:"rgba(28,19,4,.40)",
          fontVariationSettings:"'wdth' 100,'wght' 300",
          lineHeight:1.6,marginTop:"-6px",position:"relative",zIndex:1,
        }}>
          ⓘ {doc.consultNote}
        </p>
      )}

      {/* Animated gold border ring on hover */}
      <div style={{
        position:"absolute",inset:0,borderRadius:"20px",
        border:`1.5px solid rgba(200,150,62,${hov?0.4:0})`,
        transition:"border-color .35s ease",
        pointerEvents:"none",
      }}/>
    </motion.div>
  );
}

// ─── CITY DOCTOR CARD ─────────────────────────────────────────────────────────

function DoctorResultCard({ doc, idx }: { doc:Doctor; idx:number }) {
  const initial = doc.name.split(" ")[1]?.[0] || "D";

  return (
    <motion.div
      initial={{opacity:0,y:24}}
      animate={{opacity:1,y:0}}
      transition={{duration:.45,delay:idx*.08,ease:EASE}}
      style={{
        background:"#fff",
        border:"1px solid rgba(183,163,146,.28)",
        padding:"24px 20px",
        display:"flex",gap:"16px",alignItems:"flex-start",
        position:"relative",overflow:"hidden",
        fontFamily:FONT,
      }}
    >
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2px",
        background:GOLD3,
      }}/>

      <Avatar initial={initial} size={52}/>

      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px",flexWrap:"wrap",gap:"6px"}}>
          <h4 style={{
            fontVariationSettings:"'wdth' 85,'wght' 700",
            fontSize:"16px",color:"#1c1304",
          }}>
            {doc.name}
          </h4>
          <span style={{
            fontSize:"9px",letterSpacing:".15em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            color:"#C8963E",
            background:"rgba(200,150,62,.10)",
            border:"1px solid rgba(200,150,62,.28)",
            padding:"3px 8px",flexShrink:0,
          }}>
            ★ {doc.trust_score}
          </span>
        </div>

        <p style={{
          fontSize:"11px",color:"#C8963E",
          fontVariationSettings:"'wdth' 75,'wght' 500",
          letterSpacing:".1em",textTransform:"uppercase",
          marginBottom:"8px",
        }}>
          {doc.qualification}
        </p>

        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"12px"}}>
          {doc.speciality.map(s=><Tag key={s} label={s}/>)}
        </div>

        <div style={{display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"}}>
          <span style={{
            fontSize:"11px",color:"rgba(28,19,4,.45)",
            fontVariationSettings:"'wdth' 75,'wght' 400",
          }}>
            {doc.patients_visited} patients · {doc.monthly_recommendations} recommendations/mo
          </span>
          <PopBtn
            href={doc.booking_link}
            variant={doc.is_free?"gold":"ghost"}
            style={{padding:"9px 20px"}}
          >
            {doc.is_free ? "Free Consultation" : `Book ₹${doc.consultation_fee}`}
          </PopBtn>
        </div>
      </div>
    </motion.div>
  );
}

// ─── LEAD FORM ───────────────────────────────────────────────────────────────

function AssessmentForm() {
  const [form, setForm] = useState({name:"",email:"",whatsapp:""});
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    width:"100%",padding:"12px 16px",
    background:"#fff",border:"1px solid rgba(183,163,146,.40)",
    fontFamily:FONT,fontSize:"14px",color:"#1c1304",
    outline:"none",
    fontVariationSettings:"'wdth' 100,'wght' 300",
    boxSizing:"border-box",
  };

  if (submitted) {
    return (
      <motion.div
        initial={{opacity:0,scale:.96}}
        animate={{opacity:1,scale:1}}
        transition={SPRING}
        style={{
          textAlign:"center",padding:"32px 24px",
          background:"rgba(200,150,62,.08)",
          border:"1px solid rgba(200,150,62,.28)",
        }}
      >
        <div style={{fontSize:"28px",marginBottom:"12px"}}>✓</div>
        <p style={{
          fontVariationSettings:"'wdth' 85,'wght' 700",
          fontFamily:FONT,fontSize:"16px",color:"#1c1304",marginBottom:"6px",
        }}>
          Assessment Submitted
        </p>
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,fontSize:"13px",color:"rgba(28,19,4,.55)",lineHeight:1.6,
        }}>
          Dr. Kashish reviews every submission. You will hear back within 24 hours on WhatsApp.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div>
          <label style={{
            display:"block",fontSize:"10px",letterSpacing:".14em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            fontFamily:FONT,color:"rgba(28,19,4,.50)",marginBottom:"6px",
          }}>
            Your Name
          </label>
          <input
            type="text" placeholder="Arjun Kumar"
            value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{
            display:"block",fontSize:"10px",letterSpacing:".14em",textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 600",
            fontFamily:FONT,color:"rgba(28,19,4,.50)",marginBottom:"6px",
          }}>
            Email
          </label>
          <input
            type="email" placeholder="you@email.com"
            value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label style={{
          display:"block",fontSize:"10px",letterSpacing:".14em",textTransform:"uppercase",
          fontVariationSettings:"'wdth' 75,'wght' 600",
          fontFamily:FONT,color:"rgba(28,19,4,.50)",marginBottom:"6px",
        }}>
          WhatsApp Number
        </label>
        <input
          type="tel" placeholder="+91 98765 43210"
          value={form.whatsapp} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))}
          style={inputStyle}
        />
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",marginTop:"4px"}}>
        <p style={{
          fontSize:"11px",color:"rgba(28,19,4,.40)",
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontFamily:FONT,lineHeight:1.5,maxWidth:"340px",
        }}>
          Dr. Kashish reviews every submission personally. Response within 24 hours.
        </p>
        <PopBtn
          variant="gold"
          onClick={()=>{ if(form.name&&form.email) setSubmitted(true); }}
        >
          Take Assessment →
        </PopBtn>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

const FEATURED_DOCTORS: FeaturedDoc[] = [
  {
    initial:"K",
    name:"Dr. Kashish Gupta",
    role:"Founder, 3TATTAVA · AYUSH Ministry Consultant",
    credentials:"BAMS · CBPACS · Ayurveda Physician",
    badge:"Founder & Lead Physician",
    quote:"Ayurveda should help people perform better — not just recover after problems arise. 3TATTAVA was built on that belief.",
    specialties:["Performance Ayurveda","Clinical Shilajit","Sports Recovery","Mineral Medicine"],
    ctas:[
      { label:"Explore Performance Ayurveda →", variant:"gold", href:"/research-testing" },
    ],
  },
  {
    initial:"F", photo:"/team/dr-falguni-chauhan.jpg",
    name:"Dr. Falguni Chauhan",
    role:"Performance Nutrition Expert",
    credentials:"BAMS · Ayurveda Dietician",
    badge:"Performance Nutrition Expert",
    quote:"Every individual is different based on their Prakriti. Your first consultation is free — and includes a personalised diet chart built around your body type.",
    specialties:["Prakriti Assessment","Sports Nutrition","Women's Wellness","Gut Health"],
    ctas:[
      { label:"Book Free Consultation", variant:"gold", action:"consult" },
    ],
    consultNote:"First 30-minute online consultation is free and includes a personalised Prakriti-based diet chart.",
  },
];


export default function VaidyaConnectClient() {
  const [query, setQuery]           = useState("");
  const [consultOpen, setConsultOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searched, setSearched]     = useState(false);
  const [doctors, setDoctors]       = useState<Doctor[]>([]);
  const [loading, setLoading]       = useState(false);

  const featuredRef  = useRef<HTMLElement>(null);
  const assessRef    = useRef<HTMLElement>(null);
  const compareRef   = useRef<HTMLElement>(null);
  const searchRef    = useRef<HTMLElement>(null);

  const featuredInView = useInView(featuredRef,  { once:true, margin:"-60px" });
  const assessInView   = useInView(assessRef,    { once:true, margin:"-60px" });
  const compareInView  = useInView(compareRef,   { once:true, margin:"-60px" });
  const searchInView   = useInView(searchRef,    { once:true, margin:"-60px" });

  useEffect(()=>{
    if (query.length < 2) { setSuggestions([]); return; }
    setSuggestions(CITIES.filter(c=>c.toLowerCase().includes(query.toLowerCase())));
  },[query]);

  const handleSearch = (city:string) => {
    setQuery(city); setSuggestions([]);
    setLoading(true);
    setTimeout(()=>{
      setDoctors(DUMMY_DOCTORS);
      setSearched(true);
      setLoading(false);
    }, 900);
  };

  const inputStyle: React.CSSProperties = {
    width:"100%",padding:"14px 20px",
    background:"#fff",border:"1px solid rgba(183,163,146,.40)",
    fontFamily:FONT,fontSize:"15px",color:"#1c1304",
    outline:"none",boxSizing:"border-box",
    fontVariationSettings:"'wdth' 100,'wght' 300",
  };

  return (
    <div style={{fontFamily:FONT,color:"#1c1304",background:"#f7f0e2"}}>

      {/* ── TICKER ─────────────────────────────────────────────────────────── */}
      <Ticker/>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        position:"relative",overflow:"hidden",
        background:"url('/posters/vaidyaconnect/1.jpg') center/cover no-repeat #f7f0e2",
        padding:"96px 24px 80px",textAlign:"center",
      }}>
        {/* Overlay to keep text readable */}
        <div style={{position:"absolute",inset:0,background:"rgba(247,240,226,0.62)",zIndex:0}}/>
        <VcBg/>
        <div style={{position:"relative",zIndex:1,maxWidth:"760px",margin:"0 auto"}}>

          <motion.p
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,ease:EASE}}
            style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,
              color:"#C8963E",marginBottom:"20px",
            }}
          >
            VAIDYACONNECT · 3TATTAVA DOCTOR NETWORK
          </motion.p>

          <motion.h1
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:.65,delay:.1,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontFamily:FONT,
              fontSize:"clamp(34px,6vw,66px)",
              lineHeight:1.06,letterSpacing:"-.025em",
              color:"#1c1304",marginBottom:"22px",
            }}
          >
            Expert{" "}
            <em style={{
              fontStyle:"italic",
              fontVariationSettings:"'wdth' 100,'wght' 300",
              background:"linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>
              Ayurveda
            </em>{" "}
            Guidance.<br/>Built for Performance.
          </motion.h1>

          <motion.p
            initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
            transition={{duration:.55,delay:.22,ease:EASE}}
            style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"clamp(14px,2vw,17px)",lineHeight:1.65,
              color:"rgba(28,19,4,.58)",
              maxWidth:"520px",margin:"0 auto 32px",
            }}
          >
            Every practitioner in this network is vetted by Dr. Kashish, BAMS. All recommend 3TATTAVA as part of their clinical practice.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,delay:.32,ease:EASE}}
            style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap",marginBottom:"40px"}}
          >
            {["BAMS Verified","Dr. Kashish Vetted","8 Cities","Free Starter Guidance"].map(b=>(
              <motion.div
                key={b}
                whileHover={{scale:1.05,y:-1}}
                transition={SPRING}
                style={{
                  fontSize:"10px",letterSpacing:".1em",textTransform:"uppercase",
                  fontVariationSettings:"'wdth' 75,'wght' 600",
                  fontFamily:FONT,
                  color:"rgba(28,19,4,.65)",
                  background:"#fff",
                  border:"1px solid rgba(200,150,62,.32)",
                  padding:"7px 14px",cursor:"default",
                }}
              >
                ✓ {b}
              </motion.div>
            ))}
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            transition={{duration:.5,delay:.42,ease:EASE}}
            style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}
          >
            <PopBtn href="#assessment" variant="gold">Get Free Starter Guide</PopBtn>
            <PopBtn href="#search" variant="ghost">Find a Doctor in Your City</PopBtn>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED DOCTORS ───────────────────────────────────────────────── */}
      <section ref={featuredRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={featuredInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"56px"}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,color:"#C8963E",marginBottom:"12px",
            }}>
              Our Network Leads
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(24px,3.5vw,38px)",
              letterSpacing:"-.02em",lineHeight:1.1,color:"#1c1304",marginBottom:"12px",
            }}>
              Meet the Practitioners
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"15px",color:"rgba(28,19,4,.52)",
              maxWidth:"440px",margin:"0 auto",lineHeight:1.65,
            }}>
              Placeholder avatars shown. Upload your portrait to replace with your actual photo.
            </p>
          </motion.div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
            gap:"24px",alignItems:"stretch",
          }}>
            {FEATURED_DOCTORS.map((doc,i)=>(
              <FeaturedCard key={doc.name} doc={doc} idx={i} onConsult={()=>setConsultOpen(true)}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE ASSESSMENT ─────────────────────────────────────────── */}
      <section ref={assessRef} id="assessment" style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={assessInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{
              background:"#fff",
              border:"1px solid rgba(183,163,146,.28)",
              padding:"52px 48px",
              position:"relative",overflow:"hidden",
            }}
          >
            {/* Gold top bar */}
            <div style={{
              position:"absolute",top:0,left:0,right:0,height:"3px",
              background:GOLD3,
            }}/>

            <div style={{textAlign:"center",marginBottom:"36px"}}>
              <p style={{
                fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 500",
                fontFamily:FONT,color:"#C8963E",marginBottom:"12px",
              }}>
                Personalised Recommendations
              </p>
              <h2 style={{
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"clamp(24px,3vw,36px)",
                letterSpacing:"-.02em",lineHeight:1.1,
                color:"#1c1304",marginBottom:"12px",
              }}>
                Take the Performance Assessment
              </h2>
              <p style={{
                fontVariationSettings:"'wdth' 100,'wght' 300",
                fontFamily:FONT,
                fontSize:"15px",color:"rgba(28,19,4,.52)",
                maxWidth:"480px",margin:"0 auto",lineHeight:1.65,
              }}>
                A six-domain questionnaire — Dr. Kashish reviews every submission and responds with personalised guidance within 24 hours.
              </p>
            </div>

            {/* Assessment domain pills */}
            <div style={{
              display:"flex",flexWrap:"wrap",gap:"10px",
              justifyContent:"center",marginBottom:"36px",
            }}>
              {ASSESSMENT_DOMAINS.map((d,i)=>(
                <motion.div
                  key={d.label}
                  initial={{opacity:0,scale:.92}}
                  animate={assessInView?{opacity:1,scale:1}:{}}
                  transition={{duration:.4,delay:i*.06,ease:EASE}}
                  whileHover={{scale:1.06,y:-2}}
                  style={{
                    background:"#f7f0e2",
                    border:"1px solid rgba(183,163,146,.35)",
                    padding:"10px 16px",
                    display:"flex",alignItems:"center",gap:"8px",cursor:"default",
                  }}
                >
                  <span style={{fontSize:"16px"}}>{d.icon}</span>
                  <span style={{
                    fontSize:"11px",letterSpacing:".06em",
                    fontVariationSettings:"'wdth' 75,'wght' 600",
                    fontFamily:FONT,color:"rgba(28,19,4,.65)",
                  }}>
                    {d.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div style={{
              borderTop:"1px solid rgba(183,163,146,.20)",
              paddingTop:"32px",
            }}>
              <PurchaseGate
                fallback={
                  <LockedTeaser
                    eyebrow="Unlock After Your First Ritual"
                    title="Your Performance Assessment Awaits"
                    body="Dr. Kashish's personalised six-domain assessment — and his 24-hour WhatsApp guidance — unlock the moment you begin your first ritual. Claim yours with a purchase."
                    ctaLabel="Shop & Unlock"
                  />
                }
              >
                <AssessmentForm/>
              </PurchaseGate>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FREE VS PAID ───────────────────────────────────────────────────── */}
      <section ref={compareRef} style={{background:"#fff",padding:"88px 24px"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={compareInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"48px"}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,color:"#C8963E",marginBottom:"12px",
            }}>
              Choose Your Path
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(22px,3vw,34px)",
              letterSpacing:"-.02em",color:"#1c1304",
            }}>
              Free Guidance or Personalised Program
            </h2>
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
            {/* Free */}
            <motion.div
              initial={{opacity:0,x:-24}}
              animate={compareInView?{opacity:1,x:0}:{}}
              transition={{duration:.55,ease:EASE}}
              style={{
                background:"#f7f0e2",
                border:"1px solid rgba(183,163,146,.35)",
                padding:"36px 32px",
              }}
            >
              <div style={{
                fontSize:"9px",letterSpacing:".22em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 700",
                fontFamily:FONT,
                color:"rgba(28,19,4,.40)",marginBottom:"12px",
              }}>
                Complimentary
              </div>
              <h3 style={{
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"22px",color:"#1c1304",marginBottom:"8px",
              }}>
                Starter Guidance
              </h3>
              <div style={{
                fontVariationSettings:"'wdth' 85,'wght' 800",
                fontFamily:FONT,
                fontSize:"28px",color:"#1c1304",marginBottom:"24px",
              }}>
                Free
              </div>
              <ul style={{listStyle:"none",padding:0,margin:"0 0 28px",display:"flex",flexDirection:"column",gap:"12px"}}>
                {[
                  "Prakriti (body-type) quiz",
                  "Starter diet guide from Dr. Falguni",
                  "Shilajit ritual guide from Dr. Kashish",
                ].map(item=>(
                  <li key={item} style={{
                    display:"flex",gap:"10px",alignItems:"flex-start",
                    fontSize:"13.5px",color:"rgba(28,19,4,.68)",
                    fontVariationSettings:"'wdth' 100,'wght' 400",
                    fontFamily:FONT,lineHeight:1.5,
                  }}>
                    <span style={{
                      width:"18px",height:"18px",borderRadius:"50%",
                      background:"rgba(200,150,62,.15)",
                      border:"1px solid rgba(200,150,62,.35)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      flexShrink:0,fontSize:"10px",color:"#C8963E",marginTop:"1px",
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <PopBtn href="#assessment" variant="ghost" style={{width:"100%",justifyContent:"center"}}>
                Get Free Guide →
              </PopBtn>
            </motion.div>

            {/* Paid */}
            <motion.div
              initial={{opacity:0,x:24}}
              animate={compareInView?{opacity:1,x:0}:{}}
              transition={{duration:.55,delay:.12,ease:EASE}}
              style={{
                background:"#fff",
                border:"1.5px solid rgba(200,150,62,.45)",
                padding:"36px 32px",
                position:"relative",overflow:"hidden",
              }}
            >
              <div style={{
                position:"absolute",top:0,left:0,right:0,height:"3px",
                background:GOLD3,
              }}/>
              <div style={{
                fontSize:"9px",letterSpacing:".22em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 700",
                fontFamily:FONT,
                color:"#C8963E",marginBottom:"12px",
              }}>
                Personalised
              </div>
              <h3 style={{
                fontVariationSettings:"'wdth' 85,'wght' 700",
                fontFamily:FONT,
                fontSize:"22px",color:"#1c1304",marginBottom:"8px",
              }}>
                Personalized Program
              </h3>
              <div style={{marginBottom:"24px"}}>
                <span style={{
                  fontVariationSettings:"'wdth' 85,'wght' 800",
                  fontFamily:FONT,
                  fontSize:"28px",color:"#1c1304",
                }}>
                  ₹800
                </span>
                <span style={{
                  fontSize:"12px",color:"rgba(28,19,4,.45)",
                  fontVariationSettings:"'wdth' 75,'wght' 400",
                  fontFamily:FONT,
                  marginLeft:"6px",
                }}>
                  / session
                </span>
              </div>
              <ul style={{listStyle:"none",padding:0,margin:"0 0 28px",display:"flex",flexDirection:"column",gap:"12px"}}>
                {[
                  "1-on-1 consultation with Dr. Kashish or Dr. Falguni",
                  "Custom supplement protocol (product + dosage)",
                  "90-day check-in and outcome tracking",
                ].map(item=>(
                  <li key={item} style={{
                    display:"flex",gap:"10px",alignItems:"flex-start",
                    fontSize:"13.5px",color:"rgba(28,19,4,.68)",
                    fontVariationSettings:"'wdth' 100,'wght' 400",
                    fontFamily:FONT,lineHeight:1.5,
                  }}>
                    <span style={{
                      width:"18px",height:"18px",borderRadius:"50%",
                      background:"linear-gradient(145deg,#A67B2F,#E4C079)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      flexShrink:0,fontSize:"10px",color:"#1c1304",marginTop:"1px",
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <PopBtn href="#assessment" variant="gold" style={{width:"100%",justifyContent:"center"}}>
                Book Consultation →
              </PopBtn>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CITY SEARCH ────────────────────────────────────────────────────── */}
      <section ref={searchRef} id="search" style={{background:"#f7f0e2",padding:"88px 24px"}}>
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          <motion.div
            initial={{opacity:0,y:24}}
            animate={searchInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,ease:EASE}}
            style={{textAlign:"center",marginBottom:"40px"}}
          >
            <p style={{
              fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",
              fontVariationSettings:"'wdth' 75,'wght' 500",
              fontFamily:FONT,color:"#C8963E",marginBottom:"12px",
            }}>
              Network Directory
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily:FONT,
              fontSize:"clamp(22px,3vw,34px)",
              letterSpacing:"-.02em",color:"#1c1304",marginBottom:"12px",
            }}>
              Find a Doctor in Your City
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:FONT,
              fontSize:"14px",color:"rgba(28,19,4,.50)",lineHeight:1.6,
            }}>
              All practitioners recommend 3TATTAVA as part of their clinical practice.
            </p>
          </motion.div>

          {/* Search input */}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={searchInView?{opacity:1,y:0}:{}}
            transition={{duration:.5,delay:.1,ease:EASE}}
            style={{position:"relative",marginBottom:"32px"}}
          >
            <input
              type="text"
              placeholder="Enter your city — Delhi, Mumbai, Bengaluru..."
              value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&query.trim()) handleSearch(query.trim()); }}
              style={{...inputStyle,paddingRight:"56px",
                boxShadow:"0 2px 12px rgba(28,19,4,.06)",
              }}
            />
            <motion.button
              onClick={()=>{ if(query.trim()) handleSearch(query.trim()); }}
              whileHover={{scale:1.06}}
              whileTap={{scale:.96}}
              transition={SPRING}
              style={{
                position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",
                background:"linear-gradient(145deg,#C8963E,#A67B2F)",
                border:"none",width:"38px",height:"38px",
                display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
              }}
              aria-label="Search"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="#1c1304">
                <circle cx="8.5" cy="8.5" r="5.75" stroke="#1c1304" strokeWidth="1.5" fill="none"/>
                <path d="M13 13l4 4" stroke="#1c1304" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* City suggestions */}
            <AnimatePresence>
              {suggestions.length>0 && (
                <motion.div
                  initial={{opacity:0,y:-4}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-4}}
                  transition={{duration:.2,ease:EASE}}
                  style={{
                    position:"absolute",top:"100%",left:0,right:0,zIndex:20,
                    background:"#fff",
                    border:"1px solid rgba(183,163,146,.35)",
                    boxShadow:"0 8px 24px rgba(28,19,4,.10)",
                  }}
                >
                  {suggestions.map(s=>(
                    <button
                      key={s}
                      onClick={()=>handleSearch(s)}
                      style={{
                        display:"block",width:"100%",textAlign:"left",
                        padding:"12px 16px",background:"none",border:"none",
                        borderBottom:"1px solid rgba(183,163,146,.15)",
                        cursor:"pointer",fontFamily:FONT,fontSize:"14px",color:"#1c1304",
                        fontVariationSettings:"'wdth' 100,'wght' 400",
                      }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#f7f0e2";}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="none";}}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{textAlign:"center",padding:"32px"}}
              >
                <div style={{
                  width:"32px",height:"32px",borderRadius:"50%",margin:"0 auto",
                  border:"2px solid rgba(200,150,62,.25)",
                  borderTop:"2px solid #C8963E",
                  animation:"vc-spin 0.8s linear infinite",
                }}/>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {searched && !loading && (
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}}
              transition={{duration:.4,ease:EASE}}
            >
              <p style={{
                fontSize:"12px",letterSpacing:".1em",textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 500",
                fontFamily:FONT,color:"rgba(28,19,4,.40)",
                marginBottom:"16px",
              }}>
                {doctors.length} practitioners found near {query}
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                {doctors.map((d,i)=>(
                  <DoctorResultCard key={d._id} doc={d} idx={i}/>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── BOTTOM DISCLAIMER ──────────────────────────────────────────────── */}
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
          VaidyaConnect practitioners are independent Ayurveda physicians. Consultations are not a substitute for emergency medical care. All consultants are BAMS-qualified and vetted by Dr. Kashish Gupta, Founder, 3TATTAVA.
        </p>
      </section>

      <ConsultationModal open={consultOpen} onClose={()=>setConsultOpen(false)} />

    </div>
  );
}
