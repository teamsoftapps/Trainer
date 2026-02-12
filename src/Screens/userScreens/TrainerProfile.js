import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import Button from '../../Components/Button';
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
const TrainerProfile = ({route}) => {
  const {data, booking} = route.params;

  const [bookingTime, setbookingTime] = useState([]);
  const [readmore, setreadmore] = useState(true);
  const [heart, setheart] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const navigation = useNavigation();
  const {isFollow, unFollow, loading: loadingFollow} = followingHook();
  const authData = useSelector(state => state?.Auth.data);
  const token = useSelector(state => state?.Auth?.data?.token);
  const checkFollowed = useSelector(state => state?.follow);

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

  const fetchTrainerPosts = async () => {
    try {
      setLoadingPosts(true);

      const res = await axiosBaseURL.get(`/trainer/posts/${data._id}`);

      console.log('responce>>>>>>>>>>>>', res.data);

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

        // Correct filtering logic
        const filtered = res?.data?.data?.filter(
          item => item.trainerID === data?._id, // Ensure you're comparing correctly
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
    }, [heart]),
  );

  const AddFavouriteTrainer = async () => {
    if (authData.isType === 'user') {
      try {
        // Ensure 'filtered' is an array before using it
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
    console.log('Follow Hitted');
    const userID = authData?._id;
    const trainerID = data._id;

    const res = await isFollow(userID, trainerID);

    if (res) {
      // await refetch();
      dispatch(followTrainer(trainerID));
      console.log('Success', res);
    }
  };
  const handleUnFollow = async () => {
    const userID = authData?._id;
    const trainerID = data._id;

    const res = await unFollow(userID, trainerID);
    if (res) {
      // await refetch();
      dispatch(unfollowTrainer(trainerID));
      console.log('unfollow', res);
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
  // return (
  //   <WrapperContainer style={{backgroundColor: 'black'}}>
  //     <ScrollView>
  //       <ImageBackground
  //         resizeMode="cover"
  //         source={Images.ProfileBG}
  //         style={{width: responsiveWidth(100)}}>
  //         <StatusBar hidden />
  //         <View style={{flex: 1}}>
  //           <LinearGradient
  //             colors={['transparent', '#000', '#000']}
  //             start={{x: 0, y: 0}}
  //             end={{x: 0, y: 1.4}}
  //             style={{
  //               flex: 1,
  //             }}>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 justifyContent: 'space-between',
  //                 paddingHorizontal: responsiveHeight(3),
  //                 marginTop: responsiveHeight(5),
  //               }}>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   navigation.goBack();
  //                 }}>
  //                 <Image source={Images.back} tintColor={'white'} />
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   AddFavouriteTrainer();
  //                   // setheart(!heart);
  //                 }}>
  //                 <Image
  //                   source={isFavorite ? Images.heart_filled : Images.fav_heart}
  //                   resizeMode="contain"
  //                   style={{
  //                     width: responsiveWidth(6),
  //                     height: responsiveWidth(6),
  //                   }}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //             <View
  //               style={{
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //                 gap: responsiveHeight(1),
  //               }}>
  //               <Image
  //                 src={data?.profileImage}
  //                 style={{
  //                   width: responsiveWidth(28),
  //                   borderRadius: 70,
  //                   height: responsiveWidth(28),
  //                   borderWidth: 1.4,
  //                   borderColor: 'white',
  //                 }}
  //                 resizeMode="contain"
  //               />
  //               <Text
  //                 style={{fontSize: responsiveFontSize(3.5), color: 'white'}}>
  //                 {data?.fullName}
  //               </Text>

  //               <Text
  //                 style={{
  //                   fontSize: responsiveFontSize(1.8),
  //                   color: 'white',
  //                   marginTop: responsiveHeight(-1.2),
  //                 }}>
  //                 Certified Personal trainer
  //               </Text>
  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   gap: responsiveWidth(4),
  //                   marginTop: responsiveHeight(1.5),
  //                 }}>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   {data?.Speciality?.[0]?.value}
  //                 </Text>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   •
  //                 </Text>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   7 Year Experience
  //                 </Text>
  //               </View>
  //             </View>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 justifyContent: 'space-evenly',
  //                 marginTop: responsiveHeight(2),
  //               }}>
  //               <View
  //                 style={{
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                 }}>
  //                 <View
  //                   style={{
  //                     ...styles.curve,
  //                     borderRadius: responsiveWidth(10),
  //                     backgroundColor: '#9FED3A',
  //                     marginBottom: responsiveHeight(1),
  //                   }}>
  //                   <Text style={styles.blacktext}>Available</Text>
  //                 </View>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   {data?.Rating ? data?.Rating : '--'}
  //                 </Text>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   Rating
  //                 </Text>
  //               </View>
  //               <View
  //                 style={{
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                 }}>
  //                 <TouchableOpacity
  //                   accessibilityRole="button"
  //                   activeOpacity={0.8}
  //                   onPress={() => {
  //                     !checkFollowed.follow.includes(data._id)
  //                       ? handleFollow()
  //                       : handleUnFollow();
  //                   }}
  //                   style={{
  //                     ...styles.curve,
  //                     borderRadius: responsiveWidth(10),
  //                     backgroundColor: checkFollowed?.follow.includes(data?._id)
  //                       ? '#d7d7d7'
  //                       : '#9FED3A',
  //                     marginBottom: responsiveHeight(1),
  //                   }}>
  //                   <Text style={styles.blacktext}>
  //                     {loadingFollow
  //                       ? 'Waiting...'
  //                       : checkFollowed?.follow.includes(data?._id)
  //                         ? 'Following'
  //                         : 'Follow +'}
  //                   </Text>
  //                 </TouchableOpacity>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   {data?.followers?.length > 0
  //                     ? checkFollowed?.follow.length
  //                     : 0}
  //                 </Text>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   Followers
  //                 </Text>
  //               </View>
  //               <View
  //                 style={{
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                 }}>
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     navigation.navigate('Messages');
  //                   }}
  //                   activeOpacity={0.8}
  //                   style={{
  //                     ...styles.curve,
  //                     borderRadius: responsiveWidth(10),
  //                     backgroundColor: '#9FED3A',
  //                     marginBottom: responsiveHeight(1),
  //                   }}>
  //                   <Text style={styles.blacktext}>Message</Text>
  //                 </TouchableOpacity>
  //                 <Text
  //                   style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
  //                   {data?.Dob ? age : '--'}
  //                 </Text>

  //                 <Text
  //                   style={{
  //                     fontSize: responsiveFontSize(1.8),
  //                     color: 'white',
  //                   }}>
  //                   Years old
  //                 </Text>
  //               </View>
  //             </View>
  //             <View style={styles.BoxContainer}>
  //               <View style={styles.box}>
  //                 <Text
  //                   style={{color: '#9FED3A', fontSize: responsiveFontSize(2)}}>
  //                   Hourly Rate
  //                 </Text>

  //                 <Text
  //                   style={{
  //                     color: 'white',
  //                     fontSize: responsiveFontSize(2.2),
  //                   }}>
  //                   {data.rate}{' '}
  //                   <Text
  //                     style={{
  //                       color: 'grey',
  //                       fontSize: responsiveFontSize(1.8),
  //                     }}>
  //                     ${data?.Hourlyrate}
  //                   </Text>
  //                 </Text>
  //               </View>
  //               <View style={styles.box}>
  //                 <Text
  //                   style={{color: '#9FED3A', fontSize: responsiveFontSize(2)}}>
  //                   Hired
  //                 </Text>
  //                 <Text
  //                   style={{
  //                     color: 'white',
  //                     fontSize: responsiveFontSize(2.2),
  //                     verticalAlign: 'middle',
  //                   }}>
  //                   362{' '}
  //                   <Text
  //                     style={{
  //                       color: 'grey',
  //                       fontSize: responsiveFontSize(1.8),
  //                     }}>
  //                     times
  //                   </Text>
  //                 </Text>

  //                 {/* </View> */}
  //               </View>
  //             </View>
  //           </LinearGradient>
  //         </View>
  //       </ImageBackground>
  //       <View style={styles.SpecialitiesContainer}>
  //         <Text style={styles.heading}>Specialities</Text>
  //         <Text style={{color: 'gray', marginBottom: responsiveHeight(1)}}>
  //           Verified by Business
  //         </Text>
  //         {data?.Speciality?.map((item, index) => {
  //           return (
  //             <View key={index}>
  //               <Text style={styles.whiteText}>• {item?.value}</Text>
  //             </View>
  //           );
  //         })}
  //       </View>
  //       <View style={styles.BioContainer}>
  //         <Text style={styles.heading}>Description</Text>

  //         <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
  //           {data?.Bio}
  //         </Text>
  //         <Text
  //           onPress={() => {
  //             setreadmore(!readmore);
  //           }}
  //           style={{color: '#9FED3A'}}>
  //           {readmore ? 'Read more' : 'See less'}
  //         </Text>
  //       </View>
  //       <View style={{marginTop: responsiveHeight(1.5)}}>
  //         <Text
  //           style={{
  //             paddingHorizontal: responsiveWidth(7),
  //             color: 'white',
  //             fontSize: responsiveFontSize(2.2),
  //             fontFamily: FontFamily.Bold,
  //             marginBottom: responsiveHeight(1.5),
  //           }}>
  //           Schedule
  //         </Text>
  //         <FlatList
  //           style={{marginHorizontal: responsiveWidth(6)}}
  //           data={data?.Availiblity}
  //           renderItem={renderItem}
  //           keyExtractor={item => item}
  //           horizontal
  //           showsHorizontalScrollIndicator={false}
  //           contentContainerStyle={{alignItems: 'center'}}
  //         />
  //       </View>
  //       <View style={styles.addressContainer}>
  //         <Text style={styles.heading}>Location</Text>

  //         <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
  //           {data?.Address || 'Address Not Added '}
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           marginBottom: responsiveHeight(5),
  //           alignItems: 'center',
  //         }}>
  //         <Button
  //           text="Book Now"
  //           onPress={() => navigation.navigate('Schedule', {Data: data})}
  //           containerstyles={{}}
  //         />
  //       </View>
  //     </ScrollView>
  //   </WrapperContainer>
  // );

  const videoPosts = posts.filter(p => p.type === 'video');
  const imagePosts = posts.filter(p => p.type === 'image');

  let previewPosts = [];

  if (videoPosts.length > 0) {
    previewPosts = videoPosts.slice(0, 3);
  } else {
    previewPosts = imagePosts.slice(0, 3);
  }
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
          style={{width: responsiveWidth(100), height: responsiveHeight(55)}}
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
                  style={{width: 24, height: 24}}
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
                  Available
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
                  ⭐ {data?.Rating || 4.5}
                </Text>
                <Text style={{color: '#aaa'}}>Rating</Text>
              </View>

              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {data?.followers?.length || 0}
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
                onPress={() => navigation.navigate('Messages')}
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
            {/* <View
              style={{
                alignItems: 'center',
                marginTop: 30,
                height: responsiveHeight(20),
                width: '100',
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#444',
                  padding: 18,
                  borderRadius: 12,
                  width: responsiveWidth(85),
                }}>
                <Text style={{color: '#9FED3A'}}>Hourly Rate</Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    marginTop: 4,
                  }}>
                  ${data?.Hourlyrate}{' '}
                  <Text style={{color: '#aaa'}}> / per hour</Text>
                </Text>
              </View>
            </View> */}
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

            <TouchableOpacity>
              <Text style={{color: '#9FED3A'}}>See all ›</Text>
            </TouchableOpacity>
          </View>

          {/* Dummy Review Card */}
          <View
            style={{
              backgroundColor: '#111',
              borderRadius: 18,
              padding: 15,
              marginTop: 15,
            }}>
            {/* User Info */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{
                  uri: 'https://i.pravatar.cc/150?img=12',
                }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 22,
                  marginRight: 10,
                }}
              />

              <View style={{flex: 1}}>
                <Text style={{color: '#fff', fontWeight: '600'}}>
                  Loynie Brown
                </Text>

                <Text style={{color: '#888', fontSize: 12}}>1 month ago</Text>
              </View>

              {/* Stars */}
              <Text style={{color: '#FFD700', fontSize: 14}}>⭐⭐⭐⭐⭐</Text>
            </View>

            {/* Review Text */}
            <Text style={{color: '#ccc', marginTop: 12, lineHeight: 20}}>
              Great trainer! A lot of knowledge and very professional. Highly
              recommended.
            </Text>
          </View>

          {/* Add Review Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddReviewScreen');
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
