import {Platform, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCallPermissions = async () => {
  if (Platform.OS === 'android') {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const audioPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    return (
      cameraPermission === RESULTS.GRANTED &&
      audioPermission === RESULTS.GRANTED
    );
  } else if (Platform.OS === 'ios') {
    const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    const microphonePermission = await request(PERMISSIONS.IOS.MICROPHONE);

    return (
      cameraPermission === RESULTS.GRANTED &&
      microphonePermission === RESULTS.GRANTED
    );
  }
  return false;
};
