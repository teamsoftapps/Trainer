/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import Schedule from './src/Screens/Schedule';

const Routes = () => {
  return (
    <Provider store={store}>
      <Schedule />
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
