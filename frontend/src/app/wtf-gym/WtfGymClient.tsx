'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Assets ─── */
const CDN = 'https://media.3tattava.com';
const HERO_POSTER = `${CDN}/banners/Landing_Page/6X3+LAUNCH+POSTER.png`;
const HERO_VIDEO = `${CDN}/banners/Landing_Page/3tattava-x-WTF.mp4`;
const PRODUCT_HERO = `${CDN}/products/Boxess%20copy%201.png`;
const ROCKRESIN_IMG = `${CDN}/products/rockresin/1.png`;
const SHAHJEET_IMG = `${CDN}/products/tgftcf%201.png`;

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

/* Palette — dark gym aesthetic */
const BG = '#0c0c0c';
const SURFACE = '#161616';
const CARD = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.08)';
const GOLD = '#C8963E';
const CREAM = '#f7f0e2';
const MUTED = 'rgba(255,255,255,0.5)';
const DIM = 'rgba(255,255,255,0.35)';

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 22 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.65, delay: d, ease: EASE },
});

/* ─── iPhone mockup with poster → video ─── */
function PhoneMockup() {
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
    <div style={{ position: 'relative', width: 'clamp(260px,70vw,340px)', margin: '0 auto', flexShrink: 0 }}>
      {/* Phone frame */}
      <div style={{
        borderRadius: 36, border: '3px solid rgba(255,255,255,0.15)',
        background: '#000', overflow: 'hidden', aspectRatio: '9/16',
        position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 28, background: '#000', borderRadius: '0 0 18px 18px', zIndex: 4 }} />

        {/* Poster — shows first 3s */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_POSTER} alt="3Tattava × WTF Launch"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: phase === 'poster' ? 1 : 0, transform: phase === 'poster' ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'opacity .7s ease, transform .7s ease', zIndex: 2 }} />

        {/* Video — plays after 3s */}
        <video ref={vidRef} loop playsInline preload="auto" muted
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: phase === 'video' ? 1 : 0, transition: 'opacity .7s ease', zIndex: 1 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </div>

      {/* Sound toggle */}
      {phase === 'video' && (
        <button onClick={() => { const v = vidRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          style={{ position: 'absolute', bottom: 18, right: 18, zIndex: 5, width: 36, height: 36,
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.6)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          {muted ? '🔇' : '🔊'}
        </button>
      )}
    </div>
  );
}

/* ─── Styles ─── */
const CSS = `
*{box-sizing:border-box;}
.wtf{background:${BG};color:#fff;font-family:${F};min-height:100vh;overflow-x:hidden;}
.wtf a{color:inherit;text-decoration:none;}

/* Hero */
.wtf-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(100px,14vh,140px) 24px clamp(40px,6vh,80px);position:relative;overflow:hidden;text-align:center;}
.wtf-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 40%,rgba(200,150,62,0.06) 0%,transparent 70%);pointer-events:none;}
.wtf-eyebrow{font-size:clamp(10px,1.3vw,12px);font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:${GOLD};margin-bottom:16px;}
.wtf-h1{font-variation-settings:'wght' 800;font-size:clamp(32px,7vw,64px);line-height:1.06;letter-spacing:-.02em;color:#fff;margin:0 0 16px;}
.wtf-h1 em{font-style:italic;color:${GOLD};}
.wtf-sub{font-size:clamp(14px,1.8vw,17px);line-height:1.6;color:${MUTED};max-width:520px;margin:0 auto 28px;font-weight:300;}
.wtf-hero-ctas{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;}
.wtf-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border:none;cursor:pointer;transition:all .25s ease;}
.wtf-btn-gold{background:${GOLD};color:${BG};}
.wtf-btn-gold:hover{background:#d9a84e;transform:translateY(-2px);}
.wtf-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;}
.wtf-btn-ghost:hover{border-color:rgba(255,255,255,0.5);}
.wtf-trust-strip{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-bottom:36px;}
.wtf-trust-item{font-size:11px;font-weight:600;letter-spacing:.06em;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:6px;}
.wtf-trust-item svg{width:16px;height:16px;color:${GOLD};}
.wtf-hero-phone{margin:36px auto 0;}
.wtf-stats{display:flex;gap:clamp(24px,4vw,48px);justify-content:center;margin-top:28px;flex-wrap:wrap;}
.wtf-stat-val{font-variation-settings:'wght' 800;font-size:clamp(28px,5vw,42px);color:#fff;line-height:1;}
.wtf-stat-label{font-size:11px;color:${DIM};letter-spacing:.06em;margin-top:4px;}
.wtf-scroll{display:flex;justify-content:center;margin-top:clamp(20px,3vw,36px);}
.wtf-scroll a{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${DIM};padding:8px 18px;border:1px solid ${BORDER};border-radius:999px;}

/* Sections */
.wtf-sec{padding:clamp(64px,10vw,120px) 24px;max-width:900px;margin:0 auto;}
.wtf-sec-wide{max-width:1100px;}
.wtf-h2{font-variation-settings:'wght' 800;font-size:clamp(24px,4.5vw,42px);line-height:1.1;letter-spacing:-.01em;margin:0 0 16px;}
.wtf-h2 em{font-style:italic;color:${GOLD};}
.wtf-body{font-size:clamp(14px,1.6vw,16px);line-height:1.7;color:${MUTED};font-weight:300;}
.wtf-divider{height:1px;background:${BORDER};margin:0 auto;max-width:900px;}

/* Trainer code */
.wtf-trainer{background:${SURFACE};border:1px solid ${BORDER};border-radius:20px;padding:clamp(32px,5vw,48px);text-align:center;max-width:560px;margin:0 auto;}
.wtf-trainer input{width:100%;background:rgba(255,255,255,0.04);border:1px solid ${BORDER};color:#fff;font-family:${F};font-size:14px;padding:14px 16px;border-radius:8px;outline:none;margin:16px 0 12px;text-align:center;letter-spacing:.08em;}
.wtf-trainer input:focus{border-color:rgba(200,150,62,0.5);}
.wtf-trainer input::placeholder{color:${DIM};}

/* Product cards */
.wtf-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:20px;margin-top:32px;}
.wtf-pcard{background:${CARD};border:1px solid ${BORDER};border-radius:20px;overflow:hidden;display:flex;flex-direction:column;}
.wtf-pcard-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${GOLD};background:rgba(200,150,62,0.1);border:1px solid rgba(200,150,62,0.2);padding:5px 12px;border-radius:999px;margin-bottom:12px;}
.wtf-pcard-img{width:100%;aspect-ratio:1/1;background:${BG};display:flex;align-items:center;justify-content:center;padding:28px;}
.wtf-pcard-img img{width:100%;height:100%;object-fit:contain;}
.wtf-pcard-body{padding:24px;flex:1;display:flex;flex-direction:column;}
.wtf-pcard-tag{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};margin-bottom:6px;}
.wtf-pcard-name{font-variation-settings:'wght' 800;font-size:22px;color:#fff;margin:0 0 4px;}
.wtf-pcard-sub{font-size:13px;color:${DIM};margin:0 0 12px;}
.wtf-pcard-desc{font-size:14px;color:${MUTED};line-height:1.6;margin:0 0 16px;flex:1;}
.wtf-pcard-ritual{font-size:12px;letter-spacing:.08em;color:${DIM};margin:0 0 20px;}
.wtf-pcard-price{display:flex;align-items:baseline;gap:10px;margin-bottom:4px;}
.wtf-pcard-price strong{font-variation-settings:'wght' 800;font-size:24px;color:#fff;}
.wtf-pcard-price s{font-size:14px;color:${DIM};}
.wtf-pcard-price-label{font-size:10px;color:${DIM};margin-bottom:18px;}

/* Proof cards */
.wtf-proof{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:16px;margin-top:32px;}
.wtf-proof-card{background:${SURFACE};border:1px solid ${BORDER};border-radius:16px;padding:24px;}
.wtf-proof-num{font-size:11px;color:${DIM};letter-spacing:.1em;margin-bottom:12px;}
.wtf-proof-icon{font-size:20px;color:${GOLD};margin-bottom:10px;}
.wtf-proof-title{font-variation-settings:'wght' 700;font-size:16px;color:#fff;margin:0 0 8px;}
.wtf-proof-desc{font-size:13px;color:${MUTED};line-height:1.55;}

/* Ritual */
.wtf-ritual-img{width:100%;border-radius:16px;margin-bottom:8px;overflow:hidden;position:relative;}
.wtf-ritual-img img{width:100%;height:auto;display:block;}
.wtf-ritual-img-label{position:absolute;bottom:16px;left:16px;right:16px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.6);}
.wtf-steps{margin-top:28px;}
.wtf-step{display:flex;gap:16px;padding:18px 0;border-top:1px solid ${BORDER};}
.wtf-step-num{font-variation-settings:'wght' 800;font-size:14px;color:${GOLD};flex-shrink:0;width:28px;}
.wtf-step-text strong{color:#fff;font-weight:700;}
.wtf-step-text{font-size:14px;color:${MUTED};line-height:1.5;}

/* Doctor quote */
.wtf-quote{background:${SURFACE};border:1px solid ${BORDER};border-radius:20px;padding:clamp(28px,4vw,40px);margin-top:40px;}
.wtf-quote blockquote{font-size:clamp(17px,2.2vw,22px);font-style:italic;color:#fff;line-height:1.5;margin:0 0 20px;border:none;padding:0;}
.wtf-quote blockquote em{color:${GOLD};}
.wtf-quote-author{display:flex;align-items:center;gap:14px;}
.wtf-quote-avatar{width:44px;height:44px;border-radius:50%;background:${GOLD};display:flex;align-items:center;justify-content:center;font-variation-settings:'wght' 800;font-size:16px;color:${BG};}
.wtf-quote-name{font-variation-settings:'wght' 700;font-size:14px;color:#fff;}
.wtf-quote-role{font-size:12px;color:${DIM};}

/* FAQ */
.wtf-faq{margin-top:28px;}
.wtf-faq-item{border-top:1px solid ${BORDER};padding:20px 0;}
.wtf-faq-q{font-variation-settings:'wght' 700;font-size:15px;color:#fff;cursor:pointer;display:flex;gap:12px;align-items:flex-start;}
.wtf-faq-q span:first-child{color:${GOLD};font-size:13px;flex-shrink:0;width:22px;}
.wtf-faq-a{font-size:14px;color:${MUTED};line-height:1.65;padding:12px 0 0 34px;}

/* Final CTA */
.wtf-final{text-align:center;padding:clamp(64px,10vw,120px) 24px;border-top:1px solid ${BORDER};}

/* Footer */
.wtf-foot{padding:32px 24px;text-align:center;border-top:1px solid ${BORDER};}
.wtf-foot-logos{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:20px;}
.wtf-foot-links{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-bottom:20px;}
.wtf-foot-links a{font-size:12px;color:${DIM};transition:color .2s;}
.wtf-foot-links a:hover{color:${GOLD};}
.wtf-foot-legal{font-size:11px;color:rgba(255,255,255,0.25);max-width:600px;margin:0 auto 12px;line-height:1.6;}
.wtf-foot-copy{font-size:11px;color:rgba(255,255,255,0.2);}

/* Sticky bar */
.wtf-sticky{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(12,12,12,0.92);backdrop-filter:blur(12px);border-top:1px solid ${BORDER};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;}
.wtf-sticky-text{font-size:12px;color:${DIM};}
.wtf-sticky-text strong{color:#fff;}

@media(max-width:640px){
  .wtf-hero{padding-top:clamp(80px,12vh,120px);}
  .wtf-products{grid-template-columns:1fr;}
  .wtf-proof{grid-template-columns:1fr 1fr;}
}
@media(max-width:400px){.wtf-proof{grid-template-columns:1fr;}}
`;

const FAQS = [
  { q: 'What exactly is Shilajit?', a: 'Shilajit is a naturally occurring, mineral-rich substance found in Himalayan rock formations. 3Tattava uses Himalayan Ladakhi Shilajit that is classically purified before formulation.' },
  { q: 'Which product should I start with?', a: 'Choose RockResin if you want the traditional resin ritual. Choose Shahjeet Sticks if portability and a honey-based format will help you stay consistent. Both are designed as daily rituals.' },
  { q: 'How do I use it?', a: 'Use only as directed on the product label. RockResin is measured with the included dipper and mixed into warm water or milk. Shahjeet is a tear-and-squeeze stick that can be taken directly or mixed into a beverage.' },
  { q: 'Can I verify the quality?', a: 'Yes. Products are third-party tested, and batch-level reports can be accessed through the QR code on the pack or the 3Tattava lab reports page.' },
  { q: 'Is this for men only?', a: 'No. These products are presented for adult men and women. If you are pregnant, breastfeeding, taking medication, or managing a medical condition, consult a qualified physician before use.' },
];

function FaqItem({ faq, idx }: { faq: typeof FAQS[0]; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wtf-faq-item">
      <div className="wtf-faq-q" onClick={() => setOpen(!open)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') setOpen(!open); }}>
        <span>0{idx + 1}</span><span>{faq.q}</span>
      </div>
      {open && <p className="wtf-faq-a">{faq.a}</p>}
    </div>
  );
}

/* ─── Check icon SVG ─── */
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="m5 12.5 4.2 4L19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function WtfGymClient() {
  return (
    <div className="wtf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="wtf-hero" id="top">
        <motion.p className="wtf-eyebrow" {...fade()}>WTF Member Access</motion.p>
        <motion.h1 className="wtf-h1" {...fade(0.1)}>Train hard. <em>Recover ancient.</em></motion.h1>
        <motion.p className="wtf-sub" {...fade(0.18)}>
          Doctor-formulated, lab-verified Performance Ayurveda—now on WTF gym floors. Built for the ritual after the reps.
        </motion.p>
        <motion.div className="wtf-hero-ctas" {...fade(0.24)}>
          <a href="#products" className="wtf-btn wtf-btn-gold">Choose your ritual <Arrow /></a>
          <a href="https://www.3tattava.com/lab-reports" className="wtf-btn wtf-btn-ghost">View lab reports ↗</a>
        </motion.div>
        <motion.div className="wtf-trust-strip" {...fade(0.3)}>
          <span className="wtf-trust-item"><Check /> Third-party tested</span>
          <span className="wtf-trust-item"><Check /> BAMS doctor-formulated</span>
          <span className="wtf-trust-item"><Check /> Batch reports public</span>
        </motion.div>

        {/* Phone mockup with poster → video */}
        <motion.div className="wtf-hero-phone" {...fade(0.35)}>
          <PhoneMockup />
        </motion.div>

        <motion.div className="wtf-stats" {...fade(0.4)}>
          <div style={{ textAlign: 'center' }}><div className="wtf-stat-val">70%+</div><div className="wtf-stat-label">Fulvic acid</div></div>
          <div style={{ textAlign: 'center' }}><div className="wtf-stat-val">80+</div><div className="wtf-stat-label">Trace minerals</div></div>
        </motion.div>
        <div className="wtf-scroll"><a href="#offer">SCROLL ↓</a></div>
      </section>

      {/* ═══════════════ 2. TRAINER CODE ═══════════════ */}
      <section className="wtf-sec" id="offer" style={{ textAlign: 'center' }}>
        <motion.div className="wtf-trainer" {...fade()}>
          <p className="wtf-eyebrow">Scanned at your WTF gym?</p>
          <h2 className="wtf-h2">Keep your trainer <em>in the loop.</em></h2>
          <p className="wtf-body">Enter the trainer code from your gym. We&apos;ll carry it with you when you continue to 3Tattava.</p>
          <input type="text" placeholder="Your trainer's code" aria-label="Trainer code" />
          <button className="wtf-btn wtf-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Apply</button>
          <p style={{ fontSize: 12, color: DIM, marginTop: 12 }}>No code? You can still shop normally.</p>
        </motion.div>
      </section>

      <div className="wtf-divider" />

      {/* ═══════════════ 3. PRODUCT CARDS ═══════════════ */}
      <section className="wtf-sec wtf-sec-wide" id="products" style={{ textAlign: 'center' }}>
        <motion.p className="wtf-eyebrow" {...fade()}>The Performance Ayurveda Drop</motion.p>
        <motion.h2 className="wtf-h2" {...fade(0.06)}>One source. <em>Two rituals.</em></motion.h2>
        <motion.p className="wtf-body" {...fade(0.12)} style={{ margin: '0 auto' }}>
          Choose the format you&apos;ll actually stay consistent with. Both are classically purified and verified with modern testing.
        </motion.p>
        <div className="wtf-products">
          {/* RockResin */}
          <motion.div className="wtf-pcard" {...fade(0.08)}>
            <div className="wtf-pcard-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ROCKRESIN_IMG} alt="RockResin™" />
            </div>
            <div className="wtf-pcard-body">
              <span className="wtf-pcard-badge">WTF Pick</span>
              <p className="wtf-pcard-tag">The Original Ritual</p>
              <h3 className="wtf-pcard-name">RockResin™</h3>
              <p className="wtf-pcard-sub">Classically Purified Shilajit Resin</p>
              <p className="wtf-pcard-desc">A 20 g jar of Himalayan Ladakhi Shilajit, purified through the classical Triphala Shodhana process.</p>
              <p className="wtf-pcard-ritual">Dip · Hook · Swirl</p>
              <div className="wtf-pcard-price"><strong>₹1,199</strong><s>₹1,399</s></div>
              <p className="wtf-pcard-price-label">Current price</p>
              <a href="https://www.3tattava.com/products/shodhit-shilajit-resin?utm_source=wtf_gym&utm_medium=qr&utm_campaign=wtf_3tattava_collab" className="wtf-btn wtf-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Shop RockResin <Arrow /></a>
            </div>
          </motion.div>
          {/* Shahjeet */}
          <motion.div className="wtf-pcard" {...fade(0.14)}>
            <div className="wtf-pcard-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SHAHJEET_IMG} alt="Shahjeet™ Sticks" />
            </div>
            <div className="wtf-pcard-body">
              <span className="wtf-pcard-badge">WTF Pick</span>
              <p className="wtf-pcard-tag">Performance In Your Pocket</p>
              <h3 className="wtf-pcard-name">Shahjeet™ Sticks</h3>
              <p className="wtf-pcard-sub">Honey Shilajit Sticks</p>
              <p className="wtf-pcard-desc">600 mg of purified Shilajit in an 8 g honey base. Thirty individually packed sticks for life on the move.</p>
              <p className="wtf-pcard-ritual">Tear · Squeeze · Go</p>
              <div className="wtf-pcard-price"><strong>₹1,399</strong><s>₹1,599</s></div>
              <p className="wtf-pcard-price-label">Current price</p>
              <a href="https://www.3tattava.com/products/shahjeet-sticks?utm_source=wtf_gym&utm_medium=qr&utm_campaign=wtf_3tattava_collab" className="wtf-btn wtf-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Shop Shahjeet Sticks <Arrow /></a>
            </div>
          </motion.div>
        </div>
        <p style={{ fontSize: 11, color: DIM, marginTop: 16 }}>Prices shown reflect the current 3Tattava collaboration page and may change on the official store.</p>
      </section>

      <div className="wtf-divider" />

      {/* ═══════════════ 4. TRUST / PROOF ═══════════════ */}
      <section className="wtf-sec wtf-sec-wide" style={{ textAlign: 'center' }}>
        <motion.p className="wtf-eyebrow" {...fade()}>Not Fitness Theatre. Product Proof.</motion.p>
        <motion.h2 className="wtf-h2" {...fade(0.06)}>Don&apos;t believe the claim. <em>Verify the standard.</em></motion.h2>
        <motion.p className="wtf-body" {...fade(0.12)} style={{ margin: '0 auto 8px' }}>
          3Tattava pairs classical Ayurvedic preparation with modern quality verification—so the ritual earns its place beside serious training.
        </motion.p>
        <motion.div {...fade(0.16)}>
          <a href="https://www.3tattava.com/lab-reports" className="wtf-btn wtf-btn-ghost" style={{ marginTop: 16 }}>Open lab reports <Arrow /></a>
        </motion.div>
        <div className="wtf-proof">
          {[
            { icon: '✦', title: 'Triphala purified', desc: 'Classical Shodhana preparation that respects the Ayurvedic process before the product reaches you.' },
            { icon: '⌁', title: 'Batch-level testing', desc: 'Third-party testing with public batch reports designed to make quality visible, not merely claimed.' },
            { icon: '+', title: 'Doctor formulated', desc: 'Developed by Dr. Kashish Gupta, BAMS, with experience inside India\'s Ayurveda regulatory ecosystem.' },
            { icon: '△', title: 'Made for consistency', desc: 'Traditional resin or travel-ready honey sticks—the same intent in a format that fits modern routines.' },
          ].map((p, i) => (
            <motion.div key={p.title} className="wtf-proof-card" {...fade(i * 0.06)}>
              <p className="wtf-proof-num">0{i + 1}</p>
              <p className="wtf-proof-icon">{p.icon}</p>
              <h3 className="wtf-proof-title">{p.title}</h3>
              <p className="wtf-proof-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="wtf-divider" />

      {/* ═══════════════ 5. RITUAL ═══════════════ */}
      <section className="wtf-sec">
        <motion.p className="wtf-eyebrow" {...fade()}>The 10-Second Habit</motion.p>
        <motion.h2 className="wtf-h2" {...fade(0.06)}>Stack the ritual <em>after the reps.</em></motion.h2>
        <motion.p className="wtf-body" {...fade(0.12)}>The best routine isn&apos;t the most complicated one. It&apos;s the one you repeat.</motion.p>
        <div className="wtf-steps">
          {[
            { title: 'Pick your format', desc: 'Traditional RockResin or portable Shahjeet Sticks.' },
            { title: 'Follow the label', desc: 'Use the measured serving exactly as directed.' },
            { title: 'Make it automatic', desc: 'Attach it to a cue you already own: water, breakfast, or gym bag.' },
          ].map((s, i) => (
            <motion.div key={s.title} className="wtf-step" {...fade(i * 0.06)}>
              <span className="wtf-step-num">0{i + 1}</span>
              <p className="wtf-step-text"><strong>{s.title}</strong> — {s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...fade(0.2)} style={{ marginTop: 20 }}>
          <a href="#products" className="wtf-btn wtf-btn-gold">Find your format <Arrow /></a>
        </motion.div>

        {/* Doctor quote */}
        <motion.div className="wtf-quote" {...fade(0.1)}>
          <blockquote>&ldquo;Don&apos;t believe our claim—<em>verify our standards.</em>&rdquo;</blockquote>
          <div className="wtf-quote-author">
            <div className="wtf-quote-avatar">KG</div>
            <div>
              <p className="wtf-quote-name">Dr. Kashish Gupta</p>
              <p className="wtf-quote-role">BAMS · Founder &amp; Formulating Ayurveda Doctor, 3Tattava</p>
            </div>
          </div>
          <a href="https://www.3tattava.com/about" className="wtf-btn wtf-btn-ghost" style={{ marginTop: 20 }}>Meet the doctor <Arrow /></a>
        </motion.div>
      </section>

      <div className="wtf-divider" />

      {/* ═══════════════ 6. FAQ ═══════════════ */}
      <section className="wtf-sec" style={{ textAlign: 'center' }}>
        <motion.p className="wtf-eyebrow" {...fade()}>Know Before You Start</motion.p>
        <motion.h2 className="wtf-h2" {...fade(0.06)}>Questions, <em>answered.</em></motion.h2>
        <motion.p className="wtf-body" {...fade(0.12)} style={{ margin: '0 auto 8px' }}>
          Still unsure? Ask your physician or contact 3Tattava support before beginning a new product.
        </motion.p>
        <div className="wtf-faq" style={{ textAlign: 'left' }}>
          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} idx={i} />)}
        </div>
      </section>

      <div className="wtf-divider" />

      {/* ═══════════════ 7. FINAL CTA ═══════════════ */}
      <section className="wtf-final">
        <motion.p className="wtf-eyebrow" {...fade()}>Balance. Build. Become.</motion.p>
        <motion.h2 className="wtf-h2" {...fade(0.06)}>Your next set starts <em>before the gym.</em></motion.h2>
        <motion.p className="wtf-body" {...fade(0.12)} style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          Choose a ritual that can move with your training, your travel, and your real life.
        </motion.p>
        <motion.div {...fade(0.18)}>
          <a href="#products" className="wtf-btn wtf-btn-gold">Choose your ritual <Arrow /></a>
        </motion.div>
      </section>

      {/* ═══════════════ 8. FOOTER ═══════════════ */}
      <footer className="wtf-foot">
        <div className="wtf-foot-logos">
          <span style={{ fontVariationSettings: "'wght' 800", fontSize: 16, letterSpacing: '.04em' }}>WTF GYMS</span>
          <span style={{ color: DIM }}>×</span>
          <span style={{ fontVariationSettings: "'wght' 800", fontSize: 16, letterSpacing: '.04em' }}>3TATTAVA</span>
        </div>
        <div className="wtf-foot-links">
          <a href="https://www.3tattava.com/lab-reports">Lab reports</a>
          <a href="https://www.3tattava.com/contact">Contact</a>
          <a href="https://wtf.fitness/">WTF Fitness</a>
          <a href="https://www.3tattava.com/">3Tattava</a>
        </div>
        <p className="wtf-foot-legal">3Tattava products are Ayurvedic Proprietary Medicines. Use only as directed on the label. This page is for general awareness and is not a substitute for professional medical advice. Consult a qualified physician if you are pregnant, breastfeeding, taking medication, or managing a medical condition.</p>
        <p className="wtf-foot-copy">© 2026 WTF Gyms × SankalpaSiddhi Ayupharma Pvt. Ltd.</p>
      </footer>

      {/* ═══════════════ 9. STICKY BAR ═══════════════ */}
      <div className="wtf-sticky">
        <p className="wtf-sticky-text">WTF × 3TATTAVA · <strong>Choose your ritual</strong></p>
        <a href="#products" className="wtf-btn wtf-btn-gold" style={{ padding: '10px 20px', fontSize: 11 }}>Shop <Arrow /></a>
      </div>
    </div>
  );
}
