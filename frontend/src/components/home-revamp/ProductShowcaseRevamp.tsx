'use client'
import { media } from "@/lib/media";

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ProductShowcaseRevamp() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: 480,
        overflow: 'hidden',
        background: '#1c1304',
      }}
    >
      {/* Autoplay video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      >
        <source src={media("/videos/morning-ritual.mp4")} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(28,19,4,0.55) 0%, rgba(28,19,4,0.75) 50%, rgba(28,19,4,0.9) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #cd872a 0%, #f5d590 50%, #cd872a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          Tear&ensp;·&ensp;Squeeze&ensp;·&ensp;Perform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
            color: '#f7f0e2',
            marginTop: 16,
            letterSpacing: '0.04em',
            fontWeight: 400,
          }}
        >
          The 10-Second Daily Ritual
        </motion.p>

      </div>
    </section>
  )
}
