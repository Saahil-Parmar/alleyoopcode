"use client"

import { useWorkout } from "./providers/workout-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Trophy, AlertTriangle, Dumbbell } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

interface Exercise {
  name: string;
  muscleGroup: string;
  sets: string | number;
  reps: string | number;
}

interface ExerciseSuggestion {
  name: string;
  description: string;
}

const exerciseSuggestions: Record<string, ExerciseSuggestion[]> = {
  Chest: [
    { name: "Push-ups", description: "3 sets of 12-15 reps" },
    { name: "Bench Press", description: "4 sets of 8-12 reps" },
    { name: "Dumbbell Flyes", description: "3 sets of 12 reps" },
  ],
  Back: [
    { name: "Pull-ups", description: "3 sets to failure" },
    { name: "Bent-over Rows", description: "4 sets of 10-12 reps" },
    { name: "Lat Pulldowns", description: "3 sets of 12-15 reps" },
  ],
  Legs: [
    { name: "Squats", description: "4 sets of 10-12 reps" },
    { name: "Lunges", description: "3 sets of 12 reps per leg" },
    { name: "Deadlifts", description: "4 sets of 8-10 reps" },
  ],
  Shoulders: [
    { name: "Military Press", description: "4 sets of 8-12 reps" },
    { name: "Lateral Raises", description: "3 sets of 12-15 reps" },
    { name: "Front Raises", description: "3 sets of 12 reps" },
  ],
  Arms: [
    { name: "Bicep Curls", description: "3 sets of 12 reps" },
    { name: "Tricep Pushdowns", description: "3 sets of 12-15 reps" },
    { name: "Hammer Curls", description: "3 sets of 12 reps per arm" },
  ],
  Abs: [
    { name: "Crunches", description: "3 sets of 20 reps" },
    { name: "Planks", description: "3 sets of 45-60 seconds" },
    { name: "Russian Twists", description: "3 sets of 20 reps" },
  ],
  Calves: [
    { name: "Standing Calf Raises", description: "4 sets of 15-20 reps" },
    { name: "Seated Calf Raises", description: "3 sets of 15 reps" },
    { name: "Jump Rope", description: "3 sets of 1 minute" },
  ],
}

export default function Insights() {
  const { getMuscleSummary, getMostWorkedMuscle, getNotWorkedMuscles } = useWorkout()
  const muscleSummary = getMuscleSummary()
  const maxWorkedOutMuscle = getMostWorkedMuscle()
  const notWorkedOutMuscles = getNotWorkedMuscles()

  const [customExercise] = useState<Exercise>({
    name: '',
    muscleGroup: '',
    sets: '',
    reps: ''
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {maxWorkedOutMuscle && (
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertTitle>Most Worked Out Muscle This Week</AlertTitle>
              <AlertDescription>
                {maxWorkedOutMuscle.muscle} - {maxWorkedOutMuscle.sets} sets
              </AlertDescription>
            </Alert>
          )}
          {notWorkedOutMuscles.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Worked Out Muscles This Week</AlertTitle>
              <AlertDescription>{notWorkedOutMuscles.join(", ")}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {notWorkedOutMuscles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Suggested Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {notWorkedOutMuscles.map((muscle: string) => (
                <AccordionItem key={muscle} value={muscle}>
                  <AccordionTrigger className="text-lg font-medium">{muscle}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      {exerciseSuggestions[muscle]?.map((exercise: ExerciseSuggestion, index: number) => (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Workout Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Muscle Group</TableHead>
                <TableHead className="text-right">Total Sets</TableHead>
                <TableHead className="text-right">Last Workout Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(muscleSummary).map(([muscle, { sets, lastWorkoutDate }]) => (
                <TableRow key={muscle}>
                  <TableCell>{muscle}</TableCell>
                  <TableCell className="text-right">{sets}</TableCell>
                  <TableCell className="text-right">{new Date(lastWorkoutDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

