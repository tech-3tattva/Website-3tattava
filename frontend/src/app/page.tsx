import HeroRevamp from "@/components/home-revamp/HeroRevamp";
import TrinityPosterSection from "@/components/home-revamp/TrinityPosterSection";
import PerformanceStory from "@/components/home-revamp/PerformanceStory";
import PhilosophyRevamp from "@/components/home-revamp/PhilosophyRevamp";
import TrustRevamp from "@/components/home-revamp/TrustRevamp";
import DrKashishSection from "@/components/home-revamp/DrKashishSection";
import TestimonialsRevamp from "@/components/home-revamp/TestimonialsRevamp";
import FAQRevamp from "@/components/home-revamp/FAQRevamp";
import ExperienceCenterMap from "@/components/home-revamp/ExperienceCenterMap";
import NewsletterRevamp from "@/components/home-revamp/NewsletterRevamp";
import SocialSidebar from "@/components/home-revamp/SocialSidebar";
import { WebsiteSchema, FAQSchema } from "@/components/seo/JsonLd";
import { HOME_FAQS } from "@/data/faqs/home";

export default function HomePage() {
  return (
    <>
      <WebsiteSchema />
      <FAQSchema faqs={HOME_FAQS.map((f) => ({ question: f.question, answer: f.answer }))} />
      <SocialSidebar />
      <HeroRevamp />
      <TrinityPosterSection />
      <PerformanceStory />
      <PhilosophyRevamp />
      <TrustRevamp />
      <DrKashishSection />
      <TestimonialsRevamp />
      <FAQRevamp />
      <ExperienceCenterMap />
      <NewsletterRevamp />
    </>
  );
}
