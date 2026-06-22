import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { getArticle } from "../lib/api";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [a, setA] = useState(null);
  useEffect(() => { getArticle(slug).then(setA).catch(() => {}); window.scrollTo({ top: 0 }); }, [slug]);
  if (!a) return <div className="min-h-[60vh] flex items-center justify-center text-ink/40 eyebrow">Loading...</div>;
  return (
    <div className="bg-cream" data-testid={`article-${slug}`}>
      <section className="bg-ink text-cream py-20 px-6 md:px-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/knowledge-center" className="eyebrow text-gold inline-flex items-center gap-2 mb-6"><ArrowLeft size={12} /> Knowledge Center</Link>
          <div className="eyebrow text-cream/60 mb-4 flex items-center gap-3"><span>{a.category}</span> · <Clock size={12} /> {a.read_time}</div>
          <h1 className="font-display text-4xl md:text-6xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1.02 }}>{a.title}</h1>
        </div>
      </section>
      <section className="px-6 md:px-16 py-12">
        <img src={a.image} alt="" className="w-full max-w-4xl mx-auto h-[460px] object-cover" />
      </section>
      <article className="max-w-3xl mx-auto px-6 pb-24 prose">
        <p className="font-italic-light text-2xl text-ink/80 mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{a.excerpt}</p>
        <p className="text-ink/80 leading-relaxed text-lg">{a.body}</p>
      </article>
    </div>
  );
}
