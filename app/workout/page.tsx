"use client"

import WorkoutEntry from "@/components/workout-entry"

export default function WorkoutPage() {
  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <h2 className="text-2xl font-bold mb-4">Log Workout</h2>
      <WorkoutEntry />
    </main>
  )
} 