import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ProductHeroSection from "@/components/home/ProductHeroSection";
import FeaturedProductSpotlight from "@/components/home/FeaturedProductSpotlight";
import FeaturesSection from "@/components/home/FeaturesSection";
import WeekByWeek from "@/components/home/WeekByWeek";
import TestimonialsMarquee from "@/components/home/TestimonialsMarquee";
import FounderSection from "@/components/home/FounderSection";
import EducationPreview from "@/components/home/EducationPreview";
import { WebsiteSchema } from "@/components/seo/JsonLd";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const spotlight = featuredProducts[0];

  return (
    <>
      <WebsiteSchema />
      <HeroSection />
      <TrustStrip />
      <ProductHeroSection />
      {spotlight && <FeaturedProductSpotlight product={spotlight} />}
      <FeaturesSection />
      <WeekByWeek />
      <TestimonialsMarquee />
      <FounderSection />
      <EducationPreview />
    </>
  );
}
