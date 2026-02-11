import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
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
import InstaStory from 'react-native-insta-story';
import {useSelector, useDispatch} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useGetTrainersQuery} from '../../store/Apis/Post';
import {SaveLogedInUser} from '../../store/Slices/db_ID';
import {followTrainer, unfollowTrainer} from '../../store/Slices/follow';
import {saveBookings} from '../../store/Slices/trainerBookings';
import followingHook from '../../Hooks/Follow';

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

  // Fetch current user profile once when token is available
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

  useEffect(() => {
    if (!data?.data?.length) {
      setStoriesData([]);
      return;
    }

    const loadStories = async () => {
      try {
        const requests = data.data.map(trainer => {
          console.log('Fetching stories for trainer:', trainer._id);
          // Return the promise (with fallback on error)
          return axiosBaseURL
            .get(`/trainer/stories/${trainer._id}`)
            .catch(err => {
              console.log(`Stories failed for ${trainer._id}:`, err.message);
              return {data: {data: []}}; // fallback empty array
            });
        });

        console.log('Number of story requests:', requests.length);

        const responses = await Promise.all(requests);

        const stories = responses
          .map((res, idx) => {
            const trainer = data.data[idx];
            const trainerStories = res?.data?.data || [];

            console.log('Stories>>>', trainerStories);

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
                  url: s.type === 'video' ? s.mediaUrl : undefined,
                  onPress: () => markSeen(s._id),
                })),
            };
          })
          .filter(Boolean);

        console.log('Parsed stories count:', stories.length);
        setStoriesData(stories);
      } catch (err) {
        console.log('Stories overall error:', err);
        setStoriesData([]);
      }
    };

    loadStories();
  }, [data?.data]); // dependency is fine (reference stable from RTK Query)

  const markSeen = useCallback(async storyId => {
    try {
      await axiosBaseURL.post('/trainer/story/seen', {storyId});
    } catch (e) {
      console.log('Mark seen failed:', e);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      // stories will be reloaded via useEffect
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Auto-refresh when screen is focused
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
        // Optionally show toast/alert here
      }
    },
    [dispatch, navigation],
  );

  const handleFollowToggle = useCallback(
    async trainer => {
      if (!authData?._id || !trainer?._id) return;

      const isCurrentlyFollowing = followedTrainers.includes(trainer._id);
      const action = isCurrentlyFollowing ? unFollow : isFollow;

      try {
        const success = await action(authData._id, trainer._id);
        if (success) {
          dispatch(
            isCurrentlyFollowing
              ? unfollowTrainer(trainer._id)
              : followTrainer(trainer._id),
          );
          refetch(); // refresh trainers (in case they return follow count etc.)
        }
      } catch (err) {
        console.log('Follow action failed:', err);
      }
    },
    [authData?._id, followedTrainers, isFollow, unFollow, dispatch, refetch],
  );

  const renderTrainer = useCallback(
    ({item}) => (
      <ImageBackground
        source={{uri: item?.profileImage}}
        imageStyle={{borderRadius: responsiveWidth(1.5)}}
        style={styles.Trainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => getBookingAndNavigate(item)}
          style={{flex: 1, justifyContent: 'space-between'}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleFollowToggle(item)}
            style={[
              styles.Follow,
              {
                backgroundColor: followedTrainers.includes(item._id)
                  ? '#d7d7d7'
                  : '#9FED3A',
              },
            ]}>
            <Text
              style={{
                color: '#000',
                fontFamily: FontFamily.Medium,
                fontSize: responsiveFontSize(2),
              }}>
              {loadingFollow
                ? 'wait...'
                : followedTrainers.includes(item._id)
                  ? 'Following'
                  : 'Follow'}
            </Text>
            {!followedTrainers.includes(item._id) && (
              <Image
                style={{
                  width: responsiveHeight(2),
                  height: responsiveHeight(2),
                }}
                source={Images.plus}
              />
            )}
          </TouchableOpacity>

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
                {item?.Speciality?.[0]?.value || 'Not available'}
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
                    defaultRating={item?.Rating ?? 0}
                  />
                  <Text style={styles.rating}>{item?.Rating ?? '—'}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Messages')}>
              <Image source={Images.messageGreen} style={styles.messageGreen} />
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
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 60,
        }}>
        {isLoading || isFetching ? (
          <ActivityIndicator size={responsiveHeight(5)} color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No trainers found
          </Text>
        )}
      </View>
    ),
    [isLoading, isFetching],
  );

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
          <TouchableOpacity onPress={refetch} activeOpacity={0.8}>
            <Image source={Images.notification} style={styles.notifiaction} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Chats')}>
            <Image source={Images.messages} style={styles.notifiaction} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
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
          <InstaStory
            data={storiesData}
            duration={10000}
            unPressedBorderColor="#9FED3A"
            unPressedAvatarTextColor="#fff"
            pressedAvatarTextColor="#fff"
            swipeText=" "
          />
        </View>

        <View>
          <Text style={styles.popular}>Popular Personal Trainers</Text>

          <FlashList
            estimatedItemSize={responsiveHeight(50) + 40}
            data={data?.data || []}
            renderItem={renderTrainer}
            keyExtractor={item => item._id}
            ListEmptyComponent={ListEmpty}
            scrollEnabled={false}
          />
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
