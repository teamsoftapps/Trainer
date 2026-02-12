// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   ImageBackground,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useState, useCallback, useEffect} from 'react';
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
// } from 'react-native-responsive-dimensions';
// import WrapperContainer from '../../Components/Wrapper';
// import {FontFamily, Images} from '../../utils/Images';
// import {AirbnbRating} from 'react-native-ratings';
// import LinearGradient from 'react-native-linear-gradient';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {useSelector, useDispatch} from 'react-redux';
// import {FlashList} from '@shopify/flash-list';
// import axiosBaseURL from '../../services/AxiosBaseURL';
// import {useGetTrainersQuery} from '../../store/Apis/Post';
// import {SaveLogedInUser} from '../../store/Slices/db_ID';
// import {followTrainer, unfollowTrainer} from '../../store/Slices/follow';
// import {saveBookings} from '../../store/Slices/trainerBookings';
// import followingHook from '../../Hooks/Follow';
// import StoryRing from '../../Components/StoryRing';

// const Home = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const {data, isLoading, isFetching, refetch} = useGetTrainersQuery(
//     undefined,
//     {
//       refetchOnMountOrArgChange: true,
//     },
//   );

//   const authData = useSelector(state => state?.Auth?.data);
//   const token = authData?.token;
//   const followedTrainers = useSelector(state => state?.follow?.follow || []);

//   const {isFollow, unFollow, loading: loadingFollow} = followingHook();

//   const [storiesData, setStoriesData] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const [seenUsers, setSeenUsers] = useState([]);

//   // Fetch current user profile
//   useEffect(() => {
//     if (!token) return;

//     const fetchProfile = async () => {
//       try {
//         const response = await axiosBaseURL.get(`/Common/GetProfile/${token}`);
//         dispatch(SaveLogedInUser(response.data.data));
//       } catch (error) {
//         console.error(
//           'Profile fetch failed:',
//           error?.response?.data?.message || error.message,
//         );
//       }
//     };

//     fetchProfile();
//   }, [token, dispatch]);

//   // Load stories when trainers data changes
//   useEffect(() => {
//     if (!data?.data?.length) {
//       setStoriesData([]);
//       return;
//     }

//     const loadStories = async () => {
//       try {
//         const requests = data.data.map(trainer =>
//           axiosBaseURL.get(`/trainer/stories/${trainer._id}`).catch(err => {
//             console.log(`Stories failed for ${trainer._id}:`, err.message);
//             return {data: {data: []}};
//           }),
//         );

//         const responses = await Promise.all(requests);

//         const stories = responses
//           .map((res, idx) => {
//             const trainer = data.data[idx];
//             const trainerStories = res?.data?.data || [];

//             console.log('Stories:', trainerStories);

//             if (!trainerStories.length) return null;

//             return {
//               user_id: trainer._id,
//               user_image: trainer.profileImage,
//               user_name: trainer.fullName,
//               stories: trainerStories
//                 .filter(s => {
//                   const url = s.thumbnail || s.mediaUrl;
//                   return !url?.toLowerCase().endsWith('.heic');
//                 })
//                 .map(s => ({
//                   story_id: s._id,
//                   story_image: s.thumbnail || s.mediaUrl,
//                   story_type: s.type === 'video' ? 'video' : 'image',
//                   url: s.type === 'video' ? s.mediaUrl : undefined,
//                   onPress: () => markSeen(s._id),
//                 })),
//             };
//           })
//           .filter(Boolean);

//         setStoriesData(stories);
//       } catch (err) {
//         console.log('Stories load error:', err);
//         setStoriesData([]);
//       }
//     };

//     loadStories();
//   }, [data?.data]);

//   const markSeen = useCallback(async storyId => {
//     try {
//       await axiosBaseURL.post('/trainer/story/seen', {storyId});
//     } catch (e) {
//       console.log('Mark seen failed:', e);
//     }
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await refetch();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [refetch]);

//   useFocusEffect(
//     useCallback(() => {
//       refetch();
//     }, [refetch]),
//   );

//   const getBookingAndNavigate = useCallback(
//     async trainer => {
//       if (!trainer?._id) return;
//       try {
//         const response = await axiosBaseURL.get(
//           `/user/getBookingbyId/${trainer._id}`,
//         );
//         dispatch(saveBookings(response.data?.data || []));
//         navigation.navigate('TrainerProfile', {data: trainer});
//       } catch (error) {
//         console.log('Booking fetch error:', error);
//       }
//     },
//     [dispatch, navigation],
//   );

//   const handleFollowToggle = useCallback(
//     async trainer => {
//       if (!authData?._id || !trainer?._id) return;

//       const isFollowing = followedTrainers.includes(trainer._id);
//       const action = isFollowing ? unFollow : isFollow;

//       try {
//         const success = await action(authData._id, trainer._id);
//         if (success) {
//           dispatch(
//             isFollowing
//               ? unfollowTrainer(trainer._id)
//               : followTrainer(trainer._id),
//           );
//           refetch();
//         }
//       } catch (err) {
//         console.log('Follow toggle failed:', err);
//       }
//     },
//     [authData?._id, followedTrainers, isFollow, unFollow, dispatch, refetch],
//   );

//   const renderTrainer = useCallback(
//     ({item}) => (
//       <ImageBackground
//         source={{uri: item?.profileImage}}
//         imageStyle={{borderRadius: responsiveWidth(1.5)}}
//         style={styles.Trainer}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => getBookingAndNavigate(item)}
//           style={{flex: 1, justifyContent: 'space-between'}}>
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => handleFollowToggle(item)}
//             style={[
//               styles.Follow,
//               {
//                 backgroundColor: followedTrainers.includes(item._id)
//                   ? '#d7d7d7'
//                   : '#9FED3A',
//               },
//             ]}>
//             <Text
//               style={{
//                 color: '#000',
//                 fontFamily: FontFamily.Medium,
//                 fontSize: responsiveFontSize(2),
//               }}>
//               {loadingFollow
//                 ? 'wait...'
//                 : followedTrainers.includes(item._id)
//                   ? 'Following'
//                   : 'Follow'}
//             </Text>
//             {!followedTrainers.includes(item._id) && (
//               <Image
//                 style={{
//                   width: responsiveHeight(2),
//                   height: responsiveHeight(2),
//                 }}
//                 source={Images.plus}
//               />
//             )}
//           </TouchableOpacity>

//           <LinearGradient
//             colors={['transparent', '#000', '#000']}
//             start={{x: 0, y: 0}}
//             end={{x: 0, y: 1.5}}
//             style={styles.LinearMainView}>
//             <View>
//               <Text
//                 style={{
//                   color: '#fff',
//                   fontFamily: FontFamily.Regular,
//                   fontSize: responsiveFontSize(2),
//                 }}>
//                 {item?.Speciality?.[0]?.value || 'Not available'}
//               </Text>
//               <Text
//                 style={{
//                   color: '#fff',
//                   fontFamily: FontFamily.Semi_Bold,
//                   fontSize: responsiveFontSize(2.5),
//                   marginVertical: responsiveHeight(1),
//                 }}>
//                 {item?.fullName}
//               </Text>

//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   gap: responsiveWidth(3),
//                 }}>
//                 <View style={styles.bottomSubView}>
//                   <Image source={Images.pin} style={styles.pin} />
//                   <Text style={styles.rating}>{item?.gender}</Text>
//                 </View>

//                 <View style={styles.bottomSubView}>
//                   <AirbnbRating
//                     size={responsiveHeight(2)}
//                     selectedColor="#9FED3A"
//                     showRating={false}
//                     isDisabled
//                     defaultRating={item?.Rating ?? 0}
//                   />
//                   <Text style={styles.rating}>{item?.Rating ?? '—'}</Text>
//                 </View>
//               </View>
//             </View>

//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={() => navigation.navigate('Messages')}>
//               <Image source={Images.messageGreen} style={styles.messageGreen} />
//             </TouchableOpacity>
//           </LinearGradient>
//         </TouchableOpacity>
//       </ImageBackground>
//     ),
//     [
//       followedTrainers,
//       loadingFollow,
//       getBookingAndNavigate,
//       handleFollowToggle,
//       navigation,
//     ],
//   );

//   const ListEmpty = useCallback(
//     () => (
//       <View
//         style={{
//           alignItems: 'center',
//           justifyContent: 'center',
//           paddingVertical: 60,
//         }}>
//         {isLoading || isFetching ? (
//           <ActivityIndicator size={responsiveHeight(5)} color="#fff" />
//         ) : (
//           <Text
//             style={{
//               fontFamily: FontFamily.Regular,
//               color: 'gray',
//               fontSize: responsiveFontSize(2),
//             }}>
//             No trainers found
//           </Text>
//         )}
//       </View>
//     ),
//     [isLoading, isFetching],
//   );

//   return (
//     <WrapperContainer>
//       {/* Header */}
//       <View
//         style={{
//           height: responsiveHeight(8),
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           paddingHorizontal: responsiveWidth(7),
//         }}>
//         <Image
//           source={Images.logo}
//           style={{
//             width: responsiveWidth(12),
//             height: responsiveHeight(12),
//             resizeMode: 'contain',
//           }}
//         />
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: responsiveWidth(5),
//           }}>
//           <TouchableOpacity onPress={refetch} activeOpacity={0.8}>
//             <Image source={Images.notification} style={styles.notifiaction} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={() => navigation.navigate('Chats')}>
//             <Image source={Images.messages} style={styles.notifiaction} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Stories - fixed at top, outside ScrollView */}
//       {/* Stories section */}
//       <View
//         style={{
//           borderBottomWidth: responsiveHeight(0.03),
//           borderTopWidth: responsiveHeight(0.05),
//           borderColor: '#fff',
//           marginTop: responsiveHeight(1),
//           paddingTop: responsiveHeight(2),
//         }}>
//         <Text style={styles.trainer}>Stories from trainers</Text>

//         {/* Critical: fixed height parent + flex to help measurement */}
//         <View
//           style={{
//             // backgroundColor: 'red',
//             width: '100%',
//             height: 130, // increased slightly for safety (80 ring + name + margins)
//             flexDirection: 'row', // optional - sometimes helps horizontal lists
//             alignItems: 'center', // optional
//           }}>
//           <FlashList
//             horizontal
//             data={storiesData}
//             estimatedItemSize={90}
//             keyExtractor={item => item.user_id}
//             showsHorizontalScrollIndicator={false}
//             // FIXED: remove alignItems – it's invalid here
//             contentContainerStyle={{
//               paddingHorizontal: 16, // safe (padding is allowed)
//               paddingVertical: 8, // optional – if you want top/bottom breathing room
//               backgroundColor: 'transparent', // only if needed
//             }}
//             // Optional: helps initial scroll & measurement on some devices
//             getItemLayout={(data, index) => ({
//               length: 96, // ≈ 80 width + 16 marginRight
//               offset: 96 * index,
//               index,
//             })}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   // setSeenUsers(prev => [...prev, item.user_id]);
//                   navigation.navigate('StoryViewer', {
//                     user: item,
//                     onSeen: userId => {
//                       setSeenUsers(prev => [...new Set([...prev, userId])]); // unique
//                     },
//                   });
//                 }}
//                 style={{
//                   alignItems: 'center',
//                   marginRight: 16, // moved margin here (from contentContainer)
//                 }}>
//                 <View style={{width: 80, height: 80}}>
//                   {/* <StoryRing count={item.stories.length} /> */}
//                   <StoryRing
//                     count={item.stories.length}
//                     color={
//                       seenUsers.includes(item.user_id)
//                         ? '#666' // gray after seen
//                         : '#9FED3A' // green new
//                     }
//                   />
//                   <Image
//                     source={{uri: item.user_image}}
//                     style={{
//                       position: 'absolute',
//                       top: 5,
//                       left: 5,
//                       width: 70,
//                       height: 70,
//                       borderRadius: 35,
//                     }}
//                   />
//                 </View>
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     color: '#fff',
//                     fontSize: 12,
//                     marginTop: 6,
//                     width: 80,
//                     textAlign: 'center',
//                   }}>
//                   {item.user_name}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       </View>

//       {/* Main content */}
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}>
//         <View style={{paddingTop: responsiveHeight(2)}}>
//           <Text style={styles.popular}>Popular Personal Trainers</Text>

//           <FlashList
//             estimatedItemSize={responsiveHeight(50) + 40}
//             data={data?.data || []}
//             renderItem={renderTrainer}
//             keyExtractor={item => item._id}
//             ListEmptyComponent={ListEmpty}
//             scrollEnabled={false}
//           />
//         </View>
//       </ScrollView>
//     </WrapperContainer>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   notifiaction: {
//     width: responsiveHeight(4),
//     height: responsiveHeight(4),
//     resizeMode: 'contain',
//   },
//   trainer: {
//     color: '#fff',
//     fontFamily: FontFamily.Regular,
//     fontSize: responsiveFontSize(2),
//     marginHorizontal: responsiveWidth(6),
//     marginBottom: 8,
//   },
//   popular: {
//     color: '#fff',
//     fontFamily: FontFamily.Medium,
//     fontSize: responsiveFontSize(2.5),
//     marginHorizontal: responsiveWidth(6),
//     marginBottom: responsiveHeight(2),
//   },
//   Trainer: {
//     height: responsiveHeight(50),
//     marginHorizontal: responsiveWidth(3),
//     overflow: 'hidden',
//     marginVertical: responsiveHeight(1.5),
//   },
//   Follow: {
//     alignSelf: 'flex-start',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: responsiveWidth(2),
//     borderRadius: responsiveWidth(6),
//     paddingVertical: responsiveHeight(1),
//     paddingHorizontal: responsiveWidth(4),
//     margin: responsiveHeight(2),
//   },
//   pin: {
//     width: responsiveWidth(4),
//     height: responsiveWidth(4),
//     resizeMode: 'contain',
//     tintColor: '#fff',
//   },
//   messageGreen: {
//     width: responsiveWidth(12),
//     height: responsiveWidth(12),
//   },
//   LinearMainView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: responsiveHeight(2),
//   },
//   bottomSubView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: responsiveWidth(2),
//   },
//   rating: {
//     color: '#fff',
//     fontSize: responsiveFontSize(1.7),
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily, Images} from '../../utils/Images';
import {AirbnbRating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useGetTrainersQuery} from '../../store/Apis/Post';
import {SaveLogedInUser} from '../../store/Slices/db_ID';
import {followTrainer, unfollowTrainer} from '../../store/Slices/follow';
import {saveBookings} from '../../store/Slices/trainerBookings';
import followingHook from '../../Hooks/Follow';
import StoryRing from '../../Components/StoryRing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const adsData = [
  {
    id: '1',
    title: 'Fuel Your Workout',
    description: 'Discover premium supplements for better performance.',
    buttonText: 'Learn More',
    image: require('../../assets/Images/add1.png'), // your asset image 1
  },
  {
    id: '2',
    title: 'Boost Recovery Now',
    description: 'High-quality protein for faster muscle repair.',
    buttonText: 'Shop Now',
    image: require('../../assets/Images/add2.png'), // your asset image 1
  },
  // You can add more later
];

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {data, isLoading, isFetching, refetch} = useGetTrainersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const authData = useSelector(state => state?.Auth?.data);
  const token = authData?.token;
  const followedTrainers = useSelector(state => state?.follow?.follow || []);

  const {isFollow, unFollow, loading: loadingFollow} = followingHook();

  const [storiesData, setStoriesData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seenUsers, setSeenUsers] = useState(new Set());

  const flatListRef = useRef(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentAdIndex + 1) % adsData.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0,
      });

      setCurrentAdIndex(nextIndex);
    }, 4500); // change every 4.5 seconds

    return () => clearInterval(interval);
  }, [currentAdIndex]);

  // Fetch current user profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axiosBaseURL.get(`/Common/GetProfile/${token}`);
        dispatch(SaveLogedInUser(response.data.data));
      } catch (error) {
        console.error(
          'Profile fetch failed:',
          error?.response?.data?.message || error.message,
        );
      }
    };

    fetchProfile();
  }, [token, dispatch]);

  // Load stories when trainers change
  useEffect(() => {
    if (!data?.data?.length) {
      setStoriesData([]);
      return;
    }

    const loadStories = async () => {
      try {
        const requests = data.data.map(trainer =>
          axiosBaseURL.get(`/trainer/stories/${trainer._id}`).catch(err => {
            console.log(`Stories failed for ${trainer._id}:`, err.message);
            return {data: {data: []}};
          }),
        );

        const responses = await Promise.all(requests);

        const stories = responses
          .map((res, idx) => {
            const trainer = data.data[idx];
            const trainerStories = res?.data?.data || [];

            if (!trainerStories.length) return null;

            return {
              user_id: trainer._id,
              user_image: trainer.profileImage,
              user_name: trainer.fullName,
              stories: trainerStories
                .filter(s => {
                  const url = s.thumbnail || s.mediaUrl;
                  return !url?.toLowerCase().endsWith('.heic');
                })
                .map(s => ({
                  story_id: s._id,
                  story_image: s.thumbnail || s.mediaUrl,
                  story_type: s.type === 'video' ? 'video' : 'image',
                  url:
                    s.type === 'video' ? s.mediaUrl : s.thumbnail || s.mediaUrl,
                })),
            };
          })
          .filter(Boolean);

        setStoriesData(stories);
      } catch (err) {
        console.log('Stories load error:', err);
        setStoriesData([]);
      }
    };

    loadStories();
  }, [data?.data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const getBookingAndNavigate = useCallback(
    async trainer => {
      if (!trainer?._id) return;
      try {
        const response = await axiosBaseURL.get(
          `/user/getBookingbyId/${trainer._id}`,
        );
        dispatch(saveBookings(response.data?.data || []));
        navigation.navigate('TrainerProfile', {data: trainer});
      } catch (error) {
        console.log('Booking fetch error:', error);
      }
    },
    [dispatch, navigation],
  );

  const handleFollowToggle = useCallback(
    async trainer => {
      if (!authData?._id || !trainer?._id) return;

      const isFollowing = followedTrainers.includes(trainer._id);
      const action = isFollowing ? unFollow : isFollow;

      try {
        const success = await action(authData._id, trainer._id);
        if (success) {
          dispatch(
            isFollowing
              ? unfollowTrainer(trainer._id)
              : followTrainer(trainer._id),
          );
          refetch();
        }
      } catch (err) {
        console.log('Follow toggle failed:', err);
      }
    },
    [authData?._id, followedTrainers, isFollow, unFollow, dispatch, refetch],
  );

  const renderTrainer = useCallback(
    ({item}) => (
      <ImageBackground
        source={{uri: item?.profileImage}}
        imageStyle={{borderRadius: responsiveWidth(2)}}
        style={styles.trainerCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => getBookingAndNavigate(item)}
          style={{flex: 1}}>
          {/* Follow button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleFollowToggle(item)}
            style={[
              styles.followButton,
              {
                backgroundColor: followedTrainers.includes(item._id)
                  ? '#e0e0e0'
                  : '#9FED3A',
              },
            ]}>
            <Text style={styles.followText}>
              {loadingFollow
                ? '…'
                : followedTrainers.includes(item._id)
                  ? 'Following'
                  : 'Follow'}
            </Text>
            {!followedTrainers.includes(item._id) && (
              <Image source={Images.plus} style={styles.plusIcon} />
            )}
          </TouchableOpacity>

          {/* Bottom info gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.bottomGradient}>
            <View style={styles.trainerInfo}>
              <Text style={styles.speciality}>
                {item?.Speciality?.[0]?.value || 'Trainer'}
              </Text>
              <Text style={styles.trainerName}>{item?.fullName}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  {/* <Image source={Images.pin} style={styles.statIcon} /> */}
                  <Text style={styles.statText}>{item?.gender || '—'}</Text>
                </View>

                <View style={styles.statItem}>
                  <AirbnbRating
                    size={responsiveHeight(1.8)}
                    selectedColor="#9FED3A"
                    showRating={false}
                    isDisabled
                    defaultRating={item?.Rating ?? 0}
                  />
                  <Text style={styles.statText}>
                    {item?.Rating?.toFixed(1) ?? '—'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
              <Image source={Images.messageGreen} style={styles.messageIcon} />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </ImageBackground>
    ),
    [
      followedTrainers,
      loadingFollow,
      getBookingAndNavigate,
      handleFollowToggle,
      navigation,
    ],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        {isLoading || isFetching ? (
          <ActivityIndicator size="large" color="#9FED3A" />
        ) : (
          <Text style={styles.emptyText}>No trainers available</Text>
        )}
      </View>
    ),
    [isLoading, isFetching],
  );

  const markStorySeen = useCallback(async storyId => {
    if (!storyId) return;
    try {
      await axiosBaseURL.post('/trainer/story/seen', {storyId});
      console.log('Story marked as seen:', storyId);
    } catch (err) {
      console.log('Failed to mark story seen:', err.message);
    }
  }, []);

  return (
    <WrapperContainer>
      {/* Header */}
      <View style={styles.header}>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={refetch} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" color={'#fff'} size={30} />
            {/* <Image source={Images.notification} style={styles.headerIcon} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Chats')}
            activeOpacity={0.7}>
            {/* <AntDesign name="message" size={30} color={'#fff'} /> */}
            <Image source={Images.messages} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Stories from trainers</Text>
        <View
          style={{
            // backgroundColor: 'red',
            width: '100%',
            height: 120,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FlashList
            horizontal
            data={storiesData}
            estimatedItemSize={90}
            keyExtractor={item => item.user_id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: 'transparent',
            }}
            getItemLayout={(data, index) => ({
              length: 96, // ≈ 80 width + 16 marginRight
              offset: 96 * index,
              index,
            })}
            renderItem={({item}) => {
              const isSeen = seenUsers.has(item.user_id);
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StoryViewer', {
                      user: item,
                      onAllSeen: () => {
                        setSeenUsers(prev => {
                          const next = new Set(prev);
                          next.add(item.user_id);
                          return next;
                        });
                      },
                      markStorySeen, // ← add this line
                    })
                  }
                  style={{
                    alignItems: 'center',
                    marginRight: 16, // moved margin here (from contentContainer)
                  }}>
                  <View style={{width: 80, height: 80}}>
                    {/* <StoryRing count={item.stories.length} /> */}
                    <StoryRing
                      count={item.stories.length}
                      color={isSeen ? '#666666' : '#9FED3A'}
                      size={86}
                      strokeWidth={4.5}
                    />
                    <Image
                      source={{uri: item.user_image}}
                      style={{
                        position: 'absolute',
                        top: responsiveHeight(0.5),
                        left: responsiveWidth(1),
                        width: responsiveHeight(9),
                        height: responsiveHeight(9),
                        borderRadius: responsiveWidth(15),
                      }}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#fff',
                      fontSize: responsiveFontSize(1.5),
                      fontWeight: '500',
                      marginTop: 6,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    {item.user_name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* Trainers ScrollView */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9FED3A"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.trainersContent}>
        {/* Sponsored Ads Carousel */}
        <View style={styles.adsSection}>
          <FlatList
            ref={flatListRef}
            data={adsData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setCurrentAdIndex(index);
            }}
            renderItem={({item}) => (
              <View style={styles.adsCard}>
                <Image
                  source={item.image}
                  style={styles.adsFullImage}
                  resizeMode="cover" // or "contain" if you prefer no cropping
                />
              </View>
            )}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {/* Slider Dots */}
          <View style={styles.sliderDots}>
            {adsData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentAdIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.popularTitle}>Popular Personal Trainers</Text>

        <FlashList
          estimatedItemSize={responsiveHeight(52)}
          data={data?.data || []}
          renderItem={renderTrainer}
          keyExtractor={item => item._id}
          ListEmptyComponent={ListEmpty}
          scrollEnabled={false}
        />
      </ScrollView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: responsiveHeight(9),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
  },
  logo: {
    width: responsiveWidth(14),
    height: responsiveHeight(10),
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(6),
  },
  headerIcon: {
    width: responsiveHeight(3),
    height: responsiveHeight(3),
    tintColor: '#fff',
  },

  storiesSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingTop: responsiveHeight(1),
    // paddingVertical: responsiveHeight(1),
  },
  sectionTitle: {
    color: '#fff',
    fontFamily: FontFamily.Medium,
    fontSize: responsiveFontSize(2.4),
    marginLeft: responsiveWidth(6),
    marginBottom: responsiveHeight(1.2),
  },
  storiesWrapper: {
    height: 120,
  },
  storiesContent: {
    paddingHorizontal: responsiveWidth(4),
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: responsiveWidth(1.5),
  },
  ringContainer: {
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111',
  },
  storyName: {
    color: '#e0e0e0',
    fontSize: responsiveFontSize(1.55),
    marginTop: 6,
    maxWidth: 80,
    textAlign: 'center',
    fontFamily: FontFamily.Regular,
  },

  adsSection: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.5),
  },
  adsSection: {
    paddingHorizontal: 0, // full bleed
    marginVertical: responsiveHeight(1.5),
  },
  adsCard: {
    width: SCREEN_WIDTH, // full screen width for paging
    height: responsiveHeight(25), // adjust height as needed
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adsFullImage: {
    width: '90%',
    height: '100%',
    borderRadius: responsiveWidth(3),
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(1.5),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#9FED3A',
    width: 28,
    borderRadius: 14,
  },
  popularTitle: {
    color: '#fff',
    fontFamily: FontFamily.Semi_Bold,
    fontSize: responsiveFontSize(2.4),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1.5),
  },

  trainersContent: {
    paddingBottom: responsiveHeight(10),
  },

  trainerCard: {
    height: responsiveHeight(52),
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(3),
    overflow: 'hidden',
  },
  followButton: {
    position: 'absolute',
    top: responsiveHeight(2),
    left: responsiveWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(6),
    zIndex: 10,
  },
  followText: {
    color: '#000',
    fontFamily: FontFamily.Medium,
    fontSize: responsiveFontSize(1.9),
    marginRight: responsiveWidth(1.5),
  },
  plusIcon: {
    width: responsiveHeight(2.2),
    height: responsiveHeight(2.2),
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: responsiveWidth(4),
  },
  trainerInfo: {
    flex: 1,
  },
  speciality: {
    color: '#ddd',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(1.9),
  },
  trainerName: {
    color: '#fff',
    fontFamily: FontFamily.Semi_Bold,
    fontSize: responsiveFontSize(2.6),
    marginVertical: responsiveHeight(0.8),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(5),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1.8),
  },
  statIcon: {
    width: responsiveWidth(4.5),
    height: responsiveWidth(4.5),
    tintColor: '#fff',
  },
  statText: {
    color: '#eee',
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.Regular,
  },
  messageIcon: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(15),
  },
  emptyText: {
    color: '#aaa',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(2),
  },
});

export default Home;
