import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
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

const Schedule = ({route}) => {
  const {Data} = route.params;
  console.log('--------', Data);
  const [selected, setSelected] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigation = useNavigation();
  const datesToMark = generateDatesToMark();
  const newMarkedDates = {};
  const renderItem = ({item, index}) => {
    // const date = new Date(item);
    // const time = date?.toLocaleTimeString([], {
    //   hour: '2-digit',
    //   minute: '2-digit',
    // });

    return (
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          paddingHorizontal: 25,
          borderRadius: responsiveWidth(2),
          marginHorizontal: responsiveWidth(2),
          borderWidth: 1,
          backgroundColor: availableTimes.includes(item)
            ? '#9FED3A'
            : '#BBBBBB',
          borderColor: availableTimes.includes(item) ? '#9FED3A' : '#ccc',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          setSelectedTime(item);
          console.log('SELECTED TIME', item);
        }}
        // disabled={true}
      >
        <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Extra_Bold,
          }}>
          {item}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Semi_Bold,
          }}>
          {availableTimes.includes(item) ? 'Available' : 'Booked'}
        </Text>
      </TouchableOpacity>
    );
  };

  datesToMark.forEach(date => {
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
