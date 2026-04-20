"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, FileText, Stethoscope, Package } from "lucide-react";
import { api } from "@/lib/api";

const SPECIALIZATIONS = [
  "hormonal-balance", "womens-health", "digestive-health", "sports-performance",
  "stress-anxiety", "skin-hair", "weight-management", "panchakarma",
  "general-wellness", "meditation-yoga", "respiratory-health", "joint-bone-health",
  "fertility-reproductive-health", "pediatric-ayurveda",
];

const CITIES = ["New Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Greater Noida"];
const DEGREES = ["BAMS", "MD Ayurveda", "BNYS", "Yoga & Naturopathy", "Other"];
const LANGUAGES_LIST = ["hindi", "english", "punjabi", "urdu"];

function formatSpec(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DoctorApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [doctorName, setDoctorName] = useState("");

  // Form fields.
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [degree, setDegree] = useState("BAMS");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationBoard, setRegistrationBoard] = useState("");
  const [yearsOfPractice, setYearsOfPractice] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [pincode, setPincode] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(["hindi"]);
  const [feeInClinic, setFeeInClinic] = useState("");
  const [feeOnline, setFeeOnline] = useState("");
  const [offersOnline, setOffersOnline] = useState(false);
  const [bio, setBio] = useState("");
  const [agreed, setAgreed] = useState(false);

  const toggleSpec = (s: string) => {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const toggleLang = (l: string) => {
    setLanguages((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    setError("");

    try {
      await api.post("/doctors/apply", {
        fullName, phone, email, gender, degree, university,
        graduationYear: Number(graduationYear), registrationNumber, registrationBoard,
        yearsOfPractice: Number(yearsOfPractice), clinicName, addressLine1, area, city, pincode,
        googleMapsLink, specializations, languages,
        feeInClinic: Number(feeInClinic), feeOnline: feeOnline ? Number(feeOnline) : null,
        offersOnline, bio,
      });
      setDoctorName(fullName);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center rounded-2xl border border-border bg-white p-8 shadow-lg"
        >
          <CheckCircle2 size={56} className="mx-auto text-primary-green mb-4" />
          <h1 className="font-display text-2xl text-text-dark mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Application Received!
          </h1>
          <p className="text-sm text-text-medium leading-relaxed">
            Thank you, {doctorName}! Our team will verify your credentials and visit your clinic within 5-7 working days.
            You&apos;ll receive an email once your profile is live.
          </p>
          <p className="mt-4 text-xs text-text-light">
            Questions? Email <a href="mailto:doctors@3tattava.com" className="underline">doctors@3tattava.com</a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#5c4033_0%,#3a2f26_100%)] text-white py-14 md:py-18 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#dcb375] mb-3">For Ayurveda Practitioners</p>
        <h1 className="font-display text-3xl md:text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Join the 3TATTAVA Doctor Network
        </h1>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          We&apos;re building Delhi NCR&apos;s most trusted directory of genuine Ayurveda practitioners. Get a verified listing, patient bookings, and co-branded clinic materials &mdash; at zero cost.
        </p>
      </section>

      {/* Benefits grid */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <ShieldCheck size={18} />, text: "Verified profile on 3tattava.com with patient booking system" },
            { icon: <FileText size={18} />, text: "Branded prescription pads (100 sheets, free refills)" },
            { icon: <Stethoscope size={18} />, text: "Listing in 'Find a Doctor' — marketed across 3TATTAVA's channels" },
            { icon: <Package size={18} />, text: "Free Shilajit samples for patient trials (5 honey sticks)" },
          ].map((b) => (
            <div key={b.text} className="flex items-start gap-3 rounded-xl bg-white border border-border p-4 text-sm text-text-dark">
              <span className="text-primary-green mt-0.5 shrink-0">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Personal */}
        <fieldset className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <legend className="font-display text-lg text-text-dark px-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Personal Information</legend>
          <input required placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="tel" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
            <input required type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
          </div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm text-text-dark w-full">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </fieldset>

        {/* Qualifications */}
        <fieldset className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <legend className="font-display text-lg text-text-dark px-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Qualifications</legend>
          <select required value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-text-dark">
            {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input required placeholder="University / Institution *" value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Graduation Year" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
            <input type="number" placeholder="Years of Practice *" required value={yearsOfPractice} onChange={(e) => setYearsOfPractice(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
          </div>
          <input required placeholder="Medical Council Registration Number *" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <input placeholder="Registration Board (e.g. Delhi Council of Indian Medicine)" value={registrationBoard} onChange={(e) => setRegistrationBoard(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
        </fieldset>

        {/* Clinic */}
        <fieldset className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <legend className="font-display text-lg text-text-dark px-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Clinic Details</legend>
          <input required placeholder="Clinic Name *" value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <input required placeholder="Address Line 1 *" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Area / Locality *" value={area} onChange={(e) => setArea(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
            <select required value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm text-text-dark">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Pincode *" value={pincode} onChange={(e) => setPincode(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" maxLength={6} />
            <input placeholder="Google Maps Link (optional)" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
          </div>
        </fieldset>

        {/* Practice */}
        <fieldset className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <legend className="font-display text-lg text-text-dark px-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Practice Details</legend>

          <p className="text-xs uppercase tracking-wider text-text-light">Specializations *</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpec(s)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  specializations.includes(s)
                    ? "bg-primary-green text-white border-primary-green"
                    : "border-border text-text-dark hover:border-gold"
                }`}
              >
                {formatSpec(s)}
              </button>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wider text-text-light mt-3">Languages</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES_LIST.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLang(l)}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
                  languages.includes(l)
                    ? "bg-primary-green text-white border-primary-green"
                    : "border-border text-text-dark hover:border-gold"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input required type="number" placeholder="Consultation Fee (In-Clinic) ₹ *" value={feeInClinic} onChange={(e) => setFeeInClinic(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
            <input type="number" placeholder="Fee (Online) ₹ (optional)" value={feeOnline} onChange={(e) => setFeeOnline(e.target.value)} className="rounded-xl border border-border px-4 py-2.5 text-sm" />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-dark cursor-pointer">
            <input type="checkbox" checked={offersOnline} onChange={(e) => setOffersOnline(e.target.checked)} className="rounded" />
            I offer online / video consultations
          </label>

          <textarea required placeholder="Bio — describe your practice, approach, and philosophy (200-500 words) *" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm resize-none" />
        </fieldset>

        {/* Agreement */}
        <fieldset className="rounded-2xl border border-border bg-white p-6 space-y-3">
          <legend className="font-display text-lg text-text-dark px-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Agreement</legend>
          <label className="flex items-start gap-2 text-xs text-text-medium cursor-pointer">
            <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded mt-0.5" />
            I confirm all information is accurate, I agree to display 3TATTAVA co-branding materials in my clinic, and I agree to the Doctor Network Terms of Service.
          </label>
        </fieldset>

        {error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting || !agreed}
          className="w-full rounded-full bg-primary-green py-3.5 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-50 hover:bg-secondary-green transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
