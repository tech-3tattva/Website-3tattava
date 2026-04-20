"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, Video, ShieldCheck } from "lucide-react";

type Doctor = {
  _id: string;
  slug: string;
  personal: { fullName: string; photo: string; gender: string };
  qualifications: { degree: string; yearsOfPractice: number };
  clinic: { name: string; address: { area: string; city: string } };
  practice: {
    specializations: string[];
    languages: string[];
    consultationFee: { inClinic: number; online: number | null };
    offersOnline: boolean;
  };
  ratings: { average: number; count: number };
};

function formatSpec(s: string) {
  return s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const initials = doctor.personal.fullName
    .split(" ")
    .filter((_, i) => i <= 1)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-border/70 bg-white p-5 md:p-6 shadow-[0_8px_28px_rgba(24,24,24,0.04)] hover:shadow-[0_18px_46px_rgba(92,64,51,0.12)] hover:border-gold/50 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {doctor.personal.photo ? (
          <Image
            src={doctor.personal.photo}
            alt={doctor.personal.fullName}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover border-2 border-gold/30"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-secondary-green text-white text-lg font-semibold shrink-0">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-dark text-base leading-snug truncate">
            {doctor.personal.fullName}
          </h3>
          <p className="text-xs text-text-medium mt-0.5">
            {doctor.qualifications.degree}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={13} className="fill-gold text-gold" />
            <span className="text-xs font-medium text-text-dark">{doctor.ratings.average}</span>
            <span className="text-xs text-text-light">({doctor.ratings.count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 space-y-1.5 text-sm text-text-medium">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gold shrink-0" />
          <span className="truncate">{doctor.clinic.address.area}, {doctor.clinic.address.city}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {doctor.practice.specializations.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-block rounded-full bg-beige px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-text-dark"
            >
              {formatSpec(s)}
            </span>
          ))}
        </div>
      </div>

      {/* Fee + availability */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-medium text-text-dark">
            ₹{doctor.practice.consultationFee.inClinic}
          </span>
          {doctor.practice.offersOnline ? (
            <span className="flex items-center gap-1 text-xs text-primary-green">
              <Video size={12} /> Online
            </span>
          ) : null}
        </div>
        <span className="flex items-center gap-1 text-xs text-text-light">
          {doctor.qualifications.yearsOfPractice} yrs exp
        </span>
      </div>

      {/* Badges */}
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary-green font-medium">
          <ShieldCheck size={12} /> 3TATTAVA Verified
        </span>
      </div>

      {/* CTAs */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/doctors/${doctor.slug}`}
          className="rounded-full border border-border py-2 text-center text-xs uppercase tracking-wider text-text-dark hover:border-gold transition-colors"
        >
          View Profile
        </Link>
        <Link
          href={`/doctors/${doctor.slug}#book`}
          className="rounded-full bg-primary-green py-2 text-center text-xs uppercase tracking-wider text-white hover:bg-secondary-green transition-colors"
        >
          Book Now
        </Link>
      </div>
    </motion.article>
  );
}
