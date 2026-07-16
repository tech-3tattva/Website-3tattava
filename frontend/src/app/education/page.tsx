import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import EducationNewsletterSection from "@/components/education/EducationNewsletterSection";
import MotionSection from "@/components/education/MotionSection";
import {
  EducationSectionDivider,
  KaphaGlyph,
  PittaGlyph,
  VataGlyph,
} from "@/components/vectors/education/DoshaGlyphs";
import { DOSHA_GUIDE, EDUCATION_ARTICLES } from "@/lib/education-content";
import { EDUCATION_HUB, PAGE_METADATA } from "@/lib/brand-content";
import type { Metadata } from "next";
import { BLOG_ARTICLES } from "@/data/education/blog-articles.generated";
import { getPublishedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: PAGE_METADATA.education.title,
  description: PAGE_METADATA.education.description,
  alternates: { canonical: "https://www.3tattava.com/education" },
  openGraph: {
    title: PAGE_METADATA.education.title,
    description: PAGE_METADATA.education.description,
    url: "https://www.3tattava.com/education",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

function DoshaIcon({ type }: { type: "vata" | "pitta" | "kapha" }) {
  const cls = "h-14 w-14 shrink-0 text-primary-green";
  if (type === "vata") return <VataGlyph className={cls} />;
  if (type === "pitta") return <PittaGlyph className={cls} />;
  return <KaphaGlyph className={cls} />;
}

const LIBRARY_GROUPS: { pillar: string; items: { slug: string; title: string }[] }[] = (() => {
  const groups: Record<string, { slug: string; title: string }[]> = {};
  for (const a of BLOG_ARTICLES) {
    (groups[a.pillar] ??= []).push({ slug: a.slug, title: a.title });
  }
  return Object.entries(groups).map(([pillar, items]) => ({ pillar, items }));
})();

export default async function EducationPage() {
  const dbBlogs = await getPublishedBlogs();
  return (
    <div className="bg-[#f3eedd]">
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-[45%] border-r border-[#d9cdb8] flex flex-col">
          <div className="relative overflow-hidden bg-[#2b2519] px-5 py-12 sm:px-8 sm:py-16 md:px-12 text-center text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-gold/15" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full border border-gold/10" />
            <p className="relative text-xs uppercase tracking-[0.3em] text-[#dcb375] mb-3">
              Performance Ayurveda Knowledge Center
            </p>
            <h1
              className="relative text-3xl sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              {EDUCATION_HUB.h1}
            </h1>
            <p className="relative mt-4 text-white/80 max-w-md mx-auto leading-relaxed">
              {EDUCATION_HUB.subheadline}
            </p>
          </div>

          <EducationSectionDivider className="mx-auto my-0 h-6 w-full max-w-md px-8" />

          <div id="doshas" className="flex-1 px-5 py-10 md:px-8 border-t-4 border-[#c5a87b]">
            <h2
              className="text-center text-3xl text-text-dark mb-8"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              Dosha Guide
            </h2>
            <div className="space-y-5">
              {DOSHA_GUIDE.map((dosha, i) => (
                <MotionSection key={dosha.key} delay={i * 0.06}>
                  <article className="rounded-lg border border-[#d4c5a9] bg-[#fcfbf5] p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="rounded-xl bg-beige/80 p-2 border border-gold/20">
                        <DoshaIcon type={dosha.doshaIcon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-2xl sm:text-3xl text-text-dark"
                          style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
                        >
                          {dosha.key}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-light">
                          {dosha.subtitle}
                        </p>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-medium">
                          <p>
                            <strong className="text-text-dark">Characteristics:</strong>{" "}
                            {dosha.characteristics}
                          </p>
                          <p>
                            <strong className="text-text-dark">Imbalance Signs:</strong>{" "}
                            {dosha.imbalance}
                          </p>
                          <p>
                            <strong className="text-text-dark">How 3Tattva Helps:</strong>{" "}
                            {dosha.support}
                          </p>
                        </div>
                        <Link
                          href={dosha.productHref}
                          className="mt-4 inline-block text-sm font-medium text-primary-green hover:underline"
                        >
                          Explore {dosha.key} Products →
                        </Link>
                      </div>
                    </div>
                  </article>
                </MotionSection>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[55%] px-6 py-10 md:px-10 md:py-12">
          <MotionSection>
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#d9cdb8] shadow-sm">
              <div className="relative aspect-[1200/520] max-h-[220px] w-full md:max-h-[260px]">
                <Image
                  src="/education/shilajit-hero.svg"
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#f3eedd]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-center md:text-left">
                <p className="text-xs uppercase tracking-[0.25em] text-text-dark/80 mb-1">
                  Shilajit Deep-Dive
                </p>
                <h2
                  className="text-3xl md:text-4xl text-text-dark"
                  style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
                >
                  What is Shilajit?
                </h2>
              </div>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <MotionSection delay={0.05}>
              <div className="rounded-xl border border-[#d9cdb8] bg-white/60 p-5">
                <h3 className="font-semibold text-text-dark mb-3">
                  Asphaltum Punjabianum: The Destroyer of Weakness
                </h3>
                <p className="text-sm leading-relaxed text-text-medium">
                  Shilajit is a rare tar-like substance found in the high-altitude rocks
                  of the Himalayas, formed over centuries through the breakdown of plant
                  matter and minerals.
                </p>
              </div>
            </MotionSection>
            <MotionSection delay={0.1}>
              <div className="rounded-xl border border-[#d9cdb8] bg-white/60 p-5">
                <h3 className="font-semibold text-text-dark mb-3">
                  The Science of Fulvic Acid
                </h3>
                <p className="text-sm leading-relaxed text-text-medium">
                  Fulvic acid supports nutrient transport and absorption, helping the body
                  make better use of minerals and daily nourishment while promoting
                  vitality at a cellular level.
                </p>
              </div>
            </MotionSection>
          </div>

          {/* 4 Content Pillars */}
          <MotionSection>
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.24em] text-gold mb-2">Content Pillars</p>
              <h2
                className="text-3xl md:text-4xl text-text-dark"
                style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
              >
                Learn Before You Buy.
              </h2>
              <p className="mt-3 text-sm text-text-medium max-w-xl mx-auto">
                No fluff. No spiritual woo. Just the science that matters.
              </p>
            </div>
          </MotionSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {EDUCATION_HUB.pillars.map((pillar, i) => (
              <MotionSection key={pillar.name} delay={i * 0.06}>
                <div className="rounded-xl border border-[#d9cdb8] bg-white p-5 h-full">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Pillar {i + 1}</p>
                  <h3
                    className="text-xl md:text-2xl text-text-dark mb-3"
                    style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
                  >
                    {pillar.name}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-text-medium">
                    {pillar.articles.slice(0, 3).map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="text-gold mt-0.5" aria-hidden>&middot;</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionSection>
            ))}
          </div>

          <MotionSection>
            <div className="text-center mb-8">
              <p className="text-xs text-text-light mb-2">Articles</p>
              <h2
                className="text-4xl text-text-dark"
                style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
              >
                Latest from the Knowledge Center
              </h2>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-3 gap-5">
            {EDUCATION_ARTICLES.map((article, index) => (
              <MotionSection key={article.slug} delay={index * 0.08}>
                <article className="overflow-hidden rounded-xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col h-full hover:shadow-[0_8px_24px_rgba(92,64,51,0.1)] transition-shadow">
                  <Link href={`/education/${article.slug}`} className="block relative h-48 w-full">
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
                      {article.category}
                    </p>
                    <h3 className="font-semibold text-text-dark leading-snug mb-3">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-light mb-4">{article.readTime}</p>
                    <Link
                      href={`/education/${article.slug}`}
                      className="mt-auto text-sm font-semibold uppercase tracking-[0.12em] text-primary-green hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {dbBlogs.length > 0 && (
        <section className="bg-[#efe7d2] border-t border-[#d9cdb8] px-6 py-14 md:px-10 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.24em] text-gold mb-2">From the 3TATTAVA Desk</p>
              <h2
                className="text-3xl md:text-4xl text-text-dark"
                style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
              >
                Latest Articles
              </h2>
              <p className="mt-3 text-sm text-text-medium max-w-2xl mx-auto">
                Fresh guidance from our founder and Ayurvedic experts.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dbBlogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/education/${b.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#d9cdb8] bg-white/70 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e6dcc4]">
                    {b.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold/40 text-sm">3TATTAVA</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {b.pillar && <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2">{b.pillar}</p>}
                    <h3
                      className="text-lg leading-snug text-text-dark group-hover:text-primary-green"
                      style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
                    >
                      {b.title}
                    </h3>
                    {b.summary && <p className="mt-2 text-sm leading-relaxed text-text-medium line-clamp-3">{b.summary}</p>}
                    <div className="mt-4 flex items-center gap-3 text-xs text-text-light">
                      {b.readTime && <span>{b.readTime}</span>}
                      <span className="ml-auto text-primary-green font-medium">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f3eedd] border-t border-[#d9cdb8] px-6 py-14 md:px-10 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.24em] text-gold mb-2">Full Library</p>
            <h2
              className="text-3xl md:text-4xl text-text-dark"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              The Complete Shilajit &amp; Ayurveda Library
            </h2>
            <p className="mt-3 text-sm text-text-medium max-w-2xl mx-auto">
              {BLOG_ARTICLES.length}+ doctor-reviewed guides across Shilajit, Triphala, doshas and
              daily Ayurvedic living.
            </p>
          </div>
          <div className="space-y-10">
            {LIBRARY_GROUPS.map((group) => (
              <div key={group.pillar}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold mb-4 border-b border-[#d9cdb8] pb-2">
                  {group.pillar}
                </h3>
                <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/education/${a.slug}`}
                        className="text-sm text-text-medium hover:text-primary-green leading-snug"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EducationNewsletterSection />
    </div>
  );
}
