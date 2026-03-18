import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";

export const metadata = {
  title: "Gift Sets | 3Tattva Ayurveda",
  description: "Luxurious Ayurvedic gift sets for your loved ones.",
};

export default function GiftingPage() {
  const gifts = PLACEHOLDER_PRODUCTS.slice(0, 6);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-text-dark mb-8">Gift Sets</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {gifts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <p className="text-center text-text-medium mt-8">
        <Link href="/products" className="text-primary-green hover:underline">View all products</Link>
      </p>
    </div>
  );
}
