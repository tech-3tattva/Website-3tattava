"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Admin feedback layer.
 *
 * Status changes and saves used to happen silently: on failure a dropdown just
 * snapped back to its old value with no explanation, so staff could not tell a
 * rejected write from a slow one. Panels now report the outcome of every write.
 *
 * Also hosts `confirm`, so destructive actions (cancelling an order) get an
 * explicit acknowledgement instead of firing on a single stray click.
 */

type ToastKind = "ok" | "error" | "info";

type Toast = { id: number; kind: ToastKind; message: string };

type ConfirmRequest = {
  title: string;
  body?: string;
  confirmLabel: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
};

type AdminFeedback = {
  toast: (kind: ToastKind, message: string) => void;
  confirm: (opts: {
    title: string;
    body?: string;
    confirmLabel?: string;
    danger?: boolean;
  }) => Promise<boolean>;
};

const FeedbackContext = createContext<AdminFeedback | null>(null);

/** Panels call this to report outcomes. Throws if used outside the provider. */
export function useFeedback(): AdminFeedback {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside <AdminFeedbackProvider>");
  return ctx;
}

let nextId = 1;

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<ConfirmRequest | null>(null);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, kind, message }]);
      // Errors stay longer: they usually need reading, not just noticing.
      window.setTimeout(() => dismiss(id), kind === "error" ? 7000 : 3800);
    },
    [dismiss],
  );

  const confirm = useCallback<AdminFeedback["confirm"]>(
    ({ title, body, confirmLabel = "Confirm", danger }) =>
      new Promise<boolean>((resolve) => {
        setPending({ title, body, confirmLabel, danger, resolve });
      }),
    [],
  );

  const settle = useCallback(
    (ok: boolean) => {
      setPending((req) => {
        req?.resolve(ok);
        return null;
      });
    },
    [],
  );

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="ad-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`ad-toast ad-toast-${t.kind}`}>
            <span className="ad-toast-mark" aria-hidden>
              {t.kind === "ok" ? "✓" : t.kind === "error" ? "!" : "i"}
            </span>
            <span className="ad-toast-msg">{t.message}</span>
            <button className="ad-toast-x" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </div>

      {pending && (
        <div className="ad-confirm-wrap" role="dialog" aria-modal="true" aria-label={pending.title}>
          <div className="ad-confirm">
            <h3 className="ad-h2">{pending.title}</h3>
            {pending.body && <p className="ad-sub" style={{ marginTop: 8 }}>{pending.body}</p>}
            <div className="ad-confirm-actions">
              <button className="ad-btn" onClick={() => settle(false)}>
                Keep as is
              </button>
              <button
                className={pending.danger ? "ad-btn ad-btn-danger" : "ad-btn ad-btn-primary"}
                onClick={() => settle(true)}
              >
                {pending.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ad-toasts {
          position: fixed; z-index: 2000; bottom: 20px; right: 20px;
          display: flex; flex-direction: column; gap: 9px;
          max-width: min(380px, calc(100vw - 32px));
        }
        .ad-toast {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fffdf8; border: 1px solid var(--ad-hairline, rgba(200,150,62,0.18));
          border-left-width: 3px; border-radius: 8px;
          padding: 11px 12px; box-shadow: 0 10px 30px rgba(68,42,27,0.16);
          font-size: 13px; line-height: 1.45; color: #442a1b;
          animation: ad-toast-in 0.18s ease-out;
        }
        @keyframes ad-toast-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .ad-toast { animation: none; } }
        .ad-toast-ok { border-left-color: #1f7a4d; }
        .ad-toast-error { border-left-color: #a12d2d; }
        .ad-toast-info { border-left-color: #c8963e; }
        .ad-toast-mark {
          flex-shrink: 0; width: 17px; height: 17px; border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; margin-top: 1px;
        }
        .ad-toast-ok .ad-toast-mark { background: rgba(31,122,77,0.12); color: #1f7a4d; }
        .ad-toast-error .ad-toast-mark { background: rgba(161,45,45,0.1); color: #a12d2d; }
        .ad-toast-info .ad-toast-mark { background: rgba(200,150,62,0.16); color: #9a6212; }
        .ad-toast-msg { flex: 1 1 auto; }
        .ad-toast-x {
          flex-shrink: 0; border: none; background: none; cursor: pointer;
          font-size: 17px; line-height: 1; color: rgba(68,42,27,0.4); padding: 0 2px;
        }
        .ad-toast-x:hover { color: #442a1b; }

        .ad-confirm-wrap {
          position: fixed; inset: 0; z-index: 2100;
          background: rgba(28,19,4,0.5);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .ad-confirm {
          background: #fdfaf3; border: 1px solid rgba(200,150,62,0.3);
          border-radius: 10px; padding: 22px; width: 100%; max-width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
        }
        .ad-confirm-actions {
          display: flex; gap: 10px; justify-content: flex-end;
          margin-top: 20px; flex-wrap: wrap;
        }
      `}</style>
    </FeedbackContext.Provider>
  );
}
