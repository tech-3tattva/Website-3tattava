"use client";

import { motion } from "framer-motion";
import { HINDI_TAGLINE } from "@/lib/constants";

const BLOCKS = [
  {
    num: "01",
    title: "FORMULATED FOR YOUR DOSHA",
    body: "Every 3Tattva formulation begins with Prakriti — your unique mind-body constitution. Our certified Ayurvedacharyas design each product to bring your specific dosha into balance, using clinically tested ancient herbs.",
    visual: "☸",
    align: "left",
  },
  {
    num: "02",
    title: "SOURCED FROM SACRED ORIGINS",
    body: "We source Saffron from the Kashmir Valley, Shilajit from 18,000 ft in the Himalayas, Aloe Vera from the Thar Desert, and Ashwagandha from Madhya Pradesh. Each ingredient is traceable, tested, and authentic.",
    visual: "🌿",
    align: "right",
  },
  {
    num: "03",
    title: "HOLISTIC TRANSFORMATION, NOT JUST PRODUCTS",
    body: "We don't stop at formulating products. 3Tattva offers free Ayurvedic consultations, personalized dosha diet plans, seasonal wellness guides, and lifestyle recommendations — because true health is a journey of Becoming.",
    visual: "🪷",
    align: "left",
  },
];

const DIVIDER_SHLOKA = "यथा हि एकेन चक्रेण न रथस्य गतिर्भवेत्।";

export default function ThreeTattvasSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="text-center mb-12 px-4">
        <h2
          className="font-display text-4xl md:text-[46px] text-text-dark mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Why 3Tattva?
        </h2>
        <p
          className="font-devanagari text-gold text-lg md:text-xl"
          style={{ fontFamily: "Noto Serif Devanagari, serif", color: "var(--color-gold)" }}
        >
          {HINDI_TAGLINE}
        </p>
      </div>

      {BLOCKS.map((block, i) => (
        <div key={block.num}>
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                block.align === "right" ? "md:direction-rtl" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: block.align === "left" ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={block.align === "right" ? "md:order-2" : ""}
              >
                <span
                  className="font-display text-[120px] leading-none text-gold block mb-4"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "var(--color-gold)",
                  }}
                >
                  {block.num}
                </span>
                <h3 className="font-sans font-bold text-xl uppercase tracking-wider text-text-dark mb-4">
                  {block.title}
                </h3>
                <p className="text-text-medium text-base leading-relaxed">
                  {block.body}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`flex justify-center ${block.align === "right" ? "md:order-1" : ""}`}
              >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-beige-dark flex items-center justify-center text-7xl md:text-8xl">
                  {block.visual}
                </div>
              </motion.div>
            </div>
          </div>
          {i < BLOCKS.length - 1 && (
            <div className="w-full bg-primary-green py-4 px-6">
              <p className="text-white text-center font-devanagari text-sm md:text-base max-w-2xl mx-auto">
                {DIVIDER_SHLOKA}
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
