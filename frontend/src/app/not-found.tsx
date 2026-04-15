import Link from "next/link";
import type { Metadata } from "next";
import { NOT_FOUND } from "@/lib/brand-content";

export const metadata: Metadata = {
  title: "Page Not Found | 3TATTAVA",
  description: NOT_FOUND.subheadline,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#f5efe6_0%,#eae1cf_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,165,116,0.18),transparent_40%),radial-gradient(circle_at_75%_70%,rgba(92,64,51,0.08),transparent_45%)]"
        aria-hidden
      />

      <div className="relative max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-5">
          404 &middot; Off the Trail
        </p>
        <h1
          className="font-display text-4xl md:text-6xl text-text-dark leading-tight mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {NOT_FOUND.headline}
        </h1>
        <p className="text-text-medium text-lg mb-10">{NOT_FOUND.subheadline}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {NOT_FOUND.ctas.map((cta, i) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-colors ${
                i === 0
                  ? "bg-primary-green text-white hover:bg-secondary-green"
                  : "border border-gold text-text-dark hover:bg-beige"
              }`}
            >
              {cta.label}
            </Link>
          ))}
        </div>

        <Link
          href={NOT_FOUND.homeLink.href}
          className="mt-8 inline-block text-sm text-text-medium underline underline-offset-4 hover:text-text-dark transition-colors"
        >
          {NOT_FOUND.homeLink.label} &rarr;
        </Link>
      </div>
    </div>
  );
}
