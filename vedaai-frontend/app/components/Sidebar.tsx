"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"

const NAV = [
  { label: "Dashboard", href: "/", icon: DashboardIcon, exact: true },
  { label: "Quests", href: "/assignments", icon: QuestsIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  { label: "AI Tutor", href: "/tutor", icon: TutorIcon },
  { label: "Groups", href: "/groups", icon: GroupsIcon },
  { label: "AI Toolkit", href: "/toolkit", icon: ToolkitIcon },
]

const MOBILE_NAV = [
  { label: "Dashboard", href: "/", icon: DashboardIcon, exact: true },
  { label: "Quests", href: "/assignments", icon: QuestsIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  { label: "AI Tutor", href: "/tutor", icon: TutorIcon },
]

export default function Sidebar() {
  const path = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [path])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  const isActive = (href: string, exact?: boolean) =>
    exact ? path === href : path.startsWith(href)

  return (
    <>
      {/* ══════ DESKTOP SIDEBAR ══════ */}
      <aside
        className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-[280px] z-40 overflow-hidden"
        style={{ background: "hsl(var(--qm-sidebar-bg))" }}
      >
        {/* Logo Area */}
        <div className="px-6 pt-7 pb-5">
          <QuestMitraLogo />
        </div>

        {/* Create Button */}
        <div className="px-5 mb-6">
          <Link
            href="/assignments/create"
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-white text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
              boxShadow: "0 4px 14px hsla(245, 58%, 51%, 0.35)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
            </svg>
            New Quest
          </Link>
        </div>

        {/* Nav */}
        <div className="relative flex-1 overflow-hidden">
          <nav className="space-y-0.5 px-3 h-full overflow-y-auto pb-4">
            {NAV.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                    transition-all duration-200
                    ${active
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/50 hover:bg-white/[0.06] hover:text-white/75"
                    }`}
                >
                  <Icon active={active} />
                  <span>{label}</span>
                  {label === "Quests" && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center"
                      style={{
                        background: active ? "hsl(245 58% 51%)" : "rgba(255, 255, 255, 0.1)",
                        color: "white",
                      }}
                    >
                      •
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: "linear-gradient(to top, hsl(var(--qm-sidebar-bg)) 0%, transparent 100%)" }}
          />
        </div>

        {/* Settings + Profile */}
        <div className="px-3 pb-5 mt-auto space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="flex flex-1 items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                text-white/45 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-200"
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>
            <ThemeToggle surface="dark" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.06] mt-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))" }}
            >
              QM
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">Quest Mitra</p>
              <p className="text-[10px] text-white/40 truncate">AI Education Platform</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════ MOBILE HEADER ══════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40"
        style={{ background: "hsl(var(--qm-bg))" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "hsl(var(--qm-border))" }}
        >
          <QuestMitraLogoCompact />
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--qm-bg-subtle))" }}
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="hsl(var(--qm-text-secondary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M18 8C18 6.4 17.37 4.88 16.24 3.76C15.12 2.63 13.59 2 12 2C10.41 2 8.88 2.63 7.76 3.76C6.63 4.88 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
                <path d="M13.73 21C13.55 21.3 13.3 21.55 13 21.73C12.69 21.9 12.35 22 12 22C11.65 22 11.31 21.9 11 21.73C10.7 21.55 10.45 21.3 10.27 21" />
              </svg>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "hsl(var(--qm-error))" }}
              />
            </button>
            <ThemeToggle />
            {/* Hamburger */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5" aria-label="Open menu">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
                stroke="hsl(var(--qm-text))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ══════ MOBILE DRAWER ══════ */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="qm-backdrop" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-4/5 max-w-xs h-full qm-slide-in-left"
            style={{ background: "hsl(var(--qm-sidebar-bg))" }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <QuestMitraLogo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:bg-white/10 rounded-full transition-colors" aria-label="Close menu">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {NAV.map(({ label, href, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium
                      transition-all duration-200
                      ${active
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/50 hover:bg-white/[0.06]"
                      }`}
                  >
                    <Icon active={active} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-white/10 flex items-center gap-2">
              <Link href="/settings" className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] text-sm font-medium text-white/60 hover:text-white/80 transition-colors">
                <SettingsIcon />
                Settings
              </Link>
              <ThemeToggle surface="dark" />
            </div>
          </div>
        </div>
      )}

      {/* ══════ MOBILE BOTTOM NAV ══════ */}
      {!isMobileMenuOpen && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="rounded-2xl px-2 py-1.5 flex items-center justify-around"
            style={{
              background: "hsl(var(--qm-sidebar-bg))",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
            }}
          >
            {MOBILE_NAV.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5"
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-white/15" : ""}`}>
                    <Icon active={active} darkBg />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? "text-white" : "text-white/40"}`}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════
   QUEST MITRA LOGO
   ═══════════════════════════════════════ */

function QuestMitraLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.02L12 17L7.09 20.02L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
            fill="white" fillOpacity="0.95" />
        </svg>
      </div>
      <span className="text-[17px] font-bold text-white tracking-tight whitespace-nowrap"
        style={{ letterSpacing: "-0.3px" }}
      >
        Quest Mitra
      </span>
    </div>
  )
}

function QuestMitraLogoCompact() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.02L12 17L7.09 20.02L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
            fill="white" fillOpacity="0.95" />
        </svg>
      </div>
      <span className="text-[16px] font-bold tracking-tight whitespace-nowrap"
        style={{
          color: "hsl(var(--qm-text))",
          letterSpacing: "-0.3px",
        }}
      >
        Quest Mitra
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════
   NAV ICONS
   ═══════════════════════════════════════ */

function DashboardIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const c = darkBg
    ? (active ? "white" : "rgba(255,255,255,0.4)")
    : (active ? "white" : "rgba(255,255,255,0.45)")
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={active ? "2.2" : "1.8"}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  )
}

function QuestsIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const c = darkBg
    ? (active ? "white" : "rgba(255,255,255,0.4)")
    : (active ? "white" : "rgba(255,255,255,0.45)")
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={active ? "2.2" : "1.8"}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function GroupsIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const opacity = darkBg ? (active ? 1 : 0.4) : (active ? 1 : 0.45)
  const fillColor = darkBg ? `rgba(255,255,255,${opacity})` : `rgba(255,255,255,${opacity})`
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M6.66675 1.66663C7.12699 1.66663 7.50008 2.03972 7.50008 2.49996H12.5001C12.5001 2.03972 12.8732 1.66663 13.3334 1.66663C13.7937 1.66663 14.1667 2.03972 14.1667 2.49996C16.4679 2.49996 18.3334 4.36544 18.3334 6.66663V14.1666C18.3334 16.4678 16.4679 18.3333 14.1667 18.3333H5.83341C3.53223 18.3333 1.66675 16.4678 1.66675 14.1666V6.66663C1.66675 4.36544 3.53223 2.49996 5.83341 2.49996C5.83341 2.03972 6.20651 1.66663 6.66675 1.66663ZM5.00008 8.33329C5.00008 7.87306 5.37318 7.49996 5.83341 7.49996H14.1667C14.627 7.49996 15.0001 7.87306 15.0001 8.33329C15.0001 8.79353 14.627 9.16663 14.1667 9.16663H5.83341C5.37318 9.16663 5.00008 8.79353 5.00008 8.33329ZM12.5001 14.1666C12.5001 13.7064 12.8732 13.3333 13.3334 13.3333H14.1667C14.627 13.3333 15.0001 13.7064 15.0001 14.1666C15.0001 14.6269 14.627 15 14.1667 15H13.3334C12.8732 15 12.5001 14.6269 12.5001 14.1666Z"
        fill={fillColor}
      />
    </svg>
  )
}

function ToolkitIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const baseOpacity = active ? 1 : 0.35
  const fillColor = darkBg ? "white" : "white"
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
        fill={fillColor} fillOpacity={baseOpacity}
      />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
        fill={fillColor} fillOpacity={baseOpacity}
      />
    </svg>
  )
}

function LibraryIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const c = darkBg
    ? (active ? "white" : "rgba(255,255,255,0.4)")
    : (active ? "white" : "rgba(255,255,255,0.45)")
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? "2.2" : "1.8"}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6M9 14h6" />
    </svg>
  )
}

function TutorIcon({ active, darkBg }: { active: boolean; darkBg?: boolean }) {
  const c = darkBg
    ? (active ? "white" : "rgba(255,255,255,0.4)")
    : (active ? "white" : "rgba(255,255,255,0.45)")
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? "2.2" : "1.8"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v4M8 23h8" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}