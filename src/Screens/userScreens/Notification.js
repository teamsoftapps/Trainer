import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../../utils/Images';
import {useNavigation} from '@react-navigation/native';
const Notifications = [
  {
    id: 1,
    heading: 'Booking Request Pending',
    desc: 'Your request to book a session with Alex Morgan is pending approval',
    bottom: 'View Booking',
    bottom2: 'Mark as done',
    timeago: '15 mins ago',
  },
  {
    id: 2,
    heading: 'Booking Confirmed',
    desc: 'Your sessio with Samantha has been confirmed for June 5 at 8:00 AM',
    bottom: 'View Details',
    bottom2: 'Mark as done',
    timeago: '3 hours ago',
  },
  {
    id: 3,
    heading: 'Message from Jordan Lee',
    desc: 'Hi! Looking forward to our session tomorrow. Do you have any specific goals for me?',
    bottom: 'Reply',
    timeago: 'Yesterday',
  },
  {
    id: 4,
    heading: 'Payment Successful',
    desc: 'Your payment of $70 to Ryan Mitchell was succefull',
    bottom: 'View Recipt',
    timeago: 'Yesterday',
  },
  {
    id: 5,
    heading: 'Payment Successful',
    desc: 'Your payment of $70 to Ryan Mitchell was succefull',
    bottom: 'View Recipt',
    timeago: 'Yesterday',
  },
];
const Notification = () => {
  const navigation = useNavigation();
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        rightView={
          <Image
            source={Images.logo}
            style={{height: responsiveHeight(5), width: responsiveWidth(10)}}
          />
        }
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '85%',
          alignSelf: 'center',
          marginBottom: responsiveHeight(2),
        }}>
        <Text style={{color: 'white', fontSize: responsiveFontSize(3.3)}}>
          Notification
        </Text>
        <Image source={Images.filter} />
      </View>
      <FlatList
        data={Notifications}
        renderItem={({item}) => {
          return (
            <View style={{backgroundColor: '#232323'}}>
              <View
                style={{
                  width: '85%',
                  alignSelf: 'center',
                  gap: responsiveHeight(2),
                  paddingVertical: responsiveHeight(3),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: responsiveFontSize(2)}}>
                    {item.heading}
                  </Text>
                  <Text
                    style={{
                      color: '#B8B8B8',
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    {item.timeago}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  style={{color: '#B8B8B8', width: '80%'}}>
                  {item.desc}
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: responsiveScreenWidth(3),
                  }}>
                  <Text style={{color: '#9BE639'}}>{item.bottom}</Text>
                  {item.bottom2 ? (
                    <>
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 50,
                          backgroundColor: '#9BE639',
                        }}
                      />
                      <Text style={{color: '#9BE639'}}>{item.bottom2}</Text>
                    </>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    </WrapperContainer>
  );
};
export default Notification;
const styles = StyleSheet.create({});
