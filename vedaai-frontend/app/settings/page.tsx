import type { Metadata } from "next"
import ComingSoon from "@/components/ComingSoon"
import ThemeToggle from "@/components/ThemeToggle"

export const metadata: Metadata = {
  title: "Settings — Quest Mitra",
  description: "Appearance, profile, and workspace preferences for Quest Mitra.",
}

export default function SettingsPage() {
  return (
    <ComingSoon
      eyebrow="Partially available"
      title="Settings"
      description="Appearance is live now. Profile, notification, and workspace preferences arrive alongside accounts."
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9v0a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      }
      highlights={[
        "Profile details and avatar once accounts land",
        "Default subject, grade, and marking scheme for new quests",
        "Notification preferences for generation and submissions",
        "Export and data controls for your quests and library",
      ]}
    >
      <div className="qm-card p-6 sm:p-8 mb-8">
        <h2 className="text-[15px] font-bold mb-1" style={{ color: "hsl(var(--qm-text))" }}>
          Appearance
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "hsl(var(--qm-text-muted))" }}>
          Quest Mitra follows your system theme until you pick one here.
        </p>
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
          style={{ background: "hsl(var(--qm-bg-subtle))" }}
        >
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>
              Theme
            </p>
            <p className="text-[12px]" style={{ color: "hsl(var(--qm-text-muted))" }}>
              Switch between light and dark
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </ComingSoon>
  )
}
