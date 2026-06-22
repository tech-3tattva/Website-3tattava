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
      className="relative py-20 md:py-28 px-4 overflow-hidden"
      style={{ background: 'var(--cream)' }}
      aria-labelledby="founder-heading"
    >
      {/* subtle glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 20% 30%, rgba(200,150,62,0.06), transparent 45%)' }}
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
          <div className="relative w-[260px] h-[320px] md:w-[300px] md:h-[380px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(28,19,4,0.12)]" style={{ border: '1px solid var(--line)' }}>
            <Image
              src="https://media.3tattava.com/dr-kashish/dr-kashish-portrait.jpg"
              alt="Dr. Kashish Gupta, BAMS — Founder of 3TATTAVA"
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
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--gold-dark)' }}>
            Meet the Founder
          </p>
          <h2
            id="founder-heading"
            className="font-display text-3xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-primary), system-ui, sans-serif", fontVariationSettings: "'wdth' 85, 'wght' 700", color: 'var(--ink)' }}
          >
            {FOUNDER.header}
          </h2>
          <blockquote className="text-lg md:text-xl italic leading-relaxed pl-5" style={{ color: 'var(--ink-soft)', borderLeft: '2px solid var(--gold)', fontFamily: "var(--font-primary), system-ui, sans-serif" }}>
            &ldquo;{FOUNDER.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm md:text-base leading-relaxed" style={{ color: 'var(--ink-soft)', fontFamily: "var(--font-primary), system-ui, sans-serif" }}>
            {FOUNDER.credentials}
          </p>

          {/* Full credentials block for E-E-A-T */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--ink-10, rgba(28,19,4,0.10))' }}>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--ink-60, rgba(28,19,4,0.6))', fontFamily: "var(--font-primary), system-ui, sans-serif" }}>
              <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>Dr. Kashish Gupta, BAMS</strong>
              Qualified Ayurveda Doctor (Bachelor of Ayurvedic Medicine and Surgery)<br />
              Alumni: CBPACS — Chaudhary Brahm Prakash Ayurvedic Charak Sansthan, Govt. of NCT Delhi<br />
              Former Consultant: National Commission for Indian System of Medicine, Ministry of AYUSH, Government of India<br />
              90-day personal Shilajit protocol with clinical blood work documentation
            </p>
          </div>

          <Link
            href={FOUNDER.cta.href}
            className="mt-8 inline-flex items-center gap-2 uppercase tracking-[0.18em] text-xs font-medium transition-colors"
            style={{ color: 'var(--gold-dark)', fontFamily: "var(--font-primary), system-ui, sans-serif" }}
          >
            {FOUNDER.cta.label}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
