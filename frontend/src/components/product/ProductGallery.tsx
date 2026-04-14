"use client";

import { useState } from "react";
import Image from "@/components/ui/SafeImage";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badges?: string[];
}

export default function ProductGallery({
  images,
  alt,
  badges = ["Expert Quality", "GMP Certified"],
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-sm overflow-hidden bg-[#f5efe6] group border border-border p-6 md:p-8">
        <Image
          src={mainImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105 p-8"
          priority
        />
        <div className="absolute top-5 right-5 flex flex-col gap-3">
          {badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="h-[72px] w-[72px] rounded-full bg-[#af754d] border-[4px] border-[#ce9b6f] px-2 text-center text-[10px] font-bold uppercase leading-tight text-white shadow-md flex items-center justify-center"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 bg-white transition-colors ${
              i === activeIndex ? "border-gold" : "border-border/60"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} view ${i + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
