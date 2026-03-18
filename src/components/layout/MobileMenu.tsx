"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MAIN_NAV_ITEMS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 tablet:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed left-0 top-0 bottom-0 w-[min(320px,85vw)] bg-[#1A1A1A] z-50 tablet:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-display text-white text-xl">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-0">
                {MAIN_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/5 hover:text-gold transition-colors text-sm uppercase tracking-wider"
                      onClick={onClose}
                    >
                      {item.label}
                      <ChevronRight size={18} className="opacity-70" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/store-locator"
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                    onClick={onClose}
                  >
                    Store Locator
                    <ChevronRight size={18} className="opacity-70" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
                    onClick={onClose}
                  >
                    Contact Us
                    <ChevronRight size={18} className="opacity-70" />
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-white/10 space-y-4">
              <div>
                <p className="text-text-light text-xs uppercase mb-2">Change Pincode</p>
                <button
                  type="button"
                  className="text-gold text-sm hover:underline"
                  onClick={onClose}
                >
                  Deliver to: Delhi 110001
                </button>
              </div>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" aria-label="Instagram">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" aria-label="Facebook">
                  Facebook
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" aria-label="YouTube">
                  YouTube
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
