"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useFeedback } from "@/components/admin/AdminToast";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminAssessments from "@/components/admin/AdminAssessments";

type Tab = "overview" | "products" | "inventory" | "orders" | "shipments" | "leads" | "waitlist" | "assessments" | "influencers" | "users" | "blog";

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
    booked: "#C8963E", in_transit: "#1d4ed8", delivered: "#2e7d32",
    cancelled: "#c0392b", ndr: "#d97706", rto: "#c0392b",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["active","pending","ndr"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 16px", fontSize: 12, letterSpacing: "0.1em",
            background: mode === m ? "#C8963E" : "rgba(200,150,62,0.08)",
            color: mode === m ? "#f7f0e2" : "rgba(68,42,27,0.6)",
            border: "1px solid rgba(200,150,62,0.2)", cursor: "pointer", borderRadius: 3,
            textTransform: "uppercase",
          }}>
            {m === "active" ? "All Shipments" : m === "pending" ? "Pending Booking" : "NDR / Exceptions"}
          </button>
        ))}
      </div>
      {msg && <p style={{ color: "#2e7d32", fontSize: 13, marginBottom: 12 }}>{msg}</p>}
      {loading ? <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>Loading…</p> : orders.length === 0 ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>
          {mode === "pending" ? "No paid orders waiting for shipment booking." : "No records found."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: "#ffffff", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#442a1b", marginBottom: 2 }}>{o.orderNumber}</p>
                  {o.shippingAddress && (
                    <p style={{ fontSize: 12, color: "rgba(68,42,27,0.4)" }}>
                      {o.shippingAddress.firstName} {o.shippingAddress.lastName} — {o.shippingAddress.city}, {o.shippingAddress.pincode}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: "rgba(68,42,27,0.25)", marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#C8963E" }}>₹{o.total.toLocaleString("en-IN")}</p>
                  {o.shipment?.awbNumber ? (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 11, background: statusColour[o.shipment.nimbusStatus ?? ""] || "#444", color: "#f7f0e2", padding: "2px 8px", borderRadius: 2, fontWeight: 600 }}>
                        {o.shipment.nimbusStatus?.toUpperCase() ?? "BOOKED"}
                      </span>
                      <p style={{ fontSize: 12, color: "rgba(68,42,27,0.5)", marginTop: 4 }}>AWB: {o.shipment.awbNumber}</p>
                      <p style={{ fontSize: 11, color: "rgba(68,42,27,0.3)" }}>{o.shipment.courierName}</p>
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
                      color: "#f7f0e2", border: "none", cursor: "pointer", borderRadius: 2, fontWeight: 600,
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
  const { toast } = useFeedback();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await adminApi.get<{ leads: Lead[]; total: number }>("/admin/leads");
      setLeads(d.leads); setTotal(d.total);
    } catch (e) {
      setLeads([]);
      toast("error", e instanceof Error ? e.message : "Could not load leads");
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function markConverted(id: string) {
    await adminApi.patch(`/admin/leads/${id}/convert`, {});
    setLeads(prev => prev.map(l => l._id === id ? { ...l, converted: true } : l));
  }

  return (
    <>
      <style>{`
        .lead-tr { border-bottom: 1px solid rgba(200,150,62,0.06); }
        .lead-convert {
          font-family: inherit; font-size: 10px; padding: 3px 9px; border-radius: 2px;
          background: rgba(200,150,62,0.12); color: #C8963E;
          border: 1px solid rgba(200,150,62,0.3); cursor: pointer;
        }

        /* ── Mobile: table becomes stacked cards, same treatment as Orders/Customers ── */
        @media (max-width: 900px) {
          .lead-table thead { display: none; }
          .lead-table, .lead-table tbody, .lead-table tr { display: block; width: 100%; }
          .lead-tr { background: var(--ad-surface); border: 1px solid var(--ad-hairline); border-radius: var(--ad-r); margin-bottom: 12px; padding: 6px 4px; }
          /* anywhere-wrap so a long email breaks inside the card instead of pushing past the viewport */
          .lead-table td.lead-td { width: 100%; display: flex; justify-content: space-between; gap: 16px; align-items: baseline; text-align: right; border-bottom: 1px solid rgba(68,42,27,0.05); overflow-wrap: anywhere; }
          .lead-table td.lead-td:last-child { border-bottom: none; }
          .lead-table td.lead-td::before { content: attr(data-label); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.55); text-align: left; flex-shrink: 0; min-width: 68px; }
          .lead-convert { min-height: 32px; font-size: 11px; padding: 6px 12px; border-radius: 4px; }
        }
      `}</style>

      <p className="ad-sub" style={{ marginBottom: 18 }}>
        {total} total {total === 1 ? "lead" : "leads"} captured from the homepage modal
      </p>
      {loading ? <p className="ad-sub">Loading…</p> : leads.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-mark">◑</div>
          <p className="ad-empty-title">No leads captured yet</p>
          <p className="ad-empty-hint">
            Leads land here from the homepage LeadCaptureModal (it fires at 45s or 70% scroll) and from
            the WhatsApp/n8n enquiry flow. Nothing has come in yet — the table fills itself, there is
            nothing to add by hand.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="lead-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                {["Name","Email","Phone","Interest","Source","Date","Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id} className="lead-tr">
                  <td className="lead-td" data-label="Name" style={{ padding: "10px 12px", color: "#442a1b" }}>{l.name}</td>
                  <td className="lead-td" data-label="Email" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{l.email}</td>
                  <td className="lead-td" data-label="Phone" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{l.phone}</td>
                  <td className="lead-td" data-label="Interest" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.4)", fontSize: 12 }}>{l.interest}</td>
                  <td className="lead-td" data-label="Source" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.4)", fontSize: 12 }}>{l.source}</td>
                  <td className="lead-td" data-label="Date" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.35)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="lead-td" data-label="Status" style={{ padding: "10px 12px" }}>
                    {l.converted ? (
                      <span style={{ fontSize: 11, color: "#2e7d32", fontWeight: 600 }}>CONVERTED</span>
                    ) : (
                      <button className="lead-convert" onClick={() => void markConverted(l._id)}>Mark Converted</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// WAITLIST PANEL
// ─────────────────────────────────────────────
type WaitlistEntry = {
  _id: string; name: string; email: string; phone: string;
  product: string; source: string; createdAt: string;
};

function AdminWaitlist() {
  const { toast } = useFeedback();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await adminApi.get<{ waitlist: WaitlistEntry[]; total: number }>("/admin/waitlist");
      setEntries(d.waitlist); setTotal(d.total);
    } catch (e) {
      setEntries([]);
      toast("error", e instanceof Error ? e.message : "Could not load the waitlist");
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  function downloadExcel() {
    const headers = ["Name", "Email", "Phone", "Product", "Source", "Date"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = entries.map((e) => [e.name, e.email, e.phone, e.product, e.source, new Date(e.createdAt).toLocaleString("en-IN")].map(esc).join(","));
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <style>{`
        .wtl-tr { border-bottom: 1px solid rgba(200,150,62,0.06); }
        .wtl-download {
          font-family: inherit; font-size: 11px; padding: 8px 16px; border-radius: 3px;
          background: rgba(200,150,62,0.12); color: #C8963E;
          border: 1px solid rgba(200,150,62,0.35);
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
        }
        .wtl-download:disabled { cursor: not-allowed; opacity: 0.5; }

        /* ── Mobile: table becomes stacked cards, same treatment as Orders/Customers ── */
        @media (max-width: 900px) {
          .wtl-table thead { display: none; }
          .wtl-table, .wtl-table tbody, .wtl-table tr { display: block; width: 100%; }
          .wtl-tr { background: var(--ad-surface); border: 1px solid var(--ad-hairline); border-radius: var(--ad-r); margin-bottom: 12px; padding: 6px 4px; }
          /* anywhere-wrap so a long email breaks inside the card instead of pushing past the viewport */
          .wtl-table td.wtl-td { width: 100%; display: flex; justify-content: space-between; gap: 16px; align-items: baseline; text-align: right; border-bottom: 1px solid rgba(68,42,27,0.05); overflow-wrap: anywhere; }
          .wtl-table td.wtl-td:last-child { border-bottom: none; }
          .wtl-table td.wtl-td::before { content: attr(data-label); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(68,42,27,0.55); text-align: left; flex-shrink: 0; min-width: 68px; }
          .wtl-download { min-height: 36px; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <p className="ad-sub">{total} total waitlist {total === 1 ? "signup" : "signups"}</p>
        <button className="wtl-download" onClick={downloadExcel} disabled={entries.length === 0}>↓ Download Excel</button>
      </div>
      {loading ? <p className="ad-sub">Loading…</p> : entries.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-mark">◕</div>
          <p className="ad-empty-title">No waitlist signups yet</p>
          <p className="ad-empty-hint">
            Entries arrive from the product waitlist form on an out-of-stock or pre-launch product page.
            An empty list means nobody has signed up yet, not that the feed is broken.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="wtl-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                {["Name", "Email", "Phone", "Product", "Source", "Date"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e._id} className="wtl-tr">
                  <td className="wtl-td" data-label="Name" style={{ padding: "10px 12px", color: "#442a1b" }}>{e.name}</td>
                  <td className="wtl-td" data-label="Email" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{e.email}</td>
                  <td className="wtl-td" data-label="Phone" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{e.phone}</td>
                  <td className="wtl-td" data-label="Product" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.5)", fontSize: 12 }}>{e.product}</td>
                  <td className="wtl-td" data-label="Source" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.4)", fontSize: 12 }}>{e.source}</td>
                  <td className="wtl-td" data-label="Date" style={{ padding: "10px 12px", color: "rgba(68,42,27,0.35)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(e.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
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
    none: "rgba(68,42,27,0.2)", pending: "#d97706", earned: "#C8963E", fulfilled: "#2e7d32",
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
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "14px 18px" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(68,42,27,0.3)", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: s.alert ? "#d97706" : "#C8963E" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid rgba(200,150,62,0.1)", paddingBottom: 12 }}>
        {SUB.map(s => (
          <button key={s.id} onClick={() => setSubTab(s.id)} style={{
            padding: "5px 14px", fontSize: 11, letterSpacing: "0.08em",
            background: subTab === s.id ? "rgba(200,150,62,0.15)" : "transparent",
            color: subTab === s.id ? "#C8963E" : "rgba(68,42,27,0.4)",
            border: subTab === s.id ? "1px solid rgba(200,150,62,0.3)" : "1px solid transparent",
            cursor: "pointer", borderRadius: 2, textTransform: "uppercase",
          }}>{s.label}</button>
        ))}
        <button onClick={() => setShowForm(!showForm)} style={{
          marginLeft: "auto", padding: "5px 14px", fontSize: 11,
          background: "#C8963E", color: "#f7f0e2", border: "none",
          cursor: "pointer", borderRadius: 2, fontWeight: 600, letterSpacing: "0.08em",
        }}>+ Add Influencer</button>
      </div>

      {/* Add influencer form */}
      {showForm && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(200,150,62,0.2)", borderRadius: 3, padding: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#442a1b", marginBottom: 16 }}>New Influencer</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { key: "name", label: "Full Name" },
              { key: "phone", label: "Phone (91XXXXXXXXXX)" },
              { key: "promoCode", label: "Promo Code (e.g. PRIYA)" },
              { key: "discountPercent", label: "Discount %" },
              { key: "goalRedemptions", label: "Goal Redemptions" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", marginBottom: 4, textTransform: "uppercase" }}>{f.label}</label>
                <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(200,150,62,0.2)", color: "#442a1b", padding: "7px 10px", fontSize: 13, borderRadius: 2 }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", marginBottom: 4, textTransform: "uppercase" }}>Tier</label>
              <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
                style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(200,150,62,0.2)", color: "#442a1b", padding: "7px 10px", fontSize: 13, borderRadius: 2 }}>
                <option value="micro">Micro (20% off, owns children)</option>
                <option value="nano">Nano (15% off, child of micro)</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => void createInfluencer()} style={{ padding: "7px 20px", background: "#C8963E", color: "#f7f0e2", border: "none", cursor: "pointer", borderRadius: 2, fontWeight: 600, fontSize: 13 }}>Create</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "7px 16px", background: "transparent", color: "rgba(68,42,27,0.4)", border: "1px solid rgba(200,150,62,0.15)", cursor: "pointer", borderRadius: 2, fontSize: 13 }}>Cancel</button>
            {formMsg && <p style={{ fontSize: 12, color: formMsg.includes("✓") ? "#2e7d32" : "#c0392b" }}>{formMsg}</p>}
          </div>
        </div>
      )}

      {loading ? <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>Loading…</p> : (
        <>
          {/* Micro influencer cards */}
          {subTab === "micros" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {micros.length === 0 ? <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>No influencers yet. Add one above.</p> : micros.map(m => (
                <div key={m.id} style={{ background: "#ffffff", border: "1px solid rgba(200,150,62,0.1)", borderRadius: 3, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#442a1b" }}>{m.name}</p>
                      <p style={{ fontSize: 12, color: "#C8963E", letterSpacing: "0.1em", marginTop: 2 }}>{m.code}</p>
                    </div>
                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "#442a1b" }}>{m.rollupRedemptions}</p>
                        <p style={{ fontSize: 10, color: "rgba(68,42,27,0.3)", letterSpacing: "0.1em" }}>TOTAL ORDERS</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "#C8963E" }}>₹{m.rollupRevenue.toLocaleString("en-IN")}</p>
                        <p style={{ fontSize: 10, color: "rgba(68,42,27,0.3)", letterSpacing: "0.1em" }}>REVENUE</p>
                      </div>
                      {m.goalPct !== null && (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 20, fontWeight: 700, color: m.goalPct >= 100 ? "#2e7d32" : "#d97706" }}>{m.goalPct}%</p>
                          <p style={{ fontSize: 10, color: "rgba(68,42,27,0.3)", letterSpacing: "0.1em" }}>GOAL</p>
                        </div>
                      )}
                      <span style={{ fontSize: 11, padding: "3px 10px", background: rewardColour[m.rewardStatus] || "#444", color: "#f7f0e2", borderRadius: 2, fontWeight: 600, letterSpacing: "0.08em" }}>
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
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {codes.map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                      <td style={{ padding: "10px 12px", color: "#C8963E", fontWeight: 600, letterSpacing: "0.08em" }}>{c.code}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.5)", fontSize: 12 }}>{c.codeType}</td>
                      <td style={{ padding: "10px 12px", color: "#442a1b" }}>{c.discountPercent}%</td>
                      <td style={{ padding: "10px 12px", color: "#442a1b" }}>{c.usedCount}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.4)" }}>∞</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 11, color: c.status === "active" ? "#2e7d32" : "#c0392b" }}>{c.status.toUpperCase()}</span>
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
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map(r => (
                    <tr key={r._id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                      <td style={{ padding: "10px 12px", color: "#C8963E", fontWeight: 600 }}>{r.code}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{r.orderNumber ?? "—"}</td>
                      <td style={{ padding: "10px 12px", color: "#442a1b" }}>₹{r.netAmount.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.5)" }}>{r.discountPercent}%</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 11, color: r.status === "completed" ? "#2e7d32" : "#c0392b" }}>{r.status.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.35)", fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
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
                <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>No rewards pending payout.</p>
              ) : rewards.map(r => (
                <div key={r.id} style={{ background: "#ffffff", border: "1px solid rgba(200,150,62,0.2)", borderRadius: 3, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#442a1b" }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "#C8963E", marginTop: 2 }}>Code: {r.promoCode} · Phone: {r.phone}</p>
                    <p style={{ fontSize: 12, color: "rgba(68,42,27,0.4)", marginTop: 2 }}>{r.counters.rollupRedemptions} / {r.deal.goalRedemptions} orders reached</p>
                    {r.deal.rewardNote && <p style={{ fontSize: 12, color: "#d97706", marginTop: 2 }}>Reward: {r.deal.rewardNote}</p>}
                  </div>
                  <button onClick={() => void fulfillReward(r.id)} style={{
                    padding: "8px 18px", background: "#2e7d32", color: "#f7f0e2",
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
  const [navOpen, setNavOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [authChecked, setAuthChecked] = useState(false);
  const [expiryDismissed, setExpiryDismissed] = useState(false);
  const session = useAdminSession();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name.split("—")[0].trim());

    adminApi.get<Stats>("/admin/dashboard")
      .then(setStats)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setAuthChecked(true));
  }, [router]);

  // Same exit as the auth gate above: an expired token means every request from
  // here on 401s, so there is nothing left to show.
  useEffect(() => {
    if (session.expired) router.replace("/admin/login");
  }, [session.expired, router]);

  const handleLogout = async () => {
    try { await adminApi.post("/auth/admin/auth/logout", {}); } catch {}
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f0e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
    { id: "waitlist",     label: "Waitlist",     icon: "◕" },
    { id: "assessments",  label: "Assessments",  icon: "◓" },
    { id: "influencers",  label: "Influencers",  icon: "◐" },
    { id: "users",        label: "Customers",    icon: "◔" },
    { id: "blog",         label: "Education",    icon: "✎" },
  ];

  const PAGE_TITLE: Record<Tab, string> = {
    overview: "Dashboard", products: "Products", inventory: "Inventory",
    orders: "Orders", shipments: "Shipments", leads: "Leads & Signups",
    waitlist: "Waitlist",
    assessments: "Performance Assessments",
    influencers: "Influencers & Promo Codes",
    users: "Customers & Sign-ins",
    blog: "Education Centre",
  };
  const PAGE_SUB: Record<Tab, string> = {
    overview: "Live business snapshot",
    products: "Manage your product catalogue",
    inventory: "Track and update stock levels",
    orders: "View and manage customer orders",
    shipments: "NimbusPost shipment tracking & NDR management",
    leads: "Homepage modal captures, newsletter & bookings",
    waitlist: "Pre-launch product waitlist signups",
    assessments: "User-submitted health & ritual assessments",
    influencers: "Two-tier referral system, promo codes & reward payouts",
    users: "All registered customers, including Google sign-ins",
    blog: "Write & publish articles to the Education Centre page",
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .ad-shell { display: flex; min-height: 100vh; background: var(--ad-bg); }
        .ad-sidebar { width: 228px; background: var(--ad-surface); border-right: 1px solid var(--ad-hairline); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; align-self: flex-start; padding: 28px 0; flex-shrink: 0; }
        .ad-logo { padding: 0 24px 26px; border-bottom: 1px solid var(--ad-hairline); }
        .ad-logo-name { font-size: 20px; font-weight: 700; letter-spacing: 0.06em; color: var(--ad-ink); }
        .ad-logo-sub { font-size: 10px; letter-spacing: 0.22em; color: var(--ad-warn); text-transform: uppercase; margin-top: 3px; }
        .ad-nav { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
        .ad-nav-btn { display: flex; align-items: center; gap: 11px; width: 100%; padding: 11px 14px; border: none; border-radius: var(--ad-r-sm); background: transparent; font: inherit; font-size: 13.5px; color: var(--ad-ink-2); text-align: left; cursor: pointer; transition: background 0.18s ease, color 0.18s ease; }
        .ad-nav-btn:hover { color: var(--ad-ink); background: rgba(200,150,62,0.07); }
        .ad-nav-btn.active { color: var(--ad-ink); background: var(--ad-warn-bg); font-weight: 650; box-shadow: inset 2px 0 0 var(--ad-gold); }
        .ad-nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .ad-nav-divider { height: 1px; background: var(--ad-hairline); margin: 8px 14px; }
        .ad-sidebar-foot { padding: 18px 10px; border-top: 1px solid var(--ad-hairline); }
        .ad-logout { display: flex; align-items: center; gap: 9px; width: 100%; padding: 10px 14px; background: transparent; border: 1px solid var(--ad-hairline); border-radius: var(--ad-r-sm); font: inherit; font-size: 12px; letter-spacing: 0.08em; color: var(--ad-ink-3); cursor: pointer; transition: border-color 0.18s ease, color 0.18s ease; }
        .ad-logout:hover { border-color: var(--ad-gold); color: var(--ad-ink); }
        .ad-main { flex: 1; padding: 36px 40px; min-width: 0; }
        .ad-topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 30px; }
        .ad-greeting { text-align: right; }
        .ad-greeting-name { font-size: 13px; color: var(--ad-ink-3); margin: 0; }
        .ad-greeting-name strong { color: var(--ad-warn); font-weight: 650; }
        .ad-greeting-date { font-size: 12px; color: var(--ad-ink-3); margin: 2px 0 0; }

        /* Session warning: the admin token lives 8h and staff used to be bounced
           mid-task, losing whatever was half-typed into a form. */
        .ad-expiry { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 22px;
          background: var(--ad-warn-bg); border-color: var(--ad-gold-soft); border-left: 3px solid var(--ad-warn); }
        .ad-expiry-text { flex: 1 1 auto; font-size: 13px; line-height: 1.5; color: var(--ad-ink); margin: 0; }
        .ad-expiry-text strong { color: var(--ad-warn); }
        .ad-expiry-dismiss { flex-shrink: 0; width: 30px; height: 30px; padding: 0; font: inherit; font-size: 15px; line-height: 1;
          background: transparent; border: 1px solid var(--ad-gold-soft); border-radius: var(--ad-r-sm); color: var(--ad-ink-2); cursor: pointer; }
        .ad-expiry-dismiss:hover { color: var(--ad-ink); border-color: var(--ad-gold); }

        /* Mobile navigation bar + drawer backdrop (hidden on desktop) */
        .ad-mobilebar { display: none; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 60;
          background: var(--ad-surface); border-bottom: 1px solid var(--ad-hairline); padding: 11px 14px; }
        .ad-burger { width: 44px; height: 44px; flex-shrink: 0; font-size: 20px; cursor: pointer; color: var(--ad-ink);
          background: var(--ad-surface); border: 1px solid var(--ad-gold-soft); border-radius: var(--ad-r-sm); line-height: 1; }
        .ad-mobilebar-title { font-size: 15.5px; font-weight: 700; color: var(--ad-ink); margin: 0; }
        .ad-backdrop { position: fixed; inset: 0; background: rgba(28,19,4,0.45); z-index: 65; }
        @media (max-width: 900px) {
          .ad-main { padding: 22px 16px; }
          /* Sidebar becomes a slide-in drawer instead of disappearing entirely. */
          .ad-sidebar { position: fixed; top: 0; left: 0; bottom: 0; height: 100vh; z-index: 70;
            transform: translateX(-100%); transition: transform 0.25s ease; box-shadow: 6px 0 34px rgba(0,0,0,0.22); }
          .ad-sidebar.open { transform: translateX(0); }
          .ad-mobilebar { display: flex; }
          .ad-topbar { flex-direction: column; align-items: flex-start; gap: 8px; }
          .ad-greeting { text-align: left; }
        }
      `}</style>

      {/* Mobile-only bar: the sidebar is a fixed drawer under 900px, so without
          this the founder has no way to switch panels on a phone. */}
      <div className="ad-mobilebar">
        <button className="ad-burger" onClick={() => setNavOpen(true)} aria-label="Open navigation menu">☰</button>
        <p className="ad-mobilebar-title">{PAGE_TITLE[tab]}</p>
      </div>

      {navOpen && <div className="ad-backdrop" onClick={() => setNavOpen(false)} />}

      <div className="ad-shell">
        <aside className={`ad-sidebar${navOpen ? " open" : ""}`}>
          <div className="ad-logo">
            <div className="ad-logo-name">3TATTAVA</div>
            <div className="ad-logo-sub">Operations Center</div>
          </div>

          <nav className="ad-nav">
            {NAV.slice(0, 4).map((n) => (
              <button key={n.id} className={`ad-nav-btn${tab === n.id ? " active" : ""}`} onClick={() => { setTab(n.id); setNavOpen(false); }}>
                <span className="ad-nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
            <div className="ad-nav-divider" />
            {NAV.slice(4).map((n) => (
              <button key={n.id} className={`ad-nav-btn${tab === n.id ? " active" : ""}`} onClick={() => { setTab(n.id); setNavOpen(false); }}>
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
              <h1 className="ad-h1">{PAGE_TITLE[tab]}</h1>
              <p className="ad-sub" style={{ marginTop: 3 }}>{PAGE_SUB[tab]}</p>
            </div>
            <div className="ad-greeting">
              <p className="ad-greeting-name">Welcome, <strong>{adminName}</strong></p>
              <p className="ad-greeting-date">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          {session.expiringSoon && !expiryDismissed && (
            <div className="ad-card ad-expiry" role="status">
              <p className="ad-expiry-text">
                Your admin session ends in <strong>{session.minutesRemaining} min</strong>. Save anything
                you are part-way through now — sign out and back in to start a fresh 8-hour session.
              </p>
              <button className="ad-expiry-dismiss" onClick={() => setExpiryDismissed(true)} aria-label="Dismiss session warning">×</button>
            </div>
          )}

          {tab === "overview" && (
            <>
              <AdminOverview stats={stats} onOpenTab={setTab} />
              <p className="ad-h2" style={{ marginTop: 30, marginBottom: 16 }}>Product overview</p>
              <AdminProducts readOnly />
            </>
          )}

          {tab === "products"    && <AdminProducts />}
          {tab === "inventory"   && <AdminInventory />}
          {tab === "orders"      && <AdminOrders />}
          {tab === "shipments"   && <AdminShipments />}
          {tab === "leads"       && <AdminLeads />}
          {tab === "waitlist"    && <AdminWaitlist />}
          {tab === "assessments" && <AdminAssessments />}
          {tab === "influencers" && <AdminInfluencers />}
          {tab === "users"       && <AdminCustomers />}
          {tab === "blog"        && <AdminBlog />}
        </main>
      </div>
    </>
  );
}
