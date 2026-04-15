"use client";

import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { Product } from "@shared/types";
import { HOME_ASSETS } from "@/lib/home-assets";
import { HERO } from "@/lib/brand-content";

export default function HeroCarousel({ heroProduct }: { heroProduct?: Product }) {
  const image = heroProduct?.images?.[0] || "/placeholder.svg";

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,#a85a32_0%,#3a2f26_100%)] text-white"
      aria-label="Homepage hero"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={HOME_ASSETS.heroAmbient}
          alt=""
          fill
          className="object-cover opacity-[0.28] mix-blend-soft-light"
          sizes="100vw"
          loading="lazy"
          quality={65}
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_35%,rgba(245,239,230,0.12),transparent_24%),radial-gradient(circle_at_18%_20%,rgba(245,239,230,0.08),transparent_30%)]" />
      <div
        className="pointer-events-none absolute -right-4 top-1/4 h-64 w-64 text-white/[0.07] md:right-8"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M100 28 L118 92 L184 92 L130 132 L152 196 L100 160 L48 196 L70 132 L16 92 L82 92 Z"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity={0.9}
          />
        </svg>
      </div>
      <div className="relative z-[2] max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 flex flex-col lg:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="lg:w-1/2 z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[#dcb375] uppercase tracking-[0.28em] text-xs mb-4"
          >
            India&apos;s First Performance Ayurveda Brand
          </motion.p>
          <h1
            className="font-display text-5xl lg:text-7xl leading-[0.95] mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="block"
            >
              {HERO.headline}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
              className="block italic text-[#e8c99a]"
            >
              {HERO.headlineAccent}
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="text-base lg:text-lg font-light mb-8 max-w-xl text-white/85 leading-relaxed"
          >
            {HERO.subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href={HERO.primaryCta.href}>
              <Button variant="primary" size="lg" className="min-w-[240px]">
                {HERO.primaryCta.label}
              </Button>
            </Link>
            <Link href={HERO.secondaryCta.href}>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[240px] border-white text-white hover:bg-white hover:text-[#3a2f26]"
              >
                {HERO.secondaryCta.label}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(197,144,90,0.22)_0%,_rgba(197,144,90,0.06)_58%,_transparent_100%)] border border-[#dcb375]/30 shadow-[0_0_100px_rgba(197,144,90,0.28)] transition-shadow duration-500 hover:shadow-[0_0_120px_rgba(197,144,90,0.35)]">
            <Image
              src={image}
              alt={heroProduct?.name || "Pure Himalayan Shilajit Resin by 3TATTAVA"}
              fill
              className="object-contain p-10"
              sizes="(max-width: 1024px) 90vw, 42vw"
              priority
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-[2] flex justify-center gap-2">
        <span className="h-1 w-8 rounded-full bg-[#dcb375]" />
        <span className="h-2 w-2 rounded-full bg-white/50 mt-[-2px]" />
        <span className="h-2 w-2 rounded-full bg-white/50 mt-[-2px]" />
      </div>
    </section>
  );
}
