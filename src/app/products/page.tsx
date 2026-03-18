import ProductCard from "@/components/product/ProductCard";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";

export const metadata = {
  title: "All Products | 3Tattva Ayurveda",
  description: "Explore our range of authentic Ayurvedic products for skin, hair, and wellness.",
};

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl md:text-5xl text-text-dark mb-8"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Shop All
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {PLACEHOLDER_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
