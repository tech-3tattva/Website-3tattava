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
      },
    },
  },
  plugins: [],
};

export default config;
