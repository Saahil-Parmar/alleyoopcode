"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext } from "react"

// Define types
export interface Exercise {
  name: string
  muscleGroup: string
  sets: number
  reps: number
}

export interface Workout {
  id: string
  date: string
  exercises: Exercise[]
}

interface WorkoutContextType {
  workouts: Workout[]
  addWorkout: (workout: Omit<Workout, "id">) => void
  getMuscleSummary: () => Record<string, { sets: number; lastWorkoutDate: string }>
  getMostWorkedMuscle: () => { muscle: string; sets: number } | null
  getNotWorkedMuscles: () => string[]
}

// Create context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

// List of standard muscle groups
const STANDARD_MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs", "Calves"]

// Helper to normalize muscle group names
export const normalizeMuscleGroup = (muscleGroup: string): string => {
  const normalized = muscleGroup.toLowerCase().trim()

  if (normalized === "shoulders" || normalized === "shoulder") return "Shoulders"
  if (normalized === "abdominals" || normalized === "abs") return "Abs"
  if (normalized === "bicep" || normalized === "biceps") return "Biceps"
  if (normalized === "tricep" || normalized === "triceps") return "Triceps"
  if (normalized === "calf" || normalized === "calves") return "Calves"

  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Provider component
export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const storedWorkouts = localStorage.getItem("workouts")
    if (storedWorkouts) {
      try {
        setWorkouts(JSON.parse(storedWorkouts))
      } catch (error) {
        console.error("Failed to parse stored workouts:", error)
      }
    }
  }, [])

  // Add a new workout
  const addWorkout = (workout: Omit<Workout, "id">) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        muscleGroup: normalizeMuscleGroup(exercise.muscleGroup),
      })),
    }

    const updatedWorkouts = [...workouts, newWorkout]
    setWorkouts(updatedWorkouts)
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))
  }

  // Get summary of muscle usage
  const getMuscleSummary = () => {
    const summary: Record<string, { sets: number; lastWorkoutDate: string }> = {}

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup)

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

  // Get the most worked muscle in the current week
  const getMostWorkedMuscle = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const muscleSets: Record<string, number> = {}

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date)
      if (workoutDate >= startOfWeek) {
        workout.exercises.forEach((exercise) => {
          const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup)
          muscleSets[muscleGroup] = (muscleSets[muscleGroup] || 0) + exercise.sets
        })
      }
    })

    if (Object.keys(muscleSets).length === 0) {
      return null
    }

    return Object.entries(muscleSets).reduce((max, [muscle, sets]) => (sets > max.sets ? { muscle, sets } : max), {
      muscle: "",
      sets: 0,
    })
  }

  // Get muscles not worked in the current week
  const getNotWorkedMuscles = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const workedMuscles = new Set<string>()

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date)
      if (workoutDate >= startOfWeek) {
        workout.exercises.forEach((exercise) => {
          workedMuscles.add(normalizeMuscleGroup(exercise.muscleGroup))
        })
      }
    })

    return STANDARD_MUSCLE_GROUPS.filter((muscle) => !workedMuscles.has(muscle))
  }

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        getMuscleSummary,
        getMostWorkedMuscle,
        getNotWorkedMuscles,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

// Custom hook to use the workout context
export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider")
  }
  return context
}

