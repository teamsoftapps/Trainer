import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../utils/Images';
import Button from '../Components/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchPaymentSheetparams, formatDate } from '../utils/Dummy';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import useToast from '../Hooks/Toast';
import axiosBaseURL from '../utils/AxiosBaseURL';
import { useSelector } from 'react-redux';

const ReviewBooking = ({ route }) => {
  const [CardDetails, setCardDetails] = useState([]);
  const { showToast } = useToast();
  const [stripeId, setStripeId] = useState('');
  const [hours, setHours] = useState("1");
  const [totalAmount, setTotalAmount] = useState();
  const { Data } = route.params;
  const [trainerRatePerHour, settrainerRatePerHour] = useState(Data.rate.replace("$", ""));
  const authData = useSelector(state => state.Auth.data);
  const navigation = useNavigation();

  useEffect(() => {
    const isValidHours = !(hours.includes(",") || hours.includes(".") || hours.includes("-") || hours == "");
    const parsedHours = isValidHours ? parseInt(hours) : 0;
    setTotalAmount(trainerRatePerHour * parsedHours);
  }, [trainerRatePerHour, hours]);


  useEffect(() => {
    fetchData();
  }, [authData.isToken, stripeId]);

  const fetchData = async () => {
    try {
      const profileResponse = await axiosBaseURL.get(
        `/common/GetProfile/${authData.isToken}`
      );
      setStripeId(profileResponse.data.data.stripeCustomerID);
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response?.data?.message || error.message
      );
    }
  };

  const initializePaymentsheet = async () => {
    if (!stripeId) return;

    try {
      const { ephemeralKey, paymentIntent } = await fetchPaymentSheetparams(
        stripeId,
        totalAmount
      );

      const { error } = await initPaymentSheet({
        customerId: stripeId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Stern's GYM",
        allowsDelayedPaymentMethods: true,
        allowsRemovalOfLastSavedPaymentMethod: true,
      });

      if (error) {
        console.error('Error initializing payment sheet:', error.message);
      } else {
        console.log('Payment sheet initialized successfully');
      }
    } catch (error) {
      console.error(
        'Error during payment sheet initialization:',
        error.message
      );
    }
  };

  const ConfirmBooking = async () => {
    await initializePaymentsheet();
    const { error } = await presentPaymentSheet();
    if (error) {
      showToast('Try later', error.message, 'danger');
    } else {

      navigation.navigate('BookingSuccessfull', { Data: { ...Data } });
    }
  };

  // Dependency array
  // useEffect(() => {
  //   axiosBaseURL
  //     .post('/Common/GetCardDetail', {
  //       token: authData.isToken,
  //     })
  //     .then(response => {
  //       setCardDetails(response.data.data);
  //     })
  //     .catch(error => {});
  //   axiosBaseURL
  //     .get(`/common/GetProfile/${authData.isToken}`)
  //     .then(response => {
  //       console.log('User found', response.data.data);

  //       setStriprId(response.data.data.stripeCustomerID);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error.response.data.message);
  //     });
  //   initializepaymentsheet();
  // }, []);
  // useFocusEffect(
  //   useCallback(() => {
  //     axiosBaseURL
  //       .post('/Common/GetCardDetail', {
  //         token: authData.isToken,
  //       })
  //       .then(response => {
  //         setCardDetails(response.data.data);
  //       })
  //       .catch(error => {});
  //     axiosBaseURL
  //       .get(`/common/GetProfile/${authData.isToken}`)
  //       .then(response => {
  //         console.log('User found', response.data.data);

  //         setStriprId(response.data.data.stripeCustomerID);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching data:', error.response.data.message);
  //       });
  //   }, [])
  // );

  // const initializepaymentsheet = async () => {
  //   // const customerID = ;
  //   const {ephemeralKey, paymentIntent} = await fetchPaymentSheetparams(
  //     stripeId
  //   );
  //   const {error} = await initPaymentSheet({
  //     customerId: stripeId,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: paymentIntent,
  //     merchantDisplayName: "Stern's GYM",
  //     allowsDelayedPaymentMethods: true,
  //     allowsRemovalOfLastSavedPaymentMethod: true,
  //   });
  // };

  const FormatedDate = formatDate(Data?.Date);
  console.log("Value of Totoal Amount", totalAmount)
  return (
    <WrapperContainer>
      <Header
        onPress={() => navigation.goBack()}
        style={{ height: responsiveHeight(7) }}
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
            style={{ color: '#A4A4A4', fontSize: responsiveScreenFontSize(2) }}>
            Date & Time
          </Text>
          <Text
            style={{ color: 'white', fontSize: responsiveScreenFontSize(2.4) }}>
            {FormatedDate}
          </Text>
          <Text style={{ color: 'white', fontSize: responsiveScreenFontSize(2) }}>
            {Data?.time}
          </Text>
        </View>
        <View>
          <Image
            source={Images.rightarrow}
            style={{ height: responsiveWidth(4) }}
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
            style={{ color: '#A4A4A4', fontSize: responsiveScreenFontSize(2) }}>
            Trainer
          </Text>
          <Text
            style={{ color: 'white', fontSize: responsiveScreenFontSize(2.4) }}>
            Alex Morgan
          </Text>
          <Text style={{ color: 'white', fontSize: responsiveScreenFontSize(2) }}>
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
            editable={true}
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
            {/* {totalAmount === NaN ? "ok" : "n"} */}
            {totalAmount}
            {'$'}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Button
          text="Confirm"
          onPress={() => {
            ConfirmBooking();
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
