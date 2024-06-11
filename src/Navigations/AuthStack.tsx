import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationStrings from './NavigationStrings';
import Signup from '../Screens/Signup';
import Welcome from '../Screens/Welcome';
import Login from '../Screens/Login';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NavigationStrings.HOME} component={Welcome} />
      <Stack.Screen name={NavigationStrings.Welcome} component={Signup} />
      <Stack.Screen name={NavigationStrings.LOG_IN} component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
