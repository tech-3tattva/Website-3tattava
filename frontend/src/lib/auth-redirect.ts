/** Default route after sign-in when no `redirect` query is present. */
export const DEFAULT_POST_AUTH_PATH = "/account";

/** Shipping step after cart; used as post-login redirect from checkout. */
export const CHECKOUT_ADDRESS_PATH = "/checkout/address";

export const CHECKOUT_PAYMENT_PATH = "/checkout/payment";

/**
 * Returns a safe internal path for post-login navigation, or null if invalid.
 * Rejects protocol-relative and external URLs to avoid open redirects.
 */
export function getSafeRedirectPath(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return null;
  return trimmed;
}
