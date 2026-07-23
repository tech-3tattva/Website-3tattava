type Gtag = (...args: unknown[]) => void;

/**
 * Fire a Google Analytics 4 event safely. No-op on the server or when gtag
 * hasn't loaded (e.g. blocked), so callers never crash.
 */
export function trackGa(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  if (typeof w.gtag !== "function") return;
  try {
    w.gtag("event", event, params);
  } catch {
    /* ignore analytics errors */
  }
}
