"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import WaitlistModal from "@/components/WaitlistModal";

interface WaitlistContextValue {
  /** Open the waitlist modal, optionally preselecting a product. */
  open: (product?: string) => void;
}

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within a WaitlistProvider");
  return ctx;
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>(undefined);

  const open = useCallback((p?: string) => {
    setProduct(p);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={close} initialProduct={product} />
    </WaitlistContext.Provider>
  );
}
