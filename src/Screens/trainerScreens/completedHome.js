import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import React from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {LineChart} from 'react-native-chart-kit';
import {Images} from '../../utils/Images';

const CompletedTrainerHome = () => {
  const navigation = useNavigation();
  const trainer_data = useSelector(state => state.Auth.data);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [0, 1, 2, 3, 4],
        color: (opacity = 1) => `rgba(159, 237, 58, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const Bookings = [
    {
      id: '1',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM (1Hour)',
    },
    {
      id: '2',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM (2Hour)',
    },
    {
      id: '3',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM (3Hour)',
    },
  ];

  const RenderedBookings = ({item}) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'rgba(187, 187, 187, 0.1)',
        flexDirection: 'row',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(2),
        borderRadius: responsiveWidth(3),
        marginRight: responsiveWidth(2),
      }}>
      <Image source={item.userImage} />

      <View style={{marginLeft: responsiveWidth(3)}}>
        <Text style={{color: '#fff'}}>{item.userName}</Text>
        <Text style={{color: '#fff'}}>{item.userDate}</Text>
        <Text style={{color: '#bbbbbb'}}>{item.selectedTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <WrapperContainer>
      <ScrollView>
        {/* Header */}
        <View
          style={{
            height: responsiveHeight(8),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(7),
          }}>
          <Image
            source={Images.logo}
            style={{
              width: responsiveWidth(12),
              height: responsiveHeight(12),
              resizeMode: 'contain',
            }}
          />

          <View style={{flexDirection: 'row', gap: responsiveWidth(5)}}>
            <TouchableOpacity>
              <Image source={Images.notification} style={styles.notifiaction} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
              <Image source={Images.messages} style={styles.notifiaction} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.cont_1}>
          <Text style={styles.Welcome_Text}>
            Hello{' '}
            <Text style={{color: '#fff', fontWeight: '500'}}>
              {trainer_data?.data.fullName}
            </Text>
          </Text>
        </View>

        {/* Bookings */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Bookings}
          keyExtractor={item => item.id}
          renderItem={RenderedBookings}
          style={{paddingHorizontal: responsiveWidth(7)}}
        />

        {/* Chart */}
        <LineChart
          data={data}
          width={responsiveWidth(85)}
          height={responsiveHeight(30)}
          chartConfig={{
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(159, 237, 58, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
        />
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompletedTrainerHome;

const styles = StyleSheet.create({
  notifiaction: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
  cont_1: {
    paddingHorizontal: responsiveWidth(7),
  },
  Welcome_Text: {
    fontSize: responsiveFontSize(3.5),
    color: '#D1D1D1',
    fontWeight: '300',
  },
});
