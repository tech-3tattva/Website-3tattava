"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDeliveryPincode } from "@/context/DeliveryPincodeContext";
import Button from "@/components/ui/Button";

export default function DeliveryPincodeModal() {
  const {
    modalOpen,
    closeModal,
    pincode,
    checkPincode,
    checking,
    checkError,
    lastCheck,
  } = useDeliveryPincode();
  const [input, setInput] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalOpen) {
      setInput(pincode ?? "");
    }
  }, [modalOpen, pincode]);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  const message =
    lastCheck && lastCheck.pincode === input.replace(/\D/g, "").slice(0, 6)
      ? lastCheck.message
      : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) closeModal();
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg bg-[#f8efe4] border border-[#b89b6a]/35 shadow-xl p-6 text-text-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-pincode-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2
            id="delivery-pincode-title"
            className="font-display text-2xl tracking-wide text-text-dark"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Enter delivery pincode
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-1 rounded-md text-text-medium hover:text-text-dark hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-sm text-text-medium mb-4 leading-relaxed">
          Check whether we currently deliver to your area. This is informational only and does not
          block checkout.
        </p>

        <label htmlFor="delivery-pincode-input" className="sr-only">
          6-digit pincode
        </label>
        <input
          id="delivery-pincode-input"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="e.g. 110001"
          className="w-full px-4 py-3 rounded-md border border-border bg-white text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold mb-3"
        />

        {checkError && (
          <p className="text-sm text-red-700 mb-3" role="alert">
            {checkError}
          </p>
        )}

        {message && !checkError && (
          <p
            className={`text-sm mb-3 leading-relaxed ${
              lastCheck?.serviceable ? "text-[#2d5a3d]" : "text-text-dark"
            }`}
            role="status"
          >
            {message}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full"
          disabled={checking}
          onClick={() => void checkPincode(input)}
        >
          {checking ? "Checking…" : "Check serviceability"}
        </Button>
      </div>
    </div>
  );
}
