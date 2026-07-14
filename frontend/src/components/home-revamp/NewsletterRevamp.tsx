'use client'
import { media } from "@/lib/media";

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import RevealHeading from '@/components/ui/RevealHeading'

const TRUST_BADGES = 'NABL Certified · AYUSH-GMP · Doctor-Formulated · 16,000+ ft Sourced'

export default function NewsletterRevamp() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay: 0.15 * i, ease: "easeOut" as const },
  })

  return (
    <section
      ref={ref}
      id="newsletter"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        #newsletter input::placeholder { color: rgba(183, 163, 146, 0.5); }
        #newsletter input:disabled { opacity: 0.5; }
      `}</style>
      {/* Himalaya background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media("/hero/himalaya-bg.png")}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* 70% dark ink overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(68, 42, 27, 0.70)',
          }}
        />
      </div>

      {/* Fade-up wrapper for entire section content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          maxWidth: 640,
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <motion.span
          {...stagger(0)}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: '#cd872a',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontVariant: 'all-small-caps',
            marginBottom: 20,
          }}
        >
          START YOUR JOURNEY
        </motion.span>

        {/* Heading */}
        <RevealHeading
          as="h2"
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 700,
            color: '#f7f0e2',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
          lines={['Take the first step', 'toward lasting energy.']}
        />

        {/* Subtitle */}
        <motion.p
          {...stagger(2)}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: 'rgba(247, 240, 226, 0.6)',
            marginTop: 16,
            marginBottom: 0,
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          Subscribe to The Performance Ayurveda Brief — weekly insights by Dr.&nbsp;Kashish.
        </motion.p>

        {/* Glass card email form */}
        <motion.div
          {...stagger(3)}
          style={{
            marginTop: 40,
            width: '100%',
            maxWidth: 480,
            background: 'rgba(247, 240, 226, 0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 16,
            padding: 32,
            border: '1px solid rgba(247, 240, 226, 0.1)',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
              style={{
                width: '100%',
                padding: '14px 0',
                border: 'none',
                borderBottom: '1.5px solid #cd872a',
                outline: 'none',
                fontFamily: 'var(--font-primary), system-ui, sans-serif',
                fontSize: 15,
                background: 'transparent',
                color: '#f7f0e2',
                letterSpacing: '0.02em',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = '#f5d590'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = '#cd872a'
              }}
            />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.button
                  key="submit"
                  type="submit"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#442a1b',
                    background: 'linear-gradient(135deg, #cd872a 0%, #f5d590 100%)',
                    borderRadius: 10,
                    letterSpacing: '0.06em',
                    transition: 'filter 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget
                    btn.style.filter = 'brightness(1.1)'
                    btn.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget
                    btn.style.filter = 'brightness(1)'
                    btn.style.transform = 'translateY(0)'
                  }}
                >
                  Let&apos;s Begin
                </motion.button>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '14px 28px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #cd872a 0%, #f5d590 100%)',
                    color: '#442a1b',
                    fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}
                >
                  {/* Checkmark SVG */}
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#442a1b"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    />
                  </motion.svg>
                  You&apos;re In
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Trust badges */}
        <motion.p
          {...stagger(4)}
          style={{
            fontFamily: 'var(--font-primary), system-ui, sans-serif',
            fontSize: 11,
            color: '#b7a392',
            marginTop: 28,
            letterSpacing: '0.08em',
            lineHeight: 1.6,
          }}
        >
          {TRUST_BADGES}
        </motion.p>
      </motion.div>
    </section>
  )
}
