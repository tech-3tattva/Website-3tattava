"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const {
    isOpen,
    toggleDrawer,
    items,
    subtotal,
    total,
    coupon,
  } = useCart();

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleDrawer();
    };
    if (isOpen) {
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, toggleDrawer]);

  const shipping = subtotal >= 999 ? 0 : 150;
  const discount = coupon ? (subtotal * coupon.discount) / 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={toggleDrawer}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="font-sans font-medium text-lg text-text-dark">
                My Cart
              </h2>
              <button
                type="button"
                onClick={toggleDrawer}
                className="p-2 hover:bg-beige rounded transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                <div className="py-12 text-center text-text-medium">
                  <p className="mb-4">Your cart is empty.</p>
                  <Link
                    href="/products"
                    className="text-primary-green font-medium hover:underline"
                    onClick={toggleDrawer}
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <>
                <div className="border-t border-border" />
                <div className="px-4 py-4 bg-cream/50 rounded-t-lg mx-4 mb-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-sm">
                      <span>Coupon Discount</span>
                      <span className="text-green-600">
                        –{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="px-4 pb-6 space-y-2">
                  <Link
                    href="/checkout/cart"
                    onClick={toggleDrawer}
                    className="block w-full py-3 text-center border-2 border-text-dark bg-white text-text-dark font-medium hover:bg-beige transition-colors"
                  >
                    VIEW CART
                  </Link>
                  <Link
                    href="/checkout/address"
                    onClick={toggleDrawer}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-text-dark text-white font-medium hover:bg-primary-green transition-colors"
                  >
                    <Lock size={16} /> SECURE CHECKOUT
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
