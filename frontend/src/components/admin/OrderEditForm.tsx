"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFeedback } from "@/components/admin/AdminToast";

type CatalogueProduct = { id?: string; _id?: string; name: string; price: number; stockQuantity?: number };
type Line = { productId: string; quantity: number };

export type EditableOrder = {
  id: string;
  orderNumber: string;
  status: string;
  shippingAddress?: {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    line1?: string; line2?: string; city?: string; state?: string; pincode?: string;
  };
  items: Array<{ productId: string; name: string; quantity: number }>;
  adminNote?: string;
};

/** Editing a shipped order would desync the courier's manifest from ours. */
const FROZEN = ["delivered", "cancelled"];

/**
 * Corrects an existing order — wrong pincode, wrong quantity, wrong phone.
 *
 * Before this the only mutation available was the status dropdown, so fixing a
 * mis-keyed address meant cancelling and re-recording the order, which broke
 * the audit trail and double-counted stock. The server re-prices from the
 * catalogue and reconciles stock by the delta, so this form deliberately does
 * not let anyone type a price.
 */
export default function OrderEditForm({
  order,
  onClose,
  onSaved,
}: {
  order: EditableOrder;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useFeedback();
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [lines, setLines] = useState<Line[]>(
    order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  );
  const [addr, setAddr] = useState({
    firstName: order.shippingAddress?.firstName ?? "",
    lastName: order.shippingAddress?.lastName ?? "",
    email: order.shippingAddress?.email ?? "",
    phone: order.shippingAddress?.phone ?? "",
    line1: order.shippingAddress?.line1 ?? "",
    line2: order.shippingAddress?.line2 ?? "",
    city: order.shippingAddress?.city ?? "",
    state: order.shippingAddress?.state ?? "",
    pincode: order.shippingAddress?.pincode ?? "",
  });
  const [note, setNote] = useState(order.adminNote ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(true);

  useEffect(() => {
    api
      .get<{ products: CatalogueProduct[] }>("/products?limit=100")
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, []);

  const frozen = FROZEN.includes(order.status);
  const priceOf = (id: string) => Number(products.find((x) => (x.id || x._id) === id)?.price) || 0;
  const subtotal = lines.reduce((sum, l) => sum + priceOf(l.productId) * l.quantity, 0);

  async function submit() {
    setError(null);
    const items = lines.filter((l) => l.productId && l.quantity > 0);
    if (!items.length) { setError("An order needs at least one product."); return; }
    if (!addr.firstName.trim()) { setError("Customer first name is required."); return; }
    if (addr.phone.replace(/\D/g, "").length < 10) { setError("A 10-digit phone number is required."); return; }
    if (addr.pincode && addr.pincode.replace(/\D/g, "").length !== 6) { setError("Pincode must be 6 digits."); return; }

    setBusy(true);
    try {
      // Send only what the server accepts; it re-prices and re-totals itself.
      await api.patch(`/admin/orders/${order.id}`, {
        shippingAddress: {
          firstName: addr.firstName.trim(),
          lastName: addr.lastName.trim() || "-",
          ...(addr.email.trim() ? { email: addr.email.trim() } : {}),
          phone: addr.phone.trim(),
          line1: addr.line1.trim(),
          ...(addr.line2.trim() ? { line2: addr.line2.trim() } : {}),
          city: addr.city.trim(),
          state: addr.state.trim(),
          pincode: addr.pincode.trim(),
        },
        items,
        adminNote: note,
      });
      toast("ok", `Order ${order.orderNumber} updated. Stock and totals were recalculated.`);
      onSaved();
      onClose();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save the changes.";
      setError(message);
      toast("error", `Order ${order.orderNumber} not saved — ${message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="oe-wrap" onClick={onClose}>
      <style>{`
        .oe-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1100; display: flex; align-items: flex-start; justify-content: center; padding: 20px 14px; overflow-y: auto; overscroll-behavior: contain; }
        .oe-modal { background: var(--ad-surface-2); border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 680px; box-shadow: var(--ad-shadow-lg); display: flex; flex-direction: column; max-height: calc(100vh - 40px); }
        /* Body scrolls, actions stay pinned, so Save is always reachable. */
        .oe-scroll { overflow-y: auto; overscroll-behavior: contain; padding: 20px 22px 4px; flex: 1 1 auto; }
        .oe-h { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 20px 22px 0; }
        .oe-x { border: none; background: transparent; font-size: 25px; line-height: 1; color: var(--ad-ink-3); cursor: pointer; }
        .oe-sec { margin: 16px 0 8px; }
        .oe-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 9px; }
        .oe-line { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
        .oe-line .ad-input { flex: 1 1 auto; min-width: 0; }
        .oe-qty { width: 78px; flex-shrink: 0; }
        .oe-del { border: 1px solid rgba(161,45,45,0.3); background: var(--ad-surface); color: var(--ad-bad); border-radius: var(--ad-r-sm); width: 38px; height: 38px; cursor: pointer; flex-shrink: 0; font-size: 16px; }
        .oe-add { border: 1px dashed var(--ad-gold-soft); background: transparent; color: #8a5a10; border-radius: var(--ad-r-sm); padding: 9px 14px; font-size: 12.5px; cursor: pointer; font-family: inherit; }
        .oe-tot { background: var(--ad-surface); border: 1px solid var(--ad-hairline); border-radius: var(--ad-r-sm); padding: 11px 14px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: var(--ad-ink); }
        .oe-actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; flex-shrink: 0; padding: 14px 22px; border-top: 1px solid rgba(200,150,62,0.18); background: var(--ad-surface-2); border-radius: 0 0 10px 10px; }
        .oe-err { background: rgba(161,45,45,0.08); border: 1px solid rgba(161,45,45,0.25); color: var(--ad-bad); font-size: 13px; padding: 9px 12px; border-radius: var(--ad-r-sm); margin-top: 12px; }
        .oe-frozen { background: rgba(200,150,62,0.12); border: 1px solid var(--ad-gold-soft); color: #7a4d0c; font-size: 13px; padding: 11px 13px; border-radius: var(--ad-r-sm); margin-top: 12px; line-height: 1.5; }
        .oe-in { width: 100%; }
        @media (max-width: 560px) { .oe-actions .ad-btn { flex: 1 1 auto; } }
      `}</style>

      <div className="oe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oe-h">
          <div>
            <h3 className="ad-h2">Edit order {order.orderNumber}</h3>
            <p className="ad-sub" style={{ marginTop: 3 }}>
              Prices come from the catalogue. Stock is adjusted by the difference and the
              change is recorded against the order.
            </p>
          </div>
          <button className="oe-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="oe-scroll">
          {frozen && (
            <div className="oe-frozen">
              This order is <strong>{order.status}</strong>, so it can no longer be edited — its
              stock and courier record are already settled. Reverse the status first if this
              genuinely needs correcting.
            </div>
          )}

          <p className="ad-eyebrow oe-sec">Products</p>
          {lines.map((l, i) => (
            <div className="oe-line" key={i}>
              <select
                className="ad-input"
                value={l.productId}
                disabled={frozen}
                onChange={(e) =>
                  setLines(lines.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))
                }
              >
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.name} — ₹{Number(p.price).toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
              <input
                className="ad-input oe-qty"
                type="number"
                min={1}
                value={l.quantity}
                disabled={frozen}
                aria-label="Quantity"
                onChange={(e) =>
                  setLines(
                    lines.map((x, j) =>
                      j === i ? { ...x, quantity: Math.max(1, Number(e.target.value) || 1) } : x,
                    ),
                  )
                }
              />
              {lines.length > 1 && (
                <button
                  className="oe-del"
                  disabled={frozen}
                  onClick={() => setLines(lines.filter((_, j) => j !== i))}
                  aria-label="Remove line"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {!frozen && (
            <button className="oe-add" onClick={() => setLines([...lines, { productId: "", quantity: 1 }])}>
              + Add product
            </button>
          )}

          <div className="oe-tot">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <p className="ad-eyebrow oe-sec">Customer &amp; delivery address</p>
          <div className="oe-grid">
            {([
              ["firstName", "First name"], ["lastName", "Last name"],
              ["phone", "Phone"], ["email", "Email"],
              ["city", "City"], ["state", "State"], ["pincode", "Pincode"],
            ] as const).map(([key, label]) => (
              <input
                key={key}
                className="ad-input oe-in"
                placeholder={label}
                aria-label={label}
                value={addr[key]}
                disabled={frozen}
                onChange={(e) => setAddr({ ...addr, [key]: e.target.value })}
              />
            ))}
          </div>
          <div style={{ marginTop: 9 }}>
            <input
              className="ad-input oe-in"
              placeholder="Address line 1"
              aria-label="Address line 1"
              value={addr.line1}
              disabled={frozen}
              onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 9 }}>
            <input
              className="ad-input oe-in"
              placeholder="Address line 2 (optional)"
              aria-label="Address line 2"
              value={addr.line2}
              disabled={frozen}
              onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
            />
          </div>

          <p className="ad-eyebrow oe-sec">Why was this changed?</p>
          <input
            className="ad-input oe-in"
            placeholder="e.g. customer moved, corrected pincode over the phone"
            aria-label="Reason for the change"
            value={note}
            disabled={frozen}
            onChange={(e) => setNote(e.target.value)}
          />

          {error && <div className="oe-err">{error}</div>}
        </div>

        <div className="oe-actions">
          <button className="ad-btn" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="ad-btn ad-btn-primary" onClick={submit} disabled={busy || frozen}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
