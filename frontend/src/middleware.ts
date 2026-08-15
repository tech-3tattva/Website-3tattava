import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Launch gate.
 *
 * The site is live. Only a small set of not-yet-ready routes are still held
 * behind /coming-soon; every other unknown path falls through to Next.js so a
 * genuine 404 (app/not-found.tsx) is returned instead of a soft-200 coming-soon
 * page. Static files, /_next and /api are excluded via the matcher below.
 */
const GATED_ROUTES = new Set<string>([
  "/dosha-quiz",
  "/gifting",
  "/community",
]);

// Product detail pages are now LIVE (un-gated). Left empty so PDPs render directly;
// re-add a slug here to hide it behind the /products page again if ever needed.
const HIDDEN_PRODUCTS = new Set<string>([]);

// URL variants (typed / printed / QR) that permanently redirect to the canonical route.
const REDIRECTS: Record<string, string> = {
  "/labreports": "/lab-reports",
  "/labreport": "/lab-reports",
  "/lab-report": "/lab-reports",
};

// ── WTF Gyms QR redirect layer ──────────────────────────────────────────────
// 28 physical standees in WTF gyms across Delhi NCR. Each QR points to
// /g/<slug> which 302-redirects to /find-us with gym-specific UTM tags.
// Uses 302 (not 301) so the destination can change without stale browser caches.
// Slugs are FINAL — changing one after printing kills that gym's standee.
const QR_REDIRECTS: Record<string, string> = {
  "noida-sec16":          "wtf_noida_sec16",
  "noida-sec22":          "wtf_noida_sec22",
  "noida-sec70":          "wtf_noida_sec70",
  "indirapuram":          "wtf_indirapuram_nyaykhand3",
  "new-ashok-nagar":      "wtf_new_ashok_nagar",
  "najafgarh":            "wtf_najafgarh",
  "noida-sec122":         "wtf_noida_sec122",
  "noida-sec116":         "wtf_noida_sec116",
  "noida-sec121":         "wtf_noida_sec121_parthala",
  "shalimar-garden":      "wtf_ghaziabad_shalimar_garden",
  "noida-west-sec1":      "wtf_noida_west_sec1",
  "raj-nagar":            "wtf_ghaziabad_raj_nagar",
  "dwarka-sec10":         "wtf_dwarka_sec10",
  "rohini-sec24":         "wtf_rohini_sec24",
  "rohini-sec23":         "wtf_rohini_sec23",
  "dwarka-sec17":         "wtf_dwarka_sec17",
  "nehru-nagar":          "wtf_ghaziabad_nehru_nagar",
  "shakti-khand":         "wtf_ghaziabad_shakti_khand",
  "mayur-vihar-3":        "wtf_mayur_vihar_ph3",
  "janakpuri":            "wtf_janakpuri",
  "ace-city":             "wtf_bisrakh_ace_city_sec1",
  "greenfield-faridabad": "wtf_faridabad_greenfield",
  "shahdara":             "wtf_shahdara",
  "punjabi-bagh":         "wtf_punjabi_bagh",
  "gurugram-sec4":        "wtf_gurugram_sec4",
  "gurugram-sec7":        "wtf_gurugram_sec7",
  "govindpuram":          "wtf_ghaziabad_govindpuram",
  "raj-nagar-ext":        "wtf_ghaziabad_raj_nagar_ext",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── QR gym redirects: /g/<slug> → /find-us?utm_… (302) ──
  // When the WTF collab landing page (/wtf-gym) is ready with assets,
  // change "/find-us" below to "/wtf-gym" — one-line switch, no reprint.
  if (pathname.startsWith("/g/")) {
    const slug = pathname.slice(3); // strip "/g/"
    const campaign = QR_REDIRECTS[slug];
    if (campaign) {
      const dest = req.nextUrl.clone();
      dest.pathname = "/find-us";
      dest.searchParams.set("utm_source", "qr_code");
      dest.searchParams.set("utm_medium", "offline");
      dest.searchParams.set("utm_campaign", campaign);
      return NextResponse.redirect(dest, 302);
    }
    // Unknown /g/ slug → 404 (falls through to Next.js not-found)
    return NextResponse.next();
  }

  const redirectTo = REDIRECTS[pathname];
  if (redirectTo) {
    const dest = req.nextUrl.clone();
    dest.pathname = redirectTo;
    return NextResponse.redirect(dest, 308);
  }

  // Local development shows every page — the launch gate applies to production only.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  if (HIDDEN_PRODUCTS.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/products";
    return NextResponse.redirect(url, 307);
  }

  // Hold only the explicitly-gated stubs; everything else (including unknown
  // paths, which must 404) passes through to Next.js.
  if (GATED_ROUTES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything EXCEPT Next internals, the API, and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
