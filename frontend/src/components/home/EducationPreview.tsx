"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EDUCATION_PREVIEW } from "@/lib/brand-content";

export default function EducationPreview() {
  return (
    <section
      className="bg-[#faf7f2] py-20 md:py-24 px-4"
      aria-labelledby="education-preview-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Education Hub</p>
          <h2
            id="education-preview-heading"
            className="font-display text-4xl md:text-5xl text-text-dark"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {EDUCATION_PREVIEW.header}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION_PREVIEW.articles.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_10px_30px_rgba(24,24,24,0.04)] hover:shadow-[0_18px_46px_rgba(24,24,24,0.08)] transition-shadow"
            >
              <Link
                href={`/education/${a.slug}`}
                className="block p-7 md:p-8 h-full"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-gold mb-3">
                  Reviewed by Dr. Kashish, BAMS
                </p>
                <h3
                  className="font-display text-xl md:text-2xl text-text-dark mb-3 leading-snug"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {a.title}
                </h3>
                <p className="text-sm text-text-medium leading-relaxed">
                  {a.dek}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-text-dark uppercase tracking-[0.18em] text-xs font-medium group-hover:text-primary-green transition-colors">
                  Read
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
