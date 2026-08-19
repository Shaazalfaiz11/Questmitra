"use client"

import { useEffect, useState } from "react"
import { Theme, applyTheme, readStoredTheme, systemTheme } from "@/lib/theme"

interface ThemeToggleProps {
  /** "dark" renders for the navy sidebar, "light" for surfaces on the page background. */
  surface?: "dark" | "light"
  className?: string
}

export default function ThemeToggle({ surface = "light", className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null)

  // Read the theme the inline init script already applied, so the button label
  // matches the painted palette without causing a hydration mismatch.
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme")
    setTheme(attr === "dark" || attr === "light" ? attr : readStoredTheme() ?? systemTheme())
  }, [])

  // Follow the OS while the user has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (readStoredTheme()) return
      const next = mq.matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", next)
      setTheme(next)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
  }

  const onDark = surface === "dark"
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        onDark ? "text-white/60 hover:text-white hover:bg-white/10" : ""
      } ${className}`}
      style={
        onDark
          ? { background: "rgba(255, 255, 255, 0.06)" }
          : {
              background: "hsl(var(--qm-bg-subtle))",
              border: "1px solid hsl(var(--qm-border))",
              color: "hsl(var(--qm-text-secondary))",
            }
      }
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      type="button"
    >
      {/* Render a neutral icon until mounted so SSR and client markup agree. */}
      {theme === null ? (
        <span className="w-[18px] h-[18px]" />
      ) : isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
