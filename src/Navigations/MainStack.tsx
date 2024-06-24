import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomStack from './BottomStack';

import Booking from '../Screens/Booking';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Bottom" component={BottomStack} />
      <Stack.Screen name="Booking" component={Booking} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
