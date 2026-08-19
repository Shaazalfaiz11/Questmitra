import type { Metadata } from "next"
import ComingSoon from "@/components/ComingSoon"

export const metadata: Metadata = {
  title: "Groups — Quest Mitra",
  description: "Create classes, share quests with your students, and track progress together.",
}

export default function GroupsPage() {
  return (
    <ComingSoon
      eyebrow="In development"
      title="Groups"
      description="Bring your class into Quest Mitra — share quests with a cohort, collect submissions, and follow how everyone is doing in one place."
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      }
      highlights={[
        "Create groups for each class or batch and invite students by link",
        "Assign a quest to a whole group in one action",
        "See per-student completion and scores at a glance",
        "Group-level analytics on topics that need another pass",
      ]}
    />
  )
}
