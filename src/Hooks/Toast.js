import {showMessage} from 'react-native-flash-message';

const useToast = () => {
  const showToast = (message, description, type) => {
    showMessage({
      message,
      autoHide: true,
      hideOnPress: true,
      description: description || 'An error occurred',
      type,
    });
  };

  return {showToast};
};

export default useToast;
