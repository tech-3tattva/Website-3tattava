"use client";

import { useEffect, useState } from "react";
import { adminApi as api } from "@/lib/api";

type CatalogueProduct = { id?: string; _id?: string; name: string; price: number; stockQuantity?: number };
type Line = { productId: string; quantity: number };

/** Payment routes for an order that did not go through the website gateway. */
const PAYMENT_MODES: [string, string][] = [
  ["upi_direct", "UPI (direct to us)"],
  ["bank_transfer", "Bank transfer"],
  ["cash", "Cash"],
  ["card_machine", "Card machine"],
  ["cod", "Cash on delivery"],
  ["sample", "Free sample (₹0)"],
];

/**
 * Records a phone / WhatsApp / in-person / sampling order so it lands in the
 * same order book as web checkouts, instead of being keyed straight into the
 * courier panel where reporting never sees it.
 */
export default function ManualOrderForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [lines, setLines] = useState<Line[]>([{ productId: "", quantity: 1 }]);
  const [addr, setAddr] = useState({
    title: "", firstName: "", lastName: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [paymentMode, setPaymentMode] = useState("upi_direct");
  const [paid, setPaid] = useState(true);
  const [shippingFee, setShippingFee] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderNumber: string; total: number; id: string } | null>(null);
  const [shipMsg, setShipMsg] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ products: CatalogueProduct[] }>("/products?limit=100")
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, []);

  const isSample = paymentMode === "sample";
  const priceOf = (id: string) => {
    const p = products.find((x) => (x.id || x._id) === id);
    return isSample ? 0 : Number(p?.price) || 0;
  };
  const subtotal = lines.reduce((s, l) => s + priceOf(l.productId) * l.quantity, 0);
  const total = isSample ? 0 : subtotal + Number(shippingFee || 0);

  async function submit() {
    setError(null);
    const items = lines.filter((l) => l.productId && l.quantity > 0);
    if (!items.length) { setError("Add at least one product."); return; }
    if (!addr.firstName.trim() || addr.phone.replace(/\D/g, "").length < 10) {
      setError("Customer name and a 10-digit phone are required."); return;
    }
    if (!addr.line1.trim() || !addr.city.trim() || !addr.state.trim() || addr.pincode.replace(/\D/g, "").length < 6) {
      setError("Full address with a 6-digit pincode is required."); return;
    }
    setBusy(true);
    try {
      const payload = {
        items,
        shippingAddress: {
          ...(addr.title ? { title: addr.title } : {}),
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
        paymentMode,
        paid: isSample ? true : paid,
        shippingFee: isSample ? 0 : Number(shippingFee || 0),
        ...(note.trim() ? { note: note.trim() } : {}),
      };
      const created = await api.post<{ orderNumber: string; total: number; id: string }>("/admin/orders/manual", payload);
      setDone({ orderNumber: created.orderNumber, total: created.total, id: created.id });
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the order.");
    }
    setBusy(false);
  }

  /** Hand the saved order to NimbusPost using the existing admin shipment route. */
  async function createShipment() {
    if (!done) return;
    setShipMsg("Sending to NimbusPost…");
    try {
      const r = await api.post<{ shipment?: { awbNumber?: string; courierName?: string }; message?: string }>(
        "/shipments/create", { orderId: done.id }
      );
      const awb = r.shipment?.awbNumber;
      setShipMsg(awb ? `Shipment created — AWB ${awb} (${r.shipment?.courierName || "courier assigned"})`
                     : r.message || "Sent to NimbusPost. AWB will appear once a courier is assigned.");
    } catch (e) {
      setShipMsg(e instanceof Error ? e.message : "Could not reach NimbusPost.");
    }
  }

  return (
    <div className="mo-wrap" onClick={onClose}>
      <style>{`
        .mo-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1100; display: flex; align-items: flex-start; justify-content: center; padding: 28px 14px; overflow-y: auto; }
        .mo-modal { background: #fdfaf3; border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 680px; padding: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.28); }
        .mo-h { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
        .mo-title { font-size: 19px; font-weight: 700; color: #442a1b; margin: 0; }
        .mo-sub { font-size: 13px; color: rgba(68,42,27,0.6); margin: 2px 0 16px; }
        .mo-x { border: none; background: transparent; font-size: 25px; line-height: 1; color: rgba(68,42,27,0.45); cursor: pointer; }
        .mo-sec { font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(68,42,27,0.5); font-weight: 600; margin: 16px 0 8px; }
        .mo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 9px; }
        .mo-in, .mo-sel { width: 100%; background: #fff; border: 1px solid rgba(200,150,62,0.3); border-radius: 5px; padding: 10px 11px; font-size: 13.5px; color: #442a1b; font-family: inherit; outline: none; }
        .mo-in:focus, .mo-sel:focus { border-color: #C8963E; }
        .mo-line { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
        .mo-line .mo-sel { flex: 1 1 auto; }
        .mo-qty { width: 78px; flex-shrink: 0; }
        .mo-del { border: 1px solid rgba(192,57,43,0.3); background: #fff; color: #c0392b; border-radius: 5px; width: 36px; height: 38px; cursor: pointer; flex-shrink: 0; font-size: 16px; }
        .mo-add { border: 1px dashed rgba(200,150,62,0.5); background: transparent; color: #8a5a10; border-radius: 5px; padding: 9px 14px; font-size: 12.5px; cursor: pointer; font-family: inherit; }
        .mo-tot { background: #fff; border: 1px solid rgba(200,150,62,0.16); border-radius: 6px; padding: 11px 14px; margin-top: 12px; }
        .mo-tot-row { display: flex; justify-content: space-between; font-size: 13.5px; padding: 4px 0; color: rgba(68,42,27,0.8); }
        .mo-tot-row.big { font-size: 16px; font-weight: 700; color: #442a1b; border-top: 1px solid rgba(68,42,27,0.08); margin-top: 5px; padding-top: 8px; }
        .mo-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; flex-wrap: wrap; }
        .mo-btn { padding: 12px 22px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; border: none; }
        .mo-btn.primary { background: linear-gradient(135deg,#C8963E,#b8801f); color: #1c1304; }
        .mo-btn.ghost { background: #fff; border: 1px solid rgba(200,150,62,0.35); color: #442a1b; }
        .mo-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .mo-err { background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.25); color: #c0392b; font-size: 13px; padding: 9px 12px; border-radius: 5px; margin-top: 12px; }
        .mo-ok { background: rgba(46,125,50,0.08); border: 1px solid rgba(46,125,50,0.25); color: #2e7d32; font-size: 13.5px; padding: 12px 14px; border-radius: 6px; }
        .mo-note { font-size: 12px; color: rgba(68,42,27,0.55); margin-top: 6px; }
        .mo-chk { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #442a1b; }
      `}</style>

      <div className="mo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mo-h">
          <div>
            <h3 className="mo-title">Record an offline order</h3>
            <p className="mo-sub">Phone, WhatsApp, in-person or doctor sampling. Keeps it in the order book and out of the courier panel.</p>
          </div>
          <button className="mo-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        {done ? (
          <>
            <div className="mo-ok">
              Order <strong>{done.orderNumber}</strong> created · total ₹{done.total.toLocaleString("en-IN")}
            </div>
            <p className="mo-sec">Shipping</p>
            <p className="mo-note">Push this order to NimbusPost to get an AWB. Status then syncs back automatically.</p>
            {shipMsg && <div className="mo-ok" style={{ marginTop: 10 }}>{shipMsg}</div>}
            <div className="mo-actions">
              <button className="mo-btn ghost" onClick={onClose}>Done</button>
              <button className="mo-btn primary" onClick={createShipment} disabled={!!shipMsg}>Create shipment →</button>
            </div>
          </>
        ) : (
          <>
            <p className="mo-sec">Products</p>
            {lines.map((l, i) => (
              <div className="mo-line" key={i}>
                <select className="mo-sel" value={l.productId}
                  onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))}>
                  <option value="">Select a product…</option>
                  {products.map((p) => {
                    const id = p.id || p._id || "";
                    return <option key={id} value={id}>{p.name} — ₹{p.price}</option>;
                  })}
                </select>
                <input className="mo-in mo-qty" type="number" min={1} value={l.quantity}
                  onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, Number(e.target.value) || 1) } : x)))} />
                {lines.length > 1 && (
                  <button className="mo-del" onClick={() => setLines(lines.filter((_, j) => j !== i))} aria-label="Remove line">×</button>
                )}
              </div>
            ))}
            <button className="mo-add" onClick={() => setLines([...lines, { productId: "", quantity: 1 }])}>+ Add product</button>

            <p className="mo-sec">Customer</p>
            <div className="mo-grid">
              <select className="mo-sel" value={addr.title} onChange={(e) => setAddr({ ...addr, title: e.target.value })}>
                <option value="">Title</option>{["Mr.", "Mrs.", "Ms.", "Dr."].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="mo-in" placeholder="First name *" value={addr.firstName} onChange={(e) => setAddr({ ...addr, firstName: e.target.value })} />
              <input className="mo-in" placeholder="Last name" value={addr.lastName} onChange={(e) => setAddr({ ...addr, lastName: e.target.value })} />
              <input className="mo-in" placeholder="Phone *" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
              <input className="mo-in" placeholder="Email (optional)" value={addr.email} onChange={(e) => setAddr({ ...addr, email: e.target.value })} />
            </div>
            <p className="mo-note">No email? Leave it blank — we store an internal placeholder instead of a fake address.</p>

            <p className="mo-sec">Delivery address</p>
            <div className="mo-grid">
              <input className="mo-in" placeholder="Address line 1 *" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} />
              <input className="mo-in" placeholder="Line 2" value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} />
              <input className="mo-in" placeholder="City *" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              <input className="mo-in" placeholder="State *" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
              <input className="mo-in" placeholder="Pincode *" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} />
            </div>

            <p className="mo-sec">Payment</p>
            <div className="mo-grid">
              <select className="mo-sel" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                {PAYMENT_MODES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
              {!isSample && (
                <input className="mo-in" type="number" min={0} placeholder="Shipping fee"
                  value={shippingFee} onChange={(e) => setShippingFee(Math.max(0, Number(e.target.value) || 0))} />
              )}
              {!isSample && (
                <label className="mo-chk">
                  <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> Money already received
                </label>
              )}
            </div>
            {isSample && <p className="mo-note">Samples are recorded at ₹0 and excluded from revenue.</p>}

            <p className="mo-sec">Note (optional)</p>
            <input className="mo-in" placeholder="e.g. paid via GPay, ordered on WhatsApp" value={note} onChange={(e) => setNote(e.target.value)} />

            <div className="mo-tot">
              <div className="mo-tot-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              {!isSample && !!shippingFee && <div className="mo-tot-row"><span>Shipping</span><span>₹{Number(shippingFee).toLocaleString("en-IN")}</span></div>}
              <div className="mo-tot-row big"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            {error && <div className="mo-err">{error}</div>}

            <div className="mo-actions">
              <button className="mo-btn ghost" onClick={onClose} disabled={busy}>Cancel</button>
              <button className="mo-btn primary" onClick={submit} disabled={busy}>{busy ? "Saving…" : "Create order"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
