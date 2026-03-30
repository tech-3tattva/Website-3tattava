import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "All Products | 3Tattva Ayurveda",
  description: "Explore our range of authentic Ayurvedic products for skin, hair, and wellness.",
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
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Curated Ayurveda</p>
        <h1
          className="font-display text-4xl md:text-5xl text-text-dark mb-2"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Shop All
        </h1>
        <p className="text-text-medium">Explore formulations designed for skin, hair, body, and balance.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
