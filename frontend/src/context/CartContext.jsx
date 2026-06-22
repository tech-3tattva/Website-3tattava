import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartCtx = createContext(null);
const LS_KEY = "3tattava_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

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
    <CartCtx.Provider value={{ items, open, setOpen, add, remove, updateQty, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
