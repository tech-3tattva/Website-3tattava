"use client";

import { useEffect } from "react";

/**
 * Freezes background scrolling while an overlay is open.
 *
 * Uses the pinned-body technique rather than `overflow: hidden`, because:
 *   - the root layout sets `overflow-x-clip` on the body, which makes <html>
 *     the scrolling element, so locking the body alone does nothing; and
 *   - `overflow: hidden` on the root still lets a wheel gesture move the page
 *     when the overlay itself is shorter than the viewport (nothing to
 *     scroll means nothing for `overscroll-behavior` to contain).
 *
 * Pinning the body at a negative offset removes the scroll container
 * altogether, so there is nothing left to scroll. The offset is restored on
 * close so the admin stays exactly where the user left it.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return undefined;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
