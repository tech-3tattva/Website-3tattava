"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import type { ServerCart } from "@shared/types";
import { api, USE_MOCK, validateCoupon } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";

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

/** Applied coupon. Flat welcome coupons carry `discountAmount` (rupees) + `type:"flat"`;
 *  legacy percent coupons only carry `discount` (percent). */
export type CartCoupon = { code: string; discount: number; discountAmount?: number; type?: string };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: CartCoupon | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "APPLY_COUPON"; payload: CartCoupon }
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
  discount: number;
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
    coupon: cart.coupon as CartCoupon | null,
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
  const discount =
    state.coupon
      ? state.coupon.discountAmount && state.coupon.discountAmount > 0
        ? Math.min(state.coupon.discountAmount, subtotal)
        : (subtotal * state.coupon.discount) / 100
      : 0;
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

  const mergedOnLogin = useRef(false);
  useEffect(() => {
    if (authLoading) return;
    (async () => {
      // On login, merge any guest cart into the user's cart before hydrating,
      // so items added while logged out are not lost.
      if (isLoggedIn && !mergedOnLogin.current) {
        mergedOnLogin.current = true;
        try {
          await api.post("/cart/merge", {}, true);
        } catch (error) {
          console.error("Cart merge failed", error);
        }
      } else if (!isLoggedIn) {
        mergedOnLogin.current = false;
      }
      await hydrateCart();
    })();
  }, [authLoading, isLoggedIn, hydrateCart]);

  const addItem = useCallback(async (item: CartItem) => {
    const trackAdd = () => {
      trackPixel("AddToCart", {
        content_ids: [item.productId],
        content_name: item.name,
        content_type: "product",
        value: item.price * item.quantity,
        currency: "INR",
        contents: [{ id: item.productId, quantity: item.quantity, item_price: item.price }],
      });
      trackGa("add_to_cart", {
        currency: "INR",
        value: item.price * item.quantity,
        items: [{ item_id: item.productId, item_name: item.name, price: item.price, quantity: item.quantity }],
      });
    };
    if (USE_MOCK) {
      dispatch({ type: "ADD_ITEM", payload: item });
      dispatch({ type: "OPEN_DRAWER" });
      trackAdd();
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
    trackAdd();
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

    // Send the user's Bearer when signed in so owner-bound welcome codes resolve.
    const validation = await validateCoupon(code, subtotal, isLoggedIn);

    if (!validation.valid) {
      throw new Error(validation.message ?? "Invalid coupon");
    }

    const cart = await api.post<ServerCart>("/cart/coupon", { code }, isLoggedIn);
    dispatch({ type: "HYDRATE_CART", payload: mapServerCart(cart) });
    // Overlay the validated flat/percent data so the rupee reduction is authoritative.
    dispatch({
      type: "APPLY_COUPON",
      payload: {
        code: validation.code ?? code,
        discount: validation.discount,
        discountAmount: validation.discountAmount,
        type: validation.type,
      },
    });
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
    discount,
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
