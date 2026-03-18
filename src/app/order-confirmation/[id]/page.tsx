"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full border-4 border-primary-green flex items-center justify-center mx-auto mb-6"
        >
          <span className="text-4xl text-primary-green">✓</span>
        </motion.div>
        <h1 className="font-display text-3xl text-text-dark mb-2">
          Your Order Has Been Placed!
        </h1>
        <p className="text-text-medium mb-6">
          Order ID: <strong>{orderId}</strong>
        </p>
        <p className="text-text-light text-sm mb-8">
          A confirmation email has been sent to your email address.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/track-order">
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
