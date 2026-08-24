"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as api } from "@/lib/api";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  authMethod: "google" | "email" | "otp";
  isVerified: boolean;
  wellnessPoints: number;
  lastLogin: string | null;
  createdAt: string;
  orderCount: number;
  paidOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

type UserOrderItem = { name: string; quantity: number; price: number; subtotal: number };
type UserOrder = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  items: UserOrderItem[];
};
type UserDetail = {
  user: AdminUser;
  orders: UserOrder[];
  summary: { orderCount: number; paidOrders: number; totalSpent: number };
};
type UsersSummary = { registered: number; purchasers: number; totalRevenue: number };

const inr = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const dayMonth = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—";

export default function AdminCustomers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buyers" | "google" | "email">("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get<{ users: AdminUser[]; total: number; summary?: UsersSummary }>("/admin/users");
      setUsers(d.users || []);
      setTotal(d.total ?? 0);
      setSummary(d.summary ?? null);
    } catch { setUsers([]); }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function openDetail(id: string) {
    setDetailLoading(true);
    setDetail(null);
    try {
      setDetail(await api.get<UserDetail>(`/admin/users/${id}`));
    } catch { setDetail(null); }
    setDetailLoading(false);
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === "buyers" && u.paidOrders < 1) return false;
      if (filter === "google" && u.authMethod !== "google") return false;
      if (filter === "email" && u.authMethod !== "email") return false;
      if (!q) return true;
      return [u.name, u.email, u.phone].filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [users, filter, query]);

  /** Per-customer buying insights derived from their order history. */
  const insights = useMemo(() => {
    if (!detail) return null;
    const paid = detail.orders.filter((o) => o.paymentStatus === "captured");
    const byProduct = new Map<string, { qty: number; amount: number }>();
    for (const o of paid) {
      for (const it of o.items) {
        const cur = byProduct.get(it.name) || { qty: 0, amount: 0 };
        cur.qty += it.quantity;
        cur.amount += it.subtotal ?? it.price * it.quantity;
        byProduct.set(it.name, cur);
      }
    }
    const products = Array.from(byProduct.entries()).sort((a, b) => b[1].qty - a[1].qty);
    const dates = detail.orders.map((o) => new Date(o.date).getTime()).sort((a, b) => a - b);
    return {
      products,
      units: products.reduce((s, [, v]) => s + v.qty, 0),
      aov: paid.length ? Math.round(detail.summary.totalSpent / paid.length) : 0,
      firstOrder: dates.length ? new Date(dates[0]).toISOString() : null,
      lastOrder: dates.length ? new Date(dates[dates.length - 1]).toISOString() : null,
    };
  }, [detail]);

  const cards: [string, string][] = [
    ["Registered customers", (summary?.registered ?? total).toLocaleString("en-IN")],
    ["Have purchased", (summary?.purchasers ?? 0).toLocaleString("en-IN")],
    ["Total revenue", inr(summary?.totalRevenue ?? 0)],
    ["Yet to buy", Math.max(0, (summary?.registered ?? total) - (summary?.purchasers ?? 0)).toLocaleString("en-IN")],
  ];

  return (
    <>
      <style>{`
        .cus-cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .cus-card { flex: 1 1 160px; background: #fff; border: 1px solid rgba(200,150,62,0.18); border-radius: 6px; padding: 14px 16px; }
        .cus-card-l { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(68,42,27,0.55); margin-bottom: 5px; }
        .cus-card-v { font-size: 21px; font-weight: 700; color: #442a1b; line-height: 1.1; }

        .cus-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
        .cus-search { flex: 1 1 240px; min-width: 200px; background: #fff; border: 1px solid rgba(200,150,62,0.28); border-radius: 4px; padding: 10px 12px; font-size: 14px; color: #442a1b; outline: none; font-family: inherit; }
        .cus-search:focus { border-color: #C8963E; }
        .cus-chip { font-size: 12px; padding: 8px 13px; border-radius: 4px; cursor: pointer; background: transparent; color: rgba(68,42,27,0.7); border: 1px solid rgba(200,150,62,0.28); font-family: inherit; }
        .cus-chip.on { background: rgba(200,150,62,0.16); color: #8a5a10; border-color: rgba(200,150,62,0.5); font-weight: 600; }

        .cus-table { width: 100%; border-collapse: collapse; }
        .cus-th { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(68,42,27,0.55); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(200,150,62,0.18); font-weight: 500; white-space: nowrap; }
        .cus-td { padding: 13px 14px; border-bottom: 1px solid rgba(68,42,27,0.06); font-size: 13.5px; color: rgba(68,42,27,0.82); }
        .cus-tr { cursor: pointer; }
        .cus-tr:hover .cus-td { background: rgba(200,150,62,0.05); }
        .cus-name { font-size: 14px; color: #442a1b; font-weight: 500; }
        .cus-sub { font-size: 12px; color: rgba(68,42,27,0.5); }
        .cus-badge { display: inline-block; font-size: 11px; padding: 3px 8px; border-radius: 3px; letter-spacing: 0.04em; }
        .cus-spent { font-weight: 600; color: #2e7d32; white-space: nowrap; }
        .cus-empty { text-align: center; padding: 56px 0; color: rgba(68,42,27,0.45); font-size: 14px; }

        .cus-modal-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 32px 14px; overflow-y: auto; }
        .cus-modal { background: #fdfaf3; border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 700px; padding: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.28); }
        .cus-x { border: none; background: transparent; font-size: 26px; line-height: 1; color: rgba(68,42,27,0.45); cursor: pointer; padding: 0 4px; }
        .cus-sec { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(68,42,27,0.5); margin: 18px 0 8px; font-weight: 600; }
        .cus-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
        .cus-kv { background: #fff; border: 1px solid rgba(200,150,62,0.14); border-radius: 5px; padding: 9px 11px; }
        .cus-k { font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.45); }
        .cus-v { font-size: 13.5px; color: #442a1b; margin-top: 3px; word-break: break-word; }
        .cus-stat { flex: 1 1 130px; border-radius: 6px; padding: 11px 14px; }
        .cus-line { display: flex; justify-content: space-between; gap: 12px; font-size: 13.5px; padding: 7px 0; border-bottom: 1px solid rgba(68,42,27,0.06); }
        .cus-line:last-child { border-bottom: none; }
        .cus-order { background: #fff; border: 1px solid rgba(200,150,62,0.14); border-radius: 6px; padding: 12px 14px; }

        @media (max-width: 900px) {
          .cus-table thead { display: none; }
          .cus-table, .cus-table tbody, .cus-table tr { display: block; width: 100%; }
          .cus-tr { background: #fff; border: 1px solid rgba(200,150,62,0.2); border-radius: 8px; margin-bottom: 12px; padding: 6px 4px; }
          .cus-table td.cus-td { width: 100%; display: flex; justify-content: space-between; gap: 16px; align-items: baseline; text-align: right; padding: 10px 12px; }
          .cus-table td.cus-td:last-child { border-bottom: none; }
          .cus-table td.cus-td::before { content: attr(data-label); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.55); text-align: left; flex-shrink: 0; min-width: 74px; }
          .cus-modal { padding: 16px; }
        }
      `}</style>

      <div className="cus-cards">
        {cards.map(([label, value]) => (
          <div key={label} className="cus-card">
            <p className="cus-card-l">{label}</p>
            <p className="cus-card-v">{value}</p>
          </div>
        ))}
      </div>

      <div className="cus-toolbar">
        <input
          className="cus-search"
          placeholder="Search name, email or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search customers"
        />
        {([["all", "All"], ["buyers", "Has purchased"], ["google", "Google"], ["email", "Email/Password"]] as const).map(([k, label]) => (
          <button key={k} className={`cus-chip${filter === k ? " on" : ""}`} onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.45)", fontSize: 14 }}>Loading customers…</p>
      ) : shown.length === 0 ? (
        <p className="cus-empty">No customers match this filter.</p>
      ) : (
        <table className="cus-table">
          <thead>
            <tr>
              {["Customer", "Phone", "Sign-in", "Orders", "Spent", "Last order", "Joined", ""].map((h) => (
                <th key={h} className="cus-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr
                key={u.id}
                className="cus-tr"
                onClick={() => openDetail(u.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") openDetail(u.id); }}
              >
                <td className="cus-td" data-label="Customer">
                  <span>
                    <span className="cus-name">{u.name || "—"}</span>
                    <br /><span className="cus-sub">{u.email}</span>
                  </span>
                </td>
                <td className="cus-td" data-label="Phone">{u.phone || "—"}</td>
                <td className="cus-td" data-label="Sign-in">
                  <span className="cus-badge" style={{
                    background: u.authMethod === "google" ? "rgba(66,133,244,0.14)" : "rgba(200,150,62,0.12)",
                    color: u.authMethod === "google" ? "#1565c0" : "#8a5a10",
                  }}>{u.authMethod}</span>
                </td>
                <td className="cus-td" data-label="Orders">{u.orderCount}{u.paidOrders ? ` (${u.paidOrders} paid)` : ""}</td>
                <td className="cus-td" data-label="Spent">
                  {u.totalSpent ? <span className="cus-spent">{inr(u.totalSpent)}</span> : <span style={{ color: "rgba(68,42,27,0.35)" }}>—</span>}
                </td>
                <td className="cus-td" data-label="Last order">{dayMonth(u.lastOrderAt)}</td>
                <td className="cus-td" data-label="Joined">{dayMonth(u.createdAt)}</td>
                <td className="cus-td" data-label="" style={{ color: "#C8963E", fontSize: 12 }}>View →</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(detail || detailLoading) && (
        <div className="cus-modal-wrap" onClick={() => { setDetail(null); setDetailLoading(false); }}>
          <div className="cus-modal" onClick={(e) => e.stopPropagation()}>
            {detailLoading || !detail || !insights ? (
              <p style={{ color: "rgba(68,42,27,0.45)", fontSize: 14 }}>Loading customer…</p>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#442a1b", margin: 0 }}>{detail.user.name || "Customer"}</h3>
                    <p style={{ fontSize: 13.5, color: "rgba(68,42,27,0.62)", marginTop: 3 }}>{detail.user.email}</p>
                  </div>
                  <button className="cus-x" onClick={() => setDetail(null)} aria-label="Close">×</button>
                </div>

                {/* headline purchase stats */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div className="cus-stat" style={{ background: "rgba(200,150,62,0.1)" }}>
                    <p className="cus-k">Total purchases</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#442a1b" }}>{detail.summary.orderCount}{detail.summary.paidOrders ? ` · ${detail.summary.paidOrders} paid` : ""}</p>
                  </div>
                  <div className="cus-stat" style={{ background: "rgba(46,125,50,0.1)" }}>
                    <p className="cus-k">Total spent</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#2e7d32" }}>{inr(detail.summary.totalSpent)}</p>
                  </div>
                  <div className="cus-stat" style={{ background: "rgba(68,42,27,0.06)" }}>
                    <p className="cus-k">Avg order value</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#442a1b" }}>{inr(insights.aov)}</p>
                  </div>
                  <div className="cus-stat" style={{ background: "rgba(68,42,27,0.06)" }}>
                    <p className="cus-k">Units bought</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#442a1b" }}>{insights.units}</p>
                  </div>
                </div>

                <p className="cus-sec">Products bought (paid orders)</p>
                {insights.products.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: "rgba(68,42,27,0.45)" }}>No paid purchases yet.</p>
                ) : (
                  <div style={{ background: "#fff", border: "1px solid rgba(200,150,62,0.14)", borderRadius: 6, padding: "10px 13px" }}>
                    {insights.products.map(([name, v]) => (
                      <div key={name} className="cus-line">
                        <span>{name} <strong>× {v.qty}</strong></span>
                        <span>{inr(v.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="cus-sec">Customer details</p>
                <div className="cus-grid">
                  <div className="cus-kv"><p className="cus-k">Phone</p><p className="cus-v">{detail.user.phone || "—"}</p></div>
                  <div className="cus-kv"><p className="cus-k">Sign-in</p><p className="cus-v">{detail.user.authMethod}</p></div>
                  <div className="cus-kv"><p className="cus-k">Verified</p><p className="cus-v">{detail.user.isVerified ? "Yes" : "No"}</p></div>
                  <div className="cus-kv"><p className="cus-k">Role</p><p className="cus-v">{detail.user.role}</p></div>
                  <div className="cus-kv"><p className="cus-k">Joined</p><p className="cus-v">{dayMonth(detail.user.createdAt)}</p></div>
                  <div className="cus-kv"><p className="cus-k">First order</p><p className="cus-v">{dayMonth(insights.firstOrder)}</p></div>
                  <div className="cus-kv"><p className="cus-k">Last order</p><p className="cus-v">{dayMonth(insights.lastOrder)}</p></div>
                  <div className="cus-kv"><p className="cus-k">Last login</p><p className="cus-v">{dayMonth(detail.user.lastLogin)}</p></div>
                  <div className="cus-kv"><p className="cus-k">Wellness points</p><p className="cus-v">{detail.user.wellnessPoints ?? 0}</p></div>
                </div>

                <p className="cus-sec">Order history</p>
                {detail.orders.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: "rgba(68,42,27,0.45)" }}>No orders placed yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {detail.orders.map((o) => (
                      <div key={o.id} className="cus-order">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#442a1b" }}>{o.orderNumber}</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#442a1b" }}>{inr(o.total)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: "rgba(68,42,27,0.55)" }}>{new Date(o.date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                          <span className="cus-badge" style={{ background: "rgba(200,150,62,0.12)", color: "#8a5a10", textTransform: "capitalize" }}>{o.status}</span>
                          <span className="cus-badge" style={{
                            background: o.paymentStatus === "captured" ? "rgba(46,125,50,0.12)" : "rgba(68,42,27,0.08)",
                            color: o.paymentStatus === "captured" ? "#2e7d32" : "rgba(68,42,27,0.55)",
                          }}>{o.paymentStatus === "captured" ? "Paid" : "Unpaid"}</span>
                        </div>
                        {o.items.map((it, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "rgba(68,42,27,0.75)", padding: "2px 0" }}>
                            <span>{it.name} × {it.quantity}</span>
                            <span>{inr(it.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
