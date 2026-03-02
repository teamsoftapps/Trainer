import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation, useRoute} from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper.js';
import {Images} from '../../utils/Images.js';
import {useGetTrainersQuery} from '../../store/Apis/Post.js';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getDistance} from '../../utils/helperFunction.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MAP_API_KEY} from '../../config/urls.js';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const {width} = Dimensions.get('window');

const SearchTrainer = () => {
  console.log('MAP_API_KEY:', MAP_API_KEY);
  const route = useRoute();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const mapRef = useRef(null);

  const {data} = useGetTrainersQuery();
  const [trainerData, setTrainerData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const authData = useSelector(state => state?.Auth?.data);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Manual Session Token to bypass crypto polyfill crash
  const [sessionToken, setSessionToken] = useState(
    Math.random().toString(36).substring(2, 15),
  );

  const [region, setRegion] = useState({
    latitude: authData?.locationCoordinates?.lat || 37.78825,
    longitude: authData?.locationCoordinates?.lng || -122.4324,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const fetchUnreadTotal = async () => {
    try {
      if (!authData?._id) return;
      const res = await axiosBaseURL.get(
        `/chat/conversation-list/${authData._id}`,
      );
      const list = res.data?.conversations || [];
      const total = list.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      setUnreadTotal(total);
    } catch (e) {
      console.log('Unread total error:', e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadTotal();
      const t = setInterval(fetchUnreadTotal, 10000);
      return () => clearInterval(t);
    }, [authData?._id]),
  );

  useEffect(() => {
    if (data?.data) {
      setTrainerData(data?.data);
      setOriginalData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (route.params?.filters) {
      applyFilters(route.params.filters);
    }
  }, [route.params?.filters]);

  const applyFilters = filters => {
    let filtered = [...originalData];
    if (filters.isAvailable)
      filtered = filtered.filter(t => t.isAvailable === true);
    if (filters.gender)
      filtered = filtered.filter(t => t.gender === filters.gender);
    if (filters.minRating > 0)
      filtered = filtered.filter(t => t.Rating >= filters.minRating);
    if (filters.experience !== 'Any')
      filtered = filtered.filter(t => t.experience === filters.experience);

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'Price (lowest first)':
          filtered.sort((a, b) => Number(a.Hourlyrate) - Number(b.Hourlyrate));
          break;
        case 'Star Rating (highest first)':
          filtered.sort((a, b) => b.Rating - a.Rating);
          break;
      }
    }
    setTrainerData(filtered);
  };

  const handleLocationSelect = details => {
    const {lat, lng} = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
    setRegion(newRegion);
  };

  const safeText = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number')
      return String(value);

    // handle common shapes
    if (typeof value === 'object') {
      if (
        'day' in value &&
        (typeof value.day === 'string' || typeof value.day === 'number')
      ) {
        return String(value.day);
      }
      if (
        'label' in value &&
        (typeof value.label === 'string' || typeof value.label === 'number')
      ) {
        return String(value.label);
      }
      // last resort: don’t crash
      return fallback;
    }

    return fallback;
  };

  const renderTrainerCard = ({item}) => {
    const distance = getDistance(
      authData?.locationCoordinates?.lat,
      authData?.locationCoordinates?.lng,
      item?.location?.coordinates?.[1],
      item?.location?.coordinates?.[0],
    );

    const primarySpeciality = item.Speciality?.[0]?.value || 'Professional';

    const displayTime = safeText(item?.Availiblity?.[0], 'Not Set');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('TrainerProfile', {data: item})}
        style={styles.cardContainer}>
        <Image source={{uri: item.profileImage}} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.trainerName} numberOfLines={1}>
              {item.fullName || 'Trainer'}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={Number(item.Rating) || 0}
              size={10}
              showRating={false}
              isDisabled
            />
          </View>
          <Text style={styles.specialityText} numberOfLines={1}>
            {primarySpeciality} • {item.experience || 'Exp. N/A'}
          </Text>
          <View style={styles.locationRow}>
            <Image source={Images.pin} style={styles.pinIcon} />
            <Text style={styles.locationText}>{distance} mi away</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <MaterialCommunityIcons
                name="cash"
                size={16}
                color="#9FED3A"
                style={{marginRight: 4}}
              />
              <Text style={styles.footerText}>${item.Hourlyrate}/hr</Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#9FED3A"
                style={{marginRight: 4}}
              />
              {/* <Text style={styles.footerText}>{displayTime}</Text> */}
              <Text style={styles.footerText}>
                {safeText(displayTime, 'Not Set')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer style={{flex: 1, backgroundColor: '#000'}}>
      <StatusBar barStyle="light-content" />
      <View style={styles.homeHeader}>
        <Image source={Images.logo} style={styles.homeLogo} />
        <View style={styles.homeHeaderRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            activeOpacity={0.8}>
            <Image
              source={Images.notification}
              style={[
                styles.homeHeaderIcon,
                {height: responsiveHeight(3), width: responsiveWidth(6)},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Chats')}
            activeOpacity={0.8}
            style={{position: 'relative'}}>
            <Image source={Images.messages} style={styles.headerMsgIcon} />
            {unreadTotal > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadTotal > 99 ? '99+' : unreadTotal}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          region={region}
          showsUserLocation
          showsMyLocationButton>
          {trainerData.map(trainer => (
            <Marker
              key={trainer._id}
              coordinate={{
                latitude: Number(trainer?.location?.coordinates?.[1]),
                longitude: Number(trainer?.location?.coordinates?.[0]),
              }}
              onPress={() =>
                navigation.navigate('TrainerProfile', {data: trainer})
              }>
              <View style={styles.customMarker}>
                <Image
                  source={{uri: trainer.profileImage}}
                  style={styles.markerImage}
                />
                <View style={styles.markerRating}>
                  <Text style={styles.markerRatingText}>
                    ★ {trainer.Rating || '0.0'}
                  </Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* FIXED SEARCH OVERLAY */}
        <View style={styles.searchOverlay}>
          <View style={{flex: 1}}>
            <GooglePlacesAutocomplete
              onFail={e => console.log('Places onFail:', e)}
              onNotFound={e => console.log('Places onNotFound:', e)}
              onTimeout={() => console.log('Places timeout')}
              textInputProps={{
                onChangeText: t => console.log('Typing:', t),
              }}
              placeholder="Search City or Zipcode"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) handleLocationSelect(details);
                setSessionToken(Math.random().toString(36).substring(2, 15));
              }}
              query={{
                key: MAP_API_KEY,
                language: 'en',
                components: 'country:us',
                types: '(regions)',
                sessiontoken: sessionToken,
              }}
              enablePoweredByContainer={false}
              styles={{
                textInput: styles.searchBarInput,
                listView: {
                  backgroundColor: 'white',
                  borderRadius: 10,
                  marginTop: 5,
                  elevation: 5,
                  zIndex: 2000,
                },
                container: {flex: 1},
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Filter')}
            style={styles.filterBtn}>
            <Image source={Images.filterr} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={trainerData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={renderTrainerCard}
            snapToInterval={width * 0.75 + 16}
            decelerationRate="fast"
            contentContainerStyle={{paddingHorizontal: 16}}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  homeHeader: {
    height: responsiveHeight(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(7),
  },
  homeLogo: {
    width: responsiveWidth(12),
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  homeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(5),
  },
  homeHeaderIcon: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    tintColor: '#fff',
  },
  headerMsgIcon: {
    height: responsiveHeight(3.3),
    width: responsiveWidth(7),
    tintColor: '#fff',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9FED3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0b0b0b',
  },
  badgeText: {color: '#000', fontSize: 11, fontWeight: '800'},
  mapWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  searchOverlay: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Important for autocomplete list
    zIndex: 1000,
  },
  searchBarInput: {
    height: 54,
    backgroundColor: 'white',
    borderRadius: 27,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#000',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  filterBtn: {
    width: 54,
    height: 54,
    backgroundColor: 'white',
    borderRadius: 27,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  filterIcon: {width: 22, height: 22},
  customMarker: {alignItems: 'center'},
  markerImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: 'white',
  },
  markerRating: {
    backgroundColor: 'white',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: -10,
    elevation: 4,
  },
  markerRatingText: {fontSize: 11, fontWeight: '700'},
  carouselContainer: {position: 'absolute', bottom: 30},
  cardContainer: {
    width: width * 0.75,
    backgroundColor: 'white',
    borderRadius: 24,
    marginRight: 16,
    padding: 10,
    elevation: 6,
  },
  cardImage: {width: '100%', height: 145, borderRadius: 18},
  cardContent: {paddingHorizontal: 4, paddingTop: 10},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerName: {fontWeight: '700', fontSize: 17},
  specialityText: {color: '#666', fontSize: 13},
  locationRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  pinIcon: {width: 14, height: 14, tintColor: '#9FED3A', marginRight: 5},
  locationText: {color: '#888', fontSize: 12},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 10,
  },
  footerItem: {flexDirection: 'row', alignItems: 'center'},
  footerText: {fontSize: 11, color: '#999'},
});

export default SearchTrainer;
