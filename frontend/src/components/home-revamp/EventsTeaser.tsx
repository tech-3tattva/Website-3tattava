'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const F = 'var(--font-primary), system-ui, sans-serif';
const DEVA = "var(--font-devanagari), var(--font-primary), 'Noto Serif Devanagari', serif";

/* Kanwar campaign palette */
const FOREST = '#1e3a2f';
const FOREST_DEEP = '#14251d';
const GOLD = '#C8963E';
const IVORY = '#f7f0e2';

/* Layout + reduced-motion — injected verbatim (mobile-first). */
const EV_CSS = `
  .ev-wrap {
    background: ${IVORY};
    padding: clamp(44px, 7vw, 84px) 20px;
    display: flex;
    justify-content: center;
  }
  .ev-link {
    display: block;
    width: 100%;
    max-width: 880px;
    text-decoration: none;
    border-radius: 26px;
    -webkit-tap-highlight-color: transparent;
  }
  .ev-card {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    background: linear-gradient(135deg, ${FOREST} 0%, ${FOREST_DEEP} 100%);
    box-shadow: 0 22px 60px rgba(20, 37, 29, 0.32);
    border: 1px solid rgba(200, 150, 62, 0.34);
    isolation: isolate;
  }
  .ev-shine {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      105deg,
      transparent 34%,
      rgba(200, 150, 62, 0.22) 46%,
      rgba(255, 255, 255, 0.16) 52%,
      transparent 66%
    );
  }
  .ev-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: clamp(18px, 3vw, 40px);
    padding: clamp(26px, 4vw, 46px) clamp(22px, 4vw, 48px);
  }
  .ev-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: ${F};
    font-size: clamp(10px, 1.4vw, 12px);
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${GOLD};
    margin: 0 0 12px;
  }
  .ev-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${GOLD};
    box-shadow: 0 0 0 0 rgba(200, 150, 62, 0.6);
    flex: none;
  }
  .ev-deva {
    font-family: ${DEVA};
    font-size: clamp(14px, 2vw, 17px);
    line-height: 1.5;
    color: rgba(247, 240, 226, 0.72);
    margin: 0 0 8px;
  }
  .ev-title {
    font-family: ${F};
    font-variation-settings: 'wght' 800;
    font-weight: 800;
    font-size: clamp(20px, 3.4vw, 30px);
    line-height: 1.16;
    letter-spacing: -0.01em;
    color: ${IVORY};
    margin: 0 0 10px;
  }
  .ev-meta {
    font-family: ${F};
    font-size: clamp(12.5px, 1.7vw, 15px);
    line-height: 1.55;
    color: rgba(247, 240, 226, 0.82);
    margin: 0;
  }
  .ev-meta strong { color: ${GOLD}; font-weight: 700; }
  .ev-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    font-family: ${F};
    font-variation-settings: 'wght' 700;
    font-weight: 700;
    font-size: clamp(13px, 1.7vw, 15px);
    letter-spacing: 0.04em;
    color: ${FOREST_DEEP};
    background: linear-gradient(100deg, #e4c079, ${GOLD}, #b9822f);
    padding: 14px 26px;
    border-radius: 50px;
    box-shadow: 0 12px 30px rgba(200, 150, 62, 0.34);
  }
  @media (max-width: 640px) {
    .ev-inner {
      grid-template-columns: 1fr;
      justify-items: center;
      text-align: center;
      gap: 20px;
    }
    .ev-cta { width: 100%; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ev-shine { display: none; }
  }
`;

export default function EventsTeaser() {
  const reduce = useReducedMotion();

  return (
    <div className="ev-wrap">
      <style dangerouslySetInnerHTML={{ __html: EV_CSS }} />
      <Link href="/events" className="ev-link" aria-label="View the Indraprastha Kanwar Swasthya Seva Yatra 2026 Ayurveda health camp">
        <motion.div
          className="ev-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduce ? undefined : { y: -5, boxShadow: '0 30px 74px rgba(20,37,29,0.42)' }}
        >
          {/* Shimmer sweep */}
          <motion.span
            className="ev-shine"
            aria-hidden
            initial={{ x: '-130%' }}
            animate={reduce ? undefined : { x: ['-130%', '130%'] }}
            transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
          />

          <div className="ev-inner">
            <div>
              <p className="ev-eyebrow">
                <motion.span
                  className="ev-dot"
                  aria-hidden
                  animate={reduce ? undefined : { scale: [1, 1.35, 1], boxShadow: ['0 0 0 0 rgba(200,150,62,0.55)', '0 0 0 7px rgba(200,150,62,0)', '0 0 0 0 rgba(200,150,62,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                A 3Tattava Seva Initiative · Live
              </p>
              <p className="ev-deva">इस कांवड़ यात्रा में सेवा स्वास्थ्य की भी।</p>
              <h3 className="ev-title">Indraprastha Kanwar Swasthya Seva Yatra 2026</h3>
              <p className="ev-meta">
                Ayurveda Health Camp · <strong>3–8 August 2026</strong> · Free for all Kanwar Yatris
              </p>
            </div>

            <motion.span
              className="ev-cta"
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              View the Camp
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
