import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';

import ButtonComp from '../../Components/ButtonComp';
import {useNavigation} from '@react-navigation/native';

const BookingDetails = () => {
  const navigation = useNavigation();
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [status, setStatus] = useState('Pending');
  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(3.5),
            marginHorizontal: responsiveWidth(8),
            marginBottom: responsiveHeight(3),
          }}>
          Review Booking
        </Text>
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
                source={Images.trainer4}
                style={{
                  width: responsiveScreenWidth(18),
                  height: responsiveScreenWidth(18),
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
                  John Doe
                </Text>
                <View
                  style={{
                    ...styles.curve,
                    borderRadius: responsiveScreenWidth(10),
                    backgroundColor:
                      status === 'Confirmed' ? '#9BE639' : '#bbbbbb',
                  }}>
                  <Text style={styles.blacktext}>{status}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveWidth(3),
                alignItems: 'center',
              }}>
              <TouchableOpacity>
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
              Monday, October 24
            </Text>
            <Text
              style={{color: 'white', fontSize: responsiveScreenFontSize(2.3)}}>
              8:00 AM
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
          }}>
          <View style={{maxWidth: responsiveWidth(67)}}>
            <Text
              style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
              User's Goal
            </Text>
            <Text
              numberOfLines={3}
              style={{color: 'white', fontSize: responsiveScreenFontSize(2.6)}}>
              Weight Loss and Muscle Building
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
          }}>
          <View>
            <Text
              style={{color: '#A4A4A4', fontSize: responsiveScreenFontSize(2)}}>
              Earnings
            </Text>
            <Text
              style={{color: 'white', fontSize: responsiveScreenFontSize(2.6)}}>
              $80 (1 Hour)
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: responsiveWidth(85),
            }}>
            <View>
              <Text
                style={{
                  color: '#A4A4A4',
                  fontSize: responsiveScreenFontSize(2),
                }}>
                Reminder
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveScreenFontSize(2.6),
                }}>
                30 minutes before
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveScreenFontSize(2.3),
                }}>
                Repeat off
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{false: '#767577', true: '#18D200'}}
                thumbColor={'#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </View>
        <ButtonComp
          onPress={() => {
            setIsAccept(true);
            setIsEnabled(false);
          }}
          text="Accept"
          mainStyle={{
            backgroundColor: '#9BE639',
            marginHorizontal: responsiveWidth(7),
          }}
        />
        <ButtonComp
          text="Decline"
          textstyle={{color: 'red'}}
          mainStyle={{
            backgroundColor: '#181818',
            marginHorizontal: responsiveWidth(7),
            borderColor: 'red',
            borderWidth: responsiveWidth(0.3),
            marginVertical: responsiveHeight(2),
          }}
        />
        {isAccept && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isAccept}
            onRequestClose={() => {
              setIsAccept(!isAccept);
            }}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Image source={Images.checkbox} />
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '700',
                    fontSize: responsiveFontSize(2),
                    marginVertical: responsiveHeight(2),
                  }}>
                  Session Confirmed!
                </Text>
                <Text style={{color: '#000', textAlign: 'center'}}>
                  You've successfully accepted the session invite.Get ready to
                  train with John Doe on October 15th, 2024, at 10:00 AM
                </Text>
                <ButtonComp
                  onPress={() => {
                    setStatus('Confirmed');
                    setIsAccept(false);
                  }}
                  mainStyle={{
                    width: responsiveWidth(70),
                    height: responsiveHeight(5),
                    backgroundColor: '#000',
                    marginTop: responsiveHeight(2),
                  }}
                  textstyle={{color: '#fff', fontWeight: 'lighter'}}
                  text="View Booking Details"
                />
                <ButtonComp
                  onPress={() => {
                    navigation.navigate('TrainerHome');
                  }}
                  mainStyle={{
                    width: responsiveWidth(70),
                    height: responsiveHeight(5),
                    backgroundColor: '#fff',
                    marginTop: responsiveHeight(2),
                  }}
                  textstyle={{color: '#000', fontWeight: 'lighter'}}
                  text="Back to Home"
                />
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(80),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(3),
    backgroundColor: '#9BE639',
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
