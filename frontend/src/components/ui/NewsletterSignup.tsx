"use client";

import { useState } from "react";
import { api } from "@/lib/api";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const source = variant === "education" ? "education" : "footer";
      const result = await api.post<{ message: string }>("/newsletter", {
        email,
        source,
      });
      setStatus("success");
      setMessage(result.message || "Subscribed successfully.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    }
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
          disabled={status === "loading"}
          className="px-6 py-3 rounded bg-gold text-text-dark font-medium hover:bg-gold-light transition-colors uppercase text-sm tracking-wider"
        >
          {status === "loading" ? "Subscribing..." : buttonText}
        </button>
        {message ? (
          <p className={`sm:basis-full text-xs ${status === "error" ? "text-red-200" : "text-white/80"}`}>
            {message}
          </p>
        ) : null}
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
        disabled={status === "loading"}
        className="px-6 py-3 rounded bg-gold text-text-dark font-medium"
      >
        {status === "loading" ? "Subscribing..." : buttonText}
      </button>
      {message ? (
        <p className={`sm:basis-full text-xs ${status === "error" ? "text-red-600" : "text-text-medium"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
