import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../Components/Wrapper';
import {FontFamily, Images} from '../utils/Images';
import {TrainerProfile, UserImages} from '../utils/Dummy';
import {AirbnbRating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withClamp,
} from 'react-native-reanimated';

const Home = () => {
  const [modal, setmodal] = useState(Number);
  const [usersData, setusersData] = useState(TrainerProfile);

  const screenWidth = Dimensions.get('screen').width;

  // Define responsiveScreenWidth as a worklet function
  const workletResponsiveScreenWidth = () => {
    'worklet';
    return (value: any) => (value / 375) * screenWidth; // Adjust 375 based on your base design width
  };

  const Follow = (userID: number) => {
    const updateUser = usersData.map(item => {
      if (userID === item.id) {
        return {
          ...item,
          isFollow: true,
        };
      }
      return item;
    });
    setusersData(updateUser);
  };

  const unFollow = (userID: number) => {
    const updatedUser = usersData.map(item => {
      if (userID === item.id) {
        return {
          ...item,
          isFollow: false,
        };
      }
      return item;
    });
    setusersData(updatedUser);
  };

  const animation = useSharedValue(0);

  const animatedstyle = useAnimatedStyle(() => {
    const width = interpolate(
      animation.value,
      [0, 1],
      [workletResponsiveScreenWidth()(110), workletResponsiveScreenWidth()(130)]
    );
    return {
      width,
    };
  });
  return (
    <WrapperContainer>
      <View
        style={{
          height: responsiveHeight(8),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: responsiveWidth(5),
          paddingRight: responsiveWidth(7),
        }}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={Images.notification} style={styles.notifiaction} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={Images.messages} style={styles.notifiaction} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: responsiveHeight(23),
            borderBottomWidth: responsiveHeight(0.03),
            borderTopWidth: responsiveHeight(0.05),
            borderColor: '#fff',
            gap: responsiveHeight(2.5),
            justifyContent: 'center',
          }}>
          <Text style={styles.trainer}>Stories from trainers</Text>

          <View>
            <FlatList
              style={{paddingLeft: responsiveWidth(4)}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={UserImages}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      marginHorizontal: responsiveWidth(4),
                      width: responsiveWidth(14),
                      gap: responsiveHeight(0.5),
                    }}>
                    <View style={styles.imageView}>
                      <Image source={item.image} style={styles.storyImage} />
                    </View>
                    <Text style={styles.trainername} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        <View>
          <Text style={styles.popular}>Popular Personal Trainers</Text>

          <View>
            <FlatList
              scrollEnabled={false}
              data={usersData}
              renderItem={({item, index}) => {
                return (
                  <ImageBackground
                    imageStyle={{borderRadius: responsiveWidth(1.5)}}
                    source={item.ProfileImage}
                    style={styles.Trainer}>
                    <Pressable
                      onPress={() => {
                        !item.isFollow ? Follow(item.id) : unFollow(item.id);
                        setmodal(item.id);

                        if (!item.isFollow) {
                          Follow(item.id);
                          animation.value = withSpring(1); // Animate to expanded state
                        } else {
                          unFollow(item.id);
                          animation.value = withSpring(0); // Animate to collapsed state
                        }
                      }}>
                      <Animated.View style={[styles.Follow, animatedstyle]}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: responsiveFontSize(2),
                            fontFamily: FontFamily.Semi_Bold,
                          }}>
                          {item.isFollow ? 'Following' : 'Follow'}
                        </Text>

                        <Image
                          source={Images.plus}
                          style={{
                            width: responsiveHeight(2),
                            height: responsiveHeight(2),
                          }}
                        />
                      </Animated.View>
                    </Pressable>

                    <LinearGradient
                      colors={['transparent', '#000', '#000']}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1.5}}
                      style={styles.LinearMainView}>
                      <View>
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: FontFamily.Regular,
                            fontSize: responsiveFontSize(2),
                          }}>
                          {item.cate}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: FontFamily.Semi_Bold,
                            fontSize: responsiveFontSize(2.5),
                            marginVertical: responsiveHeight(1),
                          }}>
                          {item.ProfileName}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: responsiveWidth(3),
                          }}>
                          <View style={styles.bottomSubView}>
                            <Image source={Images.pin} style={styles.pin} />
                            <Text style={styles.rating}>{item.location}</Text>
                          </View>

                          <View style={styles.bottomSubView}>
                            <AirbnbRating
                              size={responsiveHeight(2)}
                              selectedColor="#9FED3A"
                              showRating={false}
                              isDisabled
                              defaultRating={item.rating}
                            />
                            <Text style={styles.rating}>{item.rating}</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity activeOpacity={0.8}>
                        <Image
                          source={Images.messageGreen}
                          style={styles.messageGreen}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </ImageBackground>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  notifiaction: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
  trainer: {
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(2),
    marginHorizontal: responsiveWidth(6),
  },
  storyImage: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(8),
    borderColor: '#000',
    borderWidth: responsiveHeight(0.3),
  },
  trainername: {
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(1.7),
  },
  imageView: {
    width: responsiveHeight(8.8),
    height: responsiveHeight(8.8),
    borderColor: '#9FED3A',
    borderWidth: responsiveHeight(0.3),
    borderRadius: responsiveHeight(8.8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  popular: {
    color: '#fff',
    fontFamily: FontFamily.Medium,
    fontSize: responsiveFontSize(2.5),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3),
  },
  Trainer: {
    height: responsiveHeight(50),
    marginHorizontal: responsiveWidth(3),
    overflow: 'hidden',
    marginVertical: responsiveHeight(1.5),
    justifyContent: 'space-between',
  },
  Follow: {
    alignSelf: 'flex-start',
    gap: responsiveWidth(4),
    borderRadius: responsiveWidth(6),
    backgroundColor: '#9FED3A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    margin: responsiveHeight(2),
  },
  pin: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  messageGreen: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
  },
  LinearMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsiveHeight(2),
  },
  bottomSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  rating: {
    color: '#fff',
    fontSize: responsiveFontSize(1.7),
  },
});
