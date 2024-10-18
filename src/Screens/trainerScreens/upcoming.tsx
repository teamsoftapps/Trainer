import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily, Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';

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
  const trainer_data = useSelector(state => state.Auth.data);
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   getSessions();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      getSessions();
    }, [])
  );
  const getSessions = async () => {
    try {
      const responce = await axiosBaseURL.get(
        `/user/getBookingbyId/${trainer_data._id}`
      );
      await setSessions(responce.data.data);
      setIsLoading(false);
      console.log('Sessions we get in upcoming: ', responce.data.data);
    } catch (error) {}
  };
  const upComingSessions = ({item, index}) => {
    return (
      <View style={styles.border}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Image
              src={item.profileImage}
              style={{
                height: responsiveWidth(14),
                width: responsiveWidth(14),
                borderRadius: responsiveWidth(7),
              }}
            />
            <View>
              <Text style={styles.whitetext} numberOfLines={1}>
                {item.userName}
              </Text>
              <Text style={styles.whitetext} numberOfLines={1}>
                {item.Date}
              </Text>
              <Text style={styles.greytext} numberOfLines={1}>
                {item.bookingTime} (1 Hour)
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
                    : item.status === 'pending'
                    ? '#bbbbbb'
                    : 'none',
                marginVertical: responsiveHeight(0.5),
              }}>
              <Text
                style={
                  item.status === 'pending'
                    ? styles.blacktext
                    : styles.whitetext
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
            onPress={() => {
              navigation.navigate('ReviewBooking', {data: item});
            }}
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
              Review
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
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const WhenListEmpty = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#fff'} />
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No Sessions found
          </Text>
        )}
      </View>
    );
  };
  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sessions}
        renderItem={upComingSessions}
        ListEmptyComponent={WhenListEmpty}
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
