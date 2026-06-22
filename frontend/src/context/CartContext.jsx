import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";

const CartCtx = createContext(null);
const LS_KEY = "3tattava_cart_v1";
const ABANDON_KEY = "3tattava_cart_abandon_email";
const ABANDON_DELAY_MS = 12 * 60 * 1000; // 12 minutes

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState(() => localStorage.getItem(ABANDON_KEY) || "");
  const abandonTimerRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const captureRecoveryEmail = useCallback((email) => {
    if (!email) return;
    setRecoveryEmail(email);
    localStorage.setItem(ABANDON_KEY, email);
  }, []);

  // Cart abandonment trigger: fire 12 mins after last cart change if items present + email known
  useEffect(() => {
    if (abandonTimerRef.current) {
      clearTimeout(abandonTimerRef.current);
      abandonTimerRef.current = null;
    }
    if (items.length > 0 && recoveryEmail) {
      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
      abandonTimerRef.current = setTimeout(() => {
        api.post("/cart/abandoned", { name: undefined, email: recoveryEmail, items, subtotal }).catch(() => {});
      }, ABANDON_DELAY_MS);
    }
    return () => abandonTimerRef.current && clearTimeout(abandonTimerRef.current);
  }, [items, recoveryEmail]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === product.slug);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { product_id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug) => setItems((p) => p.filter((it) => it.slug !== slug)), []);
  const updateQty = useCallback((slug, qty) => setItems((p) => p.map((it) => (it.slug === slug ? { ...it, qty: Math.max(1, qty) } : it))), []);
  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <CartCtx.Provider value={{ items, open, setOpen, add, remove, updateQty, clear, total, count, captureRecoveryEmail }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
