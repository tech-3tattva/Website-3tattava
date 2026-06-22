import Image from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import Link from "next/link";
import MotionSection from "@/components/education/MotionSection";
import { EDUCATION_ARTICLES, getEducationArticle } from "@/lib/education-content";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getEducationArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | 3TATTAVA Education Hub`,
    description: article.summary,
  };
}

export function generateStaticParams() {
  return EDUCATION_ARTICLES.map((article) => ({ slug: article.slug }));
}

export default function EducationArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getEducationArticle(params.slug);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": article.title,
    "description": article.summary,
    "url": `https://www.3tattava.com/education/${article.slug}`,
    "author": {
      "@type": "Person",
      "name": "Dr. Kashish Gupta",
      "jobTitle": "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
      "alumniOf": "CBPACS, Govt. of NCT Delhi",
      "url": "https://www.3tattava.com/about#founder"
    },
    "publisher": {
      "@type": "Organization",
      "name": "3TATTAVA",
      "url": "https://www.3tattava.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.3tattava.com" },
        { "@type": "ListItem", "position": 2, "name": "Education Hub", "item": "https://www.3tattava.com/education" },
        { "@type": "ListItem", "position": 3, "name": article.title }
      ]
    }
  };

  return (
    <main className="bg-[#f3eedd] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="relative w-full h-[min(38vh,320px)] border-b border-[#d9cdb8]">
        <Image
          src={article.coverImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3eedd] via-[#f3eedd]/70 to-transparent" />
      </div>
      <MotionSection className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <article>
          <Link href="/education" className="text-sm text-text-medium hover:text-primary-green">
            ← Back to Education Hub
          </Link>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-gold">
            {article.category}
          </p>
          <h1
            className="mt-3 text-4xl md:text-5xl text-text-dark"
            style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
          >
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div style={{ fontSize: '13px', color: 'var(--ink-60, rgba(28,19,4,0.6))' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Reviewed by Dr. Kashish Gupta, BAMS</span>
              {' · '}{article.readTime}
            </div>
          </div>
          <p className="mt-6 text-lg text-text-medium leading-relaxed">
            {article.summary}
          </p>

          <div className="mt-10 space-y-6 rounded-2xl border border-border bg-white p-8 shadow-sm">
            {article.content.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-text-medium">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </MotionSection>
    </main>
  );
}
