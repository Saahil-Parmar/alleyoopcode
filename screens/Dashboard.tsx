import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useWorkout } from '../contexts/WorkoutContext';
import MusclePhysiologyImage from '../components/MusclePhysiologyImage';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const Dashboard = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { getMuscleSummary } = useWorkout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitTrack Dashboard</Text>
      <MusclePhysiologyImage muscleSummary={getMuscleSummary()} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WorkoutEntry')}
      >
        <Text style={styles.buttonText}>Log Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Analytics')}
      >
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;

