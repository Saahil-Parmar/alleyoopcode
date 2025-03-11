"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const predefinedExercises = [
  { name: "Push-ups", muscleGroup: "Chest" },
  { name: "Squats", muscleGroup: "Legs" },
  { name: "Pull-ups", muscleGroup: "Back" },
  { name: "Shoulder Press", muscleGroup: "Shoulders" },
  { name: "Bicep Curls", muscleGroup: "Arms" },
  { name: "Tricep Extensions", muscleGroup: "Arms" },
  { name: "Crunches", muscleGroup: "Abs" },
  { name: "Calf Raises", muscleGroup: "Calves" },
]

interface ExerciseSelectionProps {
  exercises: Array<{
    name: string
    muscleGroup: string
    sets: number
    reps: number
  }>
  onExercisesChange: (
    exercises: Array<{
      name: string
      muscleGroup: string
      sets: number
      reps: number
    }>,
  ) => void
}

export function ExerciseSelection({ exercises, onExercisesChange }: ExerciseSelectionProps) {
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "",
    sets: "",
    reps: "",
  })

  const addExercise = (exercise: typeof customExercise) => {
    onExercisesChange([
      ...exercises,
      {
        ...exercise,
        sets: Number.parseInt(exercise.sets) || 0,
        reps: Number.parseInt(exercise.reps) || 0,
      },
    ])
  }

  const addCustomExercise = () => {
    if (customExercise.name && customExercise.muscleGroup && customExercise.sets && customExercise.reps) {
      addExercise(customExercise)
      setCustomExercise({ name: "", muscleGroup: "", sets: "", reps: "" })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Predefined Exercises</CardTitle>
          <CardDescription>Select from common exercises</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {predefinedExercises.map((exercise) => (
            <div key={exercise.name} className="flex items-center justify-between">
              <span>
                {exercise.name} - {exercise.muscleGroup}
              </span>
              <Button onClick={() => addExercise({ ...exercise, sets: "3", reps: "10" })}>Add</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Exercise</CardTitle>
          <CardDescription>Add your own exercise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={customExercise.name}
              onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
              placeholder="Enter exercise name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="muscleGroup">Muscle Group</Label>
            <Select
              value={customExercise.muscleGroup}
              onValueChange={(value) => setCustomExercise({ ...customExercise, muscleGroup: value })}
            >
              <SelectTrigger id="muscleGroup">
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chest">Chest</SelectItem>
                <SelectItem value="Back">Back</SelectItem>
                <SelectItem value="Legs">Legs</SelectItem>
                <SelectItem value="Shoulders">Shoulders</SelectItem>
                <SelectItem value="Arms">Arms</SelectItem>
                <SelectItem value="Abs">Abs</SelectItem>
                <SelectItem value="Calves">Calves</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sets">Sets</Label>
            <Input
              id="sets"
              type="number"
              value={customExercise.sets}
              onChange={(e) => setCustomExercise({ ...customExercise, sets: e.target.value })}
              placeholder="Enter number of sets"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              type="number"
              value={customExercise.reps}
              onChange={(e) => setCustomExercise({ ...customExercise, reps: e.target.value })}
              placeholder="Enter number of reps"
            />
          </div>
          <Button onClick={addCustomExercise} className="w-full">
            Add Custom Exercise
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

