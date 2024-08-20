/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import Schedule from './src/Screens/Schedule';
import CompleteProfile from './src/Screens/CompleteProfile';
import Membership from './src/Screens/Membership';
import AddCard from './src/Screens/AddCard';
import FlashMessage from 'react-native-flash-message';
import {FontFamily} from './src/utils/Images';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

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
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
