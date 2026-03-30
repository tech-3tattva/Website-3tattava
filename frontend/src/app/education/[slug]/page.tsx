import Image from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import Link from "next/link";
import MotionSection from "@/components/education/MotionSection";
import { EDUCATION_ARTICLES, getEducationArticle } from "@/lib/education-content";

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

  return (
    <main className="bg-[#f3eedd] min-h-screen">
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
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-text-light">{article.readTime}</p>
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
