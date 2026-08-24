"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as api } from "@/lib/api";
import { useFeedback } from "@/components/admin/AdminToast";

type DashboardStats = {
  revenue: { today: number; month: number; year: number };
  orders: { total: number; pending: number };
  inventory: { lowStockProducts: number; inventoryValue: number };
  products: { totalActive: number };
} | null;

/** Totals for the operator-selected window, returned by GET /admin/dashboard?from&to. */
type RangeTotals = { revenue: number; orders: number; units: number };

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  guestEmail?: string;
  items?: { name: string; quantity: number }[];
  shippingAddress?: { firstName?: string; lastName?: string; email?: string };
  payment?: { status?: string };
};

const inr = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

const STATUS_COLOR: Record<string, string> = {
  pending: "#c26a12",
  confirmed: "#1976d2",
  processing: "#8e24aa",
  shipped: "#0288d1",
  delivered: "#3f7a3a",
  cancelled: "#c0392b",
};

/** Local calendar day as YYYY-MM-DD — the backend snaps a date-only bound to the whole local day. */
function isoDay(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDay(d);
}

type PresetId = "today" | "d7" | "d30" | "month" | "all" | "custom";

// "All time" deliberately leaves `from` empty: an open-ended left bound beats
// inventing a fake start date that would silently clip older orders.
const PRESETS: { id: Exclude<PresetId, "custom">; label: string; range: () => { from: string; to: string } }[] = [
  { id: "today", label: "Today", range: () => ({ from: isoDay(new Date()), to: isoDay(new Date()) }) },
  { id: "d7", label: "Last 7 days", range: () => ({ from: daysAgo(6), to: isoDay(new Date()) }) },
  { id: "d30", label: "Last 30 days", range: () => ({ from: daysAgo(29), to: isoDay(new Date()) }) },
  {
    id: "month",
    label: "This month",
    range: () => {
      const now = new Date();
      return { from: isoDay(new Date(now.getFullYear(), now.getMonth(), 1)), to: isoDay(now) };
    },
  },
  { id: "all", label: "All time", range: () => ({ from: "", to: isoDay(new Date()) }) },
];

function prettyDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOverview({
  stats,
  onOpenTab,
}: {
  stats: DashboardStats;
  onOpenTab: (tab: "orders" | "users" | "inventory") => void;
}) {
  const { toast } = useFeedback();
  const [people, setPeople] = useState<{ registered: number; purchasers: number } | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  const [preset, setPreset] = useState<PresetId>("d30");
  const [range, setRange] = useState<{ from: string; to: string }>(() => ({ from: daysAgo(29), to: isoDay(new Date()) }));
  const [totals, setTotals] = useState<RangeTotals | null>(null);
  const [loadingRange, setLoadingRange] = useState(true);

  const inverted = Boolean(range.from && range.to && range.from > range.to);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await api.get<{ total: number; summary?: { registered: number; purchasers: number } }>("/admin/users");
        if (alive) setPeople(u.summary ?? { registered: u.total ?? 0, purchasers: 0 });
      } catch { /* card falls back to a dash */ }
      try {
        const o = await api.get<{ orders: RecentOrder[] }>("/admin/orders?limit=6");
        if (alive) setRecent(o.orders || []);
      } catch { /* list stays empty */ }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (inverted) return;
    if (!range.from && !range.to) return;
    let alive = true;
    setLoadingRange(true);
    (async () => {
      const qs = new URLSearchParams();
      if (range.from) qs.set("from", range.from);
      if (range.to) qs.set("to", range.to);
      try {
        const d = await api.get<{ range: RangeTotals | null }>(`/admin/dashboard?${qs.toString()}`);
        if (alive) setTotals(d.range);
      } catch (e) {
        if (alive) {
          setTotals(null);
          toast("error", e instanceof Error ? e.message : "Could not load totals for that period");
        }
      } finally {
        if (alive) setLoadingRange(false);
      }
    })();
    return () => { alive = false; };
  }, [range.from, range.to, inverted, toast]);

  const applyPreset = useCallback((id: Exclude<PresetId, "custom">) => {
    const found = PRESETS.find((p) => p.id === id);
    if (!found) return;
    setPreset(id);
    setRange(found.range());
  }, []);

  const windowLabel = useMemo(() => {
    if (preset !== "custom") {
      const found = PRESETS.find((p) => p.id === preset);
      if (found) return found.label;
    }
    if (range.from && range.to) return `${prettyDay(range.from)} – ${prettyDay(range.to)}`;
    if (range.to) return `Up to ${prettyDay(range.to)}`;
    if (range.from) return `From ${prettyDay(range.from)}`;
    return "Custom";
  }, [preset, range.from, range.to]);

  const unpaid = recent.filter((o) => o.payment?.status !== "captured").length;
  const figure = (v: number | undefined, format: (n: number) => string) =>
    inverted ? "—" : loadingRange && totals === null ? "…" : v === undefined ? "—" : format(v);

  return (
    <>
      <style>{`
        .ov-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 13px; margin-bottom: 24px; }
        .ov-grid-3 { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
        /* Deep gold rather than --ad-gold: money figures are large but still need
           to clear contrast on the cream card surface. */
        .ov-money { color: var(--ad-warn); }
        .ov-alert { color: var(--ad-bad); }
        .ov-click { cursor: pointer; text-align: left; width: 100%; font: inherit; transition: border-color .18s ease, transform .18s ease; }
        .ov-click:hover { border-color: var(--ad-gold); transform: translateY(-1px); }
        /* The clickable cards are real <button>s, so their label/sub text are
           spans and need the block treatment the <p> variants get for free. */
        .ad-stat .ad-eyebrow, .ad-stat .ad-sub { display: block; }
        .ad-stat .ad-sub { margin-top: 6px; }

        .ov-range { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 14px; margin-bottom: 18px; }
        .ov-range-presets { display: flex; flex-wrap: wrap; gap: 6px; }
        .ov-chip { font: inherit; font-size: 12px; padding: 6px 11px; border-radius: var(--ad-r-pill);
          border: 1px solid var(--ad-gold-soft); background: var(--ad-surface); color: var(--ad-ink-2); cursor: pointer; }
        .ov-chip:hover { border-color: var(--ad-gold); color: var(--ad-ink); }
        .ov-chip.on { background: var(--ad-warn-bg); border-color: var(--ad-gold); color: var(--ad-ink); font-weight: 650; }
        .ov-range-dates { display: flex; align-items: center; gap: 6px; margin-left: auto; }
        .ov-range-dash { color: var(--ad-ink-3); font-size: 12px; }
        .ov-range-warn { flex-basis: 100%; font-size: 12.5px; color: var(--ad-bad); margin: 0; }

        .ov-sec { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 26px 0 12px; }
        .ov-link { font: inherit; font-size: 12.5px; color: var(--ad-warn); cursor: pointer; background: none; border: none; padding: 0; }
        .ov-link:hover { text-decoration: underline; }

        .ov-row { display: flex; align-items: center; gap: 14px; padding: 12px 15px; margin-bottom: 9px;
          cursor: pointer; width: 100%; text-align: left; font: inherit; transition: border-color .18s ease; }
        .ov-row:hover { border-color: var(--ad-gold); }
        .ov-who { min-width: 0; flex: 1 1 auto; }
        .ov-name { display: block; font-size: 14px; font-weight: 650; color: var(--ad-ink); }
        .ov-items { display: block; font-size: 12.5px; color: var(--ad-ink-2); margin-top: 3px; }
        .ov-amt { font-size: 15px; font-weight: 700; color: var(--ad-ink); white-space: nowrap; }
        .ov-when { font-size: 12px; color: var(--ad-ink-3); white-space: nowrap; }
        .ov-dot { width: 8px; height: 8px; border-radius: var(--ad-r-pill); flex-shrink: 0; }

        @media (max-width: 620px) {
          .ov-range-dates { margin-left: 0; }
          .ov-row { flex-wrap: wrap; gap: 8px; }
          .ov-when { width: 100%; }
        }
      `}</style>

      <div className="ad-card ov-range">
        <div className="ov-range-presets">
          {PRESETS.map((p) => (
            <button key={p.id} className={`ov-chip${preset === p.id ? " on" : ""}`} onClick={() => applyPreset(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="ov-range-dates">
          <input
            className="ad-input" type="date" value={range.from} max={range.to || undefined}
            aria-label="Period start"
            onChange={(e) => { setPreset("custom"); setRange((r) => ({ ...r, from: e.target.value })); }}
          />
          <span className="ov-range-dash">to</span>
          <input
            className="ad-input" type="date" value={range.to} min={range.from || undefined}
            aria-label="Period end"
            onChange={(e) => { setPreset("custom"); setRange((r) => ({ ...r, to: e.target.value })); }}
          />
        </div>
        {inverted && <p className="ov-range-warn">Start date is after the end date — pick a valid period.</p>}
      </div>

      <div className="ov-grid ov-grid-3">
        <div className="ad-stat">
          <p className="ad-eyebrow">Revenue · {windowLabel}</p>
          <span className="ad-num ov-money">{figure(totals?.revenue, inr)}</span>
          <p className="ad-sub">Captured payments only</p>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Paid orders · {windowLabel}</p>
          <span className="ad-num">{figure(totals?.orders, (n) => n.toLocaleString("en-IN"))}</span>
          <p className="ad-sub">Excludes samples &amp; tests</p>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Units sold · {windowLabel}</p>
          <span className="ad-num">{figure(totals?.units, (n) => n.toLocaleString("en-IN"))}</span>
          <p className="ad-sub">Across all products</p>
        </div>
      </div>

      <p className="ad-h3" style={{ marginBottom: 10 }}>Fixed periods</p>
      <div className="ov-grid">
        <div className="ad-stat">
          <p className="ad-eyebrow">Revenue today</p>
          <span className="ad-num ov-money">{stats ? inr(stats.revenue.today) : "—"}</span>
          <p className="ad-sub">Since midnight</p>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Revenue this month</p>
          <span className="ad-num ov-money">{stats ? inr(stats.revenue.month) : "—"}</span>
          <p className="ad-sub">Month to date</p>
        </div>
        <div className="ad-stat">
          <p className="ad-eyebrow">Revenue this year</p>
          <span className="ad-num ov-money">{stats ? inr(stats.revenue.year) : "—"}</span>
          <p className="ad-sub">Year to date</p>
        </div>
        <button className="ad-stat ov-click" onClick={() => onOpenTab("orders")}>
          <span className="ad-eyebrow">Total orders</span>
          <span className="ad-num">{stats?.orders.total ?? "—"}</span>
          <span className="ad-sub">{stats?.orders.pending ?? 0} awaiting action →</span>
        </button>
        <button className="ad-stat ov-click" onClick={() => onOpenTab("users")}>
          <span className="ad-eyebrow">Registered customers</span>
          <span className="ad-num">{people ? people.registered : "—"}</span>
          <span className="ad-sub">{people ? `${people.purchasers} have purchased →` : "View customers →"}</span>
        </button>
        <button className="ad-stat ov-click" onClick={() => onOpenTab("inventory")}>
          <span className="ad-eyebrow">Low stock SKUs</span>
          <span className={`ad-num${(stats?.inventory.lowStockProducts ?? 0) > 0 ? " ov-alert" : ""}`}>
            {stats?.inventory.lowStockProducts ?? "—"}
          </span>
          <span className="ad-sub">Below threshold →</span>
        </button>
        <div className="ad-stat">
          <p className="ad-eyebrow">Unpaid in latest</p>
          <span className={`ad-num${unpaid > 0 ? " ov-alert" : ""}`}>{unpaid}</span>
          <p className="ad-sub">Of the {recent.length} most recent</p>
        </div>
      </div>

      <div className="ov-sec">
        <p className="ad-h2">Latest orders — who bought what</p>
        <button className="ov-link" onClick={() => onOpenTab("orders")}>See all orders →</button>
      </div>

      {recent.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-mark">◎</div>
          <p className="ad-empty-title">No orders yet</p>
          <p className="ad-empty-hint">Website checkouts and orders you log by hand both appear here, newest first.</p>
        </div>
      ) : (
        recent.map((o) => {
          const name = [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" ").trim()
            || o.shippingAddress?.email || o.guestEmail || "Guest";
          return (
            <button key={o.id} className="ad-card ov-row" onClick={() => onOpenTab("orders")}>
              <span className="ov-dot" style={{ background: STATUS_COLOR[o.status] || "#888" }} />
              <span className="ov-who">
                <span className="ov-name">{name}</span>
                <span className="ov-items">
                  {(o.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}
                </span>
              </span>
              <span className="ov-amt">{inr(o.total)}</span>
              <span className="ov-when">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {o.payment?.status === "captured" ? " · Paid" : " · Unpaid"}
              </span>
            </button>
          );
        })
      )}
    </>
  );
}
