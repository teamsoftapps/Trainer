/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';


const Routes = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
