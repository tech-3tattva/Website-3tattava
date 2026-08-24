"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminApi as api } from "@/lib/api";
import { useFeedback } from "@/components/admin/AdminToast";

type InventoryItem = {
  id: string;
  _id?: string;
  name: string;
  sku?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  price?: number;
};

const DEFAULT_LOW_STOCK = 5;

export default function AdminInventory() {
  const { toast, confirm } = useFeedback();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<InventoryItem[]>("/admin/inventory")
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((err: unknown) => {
        if (cancelled) return;
        toast("error", err instanceof Error ? err.message : "Could not load inventory");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // Intentionally load once: stock is only changed from this panel.
  }, [toast]);

  const summary = useMemo(() => {
    let units = 0;
    let low = 0;
    let out = 0;
    for (const it of items) {
      const qty = it.stockQuantity ?? 0;
      units += qty;
      if (qty <= 0) out += 1;
      else if (qty <= (it.lowStockThreshold ?? DEFAULT_LOW_STOCK)) low += 1;
    }
    return { skus: items.length, units, low, out };
  }, [items]);

  const setStock = async (item: InventoryItem, id: string, val: number) => {
    // Zeroing stock takes the product off sale, so it needs an explicit yes.
    if (val === 0 && item.stockQuantity > 0) {
      const ok = await confirm({
        title: `Set ${item.name} stock to zero?`,
        body: "It will show as out of stock on the website and cannot be bought until you restock it.",
        confirmLabel: "Set to zero",
        danger: true,
      });
      if (!ok) return;
    }

    setSaving(id);
    try {
      const updated = await api.put<InventoryItem>(`/admin/inventory/${id}/set`, {
        setQuantity: val,
        reason: "Admin panel update",
      });
      setItems((prev) => prev.map((x) => (x.id === id || x._id === id) ? { ...x, stockQuantity: updated.stockQuantity } : x));
      setUpdates((u) => { const next = { ...u }; delete next[id]; return next; });
      toast("ok", `${item.name} stock set to ${updated.stockQuantity.toLocaleString("en-IN")}`);
    } catch (err) {
      toast(
        "error",
        `Could not update ${item.name}: ${err instanceof Error ? err.message : "the API rejected the change"}`,
      );
    } finally {
      setSaving(null);
    }
  };

  return (
    <>
      <style>{`
        .inv-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr)); gap: 12px; margin-bottom: 20px; }
        .inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: 16px; }
        /* Card shape comes from .ad-card; only the inner layout is panel-local. */
        .inv-card { padding: 20px; }
        .inv-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
        .inv-sku { color: var(--ad-ink-3); margin: 4px 0 0; word-break: break-word; }
        .inv-count { font-size: 34px; line-height: 1; margin: 0; }
        .inv-count-ok  { color: var(--ad-ok); }
        .inv-count-low { color: var(--ad-warn); }
        .inv-count-out { color: var(--ad-bad); }
        .inv-count-label { margin: 7px 0 0; }
        .inv-divider { height: 1px; background: var(--ad-hairline); margin: 16px 0; }
        .inv-quick { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 12px; }
        .inv-quick > button { min-height: 34px; }
        .inv-row { display: flex; gap: 9px; align-items: center; }
        .inv-row > .ad-input { flex: 1 1 auto; min-width: 0; font-size: 15px; }
        .inv-row > .ad-btn { min-height: 38px; white-space: nowrap; }
        .inv-threshold { margin: 10px 0 0; }

        @media (max-width: 900px) {
          .inv-card { padding: 16px; }
          /* 16px keeps iOS from zooming the page when the field takes focus */
          .inv-row > .ad-input { font-size: 16px; }
        }
      `}</style>

      <div className="inv-summary">
        <div className="ad-stat">
          <p className="ad-eyebrow">Total SKUs</p>
          <span className="ad-num">{summary.skus.toLocaleString("en-IN")}</span>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Units in stock</p>
          <span className="ad-num">{summary.units.toLocaleString("en-IN")}</span>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Low stock</p>
          <span className="ad-num" style={summary.low > 0 ? { color: "var(--ad-warn)" } : undefined}>
            {summary.low.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Out of stock</p>
          <span className="ad-num" style={summary.out > 0 ? { color: "var(--ad-bad)" } : undefined}>
            {summary.out.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="ad-sub">Loading stock levels…</p>
      ) : items.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-mark" aria-hidden>+</div>
          <p className="ad-empty-title">Nothing to keep stock of yet</p>
          <p className="ad-empty-hint">
            Stock counts appear here once a product exists. Create one with its opening
            quantity and low-stock alert level, then top it up from this screen after
            every batch.
          </p>
          <p style={{ marginTop: 16 }}>
            <Link href="/admin/products/new" className="ad-btn ad-btn-primary">Add a product</Link>
          </p>
        </div>
      ) : (
        <div className="inv-grid">
          {items.map((item) => {
            const id = item.id || item._id || "";
            const current = item.stockQuantity;
            const threshold = item.lowStockThreshold ?? DEFAULT_LOW_STOCK;
            const val = updates[id] !== undefined ? updates[id] : current;
            const state = current <= 0 ? "out" : current <= threshold ? "low" : "ok";

            return (
              <div key={id} className="ad-card inv-card">
                <div className="inv-head">
                  <div>
                    <p className="ad-h3">{item.name}</p>
                    <p className="inv-sku ad-mono">{item.sku ? `SKU ${item.sku}` : "No SKU"}</p>
                  </div>
                  <span className={state === "ok" ? "ad-badge ad-badge-ok" : "ad-badge ad-badge-bad"}>
                    {state === "out" ? "Out of stock" : state === "low" ? "Low stock" : "In stock"}
                  </span>
                </div>

                <p className={`ad-num inv-count inv-count-${state}`}>{current.toLocaleString("en-IN")}</p>
                <p className="ad-eyebrow inv-count-label">Units in stock</p>
                <p className="ad-sub inv-threshold">
                  Alerts below {threshold.toLocaleString("en-IN")} units
                </p>

                <div className="inv-divider" />

                <div className="inv-quick">
                  {[10, 25, 50, 100].map((n) => (
                    <button key={n} className="ad-btn ad-btn-sm"
                      onClick={() => setUpdates((u) => ({ ...u, [id]: current + n }))}>
                      +{n}
                    </button>
                  ))}
                  <button className="ad-btn ad-btn-sm"
                    onClick={() => setUpdates((u) => ({ ...u, [id]: 0 }))}>
                    Set 0
                  </button>
                </div>

                <div className="inv-row">
                  <input
                    type="number"
                    className="ad-input"
                    aria-label={`New stock count for ${item.name}`}
                    value={val}
                    min={0}
                    onChange={(e) => setUpdates((u) => ({ ...u, [id]: +e.target.value }))}
                  />
                  <button
                    className="ad-btn ad-btn-primary"
                    disabled={saving === id || val === current}
                    onClick={() => void setStock(item, id, val)}
                  >
                    {saving === id ? "Saving…" : "Update"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
