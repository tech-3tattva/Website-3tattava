"use client";

/**
 * The founding waitlist is over and the store is trading, so this no longer
 * auto-opens any modal. Kept as an inert component (returns null) so existing
 * imports and layout references stay valid without a competing pop-up.
 */
export default function WaitlistAutoOpen() {
  return null;
}
