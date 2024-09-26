import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {FontFamily, Images} from '../utils/Images';
import {Seartrainer} from '../utils/Dummy';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
const SearchTrainer = () => {
  const [Search, setSearch] = useState('');
  const navigation = useNavigation();

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
        }}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}></MapView>
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

        <View>
          <FlatList
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
