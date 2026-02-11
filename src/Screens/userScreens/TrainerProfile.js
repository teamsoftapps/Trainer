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
const TrainerProfile = ({route}) => {
  const {data, booking} = route.params;
  console.log('Route Data Is Found======', data);

  const [bookingTime, setbookingTime] = useState([]);
  const [readmore, setreadmore] = useState(true);
  const [heart, setheart] = useState(false);
  const navigation = useNavigation();
  const {isFollow, unFollow, loading: loadingFollow} = followingHook();
  const authData = useSelector(state => state?.Auth.data);
  const token = useSelector(state => state?.Auth?.data?.token);
  const checkFollowed = useSelector(state => state?.follow);
  console.log('auth data in trainer profile:', authData);
  const dispatch = useDispatch();
  const [filtered, setfiltered] = useState();
  const {Bookings} = useSelector(state => state?.bookings);
  console.log('Redux Trainer Booking', Bookings);

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

  useFocusEffect(
    useCallback(() => {
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
    }, [token, checkFollowed]),
  );

  const fetchFavoriteTrainers = async () => {
    if (authData.isType === 'user') {
      try {
        const res = await axiosBaseURL.get(
          `/user/Getfavoritetrainers/${authData?._id}`,
        );
        console.log('Favourites', res?.data?.data);

        // Correct filtering logic
        const filtered = res?.data?.data?.filter(
          item => item.trainerID === data?._id, // Ensure you're comparing correctly
        );

        console.log('Filtered Trainers', filtered);
        setfiltered(filtered); // Use the correct variable name
        // setFavoriteTrainers(res?.data?.data); // Uncomment if needed
      } catch (error) {
        // console.error('Error fetching favorite trainers:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteTrainers();
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

    // return console.log('ID', trainerID);
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
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={() => {
                      !checkFollowed.follow.includes(data._id)
                        ? handleFollow()
                        : handleUnFollow();
                    }}
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveWidth(10),
                      backgroundColor: checkFollowed?.follow.includes(data?._id)
                        ? '#d7d7d7'
                        : '#9FED3A',
                      marginBottom: responsiveHeight(1),
                    }}>
                    <Text style={styles.blacktext}>
                      {loadingFollow
                        ? 'Waiting...'
                        : checkFollowed?.follow.includes(data?._id)
                          ? 'Following'
                          : 'Follow +'}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{fontSize: responsiveFontSize(1.8), color: 'white'}}>
                    {data?.followers?.length > 0
                      ? checkFollowed?.follow.length
                      : 0}
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
                    onPress={() => {
                      navigation.navigate('Messages');
                    }}
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
                    {data?.Dob ? age : '--'}
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
          {data?.Speciality?.map((item, index) => {
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
