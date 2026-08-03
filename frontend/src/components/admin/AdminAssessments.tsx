"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { DoctorScoring, DoshaScore } from "@/lib/api";
import { DOCTOR_SCORING_TRAITS } from "@/data/prakriti";

type PrakritiAnswer = {
  section?: string;
  key?: string;
  question?: string;
  answer?: string;
  dosha?: "vata" | "pitta" | "kapha";
};

type Assessment = {
  id: string;
  user?: string;
  name: string;
  email: string;
  phone: string;
  kind?: "performance" | "prakriti";
  // legacy performance quiz
  stage?: string;
  sanskrit?: string;
  stageLine?: string;
  energyScore?: number;
  recoveryScore?: number;
  ritual?: { name?: string; slug?: string; tagline?: string; why?: string };
  other?: { name?: string; slug?: string; tagline?: string; why?: string };
  answers?: { id: string; question: string; answer: string }[];
  // prakriti analysis
  patient?: {
    fullName?: string; age?: string; gender?: string; height?: string; weight?: string;
    occupation?: string; dailyActivity?: string; chiefComplaints?: string; durationComplaints?: string;
  };
  prakritiAnswers?: PrakritiAnswer[];
  medicalHistory?: {
    chronicConditions?: string; painAreas?: string; inflammation?: string;
    hormonalIssues?: string; lifestyleDiseases?: string;
  };
  preliminaryDosha?: { vata?: number; pitta?: number; kapha?: number; primary?: string };
  doctorScoring?: DoctorScoring;
  source?: string;
  createdAt: string;
};

const STAGE_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  Balance: { fg: "#C8963E", bg: "rgba(200,150,62,0.12)", border: "rgba(200,150,62,0.3)" },
  Build:   { fg: "#2e7d32", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.3)" },
  Become:  { fg: "#7c3aed", bg: "rgba(167,139,250,0.14)", border: "rgba(167,139,250,0.35)" },
};

function StageBadge({ stage }: { stage: string }) {
  const c = STAGE_COLORS[stage] ?? { fg: "rgba(68,42,27,0.6)", bg: "rgba(68,42,27,0.06)", border: "rgba(68,42,27,0.15)" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 2,
      color: c.fg, background: c.bg, border: `1px solid ${c.border}`,
      letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{stage || "—"}</span>
  );
}

// ── Section 12 form state ────────────────────────────────
type TraitScores = Record<string, { vata: number; pitta: number; kapha: number }>;
const DOSHAS = ["vata", "pitta", "kapha"] as const;
type DoshaKey = (typeof DOSHAS)[number];

function initialScores(ds?: DoctorScoring): TraitScores {
  const out: TraitScores = {};
  for (const t of DOCTOR_SCORING_TRAITS) {
    const s = ds ? (ds[t.key as keyof DoctorScoring] as DoshaScore | undefined) : undefined;
    out[t.key] = { vata: s?.vata ?? 0, pitta: s?.pitta ?? 0, kapha: s?.kapha ?? 0 };
  }
  return out;
}

function clamp5(v: number): number {
  return Math.max(0, Math.min(5, Number(v) || 0));
}

function groupAnswersBySection(answers: PrakritiAnswer[]): [string, PrakritiAnswer[]][] {
  const map = new Map<string, PrakritiAnswer[]>();
  for (const a of answers) {
    const sec = a.section?.trim() || "Other";
    const list = map.get(sec);
    if (list) list.push(a);
    else map.set(sec, [a]);
  }
  return Array.from(map.entries());
}

// ── Small presentational helpers (dark admin theme) ──────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{
      fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
      color: "#C8963E", margin: "22px 0 10px", fontWeight: 600,
    }}>{children}</h4>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value || !value.trim()) return null;
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(68,42,27,0.35)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#442a1b", whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
}

// ── Detail / scoring modal ───────────────────────────────
function DetailPanel({
  selected, onClose, onSaved,
}: {
  selected: Assessment;
  onClose: () => void;
  onSaved: (updated: Assessment) => void;
}) {
  const [scores, setScores] = useState<TraitScores>(() => initialScores(selected.doctorScoring));
  const [analysis, setAnalysis] = useState<string>(selected.doctorScoring?.analysis ?? "");
  const [doshaResult, setDoshaResult] = useState<string>(selected.doctorScoring?.doshaResult ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState(false);

  const p = selected.patient;
  const mh = selected.medicalHistory;
  const pd = selected.preliminaryDosha;
  const grouped = groupAnswersBySection(selected.prakritiAnswers ?? []);

  function setScore(key: string, dosha: DoshaKey, raw: string) {
    const n = clamp5(Number(raw));
    setScores(prev => ({ ...prev, [key]: { ...prev[key], [dosha]: n } }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaveErr(false);
    setSaved(false);
    try {
      const scored: Record<string, DoshaScore> = {};
      for (const t of DOCTOR_SCORING_TRAITS) {
        const s = scores[t.key];
        scored[t.key] = { vata: clamp5(s.vata), pitta: clamp5(s.pitta), kapha: clamp5(s.kapha) };
      }
      const body = { ...scored, analysis: analysis.trim(), doshaResult: doshaResult.trim() };
      const res = await adminApi.patch<{ assessment: Assessment }>(
        `/admin/assessments/${selected.id}/scoring`,
        body,
      );
      onSaved(res.assessment);
      setSaved(true);
    } catch {
      setSaveErr(true);
    }
    setSaving(false);
  }

  const numInputStyle: React.CSSProperties = {
    width: 46, padding: "5px 6px", textAlign: "center",
    background: "rgba(68,42,27,0.04)", border: "1px solid rgba(200,150,62,0.2)",
    borderRadius: 3, color: "#442a1b", fontSize: 13,
  };
  const textInputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px",
    background: "rgba(68,42,27,0.04)", border: "1px solid rgba(200,150,62,0.2)",
    borderRadius: 3, color: "#442a1b", fontSize: 13, fontFamily: "inherit",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "40px 16px", zIndex: 1000, overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 760, background: "#faf6ee",
          border: "1px solid rgba(200,150,62,0.25)", borderRadius: 6,
          padding: "26px 28px 30px", position: "relative",
          maxHeight: "calc(100vh - 80px)", overflowY: "auto",
          color: "#442a1b",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 16, background: "transparent",
            border: "none", color: "rgba(68,42,27,0.5)", fontSize: 20,
            cursor: "pointer", lineHeight: 1,
          }}
        >✕</button>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 18, color: "#442a1b", margin: 0 }}>{selected.name || "—"}</h3>
          <span style={{ fontSize: 11, color: "rgba(68,42,27,0.4)" }}>
            {selected.email}{selected.phone ? ` · ${selected.phone}` : ""}
          </span>
        </div>
        <p style={{ fontSize: 11, color: "rgba(68,42,27,0.35)", margin: "4px 0 0" }}>
          {selected.kind === "prakriti" ? "Prakriti Analysis" : "Performance Assessment"}
          {" · "}{new Date(selected.createdAt).toLocaleString("en-IN")}
        </p>

        {selected.kind !== "prakriti" ? (
          /* Legacy performance summary */
          <div style={{ marginTop: 18 }}>
            <SectionHeading>Performance Result</SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
              <Field label="Stage" value={selected.stage} />
              <Field label="Energy Score" value={selected.energyScore != null ? String(selected.energyScore) : undefined} />
              <Field label="Recovery Score" value={selected.recoveryScore != null ? String(selected.recoveryScore) : undefined} />
              <Field label="Recommended Ritual" value={selected.ritual?.name} />
            </div>
            {(selected.answers?.length ?? 0) > 0 && (
              <>
                <SectionHeading>Responses</SectionHeading>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selected.answers!.map(ans => (
                    <div key={ans.id}>
                      <div style={{ fontSize: 12, color: "rgba(68,42,27,0.55)" }}>{ans.question}</div>
                      <div style={{ fontSize: 13, color: "#442a1b" }}>{ans.answer}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Patient details */}
            {p && (
              <>
                <SectionHeading>Patient Details</SectionHeading>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
                  <Field label="Full name" value={p.fullName} />
                  <Field label="Age" value={p.age} />
                  <Field label="Gender" value={p.gender} />
                  <Field label="Height" value={p.height} />
                  <Field label="Weight" value={p.weight} />
                  <Field label="Occupation" value={p.occupation} />
                  <Field label="Daily activity" value={p.dailyActivity} />
                  <Field label="Chief complaints" value={p.chiefComplaints} />
                  <Field label="Duration of complaints" value={p.durationComplaints} />
                </div>
              </>
            )}

            {/* Responses grouped by section */}
            {grouped.length > 0 && (
              <>
                <SectionHeading>Responses</SectionHeading>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {grouped.map(([section, items]) => (
                    <div key={section}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(68,42,27,0.7)", marginBottom: 6 }}>{section}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {items.map((a, i) => (
                          <div key={`${a.key ?? section}-${i}`} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid rgba(68,42,27,0.05)", paddingBottom: 5 }}>
                            <span style={{ fontSize: 12, color: "rgba(68,42,27,0.55)", flex: 1 }}>{a.question ?? a.key ?? "—"}</span>
                            <span style={{ fontSize: 13, color: "#442a1b", flex: 1, textAlign: "right" }}>{a.answer || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Medical history */}
            {mh && (
              <>
                <SectionHeading>Medical History</SectionHeading>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                  <Field label="Chronic conditions" value={mh.chronicConditions} />
                  <Field label="Pain areas" value={mh.painAreas} />
                  <Field label="Inflammation" value={mh.inflammation} />
                  <Field label="Hormonal issues" value={mh.hormonalIssues} />
                  <Field label="Lifestyle diseases" value={mh.lifestyleDiseases} />
                </div>
              </>
            )}

            {/* Preliminary auto dosha */}
            {pd && (
              <>
                <SectionHeading>Preliminary (auto)</SectionHeading>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, color: "#442a1b" }}>Vata <b style={{ color: "#C8963E" }}>{pd.vata ?? 0}</b></span>
                  <span style={{ fontSize: 13, color: "#442a1b" }}>Pitta <b style={{ color: "#C8963E" }}>{pd.pitta ?? 0}</b></span>
                  <span style={{ fontSize: 13, color: "#442a1b" }}>Kapha <b style={{ color: "#C8963E" }}>{pd.kapha ?? 0}</b></span>
                  {pd.primary && (
                    <span style={{ fontSize: 12, color: "rgba(68,42,27,0.5)" }}>Primary: <b style={{ color: "#442a1b", textTransform: "capitalize" }}>{pd.primary}</b></span>
                  )}
                </div>
              </>
            )}

            {/* Section 12 — doctor scoring form */}
            <SectionHeading>Section 12 — Final Prakriti Scoring (doctor)</SectionHeading>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: 13, minWidth: 320 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.2)" }}>
                    {["Trait", "Vata", "Pitta", "Kapha"].map(h => (
                      <th key={h} style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.1em", color: "rgba(68,42,27,0.4)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOCTOR_SCORING_TRAITS.map(t => (
                    <tr key={t.key} style={{ borderBottom: "1px solid rgba(68,42,27,0.05)" }}>
                      <td style={{ padding: "8px 12px", color: "#442a1b" }}>{t.label}</td>
                      {DOSHAS.map(d => (
                        <td key={d} style={{ padding: "6px 12px" }}>
                          <input
                            type="number"
                            min={0}
                            max={5}
                            value={scores[t.key][d]}
                            onChange={e => setScore(t.key, d, e.target.value)}
                            style={numInputStyle}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(68,42,27,0.35)", marginBottom: 5 }}>Analysis</div>
              <textarea
                value={analysis}
                onChange={e => { setAnalysis(e.target.value); setSaved(false); }}
                rows={4}
                placeholder="Doctor's clinical analysis / notes"
                style={{ ...textInputStyle, resize: "vertical" }}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(68,42,27,0.35)", marginBottom: 5 }}>Dosha result</div>
              <input
                type="text"
                value={doshaResult}
                onChange={e => { setDoshaResult(e.target.value); setSaved(false); }}
                placeholder="e.g. Vata-Pitta (Dvidoshaja)"
                style={textInputStyle}
              />
            </div>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => void save()}
                disabled={saving}
                style={{
                  padding: "9px 20px", background: saving ? "rgba(200,150,62,0.4)" : "#C8963E",
                  border: "none", borderRadius: 3, color: "#faf6ee", fontSize: 12,
                  fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                  cursor: saving ? "default" : "pointer",
                }}
              >{saving ? "Saving…" : "Save Prakriti Scoring"}</button>
              {saved && <span style={{ fontSize: 13, color: "#2e7d32" }}>Saved ✓</span>}
              {saveErr && <span style={{ fontSize: 13, color: "#c0392b" }}>Could not save. Please try again.</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Assessment | null>(null);

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

  function handleSaved(updated: Assessment) {
    setAssessments(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    setSelected(prev => (prev && prev.id === updated.id ? updated : prev));
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: "rgba(68,42,27,0.35)", marginBottom: 18 }}>
        {total} total assessments submitted
      </p>
      {loading ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>Loading…</p>
      ) : error ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>Could not load assessments. Please try again.</p>
      ) : assessments.length === 0 ? (
        <p style={{ color: "rgba(68,42,27,0.3)", fontSize: 13 }}>No assessments yet. They appear once users complete a quiz.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,150,62,0.15)" }}>
                {["Name","Type","Email","Phone","Stage","Energy","Recovery","Recommended Ritual","Status","Date","Action"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", color: "rgba(68,42,27,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map(a => {
                const isPrakriti = a.kind === "prakriti";
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid rgba(200,150,62,0.06)" }}>
                    <td style={{ padding: "10px 12px", color: "#442a1b" }}>{a.name}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)", fontSize: 12 }}>{isPrakriti ? "Prakriti" : "Performance"}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{a.email}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.6)" }}>{a.phone}</td>
                    <td style={{ padding: "10px 12px" }}>{a.stage ? <StageBadge stage={a.stage} /> : <span style={{ color: "rgba(68,42,27,0.3)" }}>—</span>}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.5)", fontSize: 12 }}>{a.energyScore ?? "—"}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.5)", fontSize: 12 }}>{a.recoveryScore ?? "—"}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.4)", fontSize: 12 }}>{a.ritual?.name ?? "—"}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>
                      {isPrakriti
                        ? (a.doctorScoring?.filled
                            ? <span style={{ color: "#2e7d32", fontWeight: 600 }}>Scored ✓</span>
                            : <span style={{ color: "rgba(68,42,27,0.4)" }}>Pending review</span>)
                        : <span style={{ color: "rgba(68,42,27,0.3)" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px", color: "rgba(68,42,27,0.35)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <button
                        onClick={() => setSelected(a)}
                        style={{
                          padding: "5px 12px", background: "transparent",
                          border: "1px solid rgba(200,150,62,0.4)", borderRadius: 3,
                          color: "#C8963E", fontSize: 11, fontWeight: 600,
                          letterSpacing: "0.04em", cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >View / Score</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <DetailPanel
          key={selected.id}
          selected={selected}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
