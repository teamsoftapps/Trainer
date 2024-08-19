import {showMessage} from 'react-native-flash-message';

interface Props {
  message: string;
  description: string;
  type: any;
}

const Toast = () => {
  const showToast = ({message, description, type}: Props) => {
    showMessage({
      message: message,
      autoHide: true,
      hideOnPress: true,
      description: description || 'An error occured',
      type: type,
    });
  };

  return {showToast};
};
export default Toast;
