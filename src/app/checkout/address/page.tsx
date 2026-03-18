"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { subtotal, total, itemCount } = useCart();
  const [interested, setInterested] = useState(true);

  const shipping = subtotal >= 999 ? 0 : 150;

  const handleProceed = () => {
    router.push("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-cream">
      <CheckoutHeader currentStep={1} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[65%_35%] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <p className="text-text-medium mb-4">
                To redeem 3Tattva Wellness Points, please LOGIN/REGISTER
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-text-dark text-white font-medium rounded hover:bg-primary-green"
              >
                LOGIN / REGISTER
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="font-sans font-bold text-lg mb-2">3Tattva Wellness Club</h3>
              <p className="text-text-medium text-sm mb-4">
                Earn points and benefits when you join our wellness program.
              </p>
              <Link href="/wellness-club" className="text-primary-green text-sm hover:underline mb-4 inline-block">
                VIEW BENEFITS
              </Link>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="club"
                    checked={interested}
                    onChange={() => setInterested(true)}
                    className="rounded-full"
                  />
                  <span className="text-sm">I&apos;M INTERESTED</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="club"
                    checked={!interested}
                    onChange={() => setInterested(false)}
                    className="rounded-full"
                  />
                  <span className="text-sm">NO THANKS</span>
                </label>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="font-sans font-bold text-lg mb-4">Shipping Address</h3>
              <p className="text-text-light text-xs mb-4">You can create an account after checkout.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">EMAIL ADDRESS *</label>
                  <input type="email" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">TITLE</label>
                  <select className="w-full px-3 py-2 border border-border rounded">
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">FIRST NAME *</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">LAST NAME *</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">ADDRESS LINE 1 *</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">ADDRESS LINE 2</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">ZIP / POSTAL CODE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">CITY *</label>
                  <input type="text" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">COUNTRY *</label>
                  <select className="w-full px-3 py-2 border border-border rounded">
                    <option>India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">STATE / PROVINCE *</label>
                  <select className="w-full px-3 py-2 border border-border rounded">
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">PHONE NUMBER *</label>
                  <input type="tel" className="w-full px-3 py-2 border border-border rounded" required />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="font-sans font-bold text-lg mb-4">Shipping Methods</h3>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer mb-2">
                <input type="radio" name="shipping" defaultChecked />
                <span>Standard — ₹150</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer mb-2">
                <input type="radio" name="shipping" />
                <span>Express — ₹250</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer">
                <input type="radio" name="shipping" />
                <span>Free (orders above ₹999)</span>
              </label>
            </div>
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-4 bg-text-dark text-white font-medium rounded hover:bg-primary-green transition-colors"
            >
              PROCEED TO PAYMENT
            </button>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-sans font-bold text-lg mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>{itemCount} x items</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
