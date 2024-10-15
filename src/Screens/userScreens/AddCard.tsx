import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import MaskInput, {Masks} from 'react-native-mask-input';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../../utils/Images';
import Button from '../../Components/Button';
import {useNavigation} from '@react-navigation/native';
import SubscriptionModal from '../../Components/SubscriptionModal';
import {useSelector} from 'react-redux';
import PaymentModal from '../../Components/PaymentModal';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';
import {
  usePaymentSheet,
  presentPaymentSheet,
  initPaymentSheet,
} from '@stripe/stripe-react-native';
var creditCardType = require('credit-card-type');

const AddCard = () => {
  const authData = useSelector(state => state.Auth.data);
  const [expirationDate, setExpirationDate] = useState('');
  const [CardHoldername, setCardHoldername] = useState('');
  const [CardNumber, setCardNumber] = useState('');
  const [CVV, setCVV] = useState('');
  const [checkbox, setcheckbox] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CVVformik, setCVVformik] = useState(false);
  const [Expformik, setExpformik] = useState(false);
  const [Cardformik, setCardformik] = useState(false);
  const [Nameformik, setNameformik] = useState(false);

  const handleExpirationDateChange = (masked, unmasked) => {
    const month = unmasked.slice(0, 2);
    const year = unmasked.slice(2);
    if (month <= '12' && month >= '') {
      setExpirationDate(unmasked);
    }
  };
  // to get card type i.e Visa or mastercard
  var visaCards = creditCardType(CardNumber);
  if (visaCards[0]?.type != undefined || visaCards[0]?.type != null) {
    console.log(visaCards[0].type);
  }
  // Formik Confitions
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = currentDate.getFullYear().toString();
  const expiryMonth = expirationDate.slice(0, 2);
  const expiryYear = expirationDate.slice(2);
  const condition1 = expirationDate != '';
  const condition6 =
    expiryYear > currentYear ||
    (expiryYear === currentYear && expiryMonth > currentMonth) ||
    (expiryYear === currentYear && expiryMonth === currentMonth);
  const condition2 = CardHoldername != '';
  const condition3 =
    CardNumber != '' &&
    (visaCards[0]?.type != undefined || visaCards[0]?.type != null);
  const condition4 = CVV != '';

  useEffect(() => {
    initializepaymentsheet();
  }, []);

  const fetchPaymentSheetparams = async () => {
    const response = await axiosBaseURL.post('/Common/InitializeStripe');
    const {customer, ephemeralKey, paymentIntent} = await response.data.data;
    console.log('step 1 done');
    return {
      customer,
      ephemeralKey,
      paymentIntent,
    };
  };

  const initializepaymentsheet = async () => {
    const {customer, ephemeralKey, paymentIntent} =
      await fetchPaymentSheetparams();
    console.log(customer, 'step 2 done');
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Stern's GYM",
      allowsDelayedPaymentMethods: true,
      allowsRemovalOfLastSavedPaymentMethod: true,
    });
  };
  // Main function
  const AddCard = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      console.log('maa chud gai');
    } else {
      console.log('oh yehhh');
    }
    // if (condition1 && condition2 && condition3 && condition4 && condition6) {
    //   setCVVformik(false);
    //   setCardformik(false);
    //   setExpformik(false);
    //   setNameformik(false);
    //   setModalVisible(true);
    //   axiosBaseURL
    //     .post('/Common/AddCardDetail', {
    //       token: authData,
    //       CardholderName: CardHoldername,
    //       CardNumber: CardNumber,
    //       CVV: CVV,
    //       ExpDate: expirationDate,
    //       CardType: visaCards[0].type
    //     })
    //     .then(response => {
    //       showMessage({
    //         message: 'Details enter successfully',
    //         type: 'success',
    //       });
    //     })
    //     .catch(error => {
    //       showMessage({
    //         message: 'Incorrect Email',
    //         description: "Please enter correct email",
    //         type: 'danger',
    //       });
    //     });

    // } else {
    //   if (!condition4) setCVVformik(true);
    //   if (!condition3) setCardformik(true);
    //   if (!condition2) setNameformik(true);
    //   if (!condition1 || !condition6) setExpformik(true);
    //   if (condition4) setCVVformik(false);
    //   if (condition3) setCardformik(false);
    //   if (condition2) setNameformik(false);
    //   if (condition1 && condition6) setExpformik(false);

    // }
  };

  const navigation = useNavigation();
  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text
        style={{
          fontSize: responsiveFontSize(3.5),
          color: 'white',
          marginLeft: responsiveWidth(8),
          marginTop: responsiveHeight(-1),
        }}>
        Add Card
      </Text>
      <View style={{marginHorizontal: responsiveWidth(8)}}>
        <View
          style={{
            flexDirection: 'row',
            gap: responsiveWidth(3),
            alignItems: 'center',
            marginTop: responsiveHeight(2),
            borderBottomWidth: 0.9,
            borderColor: 'white',
            paddingBottom: responsiveHeight(2),
          }}>
          <Image
            source={Images.Cardwhite}
            resizeMode="contain"
            style={{width: responsiveWidth(10)}}
          />
          <Text style={{color: 'white', fontSize: responsiveFontSize(2.3)}}>
            Credit or Debit Card
          </Text>
        </View>
        <View>
          <Text
            style={{
              marginVertical: responsiveHeight(2),
              fontSize: responsiveFontSize(2),
              color: 'white',
            }}>
            Cardholder Name
          </Text>
          <TextInput
            value={CardHoldername}
            onChangeText={setCardHoldername}
            style={{
              fontSize: responsiveFontSize(2),
              color: 'white',
              borderWidth: 0.7,
              borderColor: Nameformik ? 'red' : 'white',
              borderRadius: 7,
              paddingLeft: responsiveWidth(5),
            }}
          />
          <Text
            style={{
              marginVertical: responsiveHeight(2),
              fontSize: responsiveFontSize(2),
              color: 'white',
            }}>
            Card Number
          </Text>
          <MaskInput
            style={{
              fontSize: responsiveFontSize(2),
              color: 'white',
              borderWidth: 0.7,
              borderColor: Cardformik ? 'red' : 'white',
              borderRadius: 7,
              paddingLeft: responsiveWidth(5),
            }}
            keyboardType="numeric"
            placeholderTextColor="#888"
            obfuscationCharacter="*"
            showObfuscatedValue
            value={CardNumber}
            onChangeText={setCardNumber}
            mask={Masks.CREDIT_CARD}
          />
          <View style={{flexDirection: 'row', gap: responsiveWidth(4)}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  marginVertical: responsiveHeight(2),
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                }}>
                CVV
              </Text>
              <MaskInput
                style={{
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                  borderWidth: 0.7,
                  borderColor: CVVformik ? 'red' : 'white',
                  borderRadius: 7,
                  paddingLeft: responsiveWidth(5),
                }}
                value={CVV}
                onChangeText={(masked, unmasked) => setCVV(unmasked)}
                mask={[/\d/, /\d/, /\d/, /\d?/]}
                placeholder="CVV"
                secureTextEntry={true}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  marginVertical: responsiveHeight(2),
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                }}>
                Expiration Date
              </Text>
              <MaskInput
                value={expirationDate}
                onChangeText={handleExpirationDateChange}
                mask={[/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                placeholder="MM/YYYY"
                keyboardType="numeric"
                placeholderTextColor="#888"
                style={{
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                  borderWidth: 0.7,
                  borderColor: Expformik ? 'red' : 'white',
                  borderRadius: 7,
                  paddingLeft: responsiveWidth(5),
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveWidth(5),
              marginTop: responsiveHeight(2),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setcheckbox(!checkbox);
              }}>
              <Image
                source={
                  checkbox ? Images.Checkboxgreen : Images.Blank_Checkboxgreen
                }
                style={{width: responsiveWidth(5), height: responsiveWidth(5)}}
              />
            </TouchableOpacity>
            <Text style={{fontSize: responsiveFontSize(1.8), color: 'grey'}}>
              Remember this card
            </Text>
          </View>
        </View>
        <Button
          onPress={() => {
            AddCard();
          }}
          containerstyles={{
            marginLeft: responsiveWidth(4),
            marginTop: responsiveHeight(22),
          }}
          text="Add Payment Method"
        />
      </View>
      <PaymentModal
        modalstate={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </WrapperContainer>
  );
};

export default AddCard;

const styles = StyleSheet.create({});
