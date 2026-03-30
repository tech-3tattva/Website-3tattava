"use client";

import { useState } from "react";
import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@shared/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { HOME_ASSETS } from "@/lib/home-assets";

const DEFAULT_TAGS = [
  "Fulvic Acid Boost",
  "Enhance Stamina",
  "Cognitive Clarity",
];

export default function FeaturedProductSpotlight({
  product,
}: {
  product: Product;
}) {
  const { addItem } = useCart();
  const [cartError, setCartError] = useState<string | null>(null);
  const image = product.images?.[0] || "/placeholder.svg";
  const tags = product.ingredients?.slice(0, 3).map((item) => item.name) || DEFAULT_TAGS;
  const caution =
    product.dosha?.includes("Pitta")
      ? "Heat generating. Consult an Ayurvedic expert if you have a high Pitta profile."
      : "Best taken mindfully as part of your daily Ayurvedic ritual.";

  return (
    <motion.section
      className="bg-[#f5efe6]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row min-h-[620px]">
        <div className="hidden lg:flex w-12 bg-[#eae5db] items-center justify-center border-r border-[#c5905a]/20">
          <span className="-rotate-90 whitespace-nowrap text-xs tracking-[0.3em] uppercase text-text-medium">
            Featured Product
          </span>
        </div>

        <div className="relative lg:w-1/2 bg-[#b35e34] overflow-hidden px-8 py-14 md:px-12 lg:px-20 flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={HOME_ASSETS.spotlightTexture}
              alt=""
              fill
              className="object-cover opacity-[0.22] blur-[1px] scale-105 mix-blend-luminosity"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div
            className="pointer-events-none absolute right-6 top-6 z-[1] h-24 w-24 text-white/10"
            aria-hidden
          >
            <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
              <path
                d="M40 8 L46 34 L72 34 L50 48 L58 74 L40 60 L22 74 L30 48 L8 34 L34 34 Z"
                stroke="currentColor"
                strokeWidth="0.8"
              />
            </svg>
          </div>
          <div
            className="absolute inset-0 z-[1] opacity-20"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 32%), radial-gradient(circle at 78% 35%, rgba(255,255,255,0.14), transparent 24%), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.12), transparent 28%)",
            }}
          />
          <div className="relative z-[2] w-full max-w-md aspect-square rounded-full bg-[radial-gradient(circle,_rgba(245,239,230,0.22)_0%,_rgba(245,239,230,0.02)_65%,_transparent_100%)] border border-[#f1d2b4]/30 shadow-[0_0_80px_rgba(197,144,90,0.25)]">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-10 drop-shadow-2xl"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
        </div>

        <div className="lg:w-1/2 bg-[#f8f5f0] px-8 py-14 md:px-12 lg:px-20 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#c5905a] mb-3">
            Himalayan Shilajit
          </p>
          <h2
            className="text-4xl md:text-5xl text-text-dark mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {product.name}
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-text-light/30 px-3 py-1 text-[11px] rounded-sm text-text-medium uppercase tracking-[0.2em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-text-medium mb-8">
            {product.shortDescription ||
              "A premium Ayurvedic resin crafted for energy, stamina, and daily vitality."}
          </p>

          <div className="bg-[#eae5db] border border-[#c5905a]/25 rounded-lg p-4 flex items-start gap-3 mb-8">
            <span className="text-xl" aria-hidden>
              {product.dosha?.includes("Pitta") ? "🔥" : "🌿"}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-text-dark mb-1">
                {product.dosha?.includes("Pitta") ? "Pitta Caution" : "Ayurvedic Note"}
              </h3>
              <p className="text-xs text-text-medium leading-relaxed">{caution}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span
              className="text-3xl text-text-dark"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {formatPrice(product.price)}
            </span>
            <button
              type="button"
              onClick={async () => {
                setCartError(null);
                try {
                  await addItem({
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    image,
                    price: product.price,
                    mrp: product.mrp ?? product.price,
                    quantity: 1,
                    slug: product.slug,
                  });
                } catch (err) {
                  const msg =
                    err instanceof Error
                      ? err.message
                      : "Could not add to cart. Refresh the page and try again.";
                  setCartError(msg);
                }
              }}
              className="rounded-full bg-[#b35e34] px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#382d24]"
            >
              Add to Cart
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-medium uppercase tracking-[0.2em] text-text-dark hover:text-primary-green transition-colors"
            >
              View details
            </Link>
          </div>
          {cartError && (
            <p className="mt-4 text-sm text-red-600 leading-snug" role="alert">
              {cartError}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
