import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/Wrapper';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { LineChart } from 'react-native-chart-kit';
import { Image } from 'react-native';
import { ScrollView } from 'react-native';
import { Images } from '../../utils/Images';
import { useSelector } from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';

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
  const [timing, setTiming] = useState(1); // 0: Weekly, 1: Monthly, 2: Yearly
  const [earningsData, setEarningsData] = useState(null);
  const trainer_data = useSelector((state) => state.Auth.data);
  const navigation = useNavigation();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axiosBaseURL.get(`/trainer/${trainer_data._id}/earnings`);
      if (res.data.success) {
        setEarningsData(res.data.data);
      }
    } catch (e) {
      console.log("Error fetching earnings details:", e);
    }
  };

  const categories = [
    { field: "Weekly" },
    { field: "Monthly" },
    { field: "Yearly" },
  ];

  const timings = ({ item, index }) => {
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
          {item.field}
        </Text>
      </TouchableOpacity>
    );
  };

  const Transactions = ({ item }) => {
    const user = item.userId;
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}
          style={{
            backgroundColor: 'rgba(187, 187, 187, 0.1)',
            flexDirection: 'row',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveHeight(2),
            borderRadius: responsiveWidth(3),
            marginRight: responsiveWidth(2),
            marginBottom: responsiveHeight(1.5),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{
                uri:
                  item.userId?.profileImage ||
                  'https://i.pravatar.cc/150?img=11',
              }}
              style={{
                height: responsiveWidth(14),
                width: responsiveWidth(14),
                borderRadius: responsiveWidth(7),
              }}
            />
            <View style={{ marginLeft: responsiveWidth(4) }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '500',
                }}>
                {item.userId?.fullName || 'User'}
              </Text>
              <Text style={{ color: '#aaa', fontSize: responsiveFontSize(1.6), marginTop: 2 }}>
                {new Date(item.updatedAt).toLocaleDateString()} • {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#2a2a2a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'center', marginBottom: 2 }}>
              <Text style={{ color: '#9FED3A', fontSize: 10, fontWeight: 'bold' }}>COMPLETED</Text>
            </View>
            <Text style={{ color: '#9FED3A', fontSize: 18, fontWeight: 'bold' }}>
              ${(item.amount / 100).toFixed(2)}
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
              style={{ height: responsiveHeight(5), width: responsiveWidth(10) }}
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
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: '#9FED3A', fontSize: 14 }}>Total Earning</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>
                ${earningsData?.totalEarnings || '0.00'}
              </Text>

              <Text style={{ color: '#9FED3A', marginLeft: 10 }}>▲ 100%</Text>
            </View>
          </View>

          {/* GRAPH */}
          {earningsData && earningsData.filters && (
            <LineChart
              data={{
                labels: (timing === 0 ? earningsData.filters.weekly : timing === 1 ? earningsData.filters.monthly : earningsData.filters.yearly)?.labels || [''],
                datasets: [{
                  data: (timing === 0 ? earningsData.filters.weekly : timing === 1 ? earningsData.filters.monthly : earningsData.filters.yearly)?.data?.length ? (timing === 0 ? earningsData.filters.weekly : timing === 1 ? earningsData.filters.monthly : earningsData.filters.yearly).data : [0]
                }]
              }}
              width={responsiveWidth(88)}
              height={responsiveHeight(30)}
              withDots={true}
              withShadow={true}
              withVerticalLines={false}
              withOuterLines={false}
              withInnerLines
              fromZero
              bezier
              chartConfig={{
                backgroundGradientFrom: '#151515',
                backgroundGradientTo: '#151515',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(159, 237, 58, ${opacity})`,
                labelColor: () => '#777',
                propsForBackgroundLines: {
                  stroke: 'rgba(255,255,255,0.05)',
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              style={{
                marginTop: 10,
                borderRadius: 16,
                paddingRight: 40,
              }}
            />
          )}
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
          <FlatList
            data={earningsData?.recentTransactions || []}
            renderItem={Transactions}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={{ color: '#777', textAlign: 'center', marginTop: 20 }}>No transactions yet.</Text>
            )}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Earnings;

const styles = StyleSheet.create({});
