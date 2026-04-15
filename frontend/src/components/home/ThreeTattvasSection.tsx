"use client";

import { useRef } from "react";
import Image from "@/components/ui/SafeImage";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { TATTVA_BLOCKS } from "@/lib/home-assets";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

function TattvaRow({
  block,
  index,
}: {
  block: (typeof TATTVA_BLOCKS)[number];
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const imageOnRight = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.65, 1, 1, 0.75]);
  const textY = useTransform(scrollYProgress, [0, 1], [18, -12]);
  const opacitySpring = useSpring(textOpacity, { stiffness: 120, damping: 38 });
  const ySpring = useSpring(textY, { stiffness: 120, damping: 38 });

  return (
    <article
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-2 md:min-h-[72vh] border-b border-border/60 last:border-b-0 bg-white"
    >
      <div
        className={`relative min-h-[42vh] md:min-h-[72vh] h-full w-full overflow-hidden ${
          imageOnRight ? "md:order-2" : ""
        }`}
      >
        <ParallaxMedia
          scrollTargetRef={sectionRef}
          src={block.imageSrc}
          alt={`${block.title} — Three Tattvas`}
          sizes="(max-width: 768px) 100vw, 50vw"
          containerClassName="absolute inset-0 min-h-[280px] md:min-h-full"
          scaleRange={[1.08, 1, 1.06]}
          yRange={[32, -32]}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#faf7f2]/75 md:to-black/20 md:from-black/25"
          aria-hidden
        />
      </div>

      <div
        className={`flex flex-col justify-center px-6 py-12 md:px-12 md:py-16 lg:px-16 ${
          imageOnRight ? "md:order-1" : ""
        }`}
      >
        <motion.div
          style={
            reduceMotion
              ? undefined
              : {
                  opacity: opacitySpring,
                  y: ySpring,
                }
          }
        >
          <span
            className="font-display text-7xl leading-none text-text-dark/12 block mb-2 md:mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
            aria-hidden
          >
            {block.num}
          </span>
          <p className="text-xs uppercase tracking-[0.28em] text-gold mb-3">
            {block.num} &mdash; {block.title.toUpperCase()} &rarr; {block.outcome}
          </p>
          <h3
            className="font-display text-4xl md:text-5xl text-text-dark mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {block.outcome}
          </h3>
          <p className="text-base leading-relaxed text-text-medium max-w-md">{block.body}</p>
        </motion.div>
      </div>
    </article>
  );
}

export default function ThreeTattvasSection() {
  return (
    <section className="bg-[#faf7f2]" aria-labelledby="three-tattvas-heading">
      <div className="text-center px-4 pt-20 pb-12 md:pt-24 md:pb-14 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">The 3TATTAVA System</p>
        <h2
          id="three-tattvas-heading"
          className="font-display text-4xl md:text-[46px] text-text-dark"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Three Elements. One Performance System.
        </h2>
        <p className="mt-5 text-base md:text-lg text-text-medium leading-relaxed">
          3TATTAVA is built on the three fundamental energies that govern your body &mdash; Vata, Pitta, Kapha. When they&apos;re balanced and fuelled, you perform. When they&apos;re depleted, you crash. <span className="text-text-dark font-medium">We fix the foundation.</span>
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-8"
        >
          {TATTVA_BLOCKS.map(({ title, imageSrc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gold/50 shadow-md ring-2 ring-white">
                <Image src={imageSrc} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-text-medium">{title}</span>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
          className="mx-auto mt-8 h-px max-w-xs origin-center bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />
      </div>

      <div className="max-w-[1600px] mx-auto">
        {TATTVA_BLOCKS.map((block, i) => (
          <TattvaRow key={block.key} block={block} index={i} />
        ))}
      </div>
    </section>
  );
}
