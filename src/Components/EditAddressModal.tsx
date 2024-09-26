import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import Button from './Button';
import {TextInput} from 'react-native';
import axiosBaseURL from '../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

interface Props {
  modalstate: boolean;
  onRequestClose: () => void;
  Address: string;
  token: string;
}

const EditAddressModal: React.FC<Props> = ({
  modalstate,
  onRequestClose,
  Address,
  token,
}) => {
  const [text, setText] = useState(Address);

  const SaveData = () => {
    onRequestClose();
    axiosBaseURL
      .post('/Common/UpdateAddress', {
        token: token,
        updatedAddress: text,
      })
      .then(response => {
        showMessage({
          message: 'Address updated successfully',
          type: 'success',
        });
      })
      .catch(error => {
        showMessage({
          message: 'Failed, Please try again',
          type: 'warning',
        });
      });
  };
  const Closemodal = () => {
    setText(Address);
    onRequestClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalstate}
      onRequestClose={onRequestClose}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: responsiveScreenHeight(35),
            width: responsiveScreenWidth(85),
            backgroundColor: '#9FED3A',
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: responsiveScreenWidth(4),
            alignItems: 'center',
            gap: responsiveScreenWidth(5),
          }}>
          <View
            style={{
              width: '80%',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: responsiveFontSize(2),
                fontFamily: FontFamily.Bold,
              }}>
              Edit Your Address
            </Text>
            <TouchableOpacity
              onPress={() => {
                Closemodal();
              }}>
              <Image
                source={Images.Cross}
                resizeMode="contain"
                style={{width: responsiveScreenWidth(5)}}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            // editable={false}
            // onFocus={() => { seteditable(true) }}
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            placeholder="Type something here..."
            multiline={true}
            numberOfLines={4} // This sets the initial height of the TextInput
          />
          <Button
            onPress={() => {
              SaveData();
            }}
            text="Save"
            textstyle={{
              color: 'white',
              fontWeight: '500',
              fontSize: responsiveFontSize(2),
            }}
            containerstyles={{
              backgroundColor: 'black',
              height: responsiveScreenHeight(5),
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditAddressModal;

const styles = StyleSheet.create({
  textArea: {
    height: '50%',
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    borderRadius: 10,
    color: 'black',
  },
});
