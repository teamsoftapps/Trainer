import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
  useResponsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../../utils/Images';
import ButtonComp from '../../Components/ButtonComp';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const BookingConfirmed = ({ route, closeModal = () => { } }) => {
  console.log('Boookinnnggg', route);
  const navigation = useNavigation();

  return (
    <WrapperContainer>
      <ScrollView>
        <View
          style={{
            paddingHorizontal: responsiveScreenWidth(6),
            alignItems: 'center',
            gap: responsiveScreenHeight(2),
            marginTop: responsiveScreenHeight(5),
          }}>
          <LottieView
            source={{ uri: 'https://lottie.host/80461806-6962-4113-912c-097560759f2a/F1yLd0nN0r.json' }}
            autoPlay
            loop={false}
            style={{
              width: responsiveScreenWidth(30),
              height: responsiveScreenWidth(30),
            }}
          />
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(4),
              fontFamily: FontFamily.Bold,
            }}>
            Booking Success!
          </Text>
          <Text
            style={{
              color: '#A4A4A4',
              fontSize: responsiveFontSize(1.8),
              fontFamily: FontFamily.Medium,
              textAlign: 'center',
              paddingHorizontal: responsiveScreenWidth(2),
            }}>
            Your session has been successfully booked. You can now prepare for your journey with our expert trainer.
          </Text>

          {/* Booking Info Card */}
          <View
            style={{
              width: '100%',
              backgroundColor: '#1E1E1E',
              padding: responsiveScreenWidth(5),
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#2A2A2A',
              marginTop: responsiveScreenHeight(1),
            }}>

            {/* Trainer Section */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#2A2A2A',
                paddingBottom: responsiveScreenHeight(2),
                marginBottom: responsiveScreenHeight(2),
              }}>
              <Image
                source={{ uri: route.params?.trainerData?.profileImage || route.params?.trainerId?.profileImage || route.params?.data?.profileImage }}
                style={{
                  width: responsiveScreenWidth(16),
                  height: responsiveScreenWidth(16),
                  borderRadius: 32,
                  borderWidth: 2,
                  borderColor: '#9FED3A',
                }}
              />
              <View style={{ marginLeft: responsiveScreenWidth(4), flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FontFamily.Bold,
                    fontSize: responsiveScreenFontSize(2.2),
                    color: 'white',
                  }}>
                  {route.params?.trainerData?.fullName || route.params?.trainerId?.fullName || route.params?.data?.fullName}
                </Text>
                <Text
                  style={{
                    color: '#9FED3A',
                    fontFamily: FontFamily.Medium,
                    fontSize: responsiveScreenFontSize(1.8),
                    marginTop: 2,
                  }}>
                  {(route.params?.trainerData?.Speciality?.[0]?.value || route.params?.trainerId?.Speciality?.[0]?.value || route.params?.data?.Speciality?.[0]?.value) || 'Professional Trainer'}
                </Text>
              </View>
            </View>

            {/* Info Rows */}
            <View style={{ gap: responsiveScreenHeight(2) }}>
              {/* Date & Time */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#2A2A2A',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: responsiveScreenWidth(4)
                }}>
                  <Icon name="calendar-outline" size={20} color="#9FED3A" />
                </View>
                <View>
                  <Text style={{ color: '#8E8E93', fontSize: responsiveScreenFontSize(1.6), fontFamily: FontFamily.Medium }}>Date & Time</Text>
                  <Text style={{ color: 'white', fontSize: responsiveScreenFontSize(1.9), fontFamily: FontFamily.Semi_Bold, marginTop: 2 }}>
                    {route.params?.Date} • {route.params?.time}
                  </Text>
                </View>
              </View>

              {/* Address */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#2A2A2A',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: responsiveScreenWidth(4)
                }}>
                  <Icon name="location-outline" size={20} color="#9FED3A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#8E8E93', fontSize: responsiveScreenFontSize(1.6), fontFamily: FontFamily.Medium }}>Location</Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: 'white', fontSize: responsiveScreenFontSize(1.9), fontFamily: FontFamily.Semi_Bold, marginTop: 2 }}>
                    {route.params?.trainerData?.Address || route.params?.trainerId?.Address || route.params?.data?.Address}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <ButtonComp
            mainStyle={{
              width: '100%',
              marginTop: responsiveScreenHeight(2),
              backgroundColor: '#9FED3A'
            }}
            textStyle={{ color: 'black', fontFamily: FontFamily.Bold }}
            text="Check Details"
            onPress={() => {
              closeModal();
              navigation.navigate('BookingDetails', { data: route.params });
            }}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default BookingConfirmed;

const styles = StyleSheet.create({});
