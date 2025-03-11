"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MuscleVisualizationProps {
  muscleSummary: Record<string, { sets: number; lastWorkoutDate: string }>
}

export function MuscleVisualization({ muscleSummary }: MuscleVisualizationProps) {
  const [showingFront, setShowingFront] = useState(true)

  // Calculate progress percentage for a muscle group (max 100%)
  const getProgress = (muscle: string) => {
    const sets = muscleSummary[muscle]?.sets || 0
    return Math.min((sets / 20) * 100, 100)
  }

  // Get color based on workout intensity
  const getMuscleColor = (sets: number): string => {
    if (sets === 0) return "#F44336" // Red - not worked
    if (sets <= 5) return "#FFC107" // Yellow - lightly worked
    if (sets <= 10) return "#8BC34A" // Light green - moderately worked
    return "#4CAF50" // Green - heavily worked
  }

  // Core muscle groups to display in the progress section
  const coreGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Abs"]

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-[300px] h-[450px] bg-[#f5f5f5] rounded-lg p-4">
        <Image
          src={showingFront ? "/placeholder.svg?height=450&width=300" : "/placeholder.svg?height=450&width=300"}
          alt={`Muscle physiology diagram - ${showingFront ? "front" : "back"} view`}
          fill
          className="object-contain p-2"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay color based on muscle activity */}
        {Object.entries(muscleSummary).map(([muscle, data]) => {
          if (data.sets > 0) {
            return (
              <div
                key={muscle}
                className="absolute inset-0 opacity-30 mix-blend-multiply"
                style={{ backgroundColor: getMuscleColor(data.sets) }}
              />
            )
          }
          return null
        })}
      </div>

      <Button variant="outline" onClick={() => setShowingFront(!showingFront)} className="w-40">
        Show {showingFront ? "Back" : "Front"}
      </Button>

      <div className="w-full max-w-md bg-muted p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Muscle Groups</h2>
        <div className="space-y-4">
          {coreGroups.map((muscle) => (
            <div key={muscle} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{muscle}</span>
                <span className="text-sm text-muted-foreground">{muscleSummary[muscle]?.sets || 0} sets</span>
              </div>
              <Progress value={getProgress(muscle)} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

