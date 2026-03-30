"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { LabReportLookupResponse } from "@shared/types";

export default function LabReportLookup() {
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LabReportLookupResponse | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setResult(null);
    setBadge("");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function lookup() {
    const trimmed = badge.trim();
    if (!trimmed) {
      setError("Enter the badge number from your product packaging.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.get<LabReportLookupResponse>(
        `/lab-reports/by-badge/${encodeURIComponent(trimmed)}`,
        false
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void lookup();
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full px-6 py-3"
        onClick={() => {
          setOpen(true);
          setError(null);
          setResult(null);
        }}
      >
        Lab report
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-report-dialog-title"
            className="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-border p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 text-text-light hover:text-text-dark text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <h2
              id="lab-report-dialog-title"
              className="font-display text-2xl text-text-dark pr-8 mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Verify lab report
            </h2>
            <p className="text-sm text-text-medium mb-4">
              Enter the badge number printed on your product, then press Enter or Lookup.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="e.g. 3T-LAB-001"
                className="flex-1 px-3 py-2.5 border border-border rounded-lg text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                autoComplete="off"
                autoFocus
              />
              <Button
                type="button"
                onClick={() => void lookup()}
                disabled={loading}
                className="sm:shrink-0"
              >
                {loading ? "…" : "Lookup"}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3" role="alert">
                {error}
              </p>
            )}

            {result && (
              <div className="rounded-lg border border-border bg-cream/80 p-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-light">Product</p>
                  <Link
                    href={`/products/${result.slug}`}
                    className="font-medium text-primary-green hover:underline"
                  >
                    {result.productName}
                  </Link>
                </div>
                {result.batchCode && (
                  <p className="text-text-medium">
                    <span className="text-text-light">Batch: </span>
                    {result.batchCode}
                  </p>
                )}
                {result.testedAt && (
                  <p className="text-text-medium">
                    <span className="text-text-light">Tested: </span>
                    {new Date(result.testedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
                {result.summary && <p className="text-text-medium leading-relaxed">{result.summary}</p>}
                {result.reportUrl ? (
                  <a
                    href={result.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary-green text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-secondary-green transition-colors"
                  >
                    Open lab report (PDF)
                  </a>
                ) : (
                  <p className="text-xs text-text-light">
                    No PDF is linked for this batch. Use the summary above or contact care@3tattva.com.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
