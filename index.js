import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import App from './App';
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
      {/* // App is Running Ok in the Local Environment and the biggest // */}
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Routes);
