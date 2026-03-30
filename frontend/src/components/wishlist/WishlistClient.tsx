"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@shared/types";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { getProducts } from "@/lib/products";

export default function WishlistClient() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const { products: allProducts } = await getProducts({ limit: 200 });
        if (!mounted) return;
        setProducts(allProducts);
      } catch {
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const wishlistedProducts = useMemo(() => {
    const wanted = new Set(items);
    return products.filter((product) => wanted.has(product.id));
  }, [items, products]);

  if (loading) {
    return (
      <main className="min-h-[60vh] px-4 py-12 md:py-16">
        <section className="max-w-3xl mx-auto premium-card p-8 text-center">
          <h1
            className="text-4xl md:text-5xl text-primary-green mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Wishlist
          </h1>
          <p className="text-text-medium">Loading your saved products...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] px-4 py-12 md:py-16">
      {wishlistedProducts.length === 0 ? (
        <section className="max-w-3xl mx-auto premium-card p-8 text-center">
          <h1
            className="text-4xl md:text-5xl text-primary-green mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Wishlist
          </h1>
          <p className="text-text-medium mb-6">
            Your saved products will appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-primary-green text-white px-6 py-3 hover:bg-secondary-green transition-colors"
          >
            Continue Shopping
          </Link>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto">
          <div className="premium-card p-6 md:p-8 mb-8 bg-gradient-to-r from-cream to-beige">
            <h1
              className="font-display text-4xl md:text-5xl text-text-dark mb-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Wishlist
            </h1>
            <p className="text-text-medium">
              {wishlistedProducts.length} saved{" "}
              {wishlistedProducts.length === 1 ? "product" : "products"}.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
