"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(typeof navigator !== "undefined" && !navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[130] border-t border-gold/40 bg-[#2a221c] text-white shadow-[0_-8px_24px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-2 text-white/90">
          <WifiOff className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          You&apos;re offline — some features may be unavailable until you reconnect.
        </span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full border border-gold/50 bg-gold/15 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold hover:bg-gold/25 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
