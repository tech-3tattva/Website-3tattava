import type { Metadata } from "next";
import Link from "next/link";
import FounderSection from "@/components/home/FounderSection";
import { OUR_STORY, PAGE_METADATA } from "@/lib/brand-content";

export const metadata: Metadata = {
  title: PAGE_METADATA.about.title,
  description: PAGE_METADATA.about.description,
  alternates: { canonical: "https://www.3tattava.com/about" },
  openGraph: {
    title: PAGE_METADATA.about.title,
    description: PAGE_METADATA.about.description,
    url: "https://www.3tattava.com/about",
    type: "article",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#f5eed4]">
      {/* Hero */}
      <section className="bg-[linear-gradient(to_bottom,#d27038,#824026)] text-white py-20 md:py-28 text-center px-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4cfa2] mb-4">
          The 3TATTAVA Story
        </p>
        <h1
          className="font-display text-[38px] sm:text-5xl md:text-6xl tracking-tight max-w-4xl mx-auto"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {OUR_STORY.h1}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-white/85 italic max-w-2xl mx-auto">
          {OUR_STORY.subheadline}
        </p>
      </section>

      {/* Pillar strip */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 border-b border-[#e0d6be]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#924d29] text-xs md:text-sm tracking-[0.08em] uppercase">
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Cellular Energy
          </span>
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Physical Performance
          </span>
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Long-Term Vitality
          </span>
        </div>
      </section>

      {/* Problem narrative */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[460px] bg-[#3d2e26]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#3d2e26_0%,#1f1915_100%)]" />
          <button
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/55 text-white text-lg sm:text-xl"
            aria-label="Play Dr. Kashish's story video"
          >
            ▶
          </button>
          <span className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.3em] text-white/80">
            Watch Dr. Kashish&apos;s Story
          </span>
        </div>
        <div className="bg-[#8c4826] text-[#f4efdc] p-7 sm:p-9 md:p-14">
          <p className="text-xs uppercase tracking-[0.28em] text-[#f4cfa2] mb-3">
            Founder Story
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl mb-5 tracking-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {OUR_STORY.problemHeader}
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed text-[#f4efdc]/95 max-w-md">
            {OUR_STORY.problemBody.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing */}
      <section className="px-4 sm:px-6 py-16 md:py-20 bg-[#f5eed4] border-t border-[#e0d6be]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#924d29] mb-3">
            Sourcing & Lab Testing
          </p>
          <h2
            className="font-display text-3xl sm:text-5xl text-text-dark tracking-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {OUR_STORY.sourcing.header}
          </h2>
          <p className="mt-3 text-text-medium italic">
            {OUR_STORY.sourcing.subheader}
          </p>
        </div>

        <ol className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {OUR_STORY.sourcing.steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-[#d6cfc1] bg-white p-7 md:p-8 shadow-[0_8px_28px_rgba(24,24,24,0.04)]"
            >
              <p className="font-display text-4xl text-text-dark/20 mb-2"
                 style={{ fontFamily: "Cormorant Garamond, serif" }}>
                {step.number}
              </p>
              <h3
                className="font-display text-2xl md:text-3xl text-text-dark mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {step.title}
              </h3>
              <p className="text-text-medium text-sm md:text-base leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Certifications */}
        <div className="max-w-5xl mx-auto mt-12 flex flex-wrap justify-center gap-3">
          {OUR_STORY.sourcing.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-2 rounded-full border border-[#b58b5a] bg-white px-4 py-2 text-xs md:text-sm uppercase tracking-[0.14em] text-[#924d29]"
            >
              ✓ {cert}
            </span>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={OUR_STORY.sourcing.cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-primary-green px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary-green"
          >
            {OUR_STORY.sourcing.cta.label} &rarr;
          </Link>
        </div>
      </section>

      {/* Dr. Kashish */}
      <FounderSection />
    </div>
  );
}
