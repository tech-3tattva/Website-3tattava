"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_PAYMENT_PATH } from "@/lib/auth-redirect";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";

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

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    setError(null);

    try {
      const rawShipping = localStorage.getItem("checkoutShippingAddress");
      if (!rawShipping) {
        throw new Error("Shipping address not found. Please go back to Address page.");
      }

      const shippingAddress = JSON.parse(rawShipping) as {
        title?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
      };

      const shippingFee = subtotal >= 999 ? 0 : 150;
      // CartContext total = subtotal - discount + shippingFee
      const discountAmount = subtotal - (total - shippingFee);

      const response = await api.post<{
        orderNumber: string;
        status: string;
        emailSent?: boolean;
        emailError?: string;
      }>(
        "/orders/place-demo",
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
        isLoggedIn
      );

      localStorage.removeItem("checkoutShippingAddress");
      await clearCart();

      const search = new URLSearchParams();
      if (typeof response.emailSent === "boolean") search.set("emailSent", String(response.emailSent));
      if (response.emailError) search.set("emailError", String(response.emailError));

      router.push(`/order-confirmation/${response.orderNumber}?${search.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
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
          <h2 className="font-display text-2xl text-text-dark mb-4">
            Payment
          </h2>
          <p className="text-text-medium mb-6">
            Razorpay payment modal would open here. For this demo, click below to complete the order.
          </p>
          <div className="mb-6 p-4 bg-cream rounded">
            <p className="font-bold text-xl">{formatPrice(total)}</p>
            <p className="text-text-light text-sm">{items.length} item(s)</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="w-full py-4 bg-primary-green text-white font-medium rounded hover:bg-secondary-green transition-colors disabled:opacity-60"
          >
            {isPlacing ? "Placing..." : "Complete Order (Demo)"}
          </button>
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
