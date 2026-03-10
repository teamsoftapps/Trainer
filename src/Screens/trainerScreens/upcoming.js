import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily} from '../../utils/Images';
import {TrainerBookingAPI} from '../../services/trainerBookingApi';
import {showMessage} from 'react-native-flash-message';

const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'confirmed':
      return '#9FED3A';
    case 'rejected':
      return '#FF2D55';
    case 'trainer_completed':
      return '#FFA500';
    case 'completed':
      return '#4A90E2';
    case 'cancelled':
      return '#999';
    default:
      return '#666';
  }
};

const getPaymentChip = paymentStatus => {
  // Stripe paymentIntent statuses: succeeded, requires_payment_method, requires_action, processing, canceled...
  if (paymentStatus === 'succeeded' || paymentStatus === 'paid')
    return {text: 'PAID', bg: '#9FED3A', color: '#000'};
  if (!paymentStatus) return {text: 'UNPAID', bg: '#333', color: '#fff'};
  if (paymentStatus === 'processing')
    return {text: 'PROCESSING', bg: '#777', color: '#000'};
  if (paymentStatus === 'requires_payment_method')
    return {text: 'PAYMENT FAILED', bg: '#FF2D55', color: '#fff'};
  return {text: paymentStatus.toUpperCase(), bg: '#444', color: '#fff'};
};

const Upcoming = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state?.Auth?.data?.token);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await TrainerBookingAPI.getMyBookings(token);

      if (!res?.success) {
        showMessage({
          message: res?.message || 'Failed to load sessions',
          type: 'danger',
        });
        return;
      }

      // Trainer upcoming: show pending + confirmed (optionally also show paid-but-pending first)
      const filtered = (res.data || []).filter(
        b =>
          b.status === 'pending' ||
          b.status === 'confirmed' ||
          b.status === 'trainer_completed',
      );

      // Sort: paid pending first, then by date
      filtered.sort((a, b) => {
        const aPaid =
          a?.payment?.paymentStatus === 'succeeded' ||
          a?.payment?.paymentStatus === 'paid'
            ? 0
            : 1;
        const bPaid =
          b?.payment?.paymentStatus === 'succeeded' ||
          b?.payment?.paymentStatus === 'paid'
            ? 0
            : 1;
        if (aPaid !== bPaid) return aPaid - bPaid;
        return (a.date || '').localeCompare(b.date || '');
      });

      setSessions(filtered);
    } catch (e) {
      console.log('trainer upcoming error:', e?.response?.data || e.message);
      showMessage({
        message: e?.response?.data?.message || e.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      const res = await TrainerBookingAPI.updateStatus(
        token,
        bookingId,
        status,
      );

      if (!res?.success) {
        showMessage({message: res?.message || 'Update failed', type: 'danger'});
        return;
      }

      showMessage({message: `Booking ${status}`, type: 'success'});
      load();
    } catch (e) {
      console.log('updateStatus error:', e?.response?.data || e.message);
      showMessage({
        message: e?.response?.data?.message || e.message,
        type: 'danger',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({item}) => {
    const user = item.userId;
    const statusText =
      item.status === 'trainer_completed'
        ? 'Awaiting Approval'
        : item.status.charAt(0).toUpperCase() + item.status.slice(1);
    const statusBg =
      item.status === 'confirmed' || item.status === 'trainer_completed'
        ? '#9FED3A'
        : '#C7C7CC';
    const statusTextColor =
      item.status === 'confirmed' || item.status === 'trainer_completed'
        ? 'black'
        : 'white';

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={{uri: user?.profileImage}} style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user?.fullName || 'User'}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>
              {item.time} ({Math.round((item.durationMinutes || 60) / 60)} Hour)
            </Text>
          </View>

          <View style={styles.rightInfoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BookingDetails', {data: item})
              }>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
            <View style={[styles.statusPill, {backgroundColor: statusBg}]}>
              <Text style={[styles.statusText, {color: statusTextColor}]}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {item.status === 'pending' ? (
            <>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() =>
                  navigation.navigate('BookingDetails', {data: item})
                }>
                <Text style={styles.outlineBtnText}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filledBtn}
                disabled={updatingId === item._id}
                onPress={() => updateStatus(item._id, 'confirmed')}>
                <Text style={styles.filledBtnText}>
                  {updatingId === item._id ? '...' : 'Accept'}
                </Text>
              </TouchableOpacity>
            </>
          ) : item.status === 'confirmed' ? (
            <>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => updateStatus(item._id, 'trainer_completed')}>
                <Text style={styles.outlineBtnText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filledBtn}
                onPress={() =>
                  navigation.navigate('BookingDetails', {data: item})
                }>
                <Text style={styles.filledBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  const Empty = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
      }}>
      {loading ? (
        <ActivityIndicator size="large" color={'#9FED3A'} />
      ) : (
        <Text
          style={{
            color: 'gray',
            fontSize: responsiveFontSize(2),
            textAlign: 'center',
          }}>
          No upcoming sessions found
        </Text>
      )}
    </View>
  );

  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}
        showsVerticalScrollIndicator={false}
        data={sessions}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={Empty}
      />
    </WrapperContainer>
  );
};

export default Upcoming;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: responsiveWidth(6),
    marginTop: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 2,
  },
  timeText: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.8),
  },
  rightInfoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  viewDetailsText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.Medium,
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  filledBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#9FED3A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledBtnText: {
    color: 'black',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.8),
  },
  separator: {
    height: 1,
    backgroundColor: '#2C2C2E',
    width: '100%',
  },
});
