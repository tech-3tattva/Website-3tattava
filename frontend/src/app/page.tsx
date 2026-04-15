import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import ThreeTattvasSection from "@/components/home/ThreeTattvasSection";
import FeaturedProductSpotlight from "@/components/home/FeaturedProductSpotlight";
import ResultsTimeline from "@/components/home/ResultsTimeline";
import Testimonials from "@/components/home/Testimonials";
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
      <HeroCarousel heroProduct={spotlight} />
      <TrustStrip />
      <ThreeTattvasSection />
      {spotlight && <FeaturedProductSpotlight product={spotlight} />}
      <ResultsTimeline />
      <Testimonials />
      <FounderSection />
      <EducationPreview />
    </>
  );
}
