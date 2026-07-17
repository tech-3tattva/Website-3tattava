import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Phased go-live gate.
 *
 * Public: storefront (Home, Shop, Products, Lab Reports) + commerce flow (cart,
 * checkout, account, order confirmation, login/register) + the admin panel.
 * Everything else is rewritten to /coming-soon until it is launched.
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
  // Legal / policy pages — required live for Razorpay KYC review.
  "/privacy",
  "/terms",
  "/returns",
  "/shipping",
  "/contact",
  "/about",
  "/cookies",
  "/medical-disclaimer",
  "/payment",
  "/intellectual-property",
  "/grievance",
  "/coming-soon",
]);

// Path prefixes that are fully public: the commerce flow, customer account, and admin panel.
const PUBLIC_PREFIXES = [
  "/checkout",
  "/account",
  "/order-confirmation",
  "/admin",
  "/login",
  "/register",
  "/track-order",
  "/education",
];

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

  // Local development shows every page — the phased go-live gate applies to production only.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  if (PUBLIC_ROUTES.has(pathname)) return NextResponse.next();
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything EXCEPT Next internals, the API, and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
