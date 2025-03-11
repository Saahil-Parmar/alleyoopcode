import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type AnalyticsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Analytics'>;

const Analytics = () => {
  const { getMuscleSummary } = useWorkout();
  const navigation = useNavigation<AnalyticsScreenNavigationProp>();
  const muscleSummary = getMuscleSummary();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Analytics</Text>
      {Object.entries(muscleSummary).map(([muscle, count]) => (
        <TouchableOpacity
          key={muscle}
          style={styles.muscleItem}
          onPress={() => navigation.navigate('MuscleDetail', { muscle })}
        >
          <Text style={styles.muscleText}>{muscle}</Text>
          <Text style={styles.countText}>Workouts: {count}</Text>
        </TouchableOpacity>
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
  muscleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  muscleText: {
    fontSize: 18,
  },
  countText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default Analytics;

