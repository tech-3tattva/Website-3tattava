"use client";

import { motion } from "framer-motion";
import { TRUST_STRIP_ITEMS } from "@/lib/constants";

export default function TrustStrip() {
  return (
    <section
      className="w-full text-white py-4 overflow-hidden border-t border-[#C8963E]/20"
      style={{ background: 'linear-gradient(90deg, #1c1304 0%, #2a1a08 100%)' }}
      aria-label="Trust badges"
    >
      {/* Desktop: staggered fade-in */}
      <div className="hidden md:flex items-center justify-center gap-6 md:gap-10 flex-wrap px-4">
        {TRUST_STRIP_ITEMS.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2"
          >
            {i > 0 && (
              <span className="text-[#C8963E]/50" aria-hidden>•</span>
            )}
            <span className="text-base" aria-hidden>{item.icon}</span>
            <span style={{ fontFamily: 'var(--font-primary), system-ui, sans-serif', fontVariationSettings: "'wdth' 75, 'wght' 500", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
      {/* Mobile: marquee scroll */}
      <div className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 scrollbar-hide animate-marquee">
        {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map((item, i) => (
          <div key={`${item.text}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="text-base">{item.icon}</span>
            <span style={{ fontFamily: 'var(--font-primary), system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
