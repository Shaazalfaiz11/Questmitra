import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "hsl(var(--qm-bg))" }}
    >
      <div className="text-center max-w-md qm-slide-up">
        {/* Compass Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-8"
          style={{
            background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
            boxShadow: "0 12px 32px hsla(245, 58%, 51%, 0.25)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="white" fillOpacity="0.3" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-[56px] font-extrabold tracking-tight mb-2"
          style={{ color: "hsl(var(--qm-accent))" }}
        >
          404
        </h1>
        <h2 className="text-[22px] font-bold mb-3"
          style={{ color: "hsl(var(--qm-text))" }}
        >
          Quest Not Found
        </h2>
        <p className="text-[14px] leading-relaxed mb-8"
          style={{ color: "hsl(var(--qm-text-muted))" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="qm-btn qm-btn-primary text-[13px]">
            Go to Dashboard
          </Link>
          <Link href="/assignments" className="qm-btn qm-btn-secondary text-[13px]">
            View Quests
          </Link>
        </div>
      </div>
    </div>
  )
}
