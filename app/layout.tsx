import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { WorkoutProvider } from "@/components/providers/workout-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitTrack - Track Your Fitness Journey",
  description: "Track your fitness journey and optimize your workouts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WorkoutProvider>
          {children}
        </WorkoutProvider>
        <Toaster />
      </body>
    </html>
  )
}

import './globals.css'