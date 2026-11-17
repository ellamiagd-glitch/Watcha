import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050507",
        panel: "#0d0e14",
        panel2: "#151824",
        line: "rgba(255,255,255,0.08)",
        line2: "rgba(255,255,255,0.15)",
        txt: "#F4F5F7",
        muted: "#9aa0ad",
        // Blue — primary actions, active nav, brand mark.
        brand: {
          DEFAULT: "#2f6bff",
          dim: "#1e54e6",
          soft: "rgba(47,107,255,0.16)",
        },
        // Red — live / "on air" presence (watching now).
        live: "#ff3b4e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        livedot: "pulse2 1.6s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
