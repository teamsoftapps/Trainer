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
import React, {useState, useEffect} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../Components/Wrapper';
import {FontFamily, Images} from '../utils/Images';
import {TrainerProfile} from '../utils/Dummy';
import {AirbnbRating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import axiosBaseURL from '../utils/AxiosBaseURL';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import InstaStory from 'react-native-insta-story';

const StoriesData = [
  {
    user_id: '1',
    storyType: 'image',
    user_image:
      'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
    user_name: 'Alex Morgan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: '2',
    user_image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Jordan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://plus.unsplash.com/premium_photo-1666174933753-36abe3cb834b?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://images.unsplash.com/photo-1724268509269-cd2c9bd9bef3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '3',
    user_image:
      'https://images.unsplash.com/photo-1721332149267-ef9b10eaacd9?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Ruben Neves',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '4',
    user_image:
      'https://images.unsplash.com/photo-1720048171098-dba33b2c4806?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Ryan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '5',
    user_image:
      'https://images.unsplash.com/photo-1724313802205-6f70304e6c64?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Emily',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '5',
    user_image:
      'https://images.unsplash.com/photo-1724313802205-6f70304e6c64?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Emily',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];
const Home = () => {
  const navigation = useNavigation();
  const [modal, setmodal] = useState(Number);
  const [usersData, setusersData] = useState(TrainerProfile);
  const [APIUserData, setAPIUserData] = useState({});
  const datafromsignup = useSelector(state => state.Auth.data);
  console.log('datafromsignup', datafromsignup);
  // const screenWidth = Dimensions.get('screen').width;

  // const workletResponsiveScreenWidth = () => {
  //   'worklet';
  //   return (value: any) => (value / 375) * screenWidth;
  // };

  // const Follow = (userID: number) => {
  //   const updateUser = usersData.map(item => {
  //     if (userID === item.id) {
  //       return {
  //         ...item,
  //         isFollow: true,
  //       };
  //     }
  //     return item;
  //   });
  //   setusersData(updateUser);
  // };

  // const unFollow = (userID: number) => {
  //   const updatedUser = usersData.map(item => {
  //     if (userID === item.id) {
  //       return {
  //         ...item,
  //         isFollow: false,
  //       };
  //     }
  //     return item;
  //   });
  //   setusersData(updatedUser);
  // };

  // const animation = useSharedValue(0);

  // const animatedstyle = useAnimatedStyle(() => {
  //   const width = interpolate(
  //     animation.value,
  //     [0, 1],
  //     [workletResponsiveScreenWidth()(110), workletResponsiveScreenWidth()(130)]
  //   );
  //   return {
  //     width,
  //   };
  // });
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
              navigation.navigate('Chats');
            }}>
            <Image source={Images.messages} style={styles.notifiaction} />
          </TouchableOpacity>
        </View>
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
            marginTop: responsiveHeight(1),
          }}>
          <Text style={styles.trainer}>Stories from trainers</Text>

          <View>
            <InstaStory
              // style={{backgroundColor: 'red'}}
              data={StoriesData}
              duration={10000}
              unPressedBorderColor={'#9FED3A'}
              unPressedAvatarTextColor={'#fff'}
              pressedAvatarTextColor={'#fff'}
              swipeText={' '}
            />

            {/* <FlatList
              style={{paddingLeft: responsiveWidth(4)}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={UserImages}
              renderItem={({item, index}) => {
                return (
                  // <TouchableOpacity
                  //   onPress={() =>
                  //     navigation.navigate('StoryViewer', {
                  //       stories: [{id: item.id, uri: item.image}],
                  //     })
                  //   }
                  //   activeOpacity={0.9}
                  //   style={{
                  //     marginHorizontal: responsiveWidth(4),
                  //     width: responsiveWidth(14),
                  //     gap: responsiveHeight(0.5),
                  //   }}>
                  //   <View style={styles.imageView}>
                  //     <Image source={item.image} style={styles.storyImage} />
                  //   </View>
                  //   <Text style={styles.trainername} numberOfLines={1}>
                  //     {item.name}
                  //   </Text>
                  // </TouchableOpacity>
                  <View style={styles.container}>
                    <InstaStory
                      style={{backgroundColor: 'red'}}
                      data={StoriesData}
                      duration={10000}
                    />
                  </View>
                );
              }}
            /> */}
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
                    // onPress={() => {
                    //   !item.isFollow ? Follow(item.id) : unFollow(item.id);
                    //   setmodal(item.id);

                    //   if (!item.isFollow) {
                    //     Follow(item.id);
                    //     animation.value = withSpring(1); // Animate to expanded state
                    //   } else {
                    //     unFollow(item.id);
                    //     animation.value = withSpring(0); // Animate to collapsed state
                    //   }
                    // }}
                    >
                      {/* <Animated.View style={[styles.Follow, animatedstyle]}>
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
                      </Animated.View> */}
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
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
