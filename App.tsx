import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutProvider } from './contexts/WorkoutContext';
import Dashboard from './screens/Dashboard';
import WorkoutEntry from './screens/WorkoutEntry';
import Analytics from './screens/Analytics';
import MuscleDetail from './screens/MuscleDetail';
import { RootStackParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="WorkoutEntry" component={WorkoutEntry} />
          <Stack.Screen name="Analytics" component={Analytics} />
          <Stack.Screen name="MuscleDetail" component={MuscleDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
}

