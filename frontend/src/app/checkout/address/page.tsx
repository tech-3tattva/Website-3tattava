"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Address } from "@shared/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, USE_MOCK } from "@/lib/api";
import { CHECKOUT_ADDRESS_PATH } from "@/lib/auth-redirect";
import { addMockAddress, loadMockAddresses } from "@/lib/mock-address-storage";
import { formatPrice } from "@/lib/utils";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const { subtotal, total, itemCount } = useCart();
  const [interested, setInterested] = useState(true);
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
    // Persist shipping address so the payment page can create a demo order
    // (Razorpay integration comes later, but we still need an order + tracking).
    const shippingAddress = {
      title: form.title,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || "",
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      country: form.country || "India",
    };

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
            <div className="premium-card p-6">
              {isLoggedIn ? (
                <>
                  <p className="text-text-medium mb-2">
                    Signed in as <span className="font-medium text-text-dark">{user?.email}</span>
                  </p>
                  <p className="text-sm text-text-light">
                    Your saved addresses can be reused below and in your account dashboard.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-text-medium mb-4">
                    To redeem 3Tattva Wellness Points, please LOGIN/REGISTER
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-text-dark text-white font-medium rounded hover:bg-primary-green"
                  >
                    LOGIN / REGISTER
                  </Link>
                </>
              )}
            </div>
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
            <div className="premium-card p-6">
              <h3 className="font-sans font-bold text-lg mb-2">3Tattva Wellness Club</h3>
              <p className="text-text-medium text-sm mb-4">
                Earn points and benefits when you join our wellness program.
              </p>
              <Link href="/wellness-club" className="text-primary-green text-sm hover:underline mb-4 inline-block">
                VIEW BENEFITS
              </Link>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="club"
                    checked={interested}
                    onChange={() => setInterested(true)}
                    className="rounded-full"
                  />
                  <span className="text-sm">I&apos;M INTERESTED</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="club"
                    checked={!interested}
                    onChange={() => setInterested(false)}
                    className="rounded-full"
                  />
                  <span className="text-sm">NO THANKS</span>
                </label>
              </div>
            </div>
            <div className="premium-card p-6" id="shipping-address-form">
              <h3 className="font-sans font-bold text-lg mb-4">Shipping address</h3>
              <p className="text-text-light text-xs mb-4">
                Edit fields as needed for this order. Saving stores the address on your signed-in account.
              </p>
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">TITLE</label>
                  <select
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">FIRST NAME *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">LAST NAME *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">ADDRESS LINE 1 *</label>
                  <input
                    type="text"
                    value={form.line1}
                    onChange={(e) => updateField("line1", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">ADDRESS LINE 2</label>
                  <input
                    type="text"
                    value={form.line2}
                    onChange={(e) => updateField("line2", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">ZIP / POSTAL CODE *</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">CITY *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">COUNTRY *</label>
                  <select
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                  >
                    <option>India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">STATE / PROVINCE *</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                  >
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-1">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded"
                    required
                  />
                </div>
              </div>
              {canSaveAddress && (
                <div className="mt-4 flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm text-text-medium">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => updateField("isDefault", e.target.checked)}
                    />
                    Save as default address
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleSaveAddress()}
                    disabled={isSaving}
                    className="px-5 py-2 bg-white border border-text-dark text-text-dark rounded hover:bg-beige transition-colors disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              )}
            </div>
            <div className="premium-card p-6">
              <h3 className="font-sans font-bold text-lg mb-4">Shipping Methods</h3>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer mb-2">
                <input type="radio" name="shipping" defaultChecked />
                <span>Standard — ₹150</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer mb-2">
                <input type="radio" name="shipping" />
                <span>Express — ₹250</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer">
                <input type="radio" name="shipping" />
                <span>Free (orders above ₹999)</span>
              </label>
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
