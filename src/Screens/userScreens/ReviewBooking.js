import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import Button from '../../Components/Button';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchPaymentSheetparams, formatDate} from '../../utils/Dummy';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import useToast from '../../Hooks/Toast';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector} from 'react-redux';
import BookingConfirmed from './BookingConfirmed';
import {set} from 'date-fns';
import ButtonComp from '../../Components/ButtonComp';

const ReviewBooking = ({route}) => {
  const {Data} = route.params;
  console.log('Dataaa//////////////////////////88888888888', Data);
  const [openModal, setModal] = useState(false);
  const {showToast} = useToast();
  const [stripeId, setStripeId] = useState('');
  const [hours, setHours] = useState('1');
  const [totalAmount, setTotalAmount] = useState();
  const [trainerRatePerHour, settrainerRatePerHour] = useState(
    Data?.rate.replace('$', '')
  );
  const [loading, setloading] = useState(false);
  const authData = useSelector(state => state.Auth.data);
  const navigation = useNavigation();
  console.log('object', trainerRatePerHour);
  useEffect(() => {
    const isValidHours = !(
      hours.includes(',') ||
      hours.includes('.') ||
      hours.includes('-') ||
      hours == ''
    );
    const parsedHours = isValidHours ? parseInt(hours) : 0;
    setTotalAmount(trainerRatePerHour * parsedHours);
  }, [trainerRatePerHour, hours]);

  useEffect(() => {
    fetchData();
  }, [authData.token, stripeId]);

  const fetchData = async () => {
    try {
      const profileResponse = await axiosBaseURL.get(
        `/common/GetProfile/${authData.token}`
      );
      setStripeId(profileResponse.data.data.stripeCustomerID);
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response?.data?.message || error.message
      );
    }
  };

  // const initializePaymentsheet = async () => {
  //   if (!stripeId) return;

  //   try {
  //     const {ephemeralKey, paymentIntent} = await fetchPaymentSheetparams(
  //       stripeId,
  //       totalAmount
  //     );

  //     const {error} = await initPaymentSheet({
  //       customerId: stripeId,
  //       customerEphemeralKeySecret: ephemeralKey,
  //       paymentIntentClientSecret: paymentIntent,
  //       merchantDisplayName: "Stern's GYM",
  //       allowsDelayedPaymentMethods: true,
  //       allowsRemovalOfLastSavedPaymentMethod: true,
  //     });

  //     if (error) {
  //       console.error('Error initializing payment sheet:', error.message);
  //     } else {
  //       console.log('Payment sheet initialized successfully');
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Error during payment sheet initialization:',
  //       error.message
  //     );
  //   }
  // };
  // const FormatedDate = formatDate(Data?.Date);
  // const ConfirmBooking = async () => {
  //   setloading(true);
  //   await initializePaymentsheet();
  //   setloading(false);
  //   const {error} = await presentPaymentSheet();
  //   if (error) {
  //     showToast('Try later', error.message, 'danger');
  //   } else {
  //     await axiosBaseURL.post('/user/CreateBooking', {
  //       token: authData.token,
  //       Amount: totalAmount,
  //       bookingTime: Data?.time,
  //       Date: FormatedDate,
  //       Reminder: '30 mins',
  //       profileImage: Data.data.profileImage,
  //       trainerId: Data?.data._id,
  //       trainerName: Data?.data?.fullName,
  //       Address: Data?.data?.Address,
  //       userName: authData?.fullName,
  //     });

  //     // navigation.navigate('Booking');
  //     setModal(true);
  //     showToast('Payment Succesfull', 'Booking successfull!', 'success');
  //   }
  // };

  const initializePaymentSheet = async () => {
    if (!stripeId) return;

    try {
      const {ephemeralKey, paymentIntent} = await fetchPaymentSheetparams(
        stripeId,
        totalAmount
      );
      console.log('PAyment Intent', paymentIntent);
      const {error} = await initPaymentSheet({
        customerId: stripeId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Stern's GYM",
        allowsDelayedPaymentMethods: true,
        // allowsRemovalOfLastSavedPaymentMethod: true,
      });

      if (error) {
        console.error('Error initializing payment sheet:', error.message);
        throw new Error(error.message);
      }

      console.log('Payment sheet initialized successfully');
    } catch (error) {
      console.error(
        'Error during payment sheet initialization:',
        error.message
      );
      throw new Error(error.message);
    }
  };

  const formattedDate = formatDate(Data?.Date);

  const confirmBooking = async () => {
    setloading(true); // Set loading state to true

    try {
      await initializePaymentSheet();
      const {error} = await presentPaymentSheet();

      if (error) {
        showToast('Try later', error.message, 'danger');
      } else {
        // API call to create the booking after successful payment
        const response = await axiosBaseURL.post('/user/CreateBooking', {
          token: authData.token,
          Amount: totalAmount,
          bookingTime: Data?.time,
          Date: formattedDate,
          Reminder: '30 mins',
          profileImage: Data.data.profileImage,
          trainerId: Data?.data._id,
          trainerName: Data?.data?.fullName,
          Address: Data?.data?.Address,
          userName: authData?.fullName,
        });

        // Check response status
        if (response.status === 200) {
          setModal(true);
          showToast('Payment Successful', 'Booking successful!', 'success');
          // Uncomment to navigate
          // navigation.navigate('Booking');
        } else {
          showToast('Error', 'Failed to create booking', 'danger');
        }
      }
    } catch (error) {
      console.log('Error confirming booking:', error);
      showToast('Error', error.message, 'danger');
    } finally {
      setloading(false); // Ensure loading state is reset
    }
  };

  return (
    <WrapperContainer>
      <Header
        onPress={() => navigation.goBack()}
        style={{height: responsiveHeight(7)}}
      />
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
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginHorizontal: responsiveScreenWidth(8),
          marginVertical: responsiveHeight(2),
          paddingBottom: responsiveHeight(2),
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
            {formattedDate}
          </Text>
          <Text style={{color: 'white', fontSize: responsiveScreenFontSize(2)}}>
            {Data?.time}
          </Text>
        </View>
        <View>
          <Image
            source={Images.rightarrow}
            style={{height: responsiveWidth(4)}}
          />
        </View>
      </Pressable>
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
            {Data?.data.fullName}
          </Text>
          <Text style={{color: 'white', fontSize: responsiveScreenFontSize(2)}}>
            {Data?.data.Speciality?.[0]?.value || 'N/A'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveScreenWidth(3),
          }}>
          <Image
            source={{uri: Data?.data.profileImage}}
            style={{
              width: responsiveScreenWidth(16),
              height: responsiveScreenWidth(16),
              borderRadius: responsiveScreenWidth(10),
            }}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(8),
          marginTop: responsiveHeight(2),
        }}>
        <Text
          style={{
            color: '#A4A4A4',
            fontSize: responsiveScreenFontSize(2),
          }}>
          Price
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsiveHeight(2),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Semi_Bold,
            }}>
            {/* $60/ hour * */}
            {trainerRatePerHour}
            {'/ hour * '}
          </Text>
          <TextInput
            maxLength={2}
            editable={false}
            keyboardType="number-pad"
            style={{
              paddingVertical: 0,
              color: 'white',
              height: responsiveHeight(5),
              width: responsiveWidth(10),
              fontSize: responsiveFontSize(2),
            }}
            value={hours}
            onChangeText={setHours}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: responsiveHeight(1),
            borderTopColor: '#686868',
            borderTopWidth: 0.5,
          }}>
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
            {totalAmount}
            {'$'}
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          // onRequestClose={() => {
          //   setModal(false);
          // }}
        >
          <WrapperContainer>
            <ScrollView>
              <View
                style={{
                  paddingHorizontal: responsiveScreenWidth(6),
                  alignItems: 'center',
                  gap: responsiveScreenHeight(2),
                  marginTop: responsiveScreenHeight(5),
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
                  Thank you for choosing our service and trusting our trainer to
                  help you achieve your health goals.
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
                      // width: '100%',
                      gap: responsiveScreenHeight(1),
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: Data?.data?.profileImage}}
                      style={{
                        width: responsiveScreenWidth(20),
                        height: responsiveHeight(20),
                        resizeMode: 'contain',
                        borderRadius: responsiveWidth(20),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: FontFamily.Extra_Bold,
                        fontSize: responsiveScreenFontSize(2.7),
                        color: 'black',
                      }}>
                      {Data?.data?.fullName}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveScreenFontSize(2),
                      }}>
                      {Data?.data?.Speciality?.[0]?.value || 'Not available'}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '70%',
                      gap: responsiveScreenHeight(1),
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveScreenFontSize(2),
                      }}>
                      Date & Time
                    </Text>
                    <Text
                      style={{
                        fontFamily: FontFamily.Extra_Bold,
                        fontSize: responsiveScreenFontSize(2.4),
                        color: 'black',
                      }}>
                      {Data?.Date}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveScreenFontSize(2),
                      }}>
                      {Data?.time}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '70%',
                      gap: responsiveScreenHeight(1),
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveScreenFontSize(2),
                      }}>
                      Address
                    </Text>
                    <Text
                      style={{
                        fontFamily: FontFamily.Extra_Bold,
                        fontSize: responsiveScreenFontSize(2.4),
                        color: 'black',
                      }}>
                      {Data?.data?.Address.length > 15
                        ? Data?.data?.Address.slice(0, 10) +
                          '...' +
                          Data?.data?.Address.split(',')[1].trim()
                        : Data?.data?.Address}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveScreenFontSize(2),
                      }}>
                      0.31 mi away
                    </Text>
                  </View>
                </View>
                <ButtonComp
                  mainStyle={{
                    width: '100%',
                    marginBottom: responsiveScreenWidth(5),
                  }}
                  text="Check Details"
                  onPress={() => {
                    setModal(false);
                    navigation.navigate('BookingDetails', {data: Data});
                  }}
                />
              </View>
            </ScrollView>
          </WrapperContainer>
        </Modal>
      </View>
      <View style={{alignItems: 'center'}}>
        <Button
          isloading={loading}
          text="Confirm"
          onPress={() => {
            confirmBooking();
          }}
          containerstyles={{
            marginTop: responsiveHeight(32),
          }}
        />
      </View>
    </WrapperContainer>
  );
};

export default ReviewBooking;

const styles = StyleSheet.create({});
