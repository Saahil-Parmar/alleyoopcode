import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type MuscleDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'MuscleDetail'>;
};

const MuscleDetail: React.FC<MuscleDetailScreenProps> = ({ route }) => {
  const { muscle } = route.params;
  const { workouts } = useWorkout();

  const muscleWorkouts = workouts.filter(workout =>
    workout.exercises.some(exercise => exercise.muscleGroup === muscle)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{muscle} Workouts</Text>
      {muscleWorkouts.map((workout, index) => (
        <View key={index} style={styles.workoutItem}>
          <Text style={styles.dateText}>{workout.date}</Text>
          {workout.exercises
            .filter(exercise => exercise.muscleGroup === muscle)
            .map((exercise, exerciseIndex) => (
              <Text key={exerciseIndex} style={styles.exerciseText}>
                {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
              </Text>
            ))}
        </View>
      ))}
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
  workoutItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MuscleDetail;

