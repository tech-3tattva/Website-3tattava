"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as api } from "@/lib/api";

type OrderItem = {
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

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const updated = await api.put<Order>(`/admin/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
      setSelected((s) => (s && s.id === id ? { ...s, status: updated.status } : s));
    } catch { /* keep previous status on failure */ }
    finally { setUpdating(null); }
  };

  /** Client-side search across order number, customer name/email/phone and product names. */
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
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
  }, [orders, query]);

  const summary = useMemo(() => {
    const paid = orders.filter((o) => o.payment?.status === "captured");
    const revenue = paid.reduce((s, o) => s + (o.total || 0), 0);
    const units = orders.reduce((s, o) => s + totalUnits(o), 0);
    const needsAction = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
    return { paidCount: paid.length, revenue, units, needsAction };
  }, [orders]);

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
        .ord-modal-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 32px 14px; overflow-y: auto; }
        .ord-modal { background: #fdfaf3; border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 720px; padding: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.28); }
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
          .ord-modal { padding: 16px; }
        }
      `}</style>

      {/* Summary cards */}
      <div className="ord-cards">
        <div className="ord-card"><p className="ord-card-l">Total orders</p><p className="ord-card-v">{total}</p></div>
        <div className="ord-card"><p className="ord-card-l">Paid orders</p><p className="ord-card-v">{summary.paidCount}</p></div>
        <div className="ord-card"><p className="ord-card-l">Revenue (paid)</p><p className="ord-card-v">{inr(summary.revenue)}</p></div>
        <div className="ord-card"><p className="ord-card-l">Units sold</p><p className="ord-card-v">{summary.units}</p></div>
        <div className="ord-card"><p className="ord-card-l">Needs action</p><p className="ord-card-v">{summary.needsAction}</p></div>
      </div>

      {/* Search + status filter */}
      <div className="ord-toolbar">
        <input
          className="ord-search"
          placeholder="Search name, order no., product, phone, city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
        <button className={`ord-chip${statusFilter === "" ? " on" : ""}`} onClick={() => { setStatusFilter(""); setPage(1); }}>All</button>
        {STATUSES.map((s) => (
          <button key={s} className={`ord-chip${statusFilter === s ? " on" : ""}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.45)", fontSize: 14 }}>Loading orders…</p>
      ) : shown.length === 0 ? (
        <div className="ord-empty">
          <p className="ord-empty-title">{query || statusFilter ? "No orders match this filter" : "No orders yet"}</p>
          <p className="ord-empty-sub">{query || statusFilter ? "Try clearing the search or status filter." : "Orders will appear here once customers start buying."}</p>
        </div>
      ) : (
        <>
          <table className="ord-table">
            <thead>
              <tr>
                <th className="ord-th">Order</th>
                <th className="ord-th">Customer</th>
                <th className="ord-th">Products</th>
                <th className="ord-th">Total</th>
                <th className="ord-th">Payment</th>
                <th className="ord-th">Date</th>
                <th className="ord-th">Status</th>
                <th className="ord-th">Update</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
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
                </div>
              </div>
              <button className="ord-x" onClick={() => setSelected(null)} aria-label="Close">×</button>
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
