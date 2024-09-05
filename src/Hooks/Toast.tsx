import React from 'react';
// Import the showMessage function from the appropriate library or file

import {MessageType, showMessage} from 'react-native-flash-message';

const useToast = () => {
  const showToast = (
    message: string,
    description: string,
    type: MessageType
  ) => {
    showMessage({
      message: message,
      autoHide: true,
      hideOnPress: true,
      description: description || 'An error occurred',
      type: type,
    });
  };

  return {showToast};
};

export default useToast;
