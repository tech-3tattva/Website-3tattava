"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";

const ICON_CLASS_DARK = "w-5 h-5 text-white hover:text-[#C8963E] transition-colors duration-200";
const ICON_CLASS_LIGHT = "w-5 h-5 text-[#1c1304] hover:text-[#C8963E] transition-colors duration-200";

const TIER2_HEIGHT_PX = 52;

export default function Header() {
  const { toggleDrawer, itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tier2Visible, setTier2Visible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const iconClass = scrolled ? ICON_CLASS_LIGHT : ICON_CLASS_DARK;

  return (
    <>
      <header
        className="sticky top-0 z-30 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(247,240,226,0.97)" : "#1c1304",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 2px 20px rgba(28,19,4,0.12)" : "none",
        }}
      >
        {/* Tier 1 — Utility Bar */}
        <div className="h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`tablet:hidden p-2 transition-colors ${scrolled ? "text-[#1c1304] hover:text-[#C8963E]" : "text-white hover:text-[#C8963E]"}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 hidden tablet:block">
            <Logo variant={scrolled ? "dark" : "white"} size="md" />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              className={`${iconClass} cursor-pointer`}
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={() => setSearchOpen(o => !o)}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <Link href="/account" className={iconClass} aria-label="Account">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className={iconClass} aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <button
              type="button"
              onClick={toggleDrawer}
              className={`relative transition-colors ${scrolled ? "text-[#1c1304] hover:text-[#C8963E]" : "text-white hover:text-[#C8963E]"}`}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#C8963E] text-[#1c1304] text-xs font-medium flex items-center justify-center"
                  style={{ padding: "0 4px" }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="tablet:hidden absolute left-1/2 -translate-x-1/2">
            <Logo variant={scrolled ? "dark" : "white"} size="md" />
          </div>
        </div>

        {/* Tier 2 — nav links OR search bar */}
        <div
          className="hidden tablet:block overflow-hidden transition-all duration-300 ease-out"
          style={{
            height: tier2Visible ? TIER2_HEIGHT_PX : 0,
            opacity: tier2Visible ? 1 : 0,
            borderBottom: scrolled ? "1px solid rgba(28,19,4,0.10)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {searchOpen ? (
            <div className="h-[52px] flex items-center px-6 gap-4">
              <div style={{ flex: 1, maxWidth: 600, margin: "0 auto" }}>
                <SearchAutocomplete
                  autoFocus
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            </div>
          ) : (
            <nav
              className="h-[52px] flex items-center justify-center gap-4 md:gap-8 px-3 md:px-4 min-w-0"
              style={{
                fontFamily: "var(--font-primary), system-ui, sans-serif",
                fontVariationSettings: "'wdth' 75, 'wght' 500",
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: scrolled ? "#1c1304" : "rgba(247,240,226,0.90)",
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
                    className="nav-link uppercase flex items-center gap-1"
                  >
                    {item.label}
                    {"featured" in item && item.featured && (
                      <span style={{ color: "#C8963E", fontSize: "10px" }}>●</span>
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile search bar — slides in below header when search is open */}
        {searchOpen && (
          <div
            className="tablet:hidden px-4 py-3 border-b"
            style={{ background: scrolled ? "rgba(247,240,226,0.97)" : "#1c1304", borderColor: "rgba(200,150,62,0.2)", boxShadow: "0 4px 16px rgba(28,19,4,0.08)" }}
          >
            <SearchAutocomplete
              autoFocus
              onClose={() => setSearchOpen(false)}
            />
          </div>
        )}

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
