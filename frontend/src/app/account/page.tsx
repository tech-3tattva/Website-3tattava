"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Address, Order, Product } from "@shared/types";
import { api, getMyAssessment, getWelcomeOffer, type AssessmentRecord, type WelcomeOffer } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  Award,
  CheckCircle,
  ClipboardList,
  Copy,
  Gift,
  Heart,
  History,
  LogOut,
  Mail,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Logo from "@/components/layout/Logo";
import SafeImage from "@/components/ui/SafeImage";
import { useWishlist } from "@/context/WishlistContext";
import { getProducts } from "@/lib/products";

const ESPRESSO = "#442a1b";
const GOLD = "#cd872a";
const CREAM = "#f7f0e2";
const TAUPE = "#8a7355";

const CARD_CLASS =
  "premium-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(68,42,27,0.13)]";

type ToastState = { id: number; message: string };

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

const QUICK_ACTIONS: { href: string; label: string; icon: LucideIcon; primary?: boolean }[] = [
  { href: "/products", label: "Continue Shopping", icon: ShoppingBag },
  { href: "/checkout/cart", label: "Review Cart", icon: ShoppingCart },
  { href: "/track-order", label: "Track Shipment", icon: Truck },
  { href: "/account/orders", label: "Order history", icon: ClipboardList, primary: true },
];

function CardIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      style={{ background: "rgba(205,135,42,0.12)", border: "1px solid rgba(205,135,42,0.32)" }}
    >
      <Icon size={20} color={GOLD} />
    </span>
  );
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-[#ece2d0] px-3 py-2.5 text-sm text-text-dark placeholder:text-text-light transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";

export default function AccountPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addressForm, setAddressForm] = useState<AddressFormState>(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const { items: wishlistIds } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [welcomeOffer, setWelcomeOffer] = useState<WelcomeOffer | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);

  const quickOrder = orders[0];

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
  }

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

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const { offer } = await getWelcomeOffer();
        if (!cancelled) setWelcomeOffer(offer);
      } catch {
        if (!cancelled) setWelcomeOffer(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await getMyAssessment();
        if (!cancelled) setAssessment(res.latest);
      } catch {
        if (!cancelled) setAssessment(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setWishlistProducts([]);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const { products } = await getProducts({ limit: 200 });
        if (cancelled) return;
        const wanted = new Set(wishlistIds);
        setWishlistProducts(products.filter((p) => wanted.has(p.id)));
      } catch {
        if (!cancelled) setWishlistProducts([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [wishlistIds]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  async function handleCopyEmail() {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(user.email);
      showToast("Email copied");
    } catch {
      showToast("Copy not supported");
    }
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
      showToast("Address saved");
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
      showToast("Address removed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex justify-center">
        <p className="text-text-medium">Loading your account…</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-28 pb-16 sm:pt-32 sm:pb-24">
        <div className="premium-card p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo variant="dark" size="lg" />
          </div>
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(205,135,42,.12)", border: "1px solid rgba(205,135,42,.35)" }}
          >
            <User size={24} color="#cd872a" />
          </div>
          <h1 className="font-display text-3xl text-text-dark mb-2">Your Account</h1>
          <p className="text-text-medium mb-6 text-sm leading-relaxed">
            Sign in to track orders, manage addresses, view your wellness assessments,
            and reorder your rituals in one tap.
          </p>
          <Link
            href="/login"
            className="block w-full px-6 py-3 rounded font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", color: "#442a1b" }}
          >
            Sign In / Sign Up
          </Link>
          <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] text-text-light uppercase tracking-[0.14em]">
            <span>Track Orders</span>
            <span>Saved Address</span>
            <span>Fast Reorder</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-28 pb-9 sm:pt-32 sm:pb-12 md:pb-16">
      <div className="mb-7 sm:mb-9 text-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: "rgba(205,135,42,0.12)", border: "1px solid rgba(205,135,42,0.3)", color: ESPRESSO }}
        >
          <Sparkles size={13} color={GOLD} /> Member Dashboard
        </span>
        <h1 className="font-display font-bold text-[40px] sm:text-5xl text-text-dark mt-4 mb-2 tracking-tight uppercase">
          My Account
        </h1>
        <p className="text-text-medium text-sm sm:text-base">
          Welcome back, {user.name.split(" ")[0]} — manage your profile, saved addresses, and recent orders in one place.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span aria-hidden className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div
        className="mb-7 sm:mb-9 overflow-hidden rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(120deg,#fff9ef 0%,#fbf1dd 55%,#f6e6c8 100%)",
          border: "2px solid #cd872a",
          boxShadow: "0 16px 40px rgba(205,135,42,0.16)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg,#cd872a,#e4c079)", boxShadow: "0 8px 20px rgba(205,135,42,0.35)" }}
          >
            <Award size={26} color="#fff" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: TAUPE }}>
              Wellness Points
            </p>
            <p className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: ESPRESSO }}>
              {user.wellnessPoints ?? 0}
              <span className="ml-1.5 text-sm font-medium align-middle" style={{ color: TAUPE }}>
                pts
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => showToast("Points redeemed")}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: ESPRESSO, boxShadow: "0 10px 24px rgba(68,42,27,0.25)" }}
        >
          <Gift size={18} /> Redeem
        </button>
      </div>

      {welcomeOffer && (
        <div
          className="mb-7 sm:mb-9 overflow-hidden rounded-2xl px-5 sm:px-7 py-5 flex flex-wrap items-center justify-between gap-4"
          style={{
            background: "linear-gradient(120deg,#442a1b 0%,#573622 100%)",
            boxShadow: "0 16px 40px rgba(68,42,27,0.22)",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg,#cd872a,#e4c079)", boxShadow: "0 8px 20px rgba(205,135,42,0.35)" }}
            >
              <Gift size={24} color="#fff" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#e4c079" }}>
                Your Welcome Offer
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md px-2 py-1 font-mono text-sm font-bold"
                  style={{ background: "rgba(247,240,226,0.14)", color: CREAM, letterSpacing: "0.06em" }}
                >
                  {welcomeOffer.code}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={
                    welcomeOffer.used
                      ? { background: "rgba(247,240,226,0.16)", color: CREAM, border: "1px solid rgba(247,240,226,0.3)" }
                      : welcomeOffer.expired
                        ? { background: "rgba(220,120,90,0.18)", color: "#f4d3c4", border: "1px solid rgba(220,120,90,0.4)" }
                        : { background: "linear-gradient(135deg,#cd872a,#e4c079)", color: ESPRESSO }
                  }
                >
                  {welcomeOffer.used ? "Used ✓" : welcomeOffer.expired ? "Expired" : "Unused · ₹200 off"}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/account/orders"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", color: ESPRESSO }}
          >
            <History size={15} /> View full order history
          </Link>
        </div>
      )}

      {assessment ? (
        <div
          className="mb-7 sm:mb-9 overflow-hidden rounded-2xl px-5 sm:px-7 py-5"
          style={{
            background: "linear-gradient(120deg,#442a1b 0%,#573622 100%)",
            boxShadow: "0 16px 40px rgba(68,42,27,0.22)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "linear-gradient(135deg,#cd872a,#e4c079)", boxShadow: "0 8px 20px rgba(205,135,42,0.35)" }}
              >
                <ClipboardList size={24} color="#fff" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#e4c079" }}>
                  My Assessment Report
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: "linear-gradient(135deg,#cd872a,#e4c079)", color: ESPRESSO }}
                  >
                    {assessment.stage}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(247,240,226,0.72)", fontFamily: "var(--font-devanagari), serif" }}>
                    {assessment.sanskrit}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-2 py-1 text-[11px] font-semibold"
                    style={{ background: "rgba(247,240,226,0.14)", color: CREAM }}
                  >
                    Energy {assessment.energyScore}
                  </span>
                  <span
                    className="rounded-md px-2 py-1 text-[11px] font-semibold"
                    style={{ background: "rgba(247,240,226,0.14)", color: CREAM }}
                  >
                    Recovery {assessment.recoveryScore}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold" style={{ color: CREAM }}>
                  {assessment.ritual.name}
                  <span className="ml-2 font-normal" style={{ color: "rgba(247,240,226,0.62)" }}>
                    {assessment.ritual.tagline}
                  </span>
                </p>
                <p className="mt-1 text-[11px]" style={{ color: "rgba(247,240,226,0.5)" }}>
                  Completed on {formatOrderedAt(assessment.createdAt)}
                </p>
              </div>
            </div>
            <Link
              href="/assessment"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", color: ESPRESSO }}
            >
              Retake assessment →
            </Link>
          </div>
        </div>
      ) : isLoggedIn ? (
        <Link
          href="/assessment"
          className="mb-7 sm:mb-9 flex items-center justify-between gap-4 rounded-2xl px-5 sm:px-7 py-5 transition-all hover:-translate-y-0.5"
          style={{ background: "rgba(205,135,42,0.06)", border: "1px dashed rgba(205,135,42,0.4)" }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(205,135,42,0.14)" }}
            >
              <ClipboardList size={24} color={GOLD} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
                Performance Assessment
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: ESPRESSO }}>
                Take your performance assessment
              </p>
            </div>
          </div>
          <span className="shrink-0 text-sm font-semibold" style={{ color: GOLD }}>
            Start →
          </span>
        </Link>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <section className={CARD_CLASS}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CardIcon icon={User} />
              <h2 className="font-display font-bold text-2xl sm:text-[28px] text-text-dark tracking-tight">Profile</h2>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={
                user.wellnessClub
                  ? { background: "rgba(205,135,42,0.15)", color: ESPRESSO, border: "1px solid rgba(205,135,42,0.4)" }
                  : { background: "rgba(138,115,85,0.12)", color: TAUPE, border: "1px solid rgba(138,115,85,0.28)" }
              }
            >
              {user.wellnessClub ? "Wellness Club" : "Standard"}
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
              style={{ background: "rgba(247,240,226,0.55)", border: "1px solid var(--color-border)" }}
            >
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: TAUPE }}>
                <User size={15} color={TAUPE} /> Name
              </span>
              <span className="font-semibold text-text-dark text-sm">{user.name}</span>
            </div>
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
              style={{ background: "rgba(247,240,226,0.55)", border: "1px solid var(--color-border)" }}
            >
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: TAUPE }}>
                <Mail size={15} color={TAUPE} /> Email
              </span>
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate font-semibold text-text-dark text-sm">{user.email}</span>
                <button
                  type="button"
                  onClick={() => void handleCopyEmail()}
                  aria-label="Copy email address"
                  className="shrink-0 rounded-md p-1.5 transition-colors hover:bg-gold/15"
                  style={{ color: ESPRESSO }}
                >
                  <Copy size={15} />
                </button>
              </span>
            </div>
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
              style={{ background: "rgba(247,240,226,0.55)", border: "1px solid var(--color-border)" }}
            >
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: TAUPE }}>
                <Award size={15} color={TAUPE} /> Role
              </span>
              <span className="font-semibold capitalize text-text-dark text-sm">{user.role}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-white font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: ESPRESSO, boxShadow: "0 10px 24px rgba(68,42,27,0.2)" }}
          >
            <LogOut size={17} /> Logout
          </button>
        </section>

        <section className={CARD_CLASS}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CardIcon icon={Package} />
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-[28px] text-text-dark tracking-tight">
                  Recent Orders
                </h2>
                <p className="text-text-light text-xs mt-0.5">Your latest purchase and full history anytime.</p>
              </div>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ border: "2px solid #cd872a", background: "#fff", color: ESPRESSO }}
            >
              <History size={15} /> Order history
            </Link>
          </div>

          {quickOrder ? (
            <div
              className="mt-5 rounded-xl p-4"
              style={{ border: "1px solid var(--color-border)", background: "rgba(247,240,226,0.4)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold text-text-dark">Order {quickOrder.orderNumber}</p>
                  <p className="text-text-medium text-xs mt-1">Placed {formatOrderedAt(quickOrder.createdAt)}</p>
                </div>
                <span className="font-bold text-text-dark">{formatPrice(quickOrder.total)}</span>
              </div>

              {quickOrder.items?.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  {quickOrder.items.slice(0, 4).map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.variant ?? ""}-${idx}`}
                      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream border border-border"
                    >
                      <SafeImage
                        src={item.image || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                  {quickOrder.items.length > 4 && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-[#f7f0e2] text-[11px] font-semibold text-text-medium">
                      +{quickOrder.items.length - 4}
                    </span>
                  )}
                </div>
              )}

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

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {quickOrder.tracking?.trackingUrl && quickOrder.status !== "delivered" && (
                  <a
                    href={quickOrder.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gold font-semibold hover:underline underline-offset-4"
                  >
                    <Truck size={15} /> Track shipment
                  </a>
                )}
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-1.5 text-sm text-text-dark font-medium hover:underline underline-offset-4"
                >
                  View all orders <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="mt-5 flex flex-col items-center justify-center rounded-xl px-4 py-8 text-center"
              style={{ background: "rgba(247,240,226,0.55)", border: "1px dashed rgba(138,115,85,0.35)" }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(138,115,85,0.12)" }}
              >
                <Package size={22} color={TAUPE} />
              </span>
              <p className="mt-3 font-semibold text-text-dark">No orders yet</p>
              <p className="text-sm text-text-medium mt-1">Your purchases will appear here once you shop.</p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: ESPRESSO, boxShadow: "0 8px 20px rgba(68,42,27,0.2)" }}
              >
                <ShoppingBag size={15} /> Start shopping
              </Link>
            </div>
          )}
        </section>

        <section className={`${CARD_CLASS} md:col-span-2`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <CardIcon icon={Heart} />
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-[28px] text-text-dark tracking-tight">
                  Your Items
                </h2>
                <p className="text-text-light text-xs mt-0.5">Products you saved to your wishlist.</p>
              </div>
            </div>
            {wishlistProducts.length > 0 && (
              <Link
                href="/wishlist"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ border: "2px solid #cd872a", background: "#fff", color: ESPRESSO }}
              >
                <Heart size={15} /> View wishlist
              </Link>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl px-4 py-8 text-center"
              style={{ background: "rgba(247,240,226,0.55)", border: "1px dashed rgba(138,115,85,0.35)" }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(138,115,85,0.12)" }}
              >
                <Heart size={22} color={TAUPE} />
              </span>
              <p className="mt-3 font-semibold text-text-dark">No saved items yet</p>
              <p className="text-sm text-text-medium mt-1">Tap the heart on any product to save it here.</p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: ESPRESSO, boxShadow: "0 8px 20px rgba(68,42,27,0.2)" }}
              >
                <ShoppingBag size={15} /> Explore products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {wishlistProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group rounded-xl border border-border bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(68,42,27,0.09)]"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-cream border border-border">
                    <SafeImage
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-dark line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm font-bold" style={{ color: ESPRESSO }}>
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className={CARD_CLASS}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <CardIcon icon={MapPin} />
              <h2 className="font-display font-bold text-2xl sm:text-[28px] text-text-dark tracking-tight">
                Saved Addresses
              </h2>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ background: "rgba(138,115,85,0.12)", color: TAUPE, border: "1px solid rgba(138,115,85,0.25)" }}
            >
              {addresses.length} saved
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {addresses.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center rounded-xl px-4 py-7 text-center"
                style={{ background: "rgba(247,240,226,0.55)", border: "1px dashed rgba(138,115,85,0.35)" }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "rgba(138,115,85,0.12)" }}
                >
                  <MapPin size={22} color={TAUPE} />
                </span>
                <p className="mt-3 font-semibold text-text-dark">No saved addresses yet</p>
                <p className="text-sm text-text-medium mt-1">Add your first address using the form below.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-xl border border-border bg-white p-4 shadow-[0_3px_10px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_22px_rgba(68,42,27,0.09)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "rgba(205,135,42,0.1)", border: "1px solid rgba(205,135,42,0.28)" }}
                      >
                        <MapPin size={16} color={GOLD} />
                      </span>
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
                        <p className="font-semibold text-text-dark">
                          {[address.title, address.firstName, address.lastName].filter(Boolean).join(" ")}
                        </p>
                        <p className="text-sm text-text-medium mt-1 break-words">
                          {[address.line1, address.line2, address.city, address.state, address.pincode, address.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-text-light mt-2">{address.phone}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAddress(address.id)}
                      aria-label="Delete address"
                      className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={15} /> Delete
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
              className={INPUT_CLASS}
              required
            />
            <input
              value={addressForm.lastName}
              onChange={(e) => setAddressForm((current) => ({ ...current, lastName: e.target.value }))}
              placeholder="Last Name"
              className={INPUT_CLASS}
              required
            />
            <input
              value={addressForm.phone}
              onChange={(e) => setAddressForm((current) => ({ ...current, phone: e.target.value }))}
              placeholder="Phone Number"
              className={`${INPUT_CLASS} md:col-span-2`}
              required
            />
            <input
              value={addressForm.line1}
              onChange={(e) => setAddressForm((current) => ({ ...current, line1: e.target.value }))}
              placeholder="Address line 1"
              className={`${INPUT_CLASS} md:col-span-2`}
              required
            />
            <input
              value={addressForm.city}
              onChange={(e) => setAddressForm((current) => ({ ...current, city: e.target.value }))}
              placeholder="City"
              className={INPUT_CLASS}
              required
            />
            <input
              value={addressForm.state}
              onChange={(e) => setAddressForm((current) => ({ ...current, state: e.target.value }))}
              placeholder="State"
              className={INPUT_CLASS}
              required
            />
            <input
              value={addressForm.pincode}
              onChange={(e) => setAddressForm((current) => ({ ...current, pincode: e.target.value }))}
              placeholder="Pincode"
              className={`${INPUT_CLASS} md:col-span-2`}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-white font-semibold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
              style={{ background: ESPRESSO, boxShadow: "0 10px 24px rgba(68,42,27,0.2)" }}
            >
              <Plus size={17} /> {savingAddress ? "Saving..." : "Save Address"}
            </button>
          </form>
        </section>

        <section className={CARD_CLASS}>
          <div className="flex items-center gap-3 mb-5">
            <CardIcon icon={Sparkles} />
            <h2 className="font-display font-bold text-2xl sm:text-[28px] text-text-dark tracking-tight">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
                  style={
                    action.primary
                      ? { border: "2px solid #cd872a", background: "#f8f1e3" }
                      : { border: "1px solid var(--color-border)", background: "rgba(247,240,226,0.55)" }
                  }
                >
                  <span className="flex items-center gap-3 font-medium text-text-dark">
                    <Icon size={18} color={GOLD} /> {action.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    style={{ color: TAUPE }}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 26 }}
            className="fixed bottom-5 right-4 sm:right-6 z-[70] flex items-center gap-2.5 rounded-2xl px-4 py-3"
            style={{
              background: ESPRESSO,
              color: CREAM,
              border: "1px solid rgba(205,135,42,0.55)",
              boxShadow: "0 16px 38px rgba(28,19,4,0.32)",
            }}
          >
            <CheckCircle size={18} color={GOLD} />
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
