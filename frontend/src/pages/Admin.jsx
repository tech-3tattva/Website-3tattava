import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Lock, LogOut, Plus, Edit2, Trash2, X, Check } from "lucide-react";

const LS_KEY = "3tattava_admin_token";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(LS_KEY) || "");
  const [authed, setAuthed] = useState(!!localStorage.getItem(LS_KEY));
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("stats");
  const [data, setData] = useState([]);

  const auth = () => ({ Authorization: `Bearer ${token}` });

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
    api.get("/admin/stats", { headers: auth() }).then((r) => setStats(r.data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const refreshTab = async (t = tab) => {
    if (!authed) return;
    if (t === "stats") {
      const r = await api.get("/admin/stats", { headers: auth() });
      setStats(r.data);
      return;
    }
    if (t === "products") {
      const r = await api.get("/products");
      setData(r.data);
      return;
    }
    const map = { orders: "/admin/orders", leads: "/admin/leads", newsletter: "/admin/newsletter", bookings: "/admin/bookings", assessments: "/admin/assessments", contacts: "/admin/contacts" };
    try {
      const r = await api.get(map[t], { headers: auth() });
      setData(r.data);
    } catch {
      setData([]);
    }
  };

  useEffect(() => { refreshTab(tab); /* eslint-disable-next-line */ }, [tab, authed]);

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
            {["stats", "products", "orders", "leads", "newsletter", "bookings", "assessments", "contacts"].map((t) => (
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

          {tab === "products" && <ProductManager token={token} products={data} refresh={() => refreshTab("products")} />}

          {tab !== "stats" && tab !== "products" && (
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

const EMPTY_PRODUCT = {
  slug: "", name: "", tagline: "", ritual_name: "", price: 0, compare_at: null,
  category: "Shilajit Resin", image: "", short_desc: "", long_desc: "",
  benefits: [], badges: [], accent_color: "#C8963E", in_stock: true, is_featured: false,
};

function ProductManager({ token, products, refresh }) {
  const [editing, setEditing] = useState(null);

  const save = async (p) => {
    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      ...p,
      price: Number(p.price) || 0,
      compare_at: p.compare_at ? Number(p.compare_at) : null,
      benefits: typeof p.benefits === "string" ? p.benefits.split("\n").map((s) => s.trim()).filter(Boolean) : (p.benefits || []),
      badges: typeof p.badges === "string" ? p.badges.split(",").map((s) => s.trim()).filter(Boolean) : (p.badges || []),
    };
    const exists = products.find((x) => x.slug === payload.slug);
    if (exists && editing?._editingExisting) {
      await api.put(`/admin/products/${payload.slug}`, payload, { headers });
    } else {
      await api.post("/admin/products", payload, { headers });
    }
    setEditing(null);
    refresh();
  };

  const remove = async (slug) => {
    if (!window.confirm(`Delete ${slug}?`)) return;
    await api.delete(`/admin/products/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="eyebrow text-ink/60">Products · {products.length}</div>
        <button data-testid="admin-add-product" onClick={() => setEditing({ ...EMPTY_PRODUCT, _editingExisting: false })} className="btn-primary"><Plus size={12} /> New Product</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.slug} className="bg-white border border-ink/10 p-5 flex gap-4" data-testid={`admin-product-${p.slug}`}>
            <img src={p.image} alt={p.name} className="w-20 h-24 object-cover border border-ink/10" />
            <div className="flex-1">
              <div className="eyebrow text-[10px] text-ink/50">{p.category}</div>
              <div className="font-display text-base mt-1" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{p.name}</div>
              <div className="text-xs text-ink/70 mt-1">₹{p.price?.toLocaleString("en-IN")}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing({ ...p, _editingExisting: true })} className="text-[10px] eyebrow px-2 py-1 border border-ink/15 hover:border-gold" data-testid={`admin-edit-${p.slug}`}><Edit2 size={10} className="inline mr-1" /> Edit</button>
                <button onClick={() => remove(p.slug)} className="text-[10px] eyebrow px-2 py-1 border border-terracotta/30 text-terracotta hover:bg-terracotta/10" data-testid={`admin-delete-${p.slug}`}><Trash2 size={10} className="inline mr-1" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-[80] flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); save(editing); }} className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative" data-testid="admin-product-form">
            <button type="button" onClick={() => setEditing(null)} aria-label="close" className="absolute top-4 right-4 text-ink/60 hover:text-ink"><X size={18} /></button>
            <div className="eyebrow text-gold-dark mb-2">{editing._editingExisting ? "Edit Product" : "New Product"}</div>
            <h3 className="font-display text-2xl mb-6" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{editing.name || "Untitled"}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Slug" required value={editing.slug} disabled={editing._editingExisting} onChange={(v) => setEditing({ ...editing, slug: v })} testid="pf-slug" />
              <Field label="Name" required value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} testid="pf-name" />
              <Field label="Tagline" value={editing.tagline} onChange={(v) => setEditing({ ...editing, tagline: v })} testid="pf-tagline" />
              <Field label="Ritual Name" value={editing.ritual_name} onChange={(v) => setEditing({ ...editing, ritual_name: v })} testid="pf-ritual" />
              <Field label="Category" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} testid="pf-category" />
              <Field label="Accent Color (hex)" value={editing.accent_color} onChange={(v) => setEditing({ ...editing, accent_color: v })} testid="pf-accent" />
              <Field label="Price (₹)" required type="number" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} testid="pf-price" />
              <Field label="Compare-At (₹)" type="number" value={editing.compare_at ?? ""} onChange={(v) => setEditing({ ...editing, compare_at: v || null })} testid="pf-compare" />
              <Field label="Image URL" wide value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} testid="pf-image" />
              <Field label="Short Description" wide value={editing.short_desc} onChange={(v) => setEditing({ ...editing, short_desc: v })} testid="pf-short" />
              <Field label="Long Description" wide multiline value={editing.long_desc} onChange={(v) => setEditing({ ...editing, long_desc: v })} testid="pf-long" />
              <Field label="Benefits (one per line)" wide multiline value={Array.isArray(editing.benefits) ? editing.benefits.join("\n") : editing.benefits} onChange={(v) => setEditing({ ...editing, benefits: v })} testid="pf-benefits" />
              <Field label="Badges (comma-separated)" wide value={Array.isArray(editing.badges) ? editing.badges.join(", ") : editing.badges} onChange={(v) => setEditing({ ...editing, badges: v })} testid="pf-badges" />
            </div>

            <div className="flex items-center gap-6 mt-6">
              <label className="flex items-center gap-2 eyebrow text-[10px]">
                <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} /> In Stock
              </label>
              <label className="flex items-center gap-2 eyebrow text-[10px]">
                <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> Featured
              </label>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1" data-testid="admin-product-save"><Check size={14} /> Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", wide, multiline, testid, disabled }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="eyebrow text-[10px] text-ink/60 block mb-1">{label}{required && " *"}</span>
      {multiline ? (
        <textarea rows={3} required={required} value={value || ""} onChange={(e) => onChange(e.target.value)} className="luxe-input resize-none" data-testid={testid} />
      ) : (
        <input required={required} type={type} value={value ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="luxe-input disabled:opacity-50" data-testid={testid} />
      )}
    </label>
  );
}
