"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin, Star, Video, ShieldCheck,
  Globe, ChevronLeft,
} from "lucide-react";
import { api } from "@/lib/api";

type DoctorFull = {
  _id: string;
  slug: string;
  personal: { fullName: string; photo: string; gender: string };
  qualifications: { degree: string; university: string; registrationNumber: string; yearsOfPractice: number; registrationBoard: string };
  clinic: { name: string; address: { line1: string; line2: string; area: string; city: string; state: string; pincode: string }; googleMapsLink: string };
  practice: { specializations: string[]; languages: string[]; consultationFee: { inClinic: number; online: number | null }; offersOnline: boolean; bio: string };
  workingHours: Record<string, { closed?: boolean; from?: string; to?: string; breakFrom?: string | null; breakTo?: string | null }>;
  ratings: { average: number; count: number; breakdown: Record<string, number> };
  slotConfig: { durationMinutes: number; maxAdvanceBookingDays: number };
};

type ReviewItem = {
  patient: { name: string };
  appointment: { date: string };
  review: { rating: number; text: string; createdAt: string };
};

const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

function formatSpec(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function DoctorProfile({ slug }: { slug: string }) {
  const [doctor, setDoctor] = useState<DoctorFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"in-clinic" | "online">("in-clinic");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [slotMsg, setSlotMsg] = useState("");

  useEffect(() => {
    api.get<DoctorFull>(`/doctors/${slug}`)
      .then((d) => { setDoctor(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!doctor) return;
    api.get<{ reviews: ReviewItem[] }>(`/bookings/doctor/${doctor._id}/reviews`)
      .then((d) => setReviews(d.reviews))
      .catch(() => {});
  }, [doctor]);

  const fetchSlots = useCallback(async () => {
    if (!doctor) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setSlotMsg("");
    try {
      const dateStr = getDateStr(selectedDate);
      const data = await api.get<{ available: string[]; closed: boolean; reason?: string }>(
        `/doctors/${slug}/slots?date=${dateStr}`,
      );
      setSlots(data.available);
      if (data.closed) setSlotMsg(data.reason || "Doctor is not available on this day");
      else if (data.available.length === 0) setSlotMsg("No available slots for this date");
    } catch {
      setSlots([]);
      setSlotMsg("Could not load slots");
    } finally {
      setSlotsLoading(false);
    }
  }, [doctor, selectedDate, slug]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="animate-pulse text-text-medium">Loading doctor profile...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f2] gap-4">
        <h1 className="text-2xl font-semibold text-text-dark">Doctor not found</h1>
        <Link href="/doctors" className="text-primary-green underline">Back to directory</Link>
      </div>
    );
  }

  const fee = consultationType === "online" && doctor.practice.consultationFee.online
    ? doctor.practice.consultationFee.online
    : doctor.practice.consultationFee.inClinic;

  const initials = doctor.personal.fullName.split(" ").filter((_, i) => i <= 1).map((w) => w[0]).join("").toUpperCase();

  // Calendar: show 7 days starting from today.
  const calDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link href="/doctors" className="inline-flex items-center gap-1 text-sm text-text-medium hover:text-text-dark transition-colors">
          <ChevronLeft size={16} /> Back to directory
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Profile Info (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-white p-6 md:p-8"
          >
            <div className="flex items-start gap-5">
              {doctor.personal.photo ? (
                <Image src={doctor.personal.photo} alt={doctor.personal.fullName} width={96} height={96} className="h-24 w-24 rounded-2xl object-cover border-2 border-gold/30" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-green to-secondary-green text-white text-2xl font-semibold shrink-0">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-text-dark" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {doctor.personal.fullName}
                </h1>
                <p className="text-sm text-text-medium mt-1">
                  {doctor.qualifications.degree} &mdash; {doctor.qualifications.university}
                </p>
                <p className="text-xs text-text-light mt-0.5">
                  Reg: {doctor.qualifications.registrationBoard} #{doctor.qualifications.registrationNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={14} className="fill-gold text-gold" />
                  <span className="text-sm font-medium">{doctor.ratings.average}</span>
                  <span className="text-xs text-text-light">({doctor.ratings.count} reviews)</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-primary-green font-medium">
                  <ShieldCheck size={14} /> 3TATTAVA Verified Doctor
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mt-5 flex flex-wrap gap-2">
              {doctor.practice.specializations.map((s) => (
                <span key={s} className="rounded-full bg-beige border border-border/60 px-3 py-1 text-xs uppercase tracking-wider text-text-dark">
                  {formatSpec(s)}
                </span>
              ))}
            </div>
          </motion.div>

          {/* About */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="font-display text-xl text-text-dark mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>About</h2>
            <p className="text-sm text-text-medium leading-relaxed whitespace-pre-line">{doctor.practice.bio}</p>
          </div>

          {/* Clinic Details */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="font-display text-xl text-text-dark mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>Clinic Details</h2>
            <div className="space-y-2 text-sm text-text-medium">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-text-dark">{doctor.clinic.name}</p>
                  <p>{doctor.clinic.address.line1}{doctor.clinic.address.line2 ? `, ${doctor.clinic.address.line2}` : ""}</p>
                  <p>{doctor.clinic.address.area}, {doctor.clinic.address.city} — {doctor.clinic.address.pincode}</p>
                </div>
              </div>
              {doctor.clinic.googleMapsLink ? (
                <a href={doctor.clinic.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary-green hover:underline ml-5">
                  <Globe size={12} /> Open in Google Maps
                </a>
              ) : null}
            </div>

            {/* Working hours */}
            <h3 className="font-medium text-text-dark mt-5 mb-2 text-sm">Working Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              {DAYS_ORDER.map((day) => {
                const wh = doctor.workingHours?.[day];
                return (
                  <div key={day} className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-text-dark font-medium">{DAY_LABELS[day]}</span>
                    <span className="text-text-medium">
                      {wh?.closed ? "Closed" : `${wh?.from || "-"} — ${wh?.to || "-"}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Fee */}
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-text-dark font-medium">In-Clinic: ₹{doctor.practice.consultationFee.inClinic}</span>
              {doctor.practice.offersOnline && doctor.practice.consultationFee.online ? (
                <span className="text-text-dark font-medium flex items-center gap-1">
                  <Video size={13} className="text-primary-green" /> Online: ₹{doctor.practice.consultationFee.online}
                </span>
              ) : null}
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 ? (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="font-display text-xl text-text-dark mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Patient Reviews ({doctor.ratings.count})
              </h2>
              {/* Rating breakdown */}
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <p className="text-4xl font-semibold text-text-dark">{doctor.ratings.average}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(doctor.ratings.average) ? "fill-gold text-gold" : "text-border"} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const cnt = doctor.ratings.breakdown?.[String(star)] || 0;
                    const pct = doctor.ratings.count > 0 ? (cnt / doctor.ratings.count) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-right">{star}</span>
                        <Star size={10} className="fill-gold text-gold" />
                        <div className="flex-1 h-2 rounded bg-beige overflow-hidden">
                          <div className="h-full bg-gold rounded" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-text-light w-6 text-right">{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-t border-border/40 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-dark">{r.patient.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.review.rating }).map((_, j) => (
                            <Star key={j} size={10} className="fill-gold text-gold" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-text-light">{r.appointment.date}</span>
                    </div>
                    {r.review.text ? (
                      <p className="text-sm text-text-medium mt-1 leading-relaxed">&ldquo;{r.review.text}&rdquo;</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Booking Panel (2 cols) */}
        <div className="lg:col-span-2" id="book">
          <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 md:p-6 shadow-[0_12px_32px_rgba(24,24,24,0.06)]">
            <h2 className="font-display text-xl text-text-dark mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Book a Consultation
            </h2>

            {/* Date selector: 7-day horizontal strip */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-text-light mb-2">Select Date</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {calDays.map((d) => {
                  const isSelected = getDateStr(d) === getDateStr(selectedDate);
                  const label = d.toLocaleDateString("en-IN", { weekday: "short" });
                  const dateNum = d.getDate();
                  const monthShort = d.toLocaleDateString("en-IN", { month: "short" });
                  return (
                    <button
                      key={getDateStr(d)}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center rounded-xl px-3 py-2 text-xs transition-colors min-w-[52px] ${
                        isSelected
                          ? "bg-primary-green text-white"
                          : "bg-beige text-text-dark hover:border-gold border border-transparent"
                      }`}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-lg font-semibold mt-0.5">{dateNum}</span>
                      <span className="text-[10px]">{monthShort}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consultation type toggle */}
            {doctor.practice.offersOnline ? (
              <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationType("in-clinic")}
                  className={`rounded-xl py-2 text-xs uppercase tracking-wider text-center border transition-colors ${
                    consultationType === "in-clinic" ? "bg-primary-green text-white border-primary-green" : "border-border text-text-dark"
                  }`}
                >
                  In-Clinic ₹{doctor.practice.consultationFee.inClinic}
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType("online")}
                  className={`rounded-xl py-2 text-xs uppercase tracking-wider text-center border transition-colors flex items-center justify-center gap-1 ${
                    consultationType === "online" ? "bg-primary-green text-white border-primary-green" : "border-border text-text-dark"
                  }`}
                >
                  <Video size={12} /> Online ₹{doctor.practice.consultationFee.online}
                </button>
              </div>
            ) : null}

            {/* Slots */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-text-light mb-2">Available Slots</p>
              {slotsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse h-9 w-[72px] rounded-lg bg-beige" />
                  ))}
                </div>
              ) : slotMsg ? (
                <p className="text-sm text-text-medium py-3">{slotMsg}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => {
                    const isSelected = selectedSlot === s;
                    const hour = Number(s.split(":")[0]);
                    const min = s.split(":")[1];
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const display = `${h12}:${min} ${ampm}`;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-lg px-3 py-2 text-xs font-medium border transition-colors ${
                          isSelected
                            ? "bg-primary-green text-white border-primary-green"
                            : "border-border bg-white text-text-dark hover:border-gold"
                        }`}
                      >
                        {display}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Book CTA */}
            {selectedSlot ? (
              <Link
                href={`/doctors/${doctor.slug}/book?date=${getDateStr(selectedDate)}&slot=${selectedSlot}&type=${consultationType}`}
                className="block w-full rounded-full bg-primary-green py-3 text-center text-sm font-medium uppercase tracking-wider text-white hover:bg-secondary-green transition-colors"
              >
                Continue to Booking &mdash; ₹{fee}
              </Link>
            ) : (
              <div className="rounded-full bg-beige py-3 text-center text-sm text-text-light uppercase tracking-wider">
                Select a date &amp; time slot
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
