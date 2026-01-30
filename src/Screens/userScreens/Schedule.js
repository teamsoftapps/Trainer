import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Calendar} from 'react-native-calendars';
import {FontFamily, Images} from '../../utils/Images';
import Button from '../../Components/Button';
import {
  availableTimes,
  generateDatesToMark,
  TimeSlots,
} from '../../utils/Dummy';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Schedule = ({route}) => {
  const {Data} = route.params || {};
  console.log('--------', Data);
  const [selected, setSelected] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingTime, setbookingTime] = useState([]);
  const {Bookings} = useSelector(state => state?.bookings);
  console.log('Redux Trainer Booking', Bookings);
  const navigation = useNavigation();
  const datesToMark = generateDatesToMark();
  const newMarkedDates = {};

  useEffect(() => {
    if (Bookings) {
      const timeArray = Bookings?.map(item => item?.bookingTime);
      setbookingTime(timeArray);
    }
  }, [Bookings]);
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          padding: responsiveHeight(1),
          paddingHorizontal: responsiveWidth(3),
          borderRadius: responsiveWidth(5),
          marginHorizontal: responsiveWidth(2),
          borderWidth: 1,
          backgroundColor: bookingTime?.includes(item)
            ? '#000'
            : !bookingTime?.includes(item) && selectedTime === item
              ? '#9FED3A'
              : '#000',
          borderColor: bookingTime?.includes(item)
            ? '#d7d7d7'
            : !bookingTime?.includes(item) && selectedTime === item
              ? '#9FED3A'
              : '#9FED3A',

          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          setSelectedTime(item);
          console.log('SELECTED TIME', item);
        }}
        disabled={bookingTime?.includes(item) && true}>
        <Text
          style={{
            color: bookingTime?.includes(item)
              ? '#d7d7d7'
              : !bookingTime?.includes(item) && selectedTime === item
                ? '#000'
                : '#9FED3A',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Extra_Bold,
          }}>
          {item}
        </Text>
        {/* <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Semi_Bold,
          }}>
          {bookingTime?.includes(item) ? 'Booked' : 'Available'}
        </Text> */}
      </TouchableOpacity>
    );
  };

  datesToMark?.forEach(date => {
    newMarkedDates[date] = {marked: true, dotColor: '#9FED3A'};
  });

  if (selected) {
    newMarkedDates[selected] = {...newMarkedDates[selected], selected: true};
  }

  const handleDayPress = day => {
    if (newMarkedDates[day.dateString]) {
      setSelected(day.dateString);
    }
  };
  // console.log('Dataaaaaaaaaaaaaa////////////////', {
  //   Date: selected,
  //   time: selectedTime,
  //   rate: Data,
  // });
  return (
    <WrapperContainer>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={{
            color: 'grey',
            fontSize: responsiveFontSize(2.3),
            marginLeft: responsiveWidth(7),
            marginTop: responsiveHeight(2),
          }}>
          Cancel
        </Text>
      </TouchableOpacity>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={newMarkedDates}
        enableSwipeMonths={true}
        style={{
          backgroundColor: '#181818',
          color: 'white',
          height: responsiveHeight(45),
        }}
        theme={{
          backgroundColor: '#181818',
          calendarBackground: '#181818',
          textSectionTitleColor: 'white',
          selectedDayBackgroundColor: '#9FED3A',
          selectedDayTextColor: 'black',
          dayTextColor: 'white',
          textDisabledColor: 'grey',
          monthTextColor: 'white',
          textMonthFontWeight: 'bold',
          todayTextColor: 'white',
          arrowColor: 'white',
          'stylesheet.calendar.header': {
            dayTextAtIndex0: {
              color: '#9FED3A',
            },
            dayTextAtIndex6: {
              color: '#9FED3A',
            },
          },
        }}
      />
      <Text
        style={{
          color: 'white',
          fontSize: responsiveFontSize(2.3),
          fontFamily: FontFamily.Bold,
          marginLeft: responsiveWidth(6),
          marginTop: responsiveHeight(2),
        }}>
        Available Time
      </Text>
      <View style={{marginTop: responsiveHeight(1.5)}}>
        <FlatList
          style={{marginHorizontal: responsiveWidth(4)}}
          data={Data?.Availiblity}
          renderItem={renderItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
      <View
        style={{
          marginHorizontal: responsiveWidth(6),
          marginTop: responsiveHeight(2),
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(2.3),
            fontFamily: FontFamily.Bold,
          }}>
          Reminder
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: 'grey',
            paddingBottom: responsiveHeight(1),
            marginTop: responsiveHeight(2),
            gap: responsiveWidth(3),
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
              Select alert
            </Text>
            <Text style={{color: 'grey'}}>30 minutes before</Text>
          </View>
          <Image source={Images.rightarrow} />
        </View>
        <Button
          disabled={selectedTime && selected ? false : true}
          text="Next"
          containerstyles={{
            marginTop: responsiveHeight(14),
            marginLeft: responsiveWidth(5),
            backgroundColor: selectedTime && selected ? '#9FED3A' : '#181818',
            borderWidth: 1,
            borderColor: '#9FED3A',
          }}
          onPress={() =>
            navigation.navigate('ReviewBooking', {
              Data: {
                Date: selected,
                time: selectedTime,
                rate: Data?.Hourlyrate,
                data: Data,
              },
            })
          }
          textstyle={{
            fontSize: responsiveFontSize(2.3),
            fontFamily: FontFamily.Medium,
            color: selectedTime && selected ? 'black' : 'white',
          }}
        />
      </View>
    </WrapperContainer>
  );
};

export default Schedule;

const styles = StyleSheet.create({});
