"use client"

import { useRouter } from "next/navigation"

interface HeaderProps {
  title?: string
  showBack?: boolean
}

export default function Header({ title = "Quest", showBack = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="h-[64px] flex items-center px-8 sticky top-0 z-30 justify-between"
      style={{ background: "hsl(var(--qm-bg))" }}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "hsl(var(--qm-bg-subtle))",
              border: "1px solid hsl(var(--qm-border))",
            }}
            aria-label="Go back"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-secondary))" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        )}

        {!showBack && (
          <div className="flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="1.8">
              <rect x="4" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" />
            </svg>
            <span className="text-[14px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>
              {title}
            </span>
          </div>
        )}

        {showBack && (
          <span className="text-[15px] font-bold ml-1" style={{ color: "hsl(var(--qm-text))" }}>
            {title}
          </span>
        )}
      </div>

      <div className="hidden md:flex items-center gap-3">
        {/* Notification */}
        <button className="relative p-2 rounded-full transition-colors"
          style={{
            background: "hsl(var(--qm-surface))",
            border: "1px solid hsl(var(--qm-border))",
          }}
          aria-label="Notifications"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-secondary))" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: "hsl(var(--qm-error))" }}
          />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full cursor-pointer transition-colors"
          style={{
            background: "hsl(var(--qm-surface))",
            border: "1px solid hsl(var(--qm-border))",
          }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
            style={{ background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))" }}
          >
            U
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>
            User
          </span>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </header>
  )
}