"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import type { CouponValidateResponse, ServerCart } from "@shared/types";
import { api, USE_MOCK } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/** Must match the Product `id` from the API (Mongo ObjectId string) so checkout can decrement stock. SKU is accepted server-side as a fallback. */
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
  | { type: "HYDRATE_CART"; payload: Pick<CartState, "items" | "coupon"> }
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
    case "HYDRATE_CART":
      return { ...state, items: action.payload.items, coupon: action.payload.coupon };
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
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleDrawer: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function toCartItemId(item: {
  productId: string;
  variant?: string;
}): string {
  return `${item.productId}${item.variant ? `::${item.variant}` : ""}`;
}

function mapServerCart(cart: ServerCart): Pick<CartState, "items" | "coupon"> {
  return {
    items: cart.items.map((item) => ({
      id: toCartItemId(item),
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      slug: item.slug,
      variant: item.variant,
    })),
    coupon: cart.coupon,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    coupon: null,
  });

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = state.coupon ? (subtotal * state.coupon.discount) / 100 : 0;
  const shipping = subtotal >= 999 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const hydrateCart = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      const cart = await api.get<ServerCart>("/cart", isLoggedIn);
      dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
    } catch (error) {
      console.error("Failed to hydrate cart", error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    void hydrateCart();
  }, [authLoading, hydrateCart]);

  const addItem = useCallback(async (item: CartItem) => {
    if (USE_MOCK) {
      dispatch({ type: "ADD_ITEM", payload: item });
      dispatch({ type: "OPEN_DRAWER" });
      return;
    }

    const cart = await api.post<ServerCart>(
      "/cart/items",
      {
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        mrp: item.mrp,
        quantity: item.quantity,
        slug: item.slug,
        variant: item.variant,
      },
      isLoggedIn
    );
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
    dispatch({ type: "OPEN_DRAWER" });
  }, [isLoggedIn]);

  const removeItem = useCallback(async (id: string) => {
    if (USE_MOCK) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
      return;
    }

    const cart = await api.delete<ServerCart>(`/cart/items/${id}`, isLoggedIn);
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
  }, [isLoggedIn]);

  const updateQty = useCallback(async (id: string, qty: number) => {
    if (USE_MOCK) {
      dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
      return;
    }

    const cart = await api.put<ServerCart>(`/cart/items/${id}`, { qty }, isLoggedIn);
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
  }, [isLoggedIn]);

  const applyCoupon = useCallback(async (code: string) => {
    if (USE_MOCK) {
      if (code.toUpperCase() === "WELCOME15") {
        dispatch({ type: "APPLY_COUPON", payload: { code, discount: 15 } });
      } else {
        dispatch({ type: "APPLY_COUPON", payload: { code, discount: 0 } });
      }
      return;
    }

    const validation = await api.post<CouponValidateResponse>("/coupons/validate", {
      code,
      cartTotal: subtotal,
    });

    if (!validation.valid) {
      throw new Error(validation.message ?? "Invalid coupon");
    }

    const cart = await api.post<ServerCart>("/cart/coupon", { code }, isLoggedIn);
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
  }, [isLoggedIn, subtotal]);

  const clearCart = useCallback(async () => {
    if (USE_MOCK) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    const cart = await api.delete<ServerCart>("/cart", isLoggedIn);
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
  }, [isLoggedIn]);

  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);

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
