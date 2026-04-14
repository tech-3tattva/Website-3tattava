"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeliveryPincode } from "@/context/DeliveryPincodeContext";

type DeliveryPincodeTriggerProps = {
  /** e.g. close mobile drawer before opening modal */
  onBeforeOpen?: () => void;
  className?: string;
};

export default function DeliveryPincodeTrigger({
  onBeforeOpen,
  className,
}: DeliveryPincodeTriggerProps) {
  const { openModal, pincode } = useDeliveryPincode();

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeOpen?.();
        openModal();
      }}
      className={cn(
        "inline-flex items-center gap-2 text-left hover:text-gold transition-colors",
        className
      )}
      aria-haspopup="dialog"
    >
      <MapPin size={18} className="shrink-0" aria-hidden />
      <span className="truncate max-w-[10rem] sm:max-w-[14rem]">
        {pincode ? `Deliver to: ${pincode}` : "Set pincode"}
      </span>
      <ChevronDown size={16} className="shrink-0 opacity-80" aria-hidden />
    </button>
  );
}
