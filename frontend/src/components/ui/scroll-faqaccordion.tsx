"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

export interface FAQItem {
  id: number | string;
  question: string;
  answer: string;
}

interface ScrollFAQAccordionProps {
  data: FAQItem[];
  title?: string;
  subtitle?: string;
  /** When true (default), each item auto-opens as it scrolls through the viewport centre. */
  autoOpenOnScroll?: boolean;
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
}

function FAQRow({
  faq,
  index,
  isOpen,
  autoOpen,
  reduce,
  onToggle,
  onCenter,
  questionClassName,
  answerClassName,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  autoOpen: boolean;
  reduce: boolean;
  onToggle: (id: FAQItem["id"]) => void;
  onCenter: (id: FAQItem["id"]) => void;
  questionClassName?: string;
  answerClassName?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const revealed = useInView(ref, { once: true, margin: "-60px" });
  // Narrow central band — item is "in view" only while it sits near the viewport centre.
  const centered = useInView(ref, { margin: "-46% 0px -46% 0px" });

  React.useEffect(() => {
    if (autoOpen && centered) onCenter(faq.id);
  }, [autoOpen, centered, faq.id, onCenter]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={revealed || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
      style={{ marginBottom: "0.85rem" }}
    >
      <button
        type="button"
        onClick={() => onToggle(faq.id)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          className={questionClassName}
          style={{
            flex: "1 1 auto",
            borderRadius: 14,
            padding: "14px 20px",
            background: isOpen ? "rgba(205,135,42,0.16)" : "rgba(68,42,27,0.05)",
            color: isOpen ? "#a4661a" : "#442a1b",
            fontFamily: F,
            fontVariationSettings: "'wght' 600",
            fontSize: "clamp(15px, 1.7vw, 17px)",
            lineHeight: 1.4,
            transition: "background .3s ease, color .3s ease",
          }}
        >
          {faq.question}
        </span>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 999,
            background: isOpen ? "#cd872a" : "rgba(68,42,27,0.06)",
            color: isOpen ? "#f7f0e2" : "#8a7355",
            transition: "background .3s ease, color .3s ease",
          }}
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: "clamp(28px,8vw,64px)", marginTop: "0.8rem" }}>
              <div
                className={answerClassName}
                style={{
                  maxWidth: 560,
                  borderRadius: 18,
                  padding: "15px 22px",
                  background: "#442a1b",
                  color: "#f7f0e2",
                  fontFamily: F,
                  fontVariationSettings: "'wght' 400",
                  fontSize: "clamp(13.5px, 1.5vw, 16px)",
                  lineHeight: 1.7,
                  boxShadow: "0 12px 30px rgba(68,42,27,0.16)",
                }}
              >
                {faq.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Scroll-driven FAQ accordion — each answer opens as its question passes the
 * viewport centre (and on click). Brand-themed (cream / espresso / gold),
 * built on framer-motion so it needs no extra deps.
 */
export default function ScrollFAQAccordion({
  data,
  title = "Frequently Asked Questions",
  subtitle,
  autoOpenOnScroll = true,
  className,
  questionClassName,
  answerClassName,
}: ScrollFAQAccordionProps) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = React.useState<FAQItem["id"] | null>(data[0]?.id ?? null);
  const headRef = React.useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, margin: "-80px" });

  const toggle = React.useCallback((id: FAQItem["id"]) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);
  const center = React.useCallback((id: FAQItem["id"]) => setOpenId(id), []);

  return (
    <div className={cn("shj-faq", className)} style={{ maxWidth: 820, margin: "0 auto" }}>
      {(title || subtitle) && (
        <motion.div
          ref={headRef}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={headIn || reduce ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(2rem,4vw,3rem)" }}
        >
          {title && (
            <h2 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(26px, 4vw, 44px)", color: "#442a1b", letterSpacing: "-0.02em", margin: 0 }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontFamily: F, fontSize: "clamp(14px,1.6vw,16px)", color: "#8a7355", margin: "0.75rem auto 0", maxWidth: 560, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      <div>
        {data.map((faq, i) => (
          <FAQRow
            key={faq.id}
            faq={faq}
            index={i}
            isOpen={openId === faq.id}
            autoOpen={autoOpenOnScroll && !reduce}
            reduce={!!reduce}
            onToggle={toggle}
            onCenter={center}
            questionClassName={questionClassName}
            answerClassName={answerClassName}
          />
        ))}
      </div>
    </div>
  );
}
