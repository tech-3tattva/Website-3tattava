// ─────────────────────────────────────────────────────────
// 3Tattva — Products API Helper
// Wraps all product-related API calls.
// Uses mock data when NEXT_PUBLIC_USE_MOCK=true.
// Switches to real API when USE_MOCK=false — no other
// changes needed anywhere in the app.
// ─────────────────────────────────────────────────────────

import type { Product, ProductsResponse } from "@shared/types";
import { PLACEHOLDER_PRODUCTS } from "./placeholder-data";
import { USE_MOCK } from "./api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ── Normalize placeholder data to match Product interface ──
// placeholder-data.ts uses `image` (string), Product uses
// `images` (string[]). This bridges the gap.
function normalizePlaceholder(p: (typeof PLACEHOLDER_PRODUCTS)[0]): Product {
  return {
    id: p.id ?? p.slug,
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: (p as unknown as { images?: string[] }).images ?? [
      (p as unknown as { image?: string }).image ?? "/placeholder.svg",
    ],
    price: p.price,
    mrp: p.mrp,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
    dosha: p.dosha as ("Vata" | "Pitta" | "Kapha")[] | undefined,
    stockQuantity:
      (p as unknown as { stockQuantity?: number }).stockQuantity ?? 99,
    isActive: true,
    categoryLabel:
      (p as unknown as { categoryLabel?: string }).categoryLabel ??
      p.category.toUpperCase().replace(/-/g, " "),
  };
}

function getFallbackProducts(): Product[] {
  return PLACEHOLDER_PRODUCTS.map(normalizePlaceholder);
}

// ── Get products list with optional filters ──────────────
export async function getProducts(params?: {
  category?: string;
  dosha?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ProductsResponse> {
  if (USE_MOCK) {
    let results = PLACEHOLDER_PRODUCTS.map(normalizePlaceholder);

    if (params?.category) {
      results = results.filter((p) => p.category === params.category);
    }
    if (params?.dosha) {
      results = results.filter((p) =>
        p.dosha?.includes(params.dosha as "Vata" | "Pitta" | "Kapha")
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      );
    }
    if (params?.sort === "price-asc") {
      results = [...results].sort((a, b) => a.price - b.price);
    }
    if (params?.sort === "price-desc") {
      results = [...results].sort((a, b) => b.price - a.price);
    }
    if (params?.sort === "rating") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    }

    return {
      products: results,
      total: results.length,
      page: 1,
      totalPages: 1,
    };
  }

  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.dosha) query.set("dosha", params.dosha);
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  try {
    const res = await fetch(`${BASE_URL}/products?${query}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch {
    const products = getFallbackProducts();
    return {
      products,
      total: products.length,
      page: 1,
      totalPages: 1,
    };
  }
}

// ── Get single product by slug ───────────────────────────
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (USE_MOCK) {
    const found = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
    return found ? normalizePlaceholder(found) : null;
  }

  try {
    const res = await fetch(`${BASE_URL}/products/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    const found = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
    return found ? normalizePlaceholder(found) : null;
  }
}

// ── Get featured products (homepage best sellers) ────────
export async function getFeaturedProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    return PLACEHOLDER_PRODUCTS.filter(
      (p) => (p as unknown as { isFeatured?: boolean }).isFeatured
    )
      .slice(0, 8)
      .map(normalizePlaceholder);
  }

  try {
    const res = await fetch(`${BASE_URL}/products/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return PLACEHOLDER_PRODUCTS.filter(
      (p) => (p as unknown as { isFeatured?: boolean }).isFeatured
    )
      .slice(0, 8)
      .map(normalizePlaceholder);
  }
}

// ── Get new arrivals ─────────────────────────────────────
export async function getNewArrivals(): Promise<Product[]> {
  if (USE_MOCK) {
    return PLACEHOLDER_PRODUCTS.slice(0, 4).map(normalizePlaceholder);
  }

  try {
    const res = await fetch(`${BASE_URL}/products?sort=newest&limit=4`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ProductsResponse = await res.json();
    return data.products;
  } catch {
    return PLACEHOLDER_PRODUCTS.slice(0, 4).map(normalizePlaceholder);
  }
}

// ── Get related products ─────────────────────────────────
export async function getRelatedProducts(
  slug: string,
  category: string
): Promise<Product[]> {
  if (USE_MOCK) {
    return PLACEHOLDER_PRODUCTS.filter(
      (p) => p.category === category && p.slug !== slug
    )
      .slice(0, 4)
      .map(normalizePlaceholder);
  }

  try {
    const res = await fetch(`${BASE_URL}/products/${slug}/related`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return PLACEHOLDER_PRODUCTS.filter(
      (p) => p.category === category && p.slug !== slug
    )
      .slice(0, 4)
      .map(normalizePlaceholder);
  }
}
