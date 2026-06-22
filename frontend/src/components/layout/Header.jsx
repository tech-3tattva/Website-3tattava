import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { LOGO_WORDMARK } from "../../lib/assets";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/knowledge-center", label: "Knowledge Center" },
  { to: "/our-story", label: "Our Story" },
  { to: "/vaidyaconnect", label: "VaidyaConnect", dot: true },
  { to: "/research-testing", label: "Research & Testing" },
  { to: "/community", label: "Community" },
  { to: "/find-us", label: "Find Us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isDark = !scrolled && !mobileOpen;
  const textCls = isDark ? "text-cream" : "text-ink";

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-cream/95 backdrop-blur-xl shadow-[0_6px_30px_rgba(28,19,4,0.08)]" : "bg-ink"}`}
    >
      {/* Tier 1 */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        <Link to="/" data-testid="site-logo" className="flex items-center gap-2 group">
          <span className={`font-display text-2xl md:text-3xl ${textCls}`} style={{ fontVariationSettings: "'wdth' 75, 'wght' 800" }}>
            3<span className="gold-gradient-text">TATTAVA</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={({ isActive }) =>
                `nav-link eyebrow ${textCls} ${isActive ? "opacity-100" : "opacity-90 hover:opacity-100"}`
              }
            >
              {n.label}
              {n.dot && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <Link to="/search" data-testid="nav-search" aria-label="Search"><Search size={18} className={textCls} /></Link>
          <Link to="/account" data-testid="nav-account" aria-label="Account" className="hidden sm:block"><User size={18} className={textCls} /></Link>
          <Link to="/wishlist" data-testid="nav-wishlist" aria-label="Wishlist" className="hidden sm:block"><Heart size={18} className={textCls} /></Link>
          <button data-testid="nav-cart" aria-label="Cart" onClick={() => setOpen(true)} className="relative">
            <ShoppingBag size={18} className={textCls} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </button>
          <button data-testid="nav-mobile-toggle" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X size={20} className={textCls} /> : <Menu size={20} className={textCls} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div data-testid="mobile-menu" className="lg:hidden bg-ink border-t border-gold/20 px-6 py-6">
          <nav className="flex flex-col gap-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="eyebrow text-cream py-2 border-b border-gold/10">
                {n.label}{n.dot && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-gold" />}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
