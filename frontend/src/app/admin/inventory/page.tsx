"use client";

import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type InventoryProduct = {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  images?: string[];
  price?: number;
};

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, number>>({});
  const [setStock, setSetStock] = useState<Record<string, string>>({});
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadInventory = useCallback(async () => {
    try {
      const data = await api.get<InventoryProduct[]>("/admin/inventory");
      setProducts(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    const id = setInterval(() => void loadInventory(), 30000);
    return () => clearInterval(id);
  }, [loadInventory]);

  async function applyChange(productId: string) {
    const quantityChange = Number(changes[productId] || 0);
    if (!quantityChange) return;
    try {
      const updated = await api.put<InventoryProduct>(`/admin/inventory/${productId}`, {
        quantityChange,
        changeType: quantityChange > 0 ? "restock" : "adjustment",
        reason: "Manual admin panel update",
      });
      setProducts((current) => current.map((item) => (item.id === productId ? updated : item)));
      setChanges((current) => ({ ...current, [productId]: 0 }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update inventory");
    }
  }

  async function applySetStock(productId: string) {
    const raw = setStock[productId];
    if (raw === undefined || raw === "") return;
    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n) || n < 0) {
      setError("Set stock must be a whole number ≥ 0");
      return;
    }
    try {
      const updated = await api.put<InventoryProduct>(`/admin/inventory/${productId}/set`, {
        setQuantity: n,
        reason: "Set stock (admin panel)",
      });
      setProducts((current) => current.map((item) => (item.id === productId ? updated : item)));
      setSetStock((current) => ({ ...current, [productId]: "" }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set stock");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="premium-card p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-text-dark mb-2">Inventory Management</h1>
          <p className="text-sm text-text-medium">
            Stock updates sync to the live shop. List refreshes every 30s — or tap Refresh now.
          </p>
          {lastRefresh && (
            <p className="text-xs text-text-light mt-1">
              Last loaded: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadInventory()}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-dark hover:bg-beige"
          >
            Refresh
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-full bg-primary-green px-5 py-2 text-sm font-semibold text-white hover:bg-secondary-green"
          >
            Add product
          </Link>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {products.map((product) => {
          const isLowStock = product.stockQuantity <= product.lowStockThreshold;
          const thumb = product.images?.[0] || "/placeholder.svg";
          return (
            <div key={product.id} className="premium-card p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-cream border border-border">
                  <Image src={thumb} alt="" fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-semibold text-text-dark text-lg">{product.name}</p>
                    {!product.isActive && (
                      <span className="text-xs uppercase tracking-wider text-red-600">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-text-medium mt-0.5">
                    SKU: <span className="font-medium text-text-dark">{product.sku || "N/A"}</span>
                    {product.price != null && (
                      <>
                        {" "}
                        · Price: <span className="font-medium text-text-dark">Rs {product.price}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-text-medium mt-1">
                    Low-stock when ≤ {product.lowStockThreshold} units
                    {isLowStock && (
                      <span className="ml-2 font-semibold text-amber-800">· Low stock warning</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 lg:shrink-0">
                  <div className="text-center sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-text-medium">Current stock</p>
                    <p className="text-3xl font-bold text-primary-green tabular-nums">
                      {product.stockQuantity}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-end gap-2 border-t lg:border-t-0 lg:border-l border-border pt-3 lg:pt-0 lg:pl-4">
                    <div>
                      <label className="block text-xs font-medium text-text-dark mb-1">Adjust (+/−)</label>
                      <input
                        type="number"
                        value={changes[product.id] ?? 0}
                        onChange={(e) =>
                          setChanges((current) => ({
                            ...current,
                            [product.id]: Number(e.target.value || 0),
                          }))
                        }
                        className="w-24 px-2 py-2 border border-border rounded-lg bg-white text-text-dark"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void applyChange(product.id)}
                      className="px-4 py-2 rounded-lg bg-text-dark text-white text-sm font-medium hover:bg-primary-green"
                    >
                      Apply
                    </button>
                    <div>
                      <label className="block text-xs font-medium text-text-dark mb-1">Set to</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          min={0}
                          placeholder="Qty"
                          value={setStock[product.id] ?? ""}
                          onChange={(e) =>
                            setSetStock((c) => ({ ...c, [product.id]: e.target.value }))
                          }
                          className="w-20 px-2 py-2 border border-border rounded-lg bg-white text-text-dark"
                        />
                        <button
                          type="button"
                          onClick={() => void applySetStock(product.id)}
                          className="px-3 py-2 rounded-lg border border-gold text-text-dark text-sm font-medium hover:bg-beige"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-green border border-primary-green hover:bg-beige"
                    >
                      Edit product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
