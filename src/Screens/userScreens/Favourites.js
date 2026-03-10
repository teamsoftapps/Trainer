import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import {useDispatch, useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {unfavouriteTrainer} from '../../store/Slices/favourite';
import {useGetTrainersQuery} from '../../store/Apis/Post';

const Favourites = () => {
  const [isLong, setIsLong] = useState(false);
  const [longPressIndex, setLongPressIndex] = useState(null);
  const [favouriteTrainers, setFavoriteTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const authData = useSelector(state => state.Auth.data);
  const textInputRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {data: allTrainersData} = useGetTrainersQuery();

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteTrainers();
    }, []),
  );

  const fetchFavoriteTrainers = async () => {
    if (authData.isType === 'user') {
      try {
        setIsLoading(true);
        const res = await axiosBaseURL.get(
          `/user/Getfavoritetrainers/${authData._id}`,
        );
        setFavoriteTrainers(res.data.data);
      } catch (error) {
        console.log('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteFavouriteTrainers = async (trainerID, userId) => {
    try {
      await axiosBaseURL.delete('/user/Deletefavoritetrainers', {
        data: {userId, trainerID},
      });
      dispatch(unfavouriteTrainer({trainerID: trainerID}));
      setFavoriteTrainers(prevTrainers =>
        prevTrainers.filter(trainer => trainer.trainerID !== trainerID),
      );
      setLongPressIndex(null);
    } catch (error) {
      console.log('Error deleting favorite:', error);
    }
  };

  const filteredData = useMemo(() => {
    if (!allTrainersData?.data) return [];

    // 1. Filter out deleted trainers
    const validFavorites = favouriteTrainers.filter(fav =>
      allTrainersData.data.some(t => t._id === fav.trainerID),
    );

    // 2. Filter by search text
    const toLowerCase = searchText.toLowerCase();
    return validFavorites.filter(item => {
      return item?.name?.toLowerCase().includes(toLowerCase);
    });
  }, [searchText, favouriteTrainers, allTrainersData]);

  const renderItem = ({item, index}) => {
    const isLongPressed = longPressIndex === index;

    console.log('Item in favourite screen:', item);

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => setLongPressIndex(index)}
          onPress={() => {
            const fullData = allTrainersData?.data?.find(
              t => t._id === item.trainerID,
            );
            if (fullData) {
              navigation.navigate('TrainerProfile', {data: fullData});
            } else {
              // fallback if not found in cache
              navigation.navigate('TrainerProfile', {
                trainerId: item.trainerID,
                data: item,
              });
            }
          }}
          style={styles.card}>
          {/* REMOVE BUTTON ON LONG PRESS */}
          {isLongPressed && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() =>
                deleteFavouriteTrainers(item.trainerID, item.userId)
              }>
              <Image
                source={require('../../assets/Images/remove.png')}
                style={styles.removeIcon}
              />
            </TouchableOpacity>
          )}

          <View style={styles.imageWrapper}>
            <Image
              source={{uri: item?.trainerProfile}}
              style={styles.trainerImg}
              resizeMode="cover"
            />
            <View style={styles.heartBadge}>
              <Image
                source={Images.Heart_filled}
                style={styles.heartIcon}
                tintColor={'#ff4d4d'}
              />
            </View>
          </View>

          <View style={styles.cardInfo}>
            <Text numberOfLines={1} style={styles.trainerName}>
              {item.name}
            </Text>
            <View style={styles.ratingRow}>
              <Image source={Images.Star} style={styles.starIcon} />
              <Text style={styles.ratingText}>{item.rating || '0.0'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <WrapperContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favouriteTrainers.length} trainers you love
          </Text>
        </View>
        <Image source={Images.logo} style={styles.logo} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Image source={Images.search} style={styles.searchIcon} />
          <TextInput
            ref={textInputRef}
            placeholder="Find a trainer..."
            placeholderTextColor={'#777'}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LIST */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9FED3A" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image
                source={Images.Heart_filled}
                style={styles.emptyIcon}
                tintColor="#333"
              />
              <Text style={styles.emptyText}>
                {searchText
                  ? 'No trainers match your search'
                  : 'No favorites yet'}
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('Home')}>
                <Text style={styles.exploreText}>Explore Trainers</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {longPressIndex !== null && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() => setLongPressIndex(null)}
        />
      )}
    </WrapperContainer>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: '#777',
    fontSize: 14,
    marginTop: 2,
  },
  logo: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 25,
    marginBottom: 20,
    gap: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#777',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
  },
  clearText: {
    color: '#9FED3A',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  cardContainer: {
    width: '50%',
    padding: 8,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    elevation: 5,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  trainerImg: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 6,
    borderRadius: 12,
  },
  heartIcon: {
    width: 14,
    height: 14,
  },
  cardInfo: {
    alignItems: 'center',
    width: '100%',
  },
  trainerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFD700',
  },
  ratingText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#0b0b0b',
  },
  removeIcon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  emptyText: {
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  exploreBtn: {
    marginTop: 25,
    backgroundColor: '#9FED3A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  exploreText: {
    color: '#000',
    fontWeight: '700',
  },
});
