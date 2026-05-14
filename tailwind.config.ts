import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#141414",
        surface: "#212020",
        surface2: "#2C2B2B",
        surface3: "#323131",
        fg: "#FFFFFF",
        "fg-muted": "#918F8F",
        "fg-subtle": "#6B6B66",
        border: "rgba(247, 245, 243, 0.12)",
        accent: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ABC Diatype",
          "Söhne",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        pill: "9999px",
      },
      letterSpacing: {
        tightish: "-0.005em",
        tighter2: "-0.015em",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.6, 0.2, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        "fade-in": "fadeIn 250ms cubic-bezier(0.2, 0.6, 0.2, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
