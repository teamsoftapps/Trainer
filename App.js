import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigations/AuthStack';
import MainStack from './src/Navigations/MainStack';
import {useSelector} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import TrainerStack from './src/Navigations/TrainerStack';
import BootSplash from 'react-native-bootsplash';
import {
  requestMediaPermission,
  requestNotificationPermission,
} from './src/Hooks/Permission';
import {configureGoogle} from './src/config/googleAuth';
const App = () => {
  useEffect(() => {
    configureGoogle();
  }, []);

  const authData = useSelector(state => state?.Auth?.data);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      await requestNotificationPermission();
      await requestMediaPermission()
        .then(result => {})
        .catch(error => {
          console.log('Error', error);
        });
    });
  }, []);

  return (
    <StripeProvider
      publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw"
      urlScheme="trainerapp">
      <NavigationContainer>
        {authData?.token && authData?.isType === 'user' ? (
          <MainStack />
        ) : authData?.token && authData?.isType === 'trainer' ? (
          <TrainerStack />
        ) : (
          // <MainStack />
          <AuthStack />
        )}
      </NavigationContainer>
    </StripeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
