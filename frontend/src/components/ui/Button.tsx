"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium uppercase tracking-wider transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50";
  const variants = {
    primary: "bg-gold text-text-dark hover:bg-gold-light",
    secondary: "bg-primary-green text-white hover:bg-secondary-green",
    outline:
      "border-2 border-gold text-text-dark bg-white/80 hover:bg-gold/15 hover:border-gold",
    ghost: "text-text-dark hover:bg-beige",
  };
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base min-h-[52px]",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
