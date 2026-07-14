"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@shared/types";

export type PurchaseStatus = "loading" | "purchased" | "none";

// Single source of truth for "has the user bought a product?".
// Unlocked only when logged in AND holding at least one non-cancelled order.
export function usePurchaseStatus(): PurchaseStatus {
  const { isLoggedIn, isLoading } = useAuth();
  const [status, setStatus] = useState<PurchaseStatus>("loading");

  useEffect(() => {
    if (isLoading) { setStatus("loading"); return; }
    if (!isLoggedIn) { setStatus("none"); return; }
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const orders = await api.get<Order[]>("/orders", true);
        const has = Array.isArray(orders) && orders.some((o) => o.status !== "cancelled");
        if (!cancelled) setStatus(has ? "purchased" : "none");
      } catch {
        if (!cancelled) setStatus("none");
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, isLoading]);

  return status;
}
