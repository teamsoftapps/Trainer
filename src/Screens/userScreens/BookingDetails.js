import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Modal} from 'react-native';

import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';

import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper';
import {ScrollView} from 'react-native-gesture-handler';
import ButtonComp from '../../Components/ButtonComp';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import {BookingAPI} from '../../services/bookingApi';
import {TrainerBookingAPI} from '../../services/trainerBookingApi';
import {subMonths} from 'date-fns';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const BookingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeData = route.params?.data;
  const routeBookingId = route.params?.bookingId;
  const authData = useSelector(state => state?.Auth?.data);
  const token = authData?.token;

  const [data, setData] = useState(routeData || null);
  const [fetchLoading, setFetchLoading] = useState(
    !routeData && !!routeBookingId,
  );
  const [cancelLoading, setCancelLoading] = useState(false);

  // ✅ Fetch full booking data when navigated with only bookingId (from notifications)
  useEffect(() => {
    if (!routeData && routeBookingId && token) {
      const fetchBooking = async () => {
        try {
          setFetchLoading(true);
          const res = await BookingAPI.getBooking(token, routeBookingId);
          if (res?.success && res?.data) {
            setData(res.data);
            setStatus(res.data.status || 'pending');
          } else {
            showMessage({message: 'Could not load booking', type: 'danger'});
            navigation.goBack();
          }
        } catch (err) {
          console.log('Fetch booking error:', err?.message);
          showMessage({message: 'Error loading booking', type: 'danger'});
          navigation.goBack();
        } finally {
          setFetchLoading(false);
        }
      };
      fetchBooking();
    }
  }, [routeBookingId, routeData, token]);

  const bookingId =
    data?.bookingId || data?._id || data?.booking?._id || routeBookingId;
  const [loading, setLoading] = useState('');
  const [status, setStatus] = useState(data?.status || 'pending');

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  // Reschedule States
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] =
    useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    data?.date || moment().format('YYYY-MM-DD'),
  );
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(data?.time || '10:00 AM');

  // Update local state when data changes (after fetch)
  useEffect(() => {
    if (data) {
      setStatus(data.status || 'pending');
      setSelectedDate(data.date || moment().format('YYYY-MM-DD'));
      setSelectedTime(data.time || '10:00 AM');
    }
  }, [data]);

  const reasons = [
    'Schedule Conflict',
    'Change of Mind',
    'Personal Emergency',
    'Trainer Unavailability',
    'Other',
  ];

  const isTrainer = authData?.isType?.toLowerCase() === 'trainer';
  const displayUser = isTrainer
    ? data?.userId
    : data?.trainerId || data?.trainerData || data?.data;
  // console.log('displayUser:', displayUser.profileImage);
  const currentStatus = status || data?.status || 'pending';
  const normalizedStatus = currentStatus.toString().toLowerCase().trim();

  console.log('--- BOOKING DETAILS DEBUG ---');
  console.log('isTrainer:', isTrainer);
  console.log('currentStatus:', currentStatus);
  console.log('normalizedStatus:', normalizedStatus);
  console.log('data.status:', data?.status);
  console.log('------------------------------');

  // ✅ Show loading spinner while fetching
  if (fetchLoading) {
    return (
      <WrapperContainer>
        <Header onPress={() => navigation.goBack()} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#9BE639" />
          <Text style={{color: '#888', marginTop: 12, fontSize: 14}}>
            Loading booking...
          </Text>
        </View>
      </WrapperContainer>
    );
  }

  const handleStatusUpdate = async newStatus => {
    try {
      setLoading(newStatus);
      const res = await TrainerBookingAPI.updateStatus(
        token,
        bookingId,
        newStatus,
      );
      console.log('Update status response:', res);
      if (res?.success) {
        setStatus(newStatus);
        const displayStatus =
          newStatus === 'confirmed'
            ? 'Accepted'
            : newStatus === 'rejected'
              ? 'Declined'
              : 'Updated';
        showMessage({message: `Booking ${displayStatus}`, type: 'success'});
        if (newStatus === 'rejected' || newStatus === 'completed') {
          navigation.goBack();
        }
      } else {
        showMessage({message: res?.message || 'Update failed', type: 'danger'});
      }
    } catch (error) {
      console.log('Update status error:', error);
      showMessage({message: 'Error updating status', type: 'danger'});
    } finally {
      setLoading('');
    }
  };

  const handleTrainerComplete = async () => {
    try {
      setLoading('trainer_completed');
      const res = await TrainerBookingAPI.trainerComplete(token, bookingId);
      if (res?.success) {
        setStatus('trainer_completed');
        showMessage({message: 'Session marked as completed', type: 'success'});
      } else {
        showMessage({
          message: res?.message || 'Complete failed',
          type: 'danger',
        });
      }
    } catch (e) {
      showMessage({
        message: e?.response?.data?.message || e.message,
        type: 'danger',
      });
    } finally {
      setLoading('');
    }
  };

  const handleUserApprove = async () => {
    try {
      setLoading('approve');
      const res = await BookingAPI.approveCompletion(token, bookingId);
      if (res?.success) {
        setStatus('completed');
        showMessage({message: 'Session completed', type: 'success'});
        navigation.goBack();
      } else {
        showMessage({
          message: res?.message || 'Approve failed',
          type: 'danger',
        });
      }
    } catch (e) {
      showMessage({
        message: e?.response?.data?.message || e.message,
        type: 'danger',
      });
    } finally {
      setLoading('');
    }
  };

  const handleReschedule = async () => {
    try {
      setRescheduleLoading(true);
      const res = await TrainerBookingAPI.reschedule(token, bookingId, {
        date: selectedDate,
        time: selectedTime,
      });
      if (res?.success) {
        showMessage({
          message: 'Booking rescheduled successfully',
          type: 'success',
        });
        setIsRescheduleModalVisible(false);
        navigation.goBack();
      } else {
        showMessage({
          message: res?.message || 'Reschedule failed',
          type: 'danger',
        });
      }
    } catch (e) {
      showMessage({
        message: e?.response?.data?.message || e.message,
        type: 'danger',
      });
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <WrapperContainer>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: responsiveScreenWidth(6),
            marginTop: responsiveScreenHeight(2),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(3.5),
              fontFamily: FontFamily.Bold,
              marginBottom: responsiveScreenHeight(3),
            }}>
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
              source={{
                uri:
                  displayUser?.profileImage ||
                  'https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg',
              }}
              style={{
                width: responsiveScreenWidth(18),
                height: responsiveScreenWidth(18),
                borderRadius: 36,
                borderWidth: 2,
                borderColor: '#9FED3A',
              }}
            />
            <View style={{marginLeft: responsiveScreenWidth(4), flex: 1}}>
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
                {isTrainer
                  ? 'Client'
                  : displayUser?.Speciality?.[0]?.value ||
                    'Professional Trainer'}
              </Text>
              <View style={{flexDirection: 'row', gap: 6, flexWrap: 'wrap'}}>
                <View
                  style={{
                    marginTop: 6,
                    backgroundColor:
                      normalizedStatus === 'confirmed'
                        ? '#9FED3A'
                        : normalizedStatus === 'rejected'
                          ? '#FF4B4B'
                          : normalizedStatus === 'completed'
                            ? '#4A90E2'
                            : normalizedStatus === 'trainer_completed'
                              ? '#FFA500'
                              : '#BBBBBB',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 10,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}>
                    {currentStatus.replace('_', ' ')}
                  </Text>
                </View>

                {isTrainer && (
                  <View
                    style={{
                      marginTop: 6,
                      backgroundColor:
                        data?.payment?.paymentStatus === 'succeeded'
                          ? '#9FED3A'
                          : '#FF4B4B',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 10,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
                      {['succeeded', 'paid'].includes(
                        data?.payment?.paymentStatus,
                      )
                        ? 'PAID'
                        : 'UNPAID'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: responsiveWidth(2)}}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    if (!displayUser?._id) {
                      showMessage({
                        message: 'User information missing',
                        type: 'warning',
                      });
                      return;
                    }

                    const userId = isTrainer ? displayUser?._id : authData?._id;
                    const trainerId = isTrainer
                      ? authData?._id
                      : displayUser?._id;

                    const res = await BookingAPI.createConversation(
                      userId,
                      trainerId,
                    );
                    console.log('responce:', res);
                    if (res.success) {
                      const conversation = res.conversation || res.data;
                      navigation.navigate('ChatScreen', {
                        conversationId: conversation?._id,
                        otherUser: displayUser,
                      });
                    }
                  } catch (error) {
                    console.log(
                      'Chat error:',
                      error?.response?.data || error.message,
                    );
                    showMessage({
                      message: 'Failed to start chat',
                      type: 'danger',
                    });
                  }
                }}
                style={styles.iconBtn}>
                <Icon
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#9FED3A"
                />
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
              <View style={{flex: 1}}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {data?.trainerId?.Address ||
                    data?.trainerData?.Address ||
                    data?.address ||
                    data?.data?.Address ||
                    'Not Available'}
                </Text>
                <Text style={{color: '#9FED3A', fontSize: 12, marginTop: 4}}>
                  0.31 mi away
                </Text>
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
                  Total price $
                  {data?.amount
                    ? data.amount / 100
                    : data?.hourlyRate || data?.data?.Hourlyrate || '0'}
                </Text>
                <Text style={{color: '#8E8E93', fontSize: 12, marginTop: 4}}>
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
                  {data?.reminder || data?.data?.Reminder || 'None'} before
                  session
                </Text>
                <Text style={{color: '#8E8E93', fontSize: 12, marginTop: 4}}>
                  Repeat: Off
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{height: responsiveScreenHeight(12)}} />
      </ScrollView>

      {isTrainer ? (
        <View style={styles.bottomBar}>
          <View style={{gap: 12}}>
            {normalizedStatus === 'pending' ? (
              <>
                <ButtonComp
                  onPress={() => handleStatusUpdate('confirmed')}
                  isLoading={loading === 'confirmed'}
                  isDisable={!!loading}
                  text="Accept Booking"
                  mainStyle={{backgroundColor: '#9FED3A', width: '100%'}}
                  textstyle={{color: 'black', fontFamily: FontFamily.Bold}}
                />
                <ButtonComp
                  textstyle={{color: '#FF4B4B', fontFamily: FontFamily.Bold}}
                  onPress={() => handleStatusUpdate('rejected')}
                  isLoading={loading === 'rejected'}
                  isDisable={!!loading}
                  text="Decline Booking"
                  mainStyle={{
                    backgroundColor: null,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: '#FF4B4B',
                  }}
                />
              </>
            ) : normalizedStatus === 'confirmed' ? (
              <>
                <ButtonComp
                  onPress={handleTrainerComplete}
                  isLoading={loading === 'trainer_completed'}
                  isDisable={!!loading}
                  text="Complete Session"
                  mainStyle={{backgroundColor: '#9FED3A', width: '100%'}}
                  textstyle={{color: 'black', fontFamily: FontFamily.Bold}}
                />
                <ButtonComp
                  onPress={() => setIsRescheduleModalVisible(true)}
                  text="Reschedule"
                  mainStyle={{
                    backgroundColor: '#181818',
                    width: '100%',
                    borderWidth: 1,
                    borderColor: '#9FED3A',
                  }}
                  textstyle={{color: '#9FED3A', fontFamily: FontFamily.Bold}}
                />
              </>
            ) : null}
            <ButtonComp
              onPress={() => {
                if (isTrainer) {
                  navigation.navigate('TrainerBttomStack', {
                    screen: 'CompletedTrainerHome',
                  });
                } else {
                  navigation.navigate('Bottom', {screen: 'Home'});
                }
              }}
              text="Back to Home"
              mainStyle={{
                backgroundColor:
                  normalizedStatus === 'confirmed' ? '#181818' : '#9FED3A',
                width: '100%',
                borderWidth: normalizedStatus === 'confirmed' ? 1 : 0,
                borderColor: '#9FED3A',
              }}
              textstyle={{
                color: normalizedStatus === 'confirmed' ? '#9FED3A' : 'black',
                fontFamily: FontFamily.Bold,
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <View style={{gap: 12}}>
            {normalizedStatus === 'trainer_completed' && (
              <ButtonComp
                onPress={() => handleUserApprove()}
                isLoading={loading === 'approve'}
                isDisable={!!loading}
                text="Approve Completion (End Session)"
                mainStyle={{backgroundColor: '#9FED3A', width: '100%'}}
                textstyle={{color: 'black', fontFamily: FontFamily.Bold}}
              />
            )}

            {normalizedStatus === 'completed' && (
              <ButtonComp
                onPress={() => {
                  navigation.navigate('AddReviewScreen', {
                    trainerId:
                      data?.trainerId?._id ||
                      data?.trainerId ||
                      data?.data?.trainerId,
                  });
                }}
                text="Approve Completion (Leave a Review)"
                mainStyle={{backgroundColor: '#9FED3A', width: '100%'}}
                textstyle={{color: 'black', fontFamily: FontFamily.Bold}}
              />
            )}

            <ButtonComp
              onPress={() => {
                if (isTrainer) {
                  navigation.navigate('TrainerBttomStack', {
                    screen: 'CompletedTrainerHome',
                  });
                } else {
                  navigation.navigate('Bottom', {screen: 'Home'});
                }
              }}
              text="Back to Home"
              mainStyle={{
                backgroundColor:
                  normalizedStatus === 'confirmed' ||
                  normalizedStatus === 'trainer_completed'
                    ? '#181818'
                    : '#9FED3A',
                width: '100%',
                borderWidth:
                  normalizedStatus === 'confirmed' ||
                  normalizedStatus === 'trainer_completed'
                    ? 1
                    : 0,
                borderColor: '#9FED3A',
              }}
              textstyle={{
                color:
                  normalizedStatus === 'confirmed' ||
                  normalizedStatus === 'trainer_completed'
                    ? '#9FED3A'
                    : 'black',
                fontFamily: FontFamily.Bold,
              }}
            />
            {(normalizedStatus === 'pending' ||
              normalizedStatus === 'confirmed') && (
              <TouchableOpacity
                style={{marginTop: 15, alignItems: 'center'}}
                onPress={() => setCancelModalVisible(true)}>
                <Text
                  style={{color: '#FF4B4B', fontFamily: FontFamily.Semi_Bold}}>
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

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
            <Text style={styles.modalSubTitle}>
              Please select a reason for cancellation
            </Text>

            <View style={{marginBottom: 20}}>
              {reasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reasonOption}
                  onPress={() => setSelectedReason(reason)}>
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason && {
                        color: '#9FED3A',
                        fontFamily: FontFamily.Bold,
                      },
                    ]}>
                    {reason}
                  </Text>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedReason === reason && {borderColor: '#9FED3A'},
                    ]}>
                    {selectedReason === reason && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <ButtonComp
              onPress={async () => {
                try {
                  if (!selectedReason) return;

                  if (!bookingId) {
                    showMessage({
                      message: 'Booking ID missing',
                      type: 'danger',
                    });
                    return;
                  }

                  setCancelLoading(true);

                  const res = await BookingAPI.cancelBooking(
                    token,
                    bookingId,
                    selectedReason,
                  );

                  if (!res?.success) {
                    showMessage({
                      message: res?.message || 'Failed to cancel booking',
                      type: 'danger',
                    });
                    return;
                  }

                  setCancelModalVisible(false);

                  showMessage({
                    message: 'Booking Cancelled Successfully',
                    type: 'success',
                  });

                  navigation.replace('Bottom');
                } catch (e) {
                  showMessage({
                    message:
                      e?.response?.data?.message || e.message || 'Cancel error',
                    type: 'danger',
                  });
                } finally {
                  setCancelLoading(false);
                }
              }}
              isLoading={cancelLoading}
              text="Confirm Cancellation"
              mainStyle={{
                backgroundColor:
                  selectedReason && !cancelLoading ? '#FF4B4B' : '#3A3A3A',
                marginBottom: 10,
              }}
              textstyle={{
                color: selectedReason && !cancelLoading ? 'white' : '#777',
                fontFamily: FontFamily.Bold,
              }}
            />

            <TouchableOpacity
              style={{paddingVertical: 15, alignItems: 'center'}}
              onPress={() => setCancelModalVisible(false)}>
              <Text style={{color: 'white', fontFamily: FontFamily.Semi_Bold}}>
                Keep Booking
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <RescheduleModal
        isVisible={isRescheduleModalVisible}
        onClose={() => setIsRescheduleModalVisible(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        onConfirm={handleReschedule}
        loading={rescheduleLoading}
      />
    </WrapperContainer>
  );
};

const RescheduleModal = ({
  isVisible,
  onClose,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm,
  loading,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.rescheduleContainer}>
          <View style={styles.rescheduleHeader}>
            <Text style={styles.modalTitle}>Reschedule Booking</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Select Date</Text>
            <Calendar
              theme={{
                backgroundColor: '#1E1E1E',
                calendarBackground: '#1E1E1E',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#9FED3A',
                selectedDayTextColor: '#000',
                todayTextColor: '#9FED3A',
                dayTextColor: '#fff',
                textDisabledColor: '#444',
                dotColor: '#9FED3A',
                selectedDotColor: '#ffffff',
                arrowColor: '#9FED3A',
                monthTextColor: '#fff',
                indicatorColor: 'blue',
                textDayFontFamily: FontFamily.Medium,
                textMonthFontFamily: FontFamily.Bold,
                textDayHeaderFontFamily: FontFamily.Semi_Bold,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: 'orange',
                },
              }}
              minDate={moment().format('YYYY-MM-DD')}
            />

            <Text style={styles.sectionLabel}>Select Time</Text>
            <TouchableOpacity
              style={styles.timePickerBtn}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timePickerText}>{selectedTime}</Text>
              <Icon name="time-outline" size={20} color="#9FED3A" />
            </TouchableOpacity>

            <ButtonComp
              isLoading={loading}
              text="Confirm Reschedule"
              onPress={onConfirm}
              mainStyle={{marginTop: 20, backgroundColor: '#9FED3A'}}
              textstyle={{color: 'black'}}
            />
          </ScrollView>
        </View>

        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          onConfirm={date => {
            setSelectedTime(moment(date).format('hh:mm A'));
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />
      </View>
    </Modal>
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
  rescheduleContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  rescheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#9FED3A',
    fontFamily: FontFamily.Semi_Bold,
    fontSize: 16,
    marginVertical: 15,
  },
  timePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 12,
  },
  timePickerText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
});
