import HeroRevamp from "@/components/home-revamp/HeroRevamp";
import TrinityPosterSection from "@/components/home-revamp/TrinityPosterSection";
import PerformanceStory from "@/components/home-revamp/PerformanceStory";
import PhilosophyRevamp from "@/components/home-revamp/PhilosophyRevamp";
import TrustRevamp from "@/components/home-revamp/TrustRevamp";
import EventsTeaser from "@/components/home-revamp/EventsTeaser";
import DrKashishSection from "@/components/home-revamp/DrKashishSection";
import TestimonialVideo from "@/components/home-revamp/TestimonialVideo";
import FAQRevamp from "@/components/home-revamp/FAQRevamp";
import NewsletterRevamp from "@/components/home-revamp/NewsletterRevamp";
import SocialSidebar from "@/components/home-revamp/SocialSidebar";
import WtfTeaser from "@/components/home-revamp/WtfTeaser";
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
      <EventsTeaser />
      <DrKashishSection />
      <TestimonialVideo />
      <WtfTeaser />
      <FAQRevamp />
      <NewsletterRevamp />
    </>
  );
}
