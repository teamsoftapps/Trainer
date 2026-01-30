import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily, Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useGetTrainersQuery} from '../../store/Apis/Post';

const recent = [
  {name: 'Louis Hamilton'},
  {name: 'Jim Harvey'},
  {name: 'Micheal Henry'},
  {name: 'Cynthia Campbell'},
];
const upcoming = [
  {
    id: '1',
    name: 'Alex Morgan',
    distance: '0.43 miles away',
    rate: '$20',
    expertise: 'Body Building',
    image: Images.trainer2,
    rating: '5',
    reviews: 65,
  },
  {
    id: '2',
    name: 'Barbra Michelle',
    distance: '1.2 miles away',
    rate: '$70',
    expertise: 'Boxing',
    image: Images.trainer,
    rating: '4.5',
    reviews: 50,
  },
  {
    id: '3',
    name: 'Mathues Pablo',
    distance: '2.5 miles away',
    rate: '$30',
    expertise: 'Aerobics',
    image: Images.trainer3,
    rating: '4',
    reviews: 45,
  },
];

const Top = () => {
  const navigation = useNavigation();
  const {data, isLoading} = useGetTrainersQuery();
  console.log('trainers data in screen', data);
  const [trainerData, settrainerData] = useState([]);
  const authData = useSelector(state => state.Auth.data.data);
  console.log('on top navigation:', authData);
  useEffect(() => {
    getPosts();
  });
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
          Loading...
        </Text>
      </View>
    );
  };
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <ScrollView>
        <View>
          <FlatList
            ListEmptyComponent={EmptyComp}
            showsVerticalScrollIndicator={false}
            data={trainerData}
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
        <View style={{marginHorizontal: responsiveWidth(7)}}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              color: 'white',
              marginVertical: responsiveHeight(1),
            }}>
            Recent
          </Text>
          <FlatList
            data={recent}
            renderItem={({item}) => (
              <View
                style={{
                  borderBottomColor: 'grey',
                  borderBottomWidth: 0.5,
                  paddingVertical: responsiveHeight(1),
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    color: 'white',
                    fontFamily: FontFamily.Light,
                  }}>
                  {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Top;

const styles = StyleSheet.create({
  border: {},
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
