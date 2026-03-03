import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Images } from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import { TrainerBookingAPI } from '../../services/trainerBookingApi';
import { getMessaging } from '@react-native-firebase/messaging';
import moment from 'moment';

const firebaseMessaging = getMessaging();

const Notifications = () => {
  const navigation = useNavigation();
  const authData = useSelector(state => state?.Auth?.data);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // bookingId being acted on

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosBaseURL.get('/notification/list');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.log('Fetch notifications error:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ✅ Auto-refresh: listen for foreground notifications
  useEffect(() => {
    const unsub = firebaseMessaging.onMessage(async () => {
      fetchNotifications();
    });
    return () => unsub();
  }, [fetchNotifications]);

  // ✅ Re-fetch when screen comes back into focus
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      fetchNotifications();
    });
    return unsub;
  }, [navigation, fetchNotifications]);

  const hasUnread = notifications.some(n => !n.isRead);

  const markAllRead = async () => {
    try {
      await axiosBaseURL.patch('/notification/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log('Mark all read error:', err?.message);
    }
  };

  // ✅ Inline Accept
  const handleAccept = async (bookingId, notifId) => {
    try {
      setActionLoading(notifId);
      await TrainerBookingAPI.updateStatus(authData?.token, bookingId, 'confirmed');
      // Mark notification as read in DB so buttons won't reappear
      try { await axiosBaseURL.patch(`/notification/${notifId}/read`); } catch (_) { }
      Alert.alert('Success', 'Booking confirmed!');
      // Update notification locally
      setNotifications(prev =>
        prev.map(n =>
          n._id === notifId
            ? { ...n, title: 'Booking Confirmed', type: 'booking_confirmed', isRead: true }
            : n,
        ),
      );
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to accept');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Inline Reject
  const handleReject = async (bookingId, notifId) => {
    Alert.alert('Decline Booking', 'Are you sure you want to decline this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoading(notifId);
            await TrainerBookingAPI.updateStatus(authData?.token, bookingId, 'rejected');
            // Mark notification as read in DB
            try { await axiosBaseURL.patch(`/notification/${notifId}/read`); } catch (_) { }
            Alert.alert('Done', 'Booking declined.');
            setNotifications(prev =>
              prev.map(n =>
                n._id === notifId
                  ? { ...n, title: 'Booking Declined', type: 'booking_rejected', isRead: true }
                  : n,
              ),
            );
          } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to decline');
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  const getTimeAgo = date => moment(date).fromNow();

  const renderItem = ({ item }) => {
    const isNewBooking = item.type === 'booking_new' && !item.isRead;
    const isActioning = actionLoading === item._id;

    return (
      <View style={[styles.card, !item.isRead && styles.unread]}>
        <View style={styles.cardInner}>
          <View style={styles.topRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {!item.isRead && <View style={styles.dot} />}
              <Text style={styles.heading} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.timeago}>{getTimeAgo(item.createdAt)}</Text>
          </View>
          <Text numberOfLines={2} style={styles.body}>
            {item.body}
          </Text>
          <View style={styles.actionRow}>
            {isNewBooking ? (
              isActioning ? (
                <ActivityIndicator size="small" color="#9BE639" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => handleReject(item.bookingId, item._id)}>
                    <Text style={styles.reviewText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAccept(item.bookingId, item._id)}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.bookingId) {
                        navigation.navigate('BookingDetails', {
                          bookingId: item.bookingId,
                        });
                      }
                    }}>
                    <Text style={styles.viewLink}>View</Text>
                  </TouchableOpacity>
                </>
              )
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (item.bookingId) {
                    navigation.navigate('BookingDetails', {
                      bookingId: item.bookingId,
                    });
                  }
                }}>
                <Text style={styles.action}>View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer style={{ backgroundColor: '#181818' }}>
      <Header
        onPress={() => navigation.goBack()}
        rightView={
          <Image
            source={Images.logo}
            style={{ height: responsiveHeight(5), width: responsiveWidth(10) }}
          />
        }
      />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && hasUnread && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9BE639" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: responsiveHeight(4) }}
        />
      )}
    </WrapperContainer>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
  },
  title: {
    color: 'white',
    fontSize: responsiveFontSize(3.3),
    fontWeight: '700',
  },
  markAll: {
    color: '#9BE639',
    fontSize: responsiveFontSize(1.5),
  },
  card: {
    backgroundColor: '#232323',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  unread: {
    backgroundColor: '#1e2a14',
  },
  cardInner: {
    width: '85%',
    alignSelf: 'center',
    gap: responsiveHeight(1),
    paddingVertical: responsiveHeight(2.5),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9BE639',
    marginRight: 8,
  },
  heading: {
    color: 'white',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    flex: 1,
  },
  timeago: {
    color: '#888',
    fontSize: responsiveFontSize(1.3),
    marginLeft: 8,
  },
  body: {
    color: '#B8B8B8',
    fontSize: responsiveFontSize(1.6),
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveScreenWidth(3),
    marginTop: 4,
  },
  action: {
    color: '#9BE639',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
  },
  viewLink: {
    color: '#9BE639',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewBtn: {
    borderColor: '#ff5555',
    borderWidth: responsiveWidth(0.3),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: responsiveWidth(1.5),
  },
  reviewText: {
    color: '#ff5555',
    fontSize: responsiveFontSize(1.5),
  },
  acceptBtn: {
    borderColor: '#9BE639',
    borderWidth: responsiveWidth(0.3),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: responsiveWidth(1.5),
    backgroundColor: '#9BE639',
  },
  acceptText: {
    color: '#000',
    fontWeight: '500',
    fontSize: responsiveFontSize(1.5),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#888',
    fontSize: responsiveFontSize(2),
  },
});
