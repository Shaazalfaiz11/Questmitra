"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAssignmentStore } from "@/store/assignmentStore"
import { useWebSocket } from "@/hooks/useWebSocket"
import Header from "@/components/Header"
import ExamPaper from "@/components/ExamPaper"

export default function AssignmentResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useWebSocket()

  const { status, progress, error, currentAssignment, setCurrentId, fetchAssignment, reset } =
    useAssignmentStore()

  useEffect(() => {
    if (!id) return
    setCurrentId(id)
    fetchAssignment(id)
  }, [id, setCurrentId, fetchAssignment])

  // Fallback polling in case WebSocket drops in production
  useEffect(() => {
    if (status !== "generating" || !id) return
    const interval = setInterval(() => {
      fetchAssignment(id)
    }, 5000)
    return () => clearInterval(interval)
  }, [id, status, fetchAssignment])

  if (status === "completed" && currentAssignment?.result) {
    return (
      <div className="min-h-screen pb-24 md:pb-8" style={{ background: "hsl(var(--qm-bg))" }}>
        <div className="hidden md:block">
          <Header title="Quest Result" showBack />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center px-5 py-4 sticky top-0 z-30"
          style={{ background: "hsl(var(--qm-bg))" }}
        >
          <button
            onClick={() => router.push("/assignments")}
            className="w-9 h-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
            style={{ background: "hsl(var(--qm-bg-subtle))", border: "1px solid hsl(var(--qm-border))" }}
            aria-label="Back to quests"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text))" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12L10 6M4 12L10 18" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold mr-9 tracking-tight"
            style={{ color: "hsl(var(--qm-text))" }}
          >
            Quest Result
          </h1>
        </div>

        <ExamPaper assignment={currentAssignment} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--qm-bg))" }}>
      <div className="hidden md:block">
        <Header title={status === "failed" ? "Failed" : "Generating..."} showBack />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center px-5 py-4 sticky top-0 z-30"
        style={{ background: "hsl(var(--qm-bg))" }}
      >
        <button
          onClick={() => router.push("/assignments")}
          className="w-9 h-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
          style={{ background: "hsl(var(--qm-bg-subtle))", border: "1px solid hsl(var(--qm-border))" }}
          aria-label="Back to quests"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text))" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12L10 6M4 12L10 18" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold mr-9 tracking-tight"
          style={{ color: "hsl(var(--qm-text))" }}
        >
          {status === "failed" ? "Failed" : "Generating..."}
        </h1>
      </div>

      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-sm w-full px-6 qm-slide-up">
          {status === "failed" ? (
            <FailedState error={error} onBack={() => router.push("/assignments")} />
          ) : (
            <GeneratingState progress={progress} />
          )}
        </div>
      </div>
    </div>
  )
}

function GeneratingState({ progress }: { progress: number }) {
  const steps = [
    { label: "Connecting to AI",       threshold: 10 },
    { label: "Analysing requirements", threshold: 30 },
    { label: "Structuring sections",   threshold: 40 },
    { label: "Generating questions",   threshold: 70 },
    { label: "Validating output",      threshold: 80 },
    { label: "Finalising paper",       threshold: 100 },
  ]
  const step = steps.filter((s) => progress >= s.threshold).pop()

  return (
    <div className="space-y-8">
      {/* Spinner */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full" style={{ border: "4px solid hsl(var(--qm-border))" }} />
        <div className="absolute inset-0 rounded-full animate-spin"
          style={{ border: "4px solid transparent", borderTopColor: "hsl(var(--qm-accent))" }}
        />
        <div className="absolute inset-3 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--qm-accent-subtle))" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.02L12 17L7.09 20.02L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
              fill="hsl(var(--qm-accent))" fillOpacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--qm-border))" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(245 58% 51%), hsl(270 60% 55%))",
            }}
          />
        </div>
        <div className="flex justify-between text-[12px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
          <span>{step?.label ?? "Starting..."}</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div>
        <h2 className="text-[18px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
          Generating your quest
        </h2>
        <p className="text-[13px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
          AI is crafting your questions. Usually takes 5–15 seconds.
        </p>
      </div>
    </div>
  )
}

function FailedState({ error, onBack }: { error: string | null; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
        style={{ background: "hsl(var(--qm-error-light))", border: "1px solid hsl(var(--qm-error) / 0.2)" }}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-error))" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <div>
        <h2 className="text-[18px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
          Generation Failed
        </h2>
        {error && (
          <p className="text-[12px] rounded-xl p-3 font-mono"
            style={{ color: "hsl(var(--qm-error))", background: "hsl(var(--qm-error-light))", border: "1px solid hsl(var(--qm-error) / 0.15)" }}
          >
            {error}
          </p>
        )}
      </div>
      <button onClick={onBack} className="qm-btn qm-btn-primary text-[13px]">
        ← Back to Quests
      </button>
    </div>
  )
}