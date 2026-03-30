"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Address, Order } from "@shared/types";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type AddressFormState = {
  title: Address["title"];
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  label: Address["label"];
  isDefault: boolean;
};

const EMPTY_ADDRESS: AddressFormState = {
  title: "Mr.",
  firstName: "",
  lastName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  label: "Home",
  isDefault: true,
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addressForm, setAddressForm] = useState<AddressFormState>(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickOrder = orders[0];

  function getStatusStep(status: Order["status"]) {
    if (status === "cancelled") return -1;
    if (status === "pending") return 0;
    if (status === "confirmed" || status === "processing") return 1;
    if (status === "shipped") return 2;
    if (status === "delivered") return 3;
    return 1;
  }

  function formatOrderedAt(iso: string) {
    try {
      return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadAccountData() {
      try {
        const [addressData, orderData] = await Promise.all([
          api.get<Address[]>("/addresses", true),
          api.get<Order[]>("/orders", true),
        ]);
        setAddresses(addressData);
        setOrders(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load account data");
      }
    }

    void loadAccountData();
  }, [isLoggedIn]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  async function handleSaveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSavingAddress(true);

    try {
      const savedAddress = await api.post<Address>("/addresses", addressForm, true);
      setAddresses((current) => {
        const next = addressForm.isDefault
          ? current.map((item) => ({ ...item, isDefault: false }))
          : current;
        return [savedAddress, ...next];
      });
      setAddressForm({
        ...EMPTY_ADDRESS,
        isDefault: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    try {
      await api.delete<{ ok: boolean }>(`/addresses/${id}`, true);
      setAddresses((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-text-medium">Loading account...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl text-text-dark mb-3">My Account</h1>
        <p className="text-text-medium mb-6">Please login to view your account.</p>
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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-9 sm:py-12 md:py-16">
      <div className="mb-7 sm:mb-8">
        <h1 className="font-display text-[40px] sm:text-5xl text-text-dark mb-2 text-center tracking-tight">
          My Account
        </h1>
        <p className="text-text-medium text-center text-sm sm:text-base">
          Manage your profile, saved addresses, and recent orders in one place.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-7 sm:mb-8 rounded-xl border-2 border-gold bg-gradient-to-r from-[#fff9ef] to-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <p className="text-xl sm:text-2xl font-semibold text-text-dark tracking-tight">
          Wellness Points: <span className="text-[#ba5929]">{user.wellnessPoints ?? 0}</span>
        </p>
        <button
          type="button"
          className="rounded-md bg-[#ba5929] px-5 sm:px-6 py-2 text-white text-sm sm:text-base hover:bg-[#9c4c23] transition-colors"
        >
          Redeem
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="premium-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-[30px] sm:text-3xl text-text-dark">Profile</h2>
            <span className="text-xs uppercase text-text-light tracking-wider">
              {user.wellnessClub ? "Wellness Club" : "Standard"}
            </span>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3 border-b border-border pb-2">
              <span className="text-text-light uppercase tracking-wider">Name</span>
              <span className="font-medium text-text-dark">{user.name}</span>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-border pb-2">
              <span className="text-text-light uppercase tracking-wider">Email</span>
              <span className="font-medium text-text-dark">{user.email}</span>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-border pb-2">
              <span className="text-text-light uppercase tracking-wider">Role</span>
              <span className="font-medium capitalize text-text-dark">{user.role}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-md bg-[#ba5929] px-4 py-2.5 text-white hover:bg-[#9c4c23] transition-colors"
          >
            Logout
          </button>
        </section>

        <section className="premium-card rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="font-serif text-[30px] sm:text-3xl text-text-dark">Recent Orders</h2>
              <p className="text-text-light text-sm mt-1">Your latest purchase and full history anytime.</p>
            </div>
            <Link
              href="/account/orders"
              className="shrink-0 rounded-md border-2 border-gold bg-white/90 px-4 py-2 text-sm font-medium text-text-dark hover:bg-gold/15 transition-colors"
            >
              Order history
            </Link>
          </div>

          {quickOrder ? (
            <div className="rounded-xl border border-border p-4 mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-text-dark">Order {quickOrder.orderNumber}</p>
                  <p className="text-text-medium text-xs mt-1">
                    Placed {formatOrderedAt(quickOrder.createdAt)}
                  </p>
                </div>
                <span className="font-medium text-text-dark">{formatPrice(quickOrder.total)}</span>
              </div>

              {quickOrder.status === "cancelled" ? (
                <p className="mt-4 text-sm text-red-700">This order was cancelled.</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 gap-y-2 text-[11px] sm:text-xs text-text-medium">
                  {["Ordered", "Processing", "Shipped", "Delivered"].map((step, idx) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                          idx <= getStatusStep(quickOrder.status) ? "bg-primary-green" : "bg-border"
                        }`}
                      />
                      <span className="text-center">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {quickOrder.tracking?.trackingUrl && quickOrder.status !== "delivered" && (
                  <a
                    href={quickOrder.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold font-medium hover:underline underline-offset-4"
                  >
                    Track shipment →
                  </a>
                )}
                <Link
                  href="/account/orders"
                  className="text-sm text-text-dark font-medium hover:underline underline-offset-4"
                >
                  View all orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-cream px-4 py-4 text-text-medium mt-5">
              No orders yet.{" "}
              <Link href="/account/orders" className="text-gold font-medium hover:underline">
                Order history
              </Link>{" "}
              will list purchases here once you shop.
            </div>
          )}
        </section>

        <section className="premium-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-serif text-[30px] sm:text-3xl text-text-dark">Saved Addresses</h2>
            <span className="text-xs uppercase tracking-wider text-text-light">
              {addresses.length} saved
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {addresses.length === 0 ? (
              <div className="rounded-lg bg-cream px-4 py-4 text-text-medium">
                No saved addresses yet. Add your first address below.
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-border bg-white p-4 shadow-[0_3px_10px_rgba(0,0,0,0.03)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
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
                        {[address.title, address.firstName, address.lastName].filter(Boolean).join(" ")}
                      </p>
                      <p className="text-sm text-text-medium mt-1 break-words">
                        {[address.line1, address.line2, address.city, address.state, address.pincode, address.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="text-sm text-text-light mt-2">{address.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAddress(address.id)}
                      className="text-sm text-red-600 hover:underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSaveAddress} className="grid gap-3 md:grid-cols-2">
            <input
              value={addressForm.firstName}
              onChange={(e) => setAddressForm((current) => ({ ...current, firstName: e.target.value }))}
              placeholder="First Name"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2"
              required
            />
            <input
              value={addressForm.lastName}
              onChange={(e) => setAddressForm((current) => ({ ...current, lastName: e.target.value }))}
              placeholder="Last Name"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2"
              required
            />
            <input
              value={addressForm.phone}
              onChange={(e) => setAddressForm((current) => ({ ...current, phone: e.target.value }))}
              placeholder="Phone Number"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2 md:col-span-2"
              required
            />
            <input
              value={addressForm.line1}
              onChange={(e) => setAddressForm((current) => ({ ...current, line1: e.target.value }))}
              placeholder="Address line 1"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2 md:col-span-2"
              required
            />
            <input
              value={addressForm.city}
              onChange={(e) => setAddressForm((current) => ({ ...current, city: e.target.value }))}
              placeholder="City"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2"
              required
            />
            <input
              value={addressForm.state}
              onChange={(e) => setAddressForm((current) => ({ ...current, state: e.target.value }))}
              placeholder="State"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2"
              required
            />
            <input
              value={addressForm.pincode}
              onChange={(e) => setAddressForm((current) => ({ ...current, pincode: e.target.value }))}
              placeholder="Pincode"
              className="w-full rounded-md border border-border bg-[#ece2d0] px-3 py-2 md:col-span-2"
              required
            />
            <label className="flex items-center gap-2 text-xs text-text-medium md:col-span-2">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm((current) => ({ ...current, isDefault: e.target.checked }))}
              />
              Save as default address
            </label>
            <button
              type="submit"
              disabled={savingAddress}
              className="rounded-md bg-[#b58b4e] px-5 py-2.5 text-white hover:bg-[#9a7440] transition-colors disabled:opacity-60 md:col-span-2"
            >
              {savingAddress ? "Saving..." : "Save Address"}
            </button>
          </form>
        </section>

        <section className="premium-card rounded-2xl p-4 sm:p-6">
          <h2 className="font-serif text-[30px] sm:text-3xl text-text-dark mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/products"
              className="block rounded-md border border-border bg-[#e7decf] px-4 py-3 text-text-dark text-center hover:bg-[#ddd3c2] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/checkout/cart"
              className="block rounded-md border border-border bg-[#e7decf] px-4 py-3 text-text-dark text-center hover:bg-[#ddd3c2] transition-colors"
            >
              Review Cart
            </Link>
            <Link
              href="/track-order"
              className="block rounded-md border border-border bg-[#e7decf] px-4 py-3 text-text-dark text-center hover:bg-[#ddd3c2] transition-colors"
            >
              Track Shipment
            </Link>
            <Link
              href="/account/orders"
              className="block rounded-md border-2 border-gold bg-[#f5efe4] px-4 py-3 text-text-dark text-center font-medium hover:bg-gold/20 transition-colors"
            >
              Order history
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

