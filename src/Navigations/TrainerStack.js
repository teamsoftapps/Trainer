import {StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import notifee from '@notifee/react-native';

import TrainerBttomStack from './TrainerBttomStack';
import Chat from '../Screens/trainerScreens/Chat';
import Message from '../Screens/trainerScreens/Message';
import Settings from '../Screens/trainerScreens/Settings';
import CompleteProfile from '../Screens/trainerScreens/CompleteProfile';
import EditProfile from '../Screens/trainerScreens/editProfile';
import Notification from '../Screens/trainerScreens/Notifications';
import ReviewBooking from '../Screens/trainerScreens/reviewBooking.js';
import ManagePlans from '../Screens/trainerScreens/ManagePlans';
import StoryView from '../Screens/trainerScreens/storyView';
import axiosBaseURL from '../services/AxiosBaseURL';
import Subscription from '../Screens/trainerScreens/Subscription.js';
import PostCaptionScreen from '../Screens/trainerScreens/PostCaptionScreen.js';

const Stack = createNativeStackNavigator();

const TrainerStack = () => {
  const checkData = useSelector(state => state?.Auth?.data);
  const navigation = useNavigation();
  const previousBookings = useRef([]);

  const getSessions = async () => {
    try {
      const response = await axiosBaseURL.get(
        `/user/getBookingbyId/${checkData?._id}`,
      );

      const newBookings = response.data.data;

      newBookings.forEach(async booking => {
        if (!booking?.notificationSent) return;

        await notifee.createTriggerNotification(
          {
            id: booking._id,
            title: 'New Session Request',
            body: 'You have a new session request',
            android: {
              channelId: 'default',
              pressAction: {id: 'default'},
            },
          },
          {
            type: notifee.TriggerType.TIMESTAMP,
            timestamp: Date.now() + 1000,
          },
        );

        try {
          await axiosBaseURL.post('/user/updateBooking', {
            bookingId: booking._id,
          });
        } catch (err) {
          console.log('Error marking notification as read:', err);
        }
      });

      previousBookings.current = newBookings;
    } catch (error) {
      // console.log('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === notifee.EventType.PRESS) {
        console.log('Notification Pressed:', detail);
        navigation.navigate('Sessions');
      }
    });

    const pollInterval = setInterval(getSessions, 3000);

    getSessions();

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [navigation]);

  return (
    <Stack.Navigator
      initialRouteName={
        checkData?.Speciality?.length === 0
          ? 'CompleteProfile'
          : 'TrainerBttomStack'
      }
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="TrainerBttomStack" component={TrainerBttomStack} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
      <Stack.Screen name="ManagePlans" component={ManagePlans} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="StoryView" component={StoryView} />
      <Stack.Screen name="PostCaptionScreen" component={PostCaptionScreen} />
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
