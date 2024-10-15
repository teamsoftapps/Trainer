import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
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

export type RootProps = {
  Welcome: undefined;
  signin: {
    checkUser: string;
  };
  signup: {
    checkUser: string;
  };
  ForgotPassword: {
    checkUser: string;
  };
  VerifyOTP: {
    checkUser: string;
  };
  ConfirmNewPassword: {
    checkUser: string;
  };
  Compprofile: undefined;
  Membership: undefined;
  AddCard: undefined;
};

const Stack = createNativeStackNavigator<RootProps>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Welcome'} component={Welcome} />
      <Stack.Screen name={'signin'} component={Signin} />
      <Stack.Screen name={'signup'} component={Signup} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPassword} />
      <Stack.Screen name={'VerifyOTP'} component={VerifyOTP} />
      <Stack.Screen
        name={'ConfirmNewPassword'}
        component={ConfirmNewPassword}
      />
      <Stack.Screen name={'Compprofile'} component={CompleteProfile} />
      <Stack.Screen name={'Membership'} component={Membership} />
      <Stack.Screen name={'AddCard'} component={AddCard} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
