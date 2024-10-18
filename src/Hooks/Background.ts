// notifeeBackgroundHandler.js
import notifee, {EventType} from '@notifee/react-native';

// Background handler function
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS && detail?.pressAction.id === 'default') {
    console.log('Notification was tapped in the background');
    // Handle background tap logic (e.g., navigation, loading data, etc.)
  }
});
