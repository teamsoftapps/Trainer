import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Modal } from 'react-native';

import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../../utils/Images';

import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonComp from '../../Components/ButtonComp';
import { showMessage } from 'react-native-flash-message';
import { useSelector } from 'react-redux';
import { BookingAPI } from '../../services/bookingApi';
const BookingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params || {};
  const authData = useSelector(state => state?.Auth?.data);
  const token = authData?.token;
  const [cancelLoading, setCancelLoading] = useState(false);

  const bookingId = data?.bookingId || data?._id || data?.booking?._id;

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const reasons = [
    'Schedule Conflict',
    'Change of Mind',
    'Personal Emergency',
    'Trainer Unavailability',
    'Other',
  ];

  console.log('ROUTEEEEEEEE', data);




  const isTrainer = authData?.isType === 'trainer';
  const displayUser = isTrainer ? data?.userId : (data?.trainerId || data?.trainerData || data?.data);

  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: responsiveScreenWidth(6), marginTop: responsiveScreenHeight(2) }}>
          <Text style={{ color: 'white', fontSize: responsiveFontSize(3.5), fontFamily: FontFamily.Bold, marginBottom: responsiveScreenHeight(3) }}>
            Booking Details
          </Text>

          {/* Trainer/Client Card */}
          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: responsiveScreenWidth(5),
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#2A2A2A',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: responsiveScreenHeight(3),
            }}>
            <Image
              source={{ uri: displayUser?.profileImage }}
              style={{
                width: responsiveScreenWidth(18),
                height: responsiveScreenWidth(18),
                borderRadius: 36,
                borderWidth: 2,
                borderColor: '#9FED3A',
              }}
            />
            <View style={{ marginLeft: responsiveScreenWidth(4), flex: 1 }}>
              <Text
                style={{
                  fontFamily: FontFamily.Bold,
                  fontSize: responsiveScreenFontSize(2.4),
                  color: 'white',
                }}>
                {displayUser?.fullName}
              </Text>
              <Text
                style={{
                  color: '#9FED3A',
                  fontFamily: FontFamily.Medium,
                  fontSize: responsiveScreenFontSize(1.8),
                  marginTop: 2,
                }}>
                {isTrainer ? 'Client' : (displayUser?.Speciality?.[0]?.value || 'Professional Trainer')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: responsiveWidth(2) }}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    if (!displayUser?._id) {
                      showMessage({ message: "User information missing", type: "warning" });
                      return;
                    }

                    const res = await BookingAPI.createConversation(authData?._id, displayUser?._id);
                    if (res.success) {
                      const conversation = res.conversation || res.data;
                      navigation.navigate('ChatScreen', {
                        conversationId: conversation?._id,
                        otherUser: displayUser,
                      });
                    }
                  } catch (error) {
                    console.log('Chat error:', error?.response?.data || error.message);
                    showMessage({
                      message: "Failed to start chat",
                      type: "danger"
                    });
                  }
                }}
                style={styles.iconBtn}>
                <Icon name="chatbubble-ellipses-outline" size={20} color="#9FED3A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Icon name="call-outline" size={20} color="#9FED3A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Details Section */}
          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: responsiveScreenWidth(5),
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#2A2A2A',
              gap: responsiveScreenHeight(2.5),
            }}>

            {/* Info Item */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Icon name="calendar-outline" size={20} color="#9FED3A" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>
                  {data?.date || data?.Date} • {data?.time}
                </Text>
              </View>
            </View>

            {/* Info Item */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Icon name="location-outline" size={20} color="#9FED3A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {data?.trainerId?.Address || data?.data?.Address || 'Not Available'}
                </Text>
                <Text style={{ color: '#9FED3A', fontSize: 12, marginTop: 4 }}>0.31 mi away</Text>
              </View>
            </View>

            {/* Info Item */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Icon name="cash-outline" size={20} color="#9FED3A" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Price Details</Text>
                <Text style={styles.infoValue}>
                  Total price ${data?.amount ? data.amount / 100 : (data?.hourlyRate || data?.data?.Hourlyrate || '0')}
                </Text>
                <Text style={{ color: '#8E8E93', fontSize: 12, marginTop: 4 }}>
                  for {data?.durationMinutes || 60}min session
                </Text>
              </View>
            </View>

            {/* Info Item */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Icon name="notifications-outline" size={20} color="#9FED3A" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Reminder</Text>
                <Text style={styles.infoValue}>
                  {data?.reminder || data?.data?.Reminder || 'None'} before session
                </Text>
                <Text style={{ color: '#8E8E93', fontSize: 12, marginTop: 4 }}>Repeat: Off</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: responsiveScreenHeight(12) }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <ButtonComp
          onPress={() => {
            navigation.replace('Bottom');
          }}
          text="Back to Home"
          mainStyle={{
            backgroundColor: '#9FED3A',
            width: '100%',
          }}
          textStyle={{ color: 'black', fontFamily: FontFamily.Bold }}
        />
        <TouchableOpacity
          style={{ marginTop: 15, alignItems: 'center' }}
          onPress={() => setCancelModalVisible(true)}>
          <Text style={{ color: '#FF4B4B', fontFamily: FontFamily.Semi_Bold }}>Cancel Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Cancellation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCancelModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCancelModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalSubTitle}>Please select a reason for cancellation</Text>

            <View style={{ marginBottom: 20 }}>
              {reasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reasonOption}
                  onPress={() => setSelectedReason(reason)}>
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && { color: '#9FED3A', fontFamily: FontFamily.Bold }
                  ]}>
                    {reason}
                  </Text>
                  <View style={[
                    styles.radioCircle,
                    selectedReason === reason && { borderColor: '#9FED3A' }
                  ]}>
                    {selectedReason === reason && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <ButtonComp

              onPress={async () => {
                try {
                  if (!selectedReason) return;

                  if (!bookingId) {
                    showMessage({ message: "Booking ID missing", type: "danger" });
                    return;
                  }

                  setCancelLoading(true);

                  const res = await BookingAPI.cancelBooking(token, bookingId, selectedReason);

                  if (!res?.success) {
                    showMessage({
                      message: res?.message || "Failed to cancel booking",
                      type: "danger",
                    });
                    return;
                  }

                  setCancelModalVisible(false);

                  showMessage({
                    message: "Booking Cancelled Successfully",
                    type: "success",
                  });

                  navigation.replace('Bottom');
                } catch (e) {
                  showMessage({
                    message: e?.response?.data?.message || e.message || "Cancel error",
                    type: "danger",
                  });
                } finally {
                  setCancelLoading(false);
                }
              }}
              disabled={!selectedReason || cancelLoading}
              text={cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
              mainStyle={{
                backgroundColor: selectedReason && !cancelLoading ? '#FF4B4B' : '#3A3A3A',
                marginBottom: 10
              }}
              textStyle={{
                color: selectedReason && !cancelLoading ? 'white' : '#777',
                fontFamily: FontFamily.Bold
              }}
            />

            <TouchableOpacity
              style={{ paddingVertical: 15, alignItems: 'center' }}
              onPress={() => setCancelModalVisible(false)}>
              <Text style={{ color: 'white', fontFamily: FontFamily.Semi_Bold }}>Keep Booking</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </WrapperContainer>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveScreenWidth(4),
  },
  infoLabel: {
    color: '#8E8E93',
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: FontFamily.Medium,
  },
  infoValue: {
    color: 'white',
    fontSize: responsiveScreenFontSize(1.9),
    fontFamily: FontFamily.Semi_Bold,
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: responsiveScreenWidth(6),
    paddingBottom: responsiveScreenHeight(3),
    backgroundColor: '#181818',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: responsiveScreenWidth(6),
    paddingTop: 15,
    paddingBottom: responsiveScreenHeight(4),
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: responsiveFontSize(2.8),
    fontFamily: FontFamily.Bold,
    textAlign: 'center',
  },
  modalSubTitle: {
    color: '#8E8E93',
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.Medium,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  reasonText: {
    color: '#B8B8B8',
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9FED3A',
  },
});
