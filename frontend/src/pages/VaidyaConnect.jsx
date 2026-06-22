import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Award, Languages, Calendar, ArrowRight } from "lucide-react";
import { getDoctors, bookDoctor } from "../lib/api";

export default function VaidyaConnect() {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", preferred_date: "", concern: "", consultation_type: "paid" });
  const [status, setStatus] = useState(null);

  useEffect(() => { getDoctors().then(setDoctors).catch(() => {}); }, []);

  const book = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setStatus("Submitting...");
    try {
      const res = await bookDoctor({ ...form, doctor_slug: selected.slug });
      setStatus(`Confirmed · Booking #${res.booking_id.slice(0, 8)}. We'll be in touch.`);
      setForm({ name: "", email: "", phone: "", preferred_date: "", concern: "", consultation_type: "paid" });
    } catch {
      setStatus("Something went wrong. Try again.");
    }
  };

  return (
    <div data-testid="vaidyaconnect-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6"><Stethoscope size={14} className="inline mr-2" /> VaidyaConnect <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /></div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Talk to a <span className="gold-gradient-text">Performance Ayurveda</span> Expert.
          </h1>
          <p className="font-italic-light text-xl text-cream/75 mt-6 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            Doctor-led guidance. Personalized programs. Complimentary starter consultations.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-ink/60 mb-4">Our Experts</div>
          <h2 className="font-display text-4xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>The Doctor Network.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {doctors.map((d) => (
              <div key={d.slug} className="luxe-card overflow-hidden grid md:grid-cols-[180px_1fr]" data-testid={`doctor-card-${d.slug}`}>
                <img src={d.photo} alt={d.name} className="w-full h-full object-cover min-h-[220px]" />
                <div className="p-6">
                  <div className="eyebrow text-gold-dark text-[10px] mb-3">{d.specialty}</div>
                  <div className="font-display text-2xl mb-1" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{d.name}</div>
                  <div className="eyebrow text-[10px] text-ink/60 mb-3">{d.title}</div>
                  <p className="text-sm text-ink/75 mb-4">{d.bio}</p>
                  <div className="flex items-center gap-3 text-xs text-ink/60 mb-4">
                    <span className="flex items-center gap-1"><Award size={11} /> {d.credentials}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink/60 mb-5">
                    <span className="flex items-center gap-1"><Languages size={11} /> {d.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-ink/10 pt-4">
                    <div>
                      <div className="eyebrow text-[10px] text-ink/60">{d.consultation_type}</div>
                      <div className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{d.consultation_fee === 0 ? "Free" : `₹${d.consultation_fee}`}</div>
                    </div>
                    <button onClick={() => setSelected(d)} data-testid={`book-${d.slug}`} className="btn-outline-dark text-[10px] px-5 py-3">Book <ArrowRight size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-[80] flex items-center justify-center p-6" onClick={() => setSelected(null)} data-testid="booking-modal">
          <form onClick={(e) => e.stopPropagation()} onSubmit={book} className="bg-cream w-full max-w-lg p-8 md:p-10 relative">
            <div className="eyebrow text-gold-dark mb-2">Book Consultation</div>
            <h3 className="font-display text-2xl mb-1" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{selected.name}</h3>
            <div className="text-xs text-ink/60 mb-6">{selected.consultation_type} · {selected.consultation_fee === 0 ? "Free" : `₹${selected.consultation_fee}`}</div>
            <div className="grid grid-cols-1 gap-4">
              <input required placeholder="FULL NAME" data-testid="booking-name" className="luxe-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" placeholder="EMAIL" data-testid="booking-email" className="luxe-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required placeholder="PHONE / WHATSAPP" data-testid="booking-phone" className="luxe-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required type="date" data-testid="booking-date" className="luxe-input" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
              <textarea required rows="3" placeholder="YOUR CONCERN / GOAL" data-testid="booking-concern" className="luxe-input resize-none" value={form.concern} onChange={(e) => setForm({ ...form, concern: e.target.value })} />
              {selected.consultation_fee > 0 && (
                <label className="flex items-start gap-2 text-xs text-ink/70">
                  <input type="checkbox" required className="mt-0.5" /> I acknowledge this is a paid consultation (₹{selected.consultation_fee}).
                </label>
              )}
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setSelected(null)} className="btn-outline-dark flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1" data-testid="booking-submit">Confirm Booking</button>
            </div>
            {status && <div data-testid="booking-status" className="text-xs eyebrow mt-4 text-gold-dark">{status}</div>}
          </form>
        </div>
      )}

      <section className="section bg-ink text-cream text-center">
        <Calendar size={32} className="text-gold mx-auto mb-6" />
        <h2 className="font-display text-3xl md:text-5xl max-w-3xl mx-auto" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.1 }}>
          Need help choosing your <span className="gold-gradient-text">ritual?</span>
        </h2>
        <p className="text-cream/70 mt-6 max-w-xl mx-auto">Take the Performance Assessment to get a personalized recommendation in 2 minutes.</p>
        <Link to="/assessment" className="btn-primary mt-8">Take Assessment <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}
