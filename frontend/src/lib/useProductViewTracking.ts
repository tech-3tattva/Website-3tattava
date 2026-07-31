"use client";

import { useEffect, useRef } from "react";
import { trackPixel } from "./fbpixel";
import { trackGa } from "./gtag";

/**
 * Fire Meta `ViewContent` + GA4 `view_item` exactly once when a product page
 * mounts. Safe no-op until the pixel/gtag load, and guarded so it never
 * double-fires on re-render. Values are in INR to match the ad account.
 */
export function useProductViewTracking(
  product: { id: string; name: string; price: number } | null | undefined
): void {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || !product || !product.id) return;
    fired.current = true;
    trackPixel("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "INR",
    });
    trackGa("view_item", {
      currency: "INR",
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    });
  }, [product]);
}
