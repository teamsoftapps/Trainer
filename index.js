// ✅ SILENCE Deprecation Warnings (Firebase v22+)
global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import App from './App';
import FlashMessage from 'react-native-flash-message';
import { FontFamily } from './src/utils/Images';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import messaging from '@react-native-firebase/messaging';

// ✅ Ignore specific noisy warnings
LogBox.ignoreLogs([
  'Deprecation: React Native Firebase namespaced API',
  'Non-serializable values were found in the navigation state',
  'Selector unknown returned the root state',
]);

// ✅ REQUIRED: background handler (Android)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Don't show notifee here because FCM "notification" payload already shows system notification
  // You can log if you want:
  console.log('📩 Background message:', remoteMessage);
});

const Routes = () => {
  return (
    <Provider store={store}>
      <App />
      <FlashMessage
        position={'top'}
        titleStyle={{
          fontFamily: FontFamily.Medium,
          fontSize: responsiveFontSize(1.4),
        }}
      />
      {/* // App is Running Ok in the Local Environment and the biggest // */}
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
