"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-cream group cursor-crosshair">
        <Image
          src={mainImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-white/90 text-xs font-medium">
          GMP Certified
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
              i === activeIndex ? "border-gold" : "border-transparent"
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
