import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal — Intersection-Observer powered reveal-on-scroll wrapper.
 *  - `as`: element tag, default 'div'
 *  - `delay`: ms delay before transition starts
 *  - `direction`: 'up' | 'left' | 'right' | 'fade' | 'scale'
 *  - `once`: only reveal once (default true)
 *  - Honours prefers-reduced-motion (skips animation)
 */
export default function ScrollReveal({
  children,
  as: Tag = "div",
  delay = 0,
  direction = "up",
  duration = 900,
  threshold = 0.18,
  once = true,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(el);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold, once]);

  const offsets = {
    up: "translate3d(0, 36px, 0)",
    left: "translate3d(-32px, 0, 0)",
    right: "translate3d(32px, 0, 0)",
    fade: "translate3d(0, 0, 0)",
    scale: "translate3d(0, 0, 0) scale(0.96)",
  };

  const style = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translate3d(0,0,0) scale(1)" : offsets[direction] || offsets.up,
    transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
