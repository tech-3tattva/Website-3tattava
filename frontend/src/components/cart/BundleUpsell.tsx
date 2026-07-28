"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const BUNDLE_IMG = "https://media.3tattava.com/products/Boxess%20copy%201.png";
const TRIGGER_SLUGS = ["shahjeet-sticks", "shodhit-shilajit-resin"];
const GOLD = "#C8963E";

/**
 * Checkout upsell: when the cart holds a single RockResin/Shahjeet product
 * (and not the bundle yet), offer the Founding Bundle Pack with the MRP
 * struck through and a one-tap add-to-cart. Renders nothing otherwise.
 */
export default function BundleUpsell({ className = "" }: { className?: string }) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasTrigger = items.some((i) => TRIGGER_SLUGS.includes(i.slug ?? ""));
  const hasBundle = items.some((i) => i.productId === "founding-bundle-pack");
  if (!hasTrigger || hasBundle) return null;

  const add = async () => {
    await addItem({
      id: "founding-bundle-pack::founding-bundle",
      productId: "founding-bundle-pack",
      name: "Founding Bundle Pack — RockResin + Shahjeet",
      image: BUNDLE_IMG,
      price: 2398,
      mrp: 2998,
      quantity: 1,
      slug: "founding-bundle-pack",
      variant: "founding-bundle",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-3 sm:p-4 ${className}`}
      style={{ background: "#fff", border: `1px solid ${GOLD}55`, boxShadow: "0 8px 24px rgba(68,42,27,.08)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BUNDLE_IMG}
        alt="Founding Bundle Pack"
        className="h-16 w-16 shrink-0 rounded-lg object-contain"
        style={{ background: "linear-gradient(135deg,#1c1304,#2a1f14)", padding: 6 }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          Complete the ritual
        </p>
        <p className="text-sm font-bold leading-tight" style={{ color: "#1c1304" }}>
          Founding Bundle Pack
        </p>
        <p className="mt-0.5 text-[12px]" style={{ color: "rgba(28,19,4,.6)" }}>
          Add RockResin® + Shahjeet® together —{" "}
          <span style={{ textDecoration: "line-through" }}>₹2,998</span>{" "}
          <strong style={{ color: "#1c1304" }}>₹2,398</strong>{" "}
          <span style={{ color: GOLD, fontWeight: 700 }}>save ₹600</span>
        </p>
      </div>
      {added ? (
        <Link
          href="/checkout/cart"
          className="shrink-0 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(200,150,62,.14)", color: "#1c1304", textDecoration: "none" }}
        >
          Added ✓
        </Link>
      ) : (
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: "#1c1304", color: "#f7f0e2" }}
        >
          Add bundle
        </button>
      )}
    </div>
  );
}
