/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import Message from './src/Screens/Message';
import Account from './src/Screens/Account';
import Search from './src/Screens/Search';

const Routes = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
