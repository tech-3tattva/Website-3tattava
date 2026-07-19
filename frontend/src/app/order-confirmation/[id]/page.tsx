"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

type VerifyStatus = "verifying" | "paid" | "pending";

type VerifyResponse = {
  payment?: { status?: string };
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { clearCart } = useCart();
  const [status, setStatus] = useState<VerifyStatus>("verifying");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    (async () => {
      try {
        const res = await api.post<VerifyResponse>(
          "/orders/verify-cashfree",
          { orderNumber: orderId },
          true,
        );
        if (!active) return;
        if (res?.payment?.status === "captured") {
          setStatus("paid");
          localStorage.removeItem("checkoutShippingAddress");
          await clearCart();
        } else {
          setStatus("pending");
        }
      } catch {
        if (active) setStatus("pending");
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId, clearCart]);

  const isPaid = status === "paid";
  const isVerifying = status === "verifying";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full premium-card p-8 text-center"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-6 ${
            isPaid
              ? "border-primary-green"
              : isVerifying
                ? "border-text-light"
                : "border-secondary-green"
          }`}
        >
          <span
            className={`text-4xl ${
              isPaid ? "text-primary-green" : "text-text-medium"
            }`}
          >
            {isPaid ? "✓" : isVerifying ? "…" : "⏳"}
          </span>
        </motion.div>
        <h1 className="font-display text-3xl text-text-dark mb-2">
          {isPaid
            ? "Your Order Has Been Placed!"
            : isVerifying
              ? "Confirming Your Payment…"
              : "Payment Pending"}
        </h1>
        <p className="text-text-medium mb-6">
          Order ID: <strong>{orderId}</strong>
        </p>
        <p className="text-text-light text-sm mb-8">
          {isPaid
            ? "We've received your order and it's being processed. Your confirmation and tracking details will be shared with you shortly."
            : isVerifying
              ? "Please wait while we confirm your payment. This only takes a moment."
              : "We haven't received confirmation of your payment yet. If the amount was debited, it will reflect shortly — you can track your order below or contact support."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/track-order?orderId=${encodeURIComponent(orderId)}`}>
            <Button variant="secondary">Track Your Order</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
