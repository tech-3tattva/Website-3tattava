"use client";

import { useEffect, useState } from "react";
import { getAdminToken } from "@/lib/api";

/**
 * Watches the stored admin JWT so the shell can warn before it lapses.
 *
 * The admin token lives 8h. Staff used to be bounced to the login screen
 * mid-task with no warning, losing whatever they were typing into a form, so
 * the shell needs to know how much time is left without waiting for the next
 * failed request to find out.
 */

const WARN_MS = 10 * 60 * 1000;
// 30s is fine: the banner counts down in whole minutes, so a faster tick would
// re-render the whole shell for nothing.
const TICK_MS = 30 * 1000;

export type AdminSession = {
  /** Milliseconds left on the token; null when the expiry could not be read. */
  msRemaining: number | null;
  /** Whole minutes left, rounded up; null when the expiry could not be read. */
  minutesRemaining: number | null;
  /** Under WARN_MS and still valid. */
  expiringSoon: boolean;
  /** Already lapsed — every further request will 401. */
  expired: boolean;
};

const UNKNOWN: AdminSession = {
  msRemaining: null,
  minutesRemaining: null,
  expiringSoon: false,
  expired: false,
};

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(segment.length / 4) * 4, "=");
  const binary = atob(padded);
  // JWT claims are UTF-8; an admin name with non-ASCII characters would
  // otherwise garble the payload and lose the expiry with it.
  let percent = "";
  for (let i = 0; i < binary.length; i += 1) {
    percent += `%${binary.charCodeAt(i).toString(16).padStart(2, "0")}`;
  }
  return decodeURIComponent(percent);
}

/** Epoch ms of the token's `exp` claim, or null when it cannot be decoded. */
function readTokenExpiry(): number | null {
  const token = getAdminToken();
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(base64UrlDecode(payload)) as { exp?: unknown };
    // RFC 7519: `exp` is seconds since the epoch.
    return typeof claims.exp === "number" && Number.isFinite(claims.exp) ? claims.exp * 1000 : null;
  } catch {
    // Opaque or malformed token: better no countdown than a bogus one.
    return null;
  }
}

export function useAdminSession(): AdminSession {
  // Read on mount, not during render: sessionStorage does not exist on the server.
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setExpiresAt(readTokenExpiry());
  }, []);

  useEffect(() => {
    if (expiresAt === null) return;
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (expiresAt === null) return UNKNOWN;

  const msRemaining = expiresAt - now;
  return {
    msRemaining,
    minutesRemaining: Math.max(0, Math.ceil(msRemaining / 60000)),
    expiringSoon: msRemaining > 0 && msRemaining <= WARN_MS,
    expired: msRemaining <= 0,
  };
}
