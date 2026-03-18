"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

const STEPS = [
  { label: "Shopping Bag", path: "/checkout/cart" },
  { label: "Address", path: "/checkout/address" },
  { label: "Payment", path: "/checkout/payment" },
];

interface CheckoutHeaderProps {
  currentStep: number;
}

export default function CheckoutHeader({ currentStep }: CheckoutHeaderProps) {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={currentStep > 0 ? STEPS[currentStep - 1].path : "/"}
          className="flex items-center gap-2 text-text-dark hover:text-primary-green"
        >
          <ArrowLeft size={20} /> Back
        </Link>
        <Link href="/" className="font-display text-xl text-text-dark">
          3Tattva
        </Link>
        <span className="flex items-center gap-1 text-text-light text-sm">
          <Lock size={16} /> Secure
        </span>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {STEPS.map((step, i) => (
            <Link
              key={step.path}
              href={step.path}
              className={`text-sm font-medium ${
                i === currentStep
                  ? "text-gold border-b-2 border-gold"
                  : i < currentStep
                    ? "text-primary-green"
                    : "text-text-light"
              }`}
              style={i === currentStep ? { color: "var(--color-gold)" } : {}}
            >
              {step.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
