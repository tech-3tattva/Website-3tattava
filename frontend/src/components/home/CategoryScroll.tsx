"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryScroll() {
  return (
    <section className="py-12 md:py-16 px-4 bg-cream">
      <h2
        className="font-display text-3xl md:text-[42px] text-center text-text-dark mb-8"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Explore by Need
      </h2>
      <div className="max-w-7xl mx-auto overflow-x-auto pb-4 flex gap-4 md:gap-6 justify-start md:justify-center scrollbar-hide snap-x snap-mandatory">
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.slug}
            whileHover={{ y: -4 }}
            className="shrink-0 snap-center"
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="block w-[180px] h-[220px] rounded-xl overflow-hidden border-2 border-transparent hover:border-gold hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: cat.color }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-white/50 mb-3" />
                <span
                  className="font-sans text-sm uppercase tracking-wider text-text-dark text-center"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
