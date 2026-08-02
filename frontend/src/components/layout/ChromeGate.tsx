"use client";

import { usePathname } from "next/navigation";

/**
 * Hides global site chrome (nav, footer, cart, floating widgets) on focused
 * conversion/landing routes so paid-traffic pages have zero distractions and a
 * single call-to-action. Everything else renders the full chrome as normal.
 */
const CHROME_FREE_ROUTES = ["/waitlist", "/wtf"];

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const stripped = CHROME_FREE_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );
  if (stripped) return null;
  return <>{children}</>;
}
