import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Header from '../Components/Header';
import WrapperContainer from '../Components/Wrapper';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {LineChart} from 'react-native-chart-kit';
import {Image} from 'react-native';
import {ScrollView} from 'react-native';
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
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (1Hour)',
  },
  {
    id: '2',
    userImage: require('../assets/Images/Mask2.png'),
    userName: 'Nicole Foster',
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (2Hour)',
  },
  {
    id: '3',
    userImage: require('../assets/Images/Mask2.png'),
    userName: 'Nicole Foster',
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (3Hour)',
  },
];
const Earnings = () => {
  const [timing, setTiming] = useState(null);
  const navigation = useNavigation();
  const categories = [
    {
      feild: 'Weekly',
    },
    {
      feild: 'Monthly',
    },
    {
      feild: 'Yearly',
    },
  ];

  const timings = ({item, index}) => {
    const isSelected = timing === index;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setTiming(index);
          }}
          style={{
            borderColor: '#bbbbbb',
            borderWidth: responsiveWidth(0.3),
            width: responsiveWidth(20),
            paddingVertical: responsiveHeight(0.5),
            borderRadius: responsiveWidth(4),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsiveWidth(2),
            backgroundColor: isSelected ? '#9FED3A' : 'transparent',
          }}>
          <Text style={{color: isSelected ? '#000' : '#bbbbbb'}}>
            {item.feild}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Transactions = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(187, 187, 187, 0.1)',
            flexDirection: 'row',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveHeight(2),
            borderRadius: responsiveWidth(3),
            marginRight: responsiveWidth(2),
            marginBottom: responsiveHeight(1.5),
          }}>
          <View>
            <Image source={item.userImage} />
          </View>
          <View style={{marginLeft: responsiveWidth(3)}}>
            <Text style={{color: '#fff'}}>{item.userName}</Text>
            <Text style={{color: '#fff'}}>{item.userDate}</Text>
            <Text style={{color: '#bbbbbb'}}>{item.selectedTime}</Text>
          </View>
          <View
            style={{
              paddingLeft: responsiveWidth(6),
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                paddingHorizontal: responsiveWidth(2),
                paddingVertical: responsiveHeight(0.5),
                borderRadius: responsiveWidth(2),
                backgroundColor: '#9FED3A',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#000', fontWeight: '500'}}>Paid</Text>
            </View>
            <Text style={{color: '#9FED3A', fontSize: responsiveFontSize(2.5)}}>
              $60.00
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(3.5),
            fontWeight: '500',
            paddingHorizontal: responsiveWidth(8),
          }}>
          Earnings
        </Text>
        <View
          style={{
            paddingHorizontal: responsiveWidth(8),
            marginVertical: responsiveHeight(2),
          }}>
          <FlatList horizontal data={categories} renderItem={timings} />
        </View>
        <View
          style={{
            height: responsiveHeight(45),
            width: responsiveWidth(85),
            backgroundColor: 'rgba(187, 187, 187, 0.1)',
            alignSelf: 'center',

            borderRadius: responsiveWidth(3),
          }}>
          <Text
            style={{
              color: '#9FED3A',
              paddingHorizontal: responsiveWidth(6),
              paddingTop: responsiveHeight(3),
            }}>
            Total Earning
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              marginTop: responsiveHeight(1),
              paddingLeft: responsiveWidth(6),
              paddingTop: responsiveHeight(0.5),
              paddingBottom: responsiveHeight(2),
            }}>
            $5,392
          </Text>
          <LineChart
            data={data}
            width={responsiveWidth(85)}
            height={responsiveHeight(30)}
            yAxisLabel="k"
            chartConfig={{
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(159, 237, 58, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                fill: '#9FED3A',
                stroke: '#fff',
              },
            }}
            bezier
          />
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            fontWeight: '500',
            paddingHorizontal: responsiveWidth(8),
            marginVertical: responsiveHeight(2),
          }}>
          Transactions
        </Text>
        <View
          style={{
            width: responsiveWidth(85),
            alignSelf: 'center',
          }}>
          <FlatList data={Bookings} renderItem={Transactions} />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Earnings;

const styles = StyleSheet.create({});
