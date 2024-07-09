import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {Images} from '../utils/Images';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {AirbnbRating} from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';

const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    distance: '0.43 miles away',
    rate: '$80/hr',
    expertise: 'Body Building',
    image: Images.trainer4,
    rating: 3,
    reviews: 5,
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    distance: '1.2 miles away',
    rate: '$30/hr',
    expertise: 'Boxing',
    image: Images.trainer3,
    rating: 4.5,
    reviews: 12,
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    distance: '2.5 miles away',
    rate: '$30/hr',
    expertise: 'Fitness',
    image: Images.trainer2,
    rating: 5,
    reviews: 50,
  },
  {
    id: 4,
    name: 'Sophia Charles',
    distance: '5 miles away',
    rate: '$40/hr',
    expertise: 'Cardio',
    image: Images.trainer,
    rating: 4,
    reviews: 5,
  },
  {
    id: 5,
    name: 'Mitch Frank',
    distance: '14 miles away',
    rate: '$90/hr',
    expertise: 'Boxing',
    image: Images.trainer3,
    rating: 5,
    reviews: 24,
  },
];

const People = () => {
  
  const navigation = useNavigation();
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={upcoming}
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
                    source={item.image}
                    style={{
                      width: responsiveWidth(17),
                      height: responsiveWidth(17),
                      borderRadius: 50,
                    }}
                  />
                  <View>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.name}
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
                        {item.distance}
                      </Text>
                      {item.expertise && <Text style={styles.greytext}>·</Text>}
                      <Text style={styles.greytext}>{item.expertise}</Text>
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
                      <Text style={styles.greytext}>{item.rate}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default People;

const styles = StyleSheet.create({
  border: {borderBottomColor: '#B8B8B8', borderBottomWidth: 0.5},
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
