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
            style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
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
              style={{ transition: 'transform 300ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)), box-shadow 300ms ease, border-left-color 300ms ease' }}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_10px_30px_rgba(24,24,24,0.04)] hover:shadow-[0_18px_46px_rgba(24,24,24,0.08)] hover:-translate-y-1 hover:border-l-[3px] hover:border-l-[#C8963E]"
            >
              <Link
                href={`/education/${a.slug}`}
                className="block p-7 md:p-8 h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-gold">
                    Reviewed by Dr. Kashish, BAMS
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--ink-60)', background: 'rgba(200,150,62,0.10)', border: '1px solid rgba(200,150,62,0.25)', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                    {(a as { readTime?: string }).readTime ?? '5 min read'}
                  </span>
                </div>
                <h3
                  className="font-display text-xl md:text-2xl text-text-dark mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
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
