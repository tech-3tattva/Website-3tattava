"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWaitlist } from "@/context/WaitlistContext";

/**
 * Auto-opens the founding-waitlist modal the moment a visitor lands on the
 * homepage — once per browser session (so it doesn't nag on every navigation).
 * Fires just after the intro splash clears.
 */
const SEEN_KEY = "3t_waitlist_autoopen";

export default function WaitlistAutoOpen() {
  const pathname = usePathname();
  const { open } = useWaitlist();

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      /* sessionStorage unavailable */
    }
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      open();
    }, 2200);
    return () => window.clearTimeout(t);
  }, [pathname, open]);

  return null;
}
