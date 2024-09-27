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
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {FontFamily, Images} from '../utils/Images';
import {Seartrainer} from '../utils/Dummy';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
const trainers = [
  {
    id: '4',
    img: require('../assets/Images/trainer4.jpg'),
    rating: '5',
    star: require('../assets/Images/Starrr.png'),
    lat: 37.787979,
    lng: -122.43341,
  },
  {
    id: '1',
    img: require('../assets/Images/2.png'),
    rating: '3',
    star: require('../assets/Images/Starrr.png'),
    lat: 37.788733,
    lng: -122.435286,
  },
  {
    id: '2',
    img: require('../assets/Images/3.png'),
    rating: '5',
    star: require('../assets/Images/Starrr.png'),
    lat: 37.789136,
    lng: -122.431858,
  },

  {
    id: '3',
    img: require('../assets/Images/Mask.png'),
    rating: '4',
    star: require('../assets/Images/Starrr.png'),
    lat: 37.788191,
    lng: -122.431507,
  },
];

const SearchTrainer = () => {
  const [location, setLocation] = useState(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );
    }
  };

  const scrollToItem = index => {
    console.log('indexx', index);
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
          {trainers.map((trainer, index) => (
            <Marker
              key={trainer.id}
              coordinate={{latitude: trainer.lat, longitude: trainer.lng}}
              onPress={() => scrollToItem(index)}>
              <Image
                source={trainer.img}
                style={{width: 40, height: 40, borderRadius: 20}}
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
        {/* <View
          style={{
            zIndex: 1000,
            height: responsiveHeight(10),
            position: 'absolute',
            flexDirection: 'column',
          }}>
          <FlatList
            style={{position: 'absolute'}}
            horizontal
            data={trainers.slice(0, 2)}
            renderItem={({index, item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',

                    marginVertical: responsiveHeight(30),
                    width: responsiveWidth(50),
                  }}>
                  <TouchableOpacity
                    onPress={() => scrollToItem(index + 1)}
                    style={{position: 'relative'}}>
                    <Image
                      source={item.img}
                      style={{
                        borderColor: '#fff',
                        borderWidth: responsiveWidth(1.3),
                        borderRadius: responsiveWidth(6),
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: responsiveHeight(6),
                        left: responsiveWidth(5),
                        backgroundColor: 'white',
                        borderRadius: responsiveWidth(2),
                        padding: responsiveWidth(1),
                        gap: responsiveWidth(1),
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.5),
                          fontWeight: '600',
                        }}>
                        {item.rating}
                      </Text>
                      <Image
                        source={item.star}
                        style={{
                          tintColor: 'orange',
                          height: responsiveHeight(1.5),
                          width: responsiveWidth(3),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <FlatList
            style={{position: 'absolute'}}
            horizontal
            data={trainers.slice(2, 4)}
            renderItem={({index, item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: responsiveHeight(14),
                    width: responsiveWidth(40),
                  }}>
                  <TouchableOpacity
                    onPress={() => scrollToItem(3)}
                    style={{position: 'relative'}}>
                    <Image
                      source={item.img}
                      style={{
                        borderColor: '#fff',
                        borderWidth: responsiveWidth(1.3),
                        borderRadius: responsiveWidth(6),
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: responsiveHeight(6),
                        left: responsiveWidth(5),
                        backgroundColor: 'white',
                        borderRadius: responsiveWidth(2),
                        padding: responsiveWidth(1),
                        gap: responsiveWidth(1),
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.5),
                          fontWeight: '600',
                        }}>
                        {item.rating}
                      </Text>
                      <Image
                        source={item.star}
                        style={{
                          tintColor: 'orange',
                          height: responsiveHeight(1.5),
                          width: responsiveWidth(3),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View> */}
        <View>
          <FlatList
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={Seartrainer}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: responsiveWidth(60),
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
                      //   resizeMode="stretch"
                      source={item.image}
                      style={{
                        height: '100%',
                        width: '100%',
                        flex: 1,
                      }}
                    />
                  </View>

                  <View style={{padding: responsiveWidth(2)}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Text style={styles.Name}>{item.name}</Text>
                        <Text style={styles.desc}>
                          Strength: {item.expertise}
                        </Text>
                      </View>

                      <View>
                        <View style={[{...styles.bottomSubView}]}>
                          <AirbnbRating
                            size={responsiveHeight(1.4)}
                            selectedColor="#9FED3A"
                            showRating={false}
                            isDisabled
                            defaultRating={item.rating}
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
                            source={require('../assets/Images/calendar.png')}
                            style={{
                              tintColor: '#9FED3A',
                              resizeMode: 'contain',
                              marginRight: responsiveWidth(1),
                              height: responsiveHeight(3),
                              width: responsiveWidth(3),
                            }}
                          />
                        </View>
                        <View>
                          <Text>MON - FRI</Text>
                        </View>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                          <Image
                            source={require('../assets/Images/clock.png')}
                            style={{
                              tintColor: '#9FED3A',
                              resizeMode: 'cover',
                              marginRight: responsiveWidth(1),
                              height: responsiveHeight(2),
                              width: responsiveWidth(3),
                            }}
                          />
                        </View>
                        <View>
                          <Text>10:00 - 18:00</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
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
