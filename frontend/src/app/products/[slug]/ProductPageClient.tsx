"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@shared/types";
import ProductGallery from "@/components/product/ProductGallery";
import QuantityStepper from "@/components/product/QuantityStepper";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import StarRating from "@/components/ui/StarRating";
import AccordionSection from "@/components/ui/AccordionSection";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useDeliveryPincode } from "@/context/DeliveryPincodeContext";
import { formatPrice } from "@/lib/utils";

const DEFAULT_INGREDIENTS = [
  {
    name: "Shudh Shilajit",
    benefit:
      "A mineral-rich Ayurvedic resin traditionally used to support strength, energy, and stamina.",
  },
  {
    name: "Fulvic Complex",
    benefit:
      "Supports nutrient transport and enhances the body’s ability to absorb trace minerals.",
  },
  {
    name: "Mineral Resin",
    benefit:
      "Delivers a grounding daily ritual that complements recovery, focus, and vitality.",
  },
];

const DEFAULT_BENEFITS = [
  "Boosts daily energy and stamina",
  "Supports recovery and resilience",
  "Promotes cognitive clarity",
  "Complements immunity and vitality",
  "Enhances mineral nourishment",
  "Fits easily into a daily Ayurvedic ritual",
];

function getDoshaChip(dosha: "Vata" | "Pitta" | "Kapha") {
  if (dosha === "Vata") {
    return {
      label: "Vata",
      className: "bg-[#e0eff8] text-[#3478b8] border-[#b2d9f2]",
    };
  }
  if (dosha === "Pitta") {
    return {
      label: "Pitta Caution",
      className: "bg-[#fbebe3] text-[#cf6a26] border-[#f3ccb5]",
    };
  }
  return {
    label: "Kapha",
    className: "bg-[#d0eef1] text-[#0a5c68] border-[#9edadd]",
  };
}

function buildUsageSteps(product: Product) {
  const source = product.howToUse?.length
    ? product.howToUse
    : [
        "Measure a pea-sized portion.",
        "Mix into warm water or milk.",
        "Consume slowly as part of your routine.",
        "Repeat daily for best results.",
      ];

  return source.slice(0, 4).map((step, index) => {
    const [title, ...rest] = step.split(".");
    return {
      title: title.trim() || `Step ${index + 1}`,
      body: rest.join(".").trim() || step,
    };
  });
}

export default function ProductPageClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { openModal, pincode, lastCheck } = useDeliveryPincode();

  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const ingredients = product.ingredients?.length
    ? product.ingredients
    : DEFAULT_INGREDIENTS;
  const benefits = ingredients.map((item) => item.benefit).slice(0, 6);
  const usageSteps = buildUsageSteps(product);
  const primaryIngredient = ingredients[0];
  const galleryBadges = product.dosha?.includes("Pitta")
    ? ["Expert Quality", "Pitta Aware"]
    : ["Expert Quality", "GMP Certified"];

  const handleAddToBag = async () => {
    setCartError(null);
    try {
      await addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        image: images[0],
        price: product.price,
        mrp: product.mrp ?? product.price,
        quantity: qty,
        slug: product.slug,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not add to cart. Refresh the page and try again.";
      setCartError(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="flex flex-col xl:flex-row gap-10 mb-16">
        <div className="xl:w-[44%] xl:sticky xl:top-24 self-start">
          <ProductGallery images={images} alt={product.name} badges={galleryBadges} />
        </div>

        <div className="xl:w-[56%] flex flex-col xl:flex-row gap-8">
          <div className="xl:w-[46%] space-y-6">
            <div className="border-b border-border pb-6">
              <div className="text-gold font-medium tracking-[0.22em] text-xs uppercase mb-2">
                {product.categoryLabel}
              </div>
              <h1
                className="font-display text-4xl md:text-5xl text-text-dark mb-2 tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {product.name}
              </h1>
              <h2
                className="font-display italic text-xl text-text-medium mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {product.shortDescription || "Pure Himalayan Shilajit Resin"}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {(product.dosha?.length ? product.dosha : ["Vata", "Pitta", "Kapha"]).map((dosha) => {
                  const chip = getDoshaChip(dosha as "Vata" | "Pitta" | "Kapha");
                  return (
                    <span
                      key={chip.label}
                      className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border font-medium ${chip.className}`}
                    >
                      {chip.label}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mb-5">
                <StarRating value={product.rating} showValue />
                <Link href="#reviews" className="text-text-light text-sm hover:underline">
                  {product.reviewCount} Reviews
                </Link>
              </div>

              <div className="text-3xl text-text-dark mb-2">
                {formatPrice(product.price)}
                {product.mrp && product.mrp > product.price && (
                  <span className="ml-2 text-base text-text-light line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
              </div>

              <div className="text-sm text-text-medium space-y-1">
                <button
                  type="button"
                  onClick={openModal}
                  className="text-gold hover:underline underline-offset-2 font-medium"
                >
                  Check delivery to your pincode
                </button>
                {pincode && lastCheck?.pincode === pincode && lastCheck.message && (
                  <p className="text-text-dark leading-snug">{lastCheck.message}</p>
                )}
              </div>
            </div>

            {product.dosha?.includes("Pitta") && (
              <div className="bg-[#ecdac2] p-4 shadow-sm flex gap-4 items-start">
                <div className="text-[#cf4932] text-2xl" aria-hidden>
                  ▲
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Important Pitta Caution</h3>
                  <p className="text-sm text-gray-800 leading-snug">
                    Not recommended for individuals with high Pitta without professional consultation.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} />
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className="p-3 border border-border rounded hover:bg-beige transition-colors"
                aria-label={
                  isWishlisted(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
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
              className="w-full bg-[#b75e40] hover:bg-[#a05238]"
              onClick={() => void handleAddToBag()}
            >
              {added ? "Added ✓" : "ADD TO CART"}
            </Button>
            {cartError && (
              <p className="text-sm text-red-600 leading-snug" role="alert">
                {cartError}
              </p>
            )}

            <div className="border border-border rounded-lg p-4 flex gap-4">
              <div className="w-24 h-24 rounded-md flex-shrink-0 bg-[#f8efe4] border border-border" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Key Ingredient</h3>
                <h4 className="font-semibold text-text-dark mb-1">{primaryIngredient.name}</h4>
                <p className="text-sm text-text-medium line-clamp-4">
                  {primaryIngredient.benefit}
                </p>
              </div>
            </div>
          </div>

          <div className="xl:w-[54%]">
            <div className="space-y-0">
              <AccordionSection title="Description" defaultOpen>
                <p>
                  {product.description ||
                    "A premium Ayurvedic formulation rooted in Himalayan tradition and adapted for modern daily vitality."}
                </p>
              </AccordionSection>
              <AccordionSection title="Benefits" defaultOpen>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
                  {(benefits.length ? benefits : DEFAULT_BENEFITS).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b75e40] flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
              <AccordionSection title="The Shilajit Swirl Method" defaultOpen>
                <div className="grid grid-cols-2 gap-3">
                  {usageSteps.map((step, index) => (
                    <div key={`${step.title}-${index}`} className="rounded-lg border border-border bg-[#f7ede2] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-text-light mb-2">
                        Step {index + 1}
                      </p>
                      <p className="font-semibold text-text-dark mb-1">{step.title}</p>
                      <p className="text-xs text-text-medium leading-relaxed">{step.body}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>
              <AccordionSection title="Ingredients">
                <ul className="space-y-2">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient.name} className="text-text-light">
                      <span className="font-medium text-text-dark">{ingredient.name}</span>
                      {" - "}
                      {ingredient.benefit}
                    </li>
                  ))}
                </ul>
              </AccordionSection>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12 border border-border rounded-lg p-6 md:p-8 bg-[#faf7f2]">
        <h2
          className="font-display text-3xl text-text-dark mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          How to Use
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usageSteps.map((step, index) => (
            <div key={`use-${step.title}-${index}`} className="text-center flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full border border-border bg-white flex items-center justify-center text-sm font-semibold text-text-dark">
                {index + 1}
              </div>
              <p className="text-sm font-bold text-text-dark">{step.title}</p>
              <p className="text-[11px] leading-relaxed text-text-light">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="py-12 premium-card p-6 md:p-8">
        <h2 className="font-display text-3xl text-text-dark mb-6">
          Customer Reviews
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="font-display text-6xl text-text-dark">{product.rating}</span>
          <div>
            <StarRating value={product.rating} size="md" />
            <p className="text-text-light text-sm mt-1">
              Based on {product.reviewCount} reviews
            </p>
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
