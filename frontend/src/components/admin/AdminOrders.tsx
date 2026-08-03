"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";

type Order = {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  guestEmail?: string;
  createdAt: string;
  items?: { name: string; quantity: number; price: number }[];
};

const STATUSES: Order["status"][] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLOR: Record<string, string> = {
  pending: "#c26a12",
  confirmed: "#1976d2",
  processing: "#8e24aa",
  shipped: "#0288d1",
  delivered: "#3f7a3a",
  cancelled: "#c0392b",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ orders: Order[] }>("/admin/orders")
      .then((d) => setOrders(d.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    setUpdating(id);
    try {
      const updated = await api.put<Order>(`/admin/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: updated.status } : o));
    } catch {}
    finally { setUpdating(null); }
  };

  return (
    <>
      <style>{`
        .ord-empty { text-align: center; padding: 72px 0; }
        .ord-empty-icon { font-size: 44px; margin-bottom: 12px; }
        .ord-empty-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 22px; color: rgba(68,42,27,0.28); }
        .ord-empty-sub { font-size: 13px; color: rgba(68,42,27,0.18); margin-top: 6px; font-weight: 300; }
        .ord-table { width: 100%; border-collapse: collapse; }
        .ord-th { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(68,42,27,0.3); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(200,150,62,0.1); font-weight: 400; }
        .ord-td { padding: 14px; border-bottom: 1px solid rgba(68,42,27,0.04); font-size: 13px; color: rgba(68,42,27,0.7); vertical-align: middle; }
        .ord-tr:hover .ord-td { background: rgba(200,150,62,0.02); }
        .ord-id { font-family: monospace; font-size: 12px; color: rgba(68,42,27,0.45); }
        .ord-num { font-size: 14px; color: #442a1b; font-weight: 400; }
        .ord-status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 7px; vertical-align: middle; }
        .ord-select {
          background: rgba(68,42,27,0.04);
          border: 1px solid rgba(200,150,62,0.18);
          color: #442a1b;
          font-family: var(--font-jost,'Jost'),sans-serif;
          font-size: 12px;
          padding: 6px 10px;
          outline: none;
          cursor: pointer;
          border-radius: 2px;
          transition: border-color 0.2s;
        }
        .ord-select:focus { border-color: rgba(200,150,62,0.5); }
        .ord-select option { background: #ffffff; }
      `}</style>

      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 14 }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="ord-empty">
          <div className="ord-empty-icon">◎</div>
          <p className="ord-empty-title">No orders yet</p>
          <p className="ord-empty-sub">Orders will appear here once customers start buying.</p>
        </div>
      ) : (
        <table className="ord-table">
          <thead>
            <tr>
              <th className="ord-th">Order</th>
              <th className="ord-th">Customer</th>
              <th className="ord-th">Total</th>
              <th className="ord-th">Date</th>
              <th className="ord-th">Status</th>
              <th className="ord-th">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="ord-tr">
                <td className="ord-td">
                  <p className="ord-num">{o.orderNumber}</p>
                  <p className="ord-id">{o.id?.slice(-8).toUpperCase()}</p>
                </td>
                <td className="ord-td">{o.guestEmail || "—"}</td>
                <td className="ord-td">₹{o.total?.toLocaleString("en-IN") || "—"}</td>
                <td className="ord-td">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                <td className="ord-td">
                  <span className="ord-status-dot" style={{ background: STATUS_COLOR[o.status] || "#888" }} />
                  <span style={{ textTransform: "capitalize" }}>{o.status}</span>
                </td>
                <td className="ord-td">
                  <select
                    className="ord-select"
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => updateStatus(o.id, e.target.value as Order["status"])}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
