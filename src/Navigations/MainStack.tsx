import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomStack from './BottomStack';
import NavigationStrings from './NavigationStrings';
import Home from '../Screens/Home';
import Message from '../Screens/Booking';
import Favourites from '../Screens/Favourites';
import Profile from '../Screens/Profile';
import Search from '../Screens/Search';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bottom" component={BottomStack} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
