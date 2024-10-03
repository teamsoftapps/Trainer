import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../services/AxiosBaseURL';
import useToast from '../Hooks/Toast';

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
  const [first, setfirst] = useState(true);
  const [isLong, setIsLong] = useState(false);
  const [longPressIndex, setLongPressIndex] = useState(null);
  const [favouriteTrainers, setFavoriteTrainers] = useState([]);
  const authData = useSelector(state => state.Auth.data.data);
  const {showToast} = useToast();

  useEffect(() => {
    fetchFavoriteTrainers();
  }, []);

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
      await setFavoriteTrainers(prevTrainers =>
        prevTrainers.filter(trainer => trainer._id !== trainerID)
      );
      setIsLong(false);
    } catch (error) {}
  };

  if (first === true) {
    fav.sort((a, b) => b.rating - a.rating);
  } else {
    fav.sort((a, b) => a.rating - b.rating);
  }
  return (
    <WrapperContainer>
      <Text
        style={{
          fontSize: responsiveFontSize(3.5),
          color: 'white',
          marginLeft: responsiveWidth(6),
          marginTop: responsiveHeight(2),
        }}>
        Favourites
      </Text>
      <View
        style={{
          flexDirection: 'row',
          gap: responsiveWidth(1),
          marginTop: responsiveHeight(4),
        }}>
        <View
          style={{
            backgroundColor: '#232323',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingVertical: responsiveHeight(1.5),
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              setfirst(!first);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: responsiveWidth(1),
            }}>
            <Image
              source={Images.Sort}
              style={{width: responsiveWidth(5)}}
              resizeMode="contain"
              tintColor={'grey'}
            />
            <Text style={{color: 'grey', fontSize: responsiveFontSize(2.4)}}>
              Sort
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: '#232323',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingVertical: responsiveHeight(1.5),
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: responsiveWidth(1),
            }}>
            <Image
              source={Images.filter}
              style={{width: responsiveWidth(5)}}
              resizeMode="contain"
              tintColor={'grey'}
            />
            <Text style={{color: 'grey', fontSize: responsiveFontSize(2.4)}}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <FlatList
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
                    onPress={() => {
                      deleteFavouriteTrainers(item.trainerID, item.userId);
                      setLongPressIndex(null); // Reset after deletion
                    }}>
                    <Image
                      style={{height: responsiveHeight(3)}}
                      resizeMode="center"
                      source={require('../assets/Images/remove.png')}
                    />
                  </TouchableOpacity>
                )}
                <View>
                  <Image
                    source={require('../assets/Images/3.png')}
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
                      source={require('../assets/Images/remove.png')}
                    />
                  </TouchableOpacity>
                )}
                <View>
                  <Image
                    source={require('../assets/Images/3.png')}
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
