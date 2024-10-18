import {
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
import {useCreateChatMutation} from '../../store/Apis/chat';
import {RootState} from '@reduxjs/toolkit/query/react';
const TrainerProfile = ({route}) => {
  const {data, booking} = route.params;
  console.log('Route Data Is Found======', data);
  // console.log('Route Bookings Is Found======', booking);
  // const {dataa, isLoading} = useGetUsersQuery();
  const [bookingTime, setbookingTime] = useState<string[]>([]);
  const [readmore, setreadmore] = useState(true);
  const [follow, setfollow] = useState(false);
  const [heart, setheart] = useState(false);
  const navigation = useNavigation();
  const authData = useSelector(state => state?.Auth.data);
  const dispatch = useDispatch();
  const isFollowing = useSelector((state: RootState) => state.follow[data._id]);
  const [favouriteTrainers, setFavoriteTrainers] = useState([]);
  const [filtered, setfiltered] = useState();
  const isFavourite = useSelector(
    (state: RootState) => state.favourite[data._id]
  );
  const {Bookings} = useSelector(state => state?.bookings);
  console.log('Redux Trainer Booking', Bookings);
  const [createChat] = useCreateChatMutation();
  const onFollow = async () => {
    if (authData.isType === 'user') {
      try {
        if (isFollowing) {
          await axiosBaseURL.post('/user/removeFollowedTrainers', {
            userId: authData._id,
            trainerID: data._id,
          });
          dispatch(unfollowTrainer({trainerID: data._id}));
        } else {
          const res = await axiosBaseURL.post('/user/followedTrainers', {
            userId: authData._id,
            trainerID: data._id,
            name: data.fullName,
            rating: '3',
            isFollow: true,
          });
          console.log('Follow Responsse', res);
          dispatch(followTrainer({trainerID: data._id}));
        }
      } catch (error) {
        console.error('Error in follow/unfollow action:', error);
      }
    }
  };
  const fetchFavoriteTrainers = async () => {
    if (authData.isType === 'user') {
      try {
        const res = await axiosBaseURL.get(
          `/user/Getfavoritetrainers/${authData?._id}`
        );
        console.log('Favourites', res?.data?.data);

        // Correct filtering logic
        const filtered = res?.data?.data?.filter(
          (item: {trainerID: any}) => item.trainerID === data?._id // Ensure you're comparing correctly
        );

        console.log('Filtered Trainers', filtered);
        setfiltered(filtered); // Use the correct variable name
        // setFavoriteTrainers(res?.data?.data); // Uncomment if needed
      } catch (error) {
        console.error('Error fetching favorite trainers:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteTrainers();
    }, [heart])
  );

  const AddFavouriteTrainer = async () => {
    if (authData.isType === 'user') {
      try {
        // Ensure 'filtered' is an array before using it
        var isFavorite =
          filtered &&
          filtered.some(
            (item: {trainerID: any}) => item.trainerID === data?._id
          );

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

  const renderItem = ({item, index}: {item: string; index: number}) => {
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
      const timeArray = Bookings?.map((item: any) => item?.bookingTime);
      setbookingTime(timeArray);
    }
  }, [Bookings]);
  const onPressMessage = async () => {
    let payload = {
      userId: data._id,
      type: data.isType,
    };
    try {
      const res = await createChat(payload);

      if (res?.data.data) {
        navigation.navigate('Messages', {
          name: data?.fullName,
          profile: data?.profileImage,
          id: res?.data.data._id,
        });
      }
    } catch (error) {
      console.log('Successfull Error', error);
    }
  };
  // const exists = filtered?.includes(data?._id);
  // const exists = filtered?.some(trainer => trainer._id === data?._id);
  const isFavorite =
    filtered && filtered.some(item => item.trainerID === data?._id);
  return (
    <WrapperContainer style={{backgroundColor: 'black'}}>
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          source={Images.ProfileBG}
          style={{width: responsiveWidth(100)}}>
          <StatusBar hidden />
          <View style={{flex: 1}}>
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
                    AddFavouriteTrainer();
                    // setheart(!heart);
                  }}>
                  <Image
                    source={isFavorite ? Images.heart_filled : Images.fav_heart}
                    resizeMode="contain"
                    style={{
                      width: responsiveWidth(6),
                      height: responsiveWidth(6),
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: responsiveHeight(1),
                }}>
                <Image
                  src={data?.profileImage}
                  style={{
                    width: responsiveWidth(28),
                    borderRadius: 70,
                    height: responsiveWidth(28),
                    borderWidth: 1.4,
                    borderColor: 'white',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{fontSize: responsiveFontSize(3.5), color: 'white'}}>
                  {data?.fullName}
                </Text>

                <Text
                  style={{
                    fontSize: responsiveFontSize(1.8),
                    color: 'white',
                    marginTop: responsiveHeight(-1.2),
                  }}>
                  Certified Personal trainer
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: responsiveWidth(4),
                    marginTop: responsiveHeight(1.5),
                  }}>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data?.Speciality?.[0]?.value}
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
                      borderRadius: responsiveWidth(10),
                      backgroundColor: '#9FED3A',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>Available</Text>
                  </View>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data?.Rating ? data?.Rating : '--'}
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
                      onFollow();
                    }}
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveWidth(10),
                      backgroundColor: isFollowing ? '#9FED3A' : 'white',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>
                      {isFollowing ? 'Following' : 'Follow +'}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data?.Followers > 0 ? data?.Followers : 0}
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
                  <TouchableOpacity
                    onPress={onPressMessage}
                    activeOpacity={0.8}
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveWidth(10),
                      backgroundColor: '#9FED3A',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>Message</Text>
                  </TouchableOpacity>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data?.Yearsold ? data?.Yearsold : '--'}
                  </Text>

                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      color: 'white',
                    }}>
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

                  <Text
                    style={{
                      color: 'white',
                      fontSize: responsiveFontSize(2.2),
                    }}>
                    {data.rate}{' '}
                    <Text
                      style={{
                        color: 'grey',
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      ${data?.Hourlyrate}
                    </Text>
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text
                    style={{color: '#9FED3A', fontSize: responsiveFontSize(2)}}>
                    Hired
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: responsiveFontSize(2.2),
                      verticalAlign: 'middle',
                    }}>
                    362{' '}
                    <Text
                      style={{
                        color: 'grey',
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      times
                    </Text>
                  </Text>

                  {/* </View> */}
                </View>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
        <View style={styles.SpecialitiesContainer}>
          <Text style={styles.heading}>Specialities</Text>
          <Text style={{color: 'gray', marginBottom: responsiveHeight(1)}}>
            Verified by Business
          </Text>
          {data?.Speciality?.map((item: string, index: number) => {
            return (
              <View key={index}>
                <Text style={styles.whiteText}>• {item?.value}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.BioContainer}>
          <Text style={styles.heading}>Description</Text>

          <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
            {data?.Bio}
          </Text>
          <Text
            onPress={() => {
              setreadmore(!readmore);
            }}
            style={{color: '#9FED3A'}}>
            {readmore ? 'Read more' : 'See less'}
          </Text>
        </View>
        <View style={{marginTop: responsiveHeight(1.5)}}>
          <Text
            style={{
              paddingHorizontal: responsiveWidth(7),
              color: 'white',
              fontSize: responsiveFontSize(2.2),
              fontFamily: FontFamily.Bold,
              marginBottom: responsiveHeight(1.5),
            }}>
            Schedule
          </Text>
          <FlatList
            style={{marginHorizontal: responsiveWidth(6)}}
            data={data?.Availiblity}
            renderItem={renderItem}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
          />
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.heading}>Location</Text>

          <Text numberOfLines={readmore ? 4 : 13} style={styles.whiteText}>
            {data?.Address || 'Address Not Added '}
          </Text>
        </View>
        <View
          style={{
            marginBottom: responsiveHeight(5),
            alignItems: 'center',
          }}>
          <Button
            text="Book Now"
            onPress={() => navigation.navigate('Schedule', {Data: data})}
            containerstyles={{}}
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
