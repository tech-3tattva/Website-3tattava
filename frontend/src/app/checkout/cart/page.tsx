"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHECKOUT_ADDRESS_PATH } from "@/lib/auth-redirect";
import Link from "next/link";
import Image from "@/components/ui/SafeImage";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import QuantityStepper from "@/components/product/QuantityStepper";
import { formatPrice } from "@/lib/utils";

export default function CheckoutCartPage() {
  const { isLoggedIn } = useAuth();
  const { items, updateQty, removeItem, subtotal, total, itemCount, applyCoupon, coupon, discount } = useCart();
  const checkoutHref = isLoggedIn
    ? CHECKOUT_ADDRESS_PATH
    : `/login?redirect=${encodeURIComponent(CHECKOUT_ADDRESS_PATH)}`;
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const shipping = subtotal >= 999 ? 0 : 150;
  const isWelcome = !!coupon?.code?.startsWith("W200");

  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  async function handleApplyCoupon() {
    const raw = couponCode.trim();
    if (!raw) return;
    setCouponError(null);
    setPromoMsg(null);

    // First try the existing flat/percent coupon system
    try {
      await applyCoupon(raw);
      return;
    } catch {
      // Coupon not found — fall through to influencer promo system
    }

    // Try influencer promo code
    try {
      const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "/api";
      const resp = await fetch(`${BACKEND}/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: raw }),
      });
      const data = await resp.json() as { valid: boolean; discountPercent?: number; message?: string; code?: string };
      if (!data.valid) {
        setCouponError(data.message ?? "Invalid or expired code");
        return;
      }
      // Apply as a coupon-style discount in CartContext
      await applyCoupon(raw);
      // Store influencer promo in localStorage for webhook attribution on payment
      localStorage.setItem("influencerPromoCode", data.code ?? raw.toUpperCase());
      setPromoMsg(`${data.message} — influencer code applied!`);
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : "Failed to apply code");
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <CheckoutHeader currentStep={0} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[65%_35%] gap-8">
          <div>
            {items.length === 0 ? (
              <div className="premium-card p-8 text-center">
                <p className="text-text-medium mb-4">Your bag is empty.</p>
                <Link
                  href="/products"
                  className="text-primary-green font-medium hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="premium-card p-4 flex gap-4">
                    <div className="w-[100px] h-[120px] rounded-lg overflow-hidden shrink-0 bg-cream">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={120}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium text-text-dark hover:text-primary-green"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-text-light text-sm">{item.variant}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQty(item.id, qty)}
                        />
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-text-light hover:text-red-600 text-sm ml-auto"
                        >
                          × Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <details className="premium-card">
                  <summary className="px-4 py-3 flex items-center gap-2 cursor-pointer list-none">
                    <span>📑</span> ADD MORE FROM WISHLIST
                    <span className="ml-auto">›</span>
                  </summary>
                  <div className="px-4 pb-4">
                    <Link href="/wishlist" className="text-primary-green text-sm">
                      View wishlist
                    </Link>
                  </div>
                </details>
              </div>
            )}
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="premium-card p-6 space-y-4">
              <h3 className="font-sans font-bold text-lg">Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() => void handleApplyCoupon()}
                  className="px-4 py-2 bg-text-dark text-white text-sm font-medium rounded hover:bg-primary-green"
                >
                  APPLY
                </button>
              </div>
              {coupon && (
                <p className="flex flex-wrap items-center gap-1.5 text-sm text-primary-green">
                  <span>
                    Applied: <span className="font-medium">{coupon.code}</span> (−{formatPrice(discount)})
                  </span>
                  {isWelcome && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: "rgba(205,135,42,0.15)", color: "#442a1b", border: "1px solid rgba(205,135,42,0.4)" }}
                    >
                      Welcome offer
                    </span>
                  )}
                </p>
              )}
              {couponError && <p className="text-sm text-red-600">{couponError}</p>}
              {promoMsg && <p className="text-sm text-amber-700">{promoMsg}</p>}
              <div className="bg-beige rounded-lg p-4 border border-border">
                <p className="font-medium text-text-dark mb-1">
                  Add Gift Box with Personal Card!
                </p>
                <p className="text-text-medium text-sm">
                  Shop for ₹3,000 to add a luxurious gift wrap and personalised message card.
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{itemCount} x items</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>{isWelcome ? "Welcome offer" : "Discount"}</span>
                    <span className="text-primary-green">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary-green" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>TOTAL</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <p className="text-text-light text-xs bg-amber-50 p-3 rounded">
                Note: Orders shipped outside India may incur customs fees.
              </p>
              <Link
                href={checkoutHref}
                className="block w-full py-4 bg-text-dark text-white text-center font-medium hover:bg-primary-green transition-colors"
              >
                CHECKOUT →
              </Link>
              <p className="text-center text-sm text-text-light">
                <Link href="/products" className="hover:underline">
                  CONTINUE SHOPPING
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
