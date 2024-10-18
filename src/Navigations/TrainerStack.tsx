import {StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrainerBttomStack from './TrainerBttomStack';
import Chat from '../Screens/trainerScreens/Chat';
import Message from '../Screens/trainerScreens/Message';
import Settings from '../Screens/trainerScreens/Settings';
import CompleteProfile from '../Screens/trainerScreens/CompleteProfile';
import EditProfile from '../Screens/trainerScreens/editProfile';
import Notification from '../Screens/trainerScreens/Notifications';
import ReviewBooking from '../Screens/trainerScreens/reviewBooking';
import ManagePlans from '../Screens/trainerScreens/ManagePlans';
import {useSelector} from 'react-redux';
import notifee, {EventType, TriggerType} from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import axiosBaseURL from '../services/AxiosBaseURL';
import axios from 'axios';

export type TainerProps = {
  TrainerBttomStack: undefined;
  Chat: undefined;
  Message: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notification: {id: string}; // Add notification route
  ReviewBooking: undefined;
  ManagePlans: undefined;
  CompleteProfile: undefined;
};

const Stack = createNativeStackNavigator<TainerProps>();

const TrainerStack = () => {
  const checkData = useSelector(state => state?.Auth?.data);
  const navigation = useNavigation(); // Get navigation object
  const previousBookings = useRef([]);
  // useEffect(() => {
  //   const handleForegroundNotification = async () => {
  //     await getSessions();

  //     // Set up foreground notification listener
  //     const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
  //       if (type === EventType.PRESS) {
  //         console.log('Notification Pressed:', detail);
  //         navigation.navigate('Notification', {id: detail.notification.id});
  //       }
  //     });

  //     // Clean up the subscription on component unmount
  //     return () => unsubscribe();
  //   };

  //   // Call the async function
  //   handleForegroundNotification();
  // }, [navigation]);

  // // Function to get session data and trigger notification
  // const getSessions = async () => {
  //   try {
  //     const response = await axiosBaseURL.get(
  //       `/user/getBookingbyId/${checkData?._id}`
  //     );

  //     console.log('GEETTTDATAA', response.data.data);

  //     response.data.data.forEach(async (item: any) => {
  //       if (item?.paymentStatus === 'pending') {
  //         await notifee.createTriggerNotification(
  //           {
  //             id: item?._id,
  //             title: 'Session Request',
  //             body: 'You have a pending session request',
  //             android: {
  //               channelId: 'default',
  //               pressAction: {
  //                 id: 'default',
  //               },
  //             },
  //           },
  //           // Define trigger (e.g., time trigger or interval trigger)
  //           {
  //             type: TriggerType.TIMESTAMP,
  //             timestamp: Date.now() + 5000, // 5 seconds delay
  //           }
  //         );
  //       }
  //     });
  //   } catch (error) {
  //     console.log('Error', error);
  //   }
  // };

  // This will store the previous booking data

  // Function to compare bookings and trigger notifications for new ones
  const getSessions = async () => {
    try {
      const response = await axiosBaseURL.get(
        `/user/getBookingbyId/${checkData?._id}`
      );

      const newBookings = response.data.data;
      console.log('New Bookings:', newBookings);

      // Find bookings that are new (not in the previousBookings array)
      const addedBookings = newBookings.filter(
        newBooking =>
          !previousBookings.current.some(
            prevBooking => prevBooking._id === newBooking._id
          )
      );

      // If there are added bookings, trigger a notification
      if (addedBookings.length > 0) {
        for (const booking of addedBookings) {
          if (booking.notificationSent === true) {
            await notifee.createTriggerNotification(
              {
                id: booking._id,
                title: 'New Session Request',
                body: 'You have a new session request',
                android: {
                  channelId: 'default',
                  pressAction: {
                    id: 'default',
                  },
                },
              },
              {
                type: TriggerType.TIMESTAMP,
                timestamp: Date.now() + 1000, // Trigger notification immediately (1-second delay)
              }
            );
            try {
              const response = await axiosBaseURL.post('/user/updateBooking', {
                bookingId: booking._id,
              });

              if (response.data) {
                console.log('Notification marked as read:', response.data);
                // Update UI or state as needed, e.g., remove notification from list
              }
            } catch (error) {
              console.log('Error marking notification as read:', error);
            }
          } else {
            return;
          }
        }
      }

      // Update previousBookings with the latest data
      previousBookings.current = newBookings;
    } catch (error) {
      console.log('Error fetching bookings:', error);
    }
  };

  // Set up foreground notification handler and polling
  useEffect(() => {
    const handleForegroundNotification = async () => {
      const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('Notification Pressed:', detail);
          navigation.navigate('Notification', {id: detail.notification.id});
        }
      });

      // Clean up the subscription on component unmount
      return () => unsubscribe();
    };

    // Start polling every X seconds (e.g., 30 seconds)
    const pollInterval = setInterval(() => {
      getSessions(); // Check for new sessions (bookings) on the server
    }, 3000); // 30 seconds

    // Call the function for the first time without delay
    getSessions();

    // Set up foreground notification listener
    handleForegroundNotification();

    // Cleanup the polling and notification listener when component unmounts
    return () => {
      clearInterval(pollInterval);
      handleForegroundNotification(); // Cleanup
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
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
      <Stack.Screen name="ManagePlans" component={ManagePlans} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
