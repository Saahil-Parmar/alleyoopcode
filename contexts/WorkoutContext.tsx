import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Workout {
  date: string;
  exercises: {
    name: string;
    muscleGroup: string;
    sets: number;
    reps: number;
  }[];
}

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  getMuscleSummary: () => Record<string, number>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const addWorkout = async (workout: Workout) => {
    const updatedWorkouts = [...workouts, workout];
    setWorkouts(updatedWorkouts);
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const getMuscleSummary = () => {
    const summary: Record<string, number> = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (summary[exercise.muscleGroup]) {
          summary[exercise.muscleGroup] += 1;
        } else {
          summary[exercise.muscleGroup] = 1;
        }
      });
    });
    return summary;
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, getMuscleSummary }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
};

