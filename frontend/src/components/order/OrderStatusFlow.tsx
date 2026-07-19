"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  Home,
  XCircle,
  Clock,
} from "lucide-react";
import type { Order } from "@shared/types";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Shipment / checkpoint shape ─────────────────────────────
// The backend Order model serialises a `shipment` sub-document (see
// backend/src/models/Order.js) that is not yet declared on the shared
// `Order` type. We read it defensively here so the timeline can surface
// courier scan history without touching the shared contract.
export type OrderCheckpoint = {
  status?: string;
  location?: string;
  timestamp?: string;
  remarks?: string;
};

export type OrderShipment = {
  awbNumber?: string;
  shipmentId?: string;
  courierName?: string;
  labelUrl?: string;
  nimbusStatus?: string;
  checkpoints?: OrderCheckpoint[];
  createdAt?: string;
  lastTrackedAt?: string;
};

export function getOrderShipment(order: Order): OrderShipment | undefined {
  return (order as Order & { shipment?: OrderShipment }).shipment;
}

// ─── Delivery milestones ─────────────────────────────────────
const MILESTONES: {
  key: string;
  label: string;
  Icon: typeof Package;
  headline: string;
  detail: string;
}[] = [
  {
    key: "ordered",
    label: "Ordered",
    Icon: Package,
    headline: "We’ve received your order",
    detail:
      "Your order is logged. We’ll confirm payment and move you to the next step automatically.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    Icon: CheckCircle2,
    headline: "Order confirmed — thank you",
    detail:
      "Payment is in and your ritual essentials are being picked, quality-checked, and packed with care.",
  },
  {
    key: "shipped",
    label: "Shipped",
    Icon: Truck,
    headline: "On the way to you",
    detail:
      "Your order has left our facility. Use the courier link below for live tracking when available.",
  },
  {
    key: "ofd",
    label: "Out for delivery",
    Icon: MapPin,
    headline: "Out for delivery",
    detail:
      "Your parcel is with the courier and arriving soon. Keep your phone handy for the delivery.",
  },
  {
    key: "delivered",
    label: "Delivered",
    Icon: Home,
    headline: "Delivered — enjoy your wellness ritual",
    detail:
      "We hope you love your 3Tattva picks. Share your experience or explore complementary care in our shop.",
  },
];

const OFD_RE = /out[\s_-]?for[\s_-]?delivery|ofd/i;
const DELIVERED_RE = /delivered/i;

/** Highest delivery milestone reached, derived from status + courier scans. */
function milestoneIndex(order: Order): number {
  if (order.status === "cancelled") return -1;

  const shipment = getOrderShipment(order);
  const nimbus = shipment?.nimbusStatus ?? "";
  const scans = (shipment?.checkpoints ?? []).map(
    (c) => `${c.status ?? ""} ${c.remarks ?? ""}`
  );
  const s = order.status;

  let idx = 0; // Ordered
  if (
    ["confirmed", "processing", "shipped", "delivered"].includes(s) ||
    order.payment?.status === "captured"
  ) {
    idx = 1;
  }
  if (["shipped", "delivered"].includes(s) || shipment?.awbNumber) {
    idx = Math.max(idx, 2);
  }
  if (OFD_RE.test(nimbus) || scans.some((t) => OFD_RE.test(t))) {
    idx = Math.max(idx, 3);
  }
  if (
    s === "delivered" ||
    DELIVERED_RE.test(nimbus) ||
    scans.some((t) => DELIVERED_RE.test(t))
  ) {
    idx = 4;
  }
  return idx;
}

function formatCheckpointTime(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function OrderStatusFlow({ order }: { order: Order }) {
  const currentIdx = milestoneIndex(order);
  const isDelivered = currentIdx === 4;
  const stage = MILESTONES[Math.max(0, currentIdx)];

  const shipment = getOrderShipment(order);
  const courierName = order.tracking?.courierName || shipment?.courierName;
  const awb = order.tracking?.trackingNumber || shipment?.awbNumber;
  const trackingUrl = order.tracking?.trackingUrl;
  const estimatedDelivery = order.tracking?.estimatedDelivery;

  const checkpoints = (shipment?.checkpoints ?? [])
    .slice()
    .sort((a, b) => {
      const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return tb - ta;
    });

  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-left">
        <div className="flex items-start gap-3">
          <XCircle className="h-8 w-8 shrink-0 text-red-600" aria-hidden />
          <div>
            <h3 className="font-display text-xl text-text-dark">This order was cancelled</h3>
            <p className="mt-2 text-sm text-text-medium leading-relaxed">
              No further shipment will occur for this order ID. If this looks wrong, reach out to
              support with your order number.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Desktop / tablet: horizontal stepper */}
      <div className="hidden sm:block">
        <ol className="flex items-start justify-between gap-2">
          {MILESTONES.map((step, index) => {
            const done = isDelivered || index < currentIdx;
            const active = !isDelivered && index === currentIdx;
            const Icon = step.Icon;
            return (
              <li key={step.key} className="relative flex flex-1 flex-col items-center min-w-0">
                {index < MILESTONES.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[calc(50%+1.25rem)] top-5 h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2",
                      index < currentIdx || isDelivered ? "bg-primary-green" : "bg-border"
                    )}
                    aria-hidden
                  />
                )}
                <div
                  className={cn(
                    "relative z-[1] flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    done && "border-primary-green bg-primary-green text-white",
                    active && "border-gold bg-[#f8f5f0] text-primary-green shadow-sm",
                    !done && !active && "border-border bg-white text-text-light"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  ) : (
                    <Icon className="h-5 w-5" aria-hidden />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em]",
                    active ? "text-text-dark" : done ? "text-primary-green" : "text-text-light"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="sm:hidden space-y-0 border-l-2 border-border ml-3 pl-6">
        {MILESTONES.map((step, index) => {
          const done = isDelivered || index < currentIdx;
          const active = !isDelivered && index === currentIdx;
          const Icon = step.Icon;
          return (
            <li key={step.key} className="relative pb-8 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[calc(0.75rem+9px)] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2",
                  done && "border-primary-green bg-primary-green text-white",
                  active && "border-gold bg-[#f8f5f0] text-primary-green",
                  !done && !active && "border-border bg-white text-text-light"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <p
                className={cn(
                  "text-sm font-semibold",
                  active ? "text-text-dark" : done ? "text-primary-green" : "text-text-light"
                )}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Current stage spotlight + courier snapshot */}
      <div className="rounded-xl border border-[#c5905a]/25 bg-gradient-to-br from-[#faf7f2] to-[#f0ebe3] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4 lg:max-w-md">
            <div
              className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-gold/40 text-primary-green"
              aria-hidden
            >
              {(() => {
                const StepIcon = stage?.Icon ?? Package;
                return <StepIcon className="h-7 w-7" />;
              })()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a7b52] mb-1">
                Where your order is now
              </p>
              <h3 className="font-display text-2xl text-text-dark leading-tight">
                {stage?.headline}
              </h3>
              <p className="mt-2 text-sm text-text-medium leading-relaxed sm:block hidden">
                {stage?.detail}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:items-end shrink-0">
            {courierName && (
              <p className="text-xs text-text-medium sm:text-right max-w-[240px]">
                <span className="font-semibold text-text-dark">{courierName}</span>
                {awb && <> · AWB {awb}</>}
              </p>
            )}
            {!isDelivered && estimatedDelivery && (
              <p className="text-xs text-text-medium sm:text-right">
                Est. delivery: <span className="font-semibold text-text-dark">{estimatedDelivery}</span>
              </p>
            )}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary-green px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-secondary-green transition-colors"
              >
                Track on courier site
              </a>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-text-medium leading-relaxed sm:hidden">{stage?.detail}</p>

        {/* Courier scan history */}
        {checkpoints.length > 0 && (
          <div className="mt-6 border-t border-[#c5905a]/20 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-medium mb-4">
              Delivery updates
            </p>
            <ol className="space-y-0 border-l-2 border-border ml-2 pl-5">
              {checkpoints.map((cp, index) => {
                const time = formatCheckpointTime(cp.timestamp);
                const isLatest = index === 0;
                return (
                  <li key={`${cp.timestamp ?? "cp"}-${index}`} className="relative pb-5 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-[calc(0.625rem+8px)] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white",
                        isLatest ? "border-primary-green" : "border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isLatest ? "bg-primary-green" : "bg-border"
                        )}
                      />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {cp.status && (
                        <p
                          className={cn(
                            "text-sm font-semibold capitalize",
                            isLatest ? "text-text-dark" : "text-text-medium"
                          )}
                        >
                          {cp.status}
                        </p>
                      )}
                      {cp.remarks && (
                        <p className="text-xs text-text-medium leading-snug">{cp.remarks}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-light">
                        {cp.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {cp.location}
                          </span>
                        )}
                        {time && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden />
                            {time}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Shipment contents + total */}
        <div className="mt-6 border-t border-[#c5905a]/20 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-medium mb-3">
            In this shipment ({order.items.length}{" "}
            {order.items.length === 1 ? "item" : "items"})
          </p>
          <ul className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.variant ?? ""}`}
                className="flex items-center gap-3 rounded-lg bg-white/70 border border-white/80 p-2"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream border border-border">
                  <SafeImage
                    src={item.image || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-sm font-medium text-text-dark hover:text-primary-green line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-text-light mt-0.5">
                    Qty {item.quantity} · {formatPrice(item.price)} each
                  </p>
                </div>
                <span className="text-sm font-semibold text-text-dark shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#c5905a]/15 pt-4 text-sm">
            <span className="text-text-medium">Order total</span>
            <span className="font-display text-xl text-text-dark">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
