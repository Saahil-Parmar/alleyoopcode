"use client"

import { useState } from "react"
import { WorkoutProvider } from "@/components/providers/workout-provider"
import Dashboard from "@/components/dashboard"
import WorkoutEntry from "@/components/workout-entry"
import Analytics from "@/components/analytics"
import { cn } from "@/lib/utils"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "workout":
        return <WorkoutEntry />
      case "analytics":
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <WorkoutProvider>
      <main className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">FitTrack</h1>
          <p className="text-center text-muted-foreground">Track your fitness journey and optimize your workouts</p>
        </header>

        <nav className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "px-6 py-3 rounded-lg border transition-colors font-medium",
              activeTab === "dashboard"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            )}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("workout")}
            className={cn(
              "px-6 py-3 rounded-lg border transition-colors font-medium",
              activeTab === "workout"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            )}
          >
            Log Workout
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "px-6 py-3 rounded-lg border transition-colors font-medium",
              activeTab === "analytics"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            )}
          >
            Analytics
          </button>
        </nav>

        {renderContent()}
      </main>
    </WorkoutProvider>
  )
}

