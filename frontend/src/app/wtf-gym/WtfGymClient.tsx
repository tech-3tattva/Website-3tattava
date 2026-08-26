'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans } from "next/font/google";

/* ─── Assets ─── */
const CDN = 'https://media.3tattava.com';
/* 1800px WebP (~134 KB). The original 6X3 LAUNCH POSTER.png is a 7200x14400
   print file weighing ~50 MB — it was being downloaded in full by every QR
   visitor on mobile data before this. */
const HERO_POSTER = `${CDN}/banners/Landing_Page/wtf-launch-poster-1800.webp`;
const HERO_VIDEO = `${CDN}/banners/Landing_Page/3tattava-x-WTF.mp4`;
const ROCKRESIN_IMG = '/wtf/rockresin.webp';
const SHAHJEET_IMG = '/wtf/shahjeet.webp';
const HERO_BG = '/wtf/hero-bg.webp';
const RITUAL_BANNER = '/wtf/ritual-banner.webp';
const DR_KASHISH = '/wtf/dr-kashish.webp';

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-jakarta" });
const F = "var(--font-jakarta), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

/* Dark + Cream alternating palette */
const DARK = '#0c0c0c';
const CARD_DARK = '#1a1a1a';
const CREAM = '#f7f0e2';
const CREAM_DEEP = '#efe4cf';
const BORDER_D = 'rgba(255,255,255,0.08)';
const BORDER_L = 'rgba(200,150,62,0.18)';
const GOLD = '#C8963E';
const INK = '#442a1b';
const ESPRESSO = '#1c1304';
const MUTED_D = 'rgba(255,255,255,0.5)';
const DIM_D = 'rgba(255,255,255,0.35)';
const MUTED_L = 'rgba(68,42,27,0.6)';

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 22 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.65, delay: d, ease: EASE },
});

/* ─── Full-width cinematic hero with poster → video ─── */
function HeroBanner() {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'poster' | 'video'>('poster');
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.load();
    const t = setTimeout(() => {
      setPhase('video');
      v.currentTime = 0;
      v.muted = false;
      setMuted(false);
      v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => {}); });
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="wg-banner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt="3Tattava × WTF Launch" className="wg-banner-media"
        style={{ opacity: phase === 'poster' ? 1 : 0, transform: phase === 'poster' ? 'scale(1)' : 'scale(1.05)', transition: 'opacity .9s ease, transform .9s ease' }} />
      <video ref={vidRef} className="wg-banner-media" loop playsInline preload="auto" muted
        style={{ opacity: phase === 'video' ? 1 : 0, transition: 'opacity .9s ease' }}>
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="wg-banner-gradient" />
      {phase === 'video' && (
        <button className="wg-sound" onClick={() => { const v = vidRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
          aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🔊'}</button>
      )}
    </div>
  );
}

/* ─── Check + Arrow SVGs ─── */
const Check = () => <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="m5 12.5 4.2 4L19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ─── FAQ ─── */
const FAQS = [
  { q: 'What exactly is Shilajit?', a: 'Shilajit is a naturally occurring, mineral-rich substance found in Himalayan rock formations. 3Tattava uses Himalayan Ladakhi Shilajit that is classically purified before formulation.' },
  { q: 'Which product should I start with?', a: 'Choose RockResin if you want the traditional resin ritual. Choose Shahjeet Sticks if portability and a honey-based format will help you stay consistent.' },
  { q: 'How do I use it?', a: 'Use only as directed on the product label. RockResin is measured with the included dipper and mixed into warm water or milk. Shahjeet is a tear-and-squeeze stick taken directly or mixed into a beverage.' },
  { q: 'Can I verify the quality?', a: 'Yes. Products are third-party tested, and batch-level reports can be accessed through the QR code on the pack or the 3Tattava lab reports page.' },
  { q: 'Is this for men only?', a: 'No. These products are for adult men and women. Consult a physician if pregnant, breastfeeding, or on medication.' },
];
function FaqItem({ faq, idx }: { faq: typeof FAQS[0]; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wg-faq-item">
      <div className="wg-faq-q" onClick={() => setOpen(!open)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') setOpen(!open); }}>
        <span>0{idx + 1}</span><span>{faq.q}</span><span style={{ marginLeft: 'auto', fontSize: 18, color: GOLD }}>{open ? '−' : '+'}</span>
      </div>
      {open && <p className="wg-faq-a">{faq.a}</p>}
    </div>
  );
}

/* ─── CSS ─── */
const CSS = `
*{box-sizing:border-box;}
.wg{font-family:${F};min-height:100vh;overflow-x:hidden;}
.wg a{text-decoration:none;}
.wg a:not(.wg-btn){color:inherit;}

/* Top bar */
.wg-topbar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;padding:14px clamp(16px,4vw,32px);background:rgba(12,12,12,0.85);backdrop-filter:blur(14px);border-bottom:1px solid ${BORDER_D};}
.wg-topbar img{height:28px;width:auto;}
.wg-topbar-x{color:${DIM_D};font-size:18px;margin:0 10px;font-weight:300;}
.wg-topbar-wtf{font-weight:800;font-size:16px;color:#fff;letter-spacing:.04em;}

/* Hero */
.wg-hero{position:relative;background:linear-gradient(rgba(12,12,12,0.45),rgba(12,12,12,0.68)),url(${HERO_BG}) center/cover no-repeat,${DARK};color:#fff;text-align:center;padding:clamp(90px,12vh,130px) 24px 0;}
.wg-hero-eyebrow{font-size:clamp(10px,1.3vw,12px);font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:${GOLD};margin-bottom:16px;}
.wg-hero-h1{font-variation-settings:'wght' 800;font-size:clamp(30px,6.5vw,60px);line-height:1.06;letter-spacing:-.02em;margin:0 0 14px;}
.wg-hero-h1 em{font-style:italic;color:${GOLD};}
.wg-hero-sub{font-size:clamp(14px,1.8vw,17px);line-height:1.6;color:${MUTED_D};max-width:520px;margin:0 auto 26px;font-weight:300;}
.wg-hero-ctas{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;}
.wg-trust-strip{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-bottom:32px;}
.wg-trust-item{font-size:11px;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,0.55);display:flex;align-items:center;gap:5px;}
.wg-trust-item svg{color:${GOLD};}

/* Cinematic banner */
.wg-banner{position:relative;width:100%;max-width:900px;margin:0 auto;aspect-ratio:16/9;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5);}
.wg-banner-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.wg-banner-gradient{position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,12,0.6) 0%,transparent 40%);pointer-events:none;}
.wg-sound{position:absolute;bottom:14px;right:14px;z-index:3;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.3);background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;-webkit-tap-highlight-color:transparent;}

/* Stats row */
.wg-stats{display:flex;gap:clamp(28px,5vw,56px);justify-content:center;padding:clamp(28px,4vw,44px) 24px clamp(40px,6vw,72px);}
.wg-stat-val{font-variation-settings:'wght' 800;font-size:clamp(30px,5.5vw,46px);color:#fff;line-height:1;}
.wg-stat-label{font-size:11px;color:${DIM_D};letter-spacing:.06em;margin-top:4px;}

/* Buttons */
.wg-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border:none;cursor:pointer;transition:all .25s ease;font-family:${F};}
.wg-btn-gold{background:${GOLD};color:${ESPRESSO};}
.wg-btn-gold:hover{background:#d9a84e;transform:translateY(-2px);}
.wg-btn-ghost-d{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;}
.wg-btn-ghost-d:hover{border-color:rgba(255,255,255,0.5);}
.wg-btn-ghost-l{background:transparent;border:1px solid ${BORDER_L};color:${INK};}
.wg-btn-ghost-l:hover{border-color:${GOLD};}
.wg-btn-espresso{background:${ESPRESSO};color:${CREAM};}

/* Section shared */
.wg-sec{padding:clamp(56px,9vw,100px) 24px;max-width:900px;margin:0 auto;}
.wg-sec-wide{max-width:1100px;}
.wg-eyebrow-d{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:${GOLD};margin-bottom:14px;}
.wg-eyebrow-l{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:${GOLD};margin-bottom:14px;}
.wg-h2-d{font-variation-settings:'wght' 800;font-size:clamp(24px,4.5vw,40px);line-height:1.1;letter-spacing:-.01em;color:#fff;margin:0 0 16px;}
.wg-h2-l{font-variation-settings:'wght' 800;font-size:clamp(24px,4.5vw,40px);line-height:1.1;letter-spacing:-.01em;color:${INK};margin:0 0 16px;}
.wg-h2-d em,.wg-h2-l em{font-style:italic;color:${GOLD};}
.wg-body-d{font-size:clamp(14px,1.6vw,16px);line-height:1.7;color:${MUTED_D};font-weight:300;}
.wg-body-l{font-size:clamp(14px,1.6vw,16px);line-height:1.7;color:${MUTED_L};font-weight:300;}

/* Trainer — cream section */
.wg-trainer-sec{background:${CREAM};padding:clamp(56px,9vw,100px) 24px;}
.wg-trainer{background:#fff;border:1px solid ${BORDER_L};border-radius:20px;padding:clamp(28px,4vw,44px);text-align:center;max-width:520px;margin:0 auto;box-shadow:0 12px 36px rgba(68,42,27,0.06);}
.wg-trainer input{width:100%;background:rgba(68,42,27,0.03);border:1px solid ${BORDER_L};color:${INK};font-family:${F};font-size:14px;padding:14px 16px;border-radius:8px;outline:none;margin:16px 0 12px;text-align:center;letter-spacing:.08em;}
.wg-trainer input:focus{border-color:${GOLD};}
.wg-trainer input::placeholder{color:rgba(68,42,27,0.3);}

/* Products — dark */
.wg-products-sec{background:linear-gradient(rgba(12,12,12,0.66),rgba(12,12,12,0.78)),url(${HERO_BG}) center/cover no-repeat,${DARK};padding:clamp(56px,9vw,100px) 24px;}
.wg-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:20px;max-width:900px;margin:28px auto 0;}
.wg-pcard{background:${CARD_DARK};border:1px solid ${BORDER_D};border-radius:20px;overflow:hidden;display:flex;flex-direction:column;}
.wg-pcard-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${GOLD};background:rgba(200,150,62,0.1);border:1px solid rgba(200,150,62,0.2);padding:5px 12px;border-radius:999px;margin-bottom:12px;}
.wg-pcard-img{width:100%;aspect-ratio:1/1;background:${DARK};overflow:hidden;}
.wg-pcard-img img{width:100%;height:100%;object-fit:cover;display:block;}
.wg-pcard-body{padding:24px;flex:1;display:flex;flex-direction:column;}
.wg-pcard-tag{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};margin-bottom:6px;}
.wg-pcard-name{font-variation-settings:'wght' 800;font-size:22px;color:#fff;margin:0 0 4px;}
.wg-pcard-sub{font-size:13px;color:${DIM_D};margin:0 0 12px;}
.wg-pcard-desc{font-size:14px;color:${MUTED_D};line-height:1.6;margin:0 0 14px;flex:1;}
.wg-pcard-ritual{font-size:12px;letter-spacing:.08em;color:${DIM_D};margin:0 0 18px;}
.wg-pcard-price{display:flex;align-items:baseline;gap:10px;margin-bottom:4px;}
.wg-pcard-price strong{font-variation-settings:'wght' 800;font-size:24px;color:#fff;}
.wg-pcard-price s{font-size:14px;color:${DIM_D};}
.wg-pcard-price-label{font-size:10px;color:${DIM_D};margin-bottom:16px;}

/* Proof — cream */
.wg-proof-sec{background:${CREAM};padding:clamp(56px,9vw,100px) 24px;text-align:center;}
.wg-proof{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:16px;max-width:900px;margin:28px auto 0;}
.wg-proof-card{background:#fff;border:1px solid ${BORDER_L};border-radius:16px;padding:24px;text-align:left;box-shadow:0 6px 20px rgba(68,42,27,0.05);}
.wg-proof-num{font-size:11px;color:${MUTED_L};letter-spacing:.1em;margin-bottom:10px;}
.wg-proof-icon{font-size:20px;color:${GOLD};margin-bottom:8px;}
.wg-proof-title{font-variation-settings:'wght' 700;font-size:16px;color:${INK};margin:0 0 8px;}
.wg-proof-desc{font-size:13px;color:${MUTED_L};line-height:1.55;}

/* Ritual — dark */
.wg-ritual-sec{background:linear-gradient(90deg,rgba(12,12,12,0.08) 0%,rgba(12,12,12,0.42) 34%,rgba(12,12,12,0.9) 56%,rgba(12,12,12,0.96) 100%),url(${RITUAL_BANNER}) 25% center/cover no-repeat,${DARK};padding:clamp(64px,10vw,120px) 24px;color:#fff;min-height:clamp(380px,42vw,560px);display:flex;align-items:center;}
.wg-ritual-inner{max-width:1100px;margin:0 auto;width:100%;}
.wg-ritual-content{width:min(560px,54%);margin-left:auto;}
.wg-steps{margin-top:24px;}
.wg-step{display:flex;gap:16px;padding:16px 0;border-top:1px solid ${BORDER_D};}
.wg-step-num{font-variation-settings:'wght' 800;font-size:14px;color:${GOLD};flex-shrink:0;width:28px;}
.wg-step-text{font-size:14px;color:${MUTED_D};line-height:1.5;}
.wg-step-text strong{color:#fff;font-weight:700;}

/* Quote — cream */
.wg-quote-sec{background:${CREAM_DEEP};padding:clamp(48px,7vw,80px) 24px 0;}
.wg-quote{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:0.72fr 1.28fr;gap:clamp(24px,4vw,52px);align-items:stretch;}
.wg-quote-photo{align-self:end;}
.wg-quote-photo img{width:100%;height:auto;display:block;filter:drop-shadow(0 24px 44px rgba(68,42,27,0.22));}
.wg-quote-content{align-self:center;text-align:left;}
.wg-quote blockquote{font-size:clamp(18px,2.4vw,24px);font-style:italic;color:${INK};line-height:1.5;margin:0 0 20px;border:none;padding:0;}
.wg-quote blockquote em{color:${GOLD};}
.wg-quote-author{display:flex;align-items:center;gap:14px;justify-content:flex-start;}
.wg-quote-avatar{width:48px;height:48px;border-radius:50%;background:${GOLD};display:flex;align-items:center;justify-content:center;font-variation-settings:'wght' 800;font-size:16px;color:#fff;}
.wg-quote-name{font-variation-settings:'wght' 700;font-size:14px;color:${INK};}
.wg-quote-role{font-size:12px;color:${MUTED_L};}

/* FAQ — dark */
.wg-faq-sec{background:linear-gradient(rgba(12,12,12,0.66),rgba(12,12,12,0.78)),url(${HERO_BG}) center/cover no-repeat,${DARK};padding:clamp(56px,9vw,100px) 24px;color:#fff;}
.wg-faq{max-width:700px;margin:24px auto 0;}
.wg-faq-item{border-top:1px solid ${BORDER_D};padding:18px 0;}
.wg-faq-q{font-variation-settings:'wght' 700;font-size:15px;color:#fff;cursor:pointer;display:flex;gap:12px;align-items:center;}
.wg-faq-q span:first-child{color:${GOLD};font-size:13px;flex-shrink:0;width:22px;}
.wg-faq-a{font-size:14px;color:${MUTED_D};line-height:1.65;padding:12px 0 0 34px;}

/* Final CTA — cream */
.wg-final{background:${CREAM};text-align:center;padding:clamp(64px,10vw,120px) 24px;}

/* Footer — dark */
.wg-foot{background:${DARK};padding:32px 24px;text-align:center;border-top:1px solid ${BORDER_D};color:#fff;}
.wg-foot-logos{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:20px;}
.wg-foot-logos img{height:30px;width:auto;}
.wg-foot-links{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-bottom:20px;}
.wg-foot-links a{font-size:12px;color:${DIM_D};transition:color .2s;}
.wg-foot-links a:hover{color:${GOLD};}
.wg-foot-legal{font-size:11px;color:rgba(255,255,255,0.2);max-width:600px;margin:0 auto 12px;line-height:1.6;}
.wg-foot-copy{font-size:11px;color:rgba(255,255,255,0.15);}

/* Sticky */
.wg-sticky{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(12,12,12,0.92);backdrop-filter:blur(12px);border-top:1px solid ${BORDER_D};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;}
.wg-sticky-text{font-size:12px;color:${DIM_D};}
.wg-sticky-text strong{color:#fff;}

@media(max-width:640px){.wg-products{grid-template-columns:1fr;}.wg-proof{grid-template-columns:1fr 1fr;}.wg-quote-sec{padding-bottom:clamp(36px,9vw,56px);}.wg-quote{grid-template-columns:1fr;gap:18px;align-items:center;}.wg-quote-photo{max-width:250px;margin:0 auto;align-self:auto;}.wg-quote-content{text-align:center;}.wg-quote-author{justify-content:center;}.wg-ritual-sec{background:linear-gradient(rgba(12,12,12,0.5),rgba(12,12,12,0.82)),url(${RITUAL_BANNER}) center/cover no-repeat,${DARK};min-height:auto;}.wg-ritual-content{width:100%;margin:0;}}
@media(max-width:400px){.wg-proof{grid-template-columns:1fr;}}
`;

export default function WtfGymClient() {
  return (
    <div className={`wg ${jakarta.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ═══ TOP BAR — WTF × 3TATTAVA logo ═══ */}
      <div className="wg-topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/wordmark-cream.png" alt="3Tattava" />
        <span className="wg-topbar-x">×</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/wtf-gyms-cream.png" alt="WTF Gyms" />
      </div>

      {/* ═══ 1. HERO — dark ═══ */}
      <section className="wg-hero" id="top">
        <motion.p className="wg-hero-eyebrow" {...fade()}>WTF Member Access</motion.p>
        <motion.h1 className="wg-hero-h1" {...fade(0.1)}>Train Hard. <em>Recover Ancient.</em></motion.h1>
        <motion.p className="wg-hero-sub" {...fade(0.18)}>
          Doctor-formulated, lab-verified Performance Ayurveda—now on WTF gym floors. Built for the ritual after the reps.
        </motion.p>
        <motion.div className="wg-hero-ctas" {...fade(0.24)}>
          <a href="#products" className="wg-btn wg-btn-gold">Choose your ritual <Arrow /></a>
          <a href="https://www.3tattava.com/lab-reports" className="wg-btn wg-btn-ghost-d">View lab reports ↗</a>
        </motion.div>
        <motion.div className="wg-trust-strip" {...fade(0.3)}>
          <span className="wg-trust-item"><Check /> Third-party tested</span>
          <span className="wg-trust-item"><Check /> BAMS doctor-formulated</span>
          <span className="wg-trust-item"><Check /> Batch reports public</span>
        </motion.div>
        <motion.div {...fade(0.35)}><HeroBanner /></motion.div>
        <div className="wg-stats">
          <div style={{ textAlign: 'center' }}><div className="wg-stat-val">70%+</div><div className="wg-stat-label">Fulvic acid</div></div>
          <div style={{ textAlign: 'center' }}><div className="wg-stat-val">80+</div><div className="wg-stat-label">Trace minerals</div></div>
        </div>
      </section>

      {/* ═══ 2. TRAINER CODE — cream ═══ */}
      <section className="wg-trainer-sec" id="offer">
        <motion.div className="wg-trainer" {...fade()}>
          <p className="wg-eyebrow-l">Scanned at your WTF gym?</p>
          <h2 className="wg-h2-l">Keep your trainer <em>in the loop.</em></h2>
          <p className="wg-body-l">Enter the trainer code from your gym. We&apos;ll carry it with you when you continue to 3Tattava.</p>
          <input type="text" placeholder="Your trainer's code" aria-label="Trainer code" />
          <button className="wg-btn wg-btn-espresso" style={{ width: '100%', justifyContent: 'center' }}>Apply</button>
          <p style={{ fontSize: 12, color: MUTED_L, marginTop: 12 }}>No code? You can still shop normally.</p>
        </motion.div>
      </section>

      {/* ═══ 3. PRODUCTS — dark ═══ */}
      <section className="wg-products-sec" id="products">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <motion.p className="wg-eyebrow-d" {...fade()}>The Performance Ayurveda Drop</motion.p>
          <motion.h2 className="wg-h2-d" {...fade(0.06)}>One Source. <em>Two Rituals.</em></motion.h2>
          <motion.p className="wg-body-d" {...fade(0.12)}>Choose the format you&apos;ll actually stay consistent with. Both are classically purified and verified with modern testing.</motion.p>
        </div>
        <div className="wg-products">
          <motion.div className="wg-pcard" {...fade(0.08)}>
            <div className="wg-pcard-img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={ROCKRESIN_IMG} alt="RockResin™" /></div>
            <div className="wg-pcard-body">
              <span className="wg-pcard-badge">WTF Pick</span>
              <p className="wg-pcard-tag">The Original Ritual</p><h3 className="wg-pcard-name">RockResin™</h3><p className="wg-pcard-sub">Classically Purified Shilajit Resin</p>
              <p className="wg-pcard-desc">A 20 g jar of Himalayan Ladakhi Shilajit, purified through the classical Triphala Shodhana process.</p>
              <p className="wg-pcard-ritual">Dip · Hook · Swirl</p>
              <div className="wg-pcard-price"><strong>₹1,199</strong><s>₹1,399</s></div><p className="wg-pcard-price-label">Current price</p>
              <a href="https://www.3tattava.com/products/shodhit-shilajit-resin?utm_source=wtf_gym&utm_medium=qr&utm_campaign=wtf_3tattava_collab" className="wg-btn wg-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Shop RockResin <Arrow /></a>
            </div>
          </motion.div>
          <motion.div className="wg-pcard" {...fade(0.14)}>
            <div className="wg-pcard-img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={SHAHJEET_IMG} alt="Shahjeet™ Sticks" /></div>
            <div className="wg-pcard-body">
              <span className="wg-pcard-badge">WTF Pick</span>
              <p className="wg-pcard-tag">Performance In Your Pocket</p><h3 className="wg-pcard-name">Shahjeet™ Sticks</h3><p className="wg-pcard-sub">Honey Shilajit Sticks</p>
              <p className="wg-pcard-desc">600 mg of purified Shilajit in an 8 g honey base. Thirty individually packed sticks for life on the move.</p>
              <p className="wg-pcard-ritual">Tear · Squeeze · Go</p>
              <div className="wg-pcard-price"><strong>₹1,399</strong><s>₹1,599</s></div><p className="wg-pcard-price-label">Current price</p>
              <a href="https://www.3tattava.com/products/shahjeet-sticks?utm_source=wtf_gym&utm_medium=qr&utm_campaign=wtf_3tattava_collab" className="wg-btn wg-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Shop Shahjeet Sticks <Arrow /></a>
            </div>
          </motion.div>
        </div>
        <p style={{ fontSize: 11, color: DIM_D, marginTop: 16, textAlign: 'center' }}>Prices reflect the current collaboration and may change on the official store.</p>
      </section>

      {/* ═══ 4. PROOF — cream ═══ */}
      <section className="wg-proof-sec">
        <motion.p className="wg-eyebrow-l" {...fade()}>Not Fitness Theatre. Product Proof.</motion.p>
        <motion.h2 className="wg-h2-l" {...fade(0.06)}>Don&apos;t believe the claim. <em>Verify the standard.</em></motion.h2>
        <motion.p className="wg-body-l" {...fade(0.12)} style={{ maxWidth: 600, margin: '0 auto 8px' }}>3Tattava pairs classical Ayurvedic preparation with modern quality verification.</motion.p>
        <motion.div {...fade(0.16)}><a href="https://www.3tattava.com/lab-reports" className="wg-btn wg-btn-ghost-l" style={{ marginTop: 16 }}>Open lab reports <Arrow /></a></motion.div>
        <div className="wg-proof">
          {[{ icon: '✦', title: 'Triphala purified', desc: 'Classical Shodhana preparation that respects the Ayurvedic process.' },
            { icon: '⌁', title: 'Batch-level testing', desc: 'Third-party testing with public batch reports — quality visible, not merely claimed.' },
            { icon: '+', title: 'Doctor formulated', desc: 'Developed by Dr. Kashish Gupta, BAMS, inside India\'s Ayurveda regulatory ecosystem.' },
            { icon: '△', title: 'Made for consistency', desc: 'Traditional resin or travel-ready honey sticks — the same intent in a format that fits.' },
          ].map((p, i) => (
            <motion.div key={p.title} className="wg-proof-card" {...fade(i * 0.06)}>
              <p className="wg-proof-num">0{i + 1}</p><p className="wg-proof-icon">{p.icon}</p>
              <h3 className="wg-proof-title">{p.title}</h3><p className="wg-proof-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 5. RITUAL — dark ═══ */}
      <section className="wg-ritual-sec">
        <div className="wg-ritual-inner">
          <div className="wg-ritual-content">
            <motion.p className="wg-eyebrow-d" {...fade()}>The 10-Second Habit</motion.p>
            <motion.h2 className="wg-h2-d" {...fade(0.06)}>Stack the ritual <em>after the reps.</em></motion.h2>
            <motion.p className="wg-body-d" {...fade(0.12)}>The best routine isn&apos;t the most complicated one. It&apos;s the one you repeat.</motion.p>
            <div className="wg-steps">
              {[{ t: 'Pick your format', d: 'Traditional RockResin or portable Shahjeet Sticks.' },
                { t: 'Follow the label', d: 'Use the measured serving exactly as directed.' },
                { t: 'Make it automatic', d: 'Attach it to a cue you already own: water, breakfast, or gym bag.' },
              ].map((s, i) => (
                <motion.div key={s.t} className="wg-step" {...fade(i * 0.06)}>
                  <span className="wg-step-num">0{i + 1}</span>
                  <p className="wg-step-text"><strong>{s.t}</strong> — {s.d}</p>
                </motion.div>
              ))}
            </div>
            <motion.div {...fade(0.2)} style={{ marginTop: 20 }}>
              <a href="#products" className="wg-btn wg-btn-gold">Find your format <Arrow /></a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 6. DOCTOR QUOTE — cream ═══ */}
      <section className="wg-quote-sec">
        <motion.div className="wg-quote" {...fade()}>
          <div className="wg-quote-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DR_KASHISH} alt="Dr. Kashish Gupta, BAMS" />
          </div>
          <div className="wg-quote-content">
            <blockquote>&ldquo;Don&apos;t believe our claim—<em>verify our standards.</em>&rdquo;</blockquote>
            <div className="wg-quote-author">
              <div>
                <p className="wg-quote-name">Dr. Kashish Gupta</p>
                <p className="wg-quote-role">BAMS · Founder &amp; Formulating Ayurveda Doctor</p>
              </div>
            </div>
            <a href="https://www.3tattava.com/about" className="wg-btn wg-btn-ghost-l" style={{ marginTop: 20 }}>Meet the doctor <Arrow /></a>
          </div>
        </motion.div>
      </section>

      {/* ═══ 7. FAQ — dark ═══ */}
      <section className="wg-faq-sec">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <motion.p className="wg-eyebrow-d" {...fade()}>Know Before You Start</motion.p>
          <motion.h2 className="wg-h2-d" {...fade(0.06)}>Questions, <em>Answered.</em></motion.h2>
          <motion.p className="wg-body-d" {...fade(0.12)}>Still unsure? Ask your physician or contact 3Tattava support.</motion.p>
        </div>
        <div className="wg-faq">{FAQS.map((faq, i) => <FaqItem key={i} faq={faq} idx={i} />)}</div>
      </section>

      {/* ═══ 8. FINAL CTA — cream ═══ */}
      <section className="wg-final">
        <motion.p className="wg-eyebrow-l" {...fade()}>Balance. Build. Become.</motion.p>
        <motion.h2 className="wg-h2-l" {...fade(0.06)}>Your next set starts <em>before the gym.</em></motion.h2>
        <motion.p className="wg-body-l" {...fade(0.12)} style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          Choose a ritual that can move with your training, your travel, and your real life.
        </motion.p>
        <motion.div {...fade(0.18)}><a href="#products" className="wg-btn wg-btn-espresso">Choose your ritual <Arrow /></a></motion.div>
      </section>

      {/* ═══ 9. FOOTER — dark ═══ */}
      <footer className="wg-foot">
        <div className="wg-foot-logos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/wtf-gyms-cream.png" alt="WTF Gyms" />
          <span style={{ color: DIM_D }}>×</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/wordmark-cream.png" alt="3Tattava" />
        </div>
        <div className="wg-foot-links">
          <a href="https://www.3tattava.com/lab-reports">Lab reports</a>
          <a href="https://www.3tattava.com/contact">Contact</a>
          <a href="https://wtf.fitness/">WTF Fitness</a>
          <a href="https://www.3tattava.com/">3Tattava</a>
        </div>
        <p className="wg-foot-legal">3Tattava products are Ayurvedic Proprietary Medicines. Use only as directed on the label. This page is for general awareness and is not a substitute for professional medical advice.</p>
        <p className="wg-foot-copy">© 2026 WTF Gyms × SankalpaSiddhi Ayupharma Pvt. Ltd.</p>
      </footer>

      {/* ═══ 10. STICKY BAR ═══ */}
      <div className="wg-sticky">
        <p className="wg-sticky-text">WTF × 3TATTAVA · <strong>Choose your ritual</strong></p>
        <a href="#products" className="wg-btn wg-btn-gold" style={{ padding: '10px 20px', fontSize: 11 }}>Shop <Arrow /></a>
      </div>
    </div>
  );
}
