"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { PlaceholderProduct } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: PlaceholderProduct;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      mrp: product.mrp ?? product.price,
      quantity: 1,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
  };

  const badgeColor =
    product.badge === "Best Seller"
      ? "bg-primary-green"
      : product.badge === "New"
        ? "bg-gold text-text-dark"
        : "bg-gold/90 text-text-dark";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-400 group-hover:scale-105"
          )}
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white ${badgeColor}`}
          >
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={isWishlisted(product.id) ? "fill-gold text-gold" : "text-text-dark"}
          />
        </button>
      </div>
      <div className="p-4">
        <p
          className="text-gold text-[11px] uppercase tracking-wider mb-1"
          style={{ color: "var(--color-gold)" }}
        >
          {product.categoryLabel}
        </p>
        <h3 className="font-sans font-medium text-text-dark text-[15px] line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-gold">★</span>
          <span className="text-text-light text-sm">
            {product.rating} · {product.reviewCount} reviews
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-semibold text-text-dark">{formatPrice(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-text-light text-sm line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2.5 border border-border rounded font-medium text-sm hover:bg-beige transition-colors"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
