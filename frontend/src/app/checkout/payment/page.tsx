"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_PAYMENT_PATH } from "@/lib/auth-redirect";
import { formatPrice } from "@/lib/utils";
import { media } from "@/lib/media";
import { api } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  const { promise, resolve } = Promise.withResolvers<boolean>();
  if (typeof window !== "undefined" && window.Razorpay) {
    resolve(true);
    return promise;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
  return promise;
}

type CreateOrderResponse = {
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  prefill: { name: string; email: string; contact: string };
};

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { subtotal, total, items, coupon, clearCart } = useCart();

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

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Could not load the payment gateway. Check your connection and retry.");

      const order = await api.post<CreateOrderResponse>(
        "/orders/create-razorpay",
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

      if (!window.Razorpay) throw new Error("Payment gateway unavailable. Please retry.");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "3TATTAVA",
        description: `Order ${order.orderNumber}`,
        image: media("/brand/3t-icon.png"),
        prefill: order.prefill,
        theme: { color: "#cd872a" },
        handler: async (resp: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post(
              "/orders/verify",
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                orderNumber: order.orderNumber,
              },
              isLoggedIn,
            );
            localStorage.removeItem("checkoutShippingAddress");
            await clearCart();
            router.push(`/order-confirmation/${order.orderNumber}`);
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Payment succeeded but confirmation failed — please contact support with your payment ID.",
            );
            setIsPlacing(false);
          }
        },
        modal: { ondismiss: () => setIsPlacing(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start payment");
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
            Pay securely via Razorpay — UPI, cards, net-banking &amp; wallets.
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
