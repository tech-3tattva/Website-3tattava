"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Logo from "./Logo";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { FOOTER, NEWSLETTER } from "@/lib/brand-content";

function SocialIcon({
  id,
  className = "h-5 w-5",
}: {
  id: (typeof SOCIAL_LINKS)[number]["id"];
  className?: string;
}) {
  switch (id) {
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "facebook":
      return <Facebook className={className} aria-hidden />;
    case "email":
      return <Mail className={className} aria-hidden />;
    case "whatsapp":
      return <MessageCircle className={className} aria-hidden />;
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="bg-white">
      <section className="bg-[#b35e34] text-white py-14 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left md:max-w-sm">
            <Logo variant="white" size="lg" className="mb-4" />
            <p
              className="text-[#f5efe6] font-display text-lg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {FOOTER.tagline}
            </p>
            <p className="text-sm text-white/80 mt-2">{FOOTER.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  {...(item.id === "email"
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
                  aria-label={item.label}
                >
                  <SocialIcon id={item.id} className="h-5 w-5 text-white" />
                </Link>
              ))}
            </div>
          </div>
          <div className="md:max-w-md w-full">
            <h3
              className="font-display text-2xl text-white mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {NEWSLETTER.headline}
            </h3>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              {NEWSLETTER.subheadline}
            </p>
            <NewsletterSignup
              placeholder={NEWSLETTER.placeholder}
              buttonText={NEWSLETTER.cta}
              variant="footer"
              className="w-full !mb-0"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#eae5db] py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-primary-green text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-primary-green text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4">
              Learn
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-primary-green text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track-order" className="text-text-medium hover:text-primary-green transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-medium hover:text-primary-green transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-medium hover:text-primary-green transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-text-medium hover:text-primary-green transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications + legal line */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#d6cfc1]">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
            {FOOTER.legal.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1 rounded-full border border-[#c9ba9f] bg-white/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-text-dark"
              >
                ✓ {cert}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full border border-[#c9ba9f] bg-white/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-text-dark">
              {FOOTER.legal.fssaiLicense}
            </span>
          </div>
          <p className="text-xs text-text-medium text-center md:text-left leading-relaxed">
            {FOOTER.legal.companyLine}
          </p>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-4 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-text-light text-sm">
          <p className="text-white/70">© 2026 3TATTAVA Ayurveda Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Visa", "MC", "Amex", "UPI", "Paytm", "PhonePe"].map((p) => (
              <span key={p} className="bg-white px-2 py-1 rounded text-xs text-black">
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/80 text-center">
            <Link href="/privacy" className="hover:text-white transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors whitespace-nowrap">
              Terms of Use
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors whitespace-nowrap">
              Sitemap
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
