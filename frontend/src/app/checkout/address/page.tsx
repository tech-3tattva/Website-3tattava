"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { Address } from "@shared/types";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, USE_MOCK } from "@/lib/api";
import { CHECKOUT_ADDRESS_PATH } from "@/lib/auth-redirect";
import { addMockAddress, loadMockAddresses } from "@/lib/mock-address-storage";
import { formatPrice } from "@/lib/utils";

type CheckoutFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  options?: string[];
  className?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
};

/**
 * Floating-label checkout field with a gold focus ring + required-field accent.
 * Renders an <input> by default, or a <select> when `options` is provided.
 * Motion (label lift + focus ring) is disabled under prefers-reduced-motion.
 */
function CheckoutField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  options,
  className = "",
  autoComplete,
  inputMode,
}: CheckoutFieldProps) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const [focused, setFocused] = useState(false);
  const isSelect = Array.isArray(options);
  const floated = focused || isSelect || value.trim().length > 0;

  const field =
    "w-full h-14 rounded-xl bg-white border px-4 pt-5 pb-1 text-[15px] text-text-dark outline-none transition-colors";
  const borderTone = focused
    ? "border-gold"
    : required
      ? "border-border border-l-[3px] border-l-gold"
      : "border-border";

  return (
    <motion.div
      className={`relative rounded-xl ${className}`}
      initial={false}
      animate={{
        boxShadow: focused
          ? "0 0 0 3px rgba(205,135,42,0.25)"
          : "0 0 0 0 rgba(205,135,42,0)",
      }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
    >
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{ y: floated ? 0 : 13, scale: floated ? 1 : 1.34 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 460, damping: 32 }
        }
        className={`pointer-events-none absolute left-4 top-2 origin-top-left text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
          focused ? "text-gold" : "text-text-light"
        }`}
      >
        {label}
        {required && <span className="text-gold">&nbsp;*</span>}
      </motion.label>

      {isSelect ? (
        <>
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${field} ${borderTone} appearance-none cursor-pointer pr-10`}
          >
            {options!.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light"
            aria-hidden
          />
        </>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`${field} ${borderTone}`}
        />
      )}
    </motion.div>
  );
}

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const { subtotal, total, itemCount } = useCart();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: user?.email ?? "",
    title: "Mr.",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    country: "India",
    state: "Delhi",
    phone: "",
    label: "Home",
    isDefault: false,
  });

  const shipping = subtotal >= 999 ? 0 : 150;
  const canSaveAddress = isLoggedIn;

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace(
        `/login?redirect=${encodeURIComponent(CHECKOUT_ADDRESS_PATH)}`
      );
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    setForm((current) => ({ ...current, email: user?.email ?? current.email }));
  }, [user?.email]);

  const applyAddressToForm = useCallback((address: Address) => {
    setForm((current) => ({
      ...current,
      title: address.title ?? "Mr.",
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: address.line2 ?? "",
      pincode: address.pincode,
      city: address.city,
      country: address.country,
      state: address.state,
      phone: address.phone,
      label: address.label ?? "Home",
      isDefault: address.isDefault,
    }));
    setSelectedAddressId(address.id);
  }, []);

  const startNewAddress = useCallback(() => {
    setSelectedAddressId(null);
    setForm((current) => ({
      ...current,
      title: "Mr.",
      firstName: "",
      lastName: "",
      line1: "",
      line2: "",
      pincode: "",
      city: "",
      country: "India",
      state: "Delhi",
      phone: "",
      label: "Home",
      isDefault: false,
    }));
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    const userId = user.id;

    async function loadAddresses() {
      try {
        setError(null);
        if (USE_MOCK) {
          const addresses = loadMockAddresses(userId);
          setSavedAddresses(addresses);
          const preferred = addresses.find((item) => item.isDefault) || addresses[0];
          if (preferred) applyAddressToForm(preferred);
          return;
        }
        const addresses = await api.get<Address[]>("/addresses", true);
        setSavedAddresses(addresses);
        const preferred = addresses.find((item) => item.isDefault) || addresses[0];
        if (preferred) applyAddressToForm(preferred);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load addresses");
      }
    }

    void loadAddresses();
  }, [isLoggedIn, user, applyAddressToForm]);

  useEffect(() => {
    if (!saveSuccess) return;
    const t = window.setTimeout(() => setSaveSuccess(false), 5000);
    return () => window.clearTimeout(t);
  }, [saveSuccess]);

  const addressPreview = useMemo(
    () =>
      [form.firstName, form.lastName, form.line1, form.line2, form.city, form.state, form.pincode]
        .filter(Boolean)
        .join(", "),
    [form]
  );

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const [pinStatus, setPinStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [pinMsg, setPinMsg] = useState("");

  const lookupPincode = useCallback(async (pin: string) => {
    setPinStatus("loading");
    setPinMsg("Detecting your city & state…");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const rec = Array.isArray(data) ? data[0] : null;
      const po = rec?.PostOffice?.[0];
      if (rec?.Status === "Success" && po) {
        const detectedCity = po.District || po.Block || po.Name || "";
        const detectedState = po.State || "";
        setForm((cur) => ({
          ...cur,
          city: detectedCity || cur.city,
          state: detectedState || cur.state,
        }));
        setPinStatus("ok");
        setPinMsg(`Auto-filled from PIN: ${[detectedCity, detectedState].filter(Boolean).join(", ")}`);
      } else {
        setPinStatus("error");
        setPinMsg("We couldn't find that PIN code — please enter city & state manually.");
      }
    } catch {
      setPinStatus("error");
      setPinMsg("Couldn't detect location — please enter city & state manually.");
    }
  }, []);

  async function handleSaveAddress() {
    if (!canSaveAddress || !user?.id) return;
    setError(null);
    setIsSaving(true);
    try {
      const body = {
        title: form.title as Address["title"],
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        label: form.label as Address["label"],
        isDefault: form.isDefault,
      };

      if (USE_MOCK) {
        const next = addMockAddress(user.id, body);
        setSavedAddresses(next);
        const saved = next[0];
        applyAddressToForm(saved);
        setSaveSuccess(true);
        return;
      }

      const saved = await api.post<Address>("/addresses", body, true);
      const refreshed = await api.get<Address[]>("/addresses", true);
      setSavedAddresses(refreshed);
      applyAddressToForm(saved);
      setSaveSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  }

  const handleProceed = () => {
    // Validate required fields client-side so we never send an incomplete
    // address to the order API (which rejects empty strings via Zod).
    const requiredFields: [keyof typeof form, string][] = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["line1", "Address line 1"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "PIN code"],
    ];
    const missing = requiredFields
      .filter(([key]) => !String(form[key] ?? "").trim())
      .map(([, label]) => label);
    if (missing.length > 0) {
      setError(`Please fill the required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.pincode.replace(/\D/g, "").length < 6) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    const shippingAddress = {
      title: form.title,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: phoneDigits,
      line1: form.line1.trim(),
      line2: form.line2?.trim() || "",
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.replace(/\D/g, ""),
      country: form.country || "India",
    };

    setError(null);
    localStorage.setItem("checkoutShippingAddress", JSON.stringify(shippingAddress));
    router.push("/checkout/payment");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-medium">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-medium">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <CheckoutHeader currentStep={1} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[65%_35%] gap-8">
          <div className="space-y-6">
            {saveSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="premium-card border-2 border-gold/50 bg-[#f5efe6] p-4 text-text-dark"
              >
                <p className="font-semibold text-primary-green">Address saved to your account</p>
                <p className="text-sm text-text-medium mt-1">
                  It&apos;s listed above. Select it anytime for this order, or add another address in the form below.
                </p>
              </div>
            )}
            <div className="premium-card p-6">
              <h3 className="font-sans font-bold text-lg mb-1">Saved addresses</h3>
              <p className="text-sm text-text-light mb-4">
                Choose where to ship — or enter a new address in the form below.
              </p>
              {savedAddresses.length === 0 ? (
                <p className="text-sm text-text-medium">
                  You don&apos;t have any saved addresses yet. Complete the shipping form and click{" "}
                  <span className="font-medium">Save address</span> to store one securely on your account.
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => applyAddressToForm(address)}
                        className={`block w-full rounded-lg border p-4 text-left transition-colors ${
                          selectedAddressId === address.id
                            ? "border-gold ring-2 ring-gold/50 bg-cream"
                            : "border-border hover:bg-cream"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {address.label && (
                            <span className="rounded-full bg-primary-green/10 px-2 py-1 text-xs font-medium text-primary-green">
                              {address.label}
                            </span>
                          )}
                          {address.isDefault && (
                            <span className="rounded-full bg-gold/20 px-2 py-1 text-xs font-medium text-text-dark">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-text-dark">
                          {[address.firstName, address.lastName].join(" ")}
                        </p>
                        <p className="text-sm text-text-medium mt-1">
                          {[address.line1, address.line2, address.city, address.state, address.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={startNewAddress}
                    className="text-sm font-medium text-primary-green hover:underline"
                  >
                    + Enter a new address
                  </button>
                </>
              )}
            </div>
            <div className="premium-card p-6" id="shipping-address-form">
              <div className="mb-5">
                <h3 className="font-sans font-bold text-lg">Shipping address</h3>
                <p className="text-text-light text-xs mt-1">
                  Edit fields as needed for this order. Saving stores the address on your signed-in account.
                </p>
                <p className="text-[11px] text-text-light mt-1">
                  Fields marked <span className="text-gold font-semibold">*</span> are required.
                </p>
              </div>
              {error && (
                <p className="text-sm text-red-600 mb-4" role="alert">
                  {error}
                </p>
              )}

              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-text-medium">
                  <span className="inline-block h-3 w-1 rounded-full bg-gold" />
                  Contact details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4">
                  <CheckoutField
                    label="Title"
                    value={form.title}
                    onChange={(v) => updateField("title", v)}
                    options={["Mr.", "Mrs.", "Ms.", "Dr."]}
                  />
                  <CheckoutField
                    label="First name"
                    value={form.firstName}
                    onChange={(v) => updateField("firstName", v)}
                    required
                    autoComplete="given-name"
                  />
                  <CheckoutField
                    label="Last name"
                    value={form.lastName}
                    onChange={(v) => updateField("lastName", v)}
                    required
                    autoComplete="family-name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CheckoutField
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    required
                    autoComplete="email"
                    inputMode="email"
                  />
                  <CheckoutField
                    label="Phone number"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-text-medium">
                  <span className="inline-block h-3 w-1 rounded-full bg-gold" />
                  Delivery address
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <CheckoutField
                    label="Address line 1"
                    value={form.line1}
                    onChange={(v) => updateField("line1", v)}
                    required
                    autoComplete="address-line1"
                  />
                  <CheckoutField
                    label="Address line 2 (optional)"
                    value={form.line2}
                    onChange={(v) => updateField("line2", v)}
                    autoComplete="address-line2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <CheckoutField
                    label="City"
                    value={form.city}
                    onChange={(v) => updateField("city", v)}
                    required
                    autoComplete="address-level2"
                  />
                  <CheckoutField
                    label="State"
                    value={form.state}
                    onChange={(v) => updateField("state", v)}
                    required
                    autoComplete="address-level1"
                  />
                  <CheckoutField
                    label="PIN code"
                    value={form.pincode}
                    onChange={(v) => {
                      updateField("pincode", v);
                      const digits = v.replace(/\D/g, "");
                      if (digits.length === 6) void lookupPincode(digits);
                      else if (pinStatus !== "idle") {
                        setPinStatus("idle");
                        setPinMsg("");
                      }
                    }}
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                </div>
                {pinMsg && (
                  <p className={`mt-2 text-xs ${pinStatus === "error" ? "text-red-600" : pinStatus === "ok" ? "text-primary-green" : "text-text-medium"}`}>
                    {pinMsg}
                  </p>
                )}
                <div className="mt-4">
                  <CheckoutField
                    label="Country"
                    value={form.country}
                    onChange={(v) => updateField("country", v)}
                    options={["India"]}
                    required
                  />
                </div>
              </div>

              {canSaveAddress && (
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border pt-5">
                  <label className="flex items-center gap-2 text-sm text-text-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => updateField("isDefault", e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    Save as default address
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleSaveAddress()}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-white border border-text-dark text-text-dark font-medium hover:bg-beige transition-colors disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save address"}
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-4 bg-text-dark text-white font-medium rounded hover:bg-primary-green transition-colors"
            >
              PROCEED TO PAYMENT
            </button>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="premium-card p-6">
              <h3 className="font-sans font-bold text-lg mb-4">Order Summary</h3>
              {addressPreview && (
                <div className="mb-4 rounded-lg bg-cream px-4 py-3 text-sm text-text-medium">
                  <p className="font-medium text-text-dark mb-1">Current shipping address</p>
                  <p>{addressPreview}</p>
                </div>
              )}
              <div className="flex justify-between text-sm mb-2">
                <span>{itemCount} x items</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-primary-green" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
