import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {Images} from '../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    date: 'Monday, Oct, 23',
    time: '8:00 AM (1Hour)',
    timeage: '30 mins before',
    status: 'Completed',
    image: Images.trainer2,
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    date: 'Monday, Oct, 2',
    time: '10:00 AM (2Hour)',
    timeage: '15 mins before',
    status: 'Completed',
    image: Images.trainer,
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    date: 'Sunday, Oct, 21',
    time: '12:00 PM (3Hour)',
    timeage: 'None',
    status: 'Cancelled',
    image: Images.trainer3,
  },
];

const Previous = () => {
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={upcoming}
        renderItem={({item, index}) => {
          return (
            <View style={styles.border}>
              <View style={styles.container}>
                <View style={styles.left}>
                  <Image source={item.image} />
                  <View>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.date}
                    </Text>
                    <Text style={styles.greytext} numberOfLines={1}>
                      {item.time}
                    </Text>
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={{color: '#9FED3A'}}>View Details</Text>
                  <View
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      backgroundColor:
                        item.status === 'Completed'
                          ? '#9FED3A'
                          : item.status === 'Cancelled'
                          ? '#FF2D55'
                          : 'none',
                    }}>
                    <Text
                      style={
                        item.status === 'Cancelled'
                          ? styles.whitetext
                          : styles.blacktext
                      }>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  paddingHorizontal: responsiveWidth(6),
                  paddingBottom: responsiveHeight(3),
                }}>
                <TouchableOpacity
                  style={{
                    height: responsiveHeight(4),
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: responsiveWidth(3),
                    borderColor: '#B8B8B8',
                    borderWidth: responsiveWidth(0.3),
                    borderRadius: responsiveWidth(2),
                    marginHorizontal: responsiveWidth(3),
                    width: responsiveWidth(30),
                  }}>
                  <Text
                    style={{
                      color: '#bbbbbb',
                      fontSize: responsiveFontSize(1.7),
                      fontWeight: '500',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: responsiveHeight(4),
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: responsiveWidth(3),
                    borderColor: '#B8B8B8',
                    backgroundColor: '#9FED3A',
                    borderRadius: responsiveWidth(2),
                    width: responsiveWidth(30),
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '500',
                      fontSize: responsiveFontSize(1.7),
                    }}>
                    Reschedule
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default Previous;

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
