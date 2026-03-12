import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';

const NetworkStatusProvider = ({children}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'No Internet Connection',
          textBody: 'Please check your network settings and try again.',
          button: 'Ok',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default NetworkStatusProvider;
