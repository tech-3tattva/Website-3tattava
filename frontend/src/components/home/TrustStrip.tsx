"use client";

import { motion } from "framer-motion";
import { TRUST_STRIP_ITEMS } from "@/lib/constants";

export default function TrustStrip() {
  return (
    <section
      className="w-full bg-[#241e18] text-white py-4 overflow-hidden border-t border-[#d4a574]/20"
      aria-label="Trust badges"
    >
      <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap px-4">
        {TRUST_STRIP_ITEMS.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2"
          >
            {i > 0 && (
              <span
                className="text-[#d4a574]/50 hidden md:block"
                aria-hidden
              >
                •
              </span>
            )}
            <span className="text-lg" aria-hidden>
              {item.icon}
            </span>
            <span className="text-sm font-sans uppercase tracking-[0.18em] whitespace-nowrap">
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 scrollbar-hide animate-marquee">
        {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map((item, i) => (
          <div key={`${item.text}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm uppercase tracking-wider">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
