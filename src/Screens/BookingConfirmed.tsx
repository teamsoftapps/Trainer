import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
  useResponsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import ButtonComp from '../Components/ButtonComp';

const BookingConfirmed = () => {
  return (
    <WrapperContainer>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(6),
          alignItems: 'center',
          gap: responsiveScreenHeight(2),
          marginTop: responsiveScreenHeight(5)
        }}>
        <Image
          source={Images.success}
          style={{
            width: responsiveScreenWidth(16),
            height: responsiveWidth(16),
          }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(5),
            fontFamily: FontFamily.Semi_Bold,
          }}>
          Success!
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(2),
            fontFamily: FontFamily.Medium,
            textAlign: 'center',
          }}>
          Thank you for choosing our service and trusting our trainer to help
          you achieve your health goals.
        </Text>
        <View
          style={{
            width: '100%',
            backgroundColor: '#9FED3A',
            paddingVertical: responsiveScreenHeight(3),
            gap: responsiveScreenHeight(3),
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <View
            style={{
              width: '70%',
              gap: responsiveScreenHeight(1),
              alignItems: 'center',
            }}>
            <Image
              source={Images.trainer4}
              style={{
                width: responsiveScreenWidth(20),
                height: useResponsiveScreenWidth(20),
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontFamily: FontFamily.Extra_Bold,
                fontSize: responsiveScreenFontSize(2.7),
                color: 'black',
              }}>
              Alex Morgan
            </Text>
            <Text
              style={{color: 'black', fontSize: responsiveScreenFontSize(2)}}>
              Alex Morgan
            </Text>
          </View>

          <View
            style={{
              width: '70%',
              gap: responsiveScreenHeight(1),
              alignItems: 'center',
            }}>
            <Text
              style={{color: 'black', fontSize: responsiveScreenFontSize(2)}}>
              Date & Time
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.Extra_Bold,
                fontSize: responsiveScreenFontSize(2.4),
                color: 'black',
              }}>
              Monday, October 24
            </Text>
            <Text
              style={{color: 'black', fontSize: responsiveScreenFontSize(2)}}>
              10:00 AM
            </Text>
          </View>
          <View
            style={{
              width: '70%',
              gap: responsiveScreenHeight(1),
              alignItems: 'center',
            }}>
            <Text
              style={{color: 'black', fontSize: responsiveScreenFontSize(2)}}>
              Address
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.Extra_Bold,
                fontSize: responsiveScreenFontSize(2.4),
                color: 'black',
              }}>
              San Francisco, California
            </Text>
            <Text
              style={{color: 'black', fontSize: responsiveScreenFontSize(2)}}>
              0.31 mi away
            </Text>
          </View>
        </View>
        <ButtonComp mainStyle={{width: '100%'}} text="Check Details" />
      </View>
    </WrapperContainer>
  );
};

export default BookingConfirmed;

const styles = StyleSheet.create({});
