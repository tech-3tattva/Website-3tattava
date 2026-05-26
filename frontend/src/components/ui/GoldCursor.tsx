'use client'
import { useEffect, useRef } from 'react'

export default function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current!
    const ring = ringRef.current!

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }
    document.addEventListener('mousemove', onMouseMove)

    const interactables = document.querySelectorAll('a, button')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '52px'
        ring.style.height = '52px'
        ring.style.borderColor = 'rgba(200,150,62,0.8)'
        ring.style.backgroundColor = 'rgba(200,150,62,0.06)'
      })
      el.addEventListener('mouseleave', () => {
        ring.style.width = '34px'
        ring.style.height = '34px'
        ring.style.borderColor = 'rgba(200,150,62,0.35)'
        ring.style.backgroundColor = 'transparent'
      })
    })

    let rafId: number
    function animateRing() {
      ringX += (mouseX - ringX) * 0.09
      ringY += (mouseY - ringY) * 0.09
      ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`
      rafId = requestAnimationFrame(animateRing)
    }
    animateRing()

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        #cursor-dot {
          position: fixed; top: 0; left: 0;
          width: 8px; height: 8px;
          background: #C8963E; border-radius: 50%;
          pointer-events: none; z-index: 99999;
          transition: transform 0.05s linear;
        }
        #cursor-ring {
          position: fixed; top: 0; left: 0;
          width: 34px; height: 34px;
          border: 1px solid rgba(200,150,62,0.35);
          border-radius: 50%;
          pointer-events: none; z-index: 99998;
          transition: width 0.3s ease, height 0.3s ease,
                      border-color 0.3s ease, background-color 0.3s ease;
        }
      `}</style>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}
