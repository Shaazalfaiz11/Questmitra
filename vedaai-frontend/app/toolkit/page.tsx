import type { Metadata } from "next"
import ComingSoon from "@/components/ComingSoon"

export const metadata: Metadata = {
  title: "AI Toolkit — Quest Mitra",
  description: "AI helpers for lesson plans, rubrics, worksheets, and feedback.",
}

export default function ToolkitPage() {
  return (
    <ComingSoon
      eyebrow="In development"
      title="AI Toolkit"
      description="A set of focused AI helpers that sit beside quest generation — for the everyday work of planning lessons, grading, and giving feedback."
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      }
      highlights={[
        "Lesson plan drafts from a topic and grade level",
        "Rubric builder that matches your marking scheme",
        "Worksheet and revision-sheet generation from any chapter",
        "Feedback drafts on student answers you can edit before sending",
      ]}
    />
  )
}
