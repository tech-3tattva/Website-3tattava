import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Lock, LogOut } from "lucide-react";

const LS_KEY = "3tattava_admin_token";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(LS_KEY) || "");
  const [authed, setAuthed] = useState(!!localStorage.getItem(LS_KEY));
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("stats");
  const [data, setData] = useState([]);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/verify", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem(LS_KEY, token);
      setAuthed(true);
    } catch {
      setError("Invalid token");
    }
  };

  const logout = () => { localStorage.removeItem(LS_KEY); setAuthed(false); setToken(""); setStats(null); };

  useEffect(() => {
    if (!authed) return;
    api.get("/admin/stats", { headers: { Authorization: `Bearer ${token}` } }).then((r) => setStats(r.data)).catch(() => {});
  }, [authed, token]);

  useEffect(() => {
    if (!authed || tab === "stats") return;
    const map = { orders: "/admin/orders", leads: "/admin/leads", newsletter: "/admin/newsletter", bookings: "/admin/bookings" };
    api.get(map[tab], { headers: { Authorization: `Bearer ${token}` } }).then((r) => setData(r.data)).catch(() => setData([]));
  }, [tab, authed, token]);

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-ink text-cream px-6" data-testid="admin-login">
        <form onSubmit={login} className="max-w-sm w-full">
          <Lock size={24} className="text-gold mb-4" />
          <div className="eyebrow text-gold mb-2">Admin Console</div>
          <h1 className="font-display text-3xl mb-8" style={{ fontVariationSettings: "'wdth' 85, 'wght' 800" }}>Authenticate.</h1>
          <input type="password" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN TOKEN" data-testid="admin-token-input" className="luxe-input-dark mb-6" />
          <button type="submit" className="btn-primary w-full" data-testid="admin-login-submit">Enter</button>
          {error && <div className="mt-4 text-xs text-terracotta">{error}</div>}
          <p className="text-[11px] text-cream/50 mt-6">Default token: <code className="text-gold">3tattava-admin-2026</code></p>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[80vh]" data-testid="admin-dashboard">
      <section className="bg-ink text-cream py-10 px-6 md:px-16 flex items-center justify-between">
        <div>
          <div className="eyebrow text-gold mb-2">Admin · 3Tattava</div>
          <h1 className="font-display text-3xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Operations Dashboard</h1>
        </div>
        <button onClick={logout} className="btn-outline" data-testid="admin-logout"><LogOut size={14} /> Logout</button>
      </section>

      <section className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap mb-8 border-b border-ink/10 pb-4">
            {["stats", "orders", "leads", "newsletter", "bookings"].map((t) => (
              <button key={t} onClick={() => setTab(t)} data-testid={`admin-tab-${t}`} className={`eyebrow text-[10px] px-4 py-2 border ${tab === t ? "bg-ink text-cream border-ink" : "border-ink/15 hover:border-gold"}`}>{t}</button>
            ))}
          </div>

          {tab === "stats" && stats && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(stats).map(([k, v]) => (
                <div key={k} className="bg-white border border-ink/10 p-6">
                  <div className="eyebrow text-[10px] text-ink/60 mb-3">{k}</div>
                  <div className="font-display text-4xl gold-gradient-text" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {tab !== "stats" && (
            <div className="bg-white border border-ink/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-deep/40 text-left">
                  <tr>
                    {data[0] && Object.keys(data[0]).slice(0, 6).map((k) => (
                      <th key={k} className="eyebrow text-[10px] p-3">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-t border-ink/10">
                      {Object.values(row).slice(0, 6).map((v, j) => (
                        <td key={j} className="p-3 text-ink/80 max-w-[260px] truncate">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length === 0 && <div className="p-10 text-center text-ink/50 eyebrow">No entries yet.</div>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
