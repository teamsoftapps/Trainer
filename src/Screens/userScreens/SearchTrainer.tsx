import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {FontFamily, Images} from '../../utils/Images';
import {Seartrainer} from '../../utils/Dummy';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {useGetTrainersQuery} from '../../store/Apis/Post';
import axios from 'axios';
import {MAP_API_KEY} from '../../config/urls';

const trainers = [
  {
    id: '4',
    img: require('../../assets/Images/trainer4.jpg'),
    rating: '5',
    star: require('../../assets/Images/Starrr.png'),
    lat: 37.787979,
    lng: -122.43341,
  },
  {
    id: '1',
    img: require('../../assets/Images/2.png'),
    rating: '3',
    star: require('../../assets/Images/Starrr.png'),
    lat: 37.788733,
    lng: -122.435286,
  },
  {
    id: '2',
    img: require('../../assets/Images/3.png'),
    rating: '5',
    star: require('../../assets/Images/Starrr.png'),
    lat: 37.789136,
    lng: -122.431858,
  },

  {
    id: '3',
    img: require('../../assets/Images/Mask.png'),
    rating: '4',
    star: require('../../assets/Images/Starrr.png'),
    lat: 37.788191,
    lng: -122.431507,
  },
];

const SearchTrainer = () => {
  const [location, setLocation] = useState(null);
  const [trainerData, settrainerData] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const {data, isLoading} = useGetTrainersQuery();
  const [region, setRegion] = useState({
    latitude: 41.8719,
    longitude: 12.5674,
    latitudeDelta: 5.0,
    longitudeDelta: 5.0,
  });
  const [coordinates, setCoordinates] = useState([]);

  const fetchCoordinates = async trainer => {
    try {
      if (trainer?.Address) {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${trainer.Address}&key=${MAP_API_KEY}`
        );
        console.log('Location Data', response);
        if (response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;

          // Add the coordinates to the state for each trainer
          setCoordinates(prevState => [
            ...prevState,
            {
              id: trainer?._id,
              lat: location.lat,
              lng: location.lng,
              profileImage: trainer?.profileImage, // Including image or other data
            },
          ]);
        } else {
          console.error('No results found for the provided address.');
        }
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // useEffect to run the fetchCoordinates for each trainer in the data
  useEffect(() => {
    if (trainerData?.length) {
      trainerData.forEach(
        trainer => (
          fetchCoordinates(trainer), console.log('Trainer For Each', trainer)
        )
      );
    }
  }, [trainerData]);
  useEffect(() => {
    getCurrentLocation();
    getPosts();
  }, []);
  const getPosts = async () => {
    try {
      const res = await data;
      // console.log('ALL', res);
      settrainerData(res?.data);
    } catch (error) {
      console.log('Errorr', error);
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
        },
        error => {
          // console.log(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );
    }
  };

  const scrollToItem = index => {
    // console.log('indexx', index);
    flatListRef.current.scrollToIndex({index, animated: true});
  };

  return (
    <WrapperContainer style={{flex: 1}}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveWidth(5),
          }}>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={Images.notification} style={styles.notifiaction} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={Images.messages} style={styles.notifiaction} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          borderTopLeftRadius: responsiveHeight(4),
          borderTopRightRadius: responsiveHeight(4),
          overflow: 'hidden',
          flex: 1,
          justifyContent: 'space-between',
          paddingVertical: responsiveHeight(3),
          zIndex: 100,
        }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.788733,
            longitude: -122.435286,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {coordinates.map((trainer: any, index) => (
            <Marker
              key={trainer?._id}
              coordinate={{latitude: trainer?.lat, longitude: trainer?.lng}}
              onPress={() => console.log('Marker pressed', trainer?._id)}>
              <Image
                source={{uri: trainer?.profileImage}}
                style={{
                  width: responsiveWidth(18),
                  height: responsiveWidth(18),
                  borderWidth: responsiveHeight(0.8),
                  borderColor: '#fff',
                  borderRadius: responsiveWidth(2),
                  overflow: 'hidden',
                }}
              />
            </Marker>
          ))}
        </MapView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(6),
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchInput')}
            activeOpacity={0.9}
            style={styles.trainerSearch}>
            <Image source={Images.search} style={styles.searchimage} />
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                paddingHorizontal: responsiveWidth(2),
                color: 'gray',
              }}>
              Search for trainers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('Filter');
            }}>
            <Image
              source={Images.filterr}
              style={{
                width: responsiveWidth(14),
                height: responsiveWidth(14),
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={trainerData}
            keyExtractor={item => item._id}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    navigation.navigate('TrainerProfile', {data: item});
                  }}
                  style={{
                    width: responsiveWidth(65),
                    height: responsiveWidth(60),
                    borderRadius: responsiveWidth(4),
                    backgroundColor: '#fff',
                    marginHorizontal: responsiveWidth(2),
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      height: '50%',
                      overflow: 'hidden',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}>
                    <Image
                      resizeMode="contain"
                      src={item.profileImage}
                      style={{
                        height: '100%',
                        width: '100%',
                        flex: 1,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      padding: responsiveWidth(2),
                      flex: 1,
                      // gap: responsiveHeight(),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Text style={styles.Name}>
                          {item.fullName.length > 10
                            ? `${item.fullName.slice(0, 8)}...`
                            : item.fullName}
                        </Text>
                        {/* <Text style={styles.desc}>
                          {item?.Speciality?.[0]?.value.length > 8
                            ? `${item?.Speciality?.[0]?.value.slice(0, 10)}...`
                            : item?.Speciality?.[0]?.value || 'Not available'}
                        </Text> */}
                      </View>

                      <View>
                        <View style={[{...styles.bottomSubView}]}>
                          <AirbnbRating
                            size={responsiveHeight(1.4)}
                            selectedColor="#9FED3A"
                            showRating={false}
                            isDisabled
                            defaultRating={item.Rating}
                          />
                        </View>
                        <View style={[{...styles.bottomSubView}]}>
                          <Image source={Images.pin} style={styles.pin} />
                          <Text style={styles.rating}>{item.location}</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: responsiveHeight(0.1),
                        backgroundColor: 'lightgray',
                        marginVertical: responsiveHeight(2),
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                          <Image
                            source={require('../../assets/Images/calendar.png')}
                            style={{
                              tintColor: '#9FED3A',
                              resizeMode: 'contain',
                              marginRight: responsiveWidth(1),
                              height: responsiveWidth(3),
                              width: responsiveWidth(3),
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: responsiveFontSize(1.5),
                              fontFamily: FontFamily.Regular,
                            }}>
                            MON - FRI
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                          <Image
                            source={require('../../assets/Images/clock.png')}
                            style={{
                              tintColor: '#9FED3A',
                              resizeMode: 'cover',
                              marginRight: responsiveWidth(1),
                              height: responsiveWidth(3),
                              width: responsiveWidth(3),
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: responsiveFontSize(1.5),
                              fontFamily: FontFamily.Regular,
                            }}>
                            10:00 - 18:00
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default SearchTrainer;

const styles = StyleSheet.create({
  notifiaction: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
  header: {
    height: responsiveHeight(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: responsiveWidth(7),
  },
  trainerSearch: {
    width: responsiveWidth(70),
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
  },
  searchimage: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  Name: {
    fontFamily: FontFamily.Bold,
    color: '#000',
    fontSize: responsiveFontSize(2),
  },
  desc: {
    color: 'gray',
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(0.5),
  },
  bottomSubView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  rating: {
    color: 'gray',
    fontSize: responsiveFontSize(1.7),
  },
  pin: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    resizeMode: 'contain',
    tintColor: '#9FED3A',
  },
  font: {
    fontSize: responsiveFontSize(1.7),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
