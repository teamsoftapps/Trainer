import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrainerBttomStack from './TrainerBttomStack';
import Chat from '../trainerScreens/Chat';

export type TainerProps = {
  TrainerBttomStack: undefined;
  Chat: undefined;
};
const Stack = createNativeStackNavigator<TainerProps>();
const TrainerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'TrainerBttomStack'} component={TrainerBttomStack} />
      <Stack.Screen name={'Chat'} component={Chat} />
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
