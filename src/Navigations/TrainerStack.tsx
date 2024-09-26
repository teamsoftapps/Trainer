import {StyleSheet} from 'react-native';
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
import CompleteProfile from '../Screens/CompleteProfile';
import Membership from '../Screens/Membership';
import Notification from '../Screens/Notification';
import StoryViewer from '../Screens/storyViewer';
import Chats from '../Screens/Chats';
import BookingConfirmed from '../Screens/BookingConfirmed';
import Filter from '../Screens/Filter';
import TrainerHome from '../Screens/TrainerHome';

export type TainerProps = {
  TrainerHome: undefined;
};
const Stack = createNativeStackNavigator<TainerProps>();
const TrainerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'TrainerHome'} component={TrainerHome} />
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
