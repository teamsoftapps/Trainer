import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrainerBttomStack from './TrainerBttomStack';
import Chat from '../Screens/trainerScreens/Chat';
import Message from '../Screens/trainerScreens/Message';
import Settings from '../Screens/trainerScreens/Settings';
import CompleteProfile from '../Screens/trainerScreens/CompleteProfile';
import EditProfile from '../Screens/trainerScreens/editProfile';
import Notification from '../Screens/trainerScreens/Notifications';
import ReviewBooking from '../Screens/userScreens/ReviewBooking';
import ManagePlans from '../Screens/trainerScreens/ManagePlans';

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
      <Stack.Screen name={'Message'} component={Message} />
      <Stack.Screen name={'Settings'} component={Settings} />
      <Stack.Screen name={'EditProfile'} component={EditProfile} />
      <Stack.Screen name={'Notification'} component={Notification} />
      <Stack.Screen name={'ReviewBooking'} component={ReviewBooking} />
      <Stack.Screen name={'ManagePlans'} component={ManagePlans} />
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
