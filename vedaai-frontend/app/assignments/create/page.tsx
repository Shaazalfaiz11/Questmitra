"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAssignmentStore, QuestionType, QuestionTypeRow } from "@/store/assignmentStore"
import { useWebSocket } from "@/hooks/useWebSocket"

const TYPE_OPTIONS: QuestionType[] = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
  "Fill in the Blanks",
]

export default function CreateAssignmentPage() {
  const router = useRouter()
  useWebSocket()

  const {
    form,
    formErrors,
    status,
    setFormField,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    submitAssignment,
    setCurrentId,
    validateForm,
    resetForm,
  } = useAssignmentStore()

  const [dragging, setDragging] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const totalQuestions = form.questionTypes.reduce((s, r) => s + r.count, 0)
  const totalMarks = form.questionTypes.reduce((s, r) => s + r.count * r.marks, 0)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) setFormField("file", file)
    },
    [setFormField]
  )

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
      return
    }
    const id = await submitAssignment()
    if (id) {
      setCurrentId(id)
      resetForm()
      router.push("/assignments")
    }
  }

  const isGenerating = status === "generating"

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--qm-bg))" }}>

      {/* ── Validation Toast ── */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
          showNotification ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="qm-toast qm-toast-error">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Please fill in all required fields</span>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center px-5 py-4 sticky top-0 z-30"
        style={{ background: "hsl(var(--qm-bg))" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
          style={{ background: "hsl(var(--qm-bg-subtle))", border: "1px solid hsl(var(--qm-border))" }}
          aria-label="Go back"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text))" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12L10 6M4 12L10 18" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold mr-9 tracking-tight"
          style={{ color: "hsl(var(--qm-text))" }}
        >
          Create Quest
        </h1>
      </div>

      {/* ── Desktop Header ── */}
      <div className="hidden md:block px-8 pt-8 pb-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "hsl(var(--qm-text-muted))" }}
            aria-label="Go back"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--qm-success))" }} />
          <h1 className="text-[26px] font-extrabold tracking-tight" style={{ color: "hsl(var(--qm-text))" }}>
            Create Quest
          </h1>
        </div>
        <p className="text-[14px] font-medium ml-[50px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
          Set up a new AI-powered assessment for your students
        </p>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-20">

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto">
          <div className="h-1 rounded-full mb-8 overflow-hidden" style={{ background: "hsl(var(--qm-border))" }}>
            <div className="h-full w-1/2 rounded-full transition-all duration-500"
              style={{ background: "linear-gradient(90deg, hsl(245 58% 51%), hsl(270 60% 55%))" }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto qm-card p-5 md:p-8 space-y-6">

          {/* Section Title */}
          <div>
            <h2 className="text-[18px] font-bold tracking-tight" style={{ color: "hsl(var(--qm-text))" }}>
              Quest Details
            </h2>
            <p className="text-[13px] font-medium mt-1" style={{ color: "hsl(var(--qm-text-muted))" }}>
              Basic information about your assessment
            </p>
          </div>

          {/* File Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragging ? "border-qm-accent bg-qm-accent-subtle" : ""
            }`}
            style={{
              borderColor: dragging ? "hsl(var(--qm-accent))" : "hsl(var(--qm-border))",
              background: dragging ? "hsl(var(--qm-accent-subtle))" : "hsl(var(--qm-bg-subtle))",
            }}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setFormField("file", f)
              }}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--qm-surface))", boxShadow: "var(--qm-shadow-sm)" }}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-secondary))" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {form.file ? (
                <p className="text-[14px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>{form.file.name}</p>
              ) : (
                <>
                  <p className="text-[14px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: "hsl(var(--qm-text-muted))" }}
                  >
                    JPEG, PNG, PDF up to 10MB
                  </p>
                </>
              )}
              <button type="button" className="qm-btn qm-btn-secondary text-[12px] px-5 py-2 mt-1">
                Browse Files
              </button>
            </div>
          </div>
          <p className="text-[12px] text-center font-medium -mt-3" style={{ color: "hsl(var(--qm-text-muted))" }}>
            Upload images of your preferred document
          </p>

          {/* Due Date */}
          <div>
            <label className="block text-[14px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                className={`qm-input rounded-full pr-14 cursor-pointer ${formErrors.dueDate ? "qm-input-error" : ""}`}
                value={form.dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormField("dueDate", e.target.value)}
                onClick={(e) => { try { e.currentTarget.showPicker() } catch {} }}
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {formErrors.dueDate && (
              <p className="text-[12px] mt-1 pl-1 font-semibold" style={{ color: "hsl(var(--qm-error))" }}>
                {formErrors.dueDate}
              </p>
            )}
          </div>

          {/* Subject + Topic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                className={`qm-input rounded-xl ${formErrors.subject ? "qm-input-error" : ""}`}
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setFormField("subject", e.target.value)}
              />
              {formErrors.subject && (
                <p className="text-[12px] mt-1 pl-1 font-semibold" style={{ color: "hsl(var(--qm-error))" }}>
                  {formErrors.subject}
                </p>
              )}
            </div>
            <div>
              <input
                className={`qm-input rounded-xl ${formErrors.topic ? "qm-input-error" : ""}`}
                placeholder="Topic / Chapter"
                value={form.topic}
                onChange={(e) => setFormField("topic", e.target.value)}
              />
              {formErrors.topic && (
                <p className="text-[12px] mt-1 pl-1 font-semibold" style={{ color: "hsl(var(--qm-error))" }}>
                  {formErrors.topic}
                </p>
              )}
            </div>
          </div>

          {/* ── Question Types ── */}
          <div>
            <label className="md:hidden block text-[14px] font-bold mb-4" style={{ color: "hsl(var(--qm-text))", fontStyle: "italic" }}>
              Question Type
            </label>

            {/* Desktop headers */}
            <div className="hidden md:flex items-center mb-2 pr-0">
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-bold" style={{ color: "hsl(var(--qm-text))" }}>Question Type</span>
              </div>
              <div className="w-[44px] flex-shrink-0" />
              <div className="w-[112px] flex-shrink-0 text-center">
                <span className="text-[12px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>No. of Questions</span>
              </div>
              <div className="w-[112px] flex-shrink-0 text-center">
                <span className="text-[12px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>Marks</span>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-3 md:space-y-[10px]">
              {form.questionTypes.map((row) => (
                <QuestionTypeRowComp
                  key={row.id}
                  row={row}
                  onTypeChange={(v) => updateQuestionType(row.id, "type", v)}
                  onCountChange={(v) => updateQuestionType(row.id, "count", v)}
                  onMarksChange={(v) => updateQuestionType(row.id, "marks", v)}
                  onRemove={() => removeQuestionType(row.id)}
                  canRemove={form.questionTypes.length > 1}
                />
              ))}
            </div>

            {formErrors.questionTypes && (
              <p className="text-[12px] mt-2 font-semibold" style={{ color: "hsl(var(--qm-error))" }}>
                {formErrors.questionTypes}
              </p>
            )}

            {/* Add row */}
            <button
              type="button"
              onClick={addQuestionType}
              className="flex items-center gap-3 mt-5 text-[13px] font-bold transition-opacity hover:opacity-75"
              style={{ color: "hsl(var(--qm-text))" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(var(--qm-accent))" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path d="M12 4v16m-8-8h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              Add Question Type
            </button>

            {/* Totals */}
            <div className="mt-6 space-y-1">
              <p className="text-[13px] font-medium text-right" style={{ color: "hsl(var(--qm-text))" }}>
                Total Questions : <span className="font-bold">{totalQuestions}</span>
              </p>
              <p className="text-[13px] font-medium text-right" style={{ color: "hsl(var(--qm-text))" }}>
                Total Marks : <span className="font-bold">{totalMarks}</span>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pb-2">
            <label className="block text-[13px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>
              Additional Information{" "}
              <span className="font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>(For better output)</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                className="qm-input rounded-xl resize-none pr-12"
                style={{ borderStyle: "dashed" }}
                placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                value={form.additionalInfo}
                onChange={(e) => setFormField("additionalInfo", e.target.value)}
              />
              <button className="absolute right-3 bottom-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "hsl(var(--qm-bg-subtle))" }}
                aria-label="Voice input"
              >
                <svg width="12" height="12" fill="hsl(var(--qm-text-secondary))" viewBox="0 0 24 24">
                  <path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92v3.08h2v-3.08A7 7 0 0019 11h-2z" />
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* ── Navigation Buttons ── */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3 pt-5 pb-12 max-w-[320px] md:max-w-none mx-auto md:mx-0 md:px-0">
            <button
              onClick={() => router.back()}
              className="qm-btn qm-btn-secondary text-[13px] px-6"
            >
              ← Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="qm-btn text-[13px] px-6 text-white"
              style={{
                background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
                boxShadow: "0 4px 14px hsla(245, 58%, 51%, 0.3)",
              }}
            >
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-qm-spin" />
              ) : (
                "Next →"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ─── QuestionTypeRowComp ─── */
function QuestionTypeRowComp({
  row, onTypeChange, onCountChange, onMarksChange, onRemove, canRemove,
}: {
  row: QuestionTypeRow
  onTypeChange: (v: QuestionType) => void
  onCountChange: (v: number) => void
  onMarksChange: (v: number) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden qm-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="relative flex-1 mr-3">
            <select
              className="w-full text-[13px] font-semibold bg-transparent outline-none appearance-none pr-8 cursor-pointer"
              style={{ color: "hsl(var(--qm-text))" }}
              value={row.type}
              onChange={(e) => onTypeChange(e.target.value as QuestionType)}
            >
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {canRemove && (
            <button onClick={onRemove} className="p-1 flex-shrink-0" style={{ color: "hsl(var(--qm-text-muted))" }} aria-label="Remove">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="rounded-xl p-4" style={{ background: "hsl(var(--qm-bg-subtle))" }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-medium mb-2" style={{ color: "hsl(var(--qm-text-muted))" }}>No. of Questions</p>
              <Stepper value={row.count} min={1} max={50} onChange={onCountChange} />
            </div>
            <div>
              <p className="text-[11px] font-medium mb-2" style={{ color: "hsl(var(--qm-text-muted))" }}>Marks</p>
              <Stepper value={row.marks} min={1} max={20} onChange={onMarksChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center">
        <div className="flex-1 min-w-0 relative">
          <div className="flex items-center rounded-full pl-4 pr-10 py-[9px] mr-3"
            style={{
              background: "hsl(var(--qm-surface))",
              border: "1px solid hsl(var(--qm-border))",
            }}
          >
            <select
              className="w-full text-[13px] font-medium bg-transparent outline-none appearance-none cursor-pointer truncate"
              style={{ color: "hsl(var(--qm-text))" }}
              value={row.type}
              onChange={(e) => onTypeChange(e.target.value as QuestionType)}
            >
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <svg className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
            width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--qm-text-muted))" strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="w-7 flex-shrink-0 flex items-center justify-center mr-[17px]">
          {canRemove ? (
            <button onClick={onRemove} className="transition-colors" style={{ color: "hsl(var(--qm-text-muted))" }} aria-label="Remove">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <span className="w-4 h-4 block" />
          )}
        </div>

        <div className="w-[112px] flex-shrink-0">
          <Stepper value={row.count} min={1} max={50} onChange={onCountChange} />
        </div>
        <div className="w-[112px] flex-shrink-0">
          <Stepper value={row.marks} min={1} max={20} onChange={onMarksChange} />
        </div>
      </div>
    </>
  )
}

/* ─── Stepper ─── */
function Stepper({ value, min, max, onChange }: {
  value: number; min: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-full px-1 py-[3px]"
      style={{
        background: "hsl(var(--qm-surface))",
        border: "1px solid hsl(var(--qm-border))",
      }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-medium transition-colors flex-shrink-0 leading-none"
        style={{ color: "hsl(var(--qm-text))" }}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="text-[13px] font-bold min-w-[22px] text-center select-none"
        style={{ color: "hsl(var(--qm-text))" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-medium transition-colors flex-shrink-0 leading-none"
        style={{ color: "hsl(var(--qm-text))" }}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  )
}