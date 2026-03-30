"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const SHOP_ALL_LINKS: { label: string; href: string }[] = [
  { label: "All Products", href: "/products" },
  { label: "Skin Care", href: "/products?category=skin-care" },
  { label: "Hair Care", href: "/products?category=hair-care" },
  { label: "Body & Wellness", href: "/products?category=body-wellness" },
  { label: "Gift Sets", href: "/gifting" },
];

export default function MegaMenu({ isOpen, onClose, title }: MegaMenuProps) {
  const links = SHOP_ALL_LINKS;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <div>
          <p className="text-text-dark font-sans text-sm uppercase tracking-wider mb-4">
            {title}
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
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-cream rounded-lg p-4 min-h-[120px] flex flex-col justify-end">
            <p className="text-text-dark font-medium text-sm mb-1">Featured</p>
            <Link
              href="/products/kumkumadi-serum"
              className="text-primary-green text-sm hover:underline"
              onClick={onClose}
            >
              Kumkumadi Serum →
            </Link>
          </div>
          <div className="bg-cream rounded-lg p-4 min-h-[120px] flex flex-col justify-end">
            <Link
              href="/dosha-quiz"
              className="text-primary-green font-medium text-sm hover:underline"
              onClick={onClose}
            >
              Take Dosha Quiz →
            </Link>
          </div>
        </div>
        <div className="bg-beige-dark rounded-lg min-h-[100px] lg:min-h-[120px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-green/10 to-gold/10" />
        </div>
      </div>
    </motion.div>
  );
}
