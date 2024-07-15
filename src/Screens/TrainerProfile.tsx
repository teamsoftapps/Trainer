import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {FontFamily, Images} from '../utils/Images';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import Button from '../Components/Button';

const TrainerProfile = ({route}) => {
  const [readmore, setreadmore] = useState(true);
  const [follow, setfollow] = useState(false);
  const [heart, setheart] = useState(false);
  const navigation = useNavigation();
  const {data} = route.params;
  console.log(data);
  return (
    <WrapperContainer style={{backgroundColor: 'black'}}>
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          source={Images.ProfileBG}
          style={{width: responsiveWidth(100), height: responsiveHeight(63)}}>
          <StatusBar hidden />
          <SafeAreaView style={{flex: 1}}>
            <LinearGradient
              colors={['transparent', '#000', '#000']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1.4}}
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: responsiveHeight(3),
                  marginTop: responsiveHeight(5),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image source={Images.back} tintColor={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setheart(!follow);
                  }}>
                  <Image
                    source={heart ? Images.heart_filled : Images.fav_heart}
                    tintColor={heart ? '#9FED3A' : 'white'}
                    resizeMode="contain"
                    style={{
                      width: responsiveWidth(8),
                      height: responsiveWidth(8),
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: responsiveHeight(1.3),
                }}>
                <Image
                  source={data.image}
                  style={{
                    width: responsiveWidth(32),
                    borderRadius: 70,
                    height: responsiveWidth(32),
                    borderWidth: 1.4,
                    borderColor: 'white',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{fontSize: responsiveFontSize(3.5), color: 'white'}}>
                  {data.name}
                </Text>

                <Text
                  style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                  Certified Personal trainer
                </Text>
                <View style={{flexDirection: 'row', gap: responsiveWidth(4)}}>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    Strength Training
                  </Text>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    •
                  </Text>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    7 Year Experience
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: responsiveHeight(2),
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      backgroundColor: '#9FED3A',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>Available</Text>
                  </View>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data.rating}
                  </Text>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    Rating
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setfollow(!follow);
                    }}
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      backgroundColor: follow ? '#9FED3A' : 'white',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>
                      {follow ? 'Following' : 'Follow +'}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    92
                  </Text>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    Followers
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      backgroundColor: '#9FED3A',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>Message</Text>
                  </View>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    24
                  </Text>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    Years old
                  </Text>
                </View>
              </View>
              <View style={styles.BoxContainer}>
                <View style={styles.box}>
                  <Text
                    style={{color: '#9FED3A', fontSize: responsiveFontSize(2)}}>
                    Hourly Rate
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: responsiveFontSize(2.2),
                      }}>
                      {data.rate}
                    </Text>
                    <Text style={{color: 'grey'}}> per hour</Text>
                  </View>
                </View>
                <View style={styles.box}>
                  <Text
                    style={{color: '#9FED3A', fontSize: responsiveFontSize(2)}}>
                    Hired
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: responsiveFontSize(2.2),
                      }}>
                      362
                    </Text>
                    <Text style={{color: 'grey'}}> times</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </SafeAreaView>
        </ImageBackground>
        <View style={styles.SpecialitiesContainer}>
          <Text style={styles.heading}>Specialities</Text>
          <Text style={styles.whiteText}> • Strength Training</Text>
          <Text style={styles.whiteText}> • Weight Loss</Text>
          <Text style={styles.whiteText}>
            {' '}
            • High-Intensity Interval Training (HIIT)
          </Text>
          <Text style={styles.whiteText}> • Functional Fitness</Text>
        </View>
        <View style={styles.BioContainer}>
          <Text style={styles.heading}>Description</Text>

          <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
            {' '}
            Hi, I'm Alex, and I've been a gym trainer for over 10 years. My
            passion is helping people like you achieve their fitness goals and
            transform their lives. I specialize in weight training,
            cardiovascular conditioning, flexibility training, and nutritional
            coaching. My approach is holistic, focusing not just on physical
            fitness but also on creating sustainable, healthy habits. I believe
            that fitness is a unique journey for each person, and I'm here to
            provide personalized guidance and support every step of the way.{' '}
            {/* {!readmore && ( */}
            {/* )} */}
          </Text>

          <Text
            onPress={() => {
              setreadmore(!readmore);
              console.log('OK');
            }}
            style={{color: '#9FED3A'}}>
            {readmore ? 'Read more' : 'See less'}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.heading}>Location</Text>

          <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
            43 Bourke Street, Newbridge NSW 837 raffles place, Boat Band M83
          </Text>
        </View>
        <View
          style={{
            marginBottom: responsiveHeight(5),
          }}>
          <Button
            text="Book Now"
            containerstyles={{
              marginLeft: responsiveWidth(6),
            }}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  BoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: responsiveHeight(1.5),
  },
  box: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 13,
    width: '40%',
    borderRadius: 7,
  },
  SpecialitiesContainer: {paddingHorizontal: responsiveWidth(7)},
  BioContainer: {
    paddingHorizontal: responsiveWidth(7),
    marginTop: responsiveHeight(1),
  },
  addressContainer: {
    paddingHorizontal: responsiveWidth(7),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },
  heading: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    fontFamily: FontFamily.Bold,
  },
  whiteText: {color: 'white', fontSize: responsiveFontSize(2)},
  blacktext: {
    color: 'black',
    fontWeight: '500',
    fontSize: responsiveScreenFontSize(1.8),
  },
  curve: {
    width: responsiveWidth(24),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
