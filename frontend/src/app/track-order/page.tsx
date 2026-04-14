"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderStatusFlow from "@/components/order/OrderStatusFlow";
import { api } from "@/lib/api";
import type { Order } from "@shared/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const prefillFromUrl = searchParams.get("orderId") ?? "";

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canTrack = useMemo(() => orderId.trim().length > 0, [orderId]);

  useEffect(() => {
    if (prefillFromUrl) {
      setOrderId(prefillFromUrl);
    }
  }, [prefillFromUrl]);

  useEffect(() => {
    const id = prefillFromUrl.trim();
    if (!id) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setOrder(null);

    (async () => {
      try {
        const result = await api.get<Order>(`/orders/${encodeURIComponent(id)}`);
        if (!cancelled) setOrder(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to track order");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [prefillFromUrl]);

  async function handleTrack() {
    if (!canTrack) return;
    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await api.get<Order>(`/orders/${encodeURIComponent(orderId.trim())}`);
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track order");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-10 md:py-16">
      <div className="max-w-3xl mx-auto w-full premium-card p-6 md:p-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-text-dark mb-2">
              Track Your Order
            </h1>
            <p className="text-text-medium text-sm max-w-md leading-relaxed">
              Enter your order ID (for example from your confirmation page) to see live status,
              what’s in your shipment, and tracking when available.
            </p>
          </div>
          <Link href="/products" className="shrink-0 self-start sm:self-auto">
            <Button type="button" variant="outline" size="md" className="w-full sm:w-auto min-w-[200px]">
              Continue shopping
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="track-order-id" className="block text-sm font-medium text-text-dark">
              Order ID
            </label>
            <input
              id="track-order-id"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 3T-1712345678901"
              className="w-full px-4 py-3 border border-border rounded-lg text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
          <Button
            type="button"
            onClick={handleTrack}
            disabled={!canTrack || isLoading}
            className="sm:shrink-0 sm:min-w-[140px] h-[48px]"
          >
            {isLoading ? (
              "Searching…"
            ) : (
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" aria-hidden />
                Track order
              </span>
            )}
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {order && <OrderStatusFlow order={order} />}

        {!order && !error && !isLoading && (
          <p className="text-xs text-text-light border-t border-border pt-6">
            Tip: After checkout, your confirmation screen links here with the order ID already filled in.
          </p>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="premium-card p-8 max-w-md w-full animate-pulse h-32" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
