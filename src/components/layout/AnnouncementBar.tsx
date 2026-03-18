"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "3tattva-announcement-dismissed";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setDismissed(stored === "true");
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "true");
  };

  if (dismissed) return null;

  return (
    <div
      className="relative w-full bg-primary-green text-white py-2 px-4 flex items-center justify-center min-h-[40px]"
      style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", letterSpacing: "0.08em" }}
    >
      <a href="#main" className="skip-to-main">
        Skip to main content
      </a>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="uppercase text-center"
        >
          {ANNOUNCEMENT_MESSAGES[index]}
        </motion.span>
      </AnimatePresence>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80 transition-opacity aria-label='Dismiss announcement'"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
