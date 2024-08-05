import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import MaskInput, {Masks} from 'react-native-mask-input';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import Button from '../Components/Button';
import {useNavigation} from '@react-navigation/native';
import SubscriptionModal from '../Components/SubscriptionModal';
import {useDispatch} from 'react-redux';
var creditCardType = require('credit-card-type');

const AddCard = () => {
  const [expirationDate, setExpirationDate] = React.useState('');
  const [CardHoldername, setCardHoldername] = React.useState('');
  const [CardNumber, setCardNumber] = React.useState('');
  const [CVV, setCVV] = React.useState('');
  const [checkbox, setcheckbox] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const dispatch = useDispatch();
  const handleExpirationDateChange = (masked, unmasked) => {
    const month = unmasked.slice(0, 2);
    const year = unmasked.slice(2);
    if (month <= '12' && month >= '') {
      setExpirationDate(unmasked);
    }
  };
  var visaCards = creditCardType(CardNumber);
  if (visaCards[0]?.type != undefined || visaCards[0]?.type != null) {
    console.log(visaCards[0].type); // 'visa'
  }
  // const navigation = useNavigation();
  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          // navigation.goBack();
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
              borderColor: 'white',
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
              borderColor: 'white',
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
                  borderColor: 'white',
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
                  borderColor: 'white',
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
            setModalVisible(true);
          }}
          containerstyles={{
            marginLeft: responsiveWidth(4),
            marginTop: responsiveHeight(22),
          }}
          text="Add Payment Method"
        />
      </View>
      <SubscriptionModal
        modalstate={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </WrapperContainer>
  );
};

export default AddCard;

const styles = StyleSheet.create({});
