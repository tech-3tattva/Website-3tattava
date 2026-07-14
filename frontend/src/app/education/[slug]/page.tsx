import Image from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import MotionSection from "@/components/education/MotionSection";
import { EDUCATION_ARTICLES, getEducationArticle } from "@/lib/education-content";
import {
  BLOG_ARTICLES,
  getBlogArticle,
  type BlogArticle,
} from "@/data/education/blog-articles.generated";
import type { Metadata } from "next";

const SITE = "https://www.3tattava.com";
const REVIEWED = "2026-07-06";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getEducationArticle(params.slug);
  if (article) {
    return {
      title: `${article.title} | 3TATTAVA Education Hub`,
      description: article.summary,
      alternates: { canonical: `${SITE}/education/${article.slug}` },
    };
  }
  const blog = getBlogArticle(params.slug);
  if (blog) {
    return {
      title: blog.metaTitle,
      description: blog.metaDesc,
      alternates: { canonical: `${SITE}/education/${blog.slug}` },
      openGraph: {
        title: blog.metaTitle,
        description: blog.metaDesc,
        url: `${SITE}/education/${blog.slug}`,
        type: "article",
      },
    };
  }
  return {};
}

export function generateStaticParams() {
  return [
    ...EDUCATION_ARTICLES.map((article) => ({ slug: article.slug })),
    ...BLOG_ARTICLES.map((article) => ({ slug: article.slug })),
  ];
}

/* Safe inline emphasis renderer for generated copy (**bold**, *italic*). */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={`${keyPrefix}-${i}`}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Paragraphs({ text, prefix }: { text: string; prefix: string }) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={`${prefix}-${i}`} className="text-base leading-relaxed text-text-medium">
          {renderInline(p, `${prefix}-${i}`)}
        </p>
      ))}
    </>
  );
}

function BlogArticleView({ blog }: { blog: BlogArticle }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${SITE}/education/${blog.slug}#article`,
        name: blog.title,
        headline: blog.title,
        description: blog.summary,
        url: `${SITE}/education/${blog.slug}`,
        inLanguage: "en-IN",
        datePublished: REVIEWED,
        dateModified: REVIEWED,
        about: blog.keyword,
        author: {
          "@type": "Person",
          name: "Dr. Kashish Gupta",
          jobTitle: "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
          url: `${SITE}/about#founder`,
        },
        reviewedBy: {
          "@type": "Person",
          name: "Dr. Kashish Gupta",
          jobTitle: "BAMS",
        },
        lastReviewed: REVIEWED,
        publisher: {
          "@type": "Organization",
          name: "3TATTAVA",
          url: SITE,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/education/${blog.slug}#faq`,
        mainEntity: blog.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Education Hub", item: `${SITE}/education` },
          { "@type": "ListItem", position: 3, name: blog.title },
        ],
      },
    ],
  };

  return (
    <main className="bg-[#f3eedd] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      {/* Hero */}
      <section className="border-b border-[#d9cdb8] bg-gradient-to-b from-[#efe7d3] to-[#f3eedd]">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-10 md:pt-32 md:pb-14">
          <Link href="/education" className="text-sm text-text-medium hover:text-primary-green">
            ← Back to Education Hub
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">{blog.pillar}</p>
          <h1
            className="mt-3 text-3xl md:text-5xl text-text-dark leading-tight"
            style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
          >
            {blog.title}
          </h1>
          <div className="mt-4 text-[13px]" style={{ color: "rgba(28,19,4,0.6)" }}>
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>
              Reviewed by Dr. Kashish Gupta, BAMS
            </span>
            {" · "}
            {blog.readTime}
          </div>
          <p className="mt-6 text-lg text-text-medium leading-relaxed">{blog.summary}</p>
        </div>
      </section>

      <MotionSection className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <article>
          {/* Intro */}
          <div className="space-y-5">
            <Paragraphs text={blog.intro} prefix="intro" />
          </div>

          {/* Key takeaways */}
          {blog.takeaways.length > 0 && (
            <div className="mt-10 rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-sm uppercase tracking-[0.18em] text-gold m-0">Key Takeaways</h2>
              <ul className="mt-4 space-y-3">
                {blog.takeaways.map((t, i) => (
                  <li key={`tk-${i}`} className="flex gap-3 text-base leading-relaxed text-text-medium">
                    <span aria-hidden className="text-gold" style={{ fontWeight: 700 }}>
                      ✓
                    </span>
                    <span>{renderInline(t, `tk-${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body sections */}
          <div className="mt-12 space-y-10">
            {blog.sections.map((s, i) => (
              <section key={`sec-${i}`}>
                <h2
                  className="text-2xl md:text-3xl text-text-dark mb-4"
                  style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
                >
                  {s.heading}
                </h2>
                <div className="space-y-5">
                  <Paragraphs text={s.body} prefix={`sec-${i}`} />
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-[#2b2519] px-6 py-8 md:px-10 md:py-10 text-center">
            <p className="text-[#efe7d3] text-lg md:text-xl" style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}>
              {blog.ctaLabel}
            </p>
            <Link
              href={blog.productHref}
              className="mt-5 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#2b2519] transition-transform hover:-translate-y-0.5"
            >
              {blog.ctaLabel} →
            </Link>
          </div>

          {/* FAQ */}
          {blog.faqs.length > 0 && (
            <div className="mt-14">
              <h2
                className="text-2xl md:text-3xl text-text-dark mb-6"
                style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {blog.faqs.map((f, i) => (
                  <details
                    key={`faq-${i}`}
                    className="group rounded-xl border border-border bg-white px-5 py-4"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-text-dark">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-text-medium">
                      {renderInline(f.a, `faq-${i}`)}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Related reading */}
          {blog.related.length > 0 && (
            <div className="mt-14 border-t border-[#d9cdb8] pt-8">
              <h2 className="text-sm uppercase tracking-[0.18em] text-gold m-0">Related Reading</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {blog.related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/education/${r.slug}`}
                      className="block rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text-dark transition-colors hover:border-gold hover:text-primary-green"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-12 text-xs leading-relaxed text-text-light">
            This article is for educational purposes only and is not a substitute for professional
            medical advice. Consult a qualified physician before starting any supplement, especially
            if you are pregnant, breastfeeding, taking medication, or managing a health condition.
          </p>
        </article>
      </MotionSection>
    </main>
  );
}

export default function EducationArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getEducationArticle(params.slug);

  if (article) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: article.title,
      description: article.summary,
      url: `${SITE}/education/${article.slug}`,
      author: {
        "@type": "Person",
        name: "Dr. Kashish Gupta",
        jobTitle: "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
        alumniOf: "CBPACS, Govt. of NCT Delhi",
        url: `${SITE}/about#founder`,
      },
      publisher: {
        "@type": "Organization",
        name: "3TATTAVA",
        url: SITE,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Education Hub", item: `${SITE}/education` },
          { "@type": "ListItem", position: 3, name: article.title },
        ],
      },
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
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-gold">{article.category}</p>
            <h1
              className="mt-3 text-4xl md:text-5xl text-text-dark"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              {article.title}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div style={{ fontSize: "13px", color: "var(--ink-60, rgba(28,19,4,0.6))" }}>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                  Reviewed by Dr. Kashish Gupta, BAMS
                </span>
                {" · "}
                {article.readTime}
              </div>
            </div>
            <p className="mt-6 text-lg text-text-medium leading-relaxed">{article.summary}</p>

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

  const blog = getBlogArticle(params.slug);
  if (!blog) {
    notFound();
  }

  return <BlogArticleView blog={blog} />;
}
