'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Icon } from '@iconify/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/* ─── Type system ─── */
const F = 'var(--font-primary), system-ui, sans-serif';
const DEVA = "var(--font-devanagari), var(--font-primary), 'Noto Serif Devanagari', serif";

/* ─── Palette (campaign) ─── */
const FOREST = '#1e3a2f'; // deep forest green
const IVORY = '#f7f0e2'; // ivory
const CREAM = '#efe4cf'; // warm cream
const GOLD = '#C8963E'; // antique gold
const GOLD_DEEP = '#cd872a'; // antique gold (deep)
const SAFFRON = '#d98a3d'; // muted saffron
const INK = '#1c1304'; // ink

const EASE = [0.16, 1, 0.3, 1] as const;

/* Decorative wellness loop — verified reachable; gracefully falls back to a
   framer-motion lotus motif if it ever fails to load (never a broken player). */
const LOTTIE_SRC =
  'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie';

/* ─── Content (EXACT — institutional campaign; do not alter) ─── */
const KEY_FACTS: { icon: string; text: string }[] = [
  { icon: 'mdi:calendar-heart', text: '3–8 August 2026' },
  {
    icon: 'mdi:map-marker',
    text:
      'Official Camp Site of Shiva Kanwara Sewa Sangh, Shahdara · Near Jhilmil Metro Station, Shahdara–GT Road, Delhi',
  },
  { icon: 'mdi:hand-heart', text: 'Free for all Kanwar Yatris' },
];

const SERVICES: { icon: string; label: string }[] = [
  { icon: 'healthicons:doctor-outline', label: 'Free Ayurvedic consultation' },
  { icon: 'mdi:medical-bag', label: 'Essential Ayurvedic medicines' },
  { icon: 'mdi:medical-cotton-swab', label: 'First aid' },
  { icon: 'mdi:bandage', label: 'Foot blister & minor wound care' },
  { icon: 'mdi:arm-flex', label: 'Muscular fatigue & body-pain support' },
  { icon: 'mdi:stomach', label: 'Digestive complaint management' },
  { icon: 'healthicons:lungs', label: 'Throat & respiratory support' },
  { icon: 'mdi:cup-water', label: 'Hydration & heat-illness prevention' },
  { icon: 'mdi:book-open-variant', label: 'Preventive health education' },
  { icon: 'mdi:ambulance', label: 'Emergency / red-flag referral' },
];

const DAYS = ['3', '4', '5', '6', '7', '8'];

const INSTITUTIONS = [
  'CBPACS, New Delhi',
  'FIMS, SGT University, Gurugram',
  'Premadhara Ayurveda Research Center, Rohini',
];

/* ─── Responsive layout + reduced-motion — injected verbatim (no entity escaping). ─── */
const KANWAR_CSS = `
  .kanwar-section {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(1200px 620px at 78% -8%, rgba(200,150,62,0.10), transparent 60%),
      radial-gradient(900px 520px at 8% 4%, rgba(30,58,47,0.06), transparent 60%),
      linear-gradient(180deg, ${IVORY} 0%, ${CREAM} 100%);
    color: ${INK};
    font-family: ${F};
  }
  .kanwar-wrap {
    position: relative;
    z-index: 2;
    max-width: 1120px;
    margin: 0 auto;
    padding: clamp(72px, 9vw, 128px) clamp(20px, 5vw, 40px) clamp(40px, 6vw, 72px);
  }
  .kanwar-facts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(16px, 2.4vw, 28px);
    margin-top: clamp(34px, 5vw, 56px);
  }
  .kanwar-services {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: clamp(14px, 1.6vw, 20px);
  }
  .kanwar-card {
    background: linear-gradient(180deg, #ffffff 0%, #fbf5e9 100%);
    border: 1px solid rgba(200,150,62,0.30);
    border-radius: 18px;
    padding: clamp(18px, 2vw, 26px) clamp(12px, 1.4vw, 18px);
    text-align: center;
    box-shadow: 0 12px 30px rgba(28,19,4,0.07);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .kanwar-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 46px rgba(28,19,4,0.14);
    border-color: rgba(200,150,62,0.6);
  }
  .kanwar-timeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: clamp(8px, 1.2vw, 18px);
    position: relative;
  }
  .kanwar-support {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: clamp(24px, 4vw, 56px);
    align-items: stretch;
  }
  .kanwar-close-contacts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: clamp(16px, 3vw, 42px);
  }
  @media (max-width: 900px) {
    .kanwar-facts { grid-template-columns: 1fr; }
    .kanwar-services { grid-template-columns: repeat(3, 1fr); }
    .kanwar-support { grid-template-columns: 1fr; }
  }
  @media (max-width: 620px) {
    .kanwar-services { grid-template-columns: repeat(2, 1fr); }
    .kanwar-timeline { grid-template-columns: repeat(3, 1fr); row-gap: 16px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .kanwar-card { transition: none; }
  }
`;

/* ─── Motion helpers ─── */
function useRise() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay, ease: EASE },
  });
}

function useStagger(): { container: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
    },
    item: {
      hidden: { opacity: 0, y: reduce ? 0 : 22 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    },
  };
}

/* ─── Pulsing eyebrow dot ─── */
function PulseDot() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      style={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: SAFFRON,
        boxShadow: `0 0 0 0 rgba(217,138,61,0.55)`,
        display: 'inline-block',
      }}
      animate={
        reduce
          ? undefined
          : {
              scale: [1, 1.35, 1],
              boxShadow: [
                '0 0 0 0 rgba(217,138,61,0.55)',
                '0 0 0 8px rgba(217,138,61,0)',
                '0 0 0 0 rgba(217,138,61,0)',
              ],
            }
      }
      transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ─── Graceful decorative Lottie (lotus / wellness loop) ───
   Renders an always-present framer-motion lotus motif; the Lottie fades in ONLY
   on a successful load and is removed on any load error — so the box is never a
   broken/empty player. */
function LotusDecoration() {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: 'clamp(150px, 24vw, 220px)',
        height: 'clamp(150px, 24vw, 220px)',
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Always-present, on-brand fallback motif (gentle breathing lotus) */}
      <motion.svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: loaded && !failed ? 0 : 0.85, transition: 'opacity 0.6s ease' }}
        animate={reduce ? undefined : { scale: [1, 1.06, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <g fill="none" stroke={GOLD} strokeWidth="1.4" opacity="0.9">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse
              key={a}
              cx="100"
              cy="100"
              rx="20"
              ry="52"
              transform={`rotate(${a} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="14" stroke={SAFFRON} />
          <circle cx="100" cy="100" r="66" stroke={FOREST} opacity="0.35" />
        </g>
      </motion.svg>

      {/* Real Lottie overlay — fades in only when it loads successfully */}
      {!failed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: loaded ? 0.85 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <DotLottieReact
            src={LOTTIE_SRC}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
            dotLottieRefCallback={(dl) => {
              if (!dl) return;
              dl.addEventListener('load', () => setLoaded(true));
              dl.addEventListener('loadError', () => setFailed(true));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function KanwarSevaSection() {
  const rise = useRise();
  const { container, item } = useStagger();
  const reduce = useReducedMotion();

  /* ── Parallax background motif ── */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const motifY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-70, 90]);
  const motifY2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -80]);

  return (
    <section
      ref={sectionRef}
      className="kanwar-section"
      aria-label="Indraprastha Kanwar Swasthya Seva Yatra 2026 — Ayurveda Health Camp"
    >
      <style dangerouslySetInnerHTML={{ __html: KANWAR_CSS }} />

      {/* ── Parallax decorative motifs (translateY on scroll) ── */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          top: '4%',
          right: '-6%',
          width: 'min(46vw, 560px)',
          height: 'min(46vw, 560px)',
          y: motifY,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 50%, rgba(200,150,62,0.14), transparent 62%)',
          borderRadius: '50%',
        }}
      />
      <motion.svg
        aria-hidden
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '-5%',
          width: 'min(38vw, 440px)',
          height: 'min(38vw, 440px)',
          y: motifY2,
          zIndex: 1,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        <g fill="none" stroke={FOREST} strokeWidth="1">
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <ellipse key={a} cx="100" cy="100" rx="26" ry="72" transform={`rotate(${a} 100 100)`} />
          ))}
        </g>
      </motion.svg>

      <div className="kanwar-wrap">
        {/* ── 1. Eyebrow ── */}
        <motion.div
          {...rise(0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 'clamp(22px, 3vw, 34px)',
          }}
        >
          <PulseDot />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: GOLD_DEEP,
            }}
          >
            A 3Tattava Seva Initiative
          </span>
        </motion.div>

        {/* ── 2. Hindi core line + English ── */}
        <motion.div {...rise(0.05)} style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <p
            lang="hi"
            style={{
              fontFamily: DEVA,
              fontSize: 'clamp(24px, 4.4vw, 46px)',
              fontWeight: 600,
              lineHeight: 1.4,
              color: FOREST,
              margin: 0,
            }}
          >
            इस कांवड़ यात्रा में सेवा सिर्फ जल की नहीं—स्वास्थ्य की भी होगी।
          </p>
          <p
            style={{
              fontSize: 'clamp(14px, 1.9vw, 19px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgba(28,19,4,0.72)',
              margin: 'clamp(12px, 1.6vw, 18px) 0 0',
            }}
          >
            This Kanwar Yatra, Seva will include Swasthya Seva.
          </p>
        </motion.div>

        {/* ── 3. Title lockup ── */}
        <motion.div
          {...rise(0.1)}
          style={{ textAlign: 'center', maxWidth: 940, margin: 'clamp(44px, 6vw, 72px) auto 0' }}
        >
          <p
            style={{
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: GOLD_DEEP,
              margin: '0 0 clamp(12px, 1.6vw, 18px)',
            }}
          >
            Vishwa Ayurved Parishad, Delhi Pranta presents
          </p>
          <h2
            style={{
              fontFamily: F,
              fontSize: 'clamp(30px, 5.4vw, 60px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: FOREST,
              margin: 0,
            }}
          >
            Indraprastha Kanwar Swasthya Seva Yatra 2026
          </h2>
          <p
            style={{
              fontSize: 'clamp(16px, 2.2vw, 24px)',
              fontWeight: 500,
              color: SAFFRON,
              margin: 'clamp(10px, 1.4vw, 16px) 0 0',
              letterSpacing: '0.01em',
            }}
          >
            Ayurveda Health Camp
          </p>
        </motion.div>

        {/* ── 4. Key facts row ── */}
        <motion.div
          className="kanwar-facts"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {KEY_FACTS.map((fact) => (
            <motion.div
              key={fact.icon}
              variants={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(200,150,62,0.28)',
                borderRadius: 16,
                padding: 'clamp(14px, 1.8vw, 20px) clamp(16px, 2vw, 22px)',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: IVORY,
                }}
              >
                <Icon icon={fact.icon} width={24} height={24} />
              </span>
              <span
                style={{
                  fontSize: 'clamp(13px, 1.55vw, 16px)',
                  fontWeight: 500,
                  lineHeight: 1.45,
                  color: INK,
                }}
              >
                {fact.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 5. Services grid ── */}
        <div style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}>
          <motion.h3
            {...rise(0)}
            style={{
              fontSize: 'clamp(22px, 3.4vw, 34px)',
              fontWeight: 700,
              color: FOREST,
              textAlign: 'center',
              margin: '0 0 clamp(26px, 3.6vw, 44px)',
              letterSpacing: '-0.01em',
            }}
          >
            Services at the Camp
          </motion.h3>

          <motion.div
            className="kanwar-services"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {SERVICES.map((svc) => (
              <motion.div key={svc.label} className="kanwar-card" variants={item}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(200,150,62,0.12)',
                    color: GOLD_DEEP,
                    marginBottom: 14,
                  }}
                >
                  <Icon icon={svc.icon} width={30} height={30} />
                </span>
                <p
                  style={{
                    fontSize: 'clamp(12.5px, 1.4vw, 15px)',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {svc.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Referral / compliance note */}
          <motion.p
            {...rise(0.05)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              maxWidth: 760,
              margin: 'clamp(22px, 3vw, 32px) auto 0',
              fontSize: 'clamp(12px, 1.4vw, 14.5px)',
              lineHeight: 1.55,
              color: 'rgba(28,19,4,0.66)',
              fontStyle: 'italic',
              textAlign: 'left',
            }}
          >
            <Icon
              icon="mdi:information-outline"
              width={18}
              height={18}
              style={{ flexShrink: 0, marginTop: 2, color: GOLD_DEEP }}
            />
            <span>
              Serious or emergency cases are appropriately referred. Ayurveda support does not
              replace emergency medical care.
            </span>
          </motion.p>
        </div>

        {/* ── 6. Schedule strip ── */}
        <div style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}>
          <motion.p
            {...rise(0)}
            style={{
              textAlign: 'center',
              fontSize: 'clamp(14px, 1.9vw, 19px)',
              fontWeight: 600,
              color: FOREST,
              margin: '0 0 clamp(24px, 3vw, 36px)',
              letterSpacing: '0.01em',
            }}
          >
            Daily: 3, 4, 5, 6, 7, 8 August 2026
          </motion.p>

          <motion.div
            className="kanwar-timeline"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* connecting line */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 27,
                left: '8%',
                right: '8%',
                height: 2,
                background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                zIndex: 0,
              }}
            />
            {DAYS.map((d) => (
              <motion.div
                key={d}
                variants={item}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${FOREST}, #17302680)`,
                    color: IVORY,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 700,
                    border: `2px solid ${GOLD}`,
                    boxShadow: '0 10px 24px rgba(28,19,4,0.16)',
                  }}
                >
                  {d}
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(28,19,4,0.7)' }}>
                  August 2026
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── 7. Support & management block ── */}
        {/* client to supply official logos: Vishwa Ayurved Parishad, CBPACS, FIMS SGT, Premadhara, 3Tattava */}
        <motion.div
          {...rise(0)}
          className="kanwar-support"
          style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(200,150,62,0.28)',
              borderRadius: 20,
              padding: 'clamp(24px, 3vw, 38px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Icon icon="mdi:hospital-building" width={22} height={22} style={{ color: GOLD_DEEP }} />
              <h3
                style={{
                  fontSize: 'clamp(17px, 2.2vw, 22px)',
                  fontWeight: 700,
                  color: FOREST,
                  margin: 0,
                }}
              >
                Medical & Institutional Support
              </h3>
            </div>
            {/* Institution NAMES rendered as styled text only — real logos to be supplied by client */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
              {INSTITUTIONS.map((name) => (
                <li
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 'clamp(14px, 1.7vw, 17px)',
                    fontWeight: 600,
                    color: INK,
                  }}
                >
                  <Icon
                    icon="mdi:check-decagram"
                    width={20}
                    height={20}
                    style={{ color: GOLD, flexShrink: 0 }}
                  />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: `linear-gradient(160deg, ${FOREST}, #16302580)`,
              borderRadius: 20,
              padding: 'clamp(24px, 3vw, 38px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: IVORY,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: '0 0 12px',
              }}
            >
              Managed & executed on-ground by
            </p>
            <p
              style={{
                fontSize: 'clamp(20px, 2.8vw, 28px)',
                fontWeight: 700,
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              3Tattava — Doctor-led Performance Ayurveda
            </p>
          </div>
        </motion.div>

        {/* ── 8. Volunteer / coordinator card ── */}
        <motion.div
          {...rise(0.05)}
          style={{
            marginTop: 'clamp(28px, 4vw, 44px)',
            background: 'linear-gradient(180deg, #ffffff 0%, #fbf5e9 100%)',
            border: '1px solid rgba(200,150,62,0.32)',
            borderRadius: 20,
            padding: 'clamp(22px, 3vw, 34px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: GOLD_DEEP,
                margin: '0 0 8px',
              }}
            >
              For volunteering coordination
            </p>
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 19px)',
                fontWeight: 600,
                color: INK,
                margin: 0,
              }}
            >
              Mr. Shravan · Camp Coordinator · 21–22 Batch, CBPACS
            </p>
          </div>
          <a
            href="tel:8384082950"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
              color: IVORY,
              fontWeight: 700,
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              padding: '12px 22px',
              borderRadius: 999,
              textDecoration: 'none',
              boxShadow: '0 12px 28px rgba(200,150,62,0.32)',
            }}
          >
            <Icon icon="mdi:phone" width={20} height={20} />
            8384082950
          </a>
        </motion.div>
      </div>

      {/* ── 9. Closing tagline band ── */}
      <motion.div
        {...rise(0)}
        style={{
          position: 'relative',
          zIndex: 2,
          background: `linear-gradient(160deg, ${FOREST} 0%, #16302a 100%)`,
          color: IVORY,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: 'clamp(48px, 7vw, 88px) clamp(20px, 5vw, 40px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(24px, 4vw, 48px)',
            textAlign: 'center',
          }}
        >
          <LotusDecoration />

          <div style={{ maxWidth: 640 }}>
            <p
              lang="hi"
              style={{
                fontFamily: DEVA,
                fontSize: 'clamp(22px, 3.6vw, 40px)',
                fontWeight: 600,
                lineHeight: 1.4,
                color: IVORY,
                margin: 0,
              }}
            >
              सेवा के हर कदम पर, आयुर्वेद आपके साथ।
            </p>
            <p
              style={{
                fontSize: 'clamp(14px, 2vw, 20px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(247,240,226,0.82)',
                margin: 'clamp(10px, 1.4vw, 16px) 0 clamp(24px, 3vw, 34px)',
              }}
            >
              Ayurveda with You, at Every Step of Seva.
            </p>

            <div className="kanwar-close-contacts">
              <a
                href="https://www.3Tattava.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: IVORY,
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 1.6vw, 16px)',
                  fontWeight: 500,
                }}
              >
                <Icon icon="mdi:web" width={22} height={22} style={{ color: GOLD }} />
                www.3Tattava.com
              </a>
              <a
                href="https://wa.me/919560149956"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: IVORY,
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 1.6vw, 16px)',
                  fontWeight: 500,
                }}
              >
                <Icon icon="mdi:whatsapp" width={22} height={22} style={{ color: GOLD }} />
                WhatsApp 9560149956
              </a>
              <a
                href="https://instagram.com/3tattva"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: IVORY,
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 1.6vw, 16px)',
                  fontWeight: 500,
                }}
              >
                <Icon icon="mdi:instagram" width={22} height={22} style={{ color: GOLD }} />
                Instagram @3tattva
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
