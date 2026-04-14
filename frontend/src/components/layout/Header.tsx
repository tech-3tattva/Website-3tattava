"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import DeliveryPincodeTrigger from "@/components/delivery/DeliveryPincodeTrigger";

const ICON_CLASS =
  "w-5 h-5 text-white hover:text-gold transition-colors duration-200";

const TIER2_HEIGHT_PX = 52;

export default function Header() {
  const { toggleDrawer, itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tier2Visible, setTier2Visible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 80) {
          setScrolled(true);
          setTier2Visible(y < lastScrollY.current);
        } else {
          setScrolled(false);
          setTier2Visible(true);
        }
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white">
        {/* Tier 1 — Utility Bar */}
        <div
          className={`h-12 bg-[#1A1A1A] flex items-center justify-between px-4 transition-shadow duration-300 ${
            scrolled ? "shadow-md backdrop-blur-sm" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="tablet:hidden p-2 text-white hover:text-gold transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden tablet:flex items-center gap-2 text-white/90 text-sm">
              <DeliveryPincodeTrigger className="text-white/90 text-sm" />
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 hidden tablet:block">
            <Logo variant="white" size="md" />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/search" className={ICON_CLASS} aria-label="Search">
              <Search size={20} />
            </Link>
            <Link href="/account" className={ICON_CLASS} aria-label="Account">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className={ICON_CLASS} aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative text-white hover:text-gold transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-gold text-text-dark text-xs font-medium flex items-center justify-center"
                  style={{ padding: "0 4px" }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="tablet:hidden absolute left-1/2 -translate-x-1/2">
            <Logo variant="white" size="md" />
          </div>
        </div>

        {/* Tier 2 — desktop/tablet only; mobile uses drawer to avoid cramped horizontal nav */}
        <div
          className="hidden tablet:block overflow-hidden border-b border-border bg-white transition-transform duration-300 ease-out"
          style={{
            height: TIER2_HEIGHT_PX,
            transform: tier2Visible ? "translateY(0)" : `translateY(-${TIER2_HEIGHT_PX}px)`,
          }}
        >
          <nav
            className="h-[52px] flex items-center justify-center gap-4 md:gap-8 px-3 md:px-4 min-w-0"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "var(--color-text-dark)",
            }}
          >
            {MAIN_NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.hasMega && setMegaOpen(item.label)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <Link
                  href={item.href}
                  className="uppercase hover:underline decoration-2 decoration-gold underline-offset-4 transition-all duration-300 flex items-center gap-1"
                  style={{
                    textUnderlineOffset: "4px",
                    boxShadow: "inset 0 -2px 0 0 var(--color-gold)",
                  }}
                >
                  {item.label}
                  {"featured" in item && item.featured && (
                    <span className="text-gold text-[10px]">●</span>
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Mega menu dropdown */}
        <div className="relative hidden tablet:block">
          {MAIN_NAV_ITEMS.filter((i) => i.hasMega).map((item) => (
            <MegaMenu
              key={item.label}
              isOpen={megaOpen === item.label}
              onClose={() => setMegaOpen(null)}
              title={item.label}
            />
          ))}
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
