"use client"

import { useWorkout } from "./providers/workout-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, AlertTriangle, Dumbbell, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format, differenceInDays, subWeeks, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Exercise suggestions by muscle group
const EXERCISE_SUGGESTIONS: Record<string, Array<{ name: string; description: string; videoId: string }>> = {
  Chest: [
    { name: "Bench Press", description: "4 sets of 8-12 reps", videoId: "rT7DgCr-3pg" },
    { name: "Incline Dumbbell Press", description: "3 sets of 10-12 reps", videoId: "8iPEnn-ltC8" },
    { name: "Cable Fly", description: "3 sets of 12-15 reps", videoId: "Iwe6AmxVf7o" },
  ],
  Back: [
    { name: "Pull-ups", description: "3 sets to failure", videoId: "eGo4IYlbE5g" },
    { name: "Bent-over Rows", description: "4 sets of 10-12 reps", videoId: "G8l_8chR5BE" },
    { name: "Lat Pulldowns", description: "3 sets of 12-15 reps", videoId: "CAwf7n6Luuc" },
  ],
  Glutes: [
    { name: "Hip Thrusts", description: "4 sets of 10-12 reps", videoId: "pUdIL5x0fWg" },
    { name: "Glute Bridge", description: "3 sets of 12-15 reps", videoId: "Xp33YgPZgns" },
    { name: "Romanian Deadlift", description: "4 sets of 8-10 reps", videoId: "JCXUYuzwNrM" },
  ],
  Hamstrings: [
    { name: "Leg Curls", description: "3 sets of 12-15 reps", videoId: "1Tq3QdYUuHs" },
    { name: "Nordic Curls", description: "3 sets of 8-10 reps", videoId: "3-4pKUhkzoQ" },
    { name: "Good Mornings", description: "3 sets of 10-12 reps", videoId: "dEJ0FTm-CEk" },
  ],
  Quadriceps: [
    { name: "Squats", description: "4 sets of 8-10 reps", videoId: "YaXPRqUwItQ" },
    { name: "Leg Press", description: "3 sets of 12-15 reps", videoId: "IZxyjW7MPJQ" },
    { name: "Bulgarian Split Squats", description: "3 sets of 10-12 reps per leg", videoId: "2C-uNgKwPLE" },
  ],
  Shoulders: [
    { name: "Overhead Press", description: "4 sets of 8-10 reps", videoId: "2yjwXTZQDDI" },
    { name: "Lateral Raises", description: "3 sets of 12-15 reps", videoId: "3VcKaXpzqRo" },
    { name: "Face Pulls", description: "3 sets of 15-20 reps", videoId: "rep-qVOkqgk" },
  ],
  Biceps: [
    { name: "Barbell Curls", description: "3 sets of 10-12 reps", videoId: "kwG2ipFRgfo" },
    { name: "Hammer Curls", description: "3 sets of 12-15 reps", videoId: "TwD-YGVP4Bk" },
    { name: "Preacher Curls", description: "3 sets of 10-12 reps", videoId: "fIWP-FRFNU0" },
  ],
  Triceps: [
    { name: "Tricep Pushdowns", description: "3 sets of 12-15 reps", videoId: "2-LAMcpzODU" },
    { name: "Skull Crushers", description: "3 sets of 10-12 reps", videoId: "d_KZxkY_0cM" },
    { name: "Dips", description: "3 sets to failure", videoId: "2z8JmcrW-As" },
  ],
  Abs: [
    { name: "Hanging Leg Raises", description: "3 sets of 12-15 reps", videoId: "JB2oyawG9KI" },
    { name: "Cable Crunches", description: "3 sets of 15-20 reps", videoId: "6GMKPQVERzw" },
    { name: "Plank", description: "3 sets of 30-60 seconds", videoId: "pSHjTRCQxIw" },
  ],
  Calves: [
    { name: "Standing Calf Raises", description: "4 sets of 15-20 reps", videoId: "3UWi44yN-wM" },
    { name: "Calf Press on Leg Press", description: "3 sets of 15-20 reps", videoId: "0tn5K9NlCfo" },
  ],
}

export default function Analytics() {
  const { workouts, getMuscleSummary, getMostWorkedMuscle, getNotWorkedMuscles } = useWorkout()
  const [showLastWeek, setShowLastWeek] = useState(false)
  const muscleSummary = getMuscleSummary()
  const mostWorkedMuscle = getMostWorkedMuscle()
  const notWorkedMuscles = getNotWorkedMuscles()

  // Get workouts from the selected period
  const getWorkoutsForPeriod = (isLastWeek: boolean) => {
    const today = new Date()
    const periodStart = isLastWeek 
      ? subWeeks(today, 1) // 7 days ago
      : new Date(today.setDate(today.getDate() - 7)) // Last 7 days

    return workouts
      .filter(workout => {
        const workoutDate = new Date(workout.date)
        return workoutDate >= periodStart && workoutDate <= new Date()
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get muscle summary for the selected period
  const getMuscleSummaryForPeriod = (isLastWeek: boolean) => {
    const periodWorkouts = getWorkoutsForPeriod(isLastWeek)
    const summary: Record<string, { sets: number; lastWorkoutDate: string }> = {}

    periodWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscleGroup = exercise.muscleGroup

        if (!summary[muscleGroup]) {
          summary[muscleGroup] = {
            sets: 0,
            lastWorkoutDate: workout.date,
          }
        }

        summary[muscleGroup].sets += exercise.sets

        // Update last workout date if this workout is more recent
        if (new Date(workout.date) > new Date(summary[muscleGroup].lastWorkoutDate)) {
          summary[muscleGroup].lastWorkoutDate = workout.date
        }
      })
    })

    return summary
  }

  const selectedPeriodWorkouts = getWorkoutsForPeriod(showLastWeek)
  const selectedPeriodMuscleSummary = getMuscleSummaryForPeriod(showLastWeek)

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
                            <div className="mt-2">
                              <a
                                href={`https://www.youtube.com/watch?v=${exercise.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={`https://img.youtube.com/vi/${exercise.videoId}/mqdefault.jpg`}
                                  alt={`${exercise.name} tutorial`}
                                  className="w-full max-w-[320px] rounded-lg shadow-md hover:opacity-90 transition-opacity"
                                />
                              </a>
                            </div>
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
          <div className="flex items-center justify-between">
            <CardTitle>Workout Analytics</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="period-toggle"
                checked={showLastWeek}
                onCheckedChange={setShowLastWeek}
              />
              <Label htmlFor="period-toggle">
                Last Seven Days
              </Label>
            </div>
          </div>
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
              {Object.entries(selectedPeriodMuscleSummary).map(([muscle, { sets, lastWorkoutDate }]) => (
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

      {selectedPeriodWorkouts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Workouts (Last Seven Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPeriodWorkouts.map((workout, index) => (
                <div key={`${workout.date}-${index}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{format(new Date(workout.date), "MMMM d, yyyy")}</h3>
                    <span className="text-sm text-muted-foreground">{workout.exercises.length} exercises</span>
                  </div>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={`${workout.date}-${exercise.name}-${index}`} className="text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {exercise.sets} sets × {exercise.reps} reps × {exercise.weight} kg
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
            <CardTitle>Workouts (Last Seven Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">
              No workouts recorded {showLastWeek ? "in the last seven days" : "last week"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

