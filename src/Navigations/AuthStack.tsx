import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationStrings from './NavigationStrings';
import Signup from '../Screens/Signup';
import Welcome from '../Screens/Welcome';
import Signin from '../Screens/Signin';
import CompleteProfile from '../Screens/CompleteProfile';
import Membership from '../Screens/Membership';
import AddCard from '../Screens/AddCard';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NavigationStrings.Welcome} component={Welcome} />
      <Stack.Screen name={NavigationStrings.LOG_IN} component={Signin} />
      <Stack.Screen name={NavigationStrings.SIGN_UP} component={Signup} />
      <Stack.Screen
        name={NavigationStrings.COMPLETE_PROFILE}
        component={CompleteProfile}
      />
      <Stack.Screen name={'Membership'} component={Membership} />
      <Stack.Screen name={'AddCard'} component={AddCard} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
