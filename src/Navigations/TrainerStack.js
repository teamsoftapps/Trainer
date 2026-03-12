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
import TrainerProfile from '../Screens/userScreens/TrainerProfile';
import Filter from '../Screens/userScreens/Filter';
import ManagePlans from '../Screens/trainerScreens/ManagePlans';
import StoryView from '../Screens/trainerScreens/storyView';
import axiosBaseURL from '../services/AxiosBaseURL';
import Subscription from '../Screens/trainerScreens/Subscription.js';
import PostCaptionScreen from '../Screens/trainerScreens/PostCaptionScreen.js';
import AllUploadsScreen from '../Screens/trainerScreens/AllUploadsScreen.js';
import TrainerFlow from './TrainerFlow.js';
import Chats from '../Screens/userScreens/Chats.js';
import ChatScreen from '../Screens/chat/ChatScreen';
import TrainerMediaScreen from '../Screens/userScreens/TrainerMediaScreen';
import AllReviewsScreen from '../Screens/userScreens/AllReviewsScreen';
import BookingDetails from '../Screens/userScreens/BookingDetails';
import TransactionDetails from '../Screens/trainerScreens/TransactionDetails';
import CallScreen from '../Screens/chat/CallScreen';

const Stack = createNativeStackNavigator();

// const TrainerStack = () => {
//   const checkData = useSelector(state => state?.Auth?.data);
//   const navigation = useNavigation();
//   const previousBookings = useRef([]);

//   // const getSessions = async () => {
//   //   try {
//   //     const response = await axiosBaseURL.get(
//   //       `/user/getBookingbyId/${checkData?._id}`,
//   //     );

//   //     const newBookings = response.data.data;

//   //     newBookings.forEach(async booking => {
//   //       if (!booking?.notificationSent) return;

//   //       await notifee.createTriggerNotification(
//   //         {
//   //           id: booking._id,
//   //           title: 'New Session Request',
//   //           body: 'You have a new session request',
//   //           android: {
//   //             channelId: 'default',
//   //             pressAction: {id: 'default'},
//   //           },
//   //         },
//   //         {
//   //           type: notifee.TriggerType.TIMESTAMP,
//   //           timestamp: Date.now() + 1000,
//   //         },
//   //       );

//   //       try {
//   //         await axiosBaseURL.post('/user/updateBooking', {
//   //           bookingId: booking._id,
//   //         });
//   //       } catch (err) {
//   //         console.log('Error marking notification as read:', err);
//   //       }
//   //     });

//   //     previousBookings.current = newBookings;
//   //   } catch (error) {
//   //     // console.log('Error fetching bookings:', error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
//   //     if (type === notifee.EventType.PRESS) {
//   //       console.log('Notification Pressed:', detail);
//   //       navigation.navigate('Sessions');
//   //     }
//   //   });

//   //   const pollInterval = setInterval(getSessions, 3000);

//   //   getSessions();

//   //   return () => {
//   //     clearInterval(pollInterval);
//   //     unsubscribe();
//   //   };
//   // }, [navigation]);

//   return (
//     // <Stack.Navigator
//     //   // initialRouteName={
//     //   //   checkData?.Speciality?.length === 0
//     //   //     ? 'CompleteProfile'
//     //   //     : 'TrainerBttomStack'
//     //   // }
//     //   screenOptions={{headerShown: false}}>
//     //   <Stack.Screen name="TrainerBttomStack" component={TrainerBttomStack} />
//     //   <Stack.Screen name="Subscription" component={Subscription} />
//     //   <Stack.Screen name="Chat" component={Chat} />
//     //   <Stack.Screen name="Message" component={Message} />
//     //   <Stack.Screen name="Settings" component={Settings} />
//     //   <Stack.Screen name="EditProfile" component={EditProfile} />
//     //   <Stack.Screen name="Notification" component={Notification} />
//     //   <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
//     //   <Stack.Screen name="ManagePlans" component={ManagePlans} />
//     //   <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
//     //   <Stack.Screen name="StoryView" component={StoryView} />
//     //   <Stack.Screen name="PostCaptionScreen" component={PostCaptionScreen} />
//     //   <Stack.Screen
//     //     name="AllUploadsScreen"
//     //     component={AllUploadsScreen}
//     //     options={{headerShown: false}}
//     //   />
//     // </Stack.Navigator>

//     <Stack.Navigator screenOptions={{headerShown: false}}>
//       {/* <Stack.Screen name="TrainerFlow" component={TrainerFlow} /> */}
//       <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
//       <Stack.Screen name="Subscription" component={Subscription} />
//       <Stack.Screen name="TrainerBttomStack" component={TrainerBttomStack} />
//       <Stack.Screen name="Chat" component={Chat} />
//       <Stack.Screen name="Message" component={Message} />
//       <Stack.Screen name="Settings" component={Settings} />
//       <Stack.Screen name="Notification" component={Notification} />
//       <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
//       <Stack.Screen name="ManagePlans" component={ManagePlans} />
//       <Stack.Screen name="StoryView" component={StoryView} />
//       <Stack.Screen name="PostCaptionScreen" component={PostCaptionScreen} />
//       <Stack.Screen name="AllUploadsScreen" component={AllUploadsScreen} />
//     </Stack.Navigator>
//   );
// };

const TrainerStack = () => {
  const trainer = useSelector(state => state?.Auth?.data);

  if (!trainer) return null;

  // Robust membership check (Subscription or 7-day Trial)
  const isMembershipActive = (() => {
    const now = new Date();

    // 1. Check Subscription
    if (trainer?.subscription?.isActive && trainer?.subscription?.endDate) {
      const endDate = new Date(trainer.subscription.endDate);
      if (endDate > now) return true;
    }

    // 2. Check 7-day Trial
    if (trainer?.trialStartDate) {
      const trialStartDate = new Date(trainer.trialStartDate);
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      if (trialEndDate > now) return true;
    }

    return false;
  })();

  const isProfileComplete = trainer?.isProfileComplete === true;

  console.log('Navigation State:', {
    isProfileComplete,
    isMembershipActive,
    trainerId: trainer?._id,
  });

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isProfileComplete ? (
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      ) : !isMembershipActive ? (
        <Stack.Screen name="Subscription" component={Subscription} />
      ) : (
        <>
          <Stack.Screen
            name="TrainerBttomStack"
            component={TrainerBttomStack}
          />
          <Stack.Screen name="Subscription" component={Subscription} />
          <Stack.Screen name="Chats" component={Chats} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
          <Stack.Screen name="Filter" component={Filter} />
          <Stack.Screen name="ManagePlans" component={ManagePlans} />
          <Stack.Screen name="StoryView" component={StoryView} />
          <Stack.Screen
            name="PostCaptionScreen"
            component={PostCaptionScreen}
          />
          <Stack.Screen name="AllUploadsScreen" component={AllUploadsScreen} />
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetails}
          />
          <Stack.Screen name="CallScreen" component={CallScreen} />
          <Stack.Screen
            name="TrainerMediaScreen"
            component={TrainerMediaScreen}
          />
          <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default TrainerStack;

const styles = StyleSheet.create({});
