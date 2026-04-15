"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "@/components/ui/SafeImage";
import { ArrowRight } from "lucide-react";
import { FOUNDER } from "@/lib/brand-content";

/**
 * Dr. Kashish founder section.
 * Uses /assests/img5.png as placeholder until a real headshot is uploaded to S3.
 */
export default function FounderSection() {
  return (
    <section
      id="founder"
      className="relative bg-[#241e18] text-white py-20 md:py-28 px-4 overflow-hidden"
      aria-labelledby="founder-heading"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,165,116,0.15),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(179,94,52,0.12),transparent_40%)]"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="md:col-span-2 flex justify-center"
        >
          <div className="relative w-[260px] h-[320px] md:w-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <Image
              src="/assests/img5.png"
              alt={`${FOUNDER.header}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 260px, 300px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="md:col-span-3"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#dcb375] mb-3">
            Meet the Founder
          </p>
          <h2
            id="founder-heading"
            className="font-display text-3xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {FOUNDER.header}
          </h2>
          <blockquote className="text-lg md:text-xl text-white/90 italic leading-relaxed border-l-2 border-gold/60 pl-5">
            &ldquo;{FOUNDER.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm md:text-base text-white/70 leading-relaxed">
            {FOUNDER.credentials}
          </p>
          <Link
            href={FOUNDER.cta.href}
            className="mt-8 inline-flex items-center gap-2 text-[#dcb375] uppercase tracking-[0.18em] text-xs font-medium hover:text-white transition-colors"
          >
            {FOUNDER.cta.label}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
