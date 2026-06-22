import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, open, setOpen, remove, updateQty, total, count } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        data-testid="cart-overlay"
      />
      <aside
        data-testid="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-cream z-[61] shadow-2xl transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <div>
            <div className="eyebrow">Your Ritual Cart</div>
            <div className="text-xs text-ink/60 mt-1">{count} item{count !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={() => setOpen(false)} data-testid="cart-close" aria-label="Close"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div className="font-serif-display text-2xl">Your ritual hasn't started.</div>
            <p className="text-sm text-ink/70">Choose RockResin for the Deep Ritual, or Shahjeet for the Fast Ritual.</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="btn-primary" data-testid="cart-shop-cta">Explore Rituals</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((it) => (
                <div key={it.slug} className="flex gap-4 py-5 border-b border-ink/10" data-testid={`cart-item-${it.slug}`}>
                  <img src={it.image} alt={it.name} className="w-20 h-24 object-cover" />
                  <div className="flex-1">
                    <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 90, 'wght' 600" }}>{it.name}</div>
                    <div className="text-xs eyebrow mt-1">₹{it.price.toLocaleString("en-IN")}</div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-ink/20">
                        <button onClick={() => updateQty(it.slug, it.qty - 1)} className="px-2 py-1.5" aria-label="dec"><Minus size={12} /></button>
                        <div className="px-3 text-xs">{it.qty}</div>
                        <button onClick={() => updateQty(it.slug, it.qty + 1)} className="px-2 py-1.5" aria-label="inc"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => remove(it.slug)} aria-label="Remove" className="ml-auto text-ink/40 hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-ink/10 bg-cream-deep/40">
              <div className="flex items-center justify-between mb-4">
                <span className="eyebrow">Subtotal</span>
                <span className="font-display text-2xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <Link to="/checkout/cart" onClick={() => setOpen(false)} className="btn-primary w-full" data-testid="cart-checkout-cta">Checkout</Link>
              <p className="text-[11px] eyebrow mt-3 text-center opacity-70">Free shipping above ₹999 · Cancel anytime</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
