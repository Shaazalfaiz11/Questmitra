"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAssignmentStore, Assignment } from "@/store/assignmentStore"
import { useWebSocket } from "@/hooks/useWebSocket"

export default function AssignmentsPage() {
  const router = useRouter()
  useWebSocket()
  const { assignments, loadingList, fetchAssignments, deleteAssignment } =
    useAssignmentStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchAssignments() }, [fetchAssignments])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = assignments.filter((a) => {
    const matchesSearch = `${a.subject} ${a.topic}`.toLowerCase().includes(search.toLowerCase())
    if (statusFilter === "All") return matchesSearch
    const s = a.status || "completed"
    return matchesSearch && s === statusFilter.toLowerCase()
  })

  const fmtDate = (d?: string) =>
    d
      ? new Date(d)
          .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "—"

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--qm-bg))" }}>

      {/* ── Mobile sub-header ── */}
      <div className="md:hidden flex items-center px-5 py-4" style={{ background: "hsl(var(--qm-bg))" }}>
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(var(--qm-bg-subtle))", border: "1px solid hsl(var(--qm-border))" }}
          aria-label="Go back"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text))" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12L10 6M4 12L10 18"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold mr-9 tracking-tight"
          style={{ color: "hsl(var(--qm-text))" }}>
          Quests
        </h1>
      </div>

      {/* ── Desktop header ── */}
      <div className="hidden md:block px-8 pt-8 pb-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--qm-success))" }} />
          <h1 className="text-[26px] font-extrabold tracking-tight" style={{ color: "hsl(var(--qm-text))" }}>
            Quests
          </h1>
        </div>
        <p className="text-[14px] font-medium ml-[18px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
          Manage and create AI-powered assessments for your classes.
        </p>
      </div>

      <div className="px-4 md:px-8 max-w-6xl mx-auto pb-36">

        {/* ── Filter + Search row ── */}
        {assignments.length > 0 && (
          <div className="flex items-center gap-2 mb-6 mt-4">
            {/* Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Completed">Completed</option>
                <option value="Generating">Generating</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="qm-btn qm-btn-secondary text-[13px] px-4 py-2.5 pointer-events-none">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                {statusFilter === "All" ? "Filter" : statusFilter}
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3" />
              </svg>
              <input
                className="qm-input pl-10 py-2.5 rounded-full text-[13px]"
                placeholder="Search quests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search quests"
              />
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loadingList ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="qm-card p-6">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 qm-skeleton" />
                  <div className="h-4 w-1/2 qm-skeleton" />
                  <div className="flex justify-between mt-4">
                    <div className="h-3 w-24 qm-skeleton" />
                    <div className="h-3 w-20 qm-skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[55vh] qm-slide-up">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "hsl(var(--qm-accent-subtle))" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--qm-accent))" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
              No quests yet
            </h2>
            <p className="text-[13px] text-center max-w-xs leading-relaxed mb-6"
              style={{ color: "hsl(var(--qm-text-muted))" }}
            >
              Create your first quest to start generating AI-powered assessments.
            </p>
            <Link href="/assignments/create" className="qm-btn qm-btn-primary">
              Start a Quest
            </Link>
          </div>
        ) : (
          /* ── Quest cards ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={menuRef}>
            {filtered.map((a) => (
              <QuestCard
                key={a._id}
                assignment={a}
                isOpen={openMenu === a._id}
                onToggleMenu={() => setOpenMenu(openMenu === a._id ? null : a._id)}
                onView={() => { setOpenMenu(null); router.push(`/assignments/${a._id}`) }}
                onDelete={() => { setOpenMenu(null); deleteAssignment(a._id) }}
                fmtDate={fmtDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile FAB ── */}
      <Link
        href="/assignments/create"
        className="md:hidden fixed z-[60] w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-all"
        style={{
          bottom: "105px",
          right: "16px",
          background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
          boxShadow: "0 4px 14px hsla(245, 58%, 51%, 0.35)",
        }}
        aria-label="Create new quest"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </Link>

      {/* ── Desktop FAB ── */}
      <div className="hidden md:flex fixed bottom-10 left-[280px] right-0 z-30 justify-center pointer-events-none">
        <Link
          href="/assignments/create"
          className="pointer-events-auto qm-btn text-[13px] px-6 py-3 text-white transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
            boxShadow: "0 4px 20px hsla(245, 58%, 51%, 0.35)",
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16"/>
          </svg>
          Create Quest
        </Link>
      </div>
    </div>
  )
}

function QuestCard({
  assignment: a, isOpen, onToggleMenu, onView, onDelete, fmtDate,
}: {
  assignment: Assignment
  isOpen: boolean
  onToggleMenu: () => void
  onView: () => void
  onDelete: () => void
  fmtDate: (d?: string) => string
}) {
  const statusStyles = {
    completed: { bg: "hsl(var(--qm-success-light))", color: "hsl(var(--qm-success))", label: "Completed" },
    generating: { bg: "hsl(var(--qm-warning-light))", color: "hsl(var(--qm-warning))", label: "Generating..." },
    failed: { bg: "hsl(var(--qm-error-light))", color: "hsl(var(--qm-error))", label: "Failed" },
  }
  const st = statusStyles[(a.status as keyof typeof statusStyles) || "completed"] || statusStyles.completed

  return (
    <div
      onClick={onView}
      className="qm-card qm-card-interactive px-6 py-5 relative cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[16px] font-bold tracking-tight pr-6 transition-colors group-hover:text-qm-accent"
          style={{ color: "hsl(var(--qm-text))" }}
        >
          {a.subject ? `${a.subject} — ${a.topic}` : a.topic || "Untitled Quest"}
        </h3>
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMenu() }}
            className="p-1 -mr-2 rounded-full transition-colors"
            style={{ color: "hsl(var(--qm-text-muted))" }}
            aria-label="Quest options"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 top-8 z-50 py-1.5 min-w-[150px] qm-card qm-scale-in"
              style={{ boxShadow: "var(--qm-shadow-lg)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={(e) => { e.stopPropagation(); onView() }}
                className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                style={{ color: "hsl(var(--qm-text))" }}
                onMouseEnter={e => e.currentTarget.style.background = "hsl(var(--qm-bg-subtle))"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                View Quest
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                style={{ color: "hsl(var(--qm-error))" }}
                onMouseEnter={e => e.currentTarget.style.background = "hsl(var(--qm-error-light))"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status badge */}
      {a.status && a.status !== "completed" && (
        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3"
          style={{ background: st.bg, color: st.color }}
        >
          {st.label}
        </span>
      )}

      {/* Bottom: dates */}
      <div className="flex items-center justify-between text-[12px]"
        style={{ color: "hsl(var(--qm-text-muted))" }}
      >
        <span>
          <span className="font-semibold" style={{ color: "hsl(var(--qm-text-secondary))" }}>Created</span>
          <span> : {fmtDate(a.createdAt)}</span>
        </span>
        {a.dueDate && (
          <span>
            <span className="font-semibold" style={{ color: "hsl(var(--qm-text-secondary))" }}>Due</span>
            <span> : {fmtDate(a.dueDate)}</span>
          </span>
        )}
      </div>
    </div>
  )
}