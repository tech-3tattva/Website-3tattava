'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useWaitlist } from '@/context/WaitlistContext';
import { api } from '@/lib/api';

/* ─── Type system ─── */
const F = 'var(--font-primary), system-ui, sans-serif';
const DISPLAY = "var(--font-display, 'Fraunces', Georgia, serif)";

/* ─── Palette ─── */
const CREAM = '#f7f0e2';
const GOLD = '#C8963E';
const INK = '#1c1304';
const FOREST = '#1e3a2f';

/* Founding program is the ₹200 welcome coupon (kind:"welcome"), capped globally. */
const DEFAULT_LIMIT = 200;

interface FoundingStatus {
  redeemed: number;
  limit: number;
  remaining: number;
}

/**
 * Count-up hook — eases a number from 0 → `target` over `duration` ms once
 * `active` flips true. Respects reduced-motion (jumps straight to the value).
 */
function useCountUp(target: number, active: boolean, reduce: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    if (reduce || target <= 0) {
      setValue(Math.max(0, target));
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, active, reduce, duration]);

  return value;
}

export default function FoundingProgram() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const { open } = useWaitlist();

  const [status, setStatus] = useState<FoundingStatus | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  // Fetch founding status + waitlist count on mount. Each fetch is independent
  // and failure-tolerant: a rejected request just leaves that value null so the
  // band degrades to static copy instead of crashing.
  useEffect(() => {
    let cancelled = false;

    api
      .get<FoundingStatus>('/coupons/founding-status')
      .then((res) => {
        if (!cancelled && res && typeof res.limit === 'number') setStatus(res);
      })
      .catch(() => {});

    api
      .get<{ count: number }>('/waitlist/count')
      .then((res) => {
        if (!cancelled && res && typeof res.count === 'number') setWaitlistCount(res.count);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const limit = status?.limit ?? DEFAULT_LIMIT;
  const redeemed = status?.redeemed ?? 0;
  const remaining = status?.remaining ?? limit;
  const hasStatus = status !== null;

  // Count-up animations (only run once the band scrolls into view).
  const redeemedShown = useCountUp(redeemed, inView && hasStatus, !!reduce);
  const remainingShown = useCountUp(remaining, inView && hasStatus, !!reduce);
  const waitlistShown = useCountUp(waitlistCount ?? 0, inView && waitlistCount !== null, !!reduce);

  const pct = limit > 0 ? Math.min(100, Math.round((redeemed / limit) * 100)) : 0;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.7, delay, ease: 'easeOut' as const },
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Founding member program"
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, #24463a 0%, ${FOREST} 55%, #16281f 100%)`,
        color: CREAM,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: '0 auto',
          padding: 'clamp(72px, 10vw, 120px) 24px',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
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
          The Founding Program
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...rise(0.08)}
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(30px, 5.2vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: CREAM,
            margin: '0 0 20px',
          }}
        >
          Become one of the first {limit} founding members
        </motion.h2>

        {/* Benefit line */}
        <motion.p
          {...rise(0.16)}
          style={{
            fontFamily: F,
            fontSize: 'clamp(15px, 1.9vw, 19px)',
            fontWeight: 300,
            lineHeight: 1.6,
            color: 'rgba(247,240,226,0.82)',
            maxWidth: 620,
            margin: '0 auto 40px',
          }}
        >
          Founding members get{' '}
          <span style={{ color: GOLD, fontWeight: 500 }}>&#8377;200 off their first order</span> + priority
          access.
        </motion.p>

        {/* Live count-up */}
        {hasStatus && (
          <motion.div {...rise(0.24)} style={{ margin: '0 auto 12px', maxWidth: 480 }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(40px, 8vw, 72px)',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: CREAM,
              }}
            >
              <span style={{ color: GOLD }}>{redeemedShown}</span>
              <span style={{ opacity: 0.45 }}> / {limit}</span>
            </div>
            <div
              style={{
                fontFamily: F,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(247,240,226,0.7)',
                margin: '10px 0 22px',
              }}
            >
              Claimed
            </div>

            {/* Progress bar */}
            <div
              aria-hidden
              style={{
                height: 8,
                width: '100%',
                borderRadius: 999,
                background: 'rgba(247,240,226,0.14)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : { width: 0 }}
                transition={{ duration: reduce ? 0 : 1.4, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${GOLD}, #e6b866)`,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: F,
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                fontWeight: 500,
                color: CREAM,
                margin: '18px 0 4px',
              }}
            >
              <span style={{ color: GOLD, fontWeight: 700 }}>{remainingShown}</span> spots left
            </p>
          </motion.div>
        )}

        {/* Waitlist tally */}
        {waitlistCount !== null && (
          <motion.p
            {...rise(0.32)}
            style={{
              fontFamily: F,
              fontSize: 'clamp(14px, 1.7vw, 17px)',
              fontWeight: 300,
              color: 'rgba(247,240,226,0.75)',
              margin: '0 0 36px',
            }}
          >
            <span style={{ color: CREAM, fontWeight: 600 }}>{waitlistShown}</span> already joined the
            waitlist
          </motion.p>
        )}

        {/* CTA */}
        <motion.div
          {...rise(0.4)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginTop: hasStatus || waitlistCount !== null ? 8 : 12,
          }}
        >
          <button
            type="button"
            onClick={() => open()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 40px',
              fontFamily: F,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: INK,
              background: `linear-gradient(180deg, #e6b866, ${GOLD})`,
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(200,150,62,0.32)',
            }}
          >
            Join the founding waitlist
          </button>
          <Link
            href="/waitlist"
            style={{
              fontFamily: F,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(247,240,226,0.6)',
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            or view the waitlist page
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
