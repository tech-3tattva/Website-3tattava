import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import ThreeTattvasSection from "@/components/home/ThreeTattvasSection";
import FeaturedProductSpotlight from "@/components/home/FeaturedProductSpotlight";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const spotlight = featuredProducts[0];

  return (
    <>
      <HeroCarousel heroProduct={spotlight} />
      <TrustStrip />
      <ThreeTattvasSection />
      {spotlight && <FeaturedProductSpotlight product={spotlight} />}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Explore More</p>
          <h2
            className="font-display text-3xl md:text-4xl text-text-dark mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Continue your Ayurvedic journey
          </h2>
          <p className="text-text-medium mb-8">
            Browse the complete collection or discover your dosha to personalize your routine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-full bg-primary-green px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-secondary-green"
            >
              Shop All
            </Link>
            <Link
              href="/education"
              className="rounded-full border border-gold px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-text-dark transition-colors hover:bg-beige"
            >
              Education Hub
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
