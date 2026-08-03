"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";

type Product = {
  id: string;
  _id?: string;
  name: string;
  sku?: string;
  price: number;
  mrp?: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
  badge?: string;
};

export default function AdminProducts({ readOnly = false }: { readOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Product[]>("/admin/inventory");
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMsg("");
    try {
      const id = editing.id || editing._id;
      await api.patch(`/admin/products/${id}`, {
        price: editing.price,
        mrp: editing.mrp,
        stockQuantity: editing.stockQuantity,
        isActive: editing.isActive,
        isFeatured: editing.isFeatured,
        badge: editing.badge,
      });
      setMsg("✅ Saved");
      setEditing(null);
      void load();
    } catch (err) {
      setMsg("❌ " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .ap-table { width: 100%; border-collapse: collapse; }
        .ap-th { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(68,42,27,0.3); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(200,150,62,0.1); font-weight: 400; }
        .ap-td { padding: 14px; border-bottom: 1px solid rgba(68,42,27,0.04); font-size: 13px; color: rgba(68,42,27,0.7); vertical-align: middle; }
        .ap-tr:hover .ap-td { background: rgba(200,150,62,0.03); }
        .ap-name { color: #442a1b; font-size: 14px; font-weight: 400; }
        .ap-sku { font-size: 11px; color: rgba(68,42,27,0.3); font-family: monospace; }
        .ap-badge-ok  { display:inline-block; padding: 2px 9px; font-size: 10px; border-radius: 2px; background: rgba(76,175,80,0.12); color: #3f7a3a; }
        .ap-badge-off { display:inline-block; padding: 2px 9px; font-size: 10px; border-radius: 2px; background: rgba(220,50,50,0.12); color: #c0392b; }
        .ap-stock-ok  { display:inline-block; padding: 2px 9px; font-size: 11px; border-radius: 2px; background: rgba(76,175,80,0.1); color: #3f7a3a; }
        .ap-stock-low { display:inline-block; padding: 2px 9px; font-size: 11px; border-radius: 2px; background: rgba(255,152,0,0.12); color: #c26a12; }
        .ap-stock-out { display:inline-block; padding: 2px 9px; font-size: 11px; border-radius: 2px; background: rgba(220,50,50,0.12); color: #c0392b; }
        .ap-edit-btn { background: transparent; border: 1px solid rgba(200,150,62,0.3); color: rgba(68,42,27,0.65); font-size: 11px; letter-spacing: 0.1em; padding: 6px 14px; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .ap-edit-btn:hover { border-color: rgba(200,150,62,0.7); color: #442a1b; }
        /* modal */
        .ap-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .ap-modal { background: #ffffff; border: 1px solid rgba(200,150,62,0.2); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 36px; border-radius: 4px; }
        .ap-modal-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 26px; font-weight: 600; color: #442a1b; margin: 0 0 28px; }
        .ap-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ap-form-full { grid-column: 1 / -1; }
        .ap-form-field { display: flex; flex-direction: column; gap: 5px; }
        .ap-form-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(68,42,27,0.4); }
        .ap-form-input, .ap-form-select { background: rgba(68,42,27,0.04); border: 1px solid rgba(200,150,62,0.18); color: #442a1b; font-family: var(--font-jost,'Jost'),sans-serif; font-size: 13px; font-weight: 300; padding: 10px 12px; outline: none; transition: border-color 0.2s; border-radius: 2px; }
        .ap-form-input:focus, .ap-form-select:focus { border-color: rgba(200,150,62,0.5); }
        .ap-form-select option { background: #ffffff; }
        .ap-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
        .ap-save-btn { background: #C8963E; color: #ffffff; border: none; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; padding: 12px 22px; cursor: pointer; transition: background 0.2s; border-radius: 2px; }
        .ap-save-btn:hover { background: #b5852f; }
        .ap-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ap-cancel-btn { background: transparent; border: 1px solid rgba(200,150,62,0.25); color: rgba(68,42,27,0.55); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 22px; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .ap-cancel-btn:hover { border-color: rgba(200,150,62,0.6); color: rgba(68,42,27,0.9); }
        .ap-msg-ok  { font-size: 12px; color: #3f7a3a; padding: 8px 0; }
        .ap-msg-err { font-size: 12px; color: #c0392b; padding: 8px 0; }
      `}</style>

      {msg && <p className={msg.startsWith("✅") ? "ap-msg-ok" : "ap-msg-err"} style={{ marginBottom: 12 }}>{msg}</p>}

      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 14 }}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 14, textAlign: "center", padding: "48px 0" }}>
          No products found.
        </p>
      ) : (
        <table className="ap-table">
          <thead>
            <tr>
              <th className="ap-th">Product</th>
              <th className="ap-th">Price</th>
              <th className="ap-th">Stock</th>
              <th className="ap-th">Status</th>
              {!readOnly && <th className="ap-th">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const pid = p.id || p._id || "";
              return (
                <tr key={pid} className="ap-tr">
                  <td className="ap-td">
                    <p className="ap-name">{p.name}</p>
                    {p.sku && <p className="ap-sku">SKU: {p.sku}</p>}
                  </td>
                  <td className="ap-td">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="ap-td">
                    <span className={p.stockQuantity > 10 ? "ap-stock-ok" : p.stockQuantity > 0 ? "ap-stock-low" : "ap-stock-out"}>
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td className="ap-td">
                    <span className={p.isActive ? "ap-badge-ok" : "ap-badge-off"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="ap-td">
                      <button className="ap-edit-btn" onClick={() => setEditing(p)}>Edit</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="ap-modal-bg" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className="ap-modal">
            <h2 className="ap-modal-title">Edit — {editing.name}</h2>
            <div className="ap-form-grid">
              <div className="ap-form-field">
                <label className="ap-form-label">Sale Price (₹)</label>
                <input type="number" className="ap-form-input" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">MRP (₹)</label>
                <input type="number" className="ap-form-input" value={editing.mrp || ""} onChange={(e) => setEditing({ ...editing, mrp: +e.target.value })} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Stock Units</label>
                <input type="number" className="ap-form-input" value={editing.stockQuantity} onChange={(e) => setEditing({ ...editing, stockQuantity: +e.target.value })} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Badge</label>
                <select className="ap-form-select" value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })}>
                  <option value="">None</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New</option>
                  <option value="20% Off">20% Off</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Status</label>
                <select className="ap-form-select" value={editing.isActive ? "true" : "false"} onChange={(e) => setEditing({ ...editing, isActive: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Featured</label>
                <select className="ap-form-select" value={editing.isFeatured ? "true" : "false"} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.value === "true" })}>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>
            </div>

            {msg && <p className={msg.startsWith("✅") ? "ap-msg-ok" : "ap-msg-err"}>{msg}</p>}

            <div className="ap-form-actions">
              <button className="ap-cancel-btn" onClick={() => setEditing(null)}>Cancel</button>
              <button className="ap-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
