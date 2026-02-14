import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native';

const AddCard = () => {
  const navigation = useNavigation();
  const {confirmSetupIntent} = useStripe();
  const authData = useSelector(state => state.Auth.data);

  const [name, setName] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddCard = async () => {
    if (!cardComplete || !name) return;

    try {
      setLoading(true);

      const response = await axiosBaseURL.post(
        '/common/InitializeSetupIntent',
        {customerID: authData?.stripeCustomerID},
      );

      const clientSecret = response.data.data.setupIntents;

      const {error} = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {name},
        },
      });

      if (!error) {
        navigation.goBack();
      } else {
        console.log(error.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer>
      <Header onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Add Card</Text>
      <Text style={styles.subtitle}>Credit or Debit Card</Text>

      <View style={styles.container}>
        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Steve Erickson"
          placeholderTextColor="#666"
          style={styles.input}
        />

        <Text style={styles.label}>Card Details</Text>

        <View style={styles.cardContainer}>
          <CardField
            postalCodeEnabled={false}
            onCardChange={card => setCardComplete(card.complete)}
            style={{height: 50}}
            cardStyle={{
              backgroundColor: '#0F0F0F',
              textColor: '#FFF',
              placeholderColor: '#666',
            }}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {opacity: cardComplete && name && !loading ? 1 : 0.6},
          ]}
          disabled={!cardComplete || !name || loading}
          onPress={handleAddCard}>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text style={styles.buttonText}>Add Payment Method</Text>
          )}
        </TouchableOpacity>
      </View>
    </WrapperContainer>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(2),
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(1),
  },
  container: {
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(4),
  },
  label: {
    color: 'white',
    fontSize: responsiveFontSize(1.9),
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(2),
  },
  input: {
    backgroundColor: '#0F0F0F',
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    color: 'white',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardContainer: {
    backgroundColor: '#0F0F0F',
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#9FED3A',
    marginTop: responsiveHeight(6),
    paddingVertical: responsiveHeight(2.2),
    borderRadius: 35,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
  },
});
