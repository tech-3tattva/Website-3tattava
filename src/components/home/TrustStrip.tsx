"use client";

import { TRUST_STRIP_ITEMS } from "@/lib/constants";

export default function TrustStrip() {
  return (
    <section
      className="w-full bg-primary-green text-white py-4 overflow-hidden"
      aria-label="Trust badges"
    >
      <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap px-4">
        {TRUST_STRIP_ITEMS.map((item, i) => (
          <div key={item.text} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className="w-px h-4 bg-gold opacity-60 hidden md:block"
                aria-hidden
              />
            )}
            <span className="text-lg" aria-hidden>
              {item.icon}
            </span>
            <span className="text-sm font-sans uppercase tracking-wider whitespace-nowrap">
              {item.text}
            </span>
          </div>
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
