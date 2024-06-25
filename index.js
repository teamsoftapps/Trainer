/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import InitialScreen from './src/Screens/InitialScreen';
import Booking from './src/Screens/Booking';
import BookingConfirmed from './src/Screens/BookingConfirmed';
import BookingDetails from './src/Screens/BookingDetails';

const Routes = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
