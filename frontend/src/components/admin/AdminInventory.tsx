"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";

type InventoryItem = {
  id: string;
  _id?: string;
  name: string;
  sku?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  price?: number;
};

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [updates, setUpdates] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<InventoryItem[]>("/admin/inventory").then(setItems).catch(() => {});
  }, []);

  const setStock = async (id: string, val: number) => {
    setSaving(id);
    try {
      const updated = await api.put<InventoryItem>(`/admin/inventory/${id}/set`, {
        setQuantity: val,
        reason: "Admin panel update",
      });
      setItems((prev) => prev.map((x) => (x.id === id || x._id === id) ? { ...x, stockQuantity: updated.stockQuantity } : x));
      setMsgs((m) => ({ ...m, [id]: "✅ Updated" }));
      setTimeout(() => setMsgs((m) => ({ ...m, [id]: "" })), 2500);
    } catch {
      setMsgs((m) => ({ ...m, [id]: "❌ Failed" }));
    } finally {
      setSaving(null);
    }
  };

  return (
    <>
      <style>{`
        .inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
        .inv-card { background: #ffffff; border: 1px solid rgba(200,150,62,0.1); padding: 26px; position: relative; border-radius: 4px; }
        .inv-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(200,150,62,0.3), transparent); }
        .inv-name { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 19px; font-weight: 600; color: #442a1b; margin-bottom: 3px; }
        .inv-sku { font-size: 11px; color: rgba(68,42,27,0.3); letter-spacing: 0.1em; margin-bottom: 18px; font-family: monospace; }
        .inv-count { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 46px; font-weight: 700; line-height: 1; margin-bottom: 3px; }
        .inv-count-ok  { color: #3f7a3a; }
        .inv-count-low { color: #c26a12; }
        .inv-count-out { color: #c0392b; }
        .inv-count-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(68,42,27,0.28); margin-bottom: 18px; }
        .inv-divider { height: 1px; background: rgba(200,150,62,0.08); margin: 16px 0; }
        .inv-quick { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 12px; }
        .inv-quick-btn { background: transparent; border: 1px solid rgba(200,150,62,0.18); color: rgba(68,42,27,0.5); font-family: var(--font-jost,'Jost'),sans-serif; font-size: 11px; padding: 5px 11px; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .inv-quick-btn:hover { border-color: rgba(200,150,62,0.55); color: #C8963E; }
        .inv-row { display: flex; gap: 9px; align-items: center; }
        .inv-input { flex: 1; background: rgba(68,42,27,0.04); border: 1px solid rgba(200,150,62,0.18); color: #442a1b; font-family: var(--font-jost,'Jost'),sans-serif; font-size: 15px; padding: 10px 12px; outline: none; transition: border-color 0.2s; border-radius: 2px; }
        .inv-input:focus { border-color: rgba(200,150,62,0.5); }
        .inv-btn { background: #C8963E; color: #ffffff; border: none; font-family: var(--font-jost,'Jost'),sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 18px; cursor: pointer; transition: background 0.2s; white-space: nowrap; border-radius: 2px; }
        .inv-btn:hover { background: #b5852f; }
        .inv-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .inv-msg { font-size: 11px; height: 16px; margin-top: 7px; }
      `}</style>

      <div className="inv-grid">
        {items.map((item) => {
          const id = item.id || item._id || "";
          const current = item.stockQuantity;
          const val = updates[id] !== undefined ? updates[id] : current;
          const cls = current > item.lowStockThreshold ? "ok" : current > 0 ? "low" : "out";

          return (
            <div key={id} className="inv-card">
              <p className="inv-name">{item.name}</p>
              <p className="inv-sku">{item.sku ? `SKU: ${item.sku}` : "No SKU"}</p>

              <p className={`inv-count inv-count-${cls}`}>{current}</p>
              <p className="inv-count-label">Units in stock</p>

              <div className="inv-divider" />

              <div className="inv-quick">
                {[10, 25, 50, 100].map((n) => (
                  <button key={n} className="inv-quick-btn"
                    onClick={() => setUpdates((u) => ({ ...u, [id]: current + n }))}>
                    +{n}
                  </button>
                ))}
                <button className="inv-quick-btn"
                  onClick={() => setUpdates((u) => ({ ...u, [id]: 0 }))}>
                  Set 0
                </button>
              </div>

              <div className="inv-row">
                <input
                  type="number"
                  className="inv-input"
                  value={val}
                  min={0}
                  onChange={(e) => setUpdates((u) => ({ ...u, [id]: +e.target.value }))}
                />
                <button
                  className="inv-btn"
                  disabled={saving === id}
                  onClick={() => setStock(id, val)}
                >
                  {saving === id ? "..." : "Update"}
                </button>
              </div>
              <p className="inv-msg" style={{ color: msgs[id]?.startsWith("✅") ? "#3f7a3a" : "#c0392b" }}>
                {msgs[id] || ""}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
