"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_PAYMENT_PATH } from "@/lib/auth-redirect";
import { formatPrice } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";

declare global {
  interface Window {
    Cashfree?: new (sessionId: string) => { redirect: () => void };
  }
}

function loadCashfree(): Promise<boolean> {
  const { promise, resolve } = Promise.withResolvers<boolean>();
  if (typeof window !== "undefined" && window.Cashfree) {
    resolve(true);
    return promise;
  }
  const isProd =
    process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ||
    process.env.NEXT_PUBLIC_CASHFREE_MODE === "prod" ||
    // Fallback: always use the live SDK on the production domain even if the
    // Vercel build-time env var isn't set.
    (typeof window !== "undefined" && /(^|\.)3tattava\.com$/.test(window.location.hostname));
  const script = document.createElement("script");
  script.src = `https://sdk.cashfree.com/js/ui/2.0.0/cashfree.${isProd ? "prod" : "sandbox"}.js`;
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
  const { subtotal, total, items, coupon } = useCart();

  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(CHECKOUT_PAYMENT_PATH)}`);
    }
  }, [authLoading, isLoggedIn, router]);

  const handlePayNow = async () => {
    setIsPlacing(true);
    setError(null);
    try {
      const rawShipping = localStorage.getItem("checkoutShippingAddress");
      if (!rawShipping) throw new Error("Shipping address not found. Please go back to the Address step.");
      const shippingAddress = JSON.parse(rawShipping);

      const shippingFee = subtotal >= 999 ? 0 : 150;
      // CartContext total = subtotal - discount + shippingFee
      const discountAmount = subtotal - (total - shippingFee);

      const order = await api.post<CreateCashfreeResponse>(
        "/orders/create-cashfree",
        {
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

      const loaded = await loadCashfree();
      if (!loaded) throw new Error("Could not load the payment gateway. Check your connection and retry.");
      if (!window.Cashfree) throw new Error("Payment gateway unavailable. Please retry.");

      // The order (with shippingAddress) is persisted server-side; capture is confirmed
      // on the return_url page (/order-confirmation/[id]) via /orders/verify-cashfree.
      const cf = new window.Cashfree(order.paymentSessionId);
      cf.redirect();
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
          </div>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isPlacing || items.length === 0}
            className="w-full py-4 bg-primary-green text-white font-medium rounded hover:bg-secondary-green transition-colors disabled:opacity-60"
          >
            {isPlacing ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
