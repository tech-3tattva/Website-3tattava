"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

type DoctorBasic = {
  personal: { fullName: string };
  clinic: { name: string; address: { line1: string; area: string; city: string; pincode: string }; googleMapsLink: string };
  practice: { consultationFee: { inClinic: number; online: number | null } };
};

type BookingResult = {
  bookingId: string;
  doctor: { name: string; clinic: string };
  appointment: { date: string; timeSlot: string; endTime: string; type: string; fee: number };
  clinicAddress: { line1: string; area: string; city: string; pincode: string };
  googleMapsLink: string;
};

function formatTime(t: string) {
  const hour = Number(t.split(":")[0]);
  const min = t.split(":")[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${min} ${ampm}`;
}

export default function BookingFlow({
  slug,
  date,
  slot,
  type,
}: {
  slug: string;
  date: string;
  slot: string;
  type: "in-clinic" | "online";
}) {
  const [doctor, setDoctor] = useState<DoctorBasic | null>(null);
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("prefer-not-to-say");
  const [healthConcern, setHealthConcern] = useState("");
  const [isFirst, setIsFirst] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    api.get<DoctorBasic>(`/doctors/${slug}`).then(setDoctor).catch(() => {});
  }, [slug]);

  const fee = type === "online" && doctor?.practice.consultationFee.online
    ? doctor.practice.consultationFee.online
    : doctor?.practice.consultationFee.inClinic || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !age || !agreed) return;
    setSubmitting(true);
    setError("");

    try {
      const result = await api.post<{ booking: BookingResult }>("/bookings", {
        doctorSlug: slug,
        date,
        timeSlot: slot,
        type,
        name,
        phone,
        email,
        age: Number(age),
        gender,
        healthConcern,
        isFirstAyurvedaVisit: isFirst,
      });
      setBooking(result.booking);
      setStep("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="animate-pulse text-text-medium">Loading...</div>
      </div>
    );
  }

  if (step === "confirmed" && booking) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-[0_16px_40px_rgba(24,24,24,0.08)]"
        >
          <CheckCircle2 size={56} className="mx-auto text-primary-green mb-4" />
          <h1 className="font-display text-3xl text-text-dark mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Booking Confirmed!
          </h1>
          <p className="text-sm text-text-medium mb-6">
            Booking ID: <span className="font-mono font-medium text-text-dark">{booking.bookingId}</span>
          </p>

          <div className="text-left space-y-3 rounded-xl bg-beige p-5 text-sm">
            <div className="flex gap-2">
              <Calendar size={14} className="text-gold mt-0.5 shrink-0" />
              <span>{booking.appointment.date} &middot; {formatTime(booking.appointment.timeSlot)} — {formatTime(booking.appointment.endTime)}</span>
            </div>
            <div className="flex gap-2">
              <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-text-dark">{booking.doctor.clinic}</p>
                <p>{booking.clinicAddress.line1}, {booking.clinicAddress.area}, {booking.clinicAddress.city}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Clock size={14} className="text-gold shrink-0" />
              <span>{booking.appointment.type === "in-clinic" ? "In-Clinic" : "Online Video"} &middot; ₹{booking.appointment.fee} (payable at clinic)</span>
            </div>
          </div>

          <div className="mt-6 text-left rounded-xl border border-border p-4 text-xs text-text-medium space-y-1">
            <p className="font-medium text-text-dark text-sm mb-1">Prepare for Your Visit</p>
            <p>&bull; Bring any previous prescriptions or blood reports</p>
            <p>&bull; Arrive 10 minutes early for registration</p>
            <p>&bull; Wear comfortable clothing if Panchakarma may be recommended</p>
          </div>

          <p className="mt-5 text-xs text-text-light">
            Need to reschedule? Email <a href="mailto:care@3tattava.com" className="underline">care@3tattava.com</a>
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/doctors" className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-wider text-text-dark hover:border-gold transition-colors">
              Browse More Doctors
            </Link>
            <Link href="/products" className="rounded-full bg-primary-green px-5 py-2.5 text-xs uppercase tracking-wider text-white hover:bg-secondary-green transition-colors">
              Shop 3TATTAVA
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <Link href={`/doctors/${slug}#book`} className="inline-flex items-center gap-1 text-sm text-text-medium hover:text-text-dark mb-6">
          <ArrowLeft size={16} /> Back to profile
        </Link>

        {/* Summary bar */}
        <div className="rounded-xl bg-white border border-border p-4 mb-6 text-sm">
          <p className="font-medium text-text-dark">{doctor.personal.fullName}</p>
          <p className="text-text-medium mt-1">
            {date} &middot; {formatTime(slot)} &middot; {type === "in-clinic" ? "In-Clinic" : "Online"} &middot; ₹{fee}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <h2 className="font-display text-xl text-text-dark" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Your Details
          </h2>

          <input type="text" required placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <input type="tel" required placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <input type="number" required placeholder="Age *" value={age} onChange={(e) => setAge(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" min={1} max={120} />
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm text-text-dark">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <textarea placeholder="Describe your primary health concern in 2-3 lines..." value={healthConcern} onChange={(e) => setHealthConcern(e.target.value)} rows={3} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm resize-none" />

          <label className="flex items-center gap-2 text-sm text-text-dark cursor-pointer">
            <input type="checkbox" checked={isFirst} onChange={(e) => setIsFirst(e.target.checked)} className="rounded" />
            This is my first Ayurveda consultation
          </label>

          <label className="flex items-start gap-2 text-xs text-text-medium cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded mt-0.5" required />
            I agree to the Terms of Service and consent to sharing my details with the selected doctor.
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting || !agreed}
            className="w-full rounded-full bg-primary-green py-3 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-50 hover:bg-secondary-green transition-colors"
          >
            {submitting ? "Confirming..." : `Confirm Booking — ₹${fee}`}
          </button>
        </form>
      </div>
    </div>
  );
}
