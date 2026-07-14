'use client'
import { motion } from 'framer-motion'

const trustItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    label: 'Doctor-Led',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    label: 'Athlete-Backed',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
    label: 'Lab-Tested',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Experience-Driven',
  },
]

const stripCSS = `
  .trust-strip-v2 {
    background: #f7f0e2;
    border-top: 1px solid rgba(68,42,27,0.10);
    border-bottom: 1px solid rgba(68,42,27,0.10);
    padding: 20px 0;
    overflow: hidden;
  }
  .trust-strip-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  .trust-item-v2 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #442a1b;
    cursor: default;
    transition: color 0.2s ease;
    padding: 6px 28px;
    flex: 1;
    justify-content: center;
    max-width: 240px;
  }
  .trust-item-v2:not(:last-child) {
    border-right: 1px solid rgba(183,163,146,0.50);
  }
  .trust-item-v2:hover {
    color: #cd872a;
  }
  .trust-item-v2:hover svg {
    stroke: #cd872a;
  }
  .trust-item-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 500;
    white-space: nowrap;
  }
  svg {
    flex-shrink: 0;
    transition: stroke 0.2s ease;
  }

  /* Mobile: 2×2 grid or marquee */
  @media (max-width: 768px) {
    .trust-strip-inner {
      flex-wrap: wrap;
      gap: 0;
      padding: 0 16px;
    }
    .trust-item-v2 {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 10px 16px;
      border-right: none !important;
    }
    .trust-item-v2:nth-child(1),
    .trust-item-v2:nth-child(2) {
      border-bottom: 1px solid rgba(183,163,146,0.40);
    }
    .trust-item-v2:nth-child(1),
    .trust-item-v2:nth-child(3) {
      border-right: 1px solid rgba(183,163,146,0.40) !important;
    }
  }
`

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function TrustStrip() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stripCSS }} />

      <section className="trust-strip-v2" aria-label="Trust indicators">
        <motion.div
          className="trust-strip-inner"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {trustItems.map((item) => (
            <motion.div
              key={item.label}
              className="trust-item-v2"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              {item.icon}
              <span className="trust-item-label">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  )
}
