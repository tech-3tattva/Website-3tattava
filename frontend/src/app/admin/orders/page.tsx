"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  guestEmail?: string;
  createdAt: string;
};

const STATUSES: AdminOrder["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function statusClass(status: AdminOrder["status"]) {
  if (status === "delivered") return "bg-beige text-primary-green border-gold/40";
  if (status === "cancelled") return "bg-red-50 text-red-700 border-red-200";
  if (status === "shipped") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadOrders() {
    try {
      const response = await api.get<{ orders: AdminOrder[] }>("/admin/orders");
      setOrders(response.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: AdminOrder["status"]) {
    try {
      const updated = await api.put<AdminOrder>(`/admin/orders/${orderId}/status`, { status });
      setOrders((current) => current.map((item) => (item.id === orderId ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="premium-card p-6 mb-6">
        <h1 className="font-display text-4xl text-text-dark mb-2">Order Management</h1>
        <p className="text-sm text-text-light">Update order lifecycle and keep customers informed.</p>
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="premium-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-text-light">
                  {new Date(order.createdAt).toLocaleString()} - {order.guestEmail || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs capitalize px-2 py-1 border rounded-full ${statusClass(order.status)}`}>
                  {order.status}
                </span>
                <p className="font-semibold">Rs {order.total}</p>
                <select
                  value={order.status}
                  onChange={(e) => void updateStatus(order.id, e.target.value as AdminOrder["status"])}
                  className="px-3 py-2 border border-border rounded bg-white"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

