'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import RevealHeading from '@/components/ui/RevealHeading';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const HomeMap = dynamic(() => import('@/components/maps/WTFMapHome'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(247,240,226,0.5)', fontFamily: 'var(--font-primary)', fontSize: 13 }}>Loading the NCR map…</div>
  ),
});

/* ─── data ──────────────────────────────────────────────── */

interface Location {
  city: string;
  name: string;
  address: string;
  mapsQuery: string;
}

const locations: Location[] = [
  {
    city: 'Delhi',
    name: 'WTF Gym, Central Market',
    address: 'C-17 Central Market, New Seelampur',
    mapsQuery: 'WTF+Gym+C-17+Central+Market+New+Seelampur+Delhi',
  },
  {
    city: 'Noida',
    name: 'WTF Sector 22',
    address: 'Sector 22, Gautam Buddha Nagar',
    mapsQuery: 'WTF+Gym+Sector+22+Gautam+Buddha+Nagar+Noida',
  },
  {
    city: 'Gurugram',
    name: 'WTF Sector 70',
    address: 'Golf Course Road, Sector 70',
    mapsQuery: 'WTF+Gym+Sector+70+Golf+Course+Road+Gurugram',
  },
  {
    city: 'Ghaziabad',
    name: 'WTF, C.S. Complex',
    address: '2nd Floor, C.S. Complex, Sahibabad',
    mapsQuery: 'WTF+Gym+CS+Complex+Sahibabad+Ghaziabad',
  },
  {
    city: 'Faridabad',
    name: 'WTF Sector 16',
    address: 'Near Town Park, Sector 16',
    mapsQuery: 'WTF+Gym+Sector+16+Near+Town+Park+Faridabad',
  },
  {
    city: 'Greater Noida',
    name: 'WTF, Knowledge Park III',
    address: 'Knowledge Park III, Greater Noida',
    mapsQuery: 'WTF+Gym+Knowledge+Park+III+Greater+Noida',
  },
];

const filters = ['All', 'Delhi', 'Noida', 'Gurugram'] as const;

interface StatItem {
  end: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { end: 29, suffix: '+', label: 'Centers' },
  { end: 1, suffix: '', label: 'Doctor-Led Brand' },
  { end: 6, suffix: '', label: 'Cities' },
];

/* ─── count-up hook ─────────────────────────────────────── */

function useCountUp(end: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);
  return count;
}

/* ─── sub-components ────────────────────────────────────── */

function PinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cd872a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LocationCard({
  loc,
  index,
}: {
  loc: Location;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      layout
      style={{
        flex: '1 1 280px',
        maxWidth: 360,
        background: 'rgba(247, 240, 226, 0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(205, 135, 42, 0.18)',
        borderRadius: 16,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}
    >
      {/* City badge */}
      <span
        style={{
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#cd872a',
        }}
      >
        {loc.city}
      </span>

      {/* Name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PinIcon />
        <span
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#f7f0e2',
          }}
        >
          {loc.name}
        </span>
      </div>

      {/* Address */}
      <p
        style={{
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: '0.88rem',
          lineHeight: 1.5,
          color: 'rgba(247, 240, 226, 0.6)',
          margin: 0,
        }}
      >
        {loc.address}
      </p>

      {/* Directions link */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${loc.mapsQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#cd872a',
          textDecoration: 'none',
          marginTop: 'auto',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        Get Directions →
      </a>
    </motion.div>
  );
}

function CounterItem({
  stat,
  active,
  index,
}: {
  stat: StatItem;
  active: boolean;
  index: number;
}) {
  const value = useCountUp(stat.end, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease: 'easeOut' }}
      style={{ textAlign: 'center', flex: '1 1 140px' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: 'clamp(2.75rem, 5vw, 4.25rem)',
          fontWeight: 700,
          color: '#cd872a',
        }}
      >
        {value}
        {stat.suffix}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: '0.9rem',
          color: '#442a1b',
          opacity: 0.7,
          margin: '0.25rem 0 0',
        }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}

/* ─── main component ────────────────────────────────────── */

export default function ExperienceCenterMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, margin: '-40px' });
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered =
    activeFilter === 'All'
      ? locations
      : locations.filter((l) => l.city === activeFilter);

  return (
    <section
      ref={sectionRef}
      id="experience-centers"
      style={{
        background: '#f7f0e2',
        padding: '6rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* ── heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <RevealHeading
            as="h2"
            style={{
              fontFamily: 'var(--font-primary), system-ui, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: '#442a1b',
              margin: 0,
            }}
            lines={['Experience 3Tattava Offline']}
          />
          <p
            style={{
              fontFamily: 'var(--font-primary), system-ui, sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: 1.8,
              color: '#442a1b',
              opacity: 0.75,
              maxWidth: 560,
              margin: '0.75rem auto 0',
            }}
          >
            29+ Experience Centers inside WTF Gyms across Delhi NCR.
          </p>
        </motion.div>

        {/* ── filter chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  fontFamily: 'var(--font-primary), system-ui, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.3rem',
                  borderRadius: 50,
                  border: `1.5px solid ${isActive ? '#cd872a' : '#b7a392'}`,
                  background: isActive ? '#cd872a' : 'transparent',
                  color: isActive ? '#f7f0e2' : '#442a1b',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                {f}
              </button>
            );
          })}
        </motion.div>

        {/* ── dark map card with location grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
          style={{
            background: '#442a1b',
            borderRadius: 24,
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '3rem',
          }}
        >
          <div style={{ height: 'clamp(320px,44vh,460px)', borderRadius: 16, overflow: 'hidden', marginBottom: '1.75rem' }}>
            <HomeMap />
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                justifyContent: 'center',
              }}
            >
              {filtered.map((loc, i) => (
                <LocationCard key={loc.name} loc={loc} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p
              style={{
                fontFamily: 'var(--font-primary), system-ui, sans-serif',
                textAlign: 'center',
                color: 'rgba(247, 240, 226, 0.5)',
                padding: '2rem',
              }}
            >
              No centers in this filter — try &quot;All&quot;.
            </p>
          )}
        </motion.div>

        {/* ── counter row ── */}
        <div
          ref={counterRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(2rem, 6vw, 5rem)',
            marginTop: 'clamp(2rem, 5vw, 4rem)',
            marginBottom: '2.5rem',
          }}
        >
          {stats.map((s, i) => (
            <CounterItem key={s.label} stat={s} active={counterInView} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <Link
            href="/find-us"
            style={{
              fontFamily: 'var(--font-primary), system-ui, sans-serif',
              display: 'inline-block',
              padding: '0.9rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#f7f0e2',
              background: '#442a1b',
              border: 'none',
              borderRadius: 50,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background 0.25s, transform 0.25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#cd872a';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#442a1b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Find Your Nearest Center →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
