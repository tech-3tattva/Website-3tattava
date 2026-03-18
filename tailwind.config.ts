import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-green": "var(--color-primary-green)",
        "secondary-green": "var(--color-secondary-green)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        beige: "var(--color-beige)",
        "beige-dark": "var(--color-beige-dark)",
        cream: "var(--color-cream)",
        "text-dark": "var(--color-text-dark)",
        "text-medium": "var(--color-text-medium)",
        "text-light": "var(--color-text-light)",
        border: "var(--color-border)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        heading: ["Libre Baskerville", "serif"],
        sans: ["DM Sans", "sans-serif"],
        devanagari: ["Noto Serif Devanagari", "serif"],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
        "26": "104px",
        "30": "120px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      screens: {
        tablet: "768px",
        desktop: "1024px",
      },
    },
  },
  plugins: [],
};
export default config;
