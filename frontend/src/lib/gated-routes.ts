/**
 * Routes that are not ready yet. The middleware rewrites them to /coming-soon,
 * which is served `noindex`.
 *
 * Shared so the sitemap can exclude them automatically: listing a gated route
 * in the sitemap tells Google to index a page that then refuses indexing, which
 * is how /community ended up counted among the "not indexed" pages in Search
 * Console. Add a route here and both sides stay consistent.
 */
export const GATED_ROUTES: ReadonlySet<string> = new Set([
  "/dosha-quiz",
  "/gifting",
  "/community",
]);
