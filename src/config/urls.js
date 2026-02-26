// export const MAP_API_KEY = 'AIzaSyDlSV5LKnfxrx15fu7WAejxPTfM8U21aaE';
// export const MAP_API_KEY = 'AIzaSyBBlrR_ENS10a9haJIpIgCHIu4dD9A_rE4';
// export const MAP_API_KEY = 'AIzaSyArxJNX49_nbTyy-fjiGIOTw6O0-IEih90';

// IOS
// export const MAP_API_KEY = 'AIzaSyD3QYkN3hF2nkO-ovTan98BPweQh-fw840';

import {Platform} from 'react-native';

// Use the specific key for the specific platform
export const MAP_API_KEY = Platform.select({
  ios: 'AIzaSyD3QYkN3hF2nkO-ovTan98BPweQh-fw840',
  android: 'AIzaSyArxJNX49_nbTyy-fjiGIOTw6O0-IEih90', // The one you just restricted in the screenshot
});
