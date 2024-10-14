import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {LineChart} from 'react-native-chart-kit';
const CompletedTrainerHome = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [0, 1, 2, 3, 4],
        color: (opacity = 1) => `rgba(159, 237, 58, ${opacity})`, // Line color
        strokeWidth: 4, //
      },
    ],
  };
  const trainer_data = useSelector(state => state.Auth.data);
  const navigation = useNavigation();

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
  const RenderedBookings = ({item, index}) => {
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
          }}>
          <View>
            <Image source={item.userImage} />
          </View>
          <View style={{marginLeft: responsiveWidth(3)}}>
            <Text style={{color: '#fff'}}>{item.userName}</Text>
            <Text style={{color: '#fff'}}>{item.userDate}</Text>
            <Text style={{color: '#bbbbbb'}}>{item.selectedTime}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <WrapperContainer>
      <ScrollView>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveWidth(5),
            }}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image source={Images.notification} style={styles.notifiaction} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Chat');
              }}>
              <Image source={Images.messages} style={styles.notifiaction} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cont_1}>
          <Text style={styles.Welcome_Text}>
            Hello{' '}
            <Text
              style={[
                {...styles.Welcome_Text},
                {color: '#fff', fontWeight: '500'},
              ]}>
              {trainer_data?.data.fullName}
            </Text>
          </Text>
          <Text style={{color: '#bbbbbb'}}>10 November, Tuesday</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(7),
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2),
              fontWeight: '500',
            }}>
            Upcoming Sessions
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#9FED3A'}}>See all</Text>
            <Image
              source={Images.rightarrow}
              style={{
                tintColor: '#9FED3A',
                marginLeft: responsiveWidth(1),
                height: responsiveHeight(1.3),
                width: responsiveWidth(1.8),
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: responsiveWidth(7)}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={Bookings}
            renderItem={RenderedBookings}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(7),
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2),
              fontWeight: '500',
            }}>
            Total Earnings
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#9FED3A'}}>See details</Text>
            <Image
              source={Images.rightarrow}
              style={{
                tintColor: '#9FED3A',
                marginLeft: responsiveWidth(1),
                height: responsiveHeight(1.3),
                width: responsiveWidth(1.8),
              }}
            />
          </TouchableOpacity>
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
  slogan: {
    color: '#BBBBBB',
    fontSize: responsiveFontSize(1.7),
    marginVertical: responsiveHeight(0.5),
  },
  cont_2: {
    width: responsiveWidth(30),
    marginHorizontal: responsiveWidth(7),
    marginVertical: responsiveHeight(2),
  },
  trainerImage: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    borderWidth: responsiveWidth(0.5),
    position: 'absolute',
    left: responsiveWidth(1.2),
    top: responsiveHeight(0.6),
  },
  Text_Sec: {
    width: responsiveWidth(85),
    position: 'relative',
    backgroundColor: 'rgba(187, 187, 187, 0.1)',
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(3),
    paddingRight: responsiveWidth(10),
    paddingVertical: responsiveHeight(1.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2.5),
  },
  userImage: {
    height: responsiveWidth(14),
    width: responsiveWidth(14),
  },
  child_2: {
    marginHorizontal: responsiveWidth(2),
  },
  cont_3: {
    marginHorizontal: responsiveWidth(7),
    marginVertical: responsiveHeight(7),
  },
  main_child_2: {
    marginLeft: responsiveWidth(3),
  },
});
