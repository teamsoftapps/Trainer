import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/Wrapper';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {LineChart} from 'react-native-chart-kit';
import {Image} from 'react-native';
import {ScrollView} from 'react-native';
import {Images} from '../../utils/Images';

const chartDataMap = {
  0: [20, 40, 60, 80, 40, 90, 120], // week
  1: [200, 300, 500, 800, 600, 900, 1200], // month
  2: [1000, 2000, 1500, 4000, 3000, 5000, 6500], // year
};

const Bookings = [
  {
    id: '1',
    userImage: require('../../assets/Images/Mask2.png'),
    userName: 'Nicole Foster',
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (1Hour)',
  },
  {
    id: '2',
    userImage: require('../../assets/Images/Mask2.png'),
    userName: 'Nicole Foster',
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (2Hour)',
  },
  {
    id: '3',
    userImage: require('../../assets/Images/Mask2.png'),
    userName: 'Nicole Foster',
    speatiality: 'Strength Training',
    userDate: '10 November, Tuesday',
    selectedTime: '8:00 AM (3Hour)',
  },
];
const Earnings = () => {
  const [timing, setTiming] = useState(1);
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
      <TouchableOpacity
        onPress={() => setTiming(index)}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 30,
          marginRight: 10,
          backgroundColor: isSelected ? '#9FED3A' : '#1b1b1b',
        }}>
        <Text
          style={{
            color: isSelected ? '#000' : '#bbb',
            fontWeight: '600',
          }}>
          {item.feild}
        </Text>
      </TouchableOpacity>
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
          rightView={
            <Image
              source={Images.logo}
              style={{height: responsiveHeight(5), width: responsiveWidth(10)}}
            />
          }
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
        {/* <View
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
        </View> */}
        <View
          style={{
            width: responsiveWidth(88),
            backgroundColor: '#151515',
            alignSelf: 'center',
            borderRadius: 20,
            paddingVertical: 20,
            marginTop: 10,
          }}>
          {/* HEADER */}
          <View style={{paddingHorizontal: 20}}>
            <Text style={{color: '#9FED3A', fontSize: 14}}>Total Earning</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text style={{color: '#fff', fontSize: 28, fontWeight: '700'}}>
                $5,392
              </Text>

              <Text style={{color: '#9FED3A', marginLeft: 10}}>▲ 2.4%</Text>
            </View>
          </View>

          {/* GRAPH */}
          <LineChart
            data={{
              labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
              datasets: [
                {
                  data: chartDataMap[timing],
                  strokeWidth: 3,
                  color: () => '#9FED3A',
                },
              ],
            }}
            width={responsiveWidth(88)}
            height={responsiveHeight(30)}
            withDots={false}
            withShadow={false}
            withVerticalLines={false}
            withOuterLines={false}
            withInnerLines
            fromZero
            bezier
            chartConfig={{
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              decimalPlaces: 0,
              color: () => '#9FED3A',
              labelColor: () => '#777',
              propsForBackgroundLines: {
                stroke: 'rgba(255,255,255,0.1)',
              },
            }}
            style={{
              marginTop: 10,
              borderRadius: 16,
            }}
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
