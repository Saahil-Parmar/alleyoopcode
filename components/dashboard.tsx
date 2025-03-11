"use client"

import { useWorkout } from "./providers/workout-provider"
import { MuscleVisualization } from "./muscle-visualization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dumbbell, Trophy, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const { getMuscleSummary, getMostWorkedMuscle, getNotWorkedMuscles, workouts } = useWorkout()
  const muscleSummary = getMuscleSummary()
  const mostWorkedMuscle = getMostWorkedMuscle()
  const notWorkedMuscles = getNotWorkedMuscles()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Muscle Visualization</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <MuscleVisualization muscleSummary={muscleSummary} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {mostWorkedMuscle && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Most Worked Muscle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mostWorkedMuscle.muscle}</p>
              <p className="text-muted-foreground">{mostWorkedMuscle.sets} sets this week</p>
            </CardContent>
          </Card>
        )}

        {notWorkedMuscles.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Muscles to Focus On
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">You haven't worked these muscles this week:</p>
              <div className="flex flex-wrap gap-2">
                {notWorkedMuscles.map((muscle) => (
                  <div key={muscle} className="bg-secondary px-3 py-1 rounded-full text-sm">
                    {muscle}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {workouts?.length === 0 && (
        <Alert>
          <Dumbbell className="h-4 w-4" />
          <AlertTitle>Welcome to FitTrack!</AlertTitle>
          <AlertDescription>Start by logging your first workout using the "Log Workout" tab.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

