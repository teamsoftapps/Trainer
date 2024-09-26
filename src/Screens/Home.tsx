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
import axiosBaseURL from '../services/AxiosBaseURL';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import InstaStory from 'react-native-insta-story';
import {store} from '../store/store';
import {useGetTrainersQuery} from '../store/Apis/Post';
import {FlashList} from '@shopify/flash-list';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {MainProps} from '../Navigations/MainStack';
import {useCreateChatMutation, useGetChatsQuery} from '../store/Apis/chat';
import {socketService} from '../utils/socketService';
import {SaveLogedInUser} from '../store/Slices/db_ID';

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

type Props = NativeStackScreenProps<MainProps, 'Bottom'>;
const Home: React.FC<Props> = ({navigation, route}) => {
  const {data} = useGetTrainersQuery();
  const [createChat] = useCreateChatMutation();
  const [modal, setmodal] = useState(Number);
  const [usersData, setusersData] = useState(TrainerProfile);
  const [trainerData, settrainerData] = useState([]);
  const [APIUserData, setAPIUserData] = useState({});
  const dispatch = useDispatch();
  const token = useSelector(state => state?.Auth.data.isToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axiosBaseURL.get(
          `/Common/GetProfile/${token}`,
        );
        const userData = profileResponse.data.data;
        console.log('profileResponce', userData);
        dispatch(SaveLogedInUser(userData));
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response?.data?.message || error.message,
        );
      }
    };
    fetchData();
  }, [token]);

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
  useEffect(() => {
    getPosts();
  });
  useEffect(() => {
    socketService.initializeSocket();
  }, []);
  const getPosts = async () => {
    try {
      const res = await data;
      console.log('ALL', res);
      settrainerData(res?.data);
    } catch (error) {
      console.log('Errorr', error);
    }
  };

  const onPressMessage = async (item: object) => {
    let payload = {
      userId: item._id,
      type: item.isType,
    };
    try {
      const res = await createChat(payload);

      if (res?.data.data) {
        navigation.navigate('Messages', {
          name: item?.fullName,
          profile: item?.profileImage,
          id: res?.data.data._id,
        });
      }
    } catch (error) {
      console.log('Successfull Error', error);
    }
  };

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontFamily: FontFamily.Regular}}>Data not found</Text>
      </View>
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
          <TouchableOpacity onPress={getPosts} activeOpacity={0.8}>
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

          <View style={{flex: 1}}>
            <FlashList
              estimatedItemSize={200}
              scrollEnabled={false}
              ListEmptyComponent={listemptyComp}
              data={trainerData}
              renderItem={({item, index}) => {
                return (
                  <ImageBackground
                    imageStyle={{borderRadius: responsiveWidth(1.5)}}
                    source={{uri: item?.profileImage}}
                    style={styles.Trainer}>
                    <Text>Ok Now We Try</Text>
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
                          {item?.Speciality}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: FontFamily.Semi_Bold,
                            fontSize: responsiveFontSize(2.5),
                            marginVertical: responsiveHeight(1),
                          }}>
                          {item?.fullName}
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
                            <Text style={styles.rating}>{item?.gender}</Text>
                          </View>

                          <View style={styles.bottomSubView}>
                            <AirbnbRating
                              size={responsiveHeight(2)}
                              selectedColor="#9FED3A"
                              showRating={false}
                              isDisabled
                              defaultRating={item?.Rating}
                            />
                            <Text style={styles.rating}>{item?.Rating}</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          onPressMessage(item);
                        }}>
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
