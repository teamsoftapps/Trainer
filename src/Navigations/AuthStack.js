import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Signup from '../Screens/userScreens/Signup';
import Welcome from '../Screens/userScreens/Welcome';
import Signin from '../Screens/userScreens/Signin';
import Membership from '../Screens/userScreens/Membership';
import AddCard from '../Screens/userScreens/AddCard';
import ForgotPassword from '../Screens/userScreens/ForgotPassword';
import VerifyOTP from '../Screens/userScreens/VerifyOTP';
import ConfirmNewPassword from '../Screens/userScreens/ConfirmNewPassword';
import CompleteProfile from '../Screens/trainerScreens/CompleteProfile';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="signin" component={Signin} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="ConfirmNewPassword" component={ConfirmNewPassword} />
      <Stack.Screen name="Compprofile" component={CompleteProfile} />
      <Stack.Screen name="Membership" component={Membership} />
      <Stack.Screen name="AddCard" component={AddCard} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
