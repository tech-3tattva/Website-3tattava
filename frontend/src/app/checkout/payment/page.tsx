"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_PAYMENT_PATH } from "@/lib/auth-redirect";
import { formatPrice } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";
import { getAttribution } from "@/lib/attribution";

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "production" | "sandbox" }) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => void;
    };
  }
}

function cashfreeMode(): "production" | "sandbox" {
  const envMode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
  if (envMode === "production" || envMode === "prod") return "production";
  // Fallback: go live on the production domain even if the Vercel build-time env
  // var isn't set.
  if (typeof window !== "undefined" && /(^|\.)3tattava\.com$/.test(window.location.hostname)) {
    return "production";
  }
  return "sandbox";
}

function loadCashfree(): Promise<boolean> {
  const { promise, resolve } = Promise.withResolvers<boolean>();
  if (typeof window !== "undefined" && window.Cashfree) {
    resolve(true);
    return promise;
  }
  const script = document.createElement("script");
  // Cashfree JS SDK v3 — the current hosted-checkout SDK. The old v2.0.0 UI SDK
  // is incompatible with payment sessions created via the modern PG API version
  // (that mismatch is what opened Cashfree's bare config page instead of checkout).
  script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
  return promise;
}

type CreateCashfreeResponse = {
  orderNumber: string;
  paymentSessionId: string;
  cfOrderId: string;
  mode: string;
};

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { subtotal, total, items, coupon, discount } = useCart();

  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkoutFired = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(CHECKOUT_PAYMENT_PATH)}`);
    }
  }, [authLoading, isLoggedIn, router]);

  // Fire InitiateCheckout / begin_checkout once, when the payment step has items.
  useEffect(() => {
    if (checkoutFired.current || items.length === 0) return;
    checkoutFired.current = true;
    const numItems = items.reduce((n, i) => n + i.quantity, 0);
    trackPixel("InitiateCheckout", {
      value: total,
      currency: "INR",
      num_items: numItems,
      content_ids: items.map((i) => i.productId),
    });
    trackGa("begin_checkout", {
      currency: "INR",
      value: total,
      items: items.map((i) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity })),
    });
  }, [items, total]);

  const handlePayNow = async () => {
    setIsPlacing(true);
    setError(null);
    try {
      if (items.length === 0) throw new Error("Your cart is empty — add items before paying.");
      const rawShipping = localStorage.getItem("checkoutShippingAddress");
      if (!rawShipping) throw new Error("Shipping address not found. Please go back to the Address step.");
      const shippingAddress = JSON.parse(rawShipping);

      // Load the payment gateway FIRST — avoids leaving an orphaned pending order
      // if the SDK fails to load.
      const loaded = await loadCashfree();
      if (!loaded || !window.Cashfree) throw new Error("Could not load the payment gateway. Check your connection and retry.");

      const shippingFee = subtotal >= 999 ? 0 : 150;
      // CartContext total = subtotal - discount + shippingFee
      const discountAmount = subtotal - (total - shippingFee);

      // Capture the paid-ad attribution so the order (and server-side CAPI
      // Purchase) can be tied back to the ad that drove the sale.
      const attribution = getAttribution();

      const order = await api.post<CreateCashfreeResponse>(
        "/orders/create-cashfree",
        {
          attribution,
          items,
          shippingAddress,
          subtotal,
          shippingFee,
          discountAmount,
          total,
          coupon: coupon?.code ? { code: coupon.code, discount: coupon.discount } : undefined,
          shippingMethod: shippingFee === 0 ? "free" : "standard",
        },
        isLoggedIn,
      );

      // Stash the authoritative order value so the confirmation page can fire a
      // Purchase event with the real amount (survives the Cashfree redirect).
      try {
        localStorage.setItem(
          `pending_purchase_${order.orderNumber}`,
          JSON.stringify({
            value: total,
            currency: "INR",
            num_items: items.reduce((n, i) => n + i.quantity, 0),
            content_ids: items.map((i) => i.productId),
            contents: items.map((i) => ({ id: i.productId, quantity: i.quantity, item_price: i.price })),
            items: items.map((i) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity })),
          })
        );
      } catch {
        /* storage unavailable — Purchase simply won't fire client-side */
      }

      // Order + session created and SDK is ready — launch Cashfree hosted checkout.
      const cashfree = window.Cashfree({ mode: cashfreeMode() });
      cashfree.checkout({ paymentSessionId: order.paymentSessionId, redirectTarget: "_self" });
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setError("Online payments are not available yet — please try again later.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to start payment");
      }
      setIsPlacing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-medium">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-medium">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <CheckoutHeader currentStep={2} />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="premium-card p-8 text-center">
          <h2 className="font-display text-2xl text-text-dark mb-4">Secure Payment</h2>
          <p className="text-text-medium mb-6">
            Pay securely — UPI, cards, net-banking &amp; wallets.
          </p>
          <div className="mb-6 p-4 bg-cream rounded">
            <p className="font-bold text-xl">{formatPrice(total)}</p>
            <p className="text-text-light text-sm">{items.length} item(s)</p>
          {discount > 0 && (
            <p className="text-primary-green text-sm mt-1">Founding discount applied: −{formatPrice(discount)}</p>
          )}
            <p className="text-text-light text-sm mt-1">All prices are inclusive of applicable taxes (GST).</p>
          </div>
          <p className="text-text-medium text-sm mb-6">
            We accept UPI, credit/debit cards and net banking (secured via Cashfree).
          </p>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isPlacing || items.length === 0}
            className="w-full py-4 bg-primary-green text-white font-medium rounded hover:bg-secondary-green transition-colors disabled:opacity-60"
          >
            {isPlacing ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
          {items.length === 0 && !error && (
            <p className="text-sm text-text-medium mt-4">
              Your cart is empty. <a href="/products" className="text-primary-green underline">Add items</a> to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
