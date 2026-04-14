"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHECKOUT_ADDRESS_PATH } from "@/lib/auth-redirect";
import Link from "next/link";
import Image from "@/components/ui/SafeImage";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import QuantityStepper from "@/components/product/QuantityStepper";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";

export default function CheckoutCartPage() {
  const { isLoggedIn } = useAuth();
  const { items, updateQty, removeItem, subtotal, total, itemCount, applyCoupon, coupon } = useCart();
  const checkoutHref = isLoggedIn
    ? CHECKOUT_ADDRESS_PATH
    : `/login?redirect=${encodeURIComponent(CHECKOUT_ADDRESS_PATH)}`;
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const shipping = subtotal >= 999 ? 0 : 150;
  const peopleAlsoBought = PLACEHOLDER_PRODUCTS.filter(
    (p) => !items.some((i) => i.productId === p.id)
  ).slice(0, 3);

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError(null);
    try {
      await applyCoupon(couponCode.trim());
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : "Failed to apply coupon");
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
                <div>
                  <h3 className="font-display text-xl text-text-dark mb-4">
                    People Also Bought
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {peopleAlsoBought.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
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
                <p className="text-sm text-primary-green">
                  Applied: <span className="font-medium">{coupon.code}</span> ({coupon.discount}% off)
                </p>
              )}
              {couponError && <p className="text-sm text-red-600">{couponError}</p>}
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
