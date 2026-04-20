"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { api } from "@/lib/api";
import DoctorCard from "./DoctorCard";

type Doctor = {
  _id: string;
  slug: string;
  personal: { fullName: string; photo: string; gender: string };
  qualifications: { degree: string; yearsOfPractice: number };
  clinic: { name: string; address: { area: string; city: string } };
  practice: { specializations: string[]; languages: string[]; consultationFee: { inClinic: number; online: number | null }; offersOnline: boolean };
  ratings: { average: number; count: number };
};

const AREAS = [
  "All Areas", "South Delhi", "North Delhi", "East Delhi", "West Delhi",
  "Lajpat Nagar", "Dwarka", "Gurgaon", "Noida", "Faridabad", "Ghaziabad",
];

const SPECIALIZATIONS = [
  "All Specializations", "hormonal-balance", "digestive-health", "sports-performance",
  "womens-health", "stress-anxiety", "skin-hair", "weight-management",
  "panchakarma", "general-wellness", "meditation-yoga",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Rating (High→Low)" },
  { value: "most-booked", label: "Most Booked" },
  { value: "newest", label: "Newest" },
];

function formatSpec(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sort, setSort] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (area) params.set("area", area);
      if (specialization) params.set("specialization", specialization);
      if (sort) params.set("sort", sort);
      const qs = params.toString();
      const data = await api.get<{ doctors: Doctor[] }>(`/doctors${qs ? `?${qs}` : ""}`);
      setDoctors(data.doctors);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [search, area, specialization, sort]);

  useEffect(() => {
    const t = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(t);
  }, [fetchDoctors]);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#5c4033_0%,#3a2f26_100%)] text-white py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#dcb375] mb-3">
            3TATTAVA Doctor Network
          </p>
          <h1
            className="font-display text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Find a Verified Ayurveda Doctor Near You
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Every doctor in the 3TATTAVA network is credential-verified, clinic-inspected, and committed to Performance Ayurveda.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name, area, or specialization..."
              className="w-full rounded-full bg-white pl-12 pr-4 py-3.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter toggle + pills */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs uppercase tracking-wider text-text-dark hover:border-gold transition-colors"
          >
            <Filter size={14} /> Filters
          </button>

          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setSort(o.value)}
              className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                sort === o.value
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-white text-text-medium border-border hover:border-gold"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Expandable filter row */}
        {showFilters ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-dark"
            >
              {AREAS.map((a) => (
                <option key={a} value={a === "All Areas" ? "" : a}>{a}</option>
              ))}
            </select>

            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-dark"
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s === "All Specializations" ? "" : s}>
                  {s === "All Specializations" ? s : formatSpec(s)}
                </option>
              ))}
            </select>
          </motion.div>
        ) : null}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-white h-72" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-medium text-lg">No doctors found matching your filters.</p>
            <p className="text-text-light text-sm mt-2">Try broadening your search or removing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc, i) => (
              <DoctorCard key={doc._id} doctor={doc} index={i} />
            ))}
          </div>
        )}

        {/* Trust section */}
        <div className="mt-16 rounded-2xl border border-border bg-white p-8 md:p-10 text-center max-w-3xl mx-auto">
          <h2
            className="font-display text-2xl md:text-3xl text-text-dark mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Our 3-Step Verification Process
          </h2>
          <p className="text-text-medium text-sm leading-relaxed">
            Every doctor in our network is verified through: <strong>credential check</strong> with the State AYUSH Board,
            <strong> clinic inspection</strong> by our field team, and <strong>ongoing patient review monitoring</strong>.
            We don&apos;t list &mdash; we curate.
          </p>
        </div>

        {/* CTA for doctors */}
        <div className="mt-10 text-center">
          <p className="text-text-medium mb-3">Are you an Ayurveda practitioner in Delhi NCR?</p>
          <Link
            href="/doctors/join"
            className="inline-flex items-center gap-2 rounded-full bg-primary-green px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white hover:bg-secondary-green transition-colors"
          >
            Join the 3TATTAVA Doctor Network &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
