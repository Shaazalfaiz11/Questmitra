"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAssignmentStore } from "@/store/assignmentStore"
import { useWebSocket } from "@/hooks/useWebSocket"

export default function DashboardPage() {
  useWebSocket()
  const { assignments, fetchAssignments, loadingList } = useAssignmentStore()
  const [greeting, setGreeting] = useState("Hello")

  useEffect(() => {
    fetchAssignments()
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good morning")
    else if (h < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [fetchAssignments])

  const completedCount = assignments.filter(a => a.status === "completed").length
  const activeCount = assignments.filter(a => a.status === "generating").length

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--qm-bg))" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-12">

        {/* ── Hero / Welcome ── */}
        <div className="mb-10 qm-slide-up">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight mb-2"
            style={{ color: "hsl(var(--qm-text))" }}
          >
            {greeting} 👋
          </h1>
          <p className="text-[15px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>
            What quest are you working on today?
          </p>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <QuickActionCard
            href="/assignments/create"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
              </svg>
            }
            title="Create New Quest"
            description="Generate AI-powered question papers instantly"
            gradient="linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))"
          />
          <QuickActionCard
            href="/library"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M12 11v6M9 14h6" />
              </svg>
            }
            title="Browse Library"
            description="Explore your eBook collection and uploaded PDFs"
            gradient="linear-gradient(135deg, hsl(215 85% 50%), hsl(200 80% 45%))"
          />
          <QuickActionCard
            href="/tutor"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                <path d="M12 19v4M8 23h8" />
              </svg>
            }
            title="AI Tutor"
            description="Practice English with voice-powered AI assistance"
            gradient="linear-gradient(135deg, hsl(152 60% 38%), hsl(170 60% 35%))"
          />
        </div>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard label="Total Quests" value={assignments.length} />
          <StatCard label="Completed" value={completedCount} accent />
          <StatCard label="In Progress" value={activeCount} />
        </div>

        {/* ── Recent Quests ── */}
        <div className="qm-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold" style={{ color: "hsl(var(--qm-text))" }}>
              Recent Quests
            </h2>
            <Link href="/assignments"
              className="text-[13px] font-semibold transition-colors"
              style={{ color: "hsl(var(--qm-accent))" }}
            >
              View All →
            </Link>
          </div>

          {loadingList ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl qm-skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 qm-skeleton" />
                    <div className="h-3 w-32 qm-skeleton" />
                  </div>
                </div>
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--qm-accent-subtle))" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--qm-accent))" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: "hsl(var(--qm-text))" }}>
                No quests yet
              </h3>
              <p className="text-[13px] mb-5" style={{ color: "hsl(var(--qm-text-muted))" }}>
                Start your first quest and let Quest Mitra guide you.
              </p>
              <Link href="/assignments/create" className="qm-btn qm-btn-primary text-[13px]">
                Start a Quest
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map(a => {
                const statusVar =
                  a.status === "completed" ? "--qm-success"
                    : a.status === "failed" ? "--qm-error"
                    : "--qm-warning"
                const statusText =
                  a.status === "completed" ? "Completed"
                    : a.status === "failed" ? "Failed"
                    : "Generating..."
                return (
                  <Link key={a._id} href={`/assignments/${a._id}`}
                    className="flex items-center gap-4 p-3 -mx-3 rounded-xl transition-colors"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--qm-bg-subtle))")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(var(--qm-accent-subtle))" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--qm-accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold truncate" style={{ color: "hsl(var(--qm-text))" }}>
                        {a.subject ? `${a.subject} — ${a.topic}` : a.topic || "Untitled Quest"}
                      </p>
                      <p className="text-[12px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
                        {a.totalMarks} marks • {new Date(a.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: `hsl(var(${statusVar}) / 0.12)`,
                        color: `hsl(var(${statusVar}))`,
                      }}
                    >
                      {statusText}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Quick Action Card ─── */
function QuickActionCard({ href, icon, title, description, gradient }: {
  href: string; icon: React.ReactNode; title: string; description: string; gradient: string
}) {
  return (
    <Link href={href}
      className="group relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ background: gradient }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3"
        style={{ background: "white" }}
      />
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-[16px] font-bold mb-1">{title}</h3>
      <p className="text-[13px] opacity-80 leading-relaxed">{description}</p>
    </Link>
  )
}

/* ─── Stat Card ─── */
function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="qm-card p-5 text-center">
      <p className="text-[28px] font-extrabold mb-0.5"
        style={{ color: accent ? "hsl(var(--qm-accent))" : "hsl(var(--qm-text))" }}
      >
        {value}
      </p>
      <p className="text-[12px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>
        {label}
      </p>
    </div>
  )
}