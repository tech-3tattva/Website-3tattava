import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import DoshaQuizBanner from "@/components/home/DoshaQuizBanner";
import CategoryScroll from "@/components/home/CategoryScroll";
import ProductCard from "@/components/product/ProductCard";
import ThreeTattvasSection from "@/components/home/ThreeTattvasSection";
import { getBestSellers, getNewArrivals } from "@/lib/placeholder-data";

export default function HomePage() {
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();

  return (
    <>
      <HeroCarousel />
      <TrustStrip />

      <section className="py-12 md:py-16 px-4">
        <DoshaQuizBanner />
      </section>

      <CategoryScroll />

      {/* Best Sellers */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2
              className="font-display text-3xl md:text-4xl text-text-dark"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Our Best Sellers
            </h2>
            <Link
              href="/products"
              className="text-gold font-medium text-sm uppercase tracking-wider hover:underline underline-offset-4"
              style={{ color: "var(--color-gold)" }}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ThreeTattvasSection />

      {/* New Arrivals */}
      <section className="py-12 md:py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2
              className="font-display text-3xl md:text-4xl text-text-dark"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              New Arrivals
            </h2>
            <Link
              href="/products?sort=new"
              className="text-gold font-medium text-sm uppercase tracking-wider hover:underline underline-offset-4"
              style={{ color: "var(--color-gold)" }}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Teaser */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-beige-dark rounded-xl overflow-hidden" />
          <div>
            <h2
              className="font-display text-3xl md:text-4xl text-text-dark mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Rooted in 5,000 Years of Wisdom
            </h2>
            <p className="text-text-medium mb-6">
              Three Tattvas — Balance, Build, Become — guide every formulation we
              create. From the Himalayas to your home, we bring authentic
              Ayurveda with modern science.
            </p>
            <Link
              href="/about"
              className="text-gold font-medium uppercase tracking-wider hover:underline"
              style={{ color: "var(--color-gold)" }}
            >
              Read Our Full Story →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
