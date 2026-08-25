"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi as api, getAdminToken } from "@/lib/api";
import { useFeedback } from "@/components/admin/AdminToast";
import { useScrollLock } from "@/hooks/useScrollLock";

type Pending = {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  issuedAt: string;
  customer: string;
  placeOfSupply: string | null;
  supplyType: "intra" | "inter" | null;
  total: number;
  isSample: boolean;
};

const money = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;
const day = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });

/**
 * Hands website invoices to Tally as a downloadable file.
 *
 * Deliberately a download and not a live connection: Tally's XML gateway has no
 * authentication, so anything able to reach it could read the whole ledger and
 * post vouchers. A file keeps the books off the internet and leaves the owner
 * reviewing before anything reaches them.
 *
 * The list is only ever orders that have an invoice and have NOT been exported
 * before. Several historical orders were keyed into Tally by hand, so re-sending
 * them would double-count revenue.
 */
export default function TallyExportPanel({ onClose }: { onClose: () => void }) {
  const { toast, confirm } = useFeedback();
  const [pending, setPending] = useState<Pending[] | null>(null);
  const [busy, setBusy] = useState(false);

  useScrollLock(true);

  const load = useCallback(async () => {
    try {
      const d = await api.get<{ count: number; orders: Pending[] }>("/admin/tally/pending");
      setPending(d.orders || []);
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Could not load pending invoices.");
      setPending([]);
    }
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  /**
   * Downloads through fetch rather than a plain link because the endpoint needs
   * the admin bearer token, which a link cannot carry.
   */
  const download = async (commit: boolean) => {
    if (commit) {
      const okToGo = await confirm({
        title: `Mark ${pending?.length ?? 0} invoice(s) as sent to Tally?`,
        body:
          "Download the file and these invoices will not appear here again, so they cannot be imported twice. Import the file into Tally before closing this.",
        confirmLabel: "Download and mark as sent",
      });
      if (!okToGo) return;
    }

    setBusy(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${base}/admin/tally/export.xml?commit=${commit}`, {
        headers: { Authorization: `Bearer ${getAdminToken() ?? ""}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (res.headers.get("Content-Disposition") || "").match(/filename="([^"]+)"/)?.[1]
        || `tally-export${commit ? "" : "-preview"}.xml`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast("ok", commit
        ? `Downloaded and marked as sent. Import it in Tally now.`
        : `Preview downloaded. Nothing has been marked as sent.`);
      if (commit) await load();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  };

  const total = (pending || []).reduce((s, p) => s + (p.total || 0), 0);

  return (
    <div className="tx-wrap" onClick={onClose}>
      <style>{`
        .tx-wrap { position: fixed; inset: 0; background: rgba(28,19,4,0.5); z-index: 1100; display: flex; align-items: flex-start; justify-content: center; padding: 20px 14px; overflow-y: auto; overscroll-behavior: contain; }
        .tx-modal { background: var(--ad-surface-2); border: 1px solid rgba(200,150,62,0.3); border-radius: 10px; width: 100%; max-width: 760px; box-shadow: var(--ad-shadow-lg); display: flex; flex-direction: column; max-height: calc(100vh - 40px); }
        .tx-h { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 20px 22px 0; }
        .tx-x { border: none; background: transparent; font-size: 25px; line-height: 1; color: var(--ad-ink-3); cursor: pointer; }
        .tx-scroll { overflow-y: auto; overscroll-behavior: contain; padding: 16px 22px 4px; flex: 1 1 auto; }
        .tx-steps { background: var(--ad-surface); border: 1px solid var(--ad-hairline); border-radius: var(--ad-r-sm); padding: 12px 14px; margin-bottom: 14px; }
        .tx-steps ol { margin: 6px 0 0; padding-left: 20px; font-size: 12.5px; color: var(--ad-ink-2); line-height: 1.7; }
        table.tx-t { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .tx-t th { text-align: left; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ad-ink-3); padding: 7px 8px; border-bottom: 1px solid var(--ad-hairline); }
        .tx-t td { padding: 8px; border-bottom: 1px solid rgba(200,150,62,0.08); }
        .tx-t .r { text-align: right; }
        .tx-actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; flex-shrink: 0; padding: 14px 22px; border-top: 1px solid rgba(200,150,62,0.18); background: var(--ad-surface-2); border-radius: 0 0 10px 10px; }
        @media (max-width: 640px) {
          .tx-t thead { display: none; }
          .tx-t tr { display: block; border: 1px solid var(--ad-hairline); border-radius: var(--ad-r); margin-bottom: 10px; padding: 4px; }
          .tx-t td { display: flex; justify-content: space-between; gap: 12px; border: none; }
          .tx-t td::before { content: attr(data-label); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ad-ink-3); }
          .tx-actions .ad-btn { flex: 1 1 auto; }
        }
      `}</style>

      <div className="tx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tx-h">
          <div>
            <h3 className="ad-h2">Send invoices to Tally</h3>
            <p className="ad-sub" style={{ marginTop: 3 }}>
              Website invoices only. Anything you type into Tally yourself keeps its own
              numbering and is never touched by this.
            </p>
          </div>
          <button className="tx-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="tx-scroll">
          <div className="tx-steps">
            <strong style={{ fontSize: 12.5 }}>How to import</strong>
            <ol>
              <li>Download the file below.</li>
              <li>In TallyPrime open <strong>Import</strong> (top menu) → <strong>Vouchers</strong>.</li>
              <li>Choose the downloaded file and confirm. Vouchers post to
                  <strong> SALES STATE</strong> or <strong>SALES CENTRAL</strong> with the matching GST ledger.</li>
              <li>Check the Day Book for the new entries.</li>
            </ol>
          </div>

          {pending === null ? (
            <p className="ad-sub">Loading…</p>
          ) : pending.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-mark" aria-hidden>✓</div>
              <p className="ad-empty-title">Nothing waiting</p>
              <p className="ad-empty-hint">
                Every issued invoice has already been sent to Tally. New ones appear here
                as soon as an order is paid.
              </p>
            </div>
          ) : (
            <table className="tx-t">
              <thead>
                <tr>
                  <th>Invoice</th><th>Order</th><th>Customer</th>
                  <th>Place of supply</th><th className="r">Total</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Invoice">
                      <span className="ad-mono">{p.invoiceNumber}</span>
                      <div style={{ fontSize: 11, color: "var(--ad-ink-3)" }}>{day(p.issuedAt)}</div>
                    </td>
                    <td data-label="Order"><span className="ad-mono">{p.orderNumber}</span></td>
                    <td data-label="Customer">
                      {p.customer || "—"}
                      {p.isSample && <span className="ad-badge ad-badge-mute" style={{ marginLeft: 6 }}>SAMPLE</span>}
                    </td>
                    <td data-label="Place of supply">
                      {p.placeOfSupply || "—"}
                      <div style={{ fontSize: 11, color: "var(--ad-ink-3)" }}>
                        {p.supplyType === "intra" ? "CGST + SGST" : p.supplyType === "inter" ? "IGST" : ""}
                      </div>
                    </td>
                    <td data-label="Total" className="r">{money(p.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="tx-actions">
          {!!pending?.length && (
            <span className="ad-sub" style={{ marginRight: "auto", alignSelf: "center" }}>
              {pending.length} invoice(s) · {money(total)}
            </span>
          )}
          <button className="ad-btn" onClick={onClose} disabled={busy}>Close</button>
          <button className="ad-btn" onClick={() => download(false)} disabled={busy || !pending?.length}>
            Preview file
          </button>
          <button className="ad-btn ad-btn-primary" onClick={() => download(true)} disabled={busy || !pending?.length}>
            {busy ? "Preparing…" : "Download & mark sent"}
          </button>
        </div>
      </div>
    </div>
  );
}
