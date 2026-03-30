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
      <div className="premium-card p-8 mb-8 text-center bg-gradient-to-r from-beige to-cream">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Curated for Celebration</p>
        <h1 className="font-display text-4xl text-text-dark mb-3">Gift Sets</h1>
        <p className="text-text-medium">Luxurious Ayurvedic gifting bundles for every occasion.</p>
      </div>
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
