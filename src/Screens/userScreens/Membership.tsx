import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import Button from '../../Components/Button';
import PaymentModal from '../../Components/PaymentModal';
import SubscriptionModal from '../../Components/SubscriptionModal';
import {useNavigation} from '@react-navigation/native';

const Membership = () => {
  const navigation = useNavigation();
  const [check, setcheck] = useState('3');
  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <WrapperContainer>
      <View>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(2.5),
            fontFamily: FontFamily.Bold,
            alignSelf: 'center',
            marginVertical: responsiveScreenHeight(5),
          }}>
          Choose Your Membership Plan
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#9BE639',
          marginHorizontal: responsiveScreenWidth(6),
          padding: responsiveScreenWidth(3),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: responsiveScreenWidth(5),
          borderRadius: 10,
        }}>
        <Image
          source={Images.crown}
          resizeMode="contain"
          style={{width: responsiveWidth(15)}}
        />
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(3),
              color: 'black',
              fontFamily: FontFamily.Extra_Bold,
            }}>
            Join Our Premium
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Semi_Bold,
              fontSize: responsiveFontSize(2),
              color: 'black',
            }}>
            Unlimited Features
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: responsiveScreenWidth(6),
          padding: responsiveScreenWidth(4),
          borderRadius: 10,
          borderWidth: 1.3,
          borderColor: '#9BE639',
          alignItems: 'center',
          marginTop: responsiveScreenHeight(3),
          backgroundColor: check === '1' ? '#9BE639' : '#181818',
        }}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setcheck('1')}>
            <Image
              source={check === '1' ? Images.checkbox : Images.checkboxCircle}
              resizeMode="contain"
              style={{width: responsiveWidth(8)}}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                color: check === '1' ? 'black' : 'white',
                fontFamily: FontFamily.Semi_Bold,
              }}>
              Weekly
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                color: check === '1' ? 'black' : '#B2B2B2',
              }}>
              Pay for 7 days
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: check === '1' ? 'black' : 'white',
            fontSize: responsiveFontSize(2.5),
            fontFamily: FontFamily.Bold,
          }}>
          $9.99
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: responsiveScreenWidth(6),
          padding: responsiveScreenWidth(4),
          borderRadius: 10,
          borderWidth: 1.3,
          borderColor: '#9BE639',
          alignItems: 'center',
          marginTop: responsiveScreenHeight(2),
          backgroundColor: check === '2' ? '#9BE639' : '#181818',
        }}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setcheck('2')}>
            <Image
              source={check === '2' ? Images.checkbox : Images.checkboxCircle}
              resizeMode="contain"
              style={{width: responsiveWidth(8)}}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                color: check === '2' ? 'black' : 'white',
                fontFamily: FontFamily.Semi_Bold,
              }}>
              Weekly
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                color: check === '2' ? 'black' : '#B2B2B2',
              }}>
              Pay for 7 days
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={{
              color: check === '2' ? 'black' : 'white',
              fontSize: responsiveFontSize(2.5),
              fontFamily: FontFamily.Bold,
            }}>
            $29.99
          </Text>
          <Text style={{color: check === '2' ? 'black' : '#9BE639'}}>
            {' '}
            Most Popular
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: responsiveScreenWidth(6),
          padding: responsiveScreenWidth(4),
          borderRadius: 10,
          borderWidth: 1.3,
          borderColor: '#9BE639',
          alignItems: 'center',
          marginTop: responsiveScreenHeight(2),
          backgroundColor: check === '3' ? '#9BE639' : '#181818',
        }}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setcheck('3')}>
            <Image
              source={check === '3' ? Images.checkbox : Images.checkboxCircle}
              resizeMode="contain"
              style={{width: responsiveWidth(8)}}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                color: check === '3' ? 'black' : 'white',
                fontFamily: FontFamily.Semi_Bold,
              }}>
              Yearly
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                color: check === '3' ? 'black' : '#B2B2B2',
              }}>
              $300/year (Save 20%)
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: check === '3' ? 'black' : 'white',
            fontSize: responsiveFontSize(2.5),
            fontFamily: FontFamily.Bold,
          }}>
          $299.99
        </Text>
      </View>
      <Text
        style={{
          color: '#B2B2B2',
          fontSize: responsiveFontSize(2),
          fontFamily: FontFamily.Medium,
          alignSelf: 'center',
          marginVertical: responsiveScreenHeight(3),
        }}>
        No commitment. Cancel anytime.
      </Text>
      <View style={{alignItems: 'center'}}>
        <Button
          onPress={() => navigation.navigate('AddCard')}
          text="Subscribe"
          textstyle={{
            fontSize: responsiveFontSize(2.5),
          }}
        />
      </View>
      <Text
        style={{
          color: '#B2B2B2',
          fontSize: responsiveFontSize(2),
          fontFamily: FontFamily.Medium,
          alignSelf: 'center',
          marginTop: responsiveScreenHeight(3),
        }}>
        By continuing, you agree to our
      </Text>
      <Text
        style={{
          color: '#85C136',
          fontSize: responsiveFontSize(2),
          fontFamily: FontFamily.Medium,
          alignSelf: 'center',
          textDecorationLine: 'underline',
        }}>
        Terms and Conditions
      </Text>
      <SubscriptionModal
        modalstate={modalVisible}
        onRequestClose={handleCloseModal}
      />
    </WrapperContainer>
  );
};

export default Membership;

const styles = StyleSheet.create({});
