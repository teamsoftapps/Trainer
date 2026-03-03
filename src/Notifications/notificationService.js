import { getMessaging, getToken } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import axiosBaseURL from '../services/AxiosBaseURL';

const messaging = getMessaging();

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
  const authStatus = await messaging.requestPermission();
  const enabled =
    authStatus === 1 || // AUTHORIZED
    authStatus === 2; // PROVISIONAL

  return enabled;
}

export async function getFcmToken() {
  return getToken(messaging);
}

// call your backend: POST /notifications/save-token
export async function saveFcmTokenToBackend({ userId, role, token }) {
  return axiosBaseURL.post('notification/save-token', {
    userId,
    role: (role || 'user').toLowerCase(),
    token,
  });
}

export async function showForegroundNotification(remoteMessage) {
  const senderName = remoteMessage?.data?.senderName;
  const data = remoteMessage?.data || {};

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
    data: data, // Pass through deep linking keys
    android: {
      channelId: 'chat',
      smallIcon: 'ic_stat_notification',
      importance: AndroidImportance.HIGH,
      priority: 'high',
      pressAction: { id: 'default' },
      sound: 'default',
    },
  });
}
