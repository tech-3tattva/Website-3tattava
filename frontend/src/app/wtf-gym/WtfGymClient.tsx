'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Palette ─── */
const CREAM = '#f7f0e2';
const INK = '#1c1304';
const ESPRESSO = '#442a1b';
const GOLD = '#C8963E';
const FOREST = '#1e3a2f';

/* ─── Assets ─── */
const S3 = 'https://3tattava-media-prod.s3.ap-south-1.amazonaws.com/banners/Landing_Page';
const HERO_IMAGE = `${S3}/6X3+LAUNCH+POSTER.png`;
const HERO_VIDEO = `${S3}/3tattava-x-WTF.mp4`;

const ROCKRESIN_ASSETS = [
  `${S3}/RockResins_3tattava_WTF/RockResin+Standee+Designs-01.png`,
  `${S3}/RockResins_3tattava_WTF/RockResin+Standee+Designs-02.png`,
  `${S3}/RockResins_3tattava_WTF/RockResin+Standee+Designs-03.png`,
  `${S3}/RockResins_3tattava_WTF/RockResin+Standee+Designs-04.png`,
];

const SHAHJEET_ASSETS = [
  `${S3}/Shahjeet_3tattava_WTF/Shahjeet+Standee+Designs-01.png`,
  `${S3}/Shahjeet_3tattava_WTF/Shahjeet+Standee+Designs-02.png`,
  `${S3}/Shahjeet_3tattava_WTF/Shahjeet+Standee+Designs-03.png`,
  `${S3}/Shahjeet_3tattava_WTF/Shahjeet+Standee+Designs-04.png`,
];

/* ─── CSS ─── */
const CSS = `
  .wg{background:${CREAM};min-height:100vh;font-family:${F};color:${INK};overflow-x:hidden;}

  /* Hero */
  .wg-hero{position:relative;width:100%;height:100vh;min-height:600px;overflow:hidden;background:${INK};}
  .wg-hero-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .8s ease;}
  .wg-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(28,19,4,0.10) 0%,rgba(28,19,4,0.55) 70%,rgba(28,19,4,0.88) 100%);z-index:1;pointer-events:none;}
  .wg-hero-bottom{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:0 24px clamp(36px,6vw,64px);text-align:center;}
  .wg-hero-collab{font-size:clamp(11px,1.6vw,14px);font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:${GOLD};margin-bottom:12px;}
  .wg-hero-title{font-variation-settings:'wght' 800;font-size:clamp(28px,6.5vw,58px);line-height:1.06;letter-spacing:-.02em;color:#f7f0e2;margin:0 0 14px;}
  .wg-hero-sub{font-size:clamp(14px,2vw,18px);line-height:1.55;color:rgba(247,240,226,.78);font-weight:300;max-width:520px;margin:0 auto;}
  .wg-hero-sound{position:absolute;bottom:clamp(16px,3vw,28px);right:clamp(16px,3vw,28px);z-index:3;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(247,240,226,.5);background:rgba(28,19,4,.5);color:#f7f0e2;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;}

  /* Section shared */
  .wg-sec{padding:clamp(56px,8vw,96px) 24px;text-align:center;}
  .wg-eyebrow{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:${GOLD};margin-bottom:14px;}
  .wg-h2{font-variation-settings:'wght' 800;font-size:clamp(24px,4.5vw,40px);letter-spacing:-.01em;color:${ESPRESSO};margin:0 0 18px;line-height:1.12;}
  .wg-body{font-size:clamp(15px,1.8vw,17px);line-height:1.7;color:rgba(68,42,27,.78);font-weight:300;max-width:660px;margin:0 auto;}

  /* Parallax gallery */
  .wg-gallery{padding:clamp(32px,5vw,64px) 0;overflow:hidden;}
  .wg-gallery-row{display:flex;gap:clamp(14px,2vw,24px);will-change:transform;}
  .wg-gallery-card{flex:0 0 auto;width:clamp(260px,42vw,380px);border-radius:18px;overflow:hidden;box-shadow:0 16px 44px rgba(68,42,27,.14);}
  .wg-gallery-card img{width:100%;height:auto;display:block;}

  /* Trust */
  .wg-trust{padding:clamp(32px,5vw,52px) 24px;background:${FOREST};text-align:center;}
  .wg-trust-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:800px;margin:0 auto;}
  .wg-trust-pill{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${GOLD};border:1px solid rgba(200,150,62,.35);padding:8px 18px;border-radius:999px;}

  /* CTAs */
  .wg-cta{padding:clamp(56px,8vw,96px) 24px;text-align:center;background:${CREAM};}
  .wg-cta-grid{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:18px;}
  .wg-cta-card{display:flex;flex-direction:column;align-items:center;padding:clamp(28px,4vw,42px) 24px;background:#fff;border:1px solid rgba(200,150,62,.22);border-radius:18px;box-shadow:0 10px 30px rgba(68,42,27,.06);text-decoration:none;color:inherit;transition:transform .3s ease,box-shadow .3s ease;}
  .wg-cta-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(68,42,27,.14);}
  .wg-cta-icon{font-size:36px;margin-bottom:16px;}
  .wg-cta-name{font-variation-settings:'wght' 800;font-size:clamp(18px,2.5vw,22px);color:${ESPRESSO};margin:0 0 8px;}
  .wg-cta-desc{font-size:14px;color:rgba(68,42,27,.6);font-weight:300;line-height:1.5;margin:0 0 20px;}
  .wg-cta-btn{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${CREAM};background:${ESPRESSO};padding:13px 28px;border-radius:999px;margin-top:auto;}
  .wg-cta-card:nth-child(3) .wg-cta-btn{background:${GOLD};color:${INK};}

  /* Footer */
  .wg-foot{padding:28px 24px;text-align:center;border-top:1px solid rgba(200,150,62,.18);}
  .wg-foot p{font-size:12px;color:rgba(68,42,27,.4);margin:0;}
  .wg-foot a{color:${GOLD};text-decoration:none;}
  .wg-foot a:hover{text-decoration:underline;}

  @media(prefers-reduced-motion:reduce){.wg-gallery-row{animation:none !important;}}
`;

/* ─── Parallax row: images scroll horizontally as user scrolls vertically ─── */
function ParallaxRow({ images, direction = 'left' }: { images: string[]; direction?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], direction === 'left' ? ['8%', '-18%'] : ['-18%', '8%']);
  return (
    <div ref={ref} style={{ overflow: 'hidden', padding: 'clamp(8px,1.5vw,16px) 0' }}>
      <motion.div className="wg-gallery-row" style={{ x }}>
        {/* duplicate for visual continuity */}
        {[...images, ...images].map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            className="wg-gallery-card"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.6, delay: (i % images.length) * 0.08, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="3Tattava × WTF Gyms collaboration" loading="lazy" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Hero: image for 3s → slide left → video autoplays with sound ─── */
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'image' | 'video'>('image');
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('video');
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.muted = false;
        setMuted(false);
        v.play().catch(() => {
          // autoplay with sound blocked — fallback to muted
          v.muted = true;
          setMuted(true);
          v.play().catch(() => {});
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="wg-hero">
      {/* Launch poster — visible first 3s, then slides left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="3Tattava × WTF Gyms Launch"
        className="wg-hero-slide"
        style={{
          opacity: phase === 'image' ? 1 : 0,
          transform: phase === 'image' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'opacity .8s ease, transform .8s ease',
        }}
      />

      {/* Video — fades in after 3s */}
      <video
        ref={videoRef}
        className="wg-hero-slide"
        loop
        playsInline
        preload="auto"
        muted
        style={{ opacity: phase === 'video' ? 1 : 0 }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="wg-hero-overlay" />

      {/* Sound toggle */}
      {phase === 'video' && (
        <button className="wg-hero-sound" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      <div className="wg-hero-bottom">
        <motion.p
          className="wg-hero-collab"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          3Tattava × WTF Gyms
        </motion.p>
        <motion.h1
          className="wg-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          Performance Ayurveda<br />Meets Fitness
        </motion.h1>
        <motion.p
          className="wg-hero-sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
        >
          Doctor-formulated Himalayan Shilajit — now at your WTF gym.
          Fuel your ritual. Elevate your training.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Page ─── */
const TRUST_PILLS = [
  'NABL Lab-Tested', 'AYUSH-GMP Certified', 'Doctor Formulated',
  '≥70% Fulvic Acid', 'Himalayan Sourced', 'Available at 28 WTF Gyms',
];

const CTAS = [
  { icon: '🍯', name: 'Shahjeet Sticks', desc: '600mg Shilajit in honey. Tear, squeeze, perform — the perfect gym companion. No spoon, no mess.', href: '/products/shahjeet-sticks', label: 'Shop Shahjeet →' },
  { icon: '🏔️', name: 'RockResin', desc: 'Pure Himalayan Shilajit resin. The original daily ritual for athletes who take recovery seriously.', href: '/products/shodhit-shilajit-resin', label: 'Shop RockResin →' },
  { icon: '📍', name: 'Experience Centers', desc: 'Explore 3Tattava experience centers and WTF gym locations near you.', href: '/find-us', label: 'Explore Locations →' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.7, delay, ease: EASE },
});

export default function WtfGymClient() {
  return (
    <div className="wg">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Hero: poster (3s) → slides left → video autoplays with audio ── */}
      <Hero />

      {/* ── Why this matters for gym-goers ── */}
      <section className="wg-sec">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.p className="wg-eyebrow" {...fade()}>Built for the Gym</motion.p>
          <motion.h2 className="wg-h2" {...fade(0.08)}>
            Why Shilajit Belongs in Your Gym Bag
          </motion.h2>
          <motion.p className="wg-body" {...fade(0.14)}>
            Whether you&apos;re lifting, doing HIIT, or recovering between sessions — your body
            burns through minerals faster than most diets can replenish. Shilajit is a natural
            mineral-rich Rasayana used for over 3,000 years to support energy, recovery, and
            daily resilience. 3Tattava brings it to WTF Gyms in two formats: a 10-second honey
            stick and a classic resin jar — both NABL lab-tested, doctor-formulated, and ready
            for your routine.
          </motion.p>
        </div>
      </section>

      {/* ── RockResin parallax gallery ── */}
      <section className="wg-gallery">
        <div style={{ maxWidth: 720, margin: '0 auto clamp(22px,3vw,36px)', textAlign: 'center', padding: '0 24px' }}>
          <motion.p className="wg-eyebrow" {...fade()}>RockResin™ × WTF</motion.p>
          <motion.h2 className="wg-h2" {...fade(0.08)}>The Resin Ritual</motion.h2>
        </div>
        <ParallaxRow images={ROCKRESIN_ASSETS} direction="left" />
      </section>

      {/* ── Shahjeet parallax gallery ── */}
      <section className="wg-gallery">
        <div style={{ maxWidth: 720, margin: '0 auto clamp(22px,3vw,36px)', textAlign: 'center', padding: '0 24px' }}>
          <motion.p className="wg-eyebrow" {...fade()}>Shahjeet™ × WTF</motion.p>
          <motion.h2 className="wg-h2" {...fade(0.08)}>Tear. Squeeze. Perform.</motion.h2>
        </div>
        <ParallaxRow images={SHAHJEET_ASSETS} direction="right" />
      </section>

      {/* ── Trust strip ── */}
      <section className="wg-trust">
        <div className="wg-trust-pills">
          {TRUST_PILLS.map((t) => (
            <span key={t} className="wg-trust-pill">✓ {t}</span>
          ))}
        </div>
      </section>

      {/* ── 3 CTA buttons ── */}
      <section className="wg-cta">
        <div style={{ maxWidth: 720, margin: '0 auto clamp(28px,4vw,44px)' }}>
          <motion.p className="wg-eyebrow" {...fade()}>Start Your Ritual</motion.p>
          <motion.h2 className="wg-h2" {...fade(0.08)}>Choose Your Path</motion.h2>
        </div>
        <div className="wg-cta-grid">
          {CTAS.map((c, i) => (
            <motion.div key={c.name} {...fade(i * 0.08)}>
              <Link href={c.href} className="wg-cta-card">
                <span className="wg-cta-icon">{c.icon}</span>
                <h3 className="wg-cta-name">{c.name}</h3>
                <p className="wg-cta-desc">{c.desc}</p>
                <span className="wg-cta-btn">{c.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="wg-foot">
        <p>3TATTAVA × WTF Gyms · <a href="https://www.3tattava.com">3tattava.com</a> · Performance Ayurveda for Modern Humans</p>
      </footer>
    </div>
  );
}
