// import React, {useEffect, useState} from 'react';
// import {StyleSheet} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {useSelector, useDispatch} from 'react-redux';
// import {StripeProvider} from '@stripe/stripe-react-native';
// import BootSplash from 'react-native-bootsplash';

// import AuthStack from './src/Navigations/AuthStack';
// import TrainerStack from './src/Navigations/TrainerStack';
// import UserStack from './src/Navigations/UserStack';

// import axiosBaseURL from './src/services/AxiosBaseURL';
// import {updateLogin, SignOut} from './src/store/Slices/AuthSlice';

// import {
//   requestMediaPermission,
//   requestNotificationPermission,
// } from './src/Hooks/Permission';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {configureGoogle} from './src/config/googleAuth';

// const App = () => {
//   const dispatch = useDispatch();
//   const authData = useSelector(state => state?.Auth?.data);
//   const [appLoading, setAppLoading] = useState(true);
//   console.log('current in redux:', authData);
//   useEffect(() => {
//     configureGoogle();
//   }, []);

//   useEffect(() => {
//     const refreshUser = async () => {
//       try {
//         if (!authData?.token) {
//           setAppLoading(false);
//           return;
//         }

//         console.log('Refreshing user...');

//         const res = await axiosBaseURL.get(
//           `/common/GetProfile/${authData.token}`,
//         );

//         console.log('Fresh Data in app.js', res.data.data);

//         if (res.data.status) {
//           dispatch(updateLogin(res.data.data));
//         } else {
//           dispatch(SignOut());
//         }
//       } catch (error) {
//         console.log('Refresh failed:', error);
//         dispatch(SignOut());
//       } finally {
//         setAppLoading(false);
//       }
//     };

//     refreshUser();
//   }, [authData?.token]);

//   // BootSplash + Permissions
//   useEffect(() => {
//     const init = async () => {
//       await BootSplash.hide({fade: true});
//       await requestNotificationPermission();
//       await requestMediaPermission();
//     };

//     init();
//   }, []);
//   if (appLoading) {
//     return null; // or custom loader
//   }

//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
//       <StripeProvider
//         publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
//         urlScheme="trainerapp">
//         <NavigationContainer>
//           {authData?.token && authData?.isType === 'user' ? (
//             <UserStack />
//           ) : authData?.token && authData?.isType === 'trainer' ? (
//             <TrainerStack />
//           ) : (
//             <AuthStack />
//           )}
//         </NavigationContainer>
//       </StripeProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

// import React, {useEffect, useState} from 'react';
// import {StyleSheet} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {useSelector, useDispatch} from 'react-redux';
// import {StripeProvider} from '@stripe/stripe-react-native';
// import BootSplash from 'react-native-bootsplash';
// import messaging from '@react-native-firebase/messaging';

// import AuthStack from './src/Navigations/AuthStack';
// import TrainerStack from './src/Navigations/TrainerStack';
// import UserStack from './src/Navigations/UserStack';

// import axiosBaseURL from './src/services/AxiosBaseURL';
// import {updateLogin, SignOut} from './src/store/Slices/AuthSlice';

// import {
//   requestMediaPermission,
//   requestNotificationPermission,
// } from './src/Hooks/Permission';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {configureGoogle} from './src/config/googleAuth';

// // ✅ NEW imports
// import {
//   setupNotificationChannel,
//   ensureNotificationPermission,
//   getFcmToken,
//   saveFcmTokenToBackend,
//   showForegroundNotification,
// } from './src/Notifications/notificationService';
// import firebase from '@react-native-firebase/app';
// import {getApps} from '@react-native-firebase/app';
// import {navigationRef, navigate} from './src/Navigations/navigationService';

// const App = () => {
//   const dispatch = useDispatch();
//   const authData = useSelector(state => state?.Auth?.data);
//   const [appLoading, setAppLoading] = useState(true);
//   console.log('Firebase apps:', getApps().length);

//   useEffect(() => {
//     configureGoogle();
//   }, []);

//   useEffect(() => {
//     const refreshUser = async () => {
//       try {
//         if (!authData?.token) {
//           setAppLoading(false);
//           return;
//         }

//         const res = await axiosBaseURL.get(
//           `/common/GetProfile/${authData.token}`,
//         );

//         if (res.data.status) {
//           dispatch(updateLogin(res.data.data));
//         } else {
//           dispatch(SignOut());
//         }
//       } catch (error) {
//         console.log('Refresh failed:', error);
//         dispatch(SignOut());
//       } finally {
//         setAppLoading(false);
//       }
//     };

//     refreshUser();
//   }, [authData?.token, dispatch]);

//   // BootSplash + Permissions (your existing)
//   useEffect(() => {
//     const init = async () => {
//       await BootSplash.hide({fade: true});
//       await requestNotificationPermission();
//       await requestMediaPermission();
//     };
//     init();
//   }, []);

//   // ✅ STEP 7: FCM setup + token save + foreground notifications
//   // useEffect(() => {
//   //   const initNotifications = async () => {
//   //     try {
//   //       await setupNotificationChannel();

//   //       // You already call requestNotificationPermission() above,
//   //       // but we also ensure here for FCM:
//   //       const granted = await ensureNotificationPermission();
//   //       if (!granted) return;

//   //       // Save token only if logged in
//   //       if (authData?._id && authData?.token) {
//   //         const token = await getFcmToken();
//   //         console.log('✅ FCM Token:', token);

//   //         await saveFcmTokenToBackend({
//   //           userId: authData._id,
//   //           role: authData.isType || authData.role || 'user',
//   //           token,
//   //         });
//   //       }
//   //     } catch (e) {
//   //       console.log('Notification init error:', e?.message || e);
//   //     }
//   //   };

//   //   initNotifications();

//   //   // Foreground handler
//   //   const unsub = messaging().onMessage(async remoteMessage => {
//   //     await showForegroundNotification(remoteMessage);
//   //   });

//   //   return () => {
//   //     unsub();
//   //   };
//   // }, [authData?._id, authData?.token]);

//   useEffect(() => {
//     const initNotifications = async () => {
//       try {
//         await setupNotificationChannel();

//         const granted = await ensureNotificationPermission();
//         if (!granted) return;

//         if (authData?._id && authData?.token) {
//           const token = await getFcmToken();
//           console.log('✅ FCM Token:', token);

//           await saveFcmTokenToBackend({
//             userId: authData._id,
//             role: authData.isType || authData.role || 'user',
//             token,
//           });
//         }
//       } catch (e) {
//         console.log('Notification init error:', e?.message || e);
//       }
//     };

//     initNotifications();

//     // ✅ Foreground handler
//     const unsub = messaging().onMessage(async remoteMessage => {
//       await showForegroundNotification(remoteMessage);
//     });

//     // ✅ Tap notification (background)
//     const unsubOpen = messaging().onNotificationOpenedApp(remoteMessage => {
//       const data = remoteMessage?.data || {};
//       const conversationId = data?.conversationId;

//       if (conversationId) {
//         navigate('ChatScreen', {conversationId});
//       }
//     });

//     // ✅ Tap notification (killed)
//     const checkKilled = async () => {
//       const initial = await messaging().getInitialNotification();
//       if (initial) {
//         const data = initial?.data || {};
//         const conversationId = data?.conversationId;

//         if (conversationId) {
//           setTimeout(() => {
//             navigate('ChatScreen', {conversationId});
//           }, 700);
//         }
//       }
//     };

//     checkKilled();

//     return () => {
//       unsub();
//       unsubOpen();
//     };
//   }, [authData?._id, authData?.token]);

//   if (appLoading) {
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
//       <StripeProvider
//         publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
//         urlScheme="trainerapp">
//         <NavigationContainer ref={navigationRef}>
//           {authData?.token && authData?.isType === 'user' ? (
//             <UserStack />
//           ) : authData?.token && authData?.isType === 'trainer' ? (
//             <TrainerStack />
//           ) : (
//             <AuthStack />
//           )}
//         </NavigationContainer>
//       </StripeProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import BootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';

import AuthStack from './src/Navigations/AuthStack';
import TrainerStack from './src/Navigations/TrainerStack';
import UserStack from './src/Navigations/UserStack';

import axiosBaseURL from './src/services/AxiosBaseURL';
import {updateLogin, SignOut} from './src/store/Slices/AuthSlice';

import {
  requestMediaPermission,
  requestNotificationPermission,
} from './src/Hooks/Permission';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {configureGoogle} from './src/config/googleAuth';

import {
  setupNotificationChannel,
  ensureNotificationPermission,
  getFcmToken,
  saveFcmTokenToBackend,
  showForegroundNotification,
} from './src/Notifications/notificationService';

import {navigationRef, navigate} from './src/Navigations/navigationService';

const App = () => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state?.Auth?.data);
  const [appLoading, setAppLoading] = useState(true);

  // prevent duplicate token save
  const savedTokenRef = useRef(null);

  /* ---------------- GOOGLE CONFIG ---------------- */
  useEffect(() => {
    configureGoogle();
  }, []);

  /* ---------------- REFRESH USER ---------------- */
  useEffect(() => {
    const refreshUser = async () => {
      try {
        if (!authData?.token) {
          setAppLoading(false);
          return;
        }

        const res = await axiosBaseURL.get(
          `/common/GetProfile/${authData.token}`,
        );

        if (res.data.status) {
          dispatch(updateLogin(res.data.data));
        } else {
          dispatch(SignOut());
        }
      } catch (error) {
        dispatch(SignOut());
      } finally {
        setAppLoading(false);
      }
    };

    refreshUser();
  }, [authData?.token, dispatch]);

  /* ---------------- BOOTSTRAP ---------------- */
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({fade: true});
      await requestNotificationPermission();
      await requestMediaPermission();
    };
    init();
  }, []);

  /* ---------------- NOTIFICATIONS ---------------- */
  useEffect(() => {
    let unsubscribeForeground = null;
    let unsubscribeOpen = null;
    let unsubscribeTokenRefresh = null;

    const initNotifications = async () => {
      try {
        await setupNotificationChannel();

        const granted = await ensureNotificationPermission();
        if (!granted) return;

        // Save FCM token only if logged in
        if (authData?._id && authData?.token) {
          const token = await getFcmToken();

          console.log('FCM Token:', token);

          // prevent duplicate saves
          if (savedTokenRef.current !== token) {
            savedTokenRef.current = token;

            await saveFcmTokenToBackend({
              userId: authData._id,
              role: authData.isType || authData.role || 'user',
              token,
            });
          }

          // handle token refresh
          unsubscribeTokenRefresh = messaging().onTokenRefresh(
            async newToken => {
              savedTokenRef.current = newToken;

              await saveFcmTokenToBackend({
                userId: authData._id,
                role: authData.isType || authData.role || 'user',
                token: newToken,
              });
            },
          );
        }
      } catch (e) {
        console.log('Notification init error:', e?.message || e);
      }
    };

    initNotifications();

    /* -------- Foreground message -------- */
    unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      await showForegroundNotification(remoteMessage);
    });

    /* -------- App opened from background -------- */
    unsubscribeOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      const conversationId = remoteMessage?.data?.conversationId;
      if (conversationId) {
        navigate('ChatScreen', {conversationId});
      }
    });

    /* -------- App opened from killed state -------- */
    const checkInitialNotification = async () => {
      const initial = await messaging().getInitialNotification();
      if (initial?.data?.conversationId) {
        setTimeout(() => {
          navigate('ChatScreen', {
            conversationId: initial.data.conversationId,
          });
        }, 800);
      }
    };

    checkInitialNotification();

    return () => {
      unsubscribeForeground?.();
      unsubscribeOpen?.();
      unsubscribeTokenRefresh?.();
    };
  }, [authData?._id, authData?.token]);

  if (appLoading) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StripeProvider
        publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
        urlScheme="trainerapp">
        <NavigationContainer ref={navigationRef}>
          {authData?.token && authData?.isType === 'user' ? (
            <UserStack />
          ) : authData?.token && authData?.isType === 'trainer' ? (
            <TrainerStack />
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
      </StripeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
