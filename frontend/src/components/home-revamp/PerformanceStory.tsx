'use client';
import { media } from "@/lib/media";

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import RevealHeading from '@/components/ui/RevealHeading';

/* ─── Type system ─── */
const F = 'var(--font-primary), system-ui, sans-serif';
const DISPLAY = "var(--font-display, 'Fraunces', Georgia, serif)";

/* ─── Palette ─── */
const INK = '#442a1b';
const GOLD = '#cd872a';
const CREAM = '#f7f0e2';
const TAUPE = '#8a7663';
const DARK = '#1c1304';

interface Panel {
  n: string;
  label: string;
  heading: string;
  body: string;
  meta?: string;
  quote?: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide: 'left' | 'right';
  media: { type: 'image'; src: string; alt: string; fit?: 'cover' | 'contain' };
}

const PANELS: Panel[] = [
  {
    n: '01',
    label: 'Performance In Your Pocket',
    heading: 'Shahjeet Sticks',
    body:
      '600mg of purified Himalayan Shilajit in every honey stick. Tear, squeeze, perform —\na 10-second daily ritual for strength, stamina and vitality.',
    meta: '30 Sticks · 600mg · Honey-Infused · ₹1,399',
    ctaLabel: 'Shop Shahjeet Sticks',
    ctaHref: '/products/shahjeet-sticks',
    imageSide: 'left',
    media: { type: 'image', src: "https://media.3tattava.com/products/3-Tattava+A%2B-02S.png", alt: '3Tattava Shahjeet Sticks honey sachets', fit: 'contain' },
  },
  {
    n: '02',
    label: 'One Resin Complete Vitality',
    heading: 'RockResin',
    body:
      'Classically Purified Through Triphala — an authentic Himalayan Shilajit resin.\nAn ancient mineral elixir for modern energy, strength and longevity.',
    meta: 'Classically Purified Shilajit Resin',
    ctaLabel: 'Discover RockResin',
    ctaHref: '/products/shodhit-shilajit-resin',
    imageSide: 'right',
    media: { type: 'image', src: media("/home/homepage-rockresins.png"), alt: '3Tattava RockResin — Classically Purified Shilajit resin canister, jar and raw resin' },
  },
];

/* Responsive, alternating layout — injected verbatim (no entity escaping). */
const STORY_CSS = `
  .pstory-panel {
    display: flex;
    align-items: stretch;
    gap: clamp(16px, 2vw, 36px);
    min-height: clamp(560px, 86vh, 880px);
  }
  .pstory-panel.pstory-right { flex-direction: row-reverse; }
  .pstory-media {
    flex: 1 1 50%;
    position: relative;
    overflow: hidden;
    background: ${DARK};
  }
  .pstory-copy {
    flex: 1 1 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(28px, 4vw, 52px);
    background: ${CREAM};
  }
  @media (max-width: 900px) {
    .pstory-panel, .pstory-panel.pstory-right { flex-direction: column; min-height: 0; }
    .pstory-media { flex: none; width: 100%; height: 58vh; min-height: 320px; }
    .pstory-copy { flex: none; width: 100%; padding: clamp(36px, 8vw, 60px) clamp(24px, 6vw, 44px); }
  }
`;

/* ─── Scroll-zoomed media (Ken Burns) ─── */
function PanelMedia({ media }: { media: Panel['media'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.22, 1.06]);

  return (
    <div className="pstory-media" ref={ref} style={{ background: media.fit === 'contain' ? '#ffffff' : undefined }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={media.src}
        alt={media.alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: media.fit ?? 'cover',
          padding: media.fit === 'contain' ? 'clamp(32px, 5vw, 80px)' : 0,
          display: 'block',
          scale: reduce || media.fit === 'contain' ? 1 : scale,
        }}
      />
      {/* subtle inner vignette for text-edge legibility (cover photos only) */}
      {media.fit !== 'contain' && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(28,19,4,0.15), transparent 30%, transparent 70%, rgba(28,19,4,0.15))',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

/* ─── One editorial panel ─── */
function StoryPanel({ panel }: { panel: Panel }) {
  const copyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(copyRef, { once: true, margin: '-120px' });
  const reduce = useReducedMotion();

  const fromX = panel.imageSide === 'left' ? 40 : -40;
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: inView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  });

  return (
    <div className={`pstory-panel${panel.imageSide === 'right' ? ' pstory-right' : ''}`}>
      <PanelMedia media={panel.media} />

      <motion.div
        className="pstory-copy"
        ref={copyRef}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: fromX }}
        animate={inView ? { opacity: 1, x: 0 } : reduce ? { opacity: 0 } : { opacity: 0, x: fromX }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
          {/* Label with rule */}
          <motion.div
            {...rise(0)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}
          >
            <span
              style={{
                fontFamily: F,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: GOLD,
              }}
            >
              {panel.label}
            </span>
          </motion.div>

          {/* Heading */}
          <RevealHeading
            as="h2"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(26px, 3.8vw, 46px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: INK,
              margin: '0 0 20px',
            }}
            lines={panel.heading.split('\n')}
          />

          {/* Body */}
          <motion.p
            {...rise(0.16)}
            style={{
              fontFamily: F,
              fontSize: 'clamp(13px, 1.3vw, 14px)',
              lineHeight: 1.6,
              color: 'rgba(68,42,27,0.78)',
              margin: '0 0 20px',
              whiteSpace: 'pre-line',
            }}
          >
            {panel.body}
          </motion.p>

          {/* Quote */}
          {panel.quote && (
            <motion.p
              {...rise(0.22)}
              style={{
                fontFamily: DISPLAY,
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.6vw, 19px)',
                lineHeight: 1.6,
                color: INK,
                borderLeft: `2px solid ${GOLD}`,
                paddingLeft: 18,
                margin: '0 0 24px',
              }}
            >
              {panel.quote}
            </motion.p>
          )}

          {/* Meta */}
          {panel.meta && (
            <motion.p
              {...rise(0.26)}
              style={{
                fontFamily: F,
                fontSize: 12.5,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TAUPE,
                margin: '0 0 28px',
              }}
            >
              {panel.meta}
            </motion.p>
          )}

          {/* CTA */}
          <motion.div {...rise(0.32)}>
            <Link
              href={panel.ctaHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: F,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: GOLD,
                border: `1.5px solid ${GOLD}`,
                borderRadius: 50,
                padding: '13px 30px',
                textDecoration: 'none',
                transition: 'background 0.25s ease, color 0.25s ease, transform 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = DARK;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = GOLD;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {panel.ctaLabel} <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PerformanceStory() {
  const introRef = useRef<HTMLDivElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: introInView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.7, delay, ease: 'easeOut' as const },
  });

  return (
    <section aria-label="The 3Tattava collection" style={{ background: CREAM }}>
      <style dangerouslySetInnerHTML={{ __html: STORY_CSS }} />

      {/* ── Intro ── */}
      <div
        ref={introRef}
        style={{
          textAlign: 'center',
          maxWidth: 760,
          margin: '0 auto',
          padding: 'clamp(72px, 10vw, 128px) 24px clamp(48px, 6vw, 80px)',
        }}
      >
        <motion.p
          {...rise(0)}
          style={{
            fontFamily: F,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: GOLD,
            margin: '0 0 18px',
          }}
        >
          The 3Tattava Collection
        </motion.p>
        <RevealHeading
          as="h2"
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(34px, 6vw, 68px)',
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            color: INK,
            margin: '0 0 18px',
          }}
          lines={['Crafted for', 'Real Performance']}
        />
        <motion.p
          {...rise(0.16)}
          style={{
            fontFamily: F,
            fontSize: 'clamp(15px, 1.9vw, 19px)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(68,42,27,0.7)',
            margin: 0,
          }}
        >
          Two doctor-formulated rituals, crafted for modern performance.
        </motion.p>
      </div>

      {/* ── Alternating scroll panels ── */}
      {PANELS.map((panel) => (
        <StoryPanel key={panel.n} panel={panel} />
      ))}
    </section>
  );
}
