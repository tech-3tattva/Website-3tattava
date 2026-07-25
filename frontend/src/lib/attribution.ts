// ─────────────────────────────────────────────────────────
// 3TATTAVA — Ad-attribution capture (UTM + Meta click-id)
// SSR-safe. Captures the paid-ad context on first landing and
// persists it to sessionStorage so it survives in-session
// navigation, then spreads straight into the waitlist payload.
// Field names are snake_case to map 1:1 onto the backend $set.
// ─────────────────────────────────────────────────────────

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  referrer?: string;
  landing_path?: string;
}

const STORAGE_KEY = "3t_attribution";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const MAX = 500;

function cap(value: string, len = MAX): string {
  return value.length > len ? value.slice(0, len) : value;
}

/** Read a single cookie value, decoded. Safe when document is absent. */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined" || !document.cookie) return undefined;
  const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + escaped + "=([^;]*)"),
  );
  if (!match) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/** First-touch attribution held for the current tab session. */
function readStored(): Partial<Attribution> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Attribution>) : {};
  } catch {
    return {};
  }
}

function persist(data: Attribution): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private mode / quota — attribution is best-effort */
  }
}

/**
 * Resolve the visitor's attribution context. Fresh query params win over
 * stored first-touch values; cookies win for _fbc/_fbp; referrer and landing
 * path are first-touch. Returns {} on the server so callers can spread freely.
 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const stored = readStored();
  const out: Attribution = { ...stored };

  // UTMs — a fresh set in the URL overrides the stored first-touch values.
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) out[key] = cap(v.trim(), 200);
  }

  // Meta click id from the URL (fbclid), falling back to any stored value.
  const fbclid = params.get("fbclid") || stored.fbclid;
  if (fbclid) out.fbclid = cap(fbclid.trim(), 400);

  // _fbc: prefer the real cookie; else keep stored; else synthesize from fbclid
  // using Meta's documented format fb.1.<timestamp>.<fbclid>.
  const fbcCookie = readCookie("_fbc");
  if (fbcCookie) out.fbc = cap(fbcCookie);
  else if (out.fbc) out.fbc = cap(out.fbc);
  else if (out.fbclid) out.fbc = `fb.1.${Date.now()}.${out.fbclid}`;

  // _fbp: prefer the real cookie; else keep stored.
  const fbpCookie = readCookie("_fbp");
  if (fbpCookie) out.fbp = cap(fbpCookie);

  // First-touch referrer + landing path.
  if (!out.referrer && document.referrer) out.referrer = cap(document.referrer);
  if (!out.landing_path) {
    out.landing_path = cap(window.location.pathname + window.location.search);
  }

  persist(out);
  return out;
}
