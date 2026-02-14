import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatDate} from '../../utils/Dummy';
import {useSelector} from 'react-redux';

const ReviewBooking = ({route}) => {
  const {Data, selectedCard: passedCard} = route.params || {};
  const navigation = useNavigation();
  const authData = useSelector(state => state.Auth.data);

  const trainer = Data?.trainer;
  const formattedDate = formatDate(Data?.Date);
  const rate = parseInt(Data?.rate);
  const total = rate;

  const [weeklyReminder, setWeeklyReminder] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Thursday');
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(passedCard || null);

  const isFormValid = selectedCard && selectedDay && Data?.Date && Data?.time;

  // 🔥 Listen when coming back from PaymentCards
  useFocusEffect(
    useCallback(() => {
      if (route.params?.selectedCard) {
        setSelectedCard(route.params.selectedCard);
      }
    }, [route.params?.selectedCard]),
  );

  const daysList = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <WrapperContainer>
      <Header onPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review Booking</Text>

        {/* Date & Time */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.section}>
          <View>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{formattedDate}</Text>
            <Text style={styles.subValue}>{Data?.time}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Trainer */}
        <View style={styles.section}>
          <View>
            <Text style={styles.label}>Trainer</Text>
            <Text style={styles.value}>{trainer?.fullName}</Text>
            <Text style={styles.subValue}>
              {trainer?.Speciality?.[0]?.value || 'Certified Personal Trainer'}
            </Text>
          </View>

          <Image source={{uri: trainer?.profileImage}} style={styles.avatar} />
        </View>

        {/* Address */}
        <View style={styles.section}>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{trainer?.Address}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate('PaymentCards', {
              selectedCard: selectedCard,
            })
          }>
          <View>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>
              {selectedCard
                ? `**** **** **** ${selectedCard.card.last4}`
                : 'Select Card'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.label}>Price</Text>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceMain}>${rate}</Text>
              <Text style={styles.priceSub}>${rate}/</Text>
            </View>
            <Text style={styles.priceRight}>${rate}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${total}</Text>
          </View>
        </View>

        {/* Weekly Reminder */}
        <TouchableOpacity
          style={styles.reminderRow}
          onPress={() => setWeeklyReminder(!weeklyReminder)}>
          <View style={styles.checkbox}>
            {weeklyReminder && (
              <Icon name="checkmark" size={16} color="black" />
            )}
          </View>
          <Text style={styles.value}>Remind me every week</Text>
        </TouchableOpacity>

        {/* Day Selector */}
        <TouchableOpacity
          style={styles.dayRow}
          onPress={() => setDayModalVisible(true)}>
          <Text style={styles.value}>Day</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.value}>{selectedDay}</Text>
            <Icon name="chevron-down" size={18} color="#888" />
          </View>
        </TouchableOpacity>

        <View style={{height: responsiveHeight(12)}} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: isFormValid ? '#9FED3A' : '#2A2A2A',
            },
          ]}
          disabled={!isFormValid}
          onPress={() => {
            if (!isFormValid) return;
            console.log('Booking Confirmed');
          }}>
          <Text
            style={[
              styles.confirmText,
              {color: isFormValid ? 'black' : '#777'},
            ]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      {/* Day Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={dayModalVisible}
        onRequestClose={() => setDayModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDayModalVisible(false)}>
          <View style={styles.modalContainer}>
            {daysList.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDay(day);
                  setDayModalVisible(false);
                }}>
                <Text
                  style={[
                    styles.modalText,
                    selectedDay === day && {color: '#9FED3A'},
                  ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </WrapperContainer>
  );
};

export default ReviewBooking;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
  },

  section: {
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 0.5,
    borderBottomColor: '#2A2A2A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 4,
  },

  value: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },

  subValue: {
    color: '#C7C7CC',
    fontSize: responsiveFontSize(1.8),
  },

  avatar: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(10),
  },

  priceContainer: {
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(2),
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: responsiveHeight(1),
  },

  priceMain: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },

  priceSub: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.6),
  },

  priceRight: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(2),
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },

  totalText: {
    color: 'white',
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },

  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(3),
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#9FED3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3),
  },

  dayRow: {
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: responsiveHeight(2),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
  },

  confirmButton: {
    paddingVertical: responsiveHeight(2.2),
    borderRadius: 40,
    alignItems: 'center',
  },

  confirmText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(4),
  },

  modalItem: {
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#2A2A2A',
  },

  modalText: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
  },
});
