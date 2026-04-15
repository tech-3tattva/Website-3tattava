"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/brand-content";

export default function Testimonials() {
  return (
    <section
      className="bg-white py-20 md:py-24 px-4"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Social Proof</p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl md:text-5xl text-text-dark"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {TESTIMONIALS.header}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.items.map((t, i) => (
            <motion.figure
              key={`${t.name}-${t.city}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border/70 bg-[#fdfbf7] p-7 md:p-8 shadow-[0_10px_30px_rgba(24,24,24,0.04)] flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-gold text-gold" aria-hidden />
                ))}
              </div>
              <blockquote className="text-text-dark leading-relaxed text-[15px] md:text-base flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/60">
                <p className="font-medium text-text-dark text-sm">
                  {t.name}
                </p>
                <p className="text-text-medium text-xs mt-0.5">
                  {t.age} &middot; {t.city} &middot; <span className="uppercase tracking-wider text-gold">{t.segment}</span>
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-text-medium max-w-xl mx-auto">
          {TESTIMONIALS.disclaimer}{" "}
          <a
            href="/reviews"
            className="underline underline-offset-4 hover:text-text-dark transition-colors"
          >
            Read all reviews &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}
