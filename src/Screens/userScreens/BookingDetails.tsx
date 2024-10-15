import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';

import {useNavigation} from '@react-navigation/native';

import ButtonComp from '../../Components/ButtonComp';
import WrapperContainer from '../../Components/Wrapper';
import {useCreateChatMutation} from '../../store/Apis/chat';

const BookingDetails = ({route}) => {
  const navigation = useNavigation();
  const [createChat] = useCreateChatMutation();
  const {data} = route.params;
  console.log('ROUTEEEEEEEE', data);

  const onPressMessage = async (item: object) => {
    let payload = {
      userId: data?.UserID,
      type: data?.isType,
    };
    try {
      const res = await createChat(payload);

      if (res?.data.data) {
        navigation.navigate('Messages', {
          name: data?.trainerName,
          profile: data?.profileImage,
          id: res?.data.data._id,
        });
      }
    } catch (error) {
      console.log('Successfull Error', error);
    }
  };

  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          borderBlockColor: 'grey',
          borderBottomWidth: 1,
          paddingBottom: responsiveHeight(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: responsiveWidth(85),
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', gap: responsiveWidth(4)}}>
            <Image
              source={{uri: data.profileImage}}
              style={{
                width: responsiveScreenWidth(20),
                height: responsiveScreenWidth(20),
                borderRadius: 50,
              }}
            />
            <View style={{justifyContent: 'space-evenly'}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: FontFamily.Bold,
                  fontSize: responsiveFontSize(2.6),
                  color: 'white',
                  maxWidth: responsiveWidth(34),
                }}>
                {data.trainerName.length > 8
                  ? data.trainerName.slice(0, 8) + '...'
                  : data.trainerName}
              </Text>
              <View
                style={{
                  ...styles.curve,
                  borderRadius: responsiveScreenWidth(10),
                  backgroundColor:
                    data.status === 'Pending'
                      ? '#B8B8B8'
                      : data.status === 'Confirmed'
                      ? '#9FED3A'
                      : data.status === 'Cancelled'
                      ? '#FF2D55'
                      : 'none',
                }}>
                <Text style={styles.blacktext}>{data.status}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveWidth(3),
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={onPressMessage}>
              <Image
                source={Images.chat_icon}
                style={{
                  width: responsiveWidth(10),
                  height: responsiveWidth(10),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={Images.call_icon}
                style={{
                  width: responsiveWidth(10),
                  height: responsiveWidth(10),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveWidth(6),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Date & Time
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.6)}}>
            {data.Date}
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.3)}}>
            {data.Time}
          </Text>
        </View>
        {/* <View>
          <TouchableOpacity>
            <Image
              source={Images.edit}
              style={{width: responsiveWidth(5), height: responsiveWidth(5)}}
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveWidth(6),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View style={{maxWidth: responsiveWidth(67)}}>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Address
          </Text>
          <Text
            numberOfLines={3}
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.6)}}>
            {data?.Address || 'Not Available'}
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.3)}}>
            0.31 mi away
          </Text>
        </View>
        <View>{/* //Add map here */}</View>
      </View>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveWidth(6),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Price
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.6)}}>
            Total price ${data?.Amount}
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.3)}}>
            for 1hr 0m
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveWidth(6),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: responsiveHeight(13),
        }}>
        <View>
          <Text
            style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
            Reminder
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveScreenFontSize(2.6),
            }}>
            {data.Reminder} before
          </Text>
          <Text
            style={{color: 'white', fontSize: responsiveScreenFontSize(2.3)}}>
            Repeat off
          </Text>
        </View>
      </View>
      <ButtonComp
        text="Cancel"
        mainStyle={{
          backgroundColor: '#BDBDBD',
          marginHorizontal: responsiveWidth(7),
        }}
      />
    </WrapperContainer>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  blacktext: {
    color: 'black',
    fontWeight: '500',
    fontSize: responsiveScreenFontSize(1.8),
  },
  curve: {
    width: responsiveWidth(24),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
