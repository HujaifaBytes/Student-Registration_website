import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { initDatabase } from "@/lib/db"

// Initialize the database with default admin, but don't block rendering
if (typeof window !== "undefined") {
  // Only run on client side
  Promise.resolve().then(() => {
    initDatabase().catch(console.error)
  })
} else {
  // On server side, just log that we'll initialize later
  console.log("Database will be initialized on client side")
}

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Math & Science Olympiad - Savar Science Society",
  description: "Register for the Math & Science Olympiad organized by Savar Science Society",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
