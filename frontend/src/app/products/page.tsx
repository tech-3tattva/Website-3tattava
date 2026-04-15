import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";
import { PAGE_METADATA, SHOP_PAGE } from "@/lib/brand-content";

export const metadata: Metadata = {
  title: PAGE_METADATA.shop.title,
  description: PAGE_METADATA.shop.description,
  alternates: { canonical: "https://www.3tattava.com/products" },
  openGraph: {
    title: PAGE_METADATA.shop.title,
    description: PAGE_METADATA.shop.description,
    url: "https://www.3tattava.com/products",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const dosha = typeof resolvedSearchParams.dosha === "string" ? resolvedSearchParams.dosha : undefined;
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : undefined;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  const { products } = await getProducts({
    category,
    dosha: dosha
      ? dosha.charAt(0).toUpperCase() + dosha.slice(1).toLowerCase()
      : undefined,
    sort,
    search,
    limit: 24,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="premium-card p-8 mb-8 bg-gradient-to-r from-cream to-beige">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">
          Performance Ayurveda
        </p>
        <h1
          className="font-display text-4xl md:text-5xl text-text-dark mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {SHOP_PAGE.h1}
        </h1>
        <p className="text-text-medium max-w-2xl">{SHOP_PAGE.subheading}</p>

        {/* Featured banners */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SHOP_PAGE.featuredBanners.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-gold/40 bg-white/70 px-5 py-3 text-sm text-text-dark hover:bg-white transition-colors"
            >
              <span className="font-medium">{b.label}</span>
              <span className="text-gold group-hover:translate-x-0.5 transition-transform" aria-hidden>
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter pills (visual only until filter logic is wired) */}
      <div className="mb-6 flex flex-wrap gap-2">
        {SHOP_PAGE.filters.map((f, i) => (
          <span
            key={f}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] ${
              i === 0
                ? "bg-primary-green text-white border-primary-green"
                : "bg-white text-text-medium border-border hover:border-gold"
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-cream p-10 text-center">
          <p className="text-text-medium">
            Products load from the 3TATTAVA backend. The Shilajit Resin and
            Honey Sticks SKUs will appear here once imported.
          </p>
        </div>
      ) : null}
    </div>
  );
}
