import Link from "next/link"

interface ComingSoonProps {
  eyebrow: string
  title: string
  description: string
  icon: React.ReactNode
  /** Feature bullets shown as a preview of what the page will hold. */
  highlights: string[]
  children?: React.ReactNode
}

export default function ComingSoon({
  eyebrow,
  title,
  description,
  icon,
  highlights,
  children,
}: ComingSoonProps) {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--qm-bg))" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 md:py-16">
        <div className="qm-slide-up">
          <span className="qm-badge qm-badge-accent mb-4">{eyebrow}</span>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
              boxShadow: "0 10px 28px hsla(245, 58%, 51%, 0.22)",
            }}
          >
            {icon}
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight mb-2"
            style={{ color: "hsl(var(--qm-text))" }}
          >
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed mb-8 max-w-xl"
            style={{ color: "hsl(var(--qm-text-muted))" }}
          >
            {description}
          </p>
        </div>

        {children}

        <div className="qm-card p-6 sm:p-8 mb-8">
          <h2 className="text-[15px] font-bold mb-5" style={{ color: "hsl(var(--qm-text))" }}>
            What&apos;s coming
          </h2>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "hsl(var(--qm-accent-subtle))" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="hsl(var(--qm-accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-[14px]" style={{ color: "hsl(var(--qm-text-secondary))" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="qm-btn qm-btn-primary text-[13px]">
            Back to Dashboard
          </Link>
          <Link href="/assignments/create" className="qm-btn qm-btn-secondary text-[13px]">
            Create a Quest
          </Link>
        </div>
      </div>
    </div>
  )
}
