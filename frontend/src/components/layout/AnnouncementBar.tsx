"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronRight } from "lucide-react";

const STORAGE_KEY = "3tattava-announcement-dismissed";
const PINCODE_KEY = "3tattava-pincode";

const TICKER_MESSAGES = [
  "80+ Trace Minerals · 60%+ Fulvic Acid · NABL Lab-Certified",
  "Free Shipping Above ₹999 · Lab-Certified Purity · Doctor-Formulated",
  "SHODHIT SHILAJIT — Purified via Classical Triphala Shodhan",
  "Manufactured by URMI Lifesciences · AYUSH-GMP Certified",
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [pincode, setPincode] = useState("");
  const [savedPincode, setSavedPincode] = useState<string | null>(null);
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setDismissed(stored === "true");
    const saved = localStorage.getItem(PINCODE_KEY);
    if (saved) setSavedPincode(saved);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TICKER_MESSAGES.length);
        setVisible(true);
      }, 400);
    };
    intervalRef.current = setInterval(cycle, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      localStorage.setItem(PINCODE_KEY, pincode);
      setSavedPincode(pincode);
      setDeliveryMsg(`Delivery available to ${pincode}`);
      setPincode("");
    }
  };

  if (dismissed) return null;

  return (
    <div
      className="relative w-full flex items-center justify-between px-4 sm:px-6"
      style={{
        background: "#1c1304",
        color: "#f7f0e2",
        minHeight: "40px",
        fontFamily: "var(--font-primary), system-ui, sans-serif",
      }}
    >
      <a href="#main" className="skip-to-main">Skip to main content</a>

      {/* Rotating ticker */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ minHeight: "40px" }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontVariationSettings: "'wdth' 75, 'wght' 500",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
            textAlign: "center",
          }}
        >
          {TICKER_MESSAGES[index]}
        </span>
      </div>

      {/* Pincode input */}
      <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
        {savedPincode && !deliveryMsg ? (
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", opacity: 0.8 }}>
            📦 {savedPincode}
          </span>
        ) : deliveryMsg ? (
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#E4C079" }}>
            ✓ {deliveryMsg}
          </span>
        ) : (
          <form onSubmit={handlePincodeSubmit} className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(200,150,62,0.4)",
                color: "#f7f0e2",
                fontSize: "11px",
                padding: "3px 8px",
                width: "110px",
                outline: "none",
                borderRadius: "0",
                fontFamily: "var(--font-primary), system-ui, sans-serif",
              }}
            />
            <button
              type="submit"
              aria-label="Check delivery"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#C8963E",
                display: "flex",
                alignItems: "center",
                padding: "2px",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </form>
        )}
      </div>

      {/* Dismiss */}
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-3 shrink-0 p-2 flex items-center justify-center hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
        style={{ minHeight: "40px", minWidth: "32px" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
