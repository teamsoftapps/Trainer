import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Calendar} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const goalsList = [
  'Body Composition',
  'Enhanced Athletic Performance',
  'Event Preparation',
  'General Fitness',
  'Healthy Aging',
  'Improved Endurance',
  'Mind-Body Connection',
  'Muscle Gain',
  'Posture Correction',
  'Rehabilitation',
  'Sport-Specific Training',
  'Stress Relief',
  'Weight Loss',
];

const sessionTypes = ['Online', 'Physical', 'Hybrid'];

const Schedule = ({route}) => {
  const {Data} = route.params || {};
  console.log('Data in schedule screen:', Data);
  const navigation = useNavigation();
  const {Bookings} = useSelector(state => state?.bookings);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState('30 min');

  const reminderOptions = [
    '5 Minutes',
    '10 Minutes',
    '15 Minutes',
    '30 Minutes',
  ];

  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    if (Bookings) {
      const times = Bookings?.map(item => item?.bookingTime);
      setBookedTimes(times);
    }
  }, [Bookings]);

  const toggleGoal = goal => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const renderChip = (item, selected, onPress, disabled = false) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: disabled ? '#000' : selected ? '#9FED3A' : '#000',
          borderColor: '#9FED3A',
        },
      ]}>
      <Text
        style={[
          styles.chipText,
          {
            color: disabled ? '#666' : selected ? '#000' : '#9FED3A',
          },
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <WrapperContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cancel */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        {/* Calendar */}
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#9FED3A',
            },
          }}
          theme={{
            backgroundColor: '#181818',
            calendarBackground: '#181818',
            textSectionTitleColor: 'white',
            selectedDayBackgroundColor: '#9FED3A',
            selectedDayTextColor: 'black',
            dayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
          }}
        />

        {/* Available Time */}
        <Text style={styles.sectionTitle}>Available Time</Text>

        <FlatList
          horizontal
          data={Data?.Availiblity}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: responsiveWidth(4)}}
          renderItem={({item}) =>
            renderChip(
              item,
              selectedTime === item,
              () => setSelectedTime(item),
              bookedTimes.includes(item),
            )
          }
        />

        {/* Reminder */}
        <Text style={styles.sectionTitle}>Reminder</Text>

        <TouchableOpacity
          style={styles.reminderRow}
          onPress={() => setAlertModalVisible(true)}>
          <Text style={styles.reminderText}>Select Alert</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'grey'}}>{selectedAlert}</Text>
          </View>
        </TouchableOpacity>

        {/* Training Time */}
        <Text style={styles.sectionTitle}>Training Time</Text>
        <View style={styles.trainingRow}>
          <Text style={{color: 'white'}}>${Data?.Hourlyrate}/hour</Text>
          <View style={styles.dropdown}>
            <Text style={{color: 'white'}}>1 hr</Text>
          </View>
        </View>

        {/* Goals */}
        <Text style={styles.sectionTitle}>Select your goal</Text>
        <View style={styles.wrapContainer}>
          {goalsList.map(goal =>
            renderChip(goal, selectedGoals.includes(goal), () =>
              toggleGoal(goal),
            ),
          )}
        </View>

        {/* Session Type */}
        <Text style={styles.sectionTitle}>Session Type</Text>
        <View style={styles.wrapContainer}>
          {sessionTypes.map(type =>
            renderChip(type, selectedSession === type, () =>
              setSelectedSession(type),
            ),
          )}
        </View>

        {/* Bottom Space */}
        <View style={{height: responsiveHeight(10)}} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <TouchableOpacity
        disabled={!selectedDate || !selectedTime}
        onPress={() =>
          navigation.navigate('ReviewBooking', {
            Data: {
              Date: selectedDate,
              time: selectedTime,
              rate: Data?.Hourlyrate,
              goals: selectedGoals,
              sessionType: selectedSession,
              trainer: Data,
            },
          })
        }
        style={[
          styles.nextBtn,
          {
            backgroundColor: selectedDate && selectedTime ? '#9FED3A' : '#222',
          },
        ]}>
        <Text
          style={{
            color: selectedDate && selectedTime ? '#000' : '#fff',
            fontSize: responsiveFontSize(2.2),
          }}>
          Next
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => setAlertModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAlertModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Reminder Time</Text>

            {reminderOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedAlert(item);
                  setAlertModalVisible(false);
                }}>
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setAlertModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </WrapperContainer>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },

  modalTitle: {
    textAlign: 'center',
    color: '#A4A4A4',
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(2),
  },

  modalOption: {
    paddingVertical: responsiveHeight(2),
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    alignItems: 'center',
  },

  modalOptionText: {
    color: 'white',
    fontSize: responsiveFontSize(2.3),
  },

  cancelBtn: {
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },

  cancelText: {
    color: 'red',
    fontSize: responsiveFontSize(2.3),
  },

  cancel: {
    color: 'grey',
    fontSize: responsiveFontSize(2.2),
    marginLeft: responsiveWidth(6),
    marginTop: responsiveHeight(2),
  },
  sectionTitle: {
    color: 'white',
    fontSize: responsiveFontSize(2.4),
    marginTop: responsiveHeight(3),
    marginLeft: responsiveWidth(6),
    fontWeight: '600',
  },
  chip: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(8),
    borderWidth: 1,
    margin: responsiveWidth(1.5),
  },
  chipText: {
    fontSize: responsiveFontSize(1.8),
  },
  reminderRow: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: responsiveHeight(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
  trainingRow: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#333',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(6),
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  nextBtn: {
    position: 'absolute',
    bottom: responsiveHeight(2),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(10),
    alignItems: 'center',
  },
});
