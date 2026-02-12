import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../../utils/Images';
import {useNavigation} from '@react-navigation/native';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useDispatch, useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {socketService} from '../../utils/socketService';
import {SaveLogedInUser} from '../../store/Slices/db_ID';
import notifee from '@notifee/react-native';
const TrainerHome = () => {
  const trainer_data = useSelector(state => state.Auth.data);
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
            response.data.data.profileImage,
          );
          if (response.data.data.Bio === null) {
            Alert.alert('Please complete your profile');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error.response.data.message);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axiosBaseURL.get(
          `/Common/GetProfile/${trainer_data.token}`,
        );
        const userData = profileResponse.data.data;
        dispatch(SaveLogedInUser(userData));
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response?.data?.message || error.message,
        );
      }
    };
    fetchData();
  }, [trainer_data?.token]);

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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Notification');
              }}>
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
              {trainer_data?.fullName}
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
              navigation.navigate('CompleteProfile');
            }}
            style={styles.Text_Sec}>
            <View>
              <Image source={Images.trainer2} style={styles.trainerImage} />
              <AnimatedCircularProgress
                size={60}
                width={3}
                fill={80}
                tintColor="#9FED3A"
                onAnimationComplete={() => console.log('onAnimationComplete')}
              />
            </View>
            <View style={styles.main_child_2}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.percent}>80%</Text>
                <Text
                  style={[
                    {...styles.slogan},
                    {
                      color: '#BBBBBB',
                      marginLeft: responsiveWidth(1),
                      fontSize: responsiveFontSize(2),
                    },
                  ]}>
                  Profile Completion
                </Text>
              </View>
              <Text style={[{...styles.slogan}, {color: '#BBBBBB'}]}>
                Complete your Profile to attract more clients.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <Text style={{color: '#9FED3A', alignSelf: 'flex-end'}}>
                  View Your Profile
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: responsiveWidth(7)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: responsiveHeight(2),
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
              onPress={() => {
                navigation.navigate('Earnings');
              }}
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

          <View
            style={{
              backgroundColor: 'rgba(187, 187, 187, 0.1)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: responsiveWidth(3),
              paddingVertical: responsiveHeight(2),
              borderRadius: responsiveWidth(3),
            }}>
            <View style={{width: responsiveWidth(45)}}>
              <Text
                style={{color: '#9FED3A', fontSize: responsiveFontSize(2.5)}}>
                Earnings
              </Text>
              <Text
                style={{color: '#BBBBBB', fontSize: responsiveFontSize(1.7)}}>
                Earnings will appears here once your first session is complete!
              </Text>
            </View>
            <View>
              <Image source={require('../../assets/Images/dollars.png')} />
            </View>
          </View>
        </View>

        <View style={{paddingHorizontal: responsiveWidth(7)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: responsiveHeight(2),
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
              onPress={() => {
                navigation.navigate('Sessions');
              }}
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

          <View
            style={{
              backgroundColor: 'rgba(187, 187, 187, 0.1)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: responsiveWidth(3),
              paddingVertical: responsiveHeight(2),
              borderRadius: responsiveWidth(3),
            }}>
            <View style={{width: responsiveWidth(43)}}>
              <Text
                style={{color: '#9FED3A', fontSize: responsiveFontSize(2.5)}}>
                Sessions
              </Text>
              <Text
                style={{color: '#BBBBBB', fontSize: responsiveFontSize(1.7)}}>
                When a client books you, your upcoming sessions will show here.
              </Text>
            </View>
            <View>
              <Image source={require('../../assets/Images/dumbell.png')} />
            </View>
          </View>
        </View>
      </ScrollView>
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
