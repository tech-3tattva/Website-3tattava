'use client';
import { media } from "@/lib/media";

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { Droplet, Sparkles, Leaf, ShieldCheck, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import RevealHeading from '@/components/ui/RevealHeading';

const F = 'var(--font-primary), system-ui, sans-serif';
const INK = '#442a1b';
const GOLD = '#cd872a';
const CREAM = '#f7f0e2';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/* Clickable product hotspots over the poster */
const HOTSPOT_CSS = `
  .pstory-hotspot {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 7%;
    text-decoration: none;
    cursor: pointer;
    z-index: 2;
  }
  .pstory-hotspot::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 75% at 50% 100%, rgba(205,135,42,0.18), transparent 62%);
    opacity: 0;
    transition: opacity 0.32s ease;
    pointer-events: none;
  }
  .pstory-hotspot:hover::after { opacity: 1; }
  .pstory-cta {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #1c1304;
    background: linear-gradient(135deg, #cd872a 0%, #e8b86d 50%, #cd872a 100%);
    padding: 13px 26px;
    border-radius: 50px;
    box-shadow: 0 12px 30px rgba(68,42,27,0.32);
    opacity: 0;
    transform: translateY(16px) scale(0.95);
    transition: opacity 0.32s ease, transform 0.32s ease;
    white-space: nowrap;
  }
  .pstory-hotspot:hover .pstory-cta {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  @media (max-width: 640px) {
    .pstory-cta { font-size: 12px; padding: 10px 18px; }
  }
`;

/* Product proof-points — sourced from the packaging / product spec */
const BENEFITS: { icon: LucideIcon; label: string }[] = [
  { icon: Droplet, label: '70%+ Fulvic Acid' },
  { icon: Sparkles, label: '80+ Trace Minerals' },
  { icon: Leaf, label: 'Triphala Purified' },
  { icon: ShieldCheck, label: 'NABL Lab-Tested' },
];

function BenefitItem({
  icon: Icon,
  label,
  index,
  inView,
  reduce,
}: {
  icon: LucideIcon;
  label: string;
  index: number;
  inView: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center',
        width: 160,
      }}
    >
      <motion.div
        animate={reduce ? {} : { y: [0, -7, 0] }}
        transition={reduce ? {} : { repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: index * 0.3 }}
        whileHover={{ scale: 1.08 }}
        style={{
          width: 92,
          height: 92,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 38% 30%, #ffffff 0%, #f4e9d4 100%)',
          border: '1.5px solid rgba(205,135,42,0.45)',
          boxShadow: '0 10px 28px rgba(205,135,42,0.18), inset 0 1px 0 rgba(255,255,255,0.8)',
          color: GOLD,
          cursor: 'default',
        }}
      >
        <Icon size={40} strokeWidth={1.7} />
      </motion.div>
      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: INK, lineHeight: 1.35 }}>
        {label}
      </span>
    </motion.div>
  );
}

export default function TrinityPosterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const stripRef = useRef<HTMLDivElement>(null);
  const stripInView = useInView(stripRef, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-label="The 3Tattava rituals"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: CREAM,
        padding: 'clamp(72px, 10vw, 128px) 24px',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
        {/* ── Heading ── */}
        <RevealHeading
          as="h2"
          style={{
            fontFamily: F,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: GOLD,
            textAlign: 'center',
            margin: '0 0 18px',
          }}
          lines={['Featured Products']}
        />

        {/* ── Section tagline ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
          style={{
            fontFamily: F,
            fontSize: 'clamp(20px, 2.8vw, 30px)',
            fontWeight: 700,
            lineHeight: 1.4,
            color: INK,
            textAlign: 'center',
            maxWidth: 860,
            margin: '0 auto',
          }}
        >
          Ancient Rasayan Wisdom, Modern Scientific Validation — Doctor Formulated
          Rituals Designed to Elevate Everyday Performance.
        </motion.p>

        {/* ── Sub-line ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          style={{
            fontFamily: F,
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            fontWeight: 500,
            lineHeight: 1.6,
            color: INK,
            opacity: 0.8,
            textAlign: 'center',
            maxWidth: 680,
            margin: '14px auto 0',
          }}
        >
          Every 3Tattava Ritual is Lab Verified, Doctor Formulated for Real
          Everyday Performance.
        </motion.p>

        {/* ── Product poster (static) ── */}
        <div
          style={{
            position: 'relative',
            width: 'min(720px, 92vw)',
            margin: 'clamp(36px, 6vw, 64px) auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={media("/home/trinity-poster-v2.png")}
            alt="3Tattava Shahjeet Sticks and RockResin Shilajit"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          {/* Clickable product hotspots with hover CTA */}
          <style dangerouslySetInnerHTML={{ __html: HOTSPOT_CSS }} />
          <Link href="/products/shahjeet-sticks" className="pstory-hotspot" style={{ left: 0, width: '50%' }} aria-label="Shop Shahjeet Sticks">
            <span className="pstory-cta">Shop Shahjeet Sticks →</span>
          </Link>
          <Link href="/products/shodhit-shilajit-resin" className="pstory-hotspot" style={{ left: '50%', width: '50%' }} aria-label="Discover RockResin">
            <span className="pstory-cta">Discover RockResin →</span>
          </Link>
        </div>

        {/* ── Ritual phrases — text microanimation ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={stripInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(16px, 4vw, 48px)',
            margin: 'clamp(48px, 6vw, 72px) auto 0',
            fontFamily: F,
            fontSize: 'clamp(15px, 1.8vw, 19px)',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: INK,
          }}
        >
          {[
            ['Tear', 'Squeeze', 'Perform'],
            ['Dip', 'Hook', 'Swirl'],
          ].map((steps, row) => (
            <span key={row} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {steps.map((word, i) => (
                <span key={word} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <span style={{ color: GOLD }}>·</span>}
                  <motion.span
                    animate={reduce ? {} : { opacity: [0.55, 1, 0.55] }}
                    transition={reduce ? {} : { repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: row * 0.4 + i * 0.4 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>

        {/* ── Benefit strip — animated icons ── */}
        <div
          ref={stripRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(20px, 3vw, 40px)',
            marginTop: 'clamp(56px, 8vw, 112px)',
          }}
        >
          {BENEFITS.map((b, i) => (
            <BenefitItem key={b.label} icon={b.icon} label={b.label} index={i} inView={stripInView} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
