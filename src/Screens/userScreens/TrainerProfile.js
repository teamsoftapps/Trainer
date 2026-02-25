import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily, Images} from '../../utils/Images';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {followTrainer, unfollowTrainer} from '../../store/Slices/follow';
import {
  favouriteTrainer,
  unfavouriteTrainer,
} from '../../store/Slices/favourite';
import {SaveLogedInUser} from '../../store/Slices/db_ID';
import followingHook from '../../Hooks/Follow';
import MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import Video from 'react-native-video';
const TrainerProfile = ({route}) => {
  const {data} = route.params;

  console.log('Data from route in trainer Profile:', data);

  const [bookingTime, setbookingTime] = useState([]);
  const [heart, setheart] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const navigation = useNavigation();
  const {isFollow, unFollow, loading: loadingFollow} = followingHook();
  const authData = useSelector(state => state?.Auth.data);
  const token = useSelector(state => state?.Auth?.data?.token);
  const checkFollowed = useSelector(state => state?.follow);

  const [followersCount, setFollowersCount] = useState(
    data?.followers?.length || 0,
  );

  const dispatch = useDispatch();
  const [filtered, setfiltered] = useState();
  const {Bookings} = useSelector(state => state?.bookings);

  const calculateAge = birthdateString => {
    const [month, day, year] = birthdateString.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    const birthDate = new Date(formattedDate);

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  const age = calculateAge(data.Dob);

  const fetchReviews = async () => {
    try {
      const res = await axiosBaseURL.get(`/user/trainer/${data._id}`);
      console.log('responce in trainer prfile for the reviews:', res.data.data);
      if (res.data.status) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTrainerPosts = async () => {
    try {
      setLoadingPosts(true);

      const res = await axiosBaseURL.get(`/trainer/posts/${data._id}`);

      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching posts', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const profileResponse = await axiosBaseURL.get(
            `/Common/GetProfile/${token}`,
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
    }, [token, checkFollowed]),
  );

  const fetchFavoriteTrainers = async () => {
    if (authData.isType === 'user') {
      try {
        const res = await axiosBaseURL.get(
          `/user/Getfavoritetrainers/${authData?._id}`,
        );

        const filtered = res?.data?.data?.filter(
          item => item.trainerID === data?._id,
        );

        setfiltered(filtered);
      } catch (error) {
        console.error('Error fetching favorite trainers:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteTrainers();
      fetchTrainerPosts();
      fetchReviews();
    }, [heart]),
  );

  const AddFavouriteTrainer = async () => {
    if (authData.isType === 'user') {
      try {
        var isFavorite =
          filtered && filtered.some(item => item.trainerID === data?._id);

        if (isFavorite) {
          await axiosBaseURL.delete('/user/Deletefavoritetrainers', {
            data: {
              userId: authData?._id,
              trainerID: data?._id,
            },
          });
          await fetchFavoriteTrainers();
          console.log('Deleted favorite trainer');
          dispatch(unfavouriteTrainer({trainerID: data?._id}));
        } else {
          await axiosBaseURL.post('/user/favoritetrainers', {
            userId: authData?._id,
            trainerID: data?._id,
            name: data?.fullName,
            rating: data?.Rating,
            trainerProfile: data?.profileImage,
          });
          await fetchFavoriteTrainers();
          console.log('Added favorite trainer');
          dispatch(favouriteTrainer({trainerID: data?._id}));
        }
      } catch (error) {
        console.log('Error adding/removing favorite trainer:', error);
      }
    }
  };

  const handleFollow = async () => {
    const userID = authData?._id;
    const trainerID = data._id;

    const res = await isFollow(userID, trainerID);

    if (res) {
      dispatch(followTrainer(trainerID));

      setFollowersCount(prev => prev + 1);

      console.log('Follow success');
    }
  };

  const handleUnFollow = async () => {
    const userID = authData?._id;
    const trainerID = data._id;

    const res = await unFollow(userID, trainerID);

    if (res) {
      dispatch(unfollowTrainer(trainerID));

      setFollowersCount(prev => (prev > 0 ? prev - 1 : 0));

      console.log('Unfollow success');
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 25,
          borderRadius: responsiveWidth(2),
          marginHorizontal: responsiveWidth(1.2),
          borderWidth: 1,
          backgroundColor: bookingTime?.includes(item) ? '#d7d7d7' : '#9FED3A',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Extra_Bold,
          }}>
          {item}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(1.6),
            fontFamily: FontFamily.Semi_Bold,
          }}>
          {bookingTime?.includes(item) ? 'Booked' : 'Available'}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (Bookings) {
      const timeArray = Bookings?.map(item => item?.bookingTime);
      setbookingTime(timeArray);
    }
  }, [Bookings]);

  const isFavorite =
    filtered && filtered.some(item => item.trainerID === data?._id);
  const videoPosts = posts.filter(p => p.type === 'video');
  const imagePosts = posts.filter(p => p.type === 'image');

  let previewPosts = [];

  if (videoPosts.length > 0) {
    previewPosts = videoPosts.slice(0, 3);
  } else {
    previewPosts = imagePosts.slice(0, 3);
  }

  const handleDeleteReview = async reviewId => {
    console.log('review ID:', reviewId);
    try {
      const res = await axiosBaseURL.delete(`/user/delete/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      console.log('R......', res);

      setActiveMenu(null);

      // refresh reviews after delete
      fetchReviews();

      showMessage({
        message: 'Review deleted successfully',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  };

  const currentUserId = authData?._id;
  const latestReviews = reviews.slice(0, 3);
  const handleOpenChat = async () => {
    try {
      const res = await axiosBaseURL.post('/chat/create-conversation', {
        userId: authData?._id,
        trainerId: data?._id,
      });

      if (res.data.success) {
        // backend may return: { conversation } or { data }
        const conversation = res.data.conversation || res.data.data;

        navigation.navigate('ChatScreen', {
          conversationId: conversation?._id,
          trainerData: data,
        });
      }
    } catch (error) {
      console.log('Chat error:', error?.response?.data || error.message);
    }
  };
  return (
    <WrapperContainer style={{backgroundColor: 'black'}}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: responsiveHeight(15), // space for floating button
        }}
        showsVerticalScrollIndicator={false}>
        {/* ================= HEADER SECTION ================= */}
        <ImageBackground
          source={Images.ProfileBG}
          style={{width: responsiveWidth(100)}}
          resizeMode="cover">
          <LinearGradient
            colors={['transparent', '#000', '#000']}
            style={{flex: 1, paddingTop: responsiveHeight(5)}}>
            {/* Top Bar */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: responsiveWidth(5),
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={Images.back} tintColor={'white'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={AddFavouriteTrainer}>
                <Image
                  source={isFavorite ? Images.heart_filled : Images.fav_heart}
                  style={{width: 28, height: 24}}
                />
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Image
                source={{uri: data?.profileImage}}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  borderWidth: 2,
                  borderColor: '#fff',
                }}
              />

              {/* Available Badge */}
              <View
                style={{
                  backgroundColor: '#9FED3A',
                  paddingHorizontal: 14,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginTop: 10,
                }}>
                <Text style={{color: '#000', fontWeight: '600'}}>
                  {data?.isAvailable ? 'Available' : 'Not-Available'}
                </Text>
              </View>

              {/* Name */}
              <Text
                style={{
                  color: '#fff',
                  fontSize: responsiveFontSize(3.2),
                  fontWeight: '700',
                  marginTop: 10,
                }}>
                {data?.fullName}
              </Text>

              <Text style={{color: '#ccc', fontSize: 14}}>
                Certified Personal Trainer
              </Text>

              {/* Speciality + Experience */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 6,
                  alignItems: 'center',
                }}>
                <Text style={{color: '#ccc'}}>
                  {data?.Speciality?.[0]?.value}
                </Text>
                <Text style={{color: '#ccc'}}> • </Text>
                <Text style={{color: '#ccc'}}>
                  {data?.experience || 'No Experience Added'}
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 25,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#9FED3A', fontSize: 18}}>
                  ⭐ {data?.Rating || '0.0'}
                </Text>
                <Text style={{color: '#aaa'}}>Rating</Text>
              </View>

              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {/* {data?.followers?.length || 0} */}
                  {followersCount}
                </Text>
                <Text style={{color: '#aaa'}}>Followers</Text>
              </View>

              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {data?.Dob ? age : '--'}
                </Text>
                <Text style={{color: '#aaa'}}>Years old</Text>
              </View>
            </View>

            {/* Follow & Message Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 25,
              }}>
              <TouchableOpacity
                onPress={() =>
                  !checkFollowed.follow.includes(data._id)
                    ? handleFollow()
                    : handleUnFollow()
                }
                style={{
                  backgroundColor: '#fff',
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  borderRadius: 30,
                }}>
                <Text style={{color: '#000', fontWeight: '600'}}>
                  {checkFollowed?.follow.includes(data?._id)
                    ? 'Following'
                    : 'Follow +'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenChat}
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  borderRadius: 30,
                }}>
                <Text style={{color: '#fff'}}>Message</Text>
              </TouchableOpacity>
            </View>
            {/* Hourly Rate Box (Hired Removed) */}
            <View
              style={{
                alignItems: 'center',
                marginTop: 25,
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#444',
                  padding: 18,
                  borderRadius: 16,
                  width: responsiveWidth(88),
                  backgroundColor: '#0f0f0f',
                }}>
                <Text style={{color: '#9FED3A', fontSize: 14}}>
                  Hourly Rate
                </Text>

                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    marginTop: 6,
                    fontWeight: '600',
                  }}>
                  ${data?.Hourlyrate}{' '}
                  <Text style={{color: '#aaa', fontSize: 14}}>/ per hour</Text>
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* ================= SPECIALITIES ================= */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Specialities</Text>
          <Text style={{color: 'gray'}}>Verified by Business</Text>

          {data?.Speciality?.map((item, index) => (
            <Text key={index} style={styles.whiteText}>
              • {item?.value}
            </Text>
          ))}
        </View>

        <View style={{marginTop: responsiveHeight(2)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: responsiveWidth(7),
              alignItems: 'center',
            }}>
            <Text style={styles.heading}>Watch Video</Text>

            {posts.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TrainerMediaScreen', {
                    trainerData: data,
                    posts: posts,
                  })
                }>
                <Text style={{color: '#9FED3A'}}>See all ›</Text>
              </TouchableOpacity>
            )}
          </View>

          {loadingPosts ? (
            <Text style={{color: 'gray', paddingHorizontal: 20}}>
              Loading...
            </Text>
          ) : previewPosts.length === 0 ? (
            <Text style={{color: 'gray', paddingHorizontal: 20}}>
              No posts available
            </Text>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: responsiveWidth(6)}}
              data={previewPosts}
              keyExtractor={item => item._id}
              renderItem={({item}) => {
                const isVideo = item.type === 'video';

                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 15,
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{
                        uri: isVideo
                          ? item.thumbnail || item.mediaUrl
                          : item.mediaUrl,
                      }}
                      style={{
                        width: responsiveWidth(50),
                        height: responsiveHeight(15),
                        borderRadius: 12,
                      }}
                    />

                    {isVideo && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 30, color: 'white'}}>▶</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        <View style={styles.BioContainer}>
          <Text style={styles.heading}>Description</Text>

          <Text
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={e => {
              if (e.nativeEvent.lines.length > 3) {
                setShowReadMore(true);
              }
            }}
            style={styles.whiteText}>
            {data?.Bio}
          </Text>

          {showReadMore && (
            <Text
              onPress={() => setExpanded(!expanded)}
              style={{color: '#9FED3A', marginTop: 5}}>
              {expanded ? 'See less' : 'Read more'}
            </Text>
          )}
        </View>

        {/* ================= SCHEDULE ================= */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Schedule</Text>

          <FlatList
            data={data?.Availiblity}
            horizontal
            keyExtractor={item => item}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* ================= LOCATION ================= */}
        {/* ================= LOCATION ================= */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Location</Text>

          {data?.location?.coordinates &&
          data.location.coordinates.length === 2 ? (
            <View
              style={{
                height: responsiveHeight(25),
                borderRadius: 16,
                overflow: 'hidden',
                marginTop: 10,
              }}>
              <MapView
                style={{flex: 1}}
                initialRegion={{
                  latitude: Number(data.location.coordinates[1]), // ✅ latitude
                  longitude: Number(data.location.coordinates[0]), // ✅ longitude
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: Number(data.location.coordinates[1]),
                    longitude: Number(data.location.coordinates[0]),
                  }}
                />
              </MapView>
            </View>
          ) : (
            <Text style={styles.whiteText}>Location not available</Text>
          )}
        </View>
        {/* ================= REVIEWS ================= */}
        <View style={{paddingHorizontal: 25, marginTop: 25}}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.heading}>Reviews</Text>

            {reviews.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AllReviewsScreen', {
                    reviews: reviews,
                    trainerData: data,
                  })
                }>
                <Text style={{color: '#9FED3A'}}>See all ›</Text>
              </TouchableOpacity>
            )}
          </View>

          {latestReviews.map(item => (
            <View key={item._id} style={styles.reviewCard}>
              {/* Top Row */}
              <View style={styles.reviewTopRow}>
                <Image
                  source={{
                    uri:
                      item.userId?.profileImage ||
                      'https://i.pravatar.cc/150?img=12',
                  }}
                  style={styles.reviewAvatar}
                />

                <View style={{flex: 1}}>
                  <Text style={styles.reviewName}>
                    {item.userId?.fullName || 'User'}
                  </Text>

                  <Text style={styles.reviewTime}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                {/* ⭐ Stars */}
                <View style={{flexDirection: 'row', marginRight: 8}}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Text
                      key={star}
                      style={{
                        color: star <= item.rating ? '#FFD700' : '#333',
                        fontSize: 16,
                        marginLeft: 2,
                      }}>
                      ★
                    </Text>
                  ))}
                </View>

                {item.userId?._id === currentUserId && (
                  <>
                    <TouchableOpacity
                      onPress={event => {
                        const {pageX, pageY} = event.nativeEvent;
                        setMenuPosition({x: pageX, y: pageY});
                        setActiveMenu(item._id);
                      }}
                      style={{paddingLeft: 6}}>
                      <Ionicons
                        name="ellipsis-vertical"
                        size={18}
                        color="#9FED3A"
                      />
                    </TouchableOpacity>

                    {activeMenu === item._id && (
                      <Modal transparent animationType="fade">
                        <TouchableWithoutFeedback
                          onPress={() => setActiveMenu(null)}>
                          <View style={styles.overlay}>
                            <TouchableWithoutFeedback>
                              <View
                                style={[
                                  styles.dropdownMenu,
                                  {
                                    position: 'absolute',
                                    top: menuPosition.y + 10,
                                    left: menuPosition.x - 140,
                                  },
                                ]}>
                                <TouchableOpacity
                                  style={styles.menuItem}
                                  onPress={() => {
                                    setActiveMenu(null);
                                    navigation.navigate('AddReviewScreen', {
                                      trainerId: data._id,
                                      editMode: true,
                                      reviewData: item,
                                    });
                                  }}>
                                  <Ionicons
                                    name="create-outline"
                                    size={16}
                                    color="#fff"
                                    style={{marginRight: 8}}
                                  />
                                  <Text style={styles.dropdownText}>
                                    Update
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.menuItem}
                                  onPress={() => handleDeleteReview(item._id)}>
                                  <Ionicons
                                    name="trash-outline"
                                    size={16}
                                    color="red"
                                    style={{marginRight: 8}}
                                  />
                                  <Text
                                    style={[
                                      styles.dropdownText,
                                      {color: 'red'},
                                    ]}>
                                    Delete
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    )}
                  </>
                )}
              </View>

              {/* Review Text */}
              <Text style={styles.reviewText}>{item.reviewText}</Text>

              {/* 🔥 Media (if exists) */}
              {item.mediaUrl && (
                <View style={{marginTop: 10}}>
                  {item.mediaType === 'video' ? (
                    <Video
                      source={{uri: item.mediaUrl}}
                      style={{height: 180, borderRadius: 12}}
                      controls
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{uri: item.mediaUrl}}
                      style={{
                        width: '100%',
                        height: 180,
                        borderRadius: 12,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </View>
              )}
            </View>
          ))}

          {/* Add Review Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddReviewScreen', {
                trainerId: data._id,
              });
            }}
            style={{marginTop: 15, alignSelf: 'center'}}>
            <Text
              style={{
                color: '#9FED3A',
                fontWeight: '600',
                textDecorationLine: 'underline',
              }}>
              Add review
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.floatingWrapper}>
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Schedule', {Data: data})}>
          <Text style={styles.floatingText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </WrapperContainer>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(3),
    backgroundColor: 'transparent',
  },

  floatingButton: {
    backgroundColor: '#9FED3A',
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Android shadow
    elevation: 10,
  },

  reviewCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    marginTop: 15,
  },

  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 12,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: '#9FED3A',
    borderRadius: 10,
    paddingVertical: 6,
    width: 120,
    elevation: 8,
    zIndex: 999,
  },

  dropdownText: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: '#000',
    fontSize: 14,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  dropdownMenu: {
    width: 150,
    backgroundColor: '#1c1c1c',
    borderRadius: 14,
    paddingVertical: 6,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dropdownText: {
    color: '#fff',
    fontSize: 14,
  },

  reviewName: {
    color: '#fff',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
  },

  reviewTime: {
    color: '#888',
    fontSize: responsiveFontSize(1.5),
    marginTop: 2,
  },

  reviewText: {
    color: '#ccc',
    marginTop: 12,
    lineHeight: 20,
    fontSize: responsiveFontSize(1.8),
  },

  floatingText: {
    color: '#000',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },

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
    gap: responsiveHeight(0.7),
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
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1.5),
  },
  whiteText: {
    color: 'white',
    fontSize: responsiveFontSize(1.7),
    fontFamily: FontFamily.Medium,
  },
  blacktext: {
    color: 'black',
    fontWeight: '500',
    fontSize: responsiveFontSize(1.8),
  },
  curve: {
    width: responsiveWidth(24),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
