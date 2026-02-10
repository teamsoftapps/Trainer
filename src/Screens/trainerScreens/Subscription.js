import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useStripe} from '@stripe/stripe-react-native';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector, useDispatch} from 'react-redux';
import {updateLogin} from '../../store/Slices/AuthSlice';
const plans = [
  {
    id: 'weekly',
    title: 'Weekly',
    subtitle: 'pay for 7 days',
    price: '$9.99',
  },
  {
    id: 'monthly',
    title: 'Monthly',
    subtitle: '$30/month',
    price: '$29.99',
    popular: true,
  },
  {
    id: 'yearly',
    title: 'Yearly',
    subtitle: '$300/year (save 20%)',
    price: '$299.00',
  },
];

const prices = {
  weekly: 9.99,
  monthly: 29.99,
  yearly: 299.0,
};

const Subscription = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const authData = useSelector(state => state.Auth.data);
  console.log('Auth data in Subscriptio screen:', authData._id);
  const dispatch = useDispatch();
  const renderPlan = item => {
    const isSelected = selectedPlan === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        onPress={() => setSelectedPlan(item.id)}
        style={[
          styles.card,
          {
            borderColor: isSelected ? '#9FED3A' : '#333',
            backgroundColor: '#000',
          },
        ]}>
        {/* radio */}
        <View
          style={[
            styles.radio,
            {
              borderColor: '#9FED3A',
              backgroundColor: isSelected ? '#9FED3A' : 'transparent',
            },
          ]}
        />

        {/* text */}
        <View style={{flex: 1}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        {/* price */}
        <View>
          <Text style={styles.price}>{item.price}</Text>

          {item.popular && <Text style={styles.popular}>Most Popular</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const initializePaymentSheet = async amount => {
    const res = await axiosBaseURL.post('/common/InitializePaymentIntent', {
      customerID: authData.stripeCustomerID,
      amount,
    });

    const {paymentIntent, ephemeralKey, customer} = res.data.data;

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Trainer App',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      returnURL: 'trainerapp://stripe-redirect',
    });

    if (error) {
      console.log(error);
      return false;
    }

    return true;
  };

  const handleSubscribe = async () => {
    try {
      const amount = prices[selectedPlan];

      const ready = await initializePaymentSheet(amount);
      if (!ready) return;

      const {error} = await presentPaymentSheet();
      if (error) return;

      // ⭐ SAVE SUBSCRIPTION
      const res = await axiosBaseURL.post('/common/activateSubscription', {
        trainerId: authData._id,
        plan: selectedPlan,
        price: prices[selectedPlan],
      });

      console.log('Response:', res.data);

      dispatch(
        updateLogin({
          subscription: {
            plan: selectedPlan,
            price: prices[selectedPlan],
            isActive: true,
          },
        }),
      );

      // ⭐ NAVIGATE
      navigation.replace('TrainerBttomStack');
    } catch (e) {
      console.log('Subscribe Error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Choose Your Membership Plan</Text>

      {/* premium banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Join Our Premium</Text>
        <Text style={[styles.bannerText, {fontWeight: '400'}]}>
          Unlimited Features
        </Text>
      </View>

      {/* plans */}
      <View style={{marginTop: responsiveHeight(3)}}>
        {plans.map(renderPlan)}
      </View>

      {/* bottom */}
      <View style={styles.bottom}>
        <Text style={styles.note}>No commitment. Cancel anytime.</Text>

        <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our
          <Text style={{color: '#9FED3A'}}> Terms and Conditions</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: responsiveWidth(6),
  },

  header: {
    color: '#fff',
    fontSize: responsiveFontSize(2.6),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: responsiveHeight(2),
  },

  banner: {
    backgroundColor: '#9FED3A',
    borderRadius: 14,
    padding: responsiveHeight(2),
    marginTop: responsiveHeight(3),
  },

  bannerText: {
    color: '#000',
    fontWeight: '700',
    fontSize: responsiveFontSize(2.2),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveHeight(2),
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: responsiveHeight(2),
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 16,
  },

  title: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },

  subtitle: {
    color: '#aaa',
    marginTop: 4,
  },

  price: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
  },

  popular: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.6),
    marginTop: 4,
  },

  bottom: {
    marginTop: 'auto',
    paddingBottom: responsiveHeight(4),
  },

  note: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: responsiveHeight(2),
  },

  subscribeBtn: {
    borderWidth: 2,
    borderColor: '#9FED3A',
    borderRadius: 40,
    paddingVertical: responsiveHeight(1.8),
    alignItems: 'center',
  },

  subscribeText: {
    color: '#9FED3A',
    fontWeight: '700',
    fontSize: responsiveFontSize(2.2),
  },

  terms: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: responsiveHeight(2),
  },
});
