import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Phased go-live gate.
 *
 * Only the storefront (Home, Shop, both Product pages, Lab Reports) is public.
 * Every other route is rewritten to /coming-soon until it is launched.
 * Static files, /_next, and /api are excluded via the matcher below, so assets
 * and backend calls keep working.
 */
const PUBLIC_ROUTES = new Set<string>([
  "/",
  "/products",
  "/shop",
  "/products/shahjeet-sticks",
  "/products/shodhit-shilajit-resin",
  "/lab-reports",
  "/coming-soon",
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ROUTES.has(pathname)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything EXCEPT Next internals, the API, and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
