import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import Button from '../Components/Button';

const ReviewBooking = () => {
  return (
    <WrapperContainer>
      <Header style={{height: responsiveHeight(7)}} />
      <View>
        <Text
          style={{
            color: 'white',
            paddingHorizontal: responsiveScreenWidth(8),
            fontSize: responsiveFontSize(3),
            fontFamily: FontFamily.Bold,
          }}>
          Review Booking
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: responsiveScreenWidth(8),
          paddingVertical: responsiveHeight(2),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: '#686868',
          borderBottomWidth: 0.5,
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Date & Time
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.4)}}>
            Monday, October 24
          </Text>
          <Text style={{color: 'white', fontSize: responsiveScreenFontSize(2)}}>
            8:00 AM
          </Text>
        </View>
        <View>
          <TouchableOpacity>
            <Image
              source={Images.rightarrow}
              style={{height: responsiveWidth(4)}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: responsiveScreenWidth(8),
          paddingVertical: responsiveHeight(2),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: '#686868',
          borderBottomWidth: 0.5,
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Trainer
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.4)}}>
            Alex Morgan
          </Text>
          <Text style={{color: 'white', fontSize: responsiveScreenFontSize(2)}}>
            Fitness
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveScreenWidth(3),
          }}>
          <Image
            source={Images.trainer4}
            style={{
              width: responsiveScreenWidth(16),
              height: responsiveScreenWidth(16),
              borderRadius: responsiveScreenWidth(10),
            }}
          />
          <TouchableOpacity>
            <Image
              source={Images.rightarrow}
              style={{height: responsiveWidth(4)}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: responsiveScreenWidth(8),
          paddingVertical: responsiveHeight(2),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: '#686868',
          borderBottomWidth: 0.5,
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Address
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.4)}}>
            San Francisco, California
          </Text>
          <Text style={{color: 'white', fontSize: responsiveScreenFontSize(2)}}>
            0.31 mi away
          </Text>
        </View>
        <View>
          <TouchableOpacity>
            <Image
              source={Images.rightarrow}
              style={{height: responsiveWidth(4)}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: responsiveScreenWidth(8),
          paddingVertical: responsiveHeight(2),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: '#686868',
          borderBottomWidth: 0.5,
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Payment Method
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.4)}}>
            Credit or Debit Card
          </Text>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <Image source={Images.visa} />
            <Image source={Images.mastercard} />
          </View>
        </View>
        <View>
          <TouchableOpacity>
            <Image
              source={Images.rightarrow}
              style={{height: responsiveWidth(4)}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveHeight(2),
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveScreenFontSize(1.8),
          }}>
          Price
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(2),
            fontFamily: FontFamily.Semi_Bold,
          }}>
          $60/ hour * 1 hour
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Semi_Bold,
            }}>
            Total
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Semi_Bold,
            }}>
            $60
          </Text>
        </View>
      </View>
      <Button text="Confirm" containerstyles={{marginHorizontal:responsiveScreenWidth(6), marginTop:responsiveHeight(17)}} />
    </WrapperContainer>
  );
};

export default ReviewBooking;

const styles = StyleSheet.create({});
