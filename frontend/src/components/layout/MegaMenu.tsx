"use client";
import { media } from "@/lib/media";

import { motion } from "framer-motion";
import Link from "next/link";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// 3TATTAVA sells two Shilajit formats only — no skin/hair/gifting catalogue.
const SHOP_ALL_LINKS: { label: string; href: string }[] = [
  { label: "All Products", href: "/products" },
  { label: "Shahjeet Sticks — Honey Shilajit", href: "/products/shahjeet-sticks" },
  { label: "RockResin — Shilajit Resin", href: "/products/shodhit-shilajit-resin" },
  { label: "Bundles & Kits", href: "/products" },
];

export default function MegaMenu({ isOpen, onClose, title }: MegaMenuProps) {
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
        {/* Column 1 — catalogue links */}
        <div>
          <p className="text-text-dark font-sans text-sm uppercase tracking-wider mb-4">
            {title}
          </p>
          <ul className="space-y-2">
            {SHOP_ALL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-medium hover:text-[#cd872a] transition-colors text-sm"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columns 2–3 — featured product + guidance */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/products/shahjeet-sticks"
            onClick={onClose}
            className="group relative rounded-lg overflow-hidden min-h-[140px] flex flex-col justify-end p-4 bg-[#442a1b]"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${media("/hero/shahjeet-hero.png")}')` }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#442a1b] via-[#442a1b]/40 to-transparent" />
            <span className="relative">
              <span className="block text-[#cd872a] text-[10px] uppercase tracking-[0.2em] mb-1">
                Featured
              </span>
              <span className="block text-white font-medium text-sm">
                Shahjeet Sticks — Tear. Squeeze. Perform. →
              </span>
            </span>
          </Link>

          <div className="bg-cream rounded-lg p-4 min-h-[140px] flex flex-col justify-end">
            <p className="text-text-medium text-xs mb-1">Not sure where to start?</p>
            <Link
              href="/dosha-quiz"
              className="text-[#cd872a] font-medium text-sm hover:underline"
              onClick={onClose}
            >
              Take the Dosha Quiz →
            </Link>
          </div>
        </div>

        {/* Column 4 — brand image */}
        <Link
          href="/products"
          onClick={onClose}
          className="group relative rounded-lg overflow-hidden min-h-[100px] lg:min-h-[140px]"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${media("/hero/rockresin-teaser.png")}')` }}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#442a1b]/70 to-transparent" />
          <span className="absolute bottom-3 left-3 text-white text-xs uppercase tracking-[0.18em]">
            Explore the Ritual →
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
