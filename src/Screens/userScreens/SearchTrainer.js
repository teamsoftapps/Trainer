import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper.js';
import {Images} from '../../utils/Images.js';
import {useGetTrainersQuery} from '../../store/Apis/Post.js';

const {width} = Dimensions.get('window');

const SearchTrainer = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const {data} = useGetTrainersQuery();
  const [trainerData, setTrainerData] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setTrainerData(data.data);
    }
  }, [data]);

  const renderTrainerCard = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('TrainerProfile', {data: item})}
      style={styles.cardContainer}>
      <Image source={{uri: item.profileImage}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.trainerName} numberOfLines={1}>
            {item.fullName}
          </Text>
          <View style={styles.ratingRow}>
            <AirbnbRating
              count={5}
              defaultRating={item.Rating || 5}
              size={10}
              showRating={false}
              isDisabled
            />
          </View>
        </View>
        <Text style={styles.specialityText}>
          {item.experience || 'Professional'} Trainer
        </Text>
        <View style={styles.locationRow}>
          <Image source={Images.pin} style={styles.pinIcon} />
          <Text style={styles.locationText}>0.43 mi</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/Images/calendar.png')}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>MON - FRI</Text>
          </View>
          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/Images/clock.png')}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>10:00 - 18:00</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <WrapperContainer style={{flex: 1, backgroundColor: '#000'}}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={Images.logo} style={styles.logo} />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={Images.notification} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.messages} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: trainerData[0]?.location?.coordinates[1] || 37.78825,
            longitude: trainerData[0]?.location?.coordinates[0] || -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {trainerData.map(trainer => {
            console.log('trainer data in mao function:', trainer);
            // Extracting from your data: [longitude, latitude]
            const longitude = trainer.location?.coordinates[0];
            const latitude = trainer.location?.coordinates[1];

            if (!latitude || !longitude) return null;

            return (
              <Marker
                key={trainer._id}
                coordinate={{latitude, longitude}}
                onPress={() => {
                  // Optional: scroll FlatList to this trainer
                }}>
                <View style={styles.customMarker}>
                  <Image
                    source={{uri: trainer.profileImage}}
                    style={styles.markerImage}
                  />
                  <View style={styles.markerRating}>
                    <Text style={styles.markerRatingText}>
                      ★ {trainer.Rating || '5.0'}
                    </Text>
                  </View>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.searchOverlay}>
          <View style={styles.searchBar}>
            <Image source={Images.search} style={styles.searchIcon} />
            <Text style={styles.searchText}>Search for trainers</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
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
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  logo: {height: 42, width: 42, borderRadius: 21},
  headerIcons: {flexDirection: 'row', gap: 18},
  icon: {width: 26, height: 26, tintColor: 'white'},
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
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 54,
    backgroundColor: 'white',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: {width: 22, height: 22, tintColor: '#888'},
  searchText: {marginLeft: 12, color: '#888'},
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
  footerIcon: {width: 14, height: 14, tintColor: '#9FED3A', marginRight: 6},
  footerText: {fontSize: 11, color: '#999'},
});

export default SearchTrainer;
