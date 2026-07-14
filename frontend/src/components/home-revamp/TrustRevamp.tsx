'use client';
import { media } from "@/lib/media";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import RevealHeading from '@/components/ui/RevealHeading';

const F = 'var(--font-primary), system-ui, sans-serif';
const INK = '#442a1b';
const GOLD = '#cd872a';

interface TrustCard {
  icon: string;
  title: string;
  description: string;
}

const trustCards: TrustCard[] = [
  {
    icon: media("/icons/leaf.svg"),
    title: 'Authentic Ingredients',
    description:
      'Sourced with care to preserve their natural purity, potency, and nutritional value.',
  },
  {
    icon: media("/icons/shield-check.svg"),
    title: 'Quality Assured',
    description:
      'Every batch is carefully tested and manufactured to meet the highest quality standards.',
  },
  {
    icon: media("/icons/herb.svg"),
    title: 'Triphala Purified',
    description:
      'Purified using the traditional Triphala Shodhana process — staying true to Ayurvedic practice.',
  },
  {
    icon: media("/icons/lab-certificate.svg"),
    title: 'Ayurvedacharya Formulated',
    description:
      'Formulated by an Ayurvedacharya — quality assured and third-party lab tested.',
  },
];

/* Responsive layout + reduced-motion — injected verbatim (no entity escaping). */
const TRUST_CSS = `
  .trust-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(20px, 3vw, 44px);
    justify-items: center;
    align-items: center;
    max-width: 1180px;
    margin: 0 auto;
  }
  .trust-circle {
    width: clamp(170px, 20vw, 236px);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 34%, #ffffff 0%, #fbf5e9 100%);
    border: 1px solid rgba(205,135,42,0.35);
    box-shadow: 0 14px 44px rgba(68,42,27,0.14), inset 0 0 0 6px rgba(255,255,255,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 clamp(22px, 3vw, 34px);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .trust-circle:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 56px rgba(68,42,27,0.2), inset 0 0 0 6px rgba(255,255,255,0.7);
    border-color: rgba(205,135,42,0.6);
  }
  @media (max-width: 1040px) {
    .trust-grid { grid-template-columns: repeat(2, 1fr); max-width: 560px; gap: 32px; }
    .trust-threads { display: none; }
  }
  @media (max-width: 560px) {
    .trust-grid { grid-template-columns: 1fr; gap: 28px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .trust-circle { transition: none; }
  }
`;

function TrustCircle({ card, index }: { card: TrustCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="trust-circle"
      initial={{ opacity: 0, y: 44, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 44, scale: 0.92 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.icon} alt="" aria-hidden width={44} height={44} style={{ marginBottom: 14 }} />
      <h3
        style={{
          fontFamily: F,
          fontSize: 'clamp(14px, 1.6vw, 17px)',
          fontWeight: 700,
          color: INK,
          margin: '0 0 8px',
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          fontFamily: F,
          fontSize: 'clamp(11px, 1.15vw, 12.5px)',
          lineHeight: 1.5,
          color: INK,
          opacity: 0.76,
          margin: 0,
          maxWidth: '94%',
        }}
      >
        {card.description}
      </p>
    </motion.div>
  );
}

export default function TrustRevamp() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const threadsRef = useRef<HTMLDivElement>(null);
  const threadsInView = useInView(threadsRef, { once: true, margin: '-40px' });

  return (
    <section
      ref={sectionRef}
      id="trust"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#f7f0e2',
        padding: '6rem 1.5rem',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: TRUST_CSS }} />

      {/* Background flatlay image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media("/hero/trust-flatlay.png")}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '3.25rem' }}
        >
          <RevealHeading
            as="h2"
            style={{
              fontFamily: F,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: INK,
              marginBottom: '1rem',
            }}
            lines={['Rooted in Trust']}
          />
          <p
            style={{
              fontFamily: F,
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: 1.8,
              color: INK,
              opacity: 0.8,
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            We believe in authentic ingredients and uncompromising quality — honouring
            ancient Ayurvedic wisdom with modern standards you can trust.
          </p>
        </motion.div>

        {/* Circle cards */}
        <div className="trust-grid">
          {trustCards.map((card, i) => (
            <TrustCircle key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Threads converging from each circle to the CTA */}
        <div
          ref={threadsRef}
          className="trust-threads"
          style={{ position: 'relative', height: 'clamp(58px, 7vw, 92px)' }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="trust-thread" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(205,135,42,0.12)" />
                <stop offset="1" stopColor="rgba(205,135,42,0.8)" />
              </linearGradient>
            </defs>
            {[12.5, 37.5, 62.5, 87.5].map((x, i) => (
              <motion.path
                key={x}
                d={`M ${x} 0 C ${x} 58, 50 42, 50 100`}
                fill="none"
                stroke="url(#trust-thread)"
                strokeWidth={1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  threadsInView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={threadsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <a
            href="/lab-reports"
            style={{
              fontFamily: F,
              display: 'inline-block',
              padding: '0.9rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#f7f0e2',
              background: INK,
              border: 'none',
              borderRadius: 50,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(68,42,27,0.22)',
              transition: 'background 0.25s, transform 0.25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = GOLD;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            View Both Lab Reports →
          </a>
          <p style={{ fontFamily: F, fontSize: '0.82rem', color: INK, opacity: 0.66, margin: '0.95rem auto 0', maxWidth: 440, lineHeight: 1.55 }}>
            See the NABL 3rd-party lab reports for both <strong style={{ fontWeight: 600 }}>RockResin</strong> &amp; <strong style={{ fontWeight: 600 }}>Shahjeet Sticks</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
