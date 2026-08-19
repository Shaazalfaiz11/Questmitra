import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import { THEME_INIT_SCRIPT } from "@/lib/theme"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Quest Mitra — Your AI Companion",
  description:
    "Your AI companion for every quest — explore, learn, create assessments, and achieve your goals with intelligent AI assistance.",
  openGraph: {
    title: "Quest Mitra — Your AI Companion",
    description:
      "Your AI companion for every quest — explore, learn, create assessments, and achieve your goals.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the stored/system theme before paint to avoid a flash of the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">
        <Sidebar />
        <main className="md:ml-[280px] ml-0 min-h-screen pt-[72px] md:pt-0 pb-24 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  )
}