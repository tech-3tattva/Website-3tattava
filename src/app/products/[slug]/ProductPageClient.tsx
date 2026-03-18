"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import QuantityStepper from "@/components/product/QuantityStepper";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import StarRating from "@/components/ui/StarRating";
import AccordionSection from "@/components/ui/AccordionSection";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { PlaceholderProduct } from "@/lib/placeholder-data";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";

const INGREDIENTS = [
  {
    name: "Ashwagandha",
    benefit:
      "Reduces cortisol levels, builds physical endurance, and calms the nervous system — the ultimate adaptogen.",
  },
  {
    name: "Turmeric",
    benefit:
      "Powerful anti-inflammatory and antioxidant. Supports skin glow and joint health.",
  },
  {
    name: "Saffron",
    benefit:
      "Promotes radiance and even tone. Traditionally used for vitality and mood.",
  },
];

export default function ProductPageClient({
  product,
}: {
  product: PlaceholderProduct;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const images = [product.image, product.image, product.image];

  const handleAddToBag = () => {
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      mrp: product.mrp ?? product.price,
      quantity: qty,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const related = PLACEHOLDER_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || (p.dosha && product.dosha && p.dosha.some((d) => product.dosha!.includes(d))))
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: product.categoryLabel, href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="sticky top-24 self-start">
          <ProductGallery images={images} alt={product.name} />
        </div>

        <div>
          <p
            className="text-gold text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--color-gold)" }}
          >
            {product.categoryLabel}
            {product.dosha?.length ? ` · ${product.dosha.join(" / ")}` : ""}
          </p>
          <h1
            className="font-display text-3xl md:text-4xl text-text-dark mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <StarRating value={product.rating} showValue />
            <Link
              href="#reviews"
              className="text-text-light text-sm hover:underline"
            >
              {product.reviewCount} Reviews
            </Link>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold text-text-dark">
              {formatPrice(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="ml-2 text-text-light line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            <p className="text-text-light text-sm mt-1">
              MRP inclusive of all taxes
            </p>
          </div>
          {product.dosha && product.dosha.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.dosha.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 rounded-full text-sm bg-primary-green/10 text-primary-green"
                >
                  Best for {d}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              type="button"
              onClick={() => toggle(product.id)}
              className="p-3 border border-border rounded hover:bg-beige transition-colors"
              aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={22}
                className={isWishlisted(product.id) ? "fill-gold text-gold" : ""}
              />
            </button>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="w-full mb-6"
            onClick={handleAddToBag}
          >
            {added ? "Added ✓" : "ADD TO BAG"}
          </Button>
          <div className="flex gap-6 text-sm text-text-medium">
            <span>🌿 Natural</span>
            <span>🔬 Clinically Tested</span>
            <span>🐰 Cruelty Free</span>
          </div>

          <div className="mt-8 space-y-0">
            <AccordionSection title="Description" defaultOpen>
              <p>
                An authentic Ayurvedic formulation combining time-tested herbs
                for visible results. Crafted in GMP-certified facilities with
                clinically tested ingredients.
              </p>
            </AccordionSection>
            <AccordionSection title="Key Benefits">
              <ul className="list-disc list-inside space-y-1">
                <li>Supports balanced, radiant skin</li>
                <li>Formulated for your dosha</li>
                <li>100% natural ingredients</li>
              </ul>
            </AccordionSection>
            <AccordionSection title="How to Use">
              <p>Apply daily after cleansing. For best results use on slightly damp skin.</p>
            </AccordionSection>
            <AccordionSection title="Ingredients">
              <p className="mb-2">Full ingredient list:</p>
              <p className="text-text-light">
                Aqua, Aloe Vera, Turmeric Extract, Ashwagandha, Saffron, and other natural ingredients.
              </p>
            </AccordionSection>
            <AccordionSection title="Dosha Profile">
              <p>
                This product is formulated to balance {product.dosha?.join(" and ") || "all doshas"}.
                Suitable for daily use as part of your dinacharya.
              </p>
            </AccordionSection>
          </div>
        </div>
      </div>

      {/* Key Ingredients */}
      <section className="py-12 border-t border-border">
        <p
          className="text-gold text-xs uppercase tracking-wider mb-1"
          style={{ color: "var(--color-gold)" }}
        >
          Key Ingredients
        </p>
        <h2
          className="font-display text-3xl md:text-[38px] text-text-dark mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          What&apos;s Inside That Really Matters
        </h2>
        <Link href="#ingredients" className="text-primary-green text-sm hover:underline mb-8 inline-block">
          View Full List
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INGREDIENTS.map((ing) => (
            <div key={ing.name} className="text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-md border border-border mx-auto mb-3 overflow-hidden">
                <div className="w-full h-full bg-beige" />
              </div>
              <p className="font-semibold text-text-dark text-sm">{ing.name}</p>
              <p className="text-text-medium text-xs mt-1 line-clamp-3">
                {ing.benefit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="py-12 bg-beige-dark rounded-xl px-6 mb-12">
        <p
          className="text-gold text-xs uppercase tracking-wider mb-2"
          style={{ color: "var(--color-gold)" }}
        >
          How to Use
        </p>
        <p className="text-text-dark font-medium mb-2">Daily, after cleansing the skin.</p>
        <p className="text-text-medium text-sm mb-4">
          For best results use on slightly damp skin just after bath or shower.
        </p>
        <div className="bg-beige/80 rounded-lg p-4 border border-border">
          <p className="font-semibold text-text-dark text-sm">Insider Edge:</p>
          <p className="text-text-medium text-sm italic mt-1">
            Applying on slightly damp skin after a shower maximizes absorption and moisturizing benefits.
          </p>
        </div>
      </section>

      {/* Customer Reviews - simplified */}
      <section id="reviews" className="py-12">
        <h2 className="font-display text-3xl text-text-dark mb-6">
          Customer Reviews
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="font-display text-6xl text-text-dark">{product.rating}</span>
          <div>
            <StarRating value={product.rating} size="md" />
            <p className="text-text-light text-sm mt-1">Based on {product.reviewCount} reviews</p>
          </div>
          <button
            type="button"
            className="ml-auto px-6 py-2 rounded-full bg-text-dark text-white text-sm font-medium hover:bg-primary-green"
          >
            Write A Review
          </button>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl text-text-dark mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
