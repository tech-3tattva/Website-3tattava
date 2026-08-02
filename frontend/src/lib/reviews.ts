// ─────────────────────────────────────────────────────────
// 3Tattva — Product Reviews (custom, real-data only)
// Shared shapes + fetch helpers for the product-review system.
// NEVER fabricate ratings: aggregate markup only surfaces when
// the backend reports real, approved reviews (count > 0).
// ─────────────────────────────────────────────────────────

import { api } from "@/lib/api";

/** A single approved product review as returned by the API. */
export interface ProductReview {
  rating: number;
  title: string;
  body: string;
  authorName: string;
  verifiedBuyer: boolean;
  photos: string[];
  createdAt: string;
}

/** Rating distribution keyed by star value ("1".."5"). */
export type RatingDistribution = Record<string, number>;

/** GET /product-reviews/:slug response. */
export interface ProductReviewsResponse {
  average: number;
  count: number;
  distribution: RatingDistribution;
  reviews: ProductReview[];
}

/** POST /product-reviews body. */
export interface CreateReviewPayload {
  slug: string;
  rating: number;
  title: string;
  body: string;
  name: string;
  email: string;
  photos?: string[];
}

/** POST /product-reviews response. */
export interface CreateReviewResponse {
  review: ProductReview;
  verifiedBuyer: boolean;
}

/** Client-side: fetch approved reviews + aggregate for a product slug. */
export function getProductReviews(slug: string) {
  return api.get<ProductReviewsResponse>(
    `/product-reviews/${encodeURIComponent(slug)}`,
  );
}

/** Client-side: submit a new review (server decides verifiedBuyer + status). */
export function submitProductReview(payload: CreateReviewPayload) {
  return api.post<CreateReviewResponse>("/product-reviews", payload);
}

// ── Server-side aggregate (for AggregateRating JSON-LD) ──────
// Product detail pages are server components; they fetch the aggregate at
// request time so schema.org AggregateRating is emitted ONLY for products
// with real reviews. On any failure (or count === 0) we return null and the
// caller omits aggregateRating entirely — we never invent a rating.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

/**
 * Fetch { ratingValue, reviewCount } for a slug, or null when there are no
 * reviews or the request fails. Safe to call from server components.
 */
export async function fetchAggregateRating(
  slug: string,
): Promise<AggregateRating | null> {
  try {
    const res = await fetch(
      `${API_BASE}/product-reviews/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ProductReviewsResponse;
    if (!data || typeof data.count !== "number" || data.count <= 0) return null;
    const ratingValue = Math.round((data.average ?? 0) * 10) / 10;
    if (!(ratingValue > 0)) return null;
    return { ratingValue, reviewCount: data.count };
  } catch {
    return null;
  }
}
