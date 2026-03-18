"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function DoshaQuizBanner() {
  return (
    <section className="w-full bg-beige-dark py-16 md:py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='%232D5A3D'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-6xl mx-auto grid md:grid-cols-[55%_45%] gap-12 items-center relative z-10">
        <div>
          <h2
            className="font-display text-4xl md:text-[52px] text-primary-green mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            What&apos;s Your Dosha?
          </h2>
          <p className="text-text-medium text-base md:text-lg mb-6 font-sans">
            Vata. Pitta. Kapha. Discover your unique Ayurvedic mind-body type and
            find the products formulated specifically for you.
          </p>
          <Link href="/dosha-quiz">
            <Button variant="secondary" size="lg" className="rounded-full">
              Take the Free Quiz →
            </Button>
          </Link>
        </div>
        <div className="relative flex justify-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gold/30 flex items-center justify-center bg-white/50"
            style={{ willChange: "transform" }}
          >
            <div className="text-6xl md:text-8xl text-primary-green/40">☸</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
