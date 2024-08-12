import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomStack from './BottomStack';

import Booking from '../Screens/Booking';
import BookingDetails from '../Screens/BookingDetails';
import Upcoming from '../Screens/Upcoming';
import Previous from '../Screens/Previous';
import ReviewBooking from '../Screens/ReviewBooking';
import Message from '../Screens/Message';
import TrainerProfile from '../Screens/TrainerProfile';
import AddCard from '../Screens/AddCard';
import Settings from '../Screens/Settings';
import SearchInput from '../Screens/SearchInput';
import Schedule from '../Screens/Schedule';
import PaymentMethod from '../Screens/PaymentMethod';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Bottom" component={BottomStack} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="Upcoming" component={Upcoming} />
      <Stack.Screen name="Previous" component={Previous} />
      <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
      <Stack.Screen name="Messages" component={Message} />
      <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="SearchInput" component={SearchInput} />
      <Stack.Screen name="Schedule" component={Schedule} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
