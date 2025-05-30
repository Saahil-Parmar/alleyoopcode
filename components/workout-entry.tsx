"use client"

import { useState } from "react"
import { useWorkout } from "./providers/workout-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, subDays } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { ExerciseForm } from "./exercise-form"
import type { Exercise } from "./providers/workout-provider"

export default function WorkoutEntry() {
  const { addWorkout } = useWorkout()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [exercises, setExercises] = useState<Exercise[]>([])

  const handleAddExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise])
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleSaveWorkout = () => {
    if (exercises.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one exercise to your workout.",
        variant: "destructive",
      })
      return
    }

    addWorkout({
      date: format(date, "yyyy-MM-dd"),
      exercises,
    })

    toast({
      title: "Workout saved",
      description: `Your workout for ${format(date, "MMMM d, yyyy")} has been saved.`,
    })

    setExercises([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log a New Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Workout Date</label>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDate(subDays(new Date(), 1))}
              >
                Yesterday
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Selected date: {format(date, "MMMM d, yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>

      <ExerciseForm onAddExercise={handleAddExercise} />

      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercises ({exercises.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.muscleGroup} • {exercise.sets} sets × {exercise.reps} reps × {exercise.weight} kg
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" onClick={handleSaveWorkout}>
              Save Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

