"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="w-[60px] h-[60px] rounded overflow-hidden bg-cream relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="60px"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-medium text-text-dark text-sm hover:text-primary-green line-clamp-2"
        >
          {item.name}
        </Link>
        {item.variant && (
          <p className="text-text-light text-xs mt-0.5">{item.variant}</p>
        )}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center border border-border rounded">
            <button
              type="button"
              className="p-1.5 hover:bg-beige transition-colors disabled:opacity-50"
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-2 min-w-[24px] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              className="p-1.5 hover:bg-beige transition-colors"
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="text-text-light hover:text-red-600 text-xs flex items-center gap-1 shrink-0"
        aria-label="Remove item"
      >
        <X size={14} /> Delete
      </button>
    </div>
  );
}
