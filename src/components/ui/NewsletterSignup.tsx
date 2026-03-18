"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  variant?: "footer" | "education";
}

export default function NewsletterSignup({
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  className = "",
  variant = "footer",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: would call API
  };

  if (variant === "footer") {
    return (
      <form
        className={`flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-6 ${className}`}
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded bg-gold text-text-dark font-medium hover:bg-gold-light transition-colors uppercase text-sm tracking-wider"
        >
          {buttonText}
        </button>
      </form>
    );
  }

  return (
    <form
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded text-text-dark bg-white border border-white/30"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded bg-gold text-text-dark font-medium"
      >
        {buttonText}
      </button>
    </form>
  );
}
