"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Logo from "./Logo";
import { FOOTER_LINKS, SOCIAL_LINKS, TAGLINE } from "@/lib/constants";

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
        <div className="max-w-5xl mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <Logo variant="white" size="lg" className="mb-4" />
            <p
              className="text-[#f5efe6] font-display text-lg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {TAGLINE}
            </p>
            <p className="text-sm text-white/80 mt-2">care@3tattva.com</p>
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
          <NewsletterSignup
            placeholder="Enter your email for Ayurvedic wellness tips"
            buttonText="Subscribe"
            variant="footer"
            className="w-full md:w-auto"
          />
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
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-text-medium">
              <li>care@3tattva.com</li>
              <li>Shipping & Returns</li>
              <li>Customer Support</li>
              <li>India</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-4 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-text-light text-sm">
          <p className="text-white/70">© 2026 3Tattva Ayurveda Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-white px-2 py-1 rounded text-xs text-black">Visa</span>
            <span className="bg-white px-2 py-1 rounded text-xs text-black">MC</span>
            <span className="bg-white px-2 py-1 rounded text-xs text-black">Amex</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/80 text-center">
            <Link href="/privacy" className="hover:text-text-dark transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-dark transition-colors whitespace-nowrap">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-text-dark transition-colors whitespace-nowrap">
              Sitemap
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
