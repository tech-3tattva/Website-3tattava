"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminOrders from "@/components/admin/AdminOrders";

type Tab = "overview" | "products" | "inventory" | "orders" | "shipments" | "leads" | "influencers";

type Stats = {
  revenue: { today: number; month: number; year: number };
  orders: { total: number; pending: number };
  inventory: { lowStockProducts: number; inventoryValue: number };
  products: { totalActive: number };
};

// ─────────────────────────────────────────────
// SHIPMENTS PANEL
// ─────────────────────────────────────────────
type ShipmentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  shipment?: {
    awbNumber?: string;
    courierName?: string;
    nimbusStatus?: string;
    labelUrl?: string;
    lastTrackedAt?: string;
  };
  shippingAddress?: { firstName: string; lastName: string; city: string; pincode: string };
};

function AdminShipments() {
  const [mode, setMode] = useState<"active" | "pending" | "ndr">("active");
  const [orders, setOrders] = useState<ShipmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        mode === "pending" ? "/admin/shipments/pending" :
        mode === "ndr" ? "/admin/shipments/ndr" :
        "/admin/shipments";
      const data = await adminApi.get<{ orders: ShipmentOrder[] } | ShipmentOrder[]>(endpoint);
      setOrders(Array.isArray(data) ? data : (data as { orders: ShipmentOrder[] }).orders);
    } catch { setOrders([]); }
    setLoading(false);
  }, [mode]);

  useEffect(() => { void load(); }, [load]);

  async function bookShipment(orderId: string) {
    setMsg(null);
    try {
      await adminApi.post("/shipments/create", { orderId });
      setMsg("Shipment booked successfully");
      void load();
    } catch (e) { setMsg(e instanceof Error ? e.message : "Failed"); }
  }

  const statusColour: Record<string, string> = {
    booked: "#C8963E", in_transit: "#60a5fa", delivered: "#4ade80",
    cancelled: "#f87171", ndr: "#fb923c", rto: "#f87171",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["active","pending","ndr"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 16px", fontSize: 12, letterSpacing: "0.1em",
            background: mode === m ? "#C8963E" : "rgba(200,150,62,0.08)",
            color: mode === m ? "#0f0f0f" : "rgba(245,240,235,0.6)",
            border: "1px solid rgba(200,150,62,0.2)", cursor: "pointer", borderRadius: 3,
            textTransform: "uppercase",
          }}>
            {m === "active" ? "All Shipments" : m === "pending" ? "Pending Booking" : "NDR / Exceptions"}
          </button>
        ))}
      </div>
      {msg && <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 12 }}>{msg}</p>}
      {loading ? <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>Loading…</p> : orders.length === 0 ? (
        <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>
          {mode === "pending" ? "No paid orders waiting for shipment booking." : "No records found."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: "#1a1a1a", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F0EB", marginBottom: 2 }}>{o.orderNumber}</p>
                  {o.shippingAddress && (
                    <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)" }}>
                      {o.shippingAddress.firstName} {o.shippingAddress.lastName} — {o.shippingAddress.city}, {o.shippingAddress.pincode}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#C8963E" }}>₹{o.total.toLocaleString("en-IN")}</p>
                  {o.shipment?.awbNumber ? (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 11, background: statusColour[o.shipment.nimbusStatus ?? ""] || "#444", color: "#0f0f0f", padding: "2px 8px", borderRadius: 2, fontWeight: 600 }}>
                        {o.shipment.nimbusStatus?.toUpperCase() ?? "BOOKED"}
                      </span>
                      <p style={{ fontSize: 12, color: "rgba(245,240,235,0.5)", marginTop: 4 }}>AWB: {o.shipment.awbNumber}</p>
                      <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)" }}>{o.shipment.courierName}</p>
                      {o.shipment.labelUrl && (
                        <a href={o.shipment.labelUrl} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, color: "#C8963E", textDecoration: "underline" }}>
                          Download Label
                        </a>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => void bookShipment(o.id)} style={{
                      marginTop: 6, padding: "5px 12px", fontSize: 11, background: "#C8963E",
                      color: "#0f0f0f", border: "none", cursor: "pointer", borderRadius: 2, fontWeight: 600,
                    }}>
                      Book Shipment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LEADS PANEL
// ─────────────────────────────────────────────
type Lead = {
  _id: string; name: string; email: string; phone: string;
  interest: string; source: string; converted: boolean; createdAt: string;
};

function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await adminApi.get<{ leads: Lead[]; total: number }>("/admin/leads");
      setLeads(d.leads); setTotal(d.total);
    } catch { setLeads([]); }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function markConverted(id: string) {
    await adminApi.patch(`/admin/leads/${id}/convert`, {});
    setLeads(prev => prev.map(l => l._id === id ? { ...l, converted: true } : l));
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: "rgba(245,240,235,0.35)", marginBottom: 18 }}>
        {total} total leads captured from the homepage modal
      </p>
      {loading ? <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>Loading…</p> : leads.length === 0 ? (
        <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>No leads yet. The modal fires at 45s / 70% scroll.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                {["Name","Email","Phone","Interest","Source","Date","Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                  <td style={{ padding: "10px 12px", color: "#F5F0EB" }}>{l.name}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.6)" }}>{l.email}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.6)" }}>{l.phone}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.4)", fontSize: 12 }}>{l.interest}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.4)", fontSize: 12 }}>{l.source}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.35)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {l.converted ? (
                      <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>CONVERTED</span>
                    ) : (
                      <button onClick={() => void markConverted(l._id)} style={{
                        fontSize: 10, padding: "3px 9px", background: "rgba(200,150,62,0.12)",
                        color: "#C8963E", border: "1px solid rgba(200,150,62,0.3)", cursor: "pointer", borderRadius: 2,
                      }}>Mark Converted</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// INFLUENCERS / PROMO PANEL
// ─────────────────────────────────────────────
type InfluencerOverview = {
  id: string; name: string; code: string;
  directRedemptions: number; rollupRedemptions: number;
  rollupRevenue: number; goalPct: number | null; rewardStatus: string;
};
type Redemption = {
  _id: string; code: string; netAmount: number;
  discountPercent: number; status: string; createdAt: string;
  orderNumber?: string;
};

function AdminInfluencers() {
  const [subTab, setSubTab] = useState<"micros" | "codes" | "redemptions" | "rewards">("micros");
  const [micros, setMicros] = useState<InfluencerOverview[]>([]);
  const [totals, setTotals] = useState<{ redemptions: number; revenue: number }>({ redemptions: 0, revenue: 0 });
  const [rewardQueueCount, setRewardQueueCount] = useState(0);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [codes, setCodes] = useState<{ id: string; code: string; codeType: string; discountPercent: number; usedCount: number; status: string }[]>([]);
  const [rewards, setRewards] = useState<{ id: string; name: string; phone: string; promoCode: string; deal: { rewardNote?: string; goalRedemptions: number }; counters: { rollupRedemptions: number } }[]>([]);
  const [loading, setLoading] = useState(true);

  // Create influencer form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", tier: "micro", promoCode: "", discountPercent: "20", goalRedemptions: "50" });
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.get<{ micros: InfluencerOverview[]; totals: { redemptions: number; revenue: number }; rewardQueueCount: number }>("/admin/influencers/overview");
      setMicros(d.micros); setTotals(d.totals); setRewardQueueCount(d.rewardQueueCount);
    } catch { setMicros([]); }
    setLoading(false);
  }, []);

  const loadRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.get<{ redemptions: Redemption[] }>("/promo/redemptions");
      setRedemptions(d.redemptions);
    } catch { setRedemptions([]); }
    setLoading(false);
  }, []);

  const loadCodes = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.get<typeof codes>("/promo/codes");
      setCodes(d);
    } catch { setCodes([]); }
    setLoading(false);
  }, []);

  const loadRewards = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.get<typeof rewards>("/promo/rewards/queue");
      setRewards(d);
    } catch { setRewards([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (subTab === "micros") void loadOverview();
    else if (subTab === "redemptions") void loadRedemptions();
    else if (subTab === "codes") void loadCodes();
    else if (subTab === "rewards") void loadRewards();
  }, [subTab, loadOverview, loadRedemptions, loadCodes, loadRewards]);

  async function createInfluencer() {
    setFormMsg(null);
    try {
      await adminApi.post("/promo/influencers", {
        name: form.name, phone: form.phone, tier: form.tier,
        promoCode: form.promoCode, discountPercent: Number(form.discountPercent),
        goalRedemptions: Number(form.goalRedemptions),
      });
      setFormMsg("Influencer created ✓");
      setShowForm(false);
      void loadOverview();
    } catch (e) { setFormMsg(e instanceof Error ? e.message : "Failed"); }
  }

  async function fulfillReward(id: string) {
    await adminApi.post(`/promo/rewards/${id}/fulfill`, {});
    void loadRewards();
  }

  const rewardColour: Record<string, string> = {
    none: "rgba(245,240,235,0.2)", pending: "#fb923c", earned: "#C8963E", fulfilled: "#4ade80",
  };

  const SUB = [
    { id: "micros", label: "Micro Influencers" },
    { id: "codes", label: "Code Registry" },
    { id: "redemptions", label: "Redemption Ledger" },
    { id: "rewards", label: `Reward Queue${rewardQueueCount > 0 ? ` (${rewardQueueCount})` : ""}` },
  ] as const;

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Redemptions", value: totals.redemptions },
          { label: "Total Revenue (via codes)", value: `₹${totals.revenue.toLocaleString("en-IN")}` },
          { label: "Rewards Pending Payout", value: rewardQueueCount, alert: rewardQueueCount > 0 },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "14px 18px" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,235,0.3)", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: s.alert ? "#fb923c" : "#C8963E" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid rgba(200,150,62,0.1)", paddingBottom: 12 }}>
        {SUB.map(s => (
          <button key={s.id} onClick={() => setSubTab(s.id)} style={{
            padding: "5px 14px", fontSize: 11, letterSpacing: "0.08em",
            background: subTab === s.id ? "rgba(200,150,62,0.15)" : "transparent",
            color: subTab === s.id ? "#C8963E" : "rgba(245,240,235,0.4)",
            border: subTab === s.id ? "1px solid rgba(200,150,62,0.3)" : "1px solid transparent",
            cursor: "pointer", borderRadius: 2, textTransform: "uppercase",
          }}>{s.label}</button>
        ))}
        <button onClick={() => setShowForm(!showForm)} style={{
          marginLeft: "auto", padding: "5px 14px", fontSize: 11,
          background: "#C8963E", color: "#0f0f0f", border: "none",
          cursor: "pointer", borderRadius: 2, fontWeight: 600, letterSpacing: "0.08em",
        }}>+ Add Influencer</button>
      </div>

      {/* Add influencer form */}
      {showForm && (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(200,150,62,0.2)", borderRadius: 3, padding: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F0EB", marginBottom: 16 }}>New Influencer</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { key: "name", label: "Full Name" },
              { key: "phone", label: "Phone (91XXXXXXXXXX)" },
              { key: "promoCode", label: "Promo Code (e.g. PRIYA)" },
              { key: "discountPercent", label: "Discount %" },
              { key: "goalRedemptions", label: "Goal Redemptions" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", marginBottom: 4, textTransform: "uppercase" }}>{f.label}</label>
                <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#141414", border: "1px solid rgba(200,150,62,0.2)", color: "#F5F0EB", padding: "7px 10px", fontSize: 13, borderRadius: 2 }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", marginBottom: 4, textTransform: "uppercase" }}>Tier</label>
              <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(200,150,62,0.2)", color: "#F5F0EB", padding: "7px 10px", fontSize: 13, borderRadius: 2 }}>
                <option value="micro">Micro (20% off, owns children)</option>
                <option value="nano">Nano (15% off, child of micro)</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => void createInfluencer()} style={{ padding: "7px 20px", background: "#C8963E", color: "#0f0f0f", border: "none", cursor: "pointer", borderRadius: 2, fontWeight: 600, fontSize: 13 }}>Create</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "7px 16px", background: "transparent", color: "rgba(245,240,235,0.4)", border: "1px solid rgba(200,150,62,0.15)", cursor: "pointer", borderRadius: 2, fontSize: 13 }}>Cancel</button>
            {formMsg && <p style={{ fontSize: 12, color: formMsg.includes("✓") ? "#4ade80" : "#f87171" }}>{formMsg}</p>}
          </div>
        </div>
      )}

      {loading ? <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>Loading…</p> : (
        <>
          {/* Micro influencer cards */}
          {subTab === "micros" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {micros.length === 0 ? <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>No influencers yet. Add one above.</p> : micros.map(m => (
                <div key={m.id} style={{ background: "#1a1a1a", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F0EB" }}>{m.name}</p>
                      <p style={{ fontSize: 12, color: "#C8963E", letterSpacing: "0.1em", marginTop: 2 }}>{m.code}</p>
                    </div>
                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "#F5F0EB" }}>{m.rollupRedemptions}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", letterSpacing: "0.1em" }}>TOTAL ORDERS</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "#C8963E" }}>₹{m.rollupRevenue.toLocaleString("en-IN")}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", letterSpacing: "0.1em" }}>REVENUE</p>
                      </div>
                      {m.goalPct !== null && (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 20, fontWeight: 700, color: m.goalPct >= 100 ? "#4ade80" : "#fb923c" }}>{m.goalPct}%</p>
                          <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", letterSpacing: "0.1em" }}>GOAL</p>
                        </div>
                      )}
                      <span style={{ fontSize: 11, padding: "3px 10px", background: rewardColour[m.rewardStatus] || "#444", color: "#0f0f0f", borderRadius: 2, fontWeight: 600, letterSpacing: "0.08em" }}>
                        {m.rewardStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Code registry */}
          {subTab === "codes" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                    {["Code","Type","Discount","Used","Max","Status"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {codes.map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                      <td style={{ padding: "10px 12px", color: "#C8963E", fontWeight: 600, letterSpacing: "0.08em" }}>{c.code}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.5)", fontSize: 12 }}>{c.codeType}</td>
                      <td style={{ padding: "10px 12px", color: "#F5F0EB" }}>{c.discountPercent}%</td>
                      <td style={{ padding: "10px 12px", color: "#F5F0EB" }}>{c.usedCount}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.4)" }}>∞</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 11, color: c.status === "active" ? "#4ade80" : "#f87171" }}>{c.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Redemption ledger */}
          {subTab === "redemptions" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                    {["Code","Order","Net Amount","Discount","Status","Date"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map(r => (
                    <tr key={r._id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                      <td style={{ padding: "10px 12px", color: "#C8963E", fontWeight: 600 }}>{r.code}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.6)" }}>{r.orderNumber ?? "—"}</td>
                      <td style={{ padding: "10px 12px", color: "#F5F0EB" }}>₹{r.netAmount.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.5)" }}>{r.discountPercent}%</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 11, color: r.status === "completed" ? "#4ade80" : "#f87171" }}>{r.status.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.35)", fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reward queue */}
          {subTab === "rewards" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rewards.length === 0 ? (
                <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>No rewards pending payout.</p>
              ) : rewards.map(r => (
                <div key={r.id} style={{ background: "#1a1a1a", border: "1px solid rgba(200,150,62,0.2)", borderRadius: 3, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F0EB" }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "#C8963E", marginTop: 2 }}>Code: {r.promoCode} · Phone: {r.phone}</p>
                    <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)", marginTop: 2 }}>{r.counters.rollupRedemptions} / {r.deal.goalRedemptions} orders reached</p>
                    {r.deal.rewardNote && <p style={{ fontSize: 12, color: "#fb923c", marginTop: 2 }}>Reward: {r.deal.rewardNote}</p>}
                  </div>
                  <button onClick={() => void fulfillReward(r.id)} style={{
                    padding: "8px 18px", background: "#4ade80", color: "#0f0f0f",
                    border: "none", cursor: "pointer", borderRadius: 2, fontWeight: 600, fontSize: 12,
                  }}>Mark Fulfilled</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name.split("—")[0].trim());

    adminApi.get<Stats>("/admin/dashboard")
      .then(setStats)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setAuthChecked(true));
  }, [router]);

  const handleLogout = async () => {
    try { await adminApi.post("/auth/admin/auth/logout", {}); } catch {}
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

  const NAV: { id: Tab; label: string; icon: string }[] = [
    { id: "overview",     label: "Overview",     icon: "◈" },
    { id: "products",     label: "Products",     icon: "◉" },
    { id: "inventory",    label: "Inventory",    icon: "▣" },
    { id: "orders",       label: "Orders",       icon: "◎" },
    { id: "shipments",    label: "Shipments",    icon: "◫" },
    { id: "leads",        label: "Leads",        icon: "◑" },
    { id: "influencers",  label: "Influencers",  icon: "◐" },
  ];

  const PAGE_TITLE: Record<Tab, string> = {
    overview: "Dashboard", products: "Products", inventory: "Inventory",
    orders: "Orders", shipments: "Shipments", leads: "Leads & Signups",
    influencers: "Influencers & Promo Codes",
  };
  const PAGE_SUB: Record<Tab, string> = {
    overview: "Live business snapshot",
    products: "Manage your product catalogue",
    inventory: "Track and update stock levels",
    orders: "View and manage customer orders",
    shipments: "NimbusPost shipment tracking & NDR management",
    leads: "Homepage modal captures, newsletter & bookings",
    influencers: "Two-tier referral system, promo codes & reward payouts",
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .ad-shell { display: flex; min-height: 100vh; background: #0f0f0f; color: #F5F0EB; font-family: var(--font-jost,'Jost'),sans-serif; }
        .ad-sidebar { width: 228px; min-height: 100vh; background: #141414; border-right: 1px solid rgba(200,150,62,0.1); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; padding: 28px 0; flex-shrink: 0; }
        .ad-logo { padding: 0 24px 28px; border-bottom: 1px solid rgba(200,150,62,0.08); }
        .ad-logo-name { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 21px; font-weight: 700; color: #F5F0EB; letter-spacing: 0.05em; }
        .ad-logo-sub { font-size: 9px; letter-spacing: 0.3em; color: #C8963E; text-transform: uppercase; margin-top: 2px; }
        .ad-nav { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
        .ad-nav-btn { display: flex; align-items: center; gap: 11px; padding: 10px 14px; border-radius: 3px; cursor: pointer; font-size: 13px; font-weight: 400; color: rgba(245,240,235,0.42); transition: all 0.18s; background: transparent; border: none; width: 100%; text-align: left; letter-spacing: 0.02em; }
        .ad-nav-btn:hover { color: rgba(245,240,235,0.82); background: rgba(200,150,62,0.06); }
        .ad-nav-btn.active { color: #F5F0EB; background: rgba(200,150,62,0.1); border-left: 2px solid #C8963E; }
        .ad-nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .ad-nav-divider { height: 1px; background: rgba(200,150,62,0.08); margin: 8px 14px; }
        .ad-sidebar-foot { padding: 18px 10px; border-top: 1px solid rgba(200,150,62,0.08); }
        .ad-logout { display: flex; align-items: center; gap: 9px; width: 100%; padding: 10px 14px; background: transparent; border: 1px solid rgba(200,150,62,0.14); color: rgba(245,240,235,0.38); font-family: var(--font-jost,'Jost'),sans-serif; font-size: 12px; letter-spacing: 0.08em; cursor: pointer; transition: all 0.18s; border-radius: 3px; }
        .ad-logout:hover { border-color: rgba(200,150,62,0.4); color: rgba(245,240,235,0.75); }
        .ad-main { flex: 1; padding: 36px 40px; overflow-y: auto; min-width: 0; }
        .ad-topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; }
        .ad-page-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 34px; font-weight: 700; color: #F5F0EB; }
        .ad-page-sub { font-size: 12px; color: rgba(245,240,235,0.32); margin-top: 3px; font-weight: 300; }
        .ad-greeting { text-align: right; }
        .ad-greeting-name { font-size: 13px; color: rgba(245,240,235,0.38); }
        .ad-greeting-name strong { color: #C8963E; font-weight: 500; }
        .ad-greeting-date { font-size: 11px; color: rgba(245,240,235,0.2); margin-top: 2px; }
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
        .ad-section-title { font-family: var(--font-cormorant,'Cormorant Garamond'),serif; font-size: 22px; font-weight: 600; color: #F5F0EB; margin-bottom: 18px; }
        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: repeat(2,1fr); }
          .ad-main { padding: 24px 20px; }
          .ad-sidebar { display: none; }
        }
      `}</style>

      <div className="ad-shell">
        <aside className="ad-sidebar">
          <div className="ad-logo">
            <div className="ad-logo-name">3TATTAVA</div>
            <div className="ad-logo-sub">Operations Center</div>
          </div>

          <nav className="ad-nav">
            {NAV.slice(0, 4).map((n) => (
              <button key={n.id} className={`ad-nav-btn${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="ad-nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
            <div className="ad-nav-divider" />
            {NAV.slice(4).map((n) => (
              <button key={n.id} className={`ad-nav-btn${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="ad-nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>

          <div className="ad-sidebar-foot">
            <button className="ad-logout" onClick={handleLogout}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        <main className="ad-main">
          <div className="ad-topbar">
            <div>
              <h1 className="ad-page-title">{PAGE_TITLE[tab]}</h1>
              <p className="ad-page-sub">{PAGE_SUB[tab]}</p>
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

          {tab === "products"    && <AdminProducts />}
          {tab === "inventory"   && <AdminInventory />}
          {tab === "orders"      && <AdminOrders />}
          {tab === "shipments"   && <AdminShipments />}
          {tab === "leads"       && <AdminLeads />}
          {tab === "influencers" && <AdminInfluencers />}
        </main>
      </div>
    </>
  );
}
