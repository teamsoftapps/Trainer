import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import {useNavigation} from '@react-navigation/native';
import axiosBaseURL from '../services/AxiosBaseURL';
import {useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {socketService} from '../utils/socketService';

const TrainerHome = () => {
  const [APIUserData, setAPIUserData] = useState({});
  const trainer_data = useSelector(state => state.Auth.data);
  console.log('Trainer Data', trainer_data);
  const navigation = useNavigation();
  const Bookings = [
    {
      id: '1',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM',
    },
    {
      id: '2',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM',
    },
    {
      id: '3',
      userImage: require('../assets/Images/Mask2.png'),
      userName: 'Nicole Foster',
      userDate: 'Mondat, October 24',
      selectedTime: '8:00 AM',
    },
  ];
  useEffect(() => {
    socketService.initializeSocket();
  }, []);
  useEffect(() => {
    console.log('=----------', trainer_data);
    if (trainer_data.type === 'trainer') {
      axiosBaseURL
        .post('/trainer/GetTrainer', {
          email: trainer_data.res_EMAIL,
        })
        .then(response => {
          console.log(
            '------------------------',
            response.data.data.profileImage
          );
          setAPIUserData(response.data.data);
          if (response.data.data.Bio === null) {
            Alert.alert('Please complete your profile');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error.response.data.message);
        });
    }
  }, []);

  const TrainerAppointments = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(187, 187, 187, 0.1)',
          borderRadius: responsiveWidth(3),
          paddingHorizontal: responsiveWidth(2.5),
          paddingVertical: responsiveHeight(2),
          marginRight: responsiveWidth(3),
        }}>
        <View>
          <Image source={item.userImage} style={styles.userImage} />
        </View>
        <View style={styles.child_2}>
          <Text
            style={[
              {
                ...styles.slogan,
                color: '#fff',
                marginVertical: responsiveHeight(0.3),
              },
            ]}>
            {item.userName}
          </Text>
          <Text
            style={[
              {
                ...styles.slogan,
                color: '#fff',
                marginVertical: responsiveHeight(0.3),
                fontWeight: '300',
              },
            ]}>
            {item.userDate}
          </Text>
          <Text
            style={[
              {
                ...styles.slogan,
                color: '#bbbbbb',
                marginVertical: responsiveHeight(0.3),
                fontWeight: '300',
              },
            ]}>
            {item.selectedTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer>
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
          Welcome{' '}
          <Text
            style={[
              {...styles.Welcome_Text},
              {color: '#fff', fontWeight: '500'},
            ]}>
            {trainer_data?.data.fullName}
          </Text>
        </Text>
        <Text style={styles.slogan}>
          Ready to start your journey with Sterns's Gym?
        </Text>
      </View>
      <View style={styles.cont_2}>
        <Text
          style={[
            {...styles.Welcome_Text},
            {
              fontSize: responsiveFontSize(2),
              fontWeight: '500',
              marginVertical: responsiveHeight(1.5),
            },
          ]}>
          Get Started
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (trainer_data.type === 'trainer') {
              navigation.navigate('CompleteProfile', {data: APIUserData});
            }
          }}
          style={styles.Text_Sec}>
          <Image source={Images.trainer2} style={styles.trainerImage} />
          <AnimatedCircularProgress
            size={80}
            width={5}
            fill={80}
            tintColor="#9FED3A"
            onAnimationComplete={() => console.log('onAnimationComplete')}
          />
          <Text style={styles.percent}>80%</Text>
          <Text style={[{...styles.slogan}, {color: '#BBBBBB'}]}>
            Complete Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cont_3}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={Bookings}
          renderItem={TrainerAppointments}
        />
      </View>
    </WrapperContainer>
  );
};

export default TrainerHome;

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
    height: responsiveWidth(16),
    width: responsiveWidth(16),
    borderRadius: responsiveWidth(6),
    borderWidth: responsiveWidth(0.5),
    position: 'absolute',
    left: responsiveWidth(5),
    top: responsiveHeight(2.4),
  },
  Text_Sec: {
    position: 'relative',
    backgroundColor: 'rgba(187, 187, 187, 0.1)',
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  percent: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(0.8),
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
});
