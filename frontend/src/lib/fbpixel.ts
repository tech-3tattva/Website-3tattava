type Fbq = (...args: unknown[]) => void;

/**
 * Fire a Meta Pixel standard event safely. No-op on the server or when the
 * pixel hasn't loaded (e.g. blocked by an ad-blocker), so callers never crash.
 */
export function trackPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: Fbq };
  if (typeof w.fbq !== "function") return;
  try {
    w.fbq("track", event, params);
  } catch {
    /* ignore pixel errors */
  }
}
