"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";

type DashboardStats = {
  revenue: { today: number; month: number; year: number };
  orders: { total: number; pending: number };
  inventory: { lowStockProducts: number; inventoryValue: number };
  products: { totalActive: number };
} | null;

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  guestEmail?: string;
  items?: { name: string; quantity: number }[];
  shippingAddress?: { firstName?: string; lastName?: string; email?: string };
  payment?: { status?: string };
};

const inr = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

const STATUS_COLOR: Record<string, string> = {
  pending: "#c26a12",
  confirmed: "#1976d2",
  processing: "#8e24aa",
  shipped: "#0288d1",
  delivered: "#3f7a3a",
  cancelled: "#c0392b",
};

export default function AdminOverview({
  stats,
  onOpenTab,
}: {
  stats: DashboardStats;
  onOpenTab: (tab: "orders" | "users" | "inventory") => void;
}) {
  const [people, setPeople] = useState<{ registered: number; purchasers: number } | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await api.get<{ total: number; summary?: { registered: number; purchasers: number } }>("/admin/users");
        if (alive) setPeople(u.summary ?? { registered: u.total ?? 0, purchasers: 0 });
      } catch { /* card falls back to a dash */ }
      try {
        const o = await api.get<{ orders: RecentOrder[] }>("/admin/orders?limit=6");
        if (alive) setRecent(o.orders || []);
      } catch { /* list stays empty */ }
    })();
    return () => { alive = false; };
  }, []);

  const unpaid = recent.filter((o) => o.payment?.status !== "captured").length;

  return (
    <>
      <style>{`
        .ov-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 13px; margin-bottom: 26px; }
        .ov-card { background: #fff; border: 1px solid rgba(200,150,62,0.18); border-radius: 6px; padding: 17px 18px; }
        .ov-card.click { cursor: pointer; transition: border-color .18s, transform .18s; }
        .ov-card.click:hover { border-color: rgba(200,150,62,0.55); transform: translateY(-1px); }
        .ov-l { font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(68,42,27,0.55); margin-bottom: 7px; }
        .ov-v { font-size: 27px; font-weight: 700; color: #442a1b; line-height: 1; }
        .ov-v.gold { color: #b8801f; }
        .ov-v.alert { color: #c0392b; }
        .ov-s { font-size: 12.5px; color: rgba(68,42,27,0.55); margin-top: 6px; }

        .ov-sec { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 26px 0 12px; }
        .ov-sec-t { font-size: 17px; font-weight: 700; color: #442a1b; }
        .ov-link { font-size: 12.5px; color: #a8761c; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
        .ov-link:hover { text-decoration: underline; }

        .ov-row { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid rgba(200,150,62,0.16);
          border-radius: 6px; padding: 12px 15px; margin-bottom: 9px; cursor: pointer; transition: border-color .18s; }
        .ov-row:hover { border-color: rgba(200,150,62,0.5); }
        .ov-who { min-width: 0; flex: 1 1 auto; }
        .ov-name { display: block; font-size: 14px; font-weight: 600; color: #442a1b; }
        .ov-items { display: block; font-size: 12.5px; color: rgba(68,42,27,0.68); margin-top: 3px; }
        .ov-amt { font-size: 15px; font-weight: 700; color: #442a1b; white-space: nowrap; }
        .ov-when { font-size: 12px; color: rgba(68,42,27,0.5); white-space: nowrap; }
        .ov-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .ov-empty { font-size: 13.5px; color: rgba(68,42,27,0.45); }

        @media (max-width: 620px) {
          .ov-row { flex-wrap: wrap; gap: 8px; }
          .ov-when { width: 100%; }
        }
      `}</style>

      <div className="ov-grid">
        <div className="ov-card">
          <p className="ov-l">Revenue today</p>
          <p className="ov-v gold">{stats ? inr(stats.revenue.today) : "—"}</p>
          <p className="ov-s">All non-cancelled orders</p>
        </div>
        <div className="ov-card">
          <p className="ov-l">Revenue this month</p>
          <p className="ov-v gold">{stats ? inr(stats.revenue.month) : "—"}</p>
          <p className="ov-s">Month to date</p>
        </div>
        <div className="ov-card click" onClick={() => onOpenTab("orders")} role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") onOpenTab("orders"); }}>
          <p className="ov-l">Total orders</p>
          <p className="ov-v">{stats?.orders.total ?? "—"}</p>
          <p className="ov-s">{stats?.orders.pending ?? 0} awaiting action →</p>
        </div>
        <div className="ov-card click" onClick={() => onOpenTab("users")} role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") onOpenTab("users"); }}>
          <p className="ov-l">Registered customers</p>
          <p className="ov-v">{people ? people.registered : "—"}</p>
          <p className="ov-s">{people ? `${people.purchasers} have purchased →` : "View customers →"}</p>
        </div>
        <div className="ov-card click" onClick={() => onOpenTab("inventory")} role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") onOpenTab("inventory"); }}>
          <p className="ov-l">Low stock SKUs</p>
          <p className={`ov-v${(stats?.inventory.lowStockProducts ?? 0) > 0 ? " alert" : ""}`}>{stats?.inventory.lowStockProducts ?? "—"}</p>
          <p className="ov-s">Below threshold →</p>
        </div>
        <div className="ov-card">
          <p className="ov-l">Unpaid in latest</p>
          <p className={`ov-v${unpaid > 0 ? " alert" : ""}`}>{unpaid}</p>
          <p className="ov-s">Of the {recent.length} most recent</p>
        </div>
      </div>

      <div className="ov-sec">
        <p className="ov-sec-t">Latest orders — who bought what</p>
        <button className="ov-link" onClick={() => onOpenTab("orders")}>See all orders →</button>
      </div>

      {recent.length === 0 ? (
        <p className="ov-empty">No orders yet.</p>
      ) : (
        recent.map((o) => {
          const name = [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" ").trim()
            || o.shippingAddress?.email || o.guestEmail || "Guest";
          return (
            <div key={o.id} className="ov-row" onClick={() => onOpenTab("orders")} role="button" tabIndex={0}
                 onKeyDown={(e) => { if (e.key === "Enter") onOpenTab("orders"); }}>
              <span className="ov-dot" style={{ background: STATUS_COLOR[o.status] || "#888" }} />
              <span className="ov-who">
                <span className="ov-name">{name}</span>
                <span className="ov-items">
                  {(o.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}
                </span>
              </span>
              <span className="ov-amt">{inr(o.total)}</span>
              <span className="ov-when">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {o.payment?.status === "captured" ? " · Paid" : " · Unpaid"}
              </span>
            </div>
          );
        })
      )}
    </>
  );
}
