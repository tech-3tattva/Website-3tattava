"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, Package } from "lucide-react";
import type { Order } from "@shared/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function formatOrderedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getDeliveredOn(order: Order): string | null {
  const hist = order.statusHistory ?? [];
  let latestDelivered: { timestamp?: string } | undefined;
  for (const h of hist) {
    if (h.status === "delivered" && h.timestamp) {
      if (
        !latestDelivered?.timestamp ||
        new Date(h.timestamp) > new Date(latestDelivered.timestamp)
      ) {
        latestDelivered = h;
      }
    }
  }
  if (latestDelivered?.timestamp) return formatOrderedAt(latestDelivered.timestamp);
  if (order.status === "delivered" && order.updatedAt) return formatOrderedAt(order.updatedAt);
  return null;
}

function statusLabel(status: Order["status"]): string {
  const map: Record<Order["status"], string> = {
    pending: "Order placed",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status];
}

function statusBadgeClass(status: Order["status"]): string {
  if (status === "delivered") return "bg-primary-green/15 text-primary-green border-primary-green/30";
  if (status === "cancelled") return "bg-red-50 text-red-800 border-red-200";
  if (status === "shipped") return "bg-[#e0eff8] text-[#1a5a8a] border-[#b2d9f2]";
  return "bg-gold/15 text-text-dark border-gold/40";
}

function itemsSummary(order: Order): string {
  const items = order.items ?? [];
  if (items.length === 0) return "No line items";
  const names = items.slice(0, 2).map((i) => i.name);
  const extra = items.length - names.length;
  return extra > 0 ? `${names.join(", ")} +${extra} more` : names.join(", ");
}

export default function OrderHistoryPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    setLoadingOrders(true);
    setError(null);

    (async () => {
      try {
        const data = await api.get<Order[]>("/orders", true);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-text-medium">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl text-text-dark mb-3">Order history</h1>
        <p className="text-text-medium mb-6">Sign in to see your orders.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-text-dark text-white rounded hover:bg-primary-green transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-9 sm:py-12 md:py-16">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Link
            href="/account"
            className="text-sm text-gold hover:underline underline-offset-4 mb-2 inline-block"
          >
            ← Back to account
          </Link>
          <h1 className="font-display text-[40px] sm:text-5xl text-text-dark tracking-tight">
            Order history
          </h1>
          <p className="text-text-medium text-sm sm:text-base mt-2">
            Placed on, status, delivery updates, and tracking in one place.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingOrders ? (
        <p className="text-text-medium">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <div className="premium-card rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-text-light mb-4" aria-hidden />
          <p className="text-text-dark font-medium mb-2">No orders yet</p>
          <p className="text-text-medium text-sm mb-6">When you shop with us, your orders show up here.</p>
          <Link
            href="/products"
            className="inline-block rounded-md bg-[#ba5929] px-6 py-2.5 text-white hover:bg-[#9c4c23] transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => {
            const deliveredOn = getDeliveredOn(order);
            const isDelivered = order.status === "delivered";
            const isCancelled = order.status === "cancelled";
            const hasPartnerLink = Boolean(order.tracking?.trackingUrl?.trim());
            const trackQuery = `/track-order?orderId=${encodeURIComponent(order.orderNumber)}`;

            return (
              <li key={order.id} className="premium-card rounded-2xl p-5 sm:p-6 border border-border/80">
                <div className="flex flex-wrap items-start justify-between gap-3 gap-y-2">
                  <div>
                    <p className="font-semibold text-text-dark">{order.orderNumber}</p>
                    <p className="text-sm text-text-medium mt-1">
                      Ordered on <span className="text-text-dark">{formatOrderedAt(order.createdAt)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-dark">{formatPrice(order.total)}</p>
                    <span
                      className={`inline-block mt-2 text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusBadgeClass(order.status)}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-medium mt-4 leading-snug">{itemsSummary(order)}</p>

                <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-text-medium space-y-1">
                    {isDelivered && deliveredOn && (
                      <p className="text-text-dark">
                        <span className="text-text-light">Delivered on </span>
                        {deliveredOn}
                      </p>
                    )}
                    {!isDelivered && !isCancelled && order.tracking?.estimatedDelivery && (
                      <p>
                        Est. delivery:{" "}
                        <span className="text-text-dark">{order.tracking.estimatedDelivery}</span>
                      </p>
                    )}
                    {!isDelivered && !isCancelled && order.tracking?.courierName && (
                      <p>
                        Carrier:{" "}
                        <span className="text-text-dark">{order.tracking.courierName}</span>
                        {order.tracking?.trackingNumber ? (
                          <span className="text-text-dark"> · {order.tracking.trackingNumber}</span>
                        ) : null}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hasPartnerLink && (
                      <a
                        href={order.tracking!.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-text-dark px-4 py-2 text-sm text-white hover:bg-primary-green transition-colors"
                      >
                        Track shipment
                        <ExternalLink className="w-4 h-4" aria-hidden />
                      </a>
                    )}
                    {!hasPartnerLink && !isCancelled && (
                      <Link
                        href={trackQuery}
                        className="inline-flex items-center justify-center rounded-md border-2 border-gold bg-white/80 px-4 py-2 text-sm text-text-dark hover:bg-gold/10 transition-colors"
                      >
                        View status
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
