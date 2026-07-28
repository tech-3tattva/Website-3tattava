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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
