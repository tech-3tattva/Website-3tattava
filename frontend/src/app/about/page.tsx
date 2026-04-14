export const metadata = {
  title: "Our Story | 3Tattva Ayurveda",
  description: "The story of 3Tattva — born from conviction, built on science, rooted in Ayurveda.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f5eed4]">
      <section className="bg-[linear-gradient(to_bottom,#d27038,#824026)] text-white py-16 sm:py-20 md:py-32 text-center px-4">
        <h1
          className="font-display text-[38px] sm:text-5xl md:text-6xl tracking-tight"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          The Story of 3Tattva
        </h1>
      </section>

      <section className="py-10 sm:py-12 px-4 sm:px-6 border-b border-[#e0d6be]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#924d29] text-xs md:text-sm tracking-[0.08em] uppercase">
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Balance Within
          </span>
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Build Strength
          </span>
          <span className="rounded border border-[#b89f78] bg-[#f4efdc] px-4 py-2.5 text-center">
            Become Unstoppable
          </span>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px] bg-[#3d2e26]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#3d2e26_0%,#1f1915_100%)]" />
          <button
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/55 text-white text-lg sm:text-xl"
            aria-label="Play story video"
          >
            ▶
          </button>
        </div>
        <div className="bg-[#8c4826] text-[#f4efdc] p-7 sm:p-9 md:p-14">
          <h2
            className="font-display text-3xl sm:text-4xl mb-4 tracking-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Welcome Section
          </h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-5 leading-snug max-w-md">
            A world where ancient Vedic science meets modern vitality.
          </p>
          <p className="text-sm leading-relaxed text-[#f4efdc]/90">
            From the high Himalayas to your daily routine, 3Tattva combines
            authentic Ayurvedic sourcing with modern quality standards to deliver
            purity, strength, and consistency.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-[48%_52%] border-t border-[#e0d6be]">
        <div className="hidden md:block" />
        <div className="md:border-l border-[#e0d6be]">
          <article className="p-7 sm:p-9 md:p-12 border-b border-[#e0d6be] bg-[#f5eed4]">
            <h3
              className="font-display text-3xl sm:text-4xl text-center mb-6 sm:mb-8 text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              ROCKOIL Sourcing Story
            </h3>
            <p className="text-sm leading-relaxed text-[#1a1a1a] max-w-xl mx-auto">
              Rockoil is sourced from high-altitude Himalayan strata where
              naturally formed Shilajit resin is carefully harvested, purified,
              and tested to preserve potency and mineral richness.
            </p>
          </article>

          <article className="p-7 sm:p-9 md:p-12 border-b border-[#e0d6be] bg-[#f8f6ec]">
            <h3
              className="font-display text-3xl sm:text-4xl text-center mb-7 sm:mb-10 text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              ROCKOIL Sourcing Story
            </h3>
            <div className="space-y-6 max-w-xl mx-auto text-[#1a1a1a]">
              <div>
                <h4 className="font-medium text-lg mb-2">18,000 ft harvesting</h4>
                <p className="text-sm leading-relaxed">
                  Our Himalayan Shilajit sourcing focuses on altitude-specific
                  extraction zones known for resin maturity and mineral depth.
                </p>
              </div>
              <p className="text-sm font-medium">
                “Shudh” grade purification ensures clean, high-quality resin.
              </p>
              <p className="text-sm leading-relaxed">
                Each batch is checked for authenticity, heavy metals, and
                stability before formulation.
              </p>
            </div>
          </article>

          <section className="bg-white py-7 sm:py-8 px-4 sm:px-8 border-b border-[#e0d6be] flex flex-wrap justify-center gap-5 sm:gap-10">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#b58b5a] text-[#b58b5a] text-[11px] sm:text-xs flex items-center justify-center font-semibold">
              GMP
            </div>
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#b58b5a] text-[#b58b5a] italic text-xs sm:text-sm flex items-center justify-center font-semibold">
              fssai
            </div>
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#b58b5a] text-[#b58b5a] text-[10px] sm:text-[11px] text-center flex items-center justify-center font-semibold leading-tight">
              Export
              <br />
              Quality
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
