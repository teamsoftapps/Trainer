/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
import Favourites from './src/Screens/Favourites';
import AddCard from './src/Screens/AddCard';

const Routes = () => {
  return (
    <Provider store={store}>
      <AddCard/>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
