/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Login from './src/Screens/Login';
import BottomNavigations from './src/Navigations/BottomNavigations';
import MainStack from './src/Navigations/MainStack';

AppRegistry.registerComponent(appName, () => App);
