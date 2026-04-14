// ─────────────────────────────────────────────────────────
// 3Tattva — Shared Type Definitions
// API contract between frontend and backend.
// Backend implements exactly these shapes.
// Frontend reads exactly these shapes.
// Do NOT rename any field without updating both sides.
// ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  mrp?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  badge?: "Best Seller" | "New" | "20% Off";
  dosha?: ("Vata" | "Pitta" | "Kapha")[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured?: boolean;
  shortDescription?: string;
  description?: string;
  ingredients?: Ingredient[];
  howToUse?: string[];
  faqs?: { question: string; answer: string }[];
  vataPct?: number;
  pittaPct?: number;
  kaphaPct?: number;
}

export interface Ingredient {
  name: string;
  sanskritName?: string;
  benefit: string;
  sourceRegion?: string;
  iconUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  imageUrl?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "superadmin";
  wellnessPoints?: number;
  wellnessClub?: boolean;
  doshaProfile?: {
    primaryDosha: "Vata" | "Pitta" | "Kapha";
    scores: { vata: number; pitta: number; kapha: number };
    takenAt: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CartItemAPI {
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  slug: string;
  variant?: string;
}

export interface ServerCart {
  items: CartItemAPI[];
  coupon: { code: string; discount: number } | null;
}

export interface Address {
  id: string;
  title?: "Mr." | "Mrs." | "Ms." | "Dr.";
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  label?: "Home" | "Work" | "Other";
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  items: CartItemAPI[];
  shippingAddress: Omit<Address, "id" | "isDefault" | "label">;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  coupon?: { code: string; discount: number };
  payment: {
    status: "pending" | "captured" | "failed";
    method?: string;
    capturedAt?: string;
  };
  tracking?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  };
  createdAt: string;
  updatedAt?: string;
  /** Admin / system updates — use `delivered` entry timestamp for “delivered on” when present */
  statusHistory?: Array<{
    status:
      | "pending"
      | "confirmed"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled";
    timestamp?: string;
    note?: string;
    updatedBy?: string;
  }>;
}

/** GET /lab-reports/by-badge/:badge (public) */
/** POST /delivery/check (public) */
export interface DeliveryCheckResponse {
  serviceable: boolean;
  pincode: string;
  zoneLabel?: string;
  etaDays?: number;
  message?: string;
}

export interface LabReportLookupResponse {
  badgeNumber: string;
  productName: string;
  slug: string;
  reportUrl: string | null;
  summary: string | null;
  batchCode: string | null;
  testedAt: string | null;
}

export interface Review {
  id: string;
  productId: string;
  user: { id: string; name: string };
  rating: number;
  title?: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface CouponValidateResponse {
  valid: boolean;
  discount: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
