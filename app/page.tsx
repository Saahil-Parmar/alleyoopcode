"use client"

import { useState } from "react"
import { WorkoutProvider } from "@/components/providers/workout-provider"
import Dashboard from "@/components/dashboard"
import WorkoutEntry from "@/components/workout-entry"
import Analytics from "@/components/analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <WorkoutProvider>
      <main className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">FitTrack</h1>
          <p className="text-center text-muted-foreground">Track your fitness journey and optimize your workouts</p>
        </header>

        <nav className="grid w-full grid-cols-3 gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center p-4 text-center rounded-lg border hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link 
            href="/workout" 
            className="flex items-center justify-center p-4 text-center rounded-lg border hover:bg-muted"
          >
            Log Workout
          </Link>
          <Link 
            href="/analytics" 
            className="flex items-center justify-center p-4 text-center rounded-lg border hover:bg-muted"
          >
            Analytics
          </Link>
        </nav>
      </main>
    </WorkoutProvider>
  )
}

