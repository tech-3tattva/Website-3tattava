"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DeliveryCheckResponse } from "@shared/types";
import { api } from "@/lib/api";
import DeliveryPincodeModal from "@/components/delivery/DeliveryPincodeModal";

const STORAGE_PINCODE = "3tattva_delivery_pincode";
const STORAGE_CHECK = "3tattva_delivery_check_cache";

type DeliveryPincodeContextValue = {
  pincode: string | null;
  lastCheck: DeliveryCheckResponse | null;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  checkPincode: (raw: string) => Promise<void>;
  checking: boolean;
  checkError: string | null;
};

const DeliveryPincodeContext = createContext<DeliveryPincodeContextValue | null>(
  null
);

export function useDeliveryPincode() {
  const ctx = useContext(DeliveryPincodeContext);
  if (!ctx) {
    throw new Error("useDeliveryPincode must be used within DeliveryPincodeProvider");
  }
  return ctx;
}

export function DeliveryPincodeProvider({ children }: { children: React.ReactNode }) {
  const [pincode, setPincode] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<DeliveryCheckResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_PINCODE);
      const c = localStorage.getItem(STORAGE_CHECK);
      if (p) setPincode(p);
      if (c && p) {
        const parsed = JSON.parse(c) as DeliveryCheckResponse;
        if (parsed?.pincode === p) setLastCheck(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const openModal = useCallback(() => {
    setCheckError(null);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const checkPincode = useCallback(async (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      setCheckError("Enter a valid 6-digit pincode");
      return;
    }
    setCheckError(null);
    setChecking(true);
    try {
      const result = await api.post<DeliveryCheckResponse>(
        "/delivery/check",
        { pincode: digits },
        false
      );
      setPincode(result.pincode);
      setLastCheck(result);
      localStorage.setItem(STORAGE_PINCODE, result.pincode);
      localStorage.setItem(STORAGE_CHECK, JSON.stringify(result));
    } catch (e) {
      setCheckError(e instanceof Error ? e.message : "Could not check pincode");
    } finally {
      setChecking(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      pincode,
      lastCheck,
      modalOpen,
      openModal,
      closeModal,
      checkPincode,
      checking,
      checkError,
    }),
    [pincode, lastCheck, modalOpen, openModal, closeModal, checkPincode, checking, checkError]
  );

  return (
    <DeliveryPincodeContext.Provider value={value}>
      {children}
      <DeliveryPincodeModal />
    </DeliveryPincodeContext.Provider>
  );
}
