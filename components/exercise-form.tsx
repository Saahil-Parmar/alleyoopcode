"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Exercise } from "./providers/workout-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchExercises, type ExerciseResult } from "@/lib/api"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Loader2 } from "lucide-react"

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

// Mapping API muscle names to your muscle group options
const MUSCLE_GROUP_MAPPING: Record<string, string> = {
  'abdominals': 'Abs',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'lats': 'Back',
  'middle_back': 'Back',
  'lower_back': 'Back',
  'chest': 'Chest',
  'calves': 'Calves',
  'quadriceps': 'Legs',
  'hamstrings': 'Legs',
  'glutes': 'Legs',
  'traps': 'Shoulders',
  'shoulders': 'Shoulders',
  'forearms': 'Arms',
  'abductors': 'Legs',
  'adductors': 'Legs',
  'neck': 'Shoulders'
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
    sets: "3",
    reps: "10",
  })
  const [searchResults, setSearchResults] = useState<ExerciseResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearch = useDebounce(customExercise.name, 500)

  useEffect(() => {
    async function fetchExercises() {
      if (debouncedSearch.length >= 3) {
        setIsSearching(true)
        const results = await searchExercises(debouncedSearch)
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }

    fetchExercises()
  }, [debouncedSearch])

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

  const handleSelectExercise = (result: ExerciseResult) => {
    // Capitalize the first letter of each word in the muscle name
    const formattedMuscle = result.muscle
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    setCustomExercise({
      ...customExercise,
      name: result.name,
      muscleGroup: formattedMuscle,
    })
    setSearchResults([])
  }

  const handleAddCustom = () => {
    if (customExercise.name && customExercise.muscleGroup && customExercise.sets && customExercise.reps) {
      onAddExercise({
        name: customExercise.name,
        muscleGroup: customExercise.muscleGroup,
        sets: Number.parseInt(customExercise.sets),
        reps: Number.parseInt(customExercise.reps),
      })

      setCustomExercise({
        name: "",
        muscleGroup: "",
        sets: "3",
        reps: "10",
      })
      setSearchResults([])
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
                      onClick={() => setSelectedExercise(exercise)}
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
              <div className="relative">
                <Input
                  id="exerciseName"
                  value={customExercise.name}
                  onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                  placeholder="Search for an exercise..."
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-md divide-y max-h-[300px] overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors"
                      onClick={() => handleSelectExercise(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.muscle.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} • {result.difficulty}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {result.equipment}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscleGroup">Target Muscle</Label>
              <Input
                id="muscleGroup"
                value={customExercise.muscleGroup}
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="Will be set automatically from exercise selection"
              />
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
