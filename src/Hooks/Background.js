// notifeeBackgroundHandler.js
import notifee from '@notifee/react-native';

// Background handler function
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (
    type === notifee.EventType.ACTION_PRESS &&
    detail?.pressAction?.id === 'default'
  ) {
    console.log('Notification was tapped in the background');
    // Handle background tap logic (navigation, preload data, etc.)
  }
});
