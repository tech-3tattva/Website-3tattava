"use client";

import Link from "next/link";
import { CheckCircle2, Package, Sparkles, Truck, Home, XCircle } from "lucide-react";
import type { Order } from "@shared/types";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FLOW: {
  status: Exclude<Order["status"], "cancelled">;
  label: string;
  short: string;
  Icon: typeof Package;
}[] = [
  { status: "pending", label: "Order placed", short: "Placed", Icon: Package },
  { status: "confirmed", label: "Confirmed", short: "Confirmed", Icon: CheckCircle2 },
  { status: "processing", label: "Preparing", short: "Prep", Icon: Sparkles },
  { status: "shipped", label: "Shipped", short: "Shipped", Icon: Truck },
  { status: "delivered", label: "Delivered", short: "Done", Icon: Home },
];

const STAGE_COPY: Record<
  Order["status"],
  { headline: string; detail: string }
> = {
  pending: {
    headline: "We’ve received your order",
    detail:
      "Your order is logged. If payment is still processing, we’ll confirm shortly and move you to the next step automatically.",
  },
  confirmed: {
    headline: "Payment confirmed — thank you",
    detail:
      "Your ritual essentials are secured. Our team will begin preparing your parcel with care.",
  },
  processing: {
    headline: "We’re preparing your parcel",
    detail:
      "Items are being picked, quality-checked, and packed. You’ll get tracking details as soon as it ships.",
  },
  shipped: {
    headline: "On the way to you",
    detail:
      "Your order has left our facility. Use the tracking link below for live courier updates when available.",
  },
  delivered: {
    headline: "Delivered — enjoy your wellness ritual",
    detail:
      "We hope you love your 3Tattva picks. Share your experience or explore complementary care in our shop.",
  },
  cancelled: {
    headline: "This order was cancelled",
    detail:
      "No further shipment will occur for this order ID. If this looks wrong, reach out to support with your order number.",
  },
};

function flowIndex(status: Order["status"]): number {
  if (status === "cancelled") return -1;
  const i = FLOW.findIndex((s) => s.status === status);
  return i >= 0 ? i : 0;
}

export default function OrderStatusFlow({ order }: { order: Order }) {
  const currentIdx = flowIndex(order.status);
  const copy = STAGE_COPY[order.status];
  const isDelivered = order.status === "delivered";

  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-left">
        <div className="flex items-start gap-3">
          <XCircle className="h-8 w-8 shrink-0 text-red-600" aria-hidden />
          <div>
            <h3 className="font-display text-xl text-text-dark">{copy.headline}</h3>
            <p className="mt-2 text-sm text-text-medium leading-relaxed">{copy.detail}</p>
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
          {FLOW.map((step, index) => {
            const done = isDelivered || index < currentIdx;
            const active = !isDelivered && index === currentIdx;
            const Icon = step.Icon;
            return (
              <li key={step.status} className="relative flex flex-1 flex-col items-center min-w-0">
                {index < FLOW.length - 1 && (
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
        {FLOW.map((step, index) => {
          const done = isDelivered || index < currentIdx;
          const active = !isDelivered && index === currentIdx;
          const Icon = step.Icon;
          return (
            <li key={step.status} className="relative pb-8 last:pb-0">
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

      {/* Current stage spotlight + order snapshot */}
      <div className="rounded-xl border border-[#c5905a]/25 bg-gradient-to-br from-[#faf7f2] to-[#f0ebe3] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4 lg:max-w-md">
            <div
              className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-gold/40 text-primary-green"
              aria-hidden
            >
              {(() => {
                const StepIcon =
                  (isDelivered ? Home : FLOW[currentIdx]?.Icon) ?? Package;
                return <StepIcon className="h-7 w-7" />;
              })()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a7b52] mb-1">
                Where your order is now
              </p>
              <h3 className="font-display text-2xl text-text-dark leading-tight">{copy.headline}</h3>
              <p className="mt-2 text-sm text-text-medium leading-relaxed sm:block hidden">
                {copy.detail}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:items-end shrink-0">
            {order.tracking?.courierName && (
              <p className="text-xs text-text-medium text-right max-w-[220px]">
                <span className="font-semibold text-text-dark">{order.tracking.courierName}</span>
                {order.tracking.trackingNumber && (
                  <> · {order.tracking.trackingNumber}</>
                )}
              </p>
            )}
            {order.tracking?.trackingUrl && (
              <a
                href={order.tracking.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary-green px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-secondary-green transition-colors"
              >
                Open courier tracking
              </a>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-text-medium leading-relaxed sm:hidden">{copy.detail}</p>

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
