"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const MEGA_LINKS: Record<string, { label: string; href: string }[]> = {
  "Shop All": [
    { label: "All Products", href: "/products" },
    { label: "Skin Care", href: "/products?category=skin-care" },
    { label: "Hair Care", href: "/products?category=hair-care" },
    { label: "Body & Wellness", href: "/products?category=body-wellness" },
    { label: "Gift Sets", href: "/gifting" },
  ],
  "Skin Care": [
    { label: "Face Serums", href: "/products?category=face" },
    { label: "Moisturizers", href: "/products?category=moisturizers" },
    { label: "Cleansers", href: "/products?category=cleansers" },
  ],
  "Hair Care": [
    { label: "Hair Oils", href: "/products?category=hair-oils" },
    { label: "Shampoos", href: "/products?category=shampoos" },
  ],
  "Body & Wellness": [
    { label: "Body Oils", href: "/products?category=body-oils" },
    { label: "Supplements", href: "/products?category=supplements" },
  ],
  Gifting: [
    { label: "Gift Sets", href: "/gifting" },
    { label: "Personalized", href: "/gifting?type=personalized" },
  ],
};

export default function MegaMenu({ isOpen, onClose, title }: MegaMenuProps) {
  const links = MEGA_LINKS[title] || MEGA_LINKS["Shop All"];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="absolute left-0 right-0 top-full z-50 bg-white border-b border-border shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <p className="text-text-dark font-sans text-sm uppercase tracking-wider mb-4">
            Categories
          </p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-medium hover:text-primary-green transition-colors text-sm"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 flex gap-4">
          <div className="flex-1 bg-cream rounded-lg p-4 min-h-[120px] flex flex-col justify-end">
            <p className="text-text-dark font-medium text-sm mb-1">Featured</p>
            <Link
              href="/products/kumkumadi-serum"
              className="text-primary-green text-sm hover:underline"
              onClick={onClose}
            >
              Kumkumadi Serum →
            </Link>
          </div>
          <div className="flex-1 bg-cream rounded-lg p-4 min-h-[120px] flex flex-col justify-end">
            <Link
              href="/dosha-quiz"
              className="text-primary-green font-medium text-sm hover:underline"
              onClick={onClose}
            >
              Take Dosha Quiz →
            </Link>
          </div>
        </div>
        <div className="col-span-1 bg-beige-dark rounded-lg min-h-[120px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-green/10 to-gold/10" />
        </div>
      </div>
    </motion.div>
  );
}
