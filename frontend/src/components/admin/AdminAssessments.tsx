"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

type Assessment = {
  id: string;
  user?: string;
  name: string;
  email: string;
  phone: string;
  stage: string;
  sanskrit?: string;
  stageLine?: string;
  energyScore: number;
  recoveryScore: number;
  ritual?: { name?: string; slug?: string; tagline?: string; why?: string };
  other?: { name?: string; slug?: string; tagline?: string; why?: string };
  answers?: { id: string; question: string; answer: string }[];
  source?: string;
  createdAt: string;
};

const STAGE_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  Balance: { fg: "#C8963E", bg: "rgba(200,150,62,0.12)", border: "rgba(200,150,62,0.3)" },
  Build:   { fg: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.3)" },
  Become:  { fg: "#a78bfa", bg: "rgba(167,139,250,0.14)", border: "rgba(167,139,250,0.35)" },
};

function StageBadge({ stage }: { stage: string }) {
  const c = STAGE_COLORS[stage] ?? { fg: "rgba(245,240,235,0.6)", bg: "rgba(245,240,235,0.06)", border: "rgba(245,240,235,0.15)" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 2,
      color: c.fg, background: c.bg, border: `1px solid ${c.border}`,
      letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{stage || "—"}</span>
  );
}

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const d = await adminApi.get<{ assessments: Assessment[]; total: number }>("/admin/assessments");
      setAssessments(d.assessments); setTotal(d.total);
    } catch { setAssessments([]); setError(true); }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  return (
    <div>
      <p style={{ fontSize: 12, color: "rgba(245,240,235,0.35)", marginBottom: 18 }}>
        {total} total performance assessments submitted
      </p>
      {loading ? (
        <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>Loading…</p>
      ) : error ? (
        <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>Could not load assessments. Please try again.</p>
      ) : assessments.length === 0 ? (
        <p style={{ color: "rgba(245,240,235,0.3)", fontSize: 13 }}>No assessments yet. They appear once users complete the performance quiz.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                {["Name","Email","Phone","Stage","Energy","Recovery","Recommended Ritual","Date"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(245,240,235,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                  <td style={{ padding: "10px 12px", color: "#F5F0EB" }}>{a.name}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.6)" }}>{a.email}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.6)" }}>{a.phone}</td>
                  <td style={{ padding: "10px 12px" }}><StageBadge stage={a.stage} /></td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.5)", fontSize: 12 }}>{a.energyScore}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.5)", fontSize: 12 }}>{a.recoveryScore}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.4)", fontSize: 12 }}>{a.ritual?.name ?? "—"}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(245,240,235,0.35)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
