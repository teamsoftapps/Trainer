import {
  Image,
  ImageBackground,
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
import { useNavigation } from '@react-navigation/native';

const TrainerProfile = ({route}) => {
  const [readmore, setreadmore] = useState(false);
  const navigation=useNavigation()
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
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                  <Image source={Images.back} tintColor={'white'} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={Images.fav_heart} tintColor={'white'} />
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
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      backgroundColor: 'white',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>Follow +</Text>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: responsiveHeight(1.5),
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 13,
                    width: '40%',
                    borderRadius: 7,
                  }}>
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
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 13,
                    width: '40%',
                    borderRadius: 7,
                  }}>
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
        <View style={{paddingHorizontal: responsiveWidth(7)}}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2.2),
              fontFamily: FontFamily.Bold,
            }}>
            Specialities
          </Text>
          <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
            {' '}
            • Strength Training
          </Text>
          <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
            {' '}
            • Weight Loss
          </Text>
          <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
            {' '}
            • High-Intensity Interval Training (HIIT)
          </Text>
          <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
            {' '}
            • Functional Fitness
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: responsiveWidth(7),
            marginTop: responsiveHeight(1),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2.2),
              fontFamily: FontFamily.Bold,
            }}>
            Description
          </Text>

          <Text
            numberOfLines={readmore ? 4 : 13}
            style={{color: 'white', fontSize: responsiveFontSize(2)}}>
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
        <View
          style={{
            paddingHorizontal: responsiveWidth(7),
            marginTop: responsiveHeight(1),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2.2),
              fontFamily: FontFamily.Bold,
            }}>
            Location
          </Text>

          <Text
            numberOfLines={readmore ? 4 : 13}
            style={{color: 'white', fontSize: responsiveFontSize(2)}}>
            43 Bourke Street, Newbridge NSW 837 raffles place, Boat Band M83
          </Text>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
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
