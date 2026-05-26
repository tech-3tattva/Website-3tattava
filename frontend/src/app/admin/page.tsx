"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminOrders from "@/components/admin/AdminOrders";

type Tab = "overview" | "products" | "inventory" | "orders";

type Stats = {
  revenue: { today: number; month: number; year: number };
  orders: { total: number; pending: number };
  inventory: { lowStockProducts: number; inventoryValue: number };
  products: { totalActive: number };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name.split("—")[0].trim());

    api.get<Stats>("/admin/dashboard")
      .then(setStats)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setAuthChecked(true));
  }, [router]);

  const handleLogout = async () => {
    try { await api.post("/auth/admin/auth/logout", {}); } catch {}
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid rgba(200,150,62,0.2)", borderTopColor: "#C8963E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const NAV = [
    { id: "overview" as Tab, label: "Overview", icon: "◈" },
    { id: "products" as Tab, label: "Products", icon: "◉" },
    { id: "inventory" as Tab, label: "Inventory", icon: "▣" },
    { id: "orders" as Tab, label: "Orders", icon: "◎" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .ad-shell { display: flex; min-height: 100vh; background: #0f0f0f; color: #F5F0EB; font-family: var(--font-jost,'Jost'),sans-serif; }
        /* sidebar */
        .ad-sidebar { width: 228px; min-height: 100vh; background: #141414; border-right: 1px solid rgba(200,150,62,0.1); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; padding: 28px 0; flex-shrink: 0; }
        .ad-logo { padding: 0 24px 28px; border-bottom: 1px solid rgba(200,150,62,0.08); }
        .ad-logo-name { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 21px; font-weight: 700; color: #F5F0EB; letter-spacing: 0.05em; }
        .ad-logo-sub { font-size: 9px; letter-spacing: 0.3em; color: #C8963E; text-transform: uppercase; margin-top: 2px; }
        .ad-nav { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 3px; }
        .ad-nav-btn { display: flex; align-items: center; gap: 11px; padding: 10px 14px; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 400; color: rgba(245,240,235,0.42); transition: all 0.18s; background: transparent; border: none; width: 100%; text-align: left; letter-spacing: 0.02em; }
        .ad-nav-btn:hover { color: rgba(245,240,235,0.82); background: rgba(200,150,62,0.06); }
        .ad-nav-btn.active { color: #F5F0EB; background: rgba(200,150,62,0.1); border-left: 2px solid #C8963E; }
        .ad-nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .ad-sidebar-foot { padding: 18px 10px; border-top: 1px solid rgba(200,150,62,0.08); }
        .ad-logout { display: flex; align-items: center; gap: 9px; width: 100%; padding: 10px 14px; background: transparent; border: 1px solid rgba(200,150,62,0.14); color: rgba(245,240,235,0.38); font-family: var(--font-jost,'Jost'),sans-serif; font-size: 12px; letter-spacing: 0.08em; cursor: pointer; transition: all 0.18s; border-radius: 3px; }
        .ad-logout:hover { border-color: rgba(200,150,62,0.4); color: rgba(245,240,235,0.75); }
        /* main */
        .ad-main { flex: 1; padding: 36px 40px; overflow-y: auto; min-width: 0; }
        .ad-topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; }
        .ad-page-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 34px; font-weight: 700; color: #F5F0EB; }
        .ad-page-sub { font-size: 12px; color: rgba(245,240,235,0.32); margin-top: 3px; font-weight: 300; }
        .ad-greeting { text-align: right; }
        .ad-greeting-name { font-size: 13px; color: rgba(245,240,235,0.38); }
        .ad-greeting-name strong { color: #C8963E; font-weight: 500; }
        .ad-greeting-date { font-size: 11px; color: rgba(245,240,235,0.2); margin-top: 2px; }
        /* stat cards */
        .ad-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 36px; }
        .ad-stat { background: #1a1a1a; border: 1px solid rgba(200,150,62,0.1); padding: 22px; position: relative; overflow: hidden; border-radius: 3px; animation: adStatIn 0.5s ease both; }
        .ad-stat:nth-child(1){animation-delay:0.04s} .ad-stat:nth-child(2){animation-delay:0.08s} .ad-stat:nth-child(3){animation-delay:0.12s} .ad-stat:nth-child(4){animation-delay:0.16s}
        @keyframes adStatIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .ad-stat::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(200,150,62,0.35),transparent); }
        .ad-stat-label { font-size: 9px; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(245,240,235,0.32); margin-bottom: 10px; }
        .ad-stat-value { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 38px; font-weight: 700; color: #F5F0EB; line-height: 1; margin-bottom: 5px; }
        .ad-stat-value.gold { color: #C8963E; }
        .ad-stat-value.alert { color: #ff7b7b; }
        .ad-stat-sub { font-size: 11px; color: rgba(245,240,235,0.25); font-weight: 300; }
        /* section heading */
        .ad-section-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 22px; font-weight: 600; color: #F5F0EB; margin-bottom: 18px; }
        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: repeat(2,1fr); }
          .ad-main { padding: 24px 20px; }
          .ad-sidebar { display: none; }
        }
      `}</style>

      <div className="ad-shell">
        {/* Sidebar */}
        <aside className="ad-sidebar">
          <div className="ad-logo">
            <div className="ad-logo-name">3TATTAVA</div>
            <div className="ad-logo-sub">Operations Center</div>
          </div>

          <nav className="ad-nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`ad-nav-btn${tab === n.id ? " active" : ""}`}
                onClick={() => setTab(n.id)}
              >
                <span className="ad-nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="ad-sidebar-foot">
            <button className="ad-logout" onClick={handleLogout}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="ad-main">
          <div className="ad-topbar">
            <div>
              <h1 className="ad-page-title">
                {tab === "overview" && "Dashboard"}
                {tab === "products" && "Products"}
                {tab === "inventory" && "Inventory"}
                {tab === "orders" && "Orders"}
              </h1>
              <p className="ad-page-sub">
                {tab === "overview" && "Live business snapshot"}
                {tab === "products" && "Manage your product catalogue"}
                {tab === "inventory" && "Track and update stock levels"}
                {tab === "orders" && "View and manage customer orders"}
              </p>
            </div>
            <div className="ad-greeting">
              <p className="ad-greeting-name">Welcome, <strong>{adminName}</strong></p>
              <p className="ad-greeting-date">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          {tab === "overview" && (
            <>
              <div className="ad-stats">
                <div className="ad-stat">
                  <p className="ad-stat-label">Revenue Today</p>
                  <p className="ad-stat-value gold">₹{stats?.revenue.today.toLocaleString("en-IN") ?? "—"}</p>
                  <p className="ad-stat-sub">All non-cancelled orders</p>
                </div>
                <div className="ad-stat">
                  <p className="ad-stat-label">Revenue This Month</p>
                  <p className="ad-stat-value gold">₹{stats?.revenue.month.toLocaleString("en-IN") ?? "—"}</p>
                  <p className="ad-stat-sub">MTD</p>
                </div>
                <div className="ad-stat">
                  <p className="ad-stat-label">Total Orders</p>
                  <p className="ad-stat-value">{stats?.orders.total ?? "—"}</p>
                  <p className="ad-stat-sub">{stats?.orders.pending ?? 0} pending</p>
                </div>
                <div className="ad-stat">
                  <p className="ad-stat-label">Low Stock SKUs</p>
                  <p className={`ad-stat-value${(stats?.inventory.lowStockProducts ?? 0) > 0 ? " alert" : ""}`}>
                    {stats?.inventory.lowStockProducts ?? "—"}
                  </p>
                  <p className="ad-stat-sub">Below threshold</p>
                </div>
              </div>

              <p className="ad-section-title">Product Overview</p>
              <AdminProducts readOnly />
            </>
          )}

          {tab === "products" && <AdminProducts />}
          {tab === "inventory" && <AdminInventory />}
          {tab === "orders" && <AdminOrders />}
        </main>
      </div>
    </>
  );
}
