'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { media } from '@/lib/media';

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Palette ─── */
const CREAM = '#f7f0e2';
const INK = '#1c1304';
const ESPRESSO = '#442a1b';
const GOLD = '#C8963E';
const FOREST = '#1e3a2f';

/* ─── Asset URLs ───
   REPLACE these with the real WTF × 3Tattava collab assets once provided.
   Hero video/image, gym footage, product shots at the gym, etc. */
const HERO_VIDEO = media("/videos/shahjeet-reveal.mp4"); // placeholder — replace with WTF collab hero video
const HERO_POSTER = media("/hero/himalaya-bg.png"); // placeholder — replace with WTF collab hero image

/* Gallery images — replace with real collab photos (product in gym, standees, athletes) */
const GALLERY = [
  { src: "https://media.3tattava.com/products/rockresin/1.png", alt: "RockResin at WTF Gym" },
  { src: "https://media.3tattava.com/products/tgftcf%201.png", alt: "Shahjeet Sticks at WTF Gym" },
  { src: "https://media.3tattava.com/products/Boxess%20copy%201.png", alt: "3Tattava Bundle Pack" },
];

/* Collab videos — replace with real gym/athlete testimonial videos */
const VIDEOS: string[] = [
  // Add MP4 URLs here: media("/wtf-gym/athlete-testimonial-1.mp4"), etc.
];

const CSS = `
  .wg-page { background: ${CREAM}; min-height: 100vh; font-family: ${F}; color: ${INK}; }

  /* Hero */
  .wg-hero { position: relative; width: 100%; min-height: 80vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .wg-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
  .wg-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,19,4,0.35), rgba(28,19,4,0.82)); z-index: 1; }
  .wg-hero-content { position: relative; z-index: 2; text-align: center; padding: clamp(80px,12vw,140px) 24px clamp(48px,8vw,80px); max-width: 800px; }
  .wg-hero-eyebrow { font-size: clamp(10px,1.4vw,13px); font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 18px; }
  .wg-hero-title { font-variation-settings: 'wght' 800; font-size: clamp(32px,7vw,64px); line-height: 1.06; letter-spacing: -0.02em; color: #f7f0e2; margin: 0 0 18px; }
  .wg-hero-sub { font-size: clamp(15px,2vw,20px); line-height: 1.55; color: rgba(247,240,226,0.82); font-weight: 300; margin: 0 auto; max-width: 540px; }
  .wg-hero-collab { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 28px; }
  .wg-hero-x { font-size: 20px; color: ${GOLD}; font-weight: 300; }

  /* About section */
  .wg-about { padding: clamp(56px,8vw,96px) 24px; text-align: center; }
  .wg-about-inner { max-width: 720px; margin: 0 auto; }
  .wg-section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 14px; }
  .wg-section-title { font-variation-settings: 'wght' 800; font-size: clamp(24px,4.5vw,40px); letter-spacing: -0.01em; color: ${ESPRESSO}; margin: 0 0 18px; line-height: 1.12; }
  .wg-section-body { font-size: clamp(15px,1.8vw,17px); line-height: 1.7; color: rgba(68,42,27,0.78); font-weight: 300; margin: 0; }

  /* Gallery */
  .wg-gallery { padding: 0 24px clamp(56px,8vw,96px); }
  .wg-gallery-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%), 1fr)); gap: 20px; }
  .wg-gallery-card { border-radius: 18px; overflow: hidden; background: ${ESPRESSO}; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; padding: 28px; }
  .wg-gallery-card img { width: 100%; height: 100%; object-fit: contain; display: block; }

  /* Videos */
  .wg-videos { padding: 0 24px clamp(56px,8vw,96px); }
  .wg-videos-grid { max-width: 800px; margin: 0 auto; display: grid; gap: 20px; }
  .wg-vid { width: 100%; border-radius: 18px; aspect-ratio: 16/9; background: ${ESPRESSO}; }

  /* Trust strip */
  .wg-trust { padding: clamp(32px,5vw,52px) 24px; background: ${FOREST}; text-align: center; }
  .wg-trust-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: 800px; margin: 0 auto; }
  .wg-trust-pill { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${GOLD}; border: 1px solid rgba(200,150,62,0.35); padding: 8px 18px; border-radius: 999px; }

  /* CTA section */
  .wg-cta { padding: clamp(56px,8vw,96px) 24px; text-align: center; background: ${CREAM}; }
  .wg-cta-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px,100%), 1fr)); gap: 18px; }
  .wg-cta-card { display: flex; flex-direction: column; align-items: center; padding: clamp(28px,4vw,42px) 24px; background: #fff; border: 1px solid rgba(200,150,62,0.22); border-radius: 18px; box-shadow: 0 10px 30px rgba(68,42,27,0.06); text-decoration: none; color: inherit; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .wg-cta-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(68,42,27,0.14); }
  .wg-cta-icon { font-size: 36px; margin-bottom: 16px; }
  .wg-cta-name { font-variation-settings: 'wght' 800; font-size: clamp(18px,2.5vw,22px); color: ${ESPRESSO}; margin: 0 0 8px; }
  .wg-cta-desc { font-size: 14px; color: rgba(68,42,27,0.6); font-weight: 300; line-height: 1.5; margin: 0 0 20px; }
  .wg-cta-btn { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${CREAM}; background: ${ESPRESSO}; padding: 13px 28px; border-radius: 999px; margin-top: auto; }
  .wg-cta-card:nth-child(3) .wg-cta-btn { background: ${GOLD}; color: ${INK}; }

  /* Footer */
  .wg-footer { padding: 28px 24px; text-align: center; border-top: 1px solid rgba(200,150,62,0.18); }
  .wg-footer-text { font-size: 12px; color: rgba(68,42,27,0.4); }
  .wg-footer-text a { color: ${GOLD}; text-decoration: none; }
  .wg-footer-text a:hover { text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) { .wg-hero-video { display: none; } }
`;

const TRUST_PILLS = [
  "NABL Lab-Tested",
  "AYUSH-GMP Certified",
  "Doctor Formulated",
  "≥70% Fulvic Acid",
  "Himalayan Sourced",
  "Available at 28 WTF Gyms",
];

const CTAS = [
  {
    icon: "🍯",
    name: "Shahjeet Sticks",
    desc: "600mg Shilajit in honey. Tear, squeeze, perform — the perfect gym companion.",
    href: "/products/shahjeet-sticks",
    label: "Shop Shahjeet →",
  },
  {
    icon: "🏔️",
    name: "RockResin",
    desc: "Pure Himalayan Shilajit resin. The original daily ritual for serious athletes.",
    href: "/products/shodhit-shilajit-resin",
    label: "Shop RockResin →",
  },
  {
    icon: "📍",
    name: "Find a Center",
    desc: "Explore 3Tattava experience centers and WTF gym locations near you.",
    href: "/find-us",
    label: "Explore Locations →",
  },
];

export default function WtfGymClient() {
  const reduce = useReducedMotion();
  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="wg-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Hero ── */}
      <section className="wg-hero">
        <video
          className="wg-hero-video"
          autoPlay muted loop playsInline preload="auto"
          poster={HERO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="wg-hero-overlay" aria-hidden="true" />
        <div className="wg-hero-content">
          <motion.div className="wg-hero-collab" {...fade()}>
            <Image src="/logos/3tattava-wordmark.png" alt="3Tattava" width={160} height={40} style={{ height: 32, width: 'auto' }} />
            <span className="wg-hero-x">×</span>
            <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 'clamp(18px,3vw,26px)', color: '#f7f0e2', letterSpacing: '0.04em' }}>
              WTF GYMS
            </span>
          </motion.div>
          <motion.p className="wg-hero-eyebrow" {...fade(0.1)}>Exclusive Gym Partnership</motion.p>
          <motion.h1 className="wg-hero-title" {...fade(0.15)}>
            Performance Ayurveda<br />Meets Fitness
          </motion.h1>
          <motion.p className="wg-hero-sub" {...fade(0.2)}>
            Doctor-formulated Himalayan Shilajit — now available at your WTF gym. 
            Fuel your ritual. Elevate your training.
          </motion.p>
        </div>
      </section>

      {/* ── About the collab ── */}
      <section className="wg-about">
        <div className="wg-about-inner">
          <motion.p className="wg-section-eyebrow" {...fade()}>The Partnership</motion.p>
          <motion.h2 className="wg-section-title" {...fade(0.08)}>
            Why WTF × 3Tattava
          </motion.h2>
          <motion.p className="wg-section-body" {...fade(0.14)}>
            3Tattava brings Performance Ayurveda to where it matters most — your gym. 
            NABL lab-tested, doctor-formulated Shilajit products available exclusively 
            at 28 WTF gym locations across Delhi NCR. No spoon. No mess. Just 
            performance — the way Ayurveda was meant to be.
          </motion.p>
        </div>
      </section>

      {/* ── Product gallery (replace images with real collab assets) ── */}
      <section className="wg-gallery">
        <div className="wg-gallery-grid">
          {GALLERY.map((img, i) => (
            <motion.div key={img.alt} className="wg-gallery-card" {...fade(i * 0.08)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Collab videos (shows only if VIDEO URLs are provided) ── */}
      {VIDEOS.length > 0 && (
        <section className="wg-videos">
          <div className="wg-about-inner" style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>
            <motion.p className="wg-section-eyebrow" {...fade()}>See It In Action</motion.p>
            <motion.h2 className="wg-section-title" {...fade(0.08)}>From the Gym Floor</motion.h2>
          </div>
          <div className="wg-videos-grid">
            {VIDEOS.map((src, i) => (
              <motion.video
                key={src}
                className="wg-vid"
                controls
                playsInline
                preload="metadata"
                muted
                {...fade(i * 0.1)}
              >
                <source src={src} type="video/mp4" />
              </motion.video>
            ))}
          </div>
        </section>
      )}

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
        <div className="wg-about-inner" style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>
          <motion.p className="wg-section-eyebrow" {...fade()}>Start Your Ritual</motion.p>
          <motion.h2 className="wg-section-title" {...fade(0.08)}>Choose Your Path</motion.h2>
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
      <footer className="wg-footer">
        <p className="wg-footer-text">
          3TATTAVA × WTF Gyms · <a href="https://www.3tattava.com">3tattava.com</a> · Performance Ayurveda for Modern Humans
        </p>
      </footer>
    </div>
  );
}
