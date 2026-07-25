"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, MapPin, Package } from "lucide-react";
import type { Order } from "@shared/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import SafeImage from "@/components/ui/SafeImage";
import OrderStatusFlow from "@/components/order/OrderStatusFlow";

function formatOrderedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getDeliveredOn(order: Order): string | null {
  const hist = order.statusHistory ?? [];
  let latestDelivered: { timestamp?: string } | undefined;
  for (const h of hist) {
    if (h.status !== "delivered" || !h.timestamp) continue;
    if (
      !latestDelivered?.timestamp ||
      new Date(h.timestamp).getTime() > new Date(latestDelivered.timestamp).getTime()
    ) {
      latestDelivered = h;
    }
  }
  if (latestDelivered?.timestamp) return formatOrderedAt(latestDelivered.timestamp);
  if (order.status === "delivered" && order.updatedAt) return formatOrderedAt(order.updatedAt);
  return null;
}

function statusLabel(status: Order["status"]): string {
  const map: Record<Order["status"], string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status];
}

function statusBadgeClass(status: Order["status"]): string {
  switch (status) {
    case "delivered":
      return "bg-primary-green/15 text-primary-green border-primary-green/30";
    case "cancelled":
      return "bg-red-50 text-red-800 border-red-200";
    case "shipped":
      return "bg-[#e0eff8] text-[#1a5a8a] border-[#b2d9f2]";
    case "processing":
      return "bg-[#fbead0] text-[#8a5a12] border-[#e9c98f]";
    case "confirmed":
      return "bg-gold/15 text-text-dark border-gold/40";
    case "pending":
    default:
      return "bg-[#f2ead9] text-[#8a7355] border-[#e0d3ba]";
  }
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <p className="text-text-medium">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-28 pb-9 sm:pt-32 sm:pb-12 md:pb-16">
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
            const isExpanded = expandedId === order.id;
            const trackQuery = `/track-order?orderId=${encodeURIComponent(order.orderNumber)}`;
            const items = order.items ?? [];
            const thumbs = items.slice(0, 4);
            const extraCount = items.length - thumbs.length;
            const couponCode = order.coupon?.code ?? "";
            // Welcome codes start with W200; fall back to a bare rupee discount only when
            // no coupon code was persisted, so percent-coupon orders are never mis-tagged.
            const isWelcomeOrder =
              couponCode.startsWith("W200") || (!couponCode && order.discountAmount > 0);

            return (
              <li key={order.id} className="premium-card rounded-2xl p-5 sm:p-6 border border-border/80">
                <div className="flex flex-wrap items-start justify-between gap-3 gap-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-text-light">Order</p>
                    <p className="font-semibold text-text-dark">{order.orderNumber}</p>
                    <p className="text-sm text-text-medium mt-0.5">
                      Ordered on <span className="text-text-dark">{formatOrderedAt(order.createdAt)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-dark">{formatPrice(order.total)}</p>
                    {isWelcomeOrder && (
                      <span
                        className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          background: "rgba(205,135,42,0.15)",
                          color: "#442a1b",
                          border: "1px solid rgba(205,135,42,0.45)",
                        }}
                      >
                        Welcome ₹200 offer
                      </span>
                    )}
                    <span
                      className={`inline-block mt-2 text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusBadgeClass(order.status)}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {thumbs.map((item, idx) => (
                      <div
                        key={`${item.productId}-${item.variant ?? ""}-${idx}`}
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream border border-border"
                      >
                        <SafeImage
                          src={item.image || "/placeholder.svg"}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-[#f7f0e2] text-xs font-semibold text-text-medium">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-medium leading-snug line-clamp-2">{itemsSummary(order)}</p>
                </div>

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
                      <p className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-text-light" aria-hidden />
                        <span className="text-text-dark">{order.tracking.courierName}</span>
                        {order.tracking?.trackingNumber ? (
                          <span className="text-text-dark"> · {order.tracking.trackingNumber}</span>
                        ) : null}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCancelled && (
                      <Link
                        href={trackQuery}
                        className="inline-flex items-center gap-1.5 rounded-md bg-text-dark px-4 py-2 text-sm text-white hover:bg-primary-green transition-colors"
                      >
                        Track order
                        {order.tracking?.trackingUrl ? (
                          <ExternalLink className="w-4 h-4" aria-hidden />
                        ) : null}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border-2 border-gold bg-white/80 px-4 py-2 text-sm text-text-dark hover:bg-gold/10 transition-colors"
                    >
                      {isExpanded ? "Hide details" : "View details"}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 border-t border-border pt-5">
                    <OrderStatusFlow order={order} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
