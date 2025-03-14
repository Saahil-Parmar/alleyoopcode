"use client"

import { useWorkout } from "./providers/workout-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, AlertTriangle, Dumbbell, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"

// Exercise suggestions by muscle group
const EXERCISE_SUGGESTIONS: Record<string, Array<{ name: string; description: string }>> = {
  Chest: [
    { name: "Bench Press", description: "4 sets of 8-12 reps" },
    { name: "Incline Dumbbell Press", description: "3 sets of 10-12 reps" },
    { name: "Cable Fly", description: "3 sets of 12-15 reps" },
  ],
  Back: [
    { name: "Pull-ups", description: "3 sets to failure" },
    { name: "Bent-over Rows", description: "4 sets of 10-12 reps" },
    { name: "Lat Pulldowns", description: "3 sets of 12-15 reps" },
  ],
  Legs: [
    { name: "Squats", description: "4 sets of 8-10 reps" },
    { name: "Romanian Deadlifts", description: "3 sets of 10-12 reps" },
    { name: "Leg Press", description: "3 sets of 12-15 reps" },
  ],
  Shoulders: [
    { name: "Overhead Press", description: "4 sets of 8-10 reps" },
    { name: "Lateral Raises", description: "3 sets of 12-15 reps" },
    { name: "Face Pulls", description: "3 sets of 15-20 reps" },
  ],
  Biceps: [
    { name: "Barbell Curls", description: "3 sets of 10-12 reps" },
    { name: "Hammer Curls", description: "3 sets of 12-15 reps" },
    { name: "Preacher Curls", description: "3 sets of 10-12 reps" },
  ],
  Triceps: [
    { name: "Tricep Pushdowns", description: "3 sets of 12-15 reps" },
    { name: "Skull Crushers", description: "3 sets of 10-12 reps" },
    { name: "Dips", description: "3 sets to failure" },
  ],
  Abs: [
    { name: "Hanging Leg Raises", description: "3 sets of 12-15 reps" },
    { name: "Cable Crunches", description: "3 sets of 15-20 reps" },
    { name: "Plank", description: "3 sets of 30-60 seconds" },
  ],
  Calves: [
    { name: "Standing Calf Raises", description: "4 sets of 15-20 reps" },
    { name: "Seated Calf Raises", description: "3 sets of 15-20 reps" },
    { name: "Calf Press on Leg Press", description: "3 sets of 15-20 reps" },
  ],
}

export default function Analytics() {
  const { workouts, getMuscleSummary, getMostWorkedMuscle, getNotWorkedMuscles } = useWorkout()
  const muscleSummary = getMuscleSummary()
  const mostWorkedMuscle = getMostWorkedMuscle()
  const notWorkedMuscles = getNotWorkedMuscles()

  // Get workouts from the last 7 days
  const recentWorkouts = workouts
    .filter(workout => {
      const workoutDate = new Date(workout.date)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return workoutDate >= sevenDaysAgo
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Function to get the last workout date for a muscle
  const getLastWorkoutInfo = (muscle: string) => {
    const lastWorkout = workouts
      .filter(workout => workout.exercises.some(ex => ex.muscleGroup === muscle))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (!lastWorkout) return null

    const daysAgo = differenceInDays(new Date(), new Date(lastWorkout.date))
    
    // Color coding based on days
    let colorClass = ""
    if (daysAgo <= 1) colorClass = "bg-green-500"
    else if (daysAgo === 2) colorClass = "bg-yellow-500"
    else if (daysAgo === 3) colorClass = "bg-orange-500"
    else colorClass = "bg-red-500"

    return {
      date: lastWorkout.date,
      daysAgo,
      colorClass
    }
  }

  return (
    <div className="space-y-6">
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

      {notWorkedMuscles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Suggested Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {notWorkedMuscles.map((muscle) => {
                const lastWorkout = getLastWorkoutInfo(muscle)
                return (
                  <AccordionItem key={muscle} value={muscle}>
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center justify-between w-full">
                        <span>{muscle}</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className={cn(
                            "text-sm px-2 py-1 rounded-full text-white",
                            lastWorkout ? lastWorkout.colorClass : "bg-white text-gray-500 border"
                          )}>
                            {lastWorkout 
                              ? `Last worked ${lastWorkout.daysAgo} ${lastWorkout.daysAgo === 1 ? 'day' : 'days'} ago`
                              : "Never worked out"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        {EXERCISE_SUGGESTIONS[muscle]?.map((exercise, index) => (
                          <div key={index} className="border-l-2 border-primary pl-4">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">{exercise.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
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
                  <TableCell className="text-right">{format(new Date(lastWorkoutDate), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {recentWorkouts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{format(new Date(workout.date), "MMMM d, yyyy")}</h3>
                    <span className="text-sm text-muted-foreground">{workout.exercises.length} exercises</span>
                  </div>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {exercise.sets} sets × {exercise.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">
              No workouts recorded in the last 7 days
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

