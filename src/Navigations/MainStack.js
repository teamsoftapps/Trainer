import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomStack from './BottomStack';

import Booking from '../Screens/userScreens/Booking';
import BookingDetails from '../Screens/userScreens/BookingDetails';
import Upcoming from '../Screens/userScreens/Upcoming';
import Previous from '../Screens/userScreens/Previous';
import ReviewBooking from '../Screens/userScreens/ReviewBooking';
import Message from '../Screens/userScreens/Message';
import TrainerProfile from '../Screens/userScreens/TrainerProfile';
import AddCard from '../Screens/userScreens/AddCard';
import Settings from '../Screens/userScreens/Settings';
import SearchInput from '../Screens/userScreens/SearchInput';
import Schedule from '../Screens/userScreens/Schedule';
import PaymentMethod from '../Screens/userScreens/PaymentMethod';
import CompleteProfile from '../Screens/trainerScreens/CompleteProfile';
import Membership from '../Screens/userScreens/Membership';
import Notification from '../Screens/userScreens/Notification';
import StoryViewer from '../Screens/userScreens/storyViewer';
import Chats from '../Screens/userScreens/Chats';
import BookingConfirmed from '../Screens/userScreens/BookingConfirmed';
import Filter from '../Screens/userScreens/Filter';
import ChangePassword from '../Screens/userScreens/ChangePassword';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Bottom" component={BottomStack} />
      <Stack.Screen name="BookingSuccessfull" component={BookingConfirmed} />
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
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="Membership" component={Membership} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="StoryViewer" component={StoryViewer} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
