"use client";

import NewsletterSignup from "@/components/ui/NewsletterSignup";

export default function EducationNewsletterSection() {
  return (
    <section className="bg-primary-green text-white py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl mb-4">
          Get Weekly Ayurvedic Wisdom in Your Inbox
        </h2>
        <NewsletterSignup
          placeholder="Your email"
          buttonText="Subscribe"
          variant="education"
          className="justify-center"
        />
        <p className="text-white/80 text-sm mt-2">No spam. Pure wellness knowledge.</p>
      </div>
    </section>
  );
}
