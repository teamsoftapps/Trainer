import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {FontFamily, Images} from '../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../services/AxiosBaseURL';

const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    date: 'Monday, Oct, 23',
    time: '8:00 AM',
    timeage: '30 mins before',
    status: 'Pending',
    image: Images.trainer2,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    date: 'Monday, Oct, 2',
    time: '10:00 AM',
    timeage: '15 mins before',
    status: 'Confirmed',
    image: Images.trainer,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    date: 'Sunday, Oct, 21',
    time: '12:00 PM',
    timeage: 'None',
    status: 'Cancelled',
    image: Images.trainer3,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
];

const Upcoming = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const AuthData = useSelector(state => state.Auth.data.data);
  useFocusEffect(
    useCallback(() => {
      getBookings();
      console.log('sasasa', AuthData);
    }, [AuthData.token])
  );

  const getBookings = async () => {
    try {
      const response = await axiosBaseURL.get('/user/GetBookings', {
        params: {token: AuthData.token},
      });
      console.log('in get bookings function:', response.data.data);
      setBookings(response.data.data);
      console.log('bookings:::::', bookings);
    } catch (error) {}
  };

  const deleteBookings = async bookingId => {
    try {
      const response = await axiosBaseURL.delete('/user/DeleteBooking', {
        data: {
          token: AuthData.token,
          bookingId: bookingId,
        },
      });
      await setBookings(prevBookings =>
        prevBookings.filter(booking => booking._id !== bookingId)
      );
      setDelete(false);
    } catch (error) {}
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
          No Bookings Available
        </Text>
      </View>
    );
  };
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <FlatList
        ListEmptyComponent={EmptyComp}
        showsVerticalScrollIndicator={false}
        data={bookings}
        renderItem={({item, index}) => {
          return (
            <View style={styles.border}>
              <View style={styles.container}>
                <TouchableOpacity
                  delayLongPress={500}
                  onLongPress={() => {
                    setDeleteIndex(index);
                  }}
                  onPress={() => {
                    navigation.navigate('BookingDetails', {data: item});
                  }}
                  style={styles.left}>
                  <Image
                    style={{
                      height: responsiveWidth(14),
                      width: responsiveWidth(14),
                      borderRadius: responsiveWidth(14),
                    }}
                    src={item.profileImage}
                  />
                  <View>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.userName}
                    </Text>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.Date}
                    </Text>
                    <Text style={styles.greytext} numberOfLines={1}>
                      {item.Time}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.right}>
                  <Text style={styles.timeago}>{item.Reminder}</Text>
                  <View
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      // backgroundColor:
                      //   item.status === 'Pending'
                      //     ? '#B8B8B8'
                      //     : item.status === 'Confirmed'
                      //     ? '#9FED3A'
                      //     : item.status === 'Cancelled'
                      //     ? '#FF2D55'
                      //     : 'none',
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
                {deleteIndex === index ? (
                  <TouchableOpacity
                    onPress={() => {
                      deleteBookings(item?._id);
                      setDeleteIndex(null); // Hide delete button after action
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../assets/Images/delete.png')}
                      style={{
                        height: responsiveHeight(2.5),
                        width: responsiveWidth(4),
                        tintColor: 'red',
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        }}
      />
      {/* <FlatList
        ListEmptyComponent={EmptyComp}
        showsVerticalScrollIndicator={false}
        data={bookings}
        renderItem={({item, index}) => {
          return (
            <View style={styles.border}>
              <View style={styles.container}>
                <TouchableOpacity
                  delayLongPress={500}
                  onLongPress={() => {
                    setDelete(true);
                  }}
                  onPress={() => {
                    navigation.navigate('BookingDetails', {data: item});
                  }}
                  style={styles.left}>
                  <Image
                    source={
                      index == 0
                        ? upcoming[0].image
                        : index == 1
                        ? upcoming[1].image
                        : index == 2
                        ? upcoming[2].image
                        : null
                    }
                  />
                  <View>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {index == 0
                        ? upcoming[0].name
                        : index == 1
                        ? upcoming[1].name
                        : index == 2
                        ? upcoming[2].name
                        : null}
                    </Text>
                    <Text style={styles.whitetext} numberOfLines={1}>
                      {item.Date}
                    </Text>
                    <Text style={styles.greytext} numberOfLines={1}>
                      {item.Time}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.right}>
                  <Text style={styles.timeago}>{item.Reminder}</Text>
                  <View
                    style={{
                      ...styles.curve,
                      borderRadius: responsiveScreenWidth(10),
                      // backgroundColor:
                      //   item.status === 'Pending'
                      //     ? '#B8B8B8'
                      //     : item.status === 'Confirmed'
                      //     ? '#9FED3A'
                      //     : item.status === 'Cancelled'
                      //     ? '#FF2D55'
                      //     : 'none',
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
                {isDelete ? (
                  <TouchableOpacity
                    onPress={() => {
                      deleteBookings(item?._id);
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../assets/Images/delete.png')}
                      style={{
                        height: responsiveHeight(2.5),
                        width: responsiveWidth(4),
                        tintColor: 'red',
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        }}
      /> */}
    </WrapperContainer>
  );
};

export default Upcoming;

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
    // backgroundColor:"red"
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
