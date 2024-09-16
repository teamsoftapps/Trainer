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
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import Button from './Button';
import {TextInput} from 'react-native';
import axiosBaseURL from '../utils/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

interface Props {
  modalstate: boolean;
  onRequestClose: () => void;
  paymentId: String;
}

const DeleteCardModal: React.FC<Props> = ({
  modalstate,
  onRequestClose,
  //   CardData,
  paymentId,
}) => {
  console.log('id received:', paymentId);
  // const Removecard = () => {
  //     onRequestClose()
  //     axiosBaseURL
  //         .post('/Common/RemoveCard', {
  //             CardID: CardData
  //         })
  //         .then(response => {
  //             showMessage({
  //                 message: 'Card Removed Successfully',
  //                 type: 'success',
  //             });
  //         })
  //         .catch(error => {
  //             showMessage({
  //                 message: 'Failed, Please try again',
  //                 type: 'warning',
  //             });
  //         });
  // }
  const Removecard = () => {
    if (!paymentId) {
      console.error('Payment ID is undefined');
      showMessage({
        message: 'Failed, Payment ID is missing',
        type: 'warning',
      });
      return;
    }
    onRequestClose();
    axiosBaseURL
      .delete(`/Common/RemoveStripeCard/${paymentId}`)
      .then(response => {
        console.log('responce?????', paymentId);
        console.log('Card removed successfully:', paymentId);
        showMessage({
          message: 'Card Removed Successfully',
          type: 'success',
        });
      })
      .catch(error => {
        console.error(
          'Error removing card:',
          error.response ? error.response.data : error.message
        );
        showMessage({
          message: 'Failed, Please try again',
          type: 'warning',
        });
      });
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
              alignItems: 'center',
              gap: responsiveScreenWidth(3),
              justifyContent: 'center',
              width: '90%',
              height: '80%',
            }}>
            <View
              style={{
                backgroundColor: 'black',
                width: responsiveScreenWidth(15),
                height: responsiveScreenWidth(15),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: responsiveScreenWidth(30),
              }}>
              <Image
                source={Images.RemoveCard}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
            </View>
            <Text
              style={{
                fontWeight: '600',
                color: 'black',
                fontSize: responsiveFontSize(2.5),
              }}>
              Remove Card?
            </Text>

            <Text
              style={{
                fontWeight: '400',
                color: 'black',
                textAlign: 'center',
                fontSize: responsiveFontSize(2),
              }}>
              Are you sure you want to remove your card?
            </Text>
            <Button
              onPress={() => {
                Removecard();
              }}
              textstyle={{
                color: 'white',
                fontWeight: '500',
                fontSize: responsiveFontSize(2),
              }}
              containerstyles={{
                backgroundColor: 'black',
                height: responsiveScreenHeight(5),
              }}
              text="Yes"
            />
            <Button
              onPress={onRequestClose}
              textstyle={{
                color: 'black',
                fontWeight: '500',
                fontSize: responsiveFontSize(2),
              }}
              containerstyles={{
                backgroundColor: 'white',
                height: responsiveScreenHeight(5),
              }}
              text="No"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteCardModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: responsiveWidth(1),
  },
  closeButtonText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    fontWeight: '600',
  },
  modalContent: {
    width: responsiveWidth(80),
    height: responsiveHeight(30),
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#9FED3A',
    borderRadius: 10,
    alignItems: 'center',
  },
});
