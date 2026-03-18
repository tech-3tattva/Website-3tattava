"use client";

import Link from "next/link";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import Logo from "./Logo";
import { FOOTER_LINKS } from "@/lib/constants";
import { TAGLINE } from "@/lib/constants";

const socialIcons = [
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Section 1 — Brand block */}
      <section className="bg-primary-green text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Logo
            className="[&_span]:text-white [&_.font-devanagari]:text-gold mb-4"
          />
          <p
            className="text-gold font-display text-lg mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {TAGLINE}
          </p>
          <NewsletterSignup
            placeholder="Enter your email for Ayurvedic wellness tips"
            buttonText="Subscribe"
            variant="footer"
          />
          <div className="flex justify-center gap-4">
            {socialIcons.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors p-2"
                aria-label={label}
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — 4-column links */}
      <section className="bg-beige py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
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
              Company
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
              Help
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
              Trust Badges
            </h3>
            <ul className="space-y-2 text-text-medium text-sm">
              <li>FSSAI Certified</li>
              <li>GMP Certified</li>
              <li>Cruelty Free</li>
              <li>Made in India</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3 — Bottom bar */}
      <section className="border-t border-border bg-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-text-light text-sm">
          <p>© 2026 3Tattva Ayurveda Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">UPI</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">Visa</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">Mastercard</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">Rupay</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-text-dark transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-dark transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-text-dark transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
