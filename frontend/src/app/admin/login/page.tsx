"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post<{ ok: boolean; token?: string; admin: { name: string; email: string; role: string } }>(
        "/auth/admin/auth/login",
        { email, password }
      );
      localStorage.setItem("adminName", data.admin.name);
      // Store token for Bearer auth (used when cookie is blocked cross-origin in dev)
      if (data.token) sessionStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .al-page {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: var(--font-jost, 'Jost'), sans-serif;
        }
        .al-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(200,150,62,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 20% 70%, rgba(45,74,62,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .al-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(200,150,62,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,150,62,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .al-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 24px;
          padding: 52px 44px;
          background: rgba(26,26,26,0.95);
          border: 1px solid rgba(200,150,62,0.15);
          backdrop-filter: blur(20px);
          animation: alEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes alEnter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .al-brand { font-family: var(--font-cormorant, 'Cormorant Garamond'), serif; font-size: 26px; font-weight: 700; color: #F5F0EB; letter-spacing: 0.06em; }
        .al-sub { font-size: 10px; letter-spacing: 0.32em; color: #C8963E; text-transform: uppercase; margin-top: 2px; margin-bottom: 44px; }
        .al-title { font-family: var(--font-cormorant, 'Cormorant Garamond'), serif; font-size: 30px; font-weight: 600; color: #F5F0EB; margin: 0 0 6px; }
        .al-desc { font-size: 13px; color: rgba(245,240,235,0.38); margin: 0 0 32px; font-weight: 300; }
        .al-field { margin-bottom: 18px; }
        .al-label { display: block; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,240,235,0.45); margin-bottom: 7px; }
        .al-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,150,62,0.2);
          color: #F5F0EB;
          font-family: var(--font-jost, 'Jost'), sans-serif;
          font-size: 14px;
          font-weight: 300;
          padding: 13px 15px;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
          border-radius: 2px;
        }
        .al-input:focus { border-color: rgba(200,150,62,0.55); background: rgba(200,150,62,0.04); }
        .al-input::placeholder { color: rgba(245,240,235,0.18); }
        .al-error {
          background: rgba(220,50,50,0.1);
          border: 1px solid rgba(220,50,50,0.3);
          color: #ff7b7b;
          font-size: 13px;
          padding: 11px 13px;
          margin-bottom: 18px;
          border-radius: 2px;
          font-weight: 300;
        }
        .al-btn {
          width: 100%;
          background: #C8963E;
          color: #1A1A1A;
          border: none;
          font-family: var(--font-jost, 'Jost'), sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 15px;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
          margin-top: 6px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .al-btn:hover:not(:disabled) { background: #b5852f; transform: translateY(-1px); }
        .al-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .al-spinner { width: 13px; height: 13px; border: 2px solid rgba(26,26,26,0.3); border-top-color: #1A1A1A; border-radius: 50%; animation: spin 0.65s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .al-rule { height: 1px; background: rgba(200,150,62,0.1); margin: 32px 0 18px; }
        .al-foot { font-size: 11px; color: rgba(245,240,235,0.18); text-align: center; letter-spacing: 0.04em; }
      `}</style>

      <div className="al-page">
        <div className="al-bg" />
        <div className="al-grid" />
        <div className="al-card">
          <div className="al-brand">3TATTAVA</div>
          <div className="al-sub">Operations Center</div>

          <h1 className="al-title">Admin Access</h1>
          <p className="al-desc">Sign in to manage products, orders, and inventory.</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="al-error">{error}</div>}

            <div className="al-field">
              <label className="al-label">Email Address</label>
              <input
                type="email"
                className="al-input"
                placeholder="admin@3tattava.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <input
                type="password"
                className="al-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="al-btn" disabled={loading}>
              {loading && <span className="al-spinner" />}
              {loading ? "Signing In..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="al-rule" />
          <p className="al-foot">3TATTAVA · SankalpaSiddhi Ayupharma Pvt Ltd</p>
        </div>
      </div>
    </>
  );
}
