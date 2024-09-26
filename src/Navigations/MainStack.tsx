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
      <Stack.Screen name={'CompleteProfile'} component={CompleteProfile} />
      <Stack.Screen name={'Membership'} component={Membership} />
      <Stack.Screen name={'Notification'} component={Notification} />
      <Stack.Screen name={'StoryViewer'} component={StoryViewer} />
      <Stack.Screen name={'Chats'} component={Chats} />
      <Stack.Screen name={'Filter'} component={Filter} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
