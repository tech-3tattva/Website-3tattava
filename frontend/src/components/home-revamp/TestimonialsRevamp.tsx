'use client';
import { media } from "@/lib/media";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import RevealHeading from '@/components/ui/RevealHeading';

/**
 * Customer-review REELS.
 * Each entry is a vertical (9:16) video frame that plays a customer's review reel.
 * To integrate real reels, just swap `src` (the .mp4/HLS URL) and `poster`
 * (a vertical thumbnail) below — the player UI stays the same.
 */
interface Reel {
  src: string;
  poster: string;
  name: string;
  city: string;
  caption: string;
}

const REELS: Reel[] = [
  { src: media("/videos/morning-ritual.mp4"), poster: media("/home/trinity-poster-v2.png"), name: 'Rahul M.', city: 'Delhi', caption: 'Consistency changed everything.' },
  { src: media("/videos/shahjeet-reveal.mp4"), poster: media("/home/Shilajeet-resins.png"), name: 'Priya S.', city: 'Mumbai', caption: 'Purity you can actually feel.' },
  { src: media("/home/dip-video.mp4"), poster: media("/home/rockresin.jpg"), name: 'Arjun K.', city: 'Bangalore', caption: 'Part of my daily routine now.' },
  { src: media("/videos/morning-ritual.mp4"), poster: media("/home/trinity-poster-v2.png"), name: 'Sneha P.', city: 'Pune', caption: 'My 10-second morning ritual.' },
  { src: media("/videos/shahjeet-reveal.mp4"), poster: media("/home/Ayurveda-insider.png"), name: 'Vikram T.', city: 'Noida', caption: 'Our whole gym swears by it.' },
];

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" style={{ color: '#f5c451', fontSize: '0.95rem', letterSpacing: 1.5 }}>
      ★★★★★
    </span>
  );
}

function ScrollArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      style={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        border: '2px solid #cd872a',
        background: disabled ? 'transparent' : '#cd872a',
        color: disabled ? '#cd872a' : '#f7f0e2',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        transition: 'all 0.25s ease',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {direction === 'left' ? '\u2190' : '\u2192'}
    </button>
  );
}

function ReelCard({ reel, suppressClick }: { reel: Reel; suppressClick: () => boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    if (suppressClick()) return; // ignore taps that were really drags
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [suppressClick]);

  return (
    <div
      onClick={toggle}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9 / 16',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#1c1304',
        boxShadow: '0 10px 30px rgba(68,42,27,0.16)',
        cursor: 'pointer',
      }}
    >
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.poster}
        preload="metadata"
        playsInline
        loop
        onEnded={() => setPlaying(false)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Reel badge */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#f7f0e2',
          background: 'rgba(28,19,4,0.55)',
          backdropFilter: 'blur(4px)',
          padding: '4px 9px',
          borderRadius: 999,
        }}
      >
        Reel
      </span>

      {/* Play/pause overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: playing ? 0 : 1,
          transition: 'opacity 0.25s ease',
          background: playing ? 'transparent' : 'linear-gradient(180deg, rgba(28,19,4,0.15), rgba(28,19,4,0.05) 40%, rgba(28,19,4,0.55))',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(247,240,226,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(0,0,0,0.28)',
          }}
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="#442a1b" aria-hidden>
            <path d="M0 1.7v18.6c0 1.3 1.42 2.1 2.53 1.42l15.2-9.3c1.06-.65 1.06-2.2 0-2.85L2.53.29C1.42-.39 0 .4 0 1.7Z" />
          </svg>
        </span>
      </div>

      {/* Caption / attribution */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 14px 16px',
          background: 'linear-gradient(0deg, rgba(28,19,4,0.82), rgba(28,19,4,0) 100%)',
          pointerEvents: 'none',
        }}
      >
        <Stars />
        <p
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: '#f7f0e2',
            margin: '6px 0 8px',
            lineHeight: 1.4,
          }}
        >
          &ldquo;{reel.caption}&rdquo;
        </p>
        <p
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#f7f0e2',
            margin: 0,
          }}
        >
          {reel.name}
          <span style={{ fontWeight: 400, color: 'rgba(247,240,226,0.7)' }}> · {reel.city}</span>
        </p>
      </div>
    </div>
  );
}

export default function TestimonialsRevamp() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, active: false, moved: false });

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth ?? 260;
    const gap = 20;
    el.scrollBy({ left: dir === 'left' ? -(cardWidth + gap) : cardWidth + gap, behavior: 'smooth' });
  }, []);

  /* Drag-to-scroll */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, scrollLeft: el.scrollLeft, active: true, moved: false };
    setIsDragging(false);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) {
      dragState.current.moved = true;
      setIsDragging(true);
    }
    const el = scrollRef.current;
    if (el) el.scrollLeft = dragState.current.scrollLeft - dx;
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current.active = false;
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  const suppressClick = useCallback(() => dragState.current.moved, []);

  return (
    <section ref={sectionRef} style={{ background: '#f7f0e2', padding: '6rem 0' }}>
      <style>{`
        .reel-track { --reel-width: 260px; }
        @media (max-width: 900px) { .reel-track { --reel-width: 72vw; } }
        .reel-track::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header row: heading left, arrows right */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
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
              lines={['Real Experiences. Real Results.']}
            />
            <p
              style={{
                fontFamily: 'var(--font-primary), system-ui, sans-serif',
                fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                color: '#b7a392',
                margin: '0.5rem 0 0 0',
                fontWeight: 500,
              }}
            >
              Watch real customers share their rituals
            </p>
          </motion.div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ScrollArrow direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} />
            <ScrollArrow direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} />
          </div>
        </div>

        {/* Reel carousel */}
        <div
          ref={scrollRef}
          className="reel-track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            display: 'flex',
            gap: 20,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            paddingBottom: 8,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {REELS.map((reel, i) => (
            <motion.div
              key={`${reel.name}-${i}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={headingInView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '0 0 auto', width: 'var(--reel-width)', scrollSnapAlign: 'start' }}
            >
              <ReelCard reel={reel} suppressClick={suppressClick} />
            </motion.div>
          ))}
        </div>

        {/* Brand statement */}
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
            color: '#b7a392',
            textAlign: 'center',
            marginTop: '2.5rem',
            fontStyle: 'italic',
            letterSpacing: 0.5,
          }}
        >
          Products Can Be Purchased In Minutes. Transformation Is Built Daily.
        </motion.p>
      </div>
    </section>
  );
}
