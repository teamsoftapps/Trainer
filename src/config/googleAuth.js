import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId:
      '791670162595-133lqo6v65dgvjjajjssh6hcqn5ds3mh.apps.googleusercontent.com',
    offlineAccess: true,
  });
};
