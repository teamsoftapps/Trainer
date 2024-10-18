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
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import {useDispatch, useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {unfavouriteTrainer} from '../../store/Slices/favourite';

const fav = [
  {name: 'Max Well', image: Images.trainer, rating: 3.4},
  {name: 'Max Daniel', image: Images.trainer2, rating: 4},
  {name: 'Amber Julia', image: Images.trainer3, rating: 5},
  {name: 'Nicole Foster', image: Images.trainer4, rating: 2.4},
  {name: 'Joseph Buran', image: Images.trainer2, rating: 1.4},
  {name: 'Mark Rafael', image: Images.trainer2, rating: 4.3},
  {name: 'Richard Moors', image: Images.trainer2, rating: 4},
];

const Favourites = () => {
  const [isLong, setIsLong] = useState(false);
  const [longPressIndex, setLongPressIndex] = useState(null);
  const [favouriteTrainers, setFavoriteTrainers] = useState([]);
  console.log('favouriteTrainers', favouriteTrainers);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const authData = useSelector(state => state.Auth.data);
  const textInputRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteTrainers();
    }, [])
  );

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#fff'} />
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No Chat found
          </Text>
        )}
      </View>
    );
  };

  const fetchFavoriteTrainers = async () => {
    if (authData.isType === 'user') {
      try {
        const res = await axiosBaseURL.get(
          `/user/Getfavoritetrainers/${authData._id}`
        );
        setFavoriteTrainers(res.data.data);
      } catch (error) {}
    }
  };

  const deleteFavouriteTrainers = async (trainerID, userId) => {
    try {
      const res = await axiosBaseURL.delete('/user/Deletefavoritetrainers', {
        data: {userId, trainerID},
      });
      setIsLoading(false);
      dispatch(unfavouriteTrainer({trainerID: trainerID}));
      setFavoriteTrainers(prevTrainers =>
        prevTrainers.filter(trainer => trainer._id !== trainerID)
      );
      setIsLong(false);
    } catch (error) {}
  };

  const filteredData = useMemo(() => {
    const toLowerCase = searchText.toLowerCase();
    return favouriteTrainers.filter(item => {
      return item?.name?.toLowerCase().includes(toLowerCase);
    });
  }, [searchText, favouriteTrainers]);

  return (
    <WrapperContainer>
      <Text
        style={{
          fontSize: responsiveFontSize(3.5),
          color: 'white',
          marginLeft: responsiveWidth(6),
          marginTop: responsiveHeight(2),
        }}>
        Favorites
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: responsiveWidth(8),
          marginTop: responsiveHeight(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#232323',
            paddingHorizontal: responsiveWidth(4),
            borderRadius: 25,
            gap: responsiveWidth(4),
          }}>
          <TouchableOpacity activeOpacity={0.6}>
            <Image
              source={Images.search}
              style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
            />
          </TouchableOpacity>
          <TextInput
            ref={textInputRef}
            placeholder="Search"
            placeholderTextColor={'white'}
            style={{
              fontSize: responsiveScreenFontSize(2.2),
              width: responsiveWidth(52),
              color: 'white',
            }}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            searchText.length > 0 ? setSearchText('') : navigation.goBack();
          }}>
          <Text style={{color: 'white'}}>
            {searchText.length > 0 ? 'Clear' : ' Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          ListEmptyComponent={listemptyComp}
          data={filteredData}
          extraData={filteredData}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: responsiveWidth(3),
            alignSelf: 'center',
          }}
          style={{
            marginLeft: responsiveWidth(2),
            marginTop: responsiveHeight(3),
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onLongPress={() => {
                  setLongPressIndex(index);
                }}
                style={{
                  alignItems: 'center',
                  width: responsiveWidth(30),
                  backgroundColor: '#232323',
                  borderRadius: 8,
                  paddingVertical: responsiveHeight(1),
                  paddingHorizontal: responsiveWidth(4),
                }}>
                {longPressIndex === index && (
                  <TouchableOpacity
                    style={{
                      marginLeft: responsiveWidth(20),
                    }}
                    onPress={() => {
                      deleteFavouriteTrainers(item.trainerID, item.userId);
                      setLongPressIndex(null);
                    }}>
                    <Image
                      style={{
                        height: responsiveHeight(3),
                      }}
                      resizeMode="center"
                      source={require('../../assets/Images/remove.png')}
                    />
                  </TouchableOpacity>
                )}
                <View>
                  <Image
                    source={{uri: item?.trainerProfile}}
                    style={{
                      width: responsiveWidth(20),
                      borderRadius: 80,
                      height: responsiveWidth(20),
                    }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      paddingHorizontal: 5.5,
                      borderRadius: 50,
                    }}>
                    <Image
                      source={Images.Heart_filled}
                      style={{
                        width: responsiveWidth(5),
                      }}
                      tintColor={'red'}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                  }}>
                  {item.name.split(' ')[0]}
                </Text>
                <View style={{flexDirection: 'row', gap: responsiveWidth(2)}}>
                  <Image
                    source={Images.Star}
                    resizeMode="contain"
                    style={{width: responsiveWidth(4)}}
                  />
                  <Text
                    style={{color: 'white', fontSize: responsiveFontSize(2)}}>
                    {item.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        {/* <FlatList
          data={favouriteTrainers}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: responsiveWidth(3),
            alignSelf: 'center',
          }}
          style={{
            marginLeft: responsiveWidth(2),
            marginTop: responsiveHeight(3),
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onLongPress={() => {
                  setIsLong(true);
                }}
                style={{
                  alignItems: 'center',
                  width: responsiveWidth(30),
                  backgroundColor: '#232323',
                  borderRadius: 8,
                  paddingVertical: responsiveHeight(1),
                  paddingHorizontal: responsiveWidth(4),
                }}>
                {isLong && (
                  <TouchableOpacity
                    // style={{marginLeft: responsiveWidth(20)}}
                    onPress={() => {
                      deleteFavouriteTrainers(item.trainerID, item.userId);
                    }}>
                    <Image
                      style={{height: responsiveHeight(3)}}
                      resizeMode="center"
                      source={require('../../assets/Images/remove.png')}
                    />
                  </TouchableOpacity>
                )}
                <View>
                  <Image
                    source={require('../../assets/Images/3.png')}
                    style={{
                      width: responsiveWidth(20),
                      borderRadius: 80,
                      height: responsiveWidth(20),
                    }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      paddingHorizontal: 5.5,
                      borderRadius: 50,
                    }}>
                    <Image
                      source={Images.Heart_filled}
                      style={{
                        width: responsiveWidth(5),
                      }}
                      tintColor={'red'}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                  }}>
                  {item.name.split(' ')[0]}
                </Text>
                <View style={{flexDirection: 'row', gap: responsiveWidth(2)}}>
                  <Image
                    source={Images.Star}
                    resizeMode="contain"
                    style={{width: responsiveWidth(4)}}
                  />
                  <Text
                    style={{color: 'white', fontSize: responsiveFontSize(2)}}>
                    {item.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        /> */}
      </View>
    </WrapperContainer>
  );
};

export default Favourites;

const styles = StyleSheet.create({});
