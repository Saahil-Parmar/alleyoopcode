"use client"

import { useState } from "react"
import { useWorkout } from "./providers/workout-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
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
                      {exercise.muscleGroup} • {exercise.sets} sets × {exercise.reps} reps
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

