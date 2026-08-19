import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-jakarta)", "Inter", "Plus Jakarta Sans", "sans-serif"],
        display: ["var(--font-inter)", "var(--font-jakarta)", "Inter", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--qm-bg))",
        foreground: "hsl(var(--qm-text))",
        qm: {
          primary: "hsl(var(--qm-primary))",
          "primary-light": "hsl(var(--qm-primary-light))",
          accent: "hsl(var(--qm-accent))",
          "accent-light": "hsl(var(--qm-accent-light))",
          "accent-subtle": "hsl(var(--qm-accent-subtle))",
          violet: "hsl(var(--qm-violet))",
          blue: "hsl(var(--qm-blue))",
          "blue-light": "hsl(var(--qm-blue-light))",
          success: "hsl(var(--qm-success))",
          "success-light": "hsl(var(--qm-success-light))",
          warning: "hsl(var(--qm-warning))",
          "warning-light": "hsl(var(--qm-warning-light))",
          error: "hsl(var(--qm-error))",
          "error-light": "hsl(var(--qm-error-light))",
          surface: "hsl(var(--qm-surface))",
          "surface-hover": "hsl(var(--qm-surface-hover))",
          "surface-raised": "hsl(var(--qm-surface-raised))",
          border: "hsl(var(--qm-border))",
          "border-hover": "hsl(var(--qm-border-hover))",
          text: "hsl(var(--qm-text))",
          "text-secondary": "hsl(var(--qm-text-secondary))",
          "text-muted": "hsl(var(--qm-text-muted))",
        },
      },
      borderRadius: {
        qm: "var(--qm-radius)",
        "qm-sm": "var(--qm-radius-sm)",
        "qm-md": "var(--qm-radius-md)",
        "qm-lg": "var(--qm-radius-lg)",
        "qm-xl": "var(--qm-radius-xl)",
      },
      boxShadow: {
        "qm-sm": "var(--qm-shadow-sm)",
        qm: "var(--qm-shadow)",
        "qm-md": "var(--qm-shadow-md)",
        "qm-lg": "var(--qm-shadow-lg)",
        "qm-xl": "var(--qm-shadow-xl)",
      },
      animation: {
        "qm-fade-in": "qm-fade-in 0.3s ease-out",
        "qm-slide-up": "qm-slide-up 0.35s ease-out",
        "qm-slide-down": "qm-slide-down 0.35s ease-out",
        "qm-scale-in": "qm-scale-in 0.25s ease-out",
        "qm-shimmer": "qm-shimmer 1.5s infinite ease-in-out",
        "qm-pulse-ring": "qm-pulse-ring 1.5s infinite",
        "qm-spin": "qm-spin 0.8s linear infinite",
      },
      keyframes: {
        "qm-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "qm-slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "qm-slide-down": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "qm-scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "qm-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "qm-pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "qm-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
