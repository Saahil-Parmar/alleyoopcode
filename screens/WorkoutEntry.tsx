import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import ExerciseSelection from '../components/ExerciseSelection';

interface Exercise {
  name: string;
  muscleGroup: string;
  sets: string | number;
  reps: string | number;
}

const WorkoutEntry = () => {
  const { addWorkout } = useWorkout();
  const [date, setDate] = useState(new Date());
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleSave = () => {
    const workout = {
      date: date.toISOString().split('T')[0],
      exercises: exercises.map(exercise => ({
        ...exercise,
        sets: typeof exercise.sets === 'string' ? parseInt(exercise.sets) : exercise.sets,
        reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps) : exercise.reps,
      })),
    };
    addWorkout(workout);
    // Navigate back to dashboard or show confirmation
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log Workout</Text>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setDate(selectedDate || date)}
      />
      <ExerciseSelection
        exercises={exercises}
        onExercisesChange={setExercises}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkoutEntry;

