import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import axiosBaseURL from '../services/AxiosBaseURL';

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'chat', // keep this
      name: 'Chat Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
    });
  }
}

export async function ensureNotificationPermission() {
  // Android 13+
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  // iOS + Android (FCM permission API)
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export async function getFcmToken() {
  await messaging().registerDeviceForRemoteMessages();
  return messaging().getToken();
}

// call your backend: POST /notifications/save-token
export async function saveFcmTokenToBackend({userId, role, token}) {
  return axiosBaseURL.post('notification/save-token', {
    userId,
    role: (role || 'user').toLowerCase(),
    token,
  });
}

export async function showForegroundNotification(remoteMessage) {
  const senderName = remoteMessage?.data?.senderName;

  const title =
    remoteMessage?.notification?.title ||
    (senderName ? `New message from ${senderName}` : 'New Message');

  const body =
    remoteMessage?.notification?.body ||
    remoteMessage?.data?.text ||
    'You received a message';

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'chat',
      smallIcon: 'ic_stat_notification',
      importance: AndroidImportance.HIGH,
      priority: 'high',
      pressAction: {id: 'default'},
      sound: 'default',
    },
  });
}
