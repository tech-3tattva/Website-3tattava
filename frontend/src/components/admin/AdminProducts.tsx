"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";
import { useFeedback } from "@/components/admin/AdminToast";
import { useSortable } from "@/hooks/useSortable";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * Shape of GET /admin/inventory rows. The endpoint deliberately projects a
 * narrow set of columns, so mrp, badge and isFeatured are NOT available here —
 * quick edit only offers what it can show truthfully, and the full form covers
 * the rest.
 */
type Product = {
  id: string;
  _id?: string;
  name: string;
  sku?: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  isActive: boolean;
};

const DEFAULT_LOW_STOCK = 5;

// Module scope: useSortable memoises on this object, so a fresh literal per
// render would re-sort every time the panel re-renders.
const SORTS: Record<string, (p: Product) => string | number | null | undefined> = {
  name: (p) => p.name,
  price: (p) => p.price,
  stock: (p) => p.stockQuantity,
  status: (p) => (p.isActive ? "Active" : "Hidden"),
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const productId = (p: Product) => p.id || p._id || "";

export default function AdminProducts({ readOnly = false }: { readOnly?: boolean }) {
  const { toast, confirm } = useFeedback();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const { sorted, headerProps } = useSortable(products, SORTS);

  useScrollLock(editing !== null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Product[]>("/admin/inventory");
      setProducts(data);
    } catch (err) {
      setProducts([]);
      toast("error", err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const id = productId(editing);
    const before = products.find((p) => productId(p) === id);

    // Hiding a product pulls it off the storefront, so make it deliberate.
    if (before?.isActive && !editing.isActive) {
      const ok = await confirm({
        title: `Hide ${editing.name} from the store?`,
        body: "Customers will not see or be able to buy it until you set it back to Active.",
        confirmLabel: "Hide product",
        danger: true,
      });
      if (!ok) return;
    }

    setSaving(true);
    try {
      await api.patch(`/admin/products/${id}`, {
        price: editing.price,
        stockQuantity: editing.stockQuantity,
        isActive: editing.isActive,
      });
      toast(
        "ok",
        `${editing.name} saved — ${inr(editing.price)}, ${editing.stockQuantity.toLocaleString("en-IN")} units, ${editing.isActive ? "live on site" : "hidden"}`,
      );
      setEditing(null);
      void load();
    } catch (err) {
      toast(
        "error",
        `Could not save ${editing.name}: ${err instanceof Error ? err.message : "the API rejected the change"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const stockBadge = (p: Product) => {
    const low = p.lowStockThreshold ?? DEFAULT_LOW_STOCK;
    if (p.stockQuantity <= 0) return "ad-badge ad-badge-bad";
    if (p.stockQuantity <= low) return "ad-badge ad-badge-warn";
    return "ad-badge ad-badge-ok";
  };

  return (
    <>
      <style>{`
        .prd-table { width: 100%; border-collapse: collapse; }
        .prd-th { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ad-ink-3); font-weight: 650; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--ad-hairline); white-space: nowrap; }
        .prd-td { padding: 13px 14px; border-bottom: 1px solid rgba(68,42,27,0.06); font-size: 13.5px; color: var(--ad-ink-2); vertical-align: middle; }
        .prd-tr:hover .prd-td { background: rgba(200,150,62,0.05); }
        .prd-name { font-size: 14px; font-weight: 600; color: var(--ad-ink); margin: 0; }
        .prd-sku { color: var(--ad-ink-3); margin: 3px 0 0; word-break: break-word; }
        .prd-money { font-size: 14px; font-weight: 600; color: var(--ad-ink); white-space: nowrap; }
        .prd-actions { display: flex; gap: 8px; flex-wrap: wrap; }

        .prd-modal-wrap { position: fixed; inset: 0; z-index: 1000; background: rgba(28,19,4,0.5); display: flex; align-items: flex-start; justify-content: center; padding: 20px 14px; overflow-y: auto; overscroll-behavior: contain; }
        /* Card shape comes from .ad-card; only the modal-specific box is local. */
        .prd-modal { width: 100%; max-width: 560px; padding: 22px; background: var(--ad-surface-2); box-shadow: var(--ad-shadow-lg); max-height: calc(100vh - 40px); overflow-y: auto; overscroll-behavior: contain; }
        .prd-modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
        .prd-x { border: none; background: transparent; font-size: 26px; line-height: 1; color: var(--ad-ink-3); cursor: pointer; padding: 0 4px; min-height: 34px; }
        .prd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .prd-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .prd-field-wide { grid-column: 1 / -1; }
        .prd-modal-actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-top: 20px; }
        .prd-modal a { color: var(--ad-gold); text-decoration: underline; }

        /* ── Mobile: table becomes stacked cards ── */
        @media (max-width: 900px) {
          .prd-table thead { display: none; }
          .prd-table, .prd-table tbody, .prd-table tr { display: block; width: 100%; }
          .prd-tr { background: var(--ad-surface); border: 1px solid var(--ad-gold-soft); border-radius: var(--ad-r); margin-bottom: 12px; padding: 6px 4px; }
          /* must out-specify the .prd-td rule or display:block wins and the label/value row collapses */
          .prd-table td.prd-td { width: 100%; display: flex; justify-content: space-between; gap: 14px; align-items: baseline; text-align: right; padding: 10px 12px; border-bottom: 1px solid rgba(68,42,27,0.05); }
          .prd-table td.prd-td:last-child { border-bottom: none; }
          .prd-table td.prd-td::before { content: attr(data-label); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ad-ink-3); text-align: left; flex-shrink: 0; min-width: 62px; }
          .prd-actions { justify-content: flex-end; }
          .prd-grid { grid-template-columns: 1fr; }
          .prd-modal { padding: 16px; }
        }
      `}</style>

      {loading ? (
        <p className="ad-sub">Loading products…</p>
      ) : products.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-mark" aria-hidden>+</div>
          <p className="ad-empty-title">No products in the catalogue</p>
          <p className="ad-empty-hint">
            Nothing is on sale on the website right now. Add a SKU with a name, price and
            opening stock — it goes live the moment you save it as Active.
          </p>
          {!readOnly && (
            <p style={{ marginTop: 16 }}>
              <Link href="/admin/products/new" className="ad-btn ad-btn-primary">Add a product</Link>
            </p>
          )}
        </div>
      ) : (
        <table className="prd-table">
          <thead>
            <tr>
              {([["name", "Product"], ["price", "Price"], ["stock", "Stock"], ["status", "Status"]] as const).map(([key, label]) => {
                const hp = headerProps(key);
                return (
                  <th key={key} className="prd-th">
                    <button className="ad-sort" aria-sort={hp["aria-sort"]} onClick={hp.onClick}>
                      {label} <span className="ad-sort-arrow">{hp.arrow}</span>
                    </button>
                  </th>
                );
              })}
              {!readOnly && <th className="prd-th">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const pid = productId(p);
              return (
                <tr key={pid} className="prd-tr">
                  <td className="prd-td" data-label="Product">
                    <div>
                      <p className="prd-name">{p.name}</p>
                      <p className="prd-sku ad-mono">{p.sku ? `SKU ${p.sku}` : "No SKU"}</p>
                    </div>
                  </td>
                  <td className="prd-td" data-label="Price">
                    <span className="prd-money">{inr(p.price)}</span>
                  </td>
                  <td className="prd-td" data-label="Stock">
                    <span className={stockBadge(p)}>
                      {p.stockQuantity.toLocaleString("en-IN")} units
                    </span>
                  </td>
                  <td className="prd-td" data-label="Status">
                    <span className={p.isActive ? "ad-badge ad-badge-ok" : "ad-badge ad-badge-mute"}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="prd-td" data-label="Actions">
                      <span className="prd-actions">
                        <button className="ad-btn" onClick={() => setEditing(p)}>Edit</button>
                        <Link href={`/admin/products/${pid}/edit`} className="ad-btn">Full details</Link>
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editing && (
        <div
          className="prd-modal-wrap"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editing.name}`}
        >
          <div className="ad-card prd-modal">
            <div className="prd-modal-head">
              <div>
                <p className="ad-eyebrow">Quick edit</p>
                <h2 className="ad-h2" style={{ marginTop: 4 }}>{editing.name}</h2>
              </div>
              <button className="prd-x" onClick={() => setEditing(null)} aria-label="Close">×</button>
            </div>

            <div className="prd-grid">
              <div className="prd-field">
                <label className="ad-eyebrow" htmlFor="prd-price">Sale price (₹)</label>
                <input id="prd-price" type="number" min={0} className="ad-input" value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
              </div>
              <div className="prd-field">
                <label className="ad-eyebrow" htmlFor="prd-stock">Stock units</label>
                <input id="prd-stock" type="number" min={0} className="ad-input" value={editing.stockQuantity}
                  onChange={(e) => setEditing({ ...editing, stockQuantity: +e.target.value })} />
              </div>
              <div className="prd-field prd-field-wide">
                <label className="ad-eyebrow" htmlFor="prd-status">Storefront</label>
                <select id="prd-status" className="ad-input" value={editing.isActive ? "true" : "false"}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.value === "true" })}>
                  <option value="true">Active — on sale</option>
                  <option value="false">Hidden — off sale</option>
                </select>
              </div>
            </div>

            <p className="ad-sub" style={{ marginTop: 14 }}>
              MRP, badge, featured placement, images and copy live on the{" "}
              <Link href={`/admin/products/${productId(editing)}/edit`}>full product page</Link>.
            </p>

            <div className="prd-modal-actions">
              <button className="ad-btn" onClick={() => setEditing(null)}>Cancel</button>
              <button className="ad-btn ad-btn-primary" onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
