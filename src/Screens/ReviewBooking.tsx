import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { fetchPaymentSheetparams, formatDate } from '../utils/Dummy';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

const ReviewBooking = ({ route }) => {
  const [Hourly, setHourly] = useState('1');
  const [CardDetails, setCardDetails] = useState([])

  const { Data, Card } = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    initializepaymentsheet()
  }, [])



  const initializepaymentsheet = async () => {
    const { customer, ephemeralKey, paymentIntent } = await fetchPaymentSheetparams()
    console.log(customer, "step 2 done")
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Stern's GYM",
      allowsDelayedPaymentMethods: true,
      allowsRemovalOfLastSavedPaymentMethod: true
    })
  }

  const ConfirmBooking = async () => {
    const { error } = await presentPaymentSheet()
    if (error) {
      console.log("maa chud gai")
    } else {
      navigation.navigate("BookingSuccessfull", { Data: { ...Data } })
    }
  }




  const FormatedDate = formatDate(Data?.Date)
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
        onPress={() => { navigation.goBack() }}
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: responsiveHeight(2) }}>

          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Semi_Bold,
            }}>
            $60/ hour  *
          </Text>
          <TextInput
            keyboardType="numeric"
            style={{ paddingVertical: 0, color: 'white', width: responsiveWidth(5), fontSize: responsiveFontSize(2) }}
            value={Hourly}
            onChangeText={setHourly}
          />
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', paddingTop: responsiveHeight(1), borderTopColor: '#686868',
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
            $60
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>

        <Button
          text="Confirm"
          onPress={() => { ConfirmBooking() }}
          containerstyles={{
            marginTop: responsiveHeight(32),
          }}
        />
      </View>
    </WrapperContainer >
  );
};

export default ReviewBooking;

const styles = StyleSheet.create({});
