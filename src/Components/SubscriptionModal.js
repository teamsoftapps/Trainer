import {Image, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import Button from './Button';

const SubscriptionModal = ({modalstate, onRequestClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalstate}
      onRequestClose={onRequestClose}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: responsiveScreenHeight(50),
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

            <Text
              style={{
                fontWeight: '600',
                color: 'black',
                fontSize: responsiveFontSize(2.5),
              }}>
              Subscrition Confirmed
            </Text>

            <Text
              style={{
                fontWeight: '500',
                color: 'black',
                textAlign: 'center',
                fontSize: responsiveFontSize(2),
              }}>
              You have successfully subscribed to our Premium Memebership.
              Welcome to the Stern's Gym community!
            </Text>

            <Text
              style={{
                fontWeight: '700',
                color: 'black',
                textAlign: 'center',
                fontSize: responsiveFontSize(2.2),
              }}>
              Membership Benifits
            </Text>

            <Text
              style={{
                fontWeight: '500',
                color: 'black',
                textAlign: 'center',
                fontSize: responsiveFontSize(2),
              }}>
              Access to premium features {'\n'}
              Connect with more clients {'\n'}
              Exclusive training resources
            </Text>

            <Button
              onPress={onRequestClose}
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
      </View>
    </Modal>
  );
};

export default SubscriptionModal;

const styles = StyleSheet.create({});
