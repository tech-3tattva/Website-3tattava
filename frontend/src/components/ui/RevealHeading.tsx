'use client'

import { useRef, type CSSProperties, type ElementType } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * RevealHeading — capstonebox-style line-mask heading reveal.
 * Each line sits inside an overflow-hidden mask and rises into view on scroll,
 * staggered line-by-line (or word-by-word). Respects prefers-reduced-motion.
 *
 * Pass `lines` as strings (one mask per line) or objects to colour/gradient a
 * single line independently of the base heading style.
 */

const EASE = [0.22, 1, 0.36, 1] as const

export interface RevealLine {
  text: string
  style?: CSSProperties
}

export interface RevealHeadingProps {
  lines: (string | RevealLine)[]
  as?: ElementType
  /** split granularity — 'line' (default) or 'word' (best for short, non-wrapping headings) */
  by?: 'line' | 'word'
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
  margin?: string
  style?: CSSProperties
  className?: string
}

export default function RevealHeading({
  lines,
  as: Tag = 'h2',
  by = 'line',
  delay = 0,
  stagger = 0.085,
  duration = 0.85,
  once = true,
  margin = '-12%',
  style,
  className,
}: RevealHeadingProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once, margin: margin as `${number}%` })
  const reduce = useReducedMotion()

  const norm: RevealLine[] = lines.map((l) => (typeof l === 'string' ? { text: l } : l))

  if (reduce) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {norm.map((l, i) => (
          <span key={i} style={{ display: 'block', ...l.style }}>
            {l.text}
          </span>
        ))}
      </Tag>
    )
  }

  let idx = 0
  return (
    <Tag ref={ref} className={className} style={style}>
      {norm.map((line, li) => {
        const tokens =
          by === 'word'
            ? line.text.split(/(\s+)/).filter((t) => t.length > 0)
            : [line.text]
        return (
          <span
            key={li}
            style={{
              display: 'block',
              overflow: 'hidden',
              // room for descenders inside the mask without shifting layout
              paddingBottom: '0.12em',
              marginBottom: '-0.12em',
            }}
          >
            {tokens.map((tok, ti) => {
              if (/^\s+$/.test(tok)) {
                return (
                  <span key={ti} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {tok}
                  </span>
                )
              }
              const i = idx++
              return (
                <motion.span
                  key={ti}
                  style={{ display: 'inline-block', willChange: 'transform', ...line.style }}
                  initial={{ y: '118%' }}
                  animate={inView ? { y: '0%' } : { y: '118%' }}
                  transition={{ duration, ease: EASE, delay: delay + i * stagger }}
                >
                  {tok}
                </motion.span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
