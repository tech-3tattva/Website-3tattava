"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { total, items, clearCart } = useCart();

  const handlePlaceOrder = () => {
    const orderId = `3T-${Date.now()}`;
    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <CheckoutHeader currentStep={2} />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-border p-8 text-center">
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
            className="w-full py-4 bg-primary-green text-white font-medium rounded hover:bg-secondary-green transition-colors"
          >
            Complete Order (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
