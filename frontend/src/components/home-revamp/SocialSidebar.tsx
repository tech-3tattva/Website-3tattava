"use client";
import { media } from "@/lib/media";

import { motion } from "framer-motion";

const SOCIAL_LINKS = [
  { label: "Instagram", icon: media("/icons/instagram.svg"), href: "https://www.instagram.com/3tattava" },
  { label: "Facebook", icon: media("/icons/facebook.svg"), href: "https://www.facebook.com/3tattava" },
  { label: "LinkedIn", icon: media("/icons/linkedin.svg"), href: "https://www.linkedin.com/company/3tattava" },
  { label: "WhatsApp", icon: media("/icons/whatsapp-line.svg"), href: "https://chat.whatsapp.com/FI9HnCNNPF3Fp20mU9avG1" },
] as const;

export default function SocialSidebar() {
  return (
    <div
      className="social-sidebar"
      style={{
        position: "fixed",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
      }}
    >
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        aria-label="Social media links"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "14px 8px",
          borderRadius: 9999,
          background: "rgba(247,240,226,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {SOCIAL_LINKS.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            whileHover={{ opacity: 1, scale: 1.15 }}
            transition={{ duration: 0.2 }}
            style={{ opacity: 0.5, display: "block", lineHeight: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.icon}
              alt={link.label}
              width={20}
              height={20}
              style={{ width: 20, height: 20 }}
            />
          </motion.a>
        ))}
      </motion.nav>

      <style jsx global>{`
        @media (max-width: 767px) {
          .social-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
