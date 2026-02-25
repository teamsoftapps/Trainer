// import {StyleSheet} from 'react-native';
// import React, {useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import AuthStack from './src/Navigations/AuthStack';
// import MainStack from './src/Navigations/MainStack';
// import {useSelector} from 'react-redux';
// import {StripeProvider} from '@stripe/stripe-react-native';
// import TrainerStack from './src/Navigations/TrainerStack';
// import BootSplash from 'react-native-bootsplash';
// import {
//   requestMediaPermission,
//   requestNotificationPermission,
// } from './src/Hooks/Permission';
// import {configureGoogle} from './src/config/googleAuth';
// import UserStack from './src/Navigations/UserStack';
// const App = () => {
//   useEffect(() => {
//     configureGoogle();
//   }, []);

//   const authData = useSelector(state => state?.Auth?.data);

//   useEffect(() => {
//     const init = async () => {
//       // …do multiple sync or async tasks
//     };

//     init().finally(async () => {
//       await BootSplash.hide({fade: true});
//       await requestNotificationPermission();
//       await requestMediaPermission()
//         .then(result => {})
//         .catch(error => {
//           console.log('Error', error);
//         });
//     });
//   }, []);

//   return (
//     <StripeProvider
//       publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
//       urlScheme="trainerapp">
//       <NavigationContainer>
//         {authData?.token && authData?.isType === 'user' ? (
//           <UserStack />
//         ) : authData?.token && authData?.isType === 'trainer' ? (
//           <TrainerStack />
//         ) : (
//           // <MainStack />
//           <AuthStack />
//         )}
//       </NavigationContainer>
//     </StripeProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import BootSplash from 'react-native-bootsplash';

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

const App = () => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state?.Auth?.data);
  const [appLoading, setAppLoading] = useState(true);
  console.log('current in redux:', authData);
  // Google config
  useEffect(() => {
    configureGoogle();
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        if (!authData?.token) {
          setAppLoading(false);
          return;
        }

        console.log('Refreshing user...');

        const res = await axiosBaseURL.get(
          `/common/GetProfile/${authData.token}`,
        );

        console.log('Fresh Data in app.js', res.data.data);

        if (res.data.status) {
          dispatch(updateLogin(res.data.data));
        } else {
          dispatch(SignOut());
        }
      } catch (error) {
        console.log('Refresh failed:', error);
        dispatch(SignOut());
      } finally {
        setAppLoading(false);
      }
    };

    refreshUser();
  }, [authData?.token]);

  // BootSplash + Permissions
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({fade: true});
      await requestNotificationPermission();
      await requestMediaPermission();
    };

    init();
  }, []);

  // ⛔ Don't render navigation until refresh complete
  if (appLoading) {
    return null; // or custom loader
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StripeProvider
        publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
        urlScheme="trainerapp">
        <NavigationContainer>
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
