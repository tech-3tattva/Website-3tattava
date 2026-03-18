"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  variant?: string;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: { code: string; discount: number } | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return { ...state, items: state.items.filter((i) => i.id !== id) };
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      };
    }
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "CLEAR_CART":
      return { ...state, items: [], coupon: null };
    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_DRAWER":
      return { ...state, isOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
  toggleDrawer: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    coupon: null,
  });

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    dispatch({ type: "OPEN_DRAWER" });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    // Placeholder: in real app would call API
    if (code.toUpperCase() === "WELCOME15") {
      dispatch({ type: "APPLY_COUPON", payload: { code, discount: 15 } });
    } else {
      dispatch({ type: "APPLY_COUPON", payload: { code, discount: 0 } });
    }
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = state.coupon ? (subtotal * state.coupon.discount) / 100 : 0;
  const shipping = subtotal >= 999 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    ...state,
    addItem,
    removeItem,
    updateQty,
    applyCoupon,
    clearCart,
    toggleDrawer,
    subtotal,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
