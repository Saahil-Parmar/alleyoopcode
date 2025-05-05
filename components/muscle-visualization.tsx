"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface MuscleVisualizationProps {
  muscleSummary: Record<string, { sets: number; lastWorkoutDate: string }>
}

export function MuscleVisualization({ muscleSummary }: MuscleVisualizationProps) {
  const [showingFront, setShowingFront] = useState(true)
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)

  // Get color based on last workout date
  const getMuscleColor = (lastWorkoutDate: string): string => {
    const today = new Date()
    const lastWorkout = new Date(lastWorkoutDate)
    const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "#4CAF50" // Green - worked today or yesterday
    if (diffDays === 2) return "#FFC107" // Yellow - worked 2 days ago
    if (diffDays === 3) return "#FF9800" // Orange - worked 3 days ago
    return "#F44336" // Red - not worked in more than 3 days
  }

  // Core muscle groups to display in the legend
  const muscleGroups = ["Chest", "Back", "Glutes", "Hamstrings", "Quadriceps", "Calves", "Shoulders", "Arms", "Abs"]

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-[300px] h-[450px] bg-[#f5f5f5] rounded-lg p-4">
        <Image
          src="/images/processed_human_muscle_anatomy.svg"
          alt="Muscle anatomy diagram"
          fill
          className="object-contain p-2"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Muscle overlays with interactivity */}
        {Object.entries(muscleSummary).map(([muscle, data]) => (
          <div
            key={muscle}
            className="absolute cursor-pointer transition-opacity hover:opacity-70"
            style={{
              backgroundColor: getMuscleColor(data.lastWorkoutDate),
              opacity: selectedMuscle === muscle ? 0.7 : 0.5,
              mixBlendMode: "multiply",
            }}
            onClick={() => setSelectedMuscle(muscle === selectedMuscle ? null : muscle)}
          />
        ))}
      </div>

      {/* Legend */}
      <Card className="p-4 w-full">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4CAF50] rounded" />
            <span className="text-sm">Today/Yesterday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FFC107] rounded" />
            <span className="text-sm">2 Days Ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FF9800] rounded" />
            <span className="text-sm">3 Days Ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#F44336] rounded" />
            <span className="text-sm">4+ Days</span>
          </div>
        </div>
      </Card>

      {/* Selected muscle info */}
      {selectedMuscle && muscleSummary[selectedMuscle] && (
        <Card className="p-4 w-full">
          <h3 className="font-bold mb-2">{selectedMuscle}</h3>
          <p className="text-sm text-muted-foreground">
            Last worked: {new Date(muscleSummary[selectedMuscle].lastWorkoutDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Sets this week: {muscleSummary[selectedMuscle].sets}
          </p>
        </Card>
      )}
    </div>
  )
}

