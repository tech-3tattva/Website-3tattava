"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type TopProductRow = {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

type DashboardData = {
  revenue: { today: number; month: number; year: number };
  orders: { total: number; pending: number };
  inventory: { lowStockProducts: number; inventoryValue: number };
  products: { totalActive: number; totalFeatured: number };
  topProducts: TopProductRow[];
  ordersByStatus: Record<string, number>;
  customers: { newThisMonth: number };
};

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await api.get<DashboardData>("/admin/dashboard");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      }
    }
    void load();
  }, []);

  const maxStatusCount =
    data && Object.keys(data.ordersByStatus).length > 0
      ? Math.max(...Object.values(data.ordersByStatus), 1)
      : 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-2xl border border-[#3d2e26] p-6 mb-6 bg-gradient-to-r from-[#2a211c] to-[#5c4033] text-white shadow-xl">
        <p className="text-[#E8C99A] text-xs uppercase tracking-[0.2em] mb-2 font-semibold">
          Operations Center
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl text-white">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-text-dark shadow-md hover:bg-gold-light transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center justify-center rounded-full bg-[#D4A574] px-5 py-2.5 text-sm font-semibold text-text-dark shadow-md hover:bg-[#E8C99A] transition-colors"
            >
              Inventory
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/90 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
            >
              Add product
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-text-dark">Business Snapshot</h2>
        <span className="text-xs uppercase tracking-wider text-text-light">Live from database</span>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {data && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Revenue (Today)</p>
              <p className="text-2xl font-semibold text-text-dark">Rs {data.revenue.today}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Revenue (Month)</p>
              <p className="text-2xl font-semibold text-text-dark">Rs {data.revenue.month}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Revenue (Year)</p>
              <p className="text-2xl font-semibold text-text-dark">Rs {data.revenue.year}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Total Orders</p>
              <p className="text-2xl font-semibold text-text-dark">{data.orders.total}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Pending / Active</p>
              <p className="text-2xl font-semibold text-text-dark">{data.orders.pending}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Low Stock SKUs</p>
              <p className="text-2xl font-semibold text-text-dark">{data.inventory.lowStockProducts}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Inventory value (active)</p>
              <p className="text-2xl font-semibold text-text-dark">Rs {data.inventory.inventoryValue}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Active products</p>
              <p className="text-2xl font-semibold text-text-dark">{data.products.totalActive}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-sm text-text-medium">Featured products</p>
              <p className="text-2xl font-semibold text-text-dark">{data.products.totalFeatured}</p>
            </div>
            <div className="premium-card p-5 md:col-span-2">
              <p className="text-sm text-text-medium">New customers (this month)</p>
              <p className="text-2xl font-semibold text-text-dark">{data.customers.newThisMonth}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className="premium-card p-6">
              <h3 className="font-display text-xl text-text-dark mb-4">Orders by status</h3>
              <ul className="space-y-3">
                {STATUS_ORDER.map((status) => {
                  const count = data.ordersByStatus[status] ?? 0;
                  const pct = Math.round((count / maxStatusCount) * 100);
                  return (
                    <li key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-text-medium">{status}</span>
                        <span className="font-semibold text-text-dark">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-beige overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-green"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="premium-card p-6">
              <h3 className="font-display text-xl text-text-dark mb-4">Top products (by revenue)</h3>
              {data.topProducts.length === 0 ? (
                <p className="text-sm text-text-light">No sales recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-text-medium border-b border-border">
                        <th className="pb-2 pr-2">Product</th>
                        <th className="pb-2 pr-2 text-right">Units</th>
                        <th className="pb-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((row) => (
                        <tr key={row.productId} className="border-b border-border/60">
                          <td className="py-2 pr-2 text-text-dark font-medium">{row.name}</td>
                          <td className="py-2 pr-2 text-right text-text-medium">{row.unitsSold}</td>
                          <td className="py-2 text-right text-text-dark">Rs {row.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
