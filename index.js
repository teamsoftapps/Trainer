/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import Membership from './src/Screens/Membership';
import Settings from './src/Screens/Settings';


const Routes = () => {
  return (
    <Provider store={store}>
      <Settings/>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
