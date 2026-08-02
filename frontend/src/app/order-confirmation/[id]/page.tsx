"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";

type VerifyStatus = "verifying" | "paid" | "pending" | "failed";

type VerifyResponse = {
  payment?: { status?: string };
  cashfreeStatus?: string;
};

// Cashfree order_status values that mean the payment will not complete.
const FAILED_STATUSES = new Set(["EXPIRED", "FAILED", "TERMINATED", "CANCELLED", "TERMINATION_REQUESTED"]);

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { clearCart } = useCart();
  const [status, setStatus] = useState<VerifyStatus>("verifying");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    let attempts = 0;

    const verify = async () => {
      try {
        const res = await api.post<VerifyResponse>(
          "/orders/verify-cashfree",
          { orderNumber: orderId },
          true,
        );
        if (!active) return;

        if (res?.payment?.status === "captured") {
          setStatus("paid");
          try {
            const key = `pending_purchase_${orderId}`;
            const raw = localStorage.getItem(key);
            if (raw) {
              const p = JSON.parse(raw);
              trackPixel("Purchase", {
                eventID: orderId,
                value: p.value,
                currency: p.currency || "INR",
                content_ids: p.content_ids,
                contents: p.contents,
                content_type: "product",
                num_items: p.num_items,
              });
              trackGa("purchase", {
                transaction_id: orderId,
                value: p.value,
                currency: p.currency || "INR",
                items: p.items,
              });
              localStorage.removeItem(key);
            }
          } catch {
            /* tracking must never block confirmation */
          }
          localStorage.removeItem("checkoutShippingAddress");
          await clearCart();
          return;
        }
        if (res?.cashfreeStatus && FAILED_STATUSES.has(res.cashfreeStatus)) {
          setStatus("failed");
          return;
        }
        // Still ACTIVE — the webhook may be confirming in parallel. Retry briefly.
        attempts += 1;
        if (attempts < 4) {
          setStatus("verifying");
          setTimeout(verify, 2500);
        } else {
          setStatus("pending");
        }
      } catch {
        if (!active) return;
        attempts += 1;
        if (attempts < 4) setTimeout(verify, 2500);
        else setStatus("pending");
      }
    };

    void verify();
    return () => {
      active = false;
    };
  }, [orderId, clearCart]);

  const isPaid = status === "paid";
  const isVerifying = status === "verifying";
  const isFailed = status === "failed";

  const heading = isPaid
    ? "Your Order Has Been Placed!"
    : isVerifying
      ? "Confirming Your Payment…"
      : isFailed
        ? "Payment Failed"
        : "Payment Pending";

  const body = isPaid
    ? "We've received your order and it's being processed. Your confirmation and tracking details will be shared with you shortly."
    : isVerifying
      ? "Please wait while we confirm your payment. This only takes a moment."
      : isFailed
        ? "Your payment didn't go through, or the order expired. No amount has been captured — you can safely try again."
        : "We haven't received confirmation of your payment yet. If the amount was debited it will reflect shortly — check your orders or contact support.";

  const icon = isPaid ? "✓" : isVerifying ? "…" : isFailed ? "✕" : "⏳";
  const ringColor = isPaid
    ? "border-primary-green"
    : isVerifying
      ? "border-text-light"
      : isFailed
        ? "border-red-400"
        : "border-secondary-green";
  const iconColor = isPaid ? "text-primary-green" : isFailed ? "text-red-500" : "text-text-medium";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full premium-card p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-6 ${ringColor}`}
        >
          <span className={`text-4xl ${iconColor}`}>{icon}</span>
        </motion.div>
        <h1 className="font-display text-3xl text-text-dark mb-2">{heading}</h1>
        <p className="text-text-medium mb-6">
          Order ID: <strong>{orderId}</strong>
        </p>
        <p className="text-text-light text-sm mb-8">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isFailed ? (
            <Link href="/checkout/payment">
              <Button variant="primary">Retry Payment</Button>
            </Link>
          ) : (
            <Link href="/account/orders">
              <Button variant="secondary">View Your Orders</Button>
            </Link>
          )}
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
