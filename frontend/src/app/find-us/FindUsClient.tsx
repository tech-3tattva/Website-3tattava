"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import BgVideo from "@/components/ui/BgVideo";

const MapField3D = dynamic(() => import("@/components/find-us/MapField3D"), { ssr: false });
const GoogleWTFMap = dynamic(() => import("@/components/maps/GoogleWTFMap"), { ssr: false });
const MAPS_ON = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID);

// ─── REAL DATA FROM WTF GYM PDF ──────────────────────────────────────────────

interface WTFCenter {
  id: number;
  name: string;
  city: "Delhi" | "Noida" | "Greater Noida" | "Ghaziabad" | "Gurugram" | "Faridabad";
  address: string;
  pincode: string;
  trainers: number;
  sqft: number;
  lat: number;
  lng: number;
}

const WTF_CENTERS: WTFCenter[] = [
  { id: 1,  name: "WTF Sector 16 — World Trade Tower", city: "Noida",        address: "M Floor, World Trade Tower, Sector 16, Noida", pincode: "201301", trainers: 11, sqft: 10000, lat: 28.5686, lng: 77.3196 },
  { id: 2,  name: "WTF Sector 22",                    city: "Noida",        address: "2nd Floor, C.S. Rana Complex, near Shiv Mandir, Block D, Sector 22, Noida", pincode: "201301", trainers: 4, sqft: 2500, lat: 28.5741, lng: 77.3228 },
  { id: 3,  name: "WTF Sector 70",                    city: "Noida",        address: "BS-102, Basai, Sector 70, Noida, Uttar Pradesh", pincode: "201301", trainers: 3, sqft: 2200, lat: 28.5570, lng: 77.3810 },
  { id: 4,  name: "WTF Indirapuram — Nayaykhand 3",   city: "Ghaziabad",   address: "441/4, Kala Pathar Rd, Opposite Orange Count, Gyan Khand III, Indirapuram, Ghaziabad", pincode: "201014", trainers: 6, sqft: 4000, lat: 28.6447, lng: 77.3571 },
  { id: 5,  name: "WTF Sector 122",                   city: "Noida",        address: "Basement, PK-09, Sector 122, Noida, Uttar Pradesh", pincode: "201316", trainers: 4, sqft: 2700, lat: 28.5330, lng: 77.3540 },
  { id: 6,  name: "WTF Sector 116",                   city: "Noida",        address: "SD-06, Sector 116, Noida, Uttar Pradesh", pincode: "201301", trainers: 4, sqft: 4000, lat: 28.5210, lng: 77.3480 },
  { id: 7,  name: "WTF Sector 121 — Parthala",        city: "Noida",        address: "PKA-8, near Baraamda Restaurant, Parthala Khanjarpur, Sector 121, Noida 201316", pincode: "201316", trainers: 4, sqft: 4500, lat: 28.5174, lng: 77.3400 },
  { id: 8,  name: "WTF Shalimar Garden",              city: "Ghaziabad",   address: "Ram Enclave, 80 Feet Rd, Shalimar Apartment, Block A, Shalimar Garden, Sahibabad, Ghaziabad", pincode: "201006", trainers: 5, sqft: 4500, lat: 28.6733, lng: 77.3555 },
  { id: 9,  name: "WTF Noida West — Sector 1",        city: "Greater Noida", address: "NB Mart, opp. Sanskriti Apartment, behind CRC & ATS Society, Sector 1, Bisrakh Jalalpur, Greater Noida", pincode: "201308", trainers: 3, sqft: 3500, lat: 28.5960, lng: 77.4300 },
  { id: 10, name: "WTF Dwarka — Sector 10",           city: "Delhi",        address: "DDA Market, Pocket 1, Sector 10 Dwarka, New Delhi", pincode: "110075", trainers: 4, sqft: 3800, lat: 28.5931, lng: 77.0475 },
  { id: 11, name: "WTF Rohini — Sector 24",           city: "Delhi",        address: "102, above Bank of Baroda, Pocket 27, Sector 24, Rohini, Delhi", pincode: "110085", trainers: 4, sqft: 3000, lat: 28.7455, lng: 77.1005 },
  { id: 12, name: "WTF Rohini — Sector 23",           city: "Delhi",        address: "C-548, Near Sunrise Traders, Gram Sabha, Pooth Kalan, Sector 23, Rohini, Delhi", pincode: "110085", trainers: 6, sqft: 3200, lat: 28.7440, lng: 77.1020 },
  { id: 13, name: "WTF Dwarka — Sector 17",           city: "Delhi",        address: "3rd & 4th Floor, WTF Gym, Plot 17, Pocket C, Sector 17 Dwarka, Delhi", pincode: "110078", trainers: 5, sqft: 4000, lat: 28.5754, lng: 77.0469 },
  { id: 14, name: "WTF Nehru Nagar",                  city: "Ghaziabad",   address: "Moti Lal Nehru Marg, near Zudio Store, Ram Nagar, Nehru Nagar, Ghaziabad", pincode: "201001", trainers: 4, sqft: 3000, lat: 28.6652, lng: 77.4315 },
  { id: 15, name: "WTF Shakti Khand — Indirapuram",   city: "Ghaziabad",   address: "WTF Gym, Plot No. 380, Lane 5, Shakti Khand 4, Indirapuram, Ghaziabad", pincode: "201014", trainers: 3, sqft: 2800, lat: 28.6375, lng: 77.3574 },
  { id: 16, name: "WTF Mayur Vihar Phase-3",          city: "Delhi",        address: "Shop No. B-1/381, Mayur Vihar Phase-3, Pragati Marg, Pocket B1, New Kondli", pincode: "110096", trainers: 7, sqft: 4000, lat: 28.6027, lng: 77.3148 },
  { id: 17, name: "WTF Janakpuri",                    city: "Delhi",        address: "A-3, 233, SS Mota Singh Marg, opp. St. Francis De Sales School, Block A3, Kondli, Delhi", pincode: "110058", trainers: 5, sqft: 4200, lat: 28.6289, lng: 77.0815 },
  { id: 18, name: "WTF Greater Noida — Ace City",     city: "Greater Noida", address: "Mahaveer Plaza, behind ACE CITY, Sector 1, Aimnabad, Bisrakh Jalalpur, Greater Noida", pincode: "201306", trainers: 6, sqft: 6500, lat: 28.5780, lng: 77.4415 },
  { id: 19, name: "WTF Greenfield, Faridabad",        city: "Faridabad",   address: "First Floor, H. No. B-693, Greenfield Colony Block B, Greenfields, Sector 43, Faridabad", pincode: "121010", trainers: 5, sqft: 4000, lat: 28.3934, lng: 77.3120 },
  { id: 20, name: "WTF Shahdara",                     city: "Delhi",        address: "A-82, Jagat Puri Chowk, near Under Pass, Nathu Colony, Shahdara, Delhi", pincode: "110093", trainers: 7, sqft: 2700, lat: 28.6680, lng: 77.2863 },
  { id: 21, name: "WTF Punjabi Bagh",                 city: "Delhi",        address: "56/43, West Punjabi Bagh, Delhi", pincode: "110026", trainers: 6, sqft: 4000, lat: 28.6668, lng: 77.1356 },
  { id: 22, name: "WTF Raj Nagar",                    city: "Ghaziabad",   address: "R-13/112, Sector 13, Block 13, Raj Nagar, Ghaziabad, Uttar Pradesh", pincode: "201001", trainers: 4, sqft: 6000, lat: 28.6680, lng: 77.4320 },
  { id: 23, name: "WTF Govindpuram",                  city: "Ghaziabad",   address: "C-5, near HDFC Bank, Balaji Enclave, Krishna Garden Colony, Govindpuram, Ghaziabad", pincode: "201013", trainers: 5, sqft: 4000, lat: 28.7100, lng: 77.4500 },
  { id: 24, name: "WTF Raj Nagar Extension",          city: "Ghaziabad",   address: "VVIP Assets, Plot No. 6, Raj Nagar Extension, Ghaziabad, Uttar Pradesh", pincode: "201003", trainers: 5, sqft: 4200, lat: 28.6770, lng: 77.4158 },
  { id: 25, name: "WTF Gurugram — Sector 7",          city: "Gurugram",    address: "P21, Variman Point, Circular Rd, New Colony, Gurgaon Rural, Gurugram, Haryana", pincode: "122001", trainers: 4, sqft: 7500, lat: 28.4785, lng: 77.0207 },
  { id: 26, name: "WTF Gurugram — Sector 4",          city: "Gurugram",    address: "One Life Fitness, Cancon Enclave, Old Railway Rd, Urban Estate, Sector 4, Gurugram", pincode: "122001", trainers: 4, sqft: 4200, lat: 28.4720, lng: 77.0350 },
  { id: 27, name: "WTF Faridabad — Sector 82",        city: "Faridabad",   address: "Near Chandila Chowk, Bathola, Near World Street, Sector 82, Haryana", pincode: "121004", trainers: 3, sqft: 4400, lat: 28.3900, lng: 77.3250 },
  { id: 28, name: "WTF New Ashok Nagar",              city: "Delhi",        address: "E-480, New Ashok Nagar Road, Near Vasundra Enclave, Delhi", pincode: "110096", trainers: 5, sqft: 3500, lat: 28.6127, lng: 77.3120 },
];

const CITY_TABS = ["All", "Delhi", "Noida", "Ghaziabad", "Greater Noida", "Gurugram", "Faridabad"] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CITY_COLORS: Record<string, string> = {
  Delhi: "#cd872a",
  Noida: "#7a5c4e",
  Ghaziabad: "#5c7a4e",
  "Greater Noida": "#4e6b7a",
  Gurugram: "#7a4e6b",
  Faridabad: "#6b7a4e",
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pincodeToCoords(pin: string): { lat: number; lng: number } | null {
  const code = parseInt(pin, 10);
  if (isNaN(code) || pin.length !== 6) return null;
  // Central Delhi
  if (code >= 110001 && code <= 110009) return { lat: 28.636, lng: 77.224 };
  // South Delhi
  if (code >= 110010 && code <= 110025) return { lat: 28.553, lng: 77.230 };
  // West Delhi / Punjabi Bagh
  if (code >= 110026 && code <= 110035) return { lat: 28.660, lng: 77.130 };
  // West Delhi general
  if (code >= 110036 && code <= 110059) return { lat: 28.618, lng: 77.092 };
  // Dwarka
  if (code >= 110070 && code <= 110079) return { lat: 28.582, lng: 77.054 };
  // Rohini / NW Delhi
  if (code >= 110080 && code <= 110089) return { lat: 28.742, lng: 77.098 };
  // East Delhi / Shahdara / Mayur Vihar / New Ashok Nagar
  if (code >= 110090 && code <= 110099) return { lat: 28.618, lng: 77.305 };
  // Noida (201301–201320)
  if (code >= 201301 && code <= 201320) return { lat: 28.558, lng: 77.350 };
  // Ghaziabad (201001–201020)
  if (code >= 201001 && code <= 201020) return { lat: 28.668, lng: 77.432 };
  // Greater Noida (201306–201320)
  if (code >= 201300 && code <= 201320) return { lat: 28.578, lng: 77.442 };
  // Gurugram (122001–122052)
  if (code >= 122001 && code <= 122052) return { lat: 28.465, lng: 77.032 };
  // Faridabad (121001–121015)
  if (code >= 121001 && code <= 121015) return { lat: 28.396, lng: 77.315 };
  return null; // Outside NCR
}

function gmapsLink(center: WTFCenter): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`;
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── AYURVEDIC BACKGROUND ─────────────────────────────────────────────────────

function AyurvedicBg() {
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes mandala-cw  { to { transform: rotate(360deg); } }
        @keyframes mandala-ccw { to { transform: rotate(-360deg); } }
        @keyframes float-a { 0%,100%{transform:translateY(0) scale(1);opacity:.5} 55%{transform:translateY(-20px) scale(1.1);opacity:.9} }
        @keyframes float-b { 0%,100%{transform:translateY(0);opacity:.4} 45%{transform:translateY(-14px);opacity:.8} }
        @keyframes float-c { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.3} 60%{transform:translateY(-18px) rotate(180deg);opacity:.7} }
      `}</style>

      {/* Large mandala — top-right */}
      <div style={{ position:"absolute", top:"-140px", right:"-140px", width:"560px", height:"560px", pointerEvents:"none", animation:"mandala-cw 220s linear infinite", opacity:0.055, zIndex:0 }}>
        <svg viewBox="0 0 560 560">
          {[40,85,130,175,220,265].map((r,i)=>(
            <circle key={r} cx={280} cy={280} r={r} fill="none" stroke="#cd872a" strokeWidth={i%2===0?1.5:0.6}/>
          ))}
          {Array.from({length:12}).map((_,i)=>(
            <line key={i} x1={280} y1={10} x2={280} y2={550} stroke="#cd872a" strokeWidth={0.4} transform={`rotate(${i*30} 280 280)`}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <ellipse key={i} cx={280} cy={155} rx={22} ry={72} fill="none" stroke="#cd872a" strokeWidth={0.6} transform={`rotate(${i*45} 280 280)`}/>
          ))}
        </svg>
      </div>

      {/* Medium mandala — bottom-left */}
      <div style={{ position:"absolute", bottom:"40px", left:"-80px", width:"320px", height:"320px", pointerEvents:"none", animation:"mandala-ccw 160s linear infinite", opacity:0.04, zIndex:0 }}>
        <svg viewBox="0 0 320 320">
          {[30,60,90,120,150].map((r)=>(
            <circle key={r} cx={160} cy={160} r={r} fill="none" stroke="#b7a392" strokeWidth={1}/>
          ))}
          {Array.from({length:8}).map((_,i)=>(
            <line key={i} x1={160} y1={5} x2={160} y2={315} stroke="#b7a392" strokeWidth={0.5} transform={`rotate(${i*45} 160 160)`}/>
          ))}
        </svg>
      </div>

      {/* Floating gold particles */}
      {[
        { top:"12%", left:"6%",  size:5, anim:"float-a 6.2s ease-in-out infinite" },
        { top:"38%", left:"2%",  size:3, anim:"float-b 8.4s ease-in-out infinite 1.1s" },
        { top:"60%", right:"4%", size:6, anim:"float-c 7.1s ease-in-out infinite 2.3s" },
        { top:"20%", right:"7%", size:4, anim:"float-a 9.0s ease-in-out infinite 0.6s" },
        { top:"78%", left:"10%", size:3, anim:"float-b 7.8s ease-in-out infinite 3.1s" },
      ].map((d,i)=>(
        <div key={i} style={{
          position:"absolute", ...d,
          width:d.size, height:d.size, borderRadius:"50%",
          background:"radial-gradient(circle, #E4C079, #cd872a)",
          animation:d.anim, pointerEvents:"none", zIndex:0,
        }}/>
      ))}
    </>
  );
}

// ─── LOCATION CARD ────────────────────────────────────────────────────────────

const FONT = "var(--font-primary), system-ui, sans-serif";

function LocationCard({ center, idx, highlight }: { center: WTFCenter; idx: number; highlight?: boolean; distance?: number }) {
  const [hovered, setHovered]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const entryRef     = useRef<HTMLDivElement>(null);
  const inView       = useInView(entryRef, { once: true, margin: "-40px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-60, 60], [5, -5]);
  const rotateY = useTransform(mouseX, [-60, 60], [-5, 5]);
  const springX = useSpring(rotateX, { stiffness: 280, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 280, damping: 30 });

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const pinId = `goldPin-${center.id}`;

  return (
    <motion.div
      ref={entryRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (idx % 7) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setExpanded(!expanded)}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          fontFamily: FONT,
          background: "#f7f0e2",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          boxShadow: expanded || highlight
            ? "20px 20px 42px rgba(183,163,146,.55),-20px -20px 42px rgba(255,255,255,1),0 0 0 1.5px rgba(205,135,42,.42)"
            : hovered
            ? "14px 14px 28px rgba(183,163,146,.46),-14px -14px 28px rgba(255,255,255,.94)"
            : "10px 10px 24px rgba(183,163,146,.38),-10px -10px 24px rgba(255,255,255,.88)",
          transition: "box-shadow .32s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Gold border ring on hover/expand */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "16px",
          border: "1.5px solid rgba(205,135,42,.55)",
          opacity: hovered || expanded || highlight ? 1 : 0,
          transition: "opacity .3s",
          pointerEvents: "none", zIndex: 10,
        }}/>

        {/* Inner radial highlight */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "45%",
          background: hovered
            ? "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.48),transparent 72%)"
            : "none",
          borderRadius: "16px 16px 0 0",
          pointerEvents: "none", transition: "background .3s", zIndex: 1,
        }}/>

        {/* ── EXPAND MAP AREA ─────────────────────────────── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="map"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 148, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative", background: "#ede4d0", overflow: "hidden" }}
            >
              {/* Road grid SVG */}
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} preserveAspectRatio="none">
                {/* Horizontal roads */}
                {([30, 58, 82] as const).map((y, i) => (
                  <motion.line
                    key={`h${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke={i===1 ? "rgba(183,163,146,.55)" : "rgba(183,163,146,.28)"}
                    strokeWidth={i===1 ? 4 : 2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.65, delay: 0.08 + i * 0.1 }}
                  />
                ))}
                {/* Vertical roads */}
                {([22, 52, 78] as const).map((x, i) => (
                  <motion.line
                    key={`v${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke={i===1 ? "rgba(183,163,146,.50)" : "rgba(183,163,146,.22)"}
                    strokeWidth={i===1 ? 3 : 1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.52, delay: 0.22 + i * 0.09 }}
                  />
                ))}
              </svg>

              {/* Taupe building blocks */}
              {([
                { top:"8%",  left:"5%",    w:"13%", h:"18%", o:.30 },
                { top:"10%", left:"30%",   w:"10%", h:"14%", o:.25 },
                { top:"62%", left:"60%",   w:"16%", h:"22%", o:.28 },
                { top:"8%",  right:"6%",   w:"9%",  h:"24%", o:.22 },
                { top:"52%", left:"4%",    w:"8%",  h:"14%", o:.20 },
                { top:"5%",  left:"66%",   w:"10%", h:"12%", o:.24 },
              ] as Array<{top:string;left?:string;right?:string;w:string;h:string;o:number}>).map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.32, delay: 0.36 + i * 0.06 }}
                  style={{
                    position: "absolute",
                    top: b.top, left: b.left, right: b.right,
                    width: b.w, height: b.h,
                    borderRadius: "2px",
                    background: `rgba(183,163,146,${b.o})`,
                    border: `1px solid rgba(183,163,146,${b.o * 0.65})`,
                  }}
                />
              ))}

              {/* Gold map pin — center */}
              <motion.div
                initial={{ scale: 0, y: -18 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.26 }}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)", zIndex: 5,
                }}
              >
                <svg width="28" height="36" viewBox="0 0 24 32" fill="none"
                  style={{ filter:`drop-shadow(0 4px 12px rgba(205,135,42,.60))` }}
                >
                  <path d="M12 0C7.13 0 3 4.13 3 9c0 7.5 9 17 9 17s9-9.5 9-17c0-4.87-4.13-9-9-9z"
                    fill={`url(#${pinId})`}/>
                  <circle cx="12" cy="9" r="3.5" fill="#f7f0e2"/>
                  <defs>
                    <linearGradient id={pinId} x1="3" y1="0" x2="21" y2="26" gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor="#A67B2F"/>
                      <stop offset="50%"  stopColor="#E4C079"/>
                      <stop offset="100%" stopColor="#cd872a"/>
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Bottom fade into card */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0, height:"42%",
                background:"linear-gradient(to top,#f7f0e2,transparent)",
                pointerEvents:"none",
              }}/>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CARD CONTENT ─────────────────────────────────── */}
        <div style={{ padding: "18px 20px 20px" }}>

          {/* Top row: badge + city pill + active status */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              {/* Neumorphic number badge */}
              <div style={{
                width:"34px", height:"34px", borderRadius:"50%", flexShrink:0,
                background: expanded || highlight
                  ? "linear-gradient(145deg,#A67B2F,#E4C079)"
                  : "#f7f0e2",
                boxShadow: expanded || highlight
                  ? "4px 4px 8px rgba(166,123,47,.36),-2px -2px 5px rgba(228,192,121,.22)"
                  : "4px 4px 9px rgba(183,163,146,.40),-4px -4px 9px rgba(255,255,255,.90)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"11px",
                fontVariationSettings:"'wdth' 75,'wght' 700",
                fontFamily: FONT,
                color: expanded || highlight ? "#442a1b" : "#cd872a",
                transition:"all .32s",
              }}>
                {center.id}
              </div>

              {/* City pill */}
              <span style={{
                fontSize:"9px", letterSpacing:".16em", textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 500",
                fontFamily: FONT,
                color:"#b7a392",
                background:"#f7f0e2",
                boxShadow:"3px 3px 6px rgba(183,163,146,.35),-3px -3px 6px rgba(255,255,255,.88)",
                padding:"3px 10px", borderRadius:"20px",
                whiteSpace:"nowrap",
              }}>
                {center.city}
              </span>
            </div>

            {/* Active status pill */}
            <div style={{
              display:"flex", alignItems:"center", gap:"5px",
              background:"#f7f0e2",
              boxShadow:"2px 2px 5px rgba(183,163,146,.32),-2px -2px 5px rgba(255,255,255,.86)",
              padding:"3px 9px", borderRadius:"20px",
            }}>
              <div style={{
                width:6, height:6, borderRadius:"50%",
                background:"#cd872a",
                boxShadow:"0 0 6px rgba(205,135,42,.50)",
              }}/>
              <span style={{
                fontSize:"9px", letterSpacing:".12em", textTransform:"uppercase",
                fontVariationSettings:"'wdth' 75,'wght' 500",
                fontFamily: FONT,
                color:"rgba(28,19,4,.48)",
              }}>
                Active
              </span>
            </div>
          </div>

          {/* Name + animated gold underline */}
          <div style={{ marginBottom:"8px" }}>
            <h3 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontFamily: FONT,
              fontSize:"14px", lineHeight:1.25,
              letterSpacing:"-0.01em", color:"#442a1b",
              marginBottom:"4px",
            }}>
              {center.name}
            </h3>
            <motion.div
              animate={{ scaleX: hovered || expanded ? 1 : 0.2 }}
              transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
              style={{
                height:"1px",
                background:"linear-gradient(90deg,#A67B2F,#E4C079,transparent)",
                transformOrigin:"left center",
              }}
            />
          </div>

          <p style={{
            fontSize:"11px", lineHeight:1.55,
            color:"rgba(28,19,4,.50)",
            fontVariationSettings:"'wdth' 100,'wght' 300",
            fontFamily: FONT,
            marginBottom:"10px",
          }}>
            {center.address}
          </p>

          {/* Stats strip — neumorphic inset */}
          <div style={{
            display:"flex", gap:"10px", flexWrap:"wrap",
            padding:"7px 10px",
            background:"#f7f0e2",
            boxShadow:"inset 3px 3px 6px rgba(183,163,146,.26),inset -3px -3px 6px rgba(255,255,255,.80)",
            borderRadius:"8px",
            marginBottom:"12px",
          }}>
            <span style={{ fontSize:"10px", color:"rgba(28,19,4,.45)", fontVariationSettings:"'wdth' 75,'wght' 400", fontFamily:FONT }}>
              📍 {center.pincode}
            </span>
            <span style={{ fontSize:"10px", color:"rgba(28,19,4,.45)", fontVariationSettings:"'wdth' 75,'wght' 400", fontFamily:FONT }}>
              👤 {center.trainers} Trainers
            </span>
            <span style={{ fontSize:"10px", color:"rgba(28,19,4,.45)", fontVariationSettings:"'wdth' 75,'wght' 400", fontFamily:FONT }}>
              📐 {center.sqft.toLocaleString()} sq ft
            </span>
          </div>

          {/* CTA */}
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.a
                key="expanded-cta"
                href={gmapsLink(center)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity:0, y:6 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }}
                whileHover={{
                  scale:1.03,
                  boxShadow:"8px 8px 16px rgba(166,123,47,.32),-2px -2px 6px rgba(228,192,121,.22)",
                }}
                whileTap={{ scale:0.96 }}
                transition={{ type:"spring", stiffness:380, damping:22 }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
                  background:"linear-gradient(145deg,#cd872a,#A67B2F)",
                  color:"#442a1b",
                  fontVariationSettings:"'wdth' 85,'wght' 700",
                  fontFamily:FONT,
                  fontSize:"10px", letterSpacing:".14em", textTransform:"uppercase",
                  padding:"11px 18px", borderRadius:"8px",
                  textDecoration:"none",
                  boxShadow:"6px 6px 12px rgba(166,123,47,.30),-2px -2px 6px rgba(228,192,121,.18)",
                  width:"100%",
                }}
              >
                <img src="/icons/map-compass.svg" alt="" role="presentation" width={20} height={20} style={{ display:"inline", verticalAlign:"middle", marginRight:6 }} />Open in Google Maps →
              </motion.a>
            ) : (
              <motion.div
                key="collapsed-cta"
                initial={{ opacity:1 }}
                exit={{ opacity:0 }}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}
              >
                <a
                  href={gmapsLink(center)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize:"10px", letterSpacing:".14em", textTransform:"uppercase",
                    color: hovered || highlight ? "#cd872a" : "rgba(28,19,4,.40)",
                    fontVariationSettings:"'wdth' 75,'wght' 600",
                    fontFamily:FONT,
                    textDecoration:"none", transition:"color .2s",
                  }}
                >
                  <img src="/icons/map-compass.svg" alt="" role="presentation" width={20} height={20} style={{ display:"inline", verticalAlign:"middle", marginRight:6 }} />Get Directions →
                </a>
                <span style={{
                  fontSize:"9px", letterSpacing:".09em", textTransform:"uppercase",
                  color:"rgba(28,19,4,.24)",
                  fontVariationSettings:"'wdth' 75,'wght' 400",
                  fontFamily:FONT,
                }}>
                  click to expand
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PINCODE SEARCH ───────────────────────────────────────────────────────────

function PincodeSearch({ onLocate }: { onLocate?: (c: { lat: number; lng: number }) => void }) {
  const [pincode, setPincode] = useState("");
  const [results, setResults] = useState<(WTFCenter & { distance: number })[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    setError(null);
    const coords = pincodeToCoords(pincode.trim());
    if (!coords) {
      if (pincode.length === 6) {
        setError("This pincode is outside our current NCR service area. We ship pan-India — order online.");
      } else {
        setError("Please enter a valid 6-digit pincode.");
      }
      setResults(null);
      return;
    }
    onLocate?.(coords);
    const sorted = [...WTF_CENTERS]
      .map((c) => ({ ...c, distance: haversine(coords.lat, coords.lng, c.lat, c.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    setResults(sorted);
  };

  return (
    <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ display:"flex", gap:"8px", alignItems:"stretch" }}>
        <div style={{
          flex: 1, display:"flex", alignItems:"center",
          background: "#fff",
          border: focused ? "1.5px solid #cd872a" : "1.5px solid rgba(183,163,146,0.55)",
          borderRadius: "4px", overflow:"hidden",
          transition:"border-color 0.2s ease",
          boxShadow: focused ? "0 0 0 3px rgba(205,135,42,0.12)" : "none",
        }}>
          <span style={{ padding:"0 14px", fontSize:"16px", opacity:0.5 }}>📍</span>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter your pincode"
            maxLength={6}
            style={{
              flex:1, border:"none", outline:"none", padding:"14px 0",
              fontSize:"16px", color:"#442a1b", background:"transparent",
              fontVariationSettings:"'wdth' 100, 'wght' 400",
              fontFamily:"var(--font-primary), system-ui, sans-serif",
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={pincode.length < 6}
          style={{
            padding:"14px 24px",
            background: pincode.length === 6
              ? "linear-gradient(135deg, #A67B2F 0%, #E4C079 50%, #cd872a 100%)"
              : "rgba(183,163,146,0.30)",
            color: pincode.length === 6 ? "#442a1b" : "#b7a392",
            border:"none", borderRadius:"4px", cursor: pincode.length === 6 ? "pointer" : "default",
            fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase",
            fontVariationSettings:"'wdth' 75,'wght' 700",
            fontFamily:"var(--font-primary), system-ui, sans-serif",
            transition:"all 0.25s ease", whiteSpace:"nowrap",
          }}
        >
          Find Nearest →
        </button>
      </div>

      <p style={{
        fontSize:"11px", color:"rgba(28,19,4,0.38)", marginTop:"8px",
        fontVariationSettings:"'wdth' 75,'wght' 400",
        fontFamily:"var(--font-primary), system-ui, sans-serif",
        textAlign:"center",
      }}>
        Serving Delhi · Noida · Gurugram · Ghaziabad · Faridabad · Greater Noida
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{
              marginTop:"16px", padding:"14px 18px", background:"rgba(183,163,146,0.15)",
              border:"1px solid rgba(183,163,146,0.40)", borderRadius:"4px",
              fontSize:"13px", color:"rgba(28,19,4,0.65)",
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontFamily:"var(--font-primary), system-ui, sans-serif",
            }}
          >
            {error}{" "}
            {error.includes("pan-India") && (
              <Link href="/products" style={{ color:"#cd872a", textDecoration:"none", fontVariationSettings:"'wdth' 75,'wght' 600" }}>
                Shop Online →
              </Link>
            )}
          </motion.div>
        )}
        {results && (
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ marginTop:"24px" }}
          >
            <p style={{
              fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase",
              color:"#cd872a", marginBottom:"12px",
              fontVariationSettings:"'wdth' 75,'wght' 600",
              fontFamily:"var(--font-primary), system-ui, sans-serif",
            }}>
              Nearest Experience Centers to {pincode}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {results.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background:"#fff", border:"1.5px solid rgba(205,135,42,0.40)",
                    borderRadius:"4px", padding:"16px 20px",
                    display:"flex", gap:"16px", alignItems:"flex-start",
                    boxShadow:"0 4px 16px rgba(205,135,42,0.10)",
                  }}
                >
                  <div style={{
                    width:"40px", height:"40px", borderRadius:"50%", flexShrink:0,
                    background: i===0 ? "linear-gradient(135deg,#A67B2F,#E4C079)" : "rgba(205,135,42,0.12)",
                    border:"1px solid rgba(205,135,42,0.40)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"11px", fontVariationSettings:"'wdth' 75,'wght' 700",
                    color: i===0 ? "#442a1b" : "#cd872a",
                    fontFamily:"var(--font-primary), system-ui, sans-serif",
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"4px" }}>
                      <p style={{
                        fontSize:"14px", fontVariationSettings:"'wdth' 85,'wght' 700",
                        color:"#442a1b", fontFamily:"var(--font-primary), system-ui, sans-serif",
                        lineHeight:1.25,
                      }}>
                        {c.name}
                      </p>
                      <span style={{
                        fontSize:"10px", color:"#cd872a", whiteSpace:"nowrap",
                        fontVariationSettings:"'wdth' 75,'wght' 600",
                        fontFamily:"var(--font-primary), system-ui, sans-serif",
                      }}>
                        ~{c.distance.toFixed(1)} km
                      </span>
                    </div>
                    <p style={{
                      fontSize:"11px", color:"rgba(28,19,4,0.50)", lineHeight:1.5,
                      fontVariationSettings:"'wdth' 100,'wght' 300",
                      fontFamily:"var(--font-primary), system-ui, sans-serif",
                      marginBottom:"8px",
                    }}>
                      {c.address}
                    </p>
                    <a
                      href={gmapsLink(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase",
                        color:"#cd872a", fontVariationSettings:"'wdth' 75,'wght' 600",
                        textDecoration:"none", fontFamily:"var(--font-primary), system-ui, sans-serif",
                      }}
                    >
                      <img src="/icons/map-compass.svg" alt="" role="presentation" width={20} height={20} style={{ display:"inline", verticalAlign:"middle", marginRight:6 }} />Open in Google Maps →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

import PosterSlideshow from "@/components/ui/PosterSlideshow";

export default function FindUsClient() {
  const [activeCity, setActiveCity] = useState<(typeof CITY_TABS)[number]>("All");
  const [searchFocus, setSearchFocus] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = activeCity === "All"
    ? WTF_CENTERS
    : WTF_CENTERS.filter((c) => c.city === activeCity);

  const cityCounts = CITY_TABS.slice(1).reduce<Record<string, number>>((acc, city) => {
    acc[city] = WTF_CENTERS.filter((c) => c.city === city).length;
    return acc;
  }, {});

  const statsRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ fontFamily:"var(--font-primary), system-ui, sans-serif", color:"#442a1b", background:"#f7f0e2" }}>
      <PosterSlideshow posters={[{ src: "/posters/find-us/1.jpg", alt: "Find Us — WTF Gym Experience Centers" }, { src: "/posters/find-us/2.jpg" }]} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        position:"relative", overflow:"hidden",
        background:"#1a1208",
        padding:"clamp(96px,13vh,140px) 24px clamp(72px,9vh,90px)", textAlign:"center",
      }}>
        <BgVideo src="/videos/find-us-hero.mp4" />
        {/* 3D animated map field background */}
        <MapField3D />
        {/* Legibility gradient over the 3D field */}
        <div aria-hidden style={{position:"absolute",inset:0,zIndex:1,background:"radial-gradient(ellipse at center, rgba(26,18,8,0.30) 0%, rgba(26,18,8,0.74) 68%, rgba(26,18,8,0.92) 100%)",pointerEvents:"none"}}/>
        <AyurvedicBg />

        <div style={{ position:"relative", zIndex:2 }}>
          <motion.p
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6 }}
            style={{
              fontSize:"10px", letterSpacing:"0.32em", textTransform:"uppercase",
              color:"#cd872a", fontVariationSettings:"'wdth' 75,'wght' 500", marginBottom:"16px",
            }}
          >
            WTF Gym Experience Centers
          </motion.p>

          <motion.h1
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.1 }}
            style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontSize:"clamp(36px, 6vw, 76px)", lineHeight:1.03,
              letterSpacing:"-0.025em", color:"#f7f0e2",
              marginBottom:"20px",
            }}
          >
            <img src="/icons/map-pin.svg" alt="" role="presentation" width={24} height={24} style={{ display:"inline", verticalAlign:"middle", marginRight:8 }} />
            Experience 3Tattava
            <br />
            <span style={{ background:"linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Offline
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.2 }}
            style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontSize:"clamp(15px, 2vw, 18px)", color:"rgba(247,240,226,0.72)",
              maxWidth:"560px", margin:"0 auto 12px", lineHeight:1.65,
            }}
          >
            Find A 3Tattava Experience Center Near You — visit a participating WTF Fitness Center to experience products, learn about Performance Ayurveda™, attend activations, and connect with experts.
          </motion.p>

          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.35 }}
            style={{
              fontSize:"11px", color:"rgba(247,240,226,0.45)", letterSpacing:"0.08em",
              marginBottom:"40px",
            }}
          >
            28 centers · 136 certified trainers · Delhi NCR
          </motion.p>

          {/* Gold divider */}
          <div style={{
            width:"48px", height:"1px", margin:"0 auto 40px",
            background:"linear-gradient(90deg, transparent, #cd872a, transparent)",
          }}/>

          {/* PINCODE SEARCH */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3, duration:0.6 }}
          >
            <PincodeSearch onLocate={setSearchFocus} />
          </motion.div>
        </div>
      </section>

      {/* ── STATS COUNTER ────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        style={{
          background:"linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
          padding:"56px 24px",
        }}
      >
        <div style={{ maxWidth:"1000px", margin:"0 auto", textAlign:"center", marginBottom:"24px" }}>
          <p style={{
            fontSize:"11px", letterSpacing:"0.25em", textTransform:"uppercase",
            color:"rgba(28,19,4,0.70)", fontVariationSettings:"'wdth' 75,'wght' 600",
            marginBottom:"8px",
          }}>
            Building India&apos;s Performance Ayurveda Network
          </p>
        </div>
        <div style={{
          maxWidth:"900px", margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
          gap:"32px",
        }}>
          {[
            { value: 28,    suffix: "+", label: "Experience Centers" },
            { value: 136,   suffix: "+", label: "Certified Trainers" },
            { value: 116900, suffix: "sq ft", label: "Training Space" },
            { value: 5,     suffix: " Cities", label: "NCR Coverage" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign:"center" }}>
              <p style={{
                fontVariationSettings:"'wdth' 85,'wght' 800",
                fontSize:"clamp(28px,4vw,48px)", color:"#442a1b",
                lineHeight:1.1, marginBottom:"6px",
              }}>
                <AnimatedCount target={stat.value} suffix={stat.suffix}/>
              </p>
              <p style={{
                fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase",
                color:"rgba(28,19,4,0.65)", fontVariationSettings:"'wdth' 75,'wght' 500",
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p style={{
          textAlign:"center", marginTop:"28px",
          fontSize:"11px", color:"rgba(28,19,4,0.50)",
          fontVariationSettings:"'wdth' 75,'wght' 400",
          letterSpacing:"0.06em",
        }}>
          1 Founding Athlete · 1 Doctor-Led Brand · Thousands Of Future Transformations
        </p>
      </section>

      {/* ── ALL 28 LOCATIONS ──────────────────────────────────────────────────── */}
      <section style={{ background:"#f7f0e2", padding:"72px 24px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ marginBottom:"40px" }}>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontSize:"clamp(22px,3vw,32px)", letterSpacing:"-0.015em",
              marginBottom:"8px",
            }}>
              <img src="/icons/map-pin.svg" alt="" role="presentation" width={24} height={24} style={{ display:"inline", verticalAlign:"middle", marginRight:8 }} />All Experience Centers
            </h2>
            <p style={{
              fontVariationSettings:"'wdth' 100,'wght' 300",
              fontSize:"15px", color:"rgba(28,19,4,0.55)", marginBottom:"28px",
            }}>
              Click any center to get directions on Google Maps.
            </p>

            {/* City filter tabs */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {CITY_TABS.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  style={{
                    padding:"6px 16px", borderRadius:"32px",
                    border: activeCity===city ? "1.5px solid #cd872a" : "1px solid rgba(183,163,146,0.55)",
                    background: activeCity===city ? "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)" : "#fff",
                    color: activeCity===city ? "#442a1b" : "rgba(28,19,4,0.55)",
                    fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase",
                    fontVariationSettings:`'wdth' 75,'wght' ${activeCity===city?"700":"500"}`,
                    fontFamily:"var(--font-primary), system-ui, sans-serif",
                    cursor:"pointer", transition:"all 0.2s ease",
                  }}
                >
                  {city}{city!=="All" && ` (${cityCounts[city]})`}
                </button>
              ))}
            </div>
          </div>
          {MAPS_ON && (
            <div style={{ height: "clamp(360px,52vh,520px)", borderRadius: "6px", overflow: "hidden", marginBottom: "24px", border: "1px solid rgba(183,163,146,0.35)" }}>
              <GoogleWTFMap variant="findus" centers={filtered} focus={searchFocus} />
            </div>
          )}

          <motion.div
            key={activeCity}
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ duration:0.3 }}
            style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
              gap:"16px",
            }}
          >
            {filtered.map((center, idx) => (
              <LocationCard key={center.id} center={center} idx={idx}/>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY VISIT ─────────────────────────────────────────────────────────── */}
      <section style={{ background:"#fff", padding:"72px 24px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <p style={{
              fontSize:"10px", letterSpacing:"0.3em", textTransform:"uppercase",
              color:"#cd872a", fontVariationSettings:"'wdth' 75,'wght' 500", marginBottom:"12px",
            }}>
              Why Visit In Person
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontSize:"clamp(22px,3vw,30px)", letterSpacing:"-0.01em",
            }}>
              Shilajit Is A Ritual. Some Things Are Better Learned In Person.
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:"20px" }}>
            {[
              { icon:"🧪", title:"Try Before You Buy",   desc:"WTF staff demonstrate the Dip · Hook · Swirl ritual and let you experience the texture and quality of RockResin in person." },
              { icon:"📋", title:"Lab Reports On Display", desc:"Full NABL COA available at every Experience Center. Scan the QR code on the jar — same NABL batch report, independently verified." },
              { icon:"👤", title:"Expert Guidance",        desc:"WTF coaches trained in Performance Ayurveda™ protocol guide you on dosage, timing, and Anupana (carrier) selection." },
              { icon:"📦", title:"Same-Day Availability",  desc:"All 28 centers carry RockResin and Shahjeet Sticks in stock. No delivery wait for your first ritual." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.08, duration:0.45 }}
                whileHover={{ y:-4, boxShadow:"0 12px 32px rgba(205,135,42,0.12)" }}
                style={{
                  background:"#f7f0e2", border:"1px solid rgba(183,163,146,0.30)",
                  borderRadius:"4px", padding:"28px", transition:"border-color 0.2s ease",
                }}
              >
                <div style={{ fontSize:"28px", marginBottom:"12px" }}>{item.icon}</div>
                <h3 style={{ fontVariationSettings:"'wdth' 85,'wght' 700", fontSize:"16px", marginBottom:"8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontVariationSettings:"'wdth' 100,'wght' 300", fontSize:"13px", lineHeight:1.65, color:"rgba(28,19,4,0.60)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WTF PARTNERSHIP ───────────────────────────────────────────────────── */}
      <section style={{ background:"#f7f0e2", padding:"72px 24px", borderTop:"1px solid rgba(183,163,146,0.25)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", display:"flex", gap:"48px", alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 300px" }}>
            <p style={{
              fontSize:"10px", letterSpacing:"0.25em", textTransform:"uppercase",
              color:"#cd872a", fontVariationSettings:"'wdth' 75,'wght' 500", marginBottom:"12px",
            }}>
              Our Ecosystem Partner
            </p>
            <h2 style={{
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontSize:"clamp(20px,2.5vw,28px)", letterSpacing:"-0.01em",
              marginBottom:"16px", lineHeight:1.2,
            }}>
              Why WTF Gyms?
            </h2>
            <p style={{ fontVariationSettings:"'wdth' 100,'wght' 300", fontSize:"14px", lineHeight:1.75, color:"rgba(28,19,4,0.65)", marginBottom:"14px" }}>
              WTF Gym is where our users train. We didn&apos;t want to be on a pharmacy shelf next to mass-market supplements. We wanted to be in the gyms where serious athletes actually train — where the staff understands performance, and where the context of why you&apos;re taking Shilajit is already understood.
            </p>
            <p style={{ fontVariationSettings:"'wdth' 100,'wght' 300", fontSize:"14px", lineHeight:1.75, color:"rgba(28,19,4,0.65)" }}>
              That&apos;s the WTF × 3TATTAVA partnership. Performance meets Ayurveda. In person.
            </p>
          </div>

          <div style={{
            flex:"0 0 auto", minWidth:"200px",
            background:"linear-gradient(135deg, #442a1b 0%, #2a1d08 100%)",
            padding:"36px 32px", borderRadius:"4px", textAlign:"center",
            border:"1px solid rgba(205,135,42,0.20)",
          }}>
            <p style={{
              fontVariationSettings:"'wdth' 85,'wght' 800",
              fontSize:"56px", color:"#cd872a", lineHeight:1, marginBottom:"6px",
            }}>28</p>
            <p style={{ fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(247,240,226,0.55)" }}>
              Experience Centers
            </p>
            <div style={{ margin:"20px 0", height:"1px", background:"rgba(205,135,42,0.20)" }}/>
            <p style={{ fontVariationSettings:"'wdth' 85,'wght' 700", fontSize:"22px", color:"#E4C079", marginBottom:"4px" }}>136+</p>
            <p style={{ fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(247,240,226,0.40)" }}>
              Certified Trainers
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section style={{
        background:"linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
        padding:"64px 24px", textAlign:"center",
      }}>
        <h2 style={{
          fontVariationSettings:"'wdth' 85,'wght' 700",
          fontSize:"clamp(20px,2.5vw,30px)", color:"#442a1b",
          letterSpacing:"-0.01em", marginBottom:"12px",
        }}>
          Can&apos;t Find Your Area?
        </h2>
        <p style={{
          fontVariationSettings:"'wdth' 100,'wght' 300",
          fontSize:"15px", color:"rgba(28,19,4,0.70)", marginBottom:"32px", lineHeight:1.6,
        }}>
          We ship pan-India in 3–5 days. Same NABL-certified batch. Delivered to your door.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link
            href="/products"
            style={{
              display:"inline-block",
              background:"#442a1b", color:"#f7f0e2",
              fontVariationSettings:"'wdth' 85,'wght' 700",
              fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase",
              padding:"14px 32px", textDecoration:"none",
            }}
          >
            Shop Online →
          </Link>
          <Link
            href="/community"
            style={{
              display:"inline-block",
              background:"transparent", color:"#442a1b",
              border:"1.5px solid rgba(28,19,4,0.40)",
              fontVariationSettings:"'wdth' 85,'wght' 600",
              fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase",
              padding:"14px 32px", textDecoration:"none",
            }}
          >
            Explore Community Events
          </Link>
        </div>
      </section>
    </div>
  );
}
