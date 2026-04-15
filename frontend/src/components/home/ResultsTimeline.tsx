"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { RESULTS_TIMELINE } from "@/lib/brand-content";

export default function ResultsTimeline() {
  return (
    <section
      className="bg-[#faf7f2] py-20 md:py-24 px-4"
      aria-labelledby="results-timeline-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Results Timeline</p>
          <h2
            id="results-timeline-heading"
            className="font-display text-4xl md:text-5xl text-text-dark"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {RESULTS_TIMELINE.header}
          </h2>
          <p className="mt-4 text-text-medium">
            Real performance doesn&apos;t happen overnight. Here&apos;s what actually changes &mdash; week by week.
          </p>
        </div>

        <div className="relative">
          {/* vertical line for desktop */}
          <div
            className="pointer-events-none hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
            aria-hidden
          />
          <ol className="space-y-10 md:space-y-0">
            {RESULTS_TIMELINE.weeks.map((week, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.li
                  key={week.range}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`md:grid md:grid-cols-2 md:gap-10 md:mb-14 ${
                    isLeft ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`group relative rounded-2xl border border-border/70 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(24,24,24,0.05)] hover:shadow-[0_22px_50px_rgba(92,64,51,0.14)] hover:border-gold/60 transition-[box-shadow,border-color] duration-300 cursor-default overflow-hidden ${
                      isLeft ? "md:mr-8" : "md:ml-8 md:col-start-2"
                    }`}
                  >
                    {/* gold accent stripe revealed on hover */}
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500"
                      aria-hidden
                    />
                    {/* radial glow on hover */}
                    <span
                      className="pointer-events-none absolute -inset-px bg-[radial-gradient(circle_at_top_right,rgba(212,165,116,0.18),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      aria-hidden
                    />
                    {/* timeline dot */}
                    <span
                      className={`hidden md:block absolute top-8 h-3 w-3 rounded-full bg-gold ring-4 ring-[#faf7f2] transition-transform duration-300 group-hover:scale-125 ${
                        isLeft ? "-right-[38px]" : "-left-[38px]"
                      }`}
                      aria-hidden
                    />
                    <p className="relative text-xs uppercase tracking-[0.24em] text-gold mb-1">
                      {week.range}
                    </p>
                    <h3
                      className="relative font-display text-2xl md:text-3xl text-text-dark mb-3 transition-colors duration-300 group-hover:text-primary-green"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {week.title}
                    </h3>
                    <p className="relative text-text-medium leading-relaxed text-sm md:text-base">
                      {week.body}
                    </p>
                  </motion.div>
                  <div className="hidden md:block" aria-hidden />
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href={RESULTS_TIMELINE.cta.href}>
            <Button variant="primary" size="lg" className="min-w-[260px]">
              {RESULTS_TIMELINE.cta.label}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
