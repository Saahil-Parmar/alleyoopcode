"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Exercise } from "./providers/workout-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Predefined exercises by muscle group
const PREDEFINED_EXERCISES = {
  Chest: ["Bench Press", "Push-ups", "Chest Fly", "Incline Press", "Decline Press"],
  Back: ["Pull-ups", "Lat Pulldown", "Bent-over Row", "Deadlift", "T-Bar Row"],
  Legs: ["Squats", "Leg Press", "Lunges", "Leg Extension", "Leg Curl"],
  Shoulders: ["Shoulder Press", "Lateral Raise", "Front Raise", "Reverse Fly", "Shrugs"],
  Biceps: ["Bicep Curl", "Hammer Curl", "Preacher Curl", "Concentration Curl"],
  Triceps: ["Tricep Extension", "Tricep Pushdown", "Skull Crusher", "Dips"],
  Abs: ["Crunches", "Leg Raises", "Plank", "Russian Twist", "Ab Rollout"],
  Calves: ["Calf Raise", "Seated Calf Raise", "Donkey Calf Raise"],
}

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void
}

export function ExerciseForm({ onAddExercise }: ExerciseFormProps) {
  const [activeTab, setActiveTab] = useState("predefined")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("")
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [predefinedSets, setPredefinedSets] = useState<string>("3") // Default value
  const [predefinedReps, setPredefinedReps] = useState<string>("10") // Default value
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "",
    sets: "",
    reps: "",
  })

  const handleAddPredefined = () => {
    if (selectedExercise && selectedMuscleGroup && predefinedSets && predefinedReps) {
      onAddExercise({
        name: selectedExercise,
        muscleGroup: selectedMuscleGroup,
        sets: Number.parseInt(predefinedSets),
        reps: Number.parseInt(predefinedReps),
      })
      
      // Reset selected exercise but keep muscle group
      setSelectedExercise("")
    }
  }

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
  }

  const handleAddCustom = () => {
    if (customExercise.name && customExercise.muscleGroup && customExercise.sets && customExercise.reps) {
      onAddExercise({
        name: customExercise.name,
        muscleGroup: customExercise.muscleGroup,
        sets: Number.parseInt(customExercise.sets),
        reps: Number.parseInt(customExercise.reps),
      })

      // Reset form
      setCustomExercise({
        name: "",
        muscleGroup: "",
        sets: "",
        reps: "",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined">Predefined</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="muscleGroup">Select Muscle Group</Label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger id="muscleGroup">
                  <SelectValue placeholder="Choose muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PREDEFINED_EXERCISES).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMuscleGroup && (
              <div className="space-y-2 mt-4">
                <Label>Select Exercise</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PREDEFINED_EXERCISES[selectedMuscleGroup as keyof typeof PREDEFINED_EXERCISES].map((exercise) => (
                    <Button
                      key={exercise}
                      variant={selectedExercise === exercise ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      {exercise}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedExercise && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="predefinedSets">Sets</Label>
                    <Input
                      id="predefinedSets"
                      type="number"
                      min="1"
                      value={predefinedSets}
                      onChange={(e) => setPredefinedSets(e.target.value)}
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="predefinedReps">Reps</Label>
                    <Input
                      id="predefinedReps"
                      type="number"
                      min="1"
                      value={predefinedReps}
                      onChange={(e) => setPredefinedReps(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleAddPredefined}
                  disabled={!predefinedSets || !predefinedReps}
                >
                  Add Exercise
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseName">Exercise Name</Label>
              <Input
                id="exerciseName"
                value={customExercise.name}
                onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                placeholder="e.g., Cable Crossover"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMuscleGroup">Muscle Group</Label>
              <Select
                value={customExercise.muscleGroup}
                onValueChange={(value) => setCustomExercise({ ...customExercise, muscleGroup: value })}
              >
                <SelectTrigger id="customMuscleGroup">
                  <SelectValue placeholder="Choose muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PREDEFINED_EXERCISES).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={customExercise.sets}
                  onChange={(e) => setCustomExercise({ ...customExercise, sets: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={customExercise.reps}
                  onChange={(e) => setCustomExercise({ ...customExercise, reps: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>

            <Button
              className="w-full mt-2"
              onClick={handleAddCustom}
              disabled={
                !customExercise.name || !customExercise.muscleGroup || !customExercise.sets || !customExercise.reps
              }
            >
              Add Exercise
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
