/**
 * Central media resolver.
 *
 * Set `NEXT_PUBLIC_CLOUDFRONT_URL=https://media.3tattava.com` to serve `/public`
 * assets from the CloudFront CDN. Leave it empty and assets are served locally by
 * Next.js from `/public` — a safe no-op default (nothing breaks before the CDN is live).
 *
 * Local `/public` paths are remapped to the S3/CloudFront folder layout
 * (see `S3_UPLOAD_GUIDE.md`), e.g. `/hero/x.png` -> `/features/hero/x.png`.
 * Absolute URLs (http/https/protocol-relative) and data: URIs pass through untouched.
 */
const CDN = (process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "").replace(/\/+$/, "");

const PREFIX_MAP: [string, string][] = [
  ["/hero/", "/features/hero/"],
  ["/home/", "/features/home/"],
  ["/rockresin/", "/products/rockresin/"],
  ["/shahjeet/", "/products/shahjeet/"],
  ["/logos/", "/brand/logos/"],
  ["/icons/", "/brand/icons/"],
  ["/lab-reports/", "/misc/lab-reports/"],
  ["/education/", "/blog/"],
  ["/posters/", "/banners/"],
  ["/team/", "/misc/team/"],
];

function remapToCdnPath(p: string): string {
  for (const [from, to] of PREFIX_MAP) {
    if (p.startsWith(from)) return to + p.slice(from.length);
  }
  // Already-canonical top folders pass through unchanged.
  if (p.startsWith("/brand/") || p.startsWith("/videos/") || p.startsWith("/products/")) return p;
  // Bare root-level files (favicon, og image, placeholder) live under misc/.
  if (/^\/[^/]+$/.test(p)) return `/misc${p}`;
  return p;
}

export function media(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!CDN) return p; // local dev / Vercel /public
  return CDN + remapToCdnPath(p);
}

export const CLOUDFRONT_URL = CDN;
