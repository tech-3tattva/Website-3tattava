"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { HINDI_TAGLINE } from "@/lib/constants";

const SLIDES = [
  {
    headline: "Ancient Wisdom, Modern Life",
    subheadline: "Authentic Ayurveda formulated for today.",
    eyebrow: "Authentically Ayurvedic",
    ctaPrimary: "Explore Collection",
    ctaSecondary: "Take Dosha Quiz",
    bg: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%), url(/placeholder.svg?height=1080&width=1920) center/cover",
  },
  {
    headline: "Balance. Build. Become.",
    subheadline: "Your dosha-guided journey starts here.",
    eyebrow: "Authentically Ayurvedic",
    ctaPrimary: "Explore Collection",
    ctaSecondary: "Take Dosha Quiz",
    bg: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%), url(/placeholder.svg?height=1080&width=1920) center/cover",
  },
  {
    headline: "Rooted in Nature",
    subheadline: "Every ingredient has a story and a source.",
    eyebrow: "Authentically Ayurvedic",
    ctaPrimary: "Explore Collection",
    ctaSecondary: "Take Dosha Quiz",
    bg: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%), url(/placeholder.svg?height=1080&width=1920) center/cover",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section
      className="relative w-full h-[60vh] tablet:h-screen overflow-hidden"
      aria-label="Hero carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{ background: slide.bg, backgroundColor: "#2D5A3D" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <p
              className="text-gold text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--color-gold)" }}
            >
              {slide.eyebrow}
            </p>
            <h1
              className="font-display text-4xl md:text-[72px] leading-tight font-semibold mb-3"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {slide.headline}
            </h1>
            <p className="text-white/80 text-lg mb-4">{slide.subheadline}</p>
            <p
              className="font-devanagari text-lg md:text-xl mb-6"
              style={{ color: "var(--color-gold)", fontFamily: "Noto Serif Devanagari, serif" }}
            >
              {HINDI_TAGLINE}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  {slide.ctaPrimary}
                </Button>
              </Link>
              <Link href="/dosha-quiz">
                <Button variant="outline" size="lg">
                  {slide.ctaSecondary}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? "bg-gold w-6" : "bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
