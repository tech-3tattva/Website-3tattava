'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CustomCursor — capstonebox-style pointer.
 * A small dot follows instantly; a ring lags behind with a spring. Over interactive
 * elements the ring grows; over product links / add-to-cart CTAs it becomes a labelled
 * pill ("View" / "Add"). Uses mix-blend-mode:difference so it stays visible on both the
 * cream and espresso sections. Auto-disabled on touch / coarse pointers; native caret is
 * preserved over text inputs.
 */

const INK = '#442a1b'
const CREAM = '#f7f0e2'
const Z = 2147483600

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [textField, setTextField] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { damping: 30, stiffness: 380, mass: 0.5 })
  const ringY = useSpring(y, { damping: 30, stiffness: 380, mass: 0.5 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-none')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const el = target?.closest?.(
        'a,button,[role="button"],[data-cursor],input,textarea,select,[contenteditable="true"]'
      ) as HTMLElement | null

      if (!el) {
        setHovering(false)
        setTextField(false)
        setLabel('')
        return
      }

      const tag = el.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable) {
        setTextField(true)
        setHovering(false)
        setLabel('')
        return
      }
      setTextField(false)

      const explicit = el.getAttribute('data-cursor')
      let lbl = ''
      if (explicit) {
        lbl = explicit
      } else {
        const href = el.getAttribute('href') || ''
        const txt = (el.textContent || '').toLowerCase()
        if (/add|begin your ritual|buy|cart|checkout/.test(txt)) lbl = 'Add'
        else if (href.includes('/products/') || /shop|explore|discover|view|read|see/.test(txt)) lbl = 'View'
      }
      setHovering(true)
      setLabel(lbl)
    }

    const downH = () => setDown(true)
    const upH = () => setDown(false)
    const leave = () => {
      setHovering(false)
      setTextField(false)
      setLabel('')
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', downH)
    window.addEventListener('mouseup', upH)
    document.addEventListener('mouseleave', leave)

    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', downH)
      window.removeEventListener('mouseup', upH)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  if (!enabled) return null

  const hasLabel = hovering && !!label && !textField
  const ringScale = down ? (hovering ? 1.5 : 0.75) : hovering ? 1.7 : 1

  return (
    <>
      <style>{`
        html.cursor-none, html.cursor-none * { cursor: none !important; }
        html.cursor-none input, html.cursor-none textarea, html.cursor-none select,
        html.cursor-none [contenteditable="true"] { cursor: auto !important; }
      `}</style>

      {/* Ring / label pill (lagging) */}
      <motion.div
        aria-hidden
        animate={{ opacity: textField ? 0 : 1, scale: hasLabel ? 1 : ringScale }}
        transition={{ type: 'spring', damping: 26, stiffness: 420, mass: 0.4 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 34,
          height: 34,
          borderRadius: 999,
          border: hasLabel ? 'none' : `1.5px solid ${CREAM}`,
          background: hasLabel ? INK : 'transparent',
          color: CREAM,
          padding: hasLabel ? '0 16px' : 0,
          mixBlendMode: hasLabel ? 'normal' : 'difference',
          fontFamily: 'var(--font-primary), system-ui, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: Z,
          pointerEvents: 'none',
        }}
      >
        {hasLabel ? label : null}
      </motion.div>

      {/* Dot (instant) */}
      <motion.div
        aria-hidden
        animate={{ opacity: hovering || textField ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: 999,
          background: CREAM,
          mixBlendMode: 'difference',
          zIndex: Z,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
