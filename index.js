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

const Routes = () => {
  return (
    <Provider store={store}>
      <CompleteProfile />
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
