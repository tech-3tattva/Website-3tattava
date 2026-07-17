"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

const GOLD = "#C8963E";
const INK = "#1c1304";
const CREAM = "#f7f0e2";
const FONT = "var(--font-primary), system-ui, sans-serif";

type Props = {
  open: boolean;
  onClose: () => void;
  doctorSlug?: string;
  doctorName?: string;
};

type SlotsResponse = { available: string[]; closed: boolean; reason?: string };
type BookingResponse = {
  booking: { bookingId: string; meetLink: string; isFreeConsultation: boolean; fee: number; appointment: { date: string; timeSlot: string } };
};

const HEALTH_GOALS = ["Energy & stamina", "Weight management", "Digestion & gut", "Women's wellness", "Sports performance", "Sleep & stress", "General wellbeing"];
const BODY_FRAME = ["Thin / light", "Medium", "Broad / heavy"];
const APPETITE = ["Low / irregular", "Variable", "Strong / steady"];
const DIGESTION = ["Irregular / gas", "Sharp / acidic", "Slow / heavy"];
const SLEEP = ["Light / disturbed", "Moderate", "Deep / heavy"];
const ENERGY = ["Bursts then crash", "Intense / driven", "Steady / slow to start"];
const BOWEL = ["Irregular / dry", "Regular", "Sluggish / loose"];
const DIET = ["Vegetarian", "Non-vegetarian", "Vegan", "Eggetarian"];
const ACTIVITY = ["Sedentary", "Moderate", "Active / athlete"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function labelDate(d: Date) {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${pad(m)} ${ap}`;
}

// Next 30 days, excluding Sundays (Dr. Falguni's clinic is closed Sunday).
function upcomingDays(count = 30): Date[] {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 0; out.length < count && i < count + 10; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (d.getDay() !== 0) out.push(d);
  }
  return out;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#fff",
  border: "1px solid rgba(28,19,4,.16)",
  borderRadius: 8,
  color: INK,
  fontSize: 14,
  fontFamily: FONT,
  outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "rgba(28,19,4,.5)",
  marginBottom: 5,
  fontWeight: 600,
};

export default function ConsultationModal({ open, onClose, doctorSlug = "dr-falguni-chauhan", doctorName = "Dr. Falguni Chauhan" }: Props) {
  const [step, setStep] = useState<"slot" | "form" | "done">("slot");
  const [days] = useState<Date[]>(() => upcomingDays());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<SlotsResponse | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", gender: "female",
    healthGoal: HEALTH_GOALS[0], primaryConcern: "", bodyFrame: BODY_FRAME[1],
    appetite: APPETITE[1], digestion: DIGESTION[0], sleep: SLEEP[1], energyPattern: ENERGY[0],
    bowelMovement: BOWEL[1], dietPreference: DIET[0], activityLevel: ACTIVITY[1],
    currentMedications: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResponse["booking"] | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const loadSlots = useCallback(async (date: string) => {
    setSlotsLoading(true);
    setSelectedSlot("");
    setSlots(null);
    try {
      const res = await api.get<SlotsResponse>(`/doctors/${doctorSlug}/slots?date=${date}`);
      setSlots(res);
    } catch {
      setSlots({ available: [], closed: false, reason: "Could not load availability. Please try again." });
    } finally {
      setSlotsLoading(false);
    }
  }, [doctorSlug]);

  // On open, default to the first upcoming day + load its slots.
  useEffect(() => {
    if (open && days.length && !selectedDate) {
      const first = fmtDate(days[0]);
      setSelectedDate(first);
      void loadSlots(first);
    }
    if (!open) {
      // reset when closed
      setStep("slot"); setSelectedDate(""); setSlots(null); setSelectedSlot("");
      setResult(null); setError(null);
    }
  }, [open, days, selectedDate, loadSlots]);

  function pickDate(d: Date) {
    const s = fmtDate(d);
    setSelectedDate(s);
    void loadSlots(s);
  }

  async function submit() {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.age.trim()) {
      setError("Please fill your name, email, phone and age.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post<BookingResponse>("/bookings/consultation", {
        doctorSlug, date: selectedDate, timeSlot: selectedSlot,
        name: form.name, email: form.email, phone: form.phone, age: Number(form.age), gender: form.gender,
        prakriti: {
          healthGoal: form.healthGoal, primaryConcern: form.primaryConcern, bodyFrame: form.bodyFrame,
          appetite: form.appetite, digestion: form.digestion, sleep: form.sleep, energyPattern: form.energyPattern,
          bowelMovement: form.bowelMovement, dietPreference: form.dietPreference, activityLevel: form.activityLevel,
          currentMedications: form.currentMedications, notes: form.notes,
        },
      });
      setResult(res.booking);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed. Please try another slot.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(20,12,4,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px", overflowY: "auto" }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: .98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(680px,100%)", background: CREAM, borderRadius: 20, padding: "clamp(20px,3vw,34px)", fontFamily: FONT, position: "relative", boxShadow: "0 30px 80px rgba(28,19,4,.4)" }}
          >
            <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 18, background: "transparent", border: "none", fontSize: 24, color: "rgba(28,19,4,.5)", cursor: "pointer", lineHeight: 1 }}>×</button>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>Free First Consultation · with Diet Chart</p>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: INK, lineHeight: 1.2 }}>Book with {doctorName}</h2>
              <p style={{ fontSize: 13, color: "rgba(28,19,4,.55)", marginTop: 4 }}>
                Your first 30-minute online consultation is complimentary — including a personalised Prakriti-based diet chart.
              </p>
            </div>

            {error && <p style={{ background: "#fbeaea", border: "1px solid #edc4c4", color: "#a13a3a", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</p>}

            {/* STEP 1 — date + slot */}
            {step === "slot" && (
              <div>
                <p style={labelStyle}>Choose a date</p>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 18 }}>
                  {days.map((d) => {
                    const s = fmtDate(d);
                    const active = s === selectedDate;
                    return (
                      <button key={s} onClick={() => pickDate(d)} style={{
                        flexShrink: 0, minWidth: 74, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(28,19,4,.14)",
                        background: active ? GOLD : "#fff", color: active ? "#2a1c0d" : INK,
                        fontFamily: FONT, fontSize: 13, fontWeight: active ? 700 : 500, textAlign: "center", lineHeight: 1.35,
                      }}>
                        {labelDate(d).split(" ").map((p, i) => <div key={i}>{p}</div>)}
                      </button>
                    );
                  })}
                </div>

                <p style={labelStyle}>Available time slots {selectedDate && <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(28,19,4,.4)", fontWeight: 400 }}>· real-time</span>}</p>
                {slotsLoading ? (
                  <p style={{ color: "rgba(28,19,4,.5)", fontSize: 14, padding: "12px 0" }}>Loading availability…</p>
                ) : slots && slots.available.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(92px,1fr))", gap: 8 }}>
                    {slots.available.map((t) => {
                      const active = t === selectedSlot;
                      return (
                        <button key={t} onClick={() => setSelectedSlot(t)} style={{
                          padding: "10px 8px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 13.5, fontWeight: active ? 700 : 500,
                          border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(28,19,4,.14)",
                          background: active ? GOLD : "#fff", color: active ? "#2a1c0d" : INK,
                        }}>{to12h(t)}</button>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "rgba(28,19,4,.55)", fontSize: 14, padding: "10px 0" }}>
                    {slots?.closed ? "Closed on this day — please pick another date." : (slots?.reason || "No slots left for this day. Booked slots are hidden — please pick the next available date.")}
                  </p>
                )}

                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep("form")}
                  style={{ marginTop: 22, width: "100%", padding: "14px", borderRadius: 10, border: "none", cursor: selectedSlot ? "pointer" : "not-allowed",
                    background: selectedSlot ? GOLD : "rgba(200,150,62,.4)", color: "#2a1c0d", fontSize: 14, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", fontFamily: FONT }}
                >
                  Continue to Prakriti form →
                </button>
              </div>
            )}

            {/* STEP 2 — Prakriti form */}
            {step === "form" && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(28,19,4,.6)", marginBottom: 16 }}>
                  Selected: <b style={{ color: INK }}>{labelDate(new Date(selectedDate + "T00:00:00"))} · {to12h(selectedSlot)}</b>{" "}
                  <button onClick={() => setStep("slot")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>change</button>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div><label style={labelStyle}>Full name *</label><input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
                  <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
                  <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
                  <div><label style={labelStyle}>Age *</label><input style={inputStyle} type="number" min={1} value={form.age} onChange={(e) => set("age", e.target.value)} /></div>
                  <div><label style={labelStyle}>Gender</label>
                    <select style={inputStyle} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                      <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div style={{ height: 1, background: "rgba(200,150,62,.25)", margin: "6px 0 16px" }} />
                <p style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD, marginBottom: 12, fontWeight: 700 }}>Prakriti (body-type) details</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                  {([
                    ["Primary health goal", "healthGoal", HEALTH_GOALS],
                    ["Body frame", "bodyFrame", BODY_FRAME],
                    ["Appetite", "appetite", APPETITE],
                    ["Digestion", "digestion", DIGESTION],
                    ["Sleep", "sleep", SLEEP],
                    ["Energy pattern", "energyPattern", ENERGY],
                    ["Bowel movement", "bowelMovement", BOWEL],
                    ["Diet preference", "dietPreference", DIET],
                    ["Activity level", "activityLevel", ACTIVITY],
                  ] as [string, keyof typeof form, string[]][]).map(([lab, key, opts]) => (
                    <div key={key}>
                      <label style={labelStyle}>{lab}</label>
                      <select style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)}>
                        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Primary concern (optional)</label>
                  <input style={inputStyle} value={form.primaryConcern} onChange={(e) => set("primaryConcern", e.target.value)} placeholder="e.g. low stamina, bloating, irregular cycles" />
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Current medications / supplements (optional)</label>
                  <input style={inputStyle} value={form.currentMedications} onChange={(e) => set("currentMedications", e.target.value)} />
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Anything else (optional)</label>
                  <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>

                <button disabled={submitting} onClick={() => void submit()} style={{ marginTop: 22, width: "100%", padding: "15px", borderRadius: 10, border: "none",
                  cursor: submitting ? "default" : "pointer", background: submitting ? "rgba(200,150,62,.5)" : GOLD, color: "#2a1c0d", fontSize: 14, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", fontFamily: FONT }}>
                  {submitting ? "Booking your consultation…" : "Confirm free consultation"}
                </button>
              </div>
            )}

            {/* STEP 3 — success */}
            {step === "done" && result && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(120,180,90,.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 30 }}>✓</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>Consultation confirmed!</h3>
                <p style={{ fontSize: 14, color: "rgba(28,19,4,.6)", marginBottom: 4 }}>
                  {labelDate(new Date(result.appointment.date + "T00:00:00"))} · {to12h(result.appointment.timeSlot)} IST · with {doctorName}
                </p>
                <p style={{ fontSize: 13, color: "rgba(28,19,4,.5)", marginBottom: 20 }}>Booking ID: {result.bookingId}{result.isFreeConsultation ? " · Free first consultation" : ""}</p>

                <div style={{ background: "#fff", border: `1px solid rgba(200,150,62,.35)`, borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                  <p style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: GOLD, marginBottom: 8, fontWeight: 700 }}>Your video meeting link</p>
                  <a href={result.meetLink} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#1a5fb4", wordBreak: "break-all" }}>{result.meetLink}</a>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
                    <a href={result.meetLink} target="_blank" rel="noreferrer" style={{ padding: "10px 20px", borderRadius: 8, background: GOLD, color: "#2a1c0d", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Join video call</a>
                    <button onClick={() => navigator.clipboard?.writeText(result.meetLink)} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(28,19,4,.2)", color: INK, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Copy link</button>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "rgba(28,19,4,.55)" }}>
                  A confirmation with this link has been emailed to you, and {doctorName} has received your Prakriti details.
                </p>
                <button onClick={onClose} style={{ marginTop: 20, padding: "12px 30px", borderRadius: 8, border: "1px solid rgba(28,19,4,.2)", background: "transparent", color: INK, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Done</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
