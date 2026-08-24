"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as api } from "@/lib/api";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSortable, type SortDir } from "@/hooks/useSortable";
import { useFeedback } from "@/components/admin/AdminToast";
import { toCsv, downloadCsv, datedFilename } from "@/lib/csv";
import ManualOrderForm from "@/components/admin/ManualOrderForm";
import OrderEditForm from "@/components/admin/OrderEditForm";

type OrderItem = {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  mrp?: number;
  subtotal?: number;
  slug?: string;
  variant?: string;
};

type ShippingAddress = {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

type StatusEvent = { status: string; updatedBy?: string; timestamp: string };

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  gstAmount?: number;
  discountAmount?: number;
  guestEmail?: string;
  user?: string | null;
  createdAt: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  coupon?: { code?: string; discount?: number };
  payment?: {
    method?: string;
    status?: string;
    capturedAt?: string;
    provider?: string;
    cashfree?: { orderId?: string; cfPaymentId?: string };
  };
  shipment?: {
    awbNumber?: string;
    courierName?: string;
    nimbusStatus?: string;
    labelUrl?: string;
  };
  tracking?: { courierName?: string; trackingNumber?: string; trackingUrl?: string };
  statusHistory?: StatusEvent[];
  source?: string;
  isSample?: boolean;
  isTest?: boolean;
  adminNote?: string;
};

const STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLOR: Record<string, string> = {
  pending: "#c26a12",
  confirmed: "#1976d2",
  processing: "#8e24aa",
  shipped: "#0288d1",
  delivered: "#3f7a3a",
  cancelled: "#c0392b",
};

/** Payment wording aimed at a non-technical reader, not raw gateway states. */
const PAYMENT_LABEL: Record<string, string> = {
  captured: "Paid",
  pending: "Unpaid",
  failed: "Payment failed",
};

const inr = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const fullDate = (d: string) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** Customer display name, falling back through address -> email. */
function customerName(o: Order): string {
  const a = o.shippingAddress;
  const name = [a?.firstName, a?.lastName].filter(Boolean).join(" ").trim();
  if (name) return name;
  return a?.email || o.guestEmail || "Guest";
}
function customerEmail(o: Order): string {
  return o.shippingAddress?.email || o.guestEmail || "—";
}
function totalUnits(o: Order): number {
  return (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0);
}

/** Sample seeding and pre-launch tests are never sales, so they have to be
 *  separable from the real order book. */
type OrderKind = "real" | "sample" | "test";

function matchesKind(o: Order, kind: OrderKind): boolean {
  if (kind === "sample") return !!o.isSample;
  if (kind === "test") return !!o.isTest;
  return !o.isSample && !o.isTest;
}

const KIND_CHIPS: Array<{ key: "" | OrderKind; label: string }> = [
  { key: "", label: "All" },
  { key: "real", label: "Real sales" },
  { key: "sample", label: "Samples" },
  { key: "test", label: "Tests" },
];

/**
 * Sample (doctor/trainer seeding) and pre-launch test orders make up most of the
 * order book; unmarked they read as real sales, because only a ₹0 total sets
 * them apart.
 */
function KindBadge({ order }: { order: Order }) {
  if (order.isSample) return <span className="ad-badge ad-badge-mute ord-kind">SAMPLE</span>;
  if (order.isTest) return <span className="ad-badge ad-badge-warn ord-kind">TEST</span>;
  return null;
}

/** Module-level so the sort hook's memo dependency stays referentially stable. */
const ORDER_SORT: Record<string, (o: Order) => string | number | null | undefined> = {
  orderNumber: (o) => o.orderNumber,
  customer: (o) => customerName(o),
  total: (o) => o.total ?? 0,
  createdAt: (o) => new Date(o.createdAt).getTime(),
  status: (o) => o.status,
};

const ORDER_CSV_COLUMNS: Array<{ header: string; value: (o: Order) => unknown }> = [
  { header: "Order number", value: (o) => o.orderNumber },
  { header: "Date", value: (o) => new Date(o.createdAt).toISOString() },
  { header: "Customer", value: (o) => customerName(o) },
  { header: "Email", value: (o) => o.shippingAddress?.email || o.guestEmail || "" },
  { header: "Phone", value: (o) => o.shippingAddress?.phone || "" },
  { header: "City", value: (o) => o.shippingAddress?.city || "" },
  { header: "Items", value: (o) => (o.items || []).map((i) => `${i.name} x ${i.quantity}`).join("; ") },
  { header: "Subtotal", value: (o) => o.subtotal ?? "" },
  { header: "Shipping", value: (o) => o.shippingFee ?? "" },
  { header: "Total", value: (o) => o.total ?? 0 },
  { header: "Payment status", value: (o) => o.payment?.status || "" },
  { header: "Payment method", value: (o) => o.payment?.method || "" },
  { header: "Order status", value: (o) => o.status },
  { header: "Source", value: (o) => o.source || "" },
  { header: "Sample", value: (o) => (o.isSample ? "yes" : "no") },
  { header: "Test", value: (o) => (o.isTest ? "yes" : "no") },
  { header: "AWB", value: (o) => o.shipment?.awbNumber || o.tracking?.trackingNumber || "" },
  { header: "Courier", value: (o) => o.shipment?.courierName || o.tracking?.courierName || "" },
];

type HeaderProps = { "aria-sort": "ascending" | "descending" | "none"; onClick: () => void; arrow: string };

/** A plain function rather than a component, so headers are not remounted on
 *  every keystroke in the search box. */
function sortTh(label: string, hp: HeaderProps) {
  return (
    <th className="ord-th">
      <button className="ad-sort" aria-sort={hp["aria-sort"]} onClick={hp.onClick}>
        {label} <span className="ad-sort-arrow">{hp.arrow}</span>
      </button>
    </th>
  );
}

/** Phones get no table header to click, so the same sort keys are offered as a
 *  picker with the direction spelled out. Values are `<sort key>:<direction>`. */
const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Newest first (default)" },
  { value: "createdAt:desc", label: "Date, newest first" },
  { value: "createdAt:asc", label: "Date, oldest first" },
  { value: "total:desc", label: "Total, high to low" },
  { value: "total:asc", label: "Total, low to high" },
  { value: "customer:asc", label: "Customer, A–Z" },
  { value: "customer:desc", label: "Customer, Z–A" },
  { value: "orderNumber:desc", label: "Order no., high to low" },
  { value: "orderNumber:asc", label: "Order no., low to high" },
  { value: "status:asc", label: "Status, A–Z" },
  { value: "status:desc", label: "Status, Z–A" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [kindFilter, setKindFilter] = useState<"" | OrderKind>("");
  const { toast, confirm } = useFeedback();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "50" });
      if (statusFilter) qs.set("status", statusFilter);
      const d = await api.get<{ orders: Order[]; total: number; totalPages: number }>(`/admin/orders?${qs}`);
      setOrders(d.orders || []);
      setTotal(d.total ?? 0);
      setTotalPages(d.totalPages ?? 1);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { void load(); }, [load]);

  // ManualOrderForm locks scrolling itself, so only the detail card is handled
  // here — locking twice leaves the page stuck when the inner one unmounts.
  useScrollLock(!!selected);

  const applyStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const order = orders.find((o) => o.id === id) ?? (selected?.id === id ? selected : undefined);
    const label = order?.orderNumber || "This order";
    const previous = order?.status;

    // Locked before awaiting confirmation: the re-render puts the dropdown back
    // on the stored status, so declining leaves no stale choice on screen, and a
    // second change cannot race the first.
    setUpdating(id);
    try {
      if (status === "cancelled") {
        const ok = await confirm({
          title: `Cancel order ${label}?`,
          body: "Cancelling is not reversible from this panel — the order would have to be recorded again by hand.",
          confirmLabel: "Cancel this order",
          danger: true,
        });
        if (!ok) return;
      }

      // Applied up front so the dropdown and the status column agree while the
      // write is in flight, then rolled back if the server refuses it.
      applyStatus(id, status);
      const updated = await api.put<Order>(`/admin/orders/${id}/status`, { status });
      applyStatus(id, updated.status);
      toast("ok", `${label} is now ${updated.status}.`);
    } catch (e) {
      if (previous) applyStatus(id, previous);
      toast("error", `${label} could not be updated: ${e instanceof Error ? e.message : "the change was not saved."}`);
    } finally {
      setUpdating(null);
    }
  };

  /** Client-side search across order number, customer name/email/phone and
   *  product names, narrowed first by the sample/test split. */
  const shown = useMemo(() => {
    const base = kindFilter ? orders.filter((o) => matchesKind(o, kindFilter)) : orders;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((o) => {
      const hay = [
        o.orderNumber,
        customerName(o),
        customerEmail(o),
        o.shippingAddress?.phone,
        o.shippingAddress?.city,
        ...(o.items || []).map((i) => i.name),
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [orders, query, kindFilter]);

  const { sorted, sort, toggle, headerProps } = useSortable(shown, ORDER_SORT);

  /**
   * Drives the one sort state the headers use. The hook exposes a cycling
   * toggle rather than a setter, so the picker replays toggles until the state
   * matches the chosen option — switching back to a wide screen then shows the
   * matching header arrow instead of a second, disagreeing control.
   */
  const selectSort = (value: string) => {
    if (!value) {
      if (!sort) return;
      toggle(sort.key);
      if (sort.dir === "desc") toggle(sort.key); // desc -> asc -> unsorted
      return;
    }
    const [key, dir] = value.split(":") as [string, SortDir];
    if (sort?.key === key && sort.dir === dir) return;
    if (sort?.key !== key) {
      toggle(key); // a fresh key always lands on desc
      if (dir === "asc") toggle(key);
      return;
    }
    toggle(key); // desc -> asc
    if (dir === "desc") toggle(key); // asc -> unsorted -> desc
  };

  const summary = useMemo(() => {
    const paid = orders.filter((o) => o.payment?.status === "captured");
    // Seeded samples and pre-launch tests are not sales, and a cancelled order
    // is not money kept — neither may reach the revenue figure.
    const revenue = paid
      .filter((o) => !o.isSample && !o.isTest && o.status !== "cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    const units = orders.reduce((s, o) => s + totalUnits(o), 0);
    const needsAction = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
    return { paidCount: paid.length, revenue, units, needsAction };
  }, [orders]);

  const exportCsv = () => {
    if (!sorted.length) {
      toast("info", "There is nothing to export with the current filters.");
      return;
    }
    downloadCsv(datedFilename("orders"), toCsv(sorted, ORDER_CSV_COLUMNS));
    toast("ok", `Exported ${sorted.length} order${sorted.length === 1 ? "" : "s"}.`);
  };

  return (
    <>
      <style>{`
        .ord-cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .ord-card { flex: 1 1 150px; background: #fff; border: 1px solid rgba(200,150,62,0.18); border-radius: 6px; padding: 14px 16px; }
        .ord-card-l { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(68,42,27,0.55); margin-bottom: 5px; }
        .ord-card-v { font-size: 21px; font-weight: 700; color: #442a1b; line-height: 1.1; }

        .ord-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
        .ord-search { flex: 1 1 240px; min-width: 200px; background: #fff; border: 1px solid rgba(200,150,62,0.28); border-radius: 4px; padding: 10px 12px; font-size: 14px; color: #442a1b; outline: none; font-family: inherit; }
        .ord-search:focus { border-color: #C8963E; }
        .ord-chip { font-size: 12px; padding: 8px 13px; border-radius: 4px; cursor: pointer; background: transparent; color: rgba(68,42,27,0.7); border: 1px solid rgba(200,150,62,0.28); text-transform: capitalize; font-family: inherit; }
        .ord-chip.on { background: rgba(200,150,62,0.16); color: #8a5a10; border-color: rgba(200,150,62,0.5); font-weight: 600; }
        .ord-chip-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(68,42,27,0.45); margin-left: 6px; }
        .ord-kind { margin-left: 7px; vertical-align: middle; }
        /* Header clicks are the desktop affordance; the picker only exists where
           the header row is hidden, so the two never compete. */
        .ord-sortbar { display: none; }
        .ord-sortbar-l { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(68,42,27,0.45); flex-shrink: 0; }

        .ord-table { width: 100%; border-collapse: collapse; }
        .ord-th { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(68,42,27,0.55); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(200,150,62,0.18); font-weight: 500; white-space: nowrap; }
        .ord-td { padding: 13px 14px; border-bottom: 1px solid rgba(68,42,27,0.06); font-size: 13.5px; color: rgba(68,42,27,0.82); vertical-align: middle; }
        .ord-tr { cursor: pointer; }
        .ord-tr:hover .ord-td { background: rgba(200,150,62,0.05); }
        .ord-num { font-size: 14px; color: #442a1b; font-weight: 600; }
        .ord-sub { font-size: 12px; color: rgba(68,42,27,0.5); }
        .ord-name { font-size: 14px; color: #442a1b; font-weight: 500; }
        .ord-items { font-size: 12.5px; color: rgba(68,42,27,0.75); line-height: 1.45; }
        .ord-money { font-size: 14px; color: #442a1b; font-weight: 600; white-space: nowrap; }
        .ord-status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 7px; vertical-align: middle; }
        .ord-badge { display: inline-block; font-size: 11px; padding: 3px 8px; border-radius: 3px; letter-spacing: 0.04em; }
        .ord-badge-paid { background: rgba(46,125,50,0.12); color: #2e7d32; }
        .ord-badge-unpaid { background: rgba(68,42,27,0.08); color: rgba(68,42,27,0.6); }
        .ord-select { background: #fff; border: 1px solid rgba(200,150,62,0.3); color: #442a1b; font-family: inherit; font-size: 12.5px; padding: 7px 9px; outline: none; cursor: pointer; border-radius: 3px; }
        .ord-select:focus { border-color: #C8963E; }

        .ord-empty { text-align: center; padding: 60px 0; }
        .ord-empty-title { font-size: 20px; color: rgba(68,42,27,0.45); }
        .ord-empty-sub { font-size: 13.5px; color: rgba(68,42,27,0.35); margin-top: 6px; }

        .ord-pager { display: flex; gap: 10px; align-items: center; justify-content: flex-end; margin-top: 16px; font-size: 13px; color: rgba(68,42,27,0.7); }
        .ord-pager button { font-family: inherit; font-size: 13px; padding: 7px 13px; border-radius: 4px; border: 1px solid rgba(200,150,62,0.3); background: #fff; color: #442a1b; cursor: pointer; }
        .ord-pager button:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Detail modal ── */
        .ord-modal-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 20px 14px; overflow-y: auto; overscroll-behavior: contain; }
        /* Scroll inside the card, and stop the gesture reaching the dashboard. */
        .ord-modal { background: #fdfaf3; border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 720px; padding: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.28); max-height: calc(100vh - 40px); overflow-y: auto; overscroll-behavior: contain; }
        .ord-modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .ord-modal-title { font-size: 20px; font-weight: 700; color: #442a1b; margin: 0; }
        .ord-x { border: none; background: transparent; font-size: 26px; line-height: 1; color: rgba(68,42,27,0.45); cursor: pointer; padding: 0 4px; }
        .ord-sec { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(68,42,27,0.5); margin: 18px 0 8px; font-weight: 600; }
        .ord-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .ord-kv { background: #fff; border: 1px solid rgba(200,150,62,0.14); border-radius: 5px; padding: 9px 11px; }
        .ord-k { font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.45); }
        .ord-v { font-size: 13.5px; color: #442a1b; margin-top: 3px; word-break: break-word; }
        .ord-line { display: flex; justify-content: space-between; gap: 12px; font-size: 13.5px; padding: 7px 0; border-bottom: 1px solid rgba(68,42,27,0.06); }
        .ord-line:last-child { border-bottom: none; }
        .ord-line-strong { font-weight: 700; color: #442a1b; font-size: 15px; }
        .ord-tl { display: flex; flex-direction: column; gap: 8px; }
        .ord-tl-row { display: flex; gap: 10px; align-items: baseline; font-size: 13px; color: rgba(68,42,27,0.8); }

        /* ── Mobile: table becomes stacked cards ── */
        @media (max-width: 900px) {
          .ord-table thead { display: none; }
          .ord-table, .ord-table tbody, .ord-table tr { display: block; width: 100%; }
          .ord-tr { background: #fff; border: 1px solid rgba(200,150,62,0.2); border-radius: 8px; margin-bottom: 12px; padding: 6px 4px; }
          /* must out-specify the .ord-table td rule or display:block wins and the label/value row collapses */
          .ord-table td.ord-td { width: 100%; border-bottom: 1px solid rgba(68,42,27,0.05); padding: 10px 12px; display: flex; justify-content: space-between; gap: 16px; align-items: baseline; text-align: right; }
          .ord-table td.ord-td:last-child { border-bottom: none; }
          .ord-table td.ord-td::before { content: attr(data-label); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.55); text-align: left; flex-shrink: 0; min-width: 68px; }
          .ord-items { text-align: right; }
          /* On a phone the chips wrap; a full-width label stops "Type" being
             stranded at the end of the status row, away from its own chips. */
          .ord-chip-label { flex-basis: 100%; margin-left: 0; }
          .ord-sortbar { display: flex; align-items: center; gap: 10px; margin: -4px 0 16px; }
          .ord-sortbar select { flex: 1 1 auto; min-width: 0; }
          .ord-modal { padding: 16px; }
        }
      `}</style>

      {/* Summary cards */}
      <div className="ord-cards">
        <div className="ord-card"><p className="ord-card-l">Total orders</p><p className="ord-card-v">{total}</p></div>
        <div className="ord-card"><p className="ord-card-l">Paid orders</p><p className="ord-card-v">{summary.paidCount}</p></div>
        <div className="ord-card"><p className="ord-card-l">Revenue (real sales)</p><p className="ord-card-v">{inr(summary.revenue)}</p></div>
        <div className="ord-card"><p className="ord-card-l">Units sold</p><p className="ord-card-v">{summary.units}</p></div>
        <div className="ord-card"><p className="ord-card-l">Needs action</p><p className="ord-card-v">{summary.needsAction}</p></div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <button
          onClick={() => setShowManual(true)}
          style={{
            padding: "11px 20px", borderRadius: 6, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#C8963E,#b8801f)", color: "#1c1304",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
          }}
        >
          + Record offline order
        </button>
        <span style={{ fontSize: 12.5, color: "rgba(68,42,27,0.55)", marginLeft: 12 }}>
          Phone, WhatsApp, in-person or doctor sampling — never key these into the courier panel.
        </span>
      </div>

      {showManual && (
        <ManualOrderForm onClose={() => setShowManual(false)} onCreated={load} />
      )}

      {editing && (
        <OrderEditForm
          order={{
            id: editing.id,
            orderNumber: editing.orderNumber,
            status: editing.status,
            shippingAddress: editing.shippingAddress,
            items: (editing.items ?? []).map((i) => ({
              productId: i.productId ?? "",
              name: i.name,
              quantity: i.quantity,
            })),
            adminNote: editing.adminNote,
          }}
          onClose={() => setEditing(null)}
          onSaved={() => {
            // The card behind the form still holds the old values.
            setSelected(null);
            void load();
          }}
        />
      )}

      {/* Search + status/type filters + export */}
      <div className="ord-toolbar">
        <input
          className="ord-search"
          placeholder="Search name, order no., product, phone, city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
        <button className="ad-btn ad-btn-sm" onClick={exportCsv}>Export CSV</button>
        <button className={`ord-chip${statusFilter === "" ? " on" : ""}`} onClick={() => { setStatusFilter(""); setPage(1); }}>All</button>
        {STATUSES.map((s) => (
          <button key={s} className={`ord-chip${statusFilter === s ? " on" : ""}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
        ))}
        <span className="ord-chip-label">Type</span>
        {KIND_CHIPS.map((c) => (
          <button
            key={c.key || "all"}
            className={`ord-chip${kindFilter === c.key ? " on" : ""}`}
            onClick={() => { setKindFilter(c.key); setPage(1); }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Phone-only: the stacked cards have no header row to click. */}
      <div className="ord-sortbar">
        <label className="ord-sortbar-l" htmlFor="ord-sort-by">Sort by</label>
        <select
          id="ord-sort-by"
          className="ad-input"
          value={sort ? `${sort.key}:${sort.dir}` : ""}
          onChange={(e) => selectSort(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value || "default"} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.45)", fontSize: 14 }}>Loading orders…</p>
      ) : shown.length === 0 ? (
        <div className="ord-empty">
          <p className="ord-empty-title">{query || statusFilter || kindFilter ? "No orders match this filter" : "No orders yet"}</p>
          <p className="ord-empty-sub">{query || statusFilter || kindFilter ? "Try clearing the search, status or type filter." : "Orders will appear here once customers start buying."}</p>
        </div>
      ) : (
        <>
          <table className="ord-table">
            <thead>
              <tr>
                {sortTh("Order", headerProps("orderNumber"))}
                {sortTh("Customer", headerProps("customer"))}
                <th className="ord-th">Products</th>
                {sortTh("Total", headerProps("total"))}
                <th className="ord-th">Payment</th>
                {sortTh("Date", headerProps("createdAt"))}
                {sortTh("Status", headerProps("status"))}
                <th className="ord-th">Update</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr
                  key={o.id}
                  className="ord-tr"
                  onClick={() => setSelected(o)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelected(o); }}
                >
                  <td className="ord-td" data-label="Order">
                    <span>
                      <span className="ord-num">{o.orderNumber}</span>
                      <KindBadge order={o} />
                      <br /><span className="ord-sub">{totalUnits(o)} item{totalUnits(o) === 1 ? "" : "s"}</span>
                    </span>
                  </td>
                  <td className="ord-td" data-label="Customer">
                    <span>
                      <span className="ord-name">{customerName(o)}</span>
                      <br /><span className="ord-sub">{customerEmail(o)}</span>
                    </span>
                  </td>
                  <td className="ord-td" data-label="Products">
                    <span className="ord-items">{(o.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}</span>
                  </td>
                  <td className="ord-td" data-label="Total"><span className="ord-money">{inr(o.total)}</span></td>
                  <td className="ord-td" data-label="Payment">
                    <span className={`ord-badge ${o.payment?.status === "captured" ? "ord-badge-paid" : "ord-badge-unpaid"}`}>{PAYMENT_LABEL[o.payment?.status ?? ""] ?? "Unpaid"}</span>
                  </td>
                  <td className="ord-td" data-label="Date">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                  <td className="ord-td" data-label="Status">
                    <span>
                      <span className="ord-status-dot" style={{ background: STATUS_COLOR[o.status] || "#888" }} />
                      <span style={{ textTransform: "capitalize" }}>{o.status}</span>
                    </span>
                  </td>
                  <td className="ord-td" data-label="Update">
                    {/* stopPropagation so changing status never opens the detail card */}
                    <select
                      className="ord-select"
                      value={o.status}
                      disabled={updating === o.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); updateStatus(o.id, e.target.value as OrderStatus); }}
                      aria-label={`Update status for ${o.orderNumber}`}
                    >
                      {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ord-pager">
            <span>Page {page} of {totalPages} · {total} orders</span>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next →</button>
          </div>
        </>
      )}

      {/* ── Order detail card ── */}
      {selected && (
        <div className="ord-modal-wrap" onClick={() => setSelected(null)}>
          <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ord-modal-head">
              <div>
                <h3 className="ord-modal-title">{selected.orderNumber}</h3>
                <p style={{ fontSize: 13, color: "rgba(68,42,27,0.6)", marginTop: 3 }}>{fullDate(selected.createdAt)}</p>
                <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                  <span className="ord-badge" style={{ background: "rgba(200,150,62,0.14)", color: "#8a5a10" }}>Order: <span style={{ textTransform: "capitalize" }}>{selected.status}</span></span>
                  <span className={`ord-badge ${selected.payment?.status === "captured" ? "ord-badge-paid" : "ord-badge-unpaid"}`}>{PAYMENT_LABEL[selected.payment?.status ?? ""] ?? "Payment: unpaid"}</span>
                  {selected.payment?.method && <span className="ord-badge ord-badge-unpaid">{selected.payment.method}</span>}
                  <KindBadge order={selected} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button
                  className="ad-btn ad-btn-sm"
                  onClick={() => setEditing(selected)}
                  disabled={selected.status === "delivered" || selected.status === "cancelled"}
                  title={
                    selected.status === "delivered" || selected.status === "cancelled"
                      ? `A ${selected.status} order cannot be edited — its stock and courier record are settled.`
                      : "Correct the address or quantities"
                  }
                >
                  Edit
                </button>
                <button className="ord-x" onClick={() => setSelected(null)} aria-label="Close">×</button>
              </div>
            </div>

            <p className="ord-sec">Customer</p>
            <div className="ord-grid">
              <div className="ord-kv"><p className="ord-k">Name</p><p className="ord-v">{customerName(selected)}</p></div>
              <div className="ord-kv"><p className="ord-k">Email</p><p className="ord-v">{customerEmail(selected)}</p></div>
              <div className="ord-kv"><p className="ord-k">Phone</p><p className="ord-v">{selected.shippingAddress?.phone || "—"}</p></div>
              <div className="ord-kv"><p className="ord-k">Account</p><p className="ord-v">{selected.user ? "Registered" : "Guest"}</p></div>
            </div>

            {selected.shippingAddress && (
              <>
                <p className="ord-sec">Delivery address</p>
                <div className="ord-kv">
                  <p className="ord-v">
                    {[selected.shippingAddress.line1, selected.shippingAddress.line2].filter(Boolean).join(", ")}<br />
                    {[selected.shippingAddress.city, selected.shippingAddress.state, selected.shippingAddress.pincode].filter(Boolean).join(", ")}<br />
                    {selected.shippingAddress.country || "India"}
                  </p>
                </div>
              </>
            )}

            <p className="ord-sec">Products ordered</p>
            <div style={{ background: "#fff", border: "1px solid rgba(200,150,62,0.14)", borderRadius: 6, padding: "10px 13px" }}>
              {(selected.items || []).map((it, i) => (
                <div key={i} className="ord-line">
                  <span>{it.name} {it.variant ? `(${it.variant})` : ""} <strong>× {it.quantity}</strong></span>
                  <span>{inr(it.subtotal ?? it.price * it.quantity)}</span>
                </div>
              ))}
              {!(selected.items || []).length && <p style={{ fontSize: 13, color: "rgba(68,42,27,0.4)" }}>No line items recorded.</p>}
            </div>

            <p className="ord-sec">Amount</p>
            <div style={{ background: "#fff", border: "1px solid rgba(200,150,62,0.14)", borderRadius: 6, padding: "10px 13px" }}>
              <div className="ord-line"><span>Subtotal</span><span>{inr(selected.subtotal)}</span></div>
              {!!selected.shippingFee && <div className="ord-line"><span>Shipping</span><span>{inr(selected.shippingFee)}</span></div>}
              {!!selected.gstAmount && <div className="ord-line"><span>GST</span><span>{inr(selected.gstAmount)}</span></div>}
              {!!selected.discountAmount && (
                <div className="ord-line">
                  <span>Discount {selected.coupon?.code ? `(${selected.coupon.code})` : ""}</span>
                  <span>− {inr(selected.discountAmount)}</span>
                </div>
              )}
              <div className="ord-line ord-line-strong"><span>Total paid</span><span>{inr(selected.total)}</span></div>
            </div>

            {(selected.shipment?.awbNumber || selected.shipment?.courierName || selected.tracking?.trackingNumber) && (
              <>
                <p className="ord-sec">Shipment</p>
                <div className="ord-grid">
                  <div className="ord-kv"><p className="ord-k">Courier</p><p className="ord-v">{selected.shipment?.courierName || selected.tracking?.courierName || "—"}</p></div>
                  <div className="ord-kv"><p className="ord-k">AWB</p><p className="ord-v">{selected.shipment?.awbNumber || selected.tracking?.trackingNumber || "—"}</p></div>
                  <div className="ord-kv"><p className="ord-k">Courier status</p><p className="ord-v">{selected.shipment?.nimbusStatus || "—"}</p></div>
                </div>
              </>
            )}

            {!!(selected.statusHistory || []).length && (
              <>
                <p className="ord-sec">History</p>
                <div className="ord-tl">
                  {(selected.statusHistory || []).map((h, i) => (
                    <div key={i} className="ord-tl-row">
                      <span className="ord-status-dot" style={{ background: STATUS_COLOR[h.status] || "#888" }} />
                      <span style={{ textTransform: "capitalize", minWidth: 84, fontWeight: 600, color: "#442a1b" }}>{h.status}</span>
                      <span style={{ color: "rgba(68,42,27,0.6)" }}>{fullDate(h.timestamp)}</span>
                      <span style={{ color: "rgba(68,42,27,0.45)", fontSize: 12 }}>{h.updatedBy || ""}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="ord-sec">Change status</p>
            <select
              className="ord-select"
              value={selected.status}
              disabled={updating === selected.id}
              onChange={(e) => updateStatus(selected.id, e.target.value as OrderStatus)}
              style={{ fontSize: 14, padding: "9px 12px" }}
              aria-label="Change order status"
            >
              {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>
      )}
    </>
  );
}
