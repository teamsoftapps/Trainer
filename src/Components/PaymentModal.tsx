import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import Button from './Button';

interface Props {
  modalstate: boolean;
  onRequestClose: () => void;
}

const PaymentModal: React.FC<Props> = ({modalstate, onRequestClose}) => {
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
            width: responsiveScreenWidth(70),
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
              gap: responsiveScreenWidth(5),
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
                source={Images.payment_wallet}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
            </View>
            <Text style={{fontWeight: '600', color: 'black'}}>
              Payment Method Added
            </Text>

            <Text
              style={{fontWeight: '400', color: 'black', textAlign: 'center'}}>
              Your payment method is saved. You can now easily book and pay for
              sessions.
            </Text>

            <Button
              onPress={onRequestClose}
              textstyle={{
                color: 'white',
                fontWeight: '500',
                fontSize: responsiveFontSize(1.5),
              }}
              containerstyles={{
                backgroundColor: 'black',
                height: responsiveScreenHeight(5),
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({});
