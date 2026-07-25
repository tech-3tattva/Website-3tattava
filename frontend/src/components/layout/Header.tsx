"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";

/* ─── Palette ─── */
const INK   = "#442a1b";
const CREAM = "#f7f0e2";
const GOLD  = "#cd872a";
const FONT  = "var(--font-primary), system-ui, sans-serif";

/* ─── Nav links ─── */
interface NavLink {
  label: string;
  href: string;
  hasMega: boolean;
  featured?: boolean;
}

const PILL_NAV_LINKS: NavLink[] = [
  { label: "Shop",              href: "/products",          hasMega: false },
  { label: "Knowledge Center",  href: "/knowledge-center",  hasMega: false },
  { label: "Our Story",         href: "/about",             hasMega: false },
  { label: "VaidyaConnect",     href: "/vaidyaconnect",     hasMega: false, featured: true },
  { label: "Research & Testing", href: "/research-testing",  hasMega: false },
  { label: "Find Us",           href: "/find-us",           hasMega: false },
];

/* ─── Glass styles ─── */
interface GlassStyle {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  border: string;
  boxShadow: string;
}

const GLASS_DARK: GlassStyle = {
  background: "rgba(68,42,27,0.45)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(247,240,226,0.18)",
  boxShadow: "none",
};

const GLASS_LIGHT: GlassStyle = {
  background: "rgba(247,240,226,0.55)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(205,135,42,0.25)",
  boxShadow: "0 8px 32px rgba(68,42,27,0.12)",
};

/* ─── Marquee messages ─── */
const TICKER_ITEMS = [
  "✦ 80+ Ionic Trace Minerals",
  "◆ 70%+ Fulvic Acid — Third-Party Lab Tested",
  "✦ Free Shipping Above ₹999",
  "◆ Tear · Squeeze · Perform — Honey Sticks",
  "✦ Doctor-Formulated by Dr. Kashish (BAMS)",
  "◆ Pure Himalayan Shilajit Resin — 600mg",
  "✦ Classically Purified Through Triphala",
  "◆ Performance Ayurveda for Modern Humans",
  "✦ Lab Reports on Every Product",
  "◆ India\u2019s First Shilajit Honey Sticks",
];

export default function Header() {
  const { toggleDrawer, itemCount } = useCart();
  const reduce = useReducedMotion();

  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const ticking = useRef(false);

  /* ── Scroll listener: switch glass at 80px ── */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close search on Escape ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileSheetOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const glass = scrolled ? GLASS_LIGHT : GLASS_DARK;
  const textColor = scrolled ? INK : CREAM;
  const hoverColor = GOLD;
  const pillHeight = 56;

  return (
    <>
      {/* ═══════ Floating Pill Navbar ═══════ */}
      <div
        className="fixed z-50"
        style={{
          top: 44,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <motion.header
          initial={reduce ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 28, delay: 0.1 }
          }
          style={{
            width: "min(96vw, 1320px)",
            height: pillHeight,
          borderRadius: 18,
            ...glass,
            transition: "background 300ms, border 300ms, box-shadow 300ms",
            display: "flex",
            alignItems: "center",
            fontFamily: FONT,
            pointerEvents: "auto",
            position: "relative",
          }}
        >
        <div
          className="flex items-center justify-between w-full"
          style={{ padding: "0 20px", height: "100%" }}
        >
          {/* ── Left: Logo ── */}
          <div className="flex items-center" style={{ flexShrink: 0 }}>
            <Logo variant={scrolled ? "dark" : "white"} size="sm" className="!bg-transparent" />
          </div>

          {/* ── Center: Nav links (desktop only) ── */}
          <nav
            className="hidden tablet:flex items-center gap-1"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {PILL_NAV_LINKS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.hasMega ? setMegaOpen(item.label) : undefined}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <Link
                  href={item.href}
                  className="block px-2 py-2 uppercase transition-colors duration-200"
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: textColor,
                    fontFamily: FONT,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = textColor;
                  }}
                >
                  {item.label}
                  {item.featured && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#cd872a", marginLeft: 4, verticalAlign: "middle" }} />}
                </Link>
              </div>
            ))}
          </nav>

          {/* ── Right: Icons ── */}
          <div className="flex items-center gap-1 md:gap-2" style={{ flexShrink: 0 }}>
            {/* Search — desktop only */}
            <button
              type="button"
              className="hidden tablet:flex items-center justify-center cursor-pointer transition-colors duration-200"
              style={{ color: textColor, width: 36, height: 36 }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={() => setSearchOpen((o) => !o)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Account — desktop only */}
            <Link
              href="/account"
              className="hidden tablet:flex items-center justify-center transition-colors duration-200"
              style={{ color: textColor, width: 36, height: 36 }}
              aria-label="Account"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
            >
              <User size={18} />
            </Link>

            {/* Cart — always visible */}
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative flex items-center justify-center transition-colors duration-200"
              style={{ color: textColor, width: 36, height: 36 }}
              aria-label="Open cart"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full flex items-center justify-center"
                  style={{
                    background: GOLD,
                    color: INK,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "0 3px",
                    lineHeight: 1,
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="tablet:hidden flex items-center justify-center cursor-pointer transition-colors duration-200"
              style={{ color: textColor, width: 36, height: 36 }}
              onClick={() => setMobileSheetOpen(true)}
              aria-label="Open menu"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── Desktop search dropdown (anchored to pill) ── */}
        <AnimatePresence>
          {searchOpen && (
            <div
              className="hidden tablet:block absolute"
              style={{
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "min(480px, 90vw)",
                  background: "rgba(247,240,226,0.92)",
                  backdropFilter: "blur(20px) saturate(160%)",
                  WebkitBackdropFilter: "blur(20px) saturate(160%)",
                  borderRadius: 24,
                  padding: "12px 16px",
                  border: "1px solid rgba(205,135,42,0.25)",
                  boxShadow: "0 12px 40px rgba(68,42,27,0.15)",
                  zIndex: 60,
                  pointerEvents: "auto",
                }}
              >
                <SearchAutocomplete
                  autoFocus
                  onClose={() => setSearchOpen(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Mega menu dropdown (anchored to pill bottom) ── */}
        <div className="hidden tablet:block">
          {PILL_NAV_LINKS.filter((i) => i.hasMega).map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setMegaOpen(item.label)}
              onMouseLeave={() => setMegaOpen(null)}
            >
              <MegaMenu
                isOpen={megaOpen === item.label}
                onClose={() => setMegaOpen(null)}
                title={item.label}
              />
            </div>
          ))}
        </div>
      </motion.header>
      </div>

      {/* ═══════ Full-width black ribbon marquee — above the navbar ═══════ */}
      <div
        className="fixed left-0 right-0 z-50 overflow-hidden select-none pointer-events-none"
        style={{
          top: 0,
          height: 34,
          background: "#130c05",
          borderBottom: "1px solid rgba(205,135,42,0.28)",
        }}
      >
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            animation: "marquee-scroll 45s linear infinite",
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "rgba(247,240,226,0.88)",
            height: 34,
            lineHeight: "34px",
          }}
        >
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center">
              {TICKER_ITEMS.map((msg) => (
                <span key={msg} style={{ padding: "0 26px" }}>
                  {msg}
                </span>
              ))}
            </span>
          ))}
        </div>
        <style jsx global>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ═══════ Mobile Glass Dropdown Sheet ═══════ */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 tablet:hidden"
              style={{ background: "rgba(68,42,27,0.3)" }}
              onClick={() => setMobileSheetOpen(false)}
              aria-hidden
            />

            {/* Centering wrapper — avoids framer-motion transform conflict */}
            <div
              className="fixed z-50 tablet:hidden"
              style={{
                top: 108,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                style={{
                  width: "min(92vw, 400px)",
                  borderRadius: 24,
                  background: "rgba(68,42,27,0.85)",
                  backdropFilter: "blur(24px) saturate(160%)",
                  WebkitBackdropFilter: "blur(24px) saturate(160%)",
                  border: "1px solid rgba(247,240,226,0.15)",
                  boxShadow: "0 16px 48px rgba(68,42,27,0.25)",
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
              {/* Close button */}
              <div className="flex justify-end p-3 pb-0">
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  style={{ color: CREAM }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div style={{ padding: "8px 20px 12px" }}>
                <SearchAutocomplete
                  onClose={() => setMobileSheetOpen(false)}
                />
              </div>

              {/* Nav links */}
              <nav className="flex flex-col" style={{ padding: "0 8px 8px" }}>
                {PILL_NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block transition-colors duration-200"
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      color: CREAM,
                      fontFamily: FONT,
                      borderRadius: 12,
                    }}
                    onClick={() => setMobileSheetOpen(false)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(247,240,226,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Account link at bottom */}
              <div
                style={{
                  borderTop: "1px solid rgba(247,240,226,0.10)",
                  padding: "12px 24px 16px",
                }}
              >
                <Link
                  href="/account"
                  className="flex items-center gap-3 transition-colors duration-200"
                  style={{ color: CREAM, fontSize: 13, fontWeight: 500, fontFamily: FONT }}
                  onClick={() => setMobileSheetOpen(false)}
                >
                  <User size={16} />
                  My Account
                </Link>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* MobileMenu preserved — glass sheet now handles mobile nav */}
    </>
  );
}
