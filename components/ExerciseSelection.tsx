import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

interface Exercise {
  name: string;
  muscleGroup: string;
  sets: string | number;
  reps: string | number;
}

const predefinedExercises = [
  { name: 'Push-ups', muscleGroup: 'Chest' },
  { name: 'Squats', muscleGroup: 'Legs' },
  { name: 'Pull-ups', muscleGroup: 'Back' },
  // Add more predefined exercises
];

interface ExerciseSelectionProps {
  exercises: Exercise[];
  onExercisesChange: (exercises: Exercise[]) => void;
}

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({ exercises, onExercisesChange }) => {
  const [customExercise, setCustomExercise] = useState<Exercise>({ 
    name: '', 
    muscleGroup: '', 
    sets: '', 
    reps: '' 
  });

  const addExercise = (exercise: Exercise) => {
    onExercisesChange([
      ...exercises, 
      { 
        ...exercise, 
        sets: typeof exercise.sets === 'string' ? parseInt(exercise.sets) : exercise.sets,
        reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps) : exercise.reps
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Exercises</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          value={customExercise.name}
          onChangeText={(text) => setCustomExercise({ ...customExercise, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Muscle Group"
          value={customExercise.muscleGroup}
          onChangeText={(text) => setCustomExercise({ ...customExercise, muscleGroup: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Sets"
          value={String(customExercise.sets)}
          keyboardType="numeric"
          onChangeText={(text) => setCustomExercise({ ...customExercise, sets: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Reps"
          value={String(customExercise.reps)}
          keyboardType="numeric"
          onChangeText={(text) => setCustomExercise({ ...customExercise, reps: text })}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (customExercise.name && customExercise.muscleGroup && customExercise.sets && customExercise.reps) {
              addExercise(customExercise);
              setCustomExercise({ name: '', muscleGroup: '', sets: '', reps: '' });
            }
          }}
        >
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={predefinedExercises}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.predefinedItem}
            onPress={() => addExercise({ ...item, sets: 3, reps: 10 })}
          >
            <Text>{item.name} - {item.muscleGroup}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  predefinedItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ExerciseSelection;

