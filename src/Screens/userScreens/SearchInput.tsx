import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useRef, useEffect, useState, useMemo} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import Top from './Top';
import People from './People';
import Suggestion from './Suggestion';
import Places from './Places';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AirbnbRating} from 'react-native-ratings';
import {useGetTrainersQuery} from '../../store/Apis/Post';

const SearchInput = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();
  const {data, isLoading} = useGetTrainersQuery();
  const [trainerData, settrainerData] = useState([]);
  const textInputRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);
  const Specialities = [
    {key: 1, value: 'Strength Training'},
    {key: 2, value: 'Yoga'},
    {key: 3, value: 'Cardio Fitness'},
    {key: 4, value: 'Weight Loss Coaching'},
    {key: 5, value: 'Bodybuilding'},
    {key: 6, value: 'Crossfit'},
  ];
  useEffect(() => {
    getPosts();
  }, [data]);
  const getPosts = async () => {
    try {
      const res = await data;
      console.log('ALL', res);
      settrainerData(res?.data);
    } catch (error) {
      console.log('Errorr', error);
    }
  };

  const EmptyComp = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          marginTop: responsiveHeight(25),
        }}>
        <Text
          style={{
            fontFamily: FontFamily.Regular,
            color: 'gray',
            fontSize: responsiveFontSize(2.2),
          }}>
          No Trainers Available
        </Text>
      </View>
    );
  };

  const filteredData = useMemo(() => {
    const lowercasedSearchText = searchText.toLowerCase();

    return trainerData.filter((item: any) => {
      const fullName = item?.fullName?.toLowerCase();
      const specialities = item?.Speciality?.map((spec: string) =>
        spec.toLowerCase()
      );

      return (
        fullName?.includes(lowercasedSearchText) ||
        specialities?.some((spec: string) =>
          spec.includes(lowercasedSearchText)
        )
      );
    });
  }, [searchText, trainerData]);

  console.log('Filtered Data', filteredData);
  return (
    <WrapperContainer>
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
      <Text
        style={{
          color: 'white',
          marginHorizontal: responsiveWidth(8),
          marginTop: responsiveHeight(2),
          fontSize: responsiveFontSize(2.3),
          fontWeight: '600',
        }}>
        Categories:
      </Text>
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginTop: responsiveHeight(2)}}
          data={Specialities}
          keyExtractor={item => item.key.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSearchText(item.value);
                }}
                style={{
                  // width: responsiveWidth(30),
                  paddingHorizontal: responsiveWidth(4),
                  height: responsiveHeight(5.5),
                  backgroundColor: '#9FED3A',
                  borderRadius: responsiveWidth(6),
                  margin: responsiveWidth(2),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: responsiveFontSize(1.8),
                    textAlign: 'center',
                  }}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          ListEmptyComponent={EmptyComp}
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  borderTopColor: '#B8B8B8',
                  borderTopWidth: item.id === 1 ? 0 : 0.5,
                }}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('TrainerProfile', {data: item});
                  }}
                  style={styles.container}>
                  <View style={styles.left}>
                    <Image
                      src={item.profileImage}
                      style={{
                        width: responsiveWidth(17),
                        height: responsiveWidth(17),
                        borderRadius: 50,
                      }}
                    />
                    <View>
                      <Text style={styles.whitetext} numberOfLines={1}>
                        {item.fullName}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: responsiveWidth(2),
                        }}>
                        <Image
                          source={Images.location}
                          resizeMode="contain"
                          style={{width: responsiveWidth(3)}}
                        />
                        <Text style={styles.greytext} numberOfLines={1}>
                          0.43 miles away
                        </Text>
                        <Text style={styles.greytext}>·</Text>
                        <Text style={styles.greytext}>
                          {item.Speciality ? item.Speciality : 'None'}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: responsiveWidth(1),
                        }}>
                        <AirbnbRating
                          defaultRating={item.rating}
                          selectedColor="#9FED3A"
                          isDisabled
                          showRating={false}
                          size={responsiveHeight(1.6)}
                        />
                        <Text style={styles.greytext} numberOfLines={1}>
                          {item.reviews}+
                        </Text>
                        {item.rate && <Text style={styles.greytext}>·</Text>}
                        <Text style={styles.greytext}>
                          {item.Hourlyrate ? item.Hourlyrate : '-'}/hr
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      </View>

      {/* <Tab.Navigator
        tabBar={({navigation, state}) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#222222',
              marginVertical: responsiveHeight(2.1),
              borderBottomColor: 'white',
              borderBottomWidth: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Top');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 0 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Top
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('People');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 1 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{color: 'white'}}>People</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Suggestion');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 2 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{color: 'white'}}>Suggestion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Places');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 3 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2),
              }}>
              <Text style={{color: 'white'}}>Places</Text>
            </TouchableOpacity>
          </View>
        )}>
        <Tab.Screen name="Top" component={Top} />
        <Tab.Screen name="People" component={People} />
        <Tab.Screen name="Suggestion" component={Suggestion} />
        <Tab.Screen name="Places" component={Places} />
      </Tab.Navigator> */}
    </WrapperContainer>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    alignSelf: 'center',
    paddingVertical: responsiveScreenWidth(5),
  },
  left: {
    flexDirection: 'row',
    gap: responsiveScreenWidth(3),
    alignItems: 'center',
  },
  whitetext: {color: 'white', fontWeight: '500'},
  blacktext: {color: 'black', fontWeight: '500'},
  greytext: {color: '#B8B8B8', fontWeight: '400'},
  right: {justifyContent: 'space-evenly', alignItems: 'flex-end'},
  timeago: {color: '#B8B8B8', fontWeight: '400'},
  curve: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveScreenWidth(1),
    paddingHorizontal: responsiveScreenWidth(5),
  },
});
