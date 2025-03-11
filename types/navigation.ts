import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Dashboard: undefined;
  WorkoutEntry: undefined;
  Analytics: undefined;
  MuscleDetail: {
    muscle: string;
  };
}; 