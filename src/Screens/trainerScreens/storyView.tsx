import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/Header';
import {useNavigation} from '@react-navigation/native';
import Button from '../../Components/Button';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Text} from 'react-native-svg';
import {Images} from '../../utils/Images';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

const StoryView = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation();
  const trainer_data = useSelector(state => state.Auth.data);
  console.log('hhhh', trainer_data);
  console.log('Data from story screen', data);

  const uploadData = async () => {
    try {
      const formData = new FormData();

      formData.append('files', {
        uri: data?.node?.imade?.uri,
        type: data?.node?.type,
        name: `profileImage-${Date.now()}.jpg`,
      });
      formData.append('email', trainer_data.email);

      const response = await axiosBaseURL.post(
        '/trainer/trainerUploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('image url:', response.data.data.url);

      if (response.data.status) {
        showMessage({
          message: 'Upload Successful',
          description: 'Your Data has been updated!',
          type: 'success',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Upload Failed',
        description: error.message || 'Failed to upload image.',
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header style={styles.header} onPress={() => navigation.goBack()} />

      <Image
        source={{uri: data.node.image.uri}}
        style={styles.image}
        resizeMode="contain"
      />
      <Button
        text="Add to story"
        containerstyles={styles.button}
        onPress={() => {
          uploadData();
        }}
      />
    </View>
  );
};

export default StoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    alignSelf: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subModalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(25),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },

  subModalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(16),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },
  modalText: {
    fontSize: responsiveFontSize(2.2),
    marginBottom: responsiveHeight(3),
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: '#000',
    borderRadius: responsiveWidth(6),
    marginHorizontal: responsiveWidth(1),
  },
  closeButtonText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
});
