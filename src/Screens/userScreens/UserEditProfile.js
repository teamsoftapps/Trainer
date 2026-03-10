import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import Geolocation from '@react-native-community/geolocation';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector, useDispatch} from 'react-redux';
import {updateLogin} from '../../store/Slices/AuthSlice';
import ImageCropPicker from 'react-native-image-crop-picker';
import CountryPicker from 'react-native-country-picker-modal';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const genderOptions = ['Male', 'Female', 'Other'];

const UserEditProfile = () => {
  const auth = useSelector(state => state.Auth.data);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('1');
  const [country, setCountry] = useState('US');
  const [showPicker, setShowPicker] = useState(false);

  const [imageUri, setImageUri] = useState('');
  const [photoModal, setPhotoModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosBaseURL.get(`/Common/GetProfile/${auth.token}`);
      const data = res.data.data;

      if (data) {
        setFirstName(data.fullName || '');
        setGender(data.gender || '');
        setDob(data.Dob || '');
        setAddress(data.Address || '');
        setImageUri(data.profileImage || '');

        if (data.phone) {
          setCountryCode(data.phone.countryCode || '1');
          setPhone(data.phone.number || '');
        }

        if (data.locationCoordinates?.lat && data.locationCoordinates?.lng) {
          setCoords([
            data.locationCoordinates.lng,
            data.locationCoordinates.lat,
          ]);
        }
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
      showMessage({message: 'Failed to load profile', type: 'danger'});
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCoords([longitude, latitude]);
          console.log('coordinates:', longitude, latitude);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
            .then(res => res.json())
            .then(data => {
              if (data?.display_name) {
                setAddress(data.display_name);
              }
            })
            .catch(err => console.log('Reverse geocode error:', err));
        },
        error => {
          console.log('Geolocation error:', error);
          showMessage({message: 'Failed to get location', type: 'danger'});
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = image => {
    setImageUri(image.path);
  };

  const handleSave = async () => {
    if (!firstName.trim())
      return showMessage({message: 'First name is required', type: 'danger'});

    if (!gender)
      return showMessage({message: 'Please select gender', type: 'danger'});

    if (!phone.trim())
      return showMessage({message: 'Phone number required', type: 'danger'});

    if (!dob)
      return showMessage({
        message: 'Please select date of birth',
        type: 'danger',
      });

    if (!address.trim())
      return showMessage({message: 'Address is required', type: 'danger'});

    try {
      setSaving(true);
      const formData = new FormData();

      formData.append('userId', auth._id);
      formData.append('fullName', firstName.trim());
      formData.append('countryCode', countryCode);
      formData.append('phoneNumber', phone);
      formData.append('gender', gender);
      formData.append('dob', dob);
      formData.append('location', address.trim());

      if (coords) {
        formData.append('lat', coords[1]);
        formData.append('lng', coords[0]);
      }

      if (imageUri && !imageUri.startsWith('http')) {
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const res = await axiosBaseURL.post('/user/completeProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      dispatch(updateLogin(res.data.data));
      showMessage({message: 'Profile updated successfully', type: 'success'});
      navigation.goBack();
    } catch (error) {
      console.log('Update error:', error);
      showMessage({message: 'Profile update failed', type: 'danger'});
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <WrapperContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9FED3A" />
        </View>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer>
      <Header onPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
                  : require('../../assets/Images/PlaceholderImage.png')
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editIconBadge}
              onPress={() => setPhotoModal(true)}>
              <Image source={Images.edit_icon} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.uploadTitle}>{firstName || 'User'}</Text>
            <Text style={styles.uploadSubtitle}>
              Update your profile information
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#777"
          value={firstName}
          onChangeText={setFirstName}
        />

        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setGenderModal(true)}>
              <Text style={{color: '#fff'}}>{gender || 'Select Gender'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{width: 20}} />
          <View style={{flex: 1}}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}>
              <Text style={{color: '#fff'}}>{dob || 'Select Date'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Phone</Text>
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryPicker}
            onPress={() => setShowPicker(true)}>
            <CountryPicker
              countryCode={country}
              withFlag
              withCallingCode
              withFilter
              withModal
              visible={showPicker}
              onClose={() => setShowPicker(false)}
              onSelect={c => {
                setCountry(c.cca2);
                setCountryCode(c.callingCode[0]);
                setShowPicker(false);
              }}
            />
            <Text style={{color: '#fff', marginLeft: 5}}>+{countryCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            keyboardType="phone-pad"
            placeholder="Phone Number"
            placeholderTextColor="#777"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.locationHeader}>
          <Text style={styles.label}>Address</Text>
          <TouchableOpacity onPress={getCurrentLocation}>
            <Text style={styles.getLocationText}>Get Current Location</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your full address"
          placeholderTextColor="#777"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
        <View style={{height: 40}} />
      </ScrollView>

      {/* PHOTO MODAL */}
      <Modal transparent visible={photoModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setPhotoModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  ImageCropPicker.openCamera({
                    cropping: true,
                    width: 500,
                    height: 500,
                  }).then(image => {
                    uploadImage(image);
                    setPhotoModal(false);
                  })
                }>
                <Text style={styles.modalItemText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  ImageCropPicker.openPicker({
                    cropping: true,
                    width: 500,
                    height: 500,
                  }).then(image => {
                    uploadImage(image);
                    setPhotoModal(false);
                  })
                }>
                <Text style={styles.modalItemText}>Open Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalItem, {borderBottomWidth: 0}]}
                onPress={() => setPhotoModal(false)}>
                <Text style={[styles.modalItemText, {color: 'red'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* GENDER MODAL */}
      <Modal transparent visible={genderModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setGenderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    index === genderOptions.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => {
                    setGender(item);
                    setGenderModal(false);
                  }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* DATE PICKER */}
      {showDatePicker &&
        (Platform.OS === 'android' ? (
          <DateTimePicker
            value={tempDate}
            mode="date"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate)
                setDob(moment(selectedDate).format('DD/MM/YYYY'));
            }}
          />
        ) : (
          <Modal transparent animationType="slide" visible={showDatePicker}>
            <View style={styles.iosDatePickerOverlay}>
              <View style={styles.iosDatePickerSheet}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(e, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                  }}
                />
                <TouchableOpacity
                  style={styles.okBtn}
                  onPress={() => {
                    setDob(moment(tempDate).format('DD/MM/YYYY'));
                    setShowDatePicker(false);
                  }}>
                  <Text style={{color: '#9FED3A', fontWeight: 'bold'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ))}
    </WrapperContainer>
  );
};

export default UserEditProfile;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    paddingHorizontal: responsiveWidth(7),
    paddingTop: 10,
  },
  title: {
    color: 'white',
    fontSize: responsiveFontSize(3.5),
    fontFamily: FontFamily.Bold,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#9FED3A',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9FED3A',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  editIcon: {
    width: 14,
    height: 14,
    tintColor: '#000',
  },
  profileTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  uploadTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FontFamily.Bold,
  },
  uploadSubtitle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    fontFamily: FontFamily.Regular,
  },
  label: {
    color: '#9FED3A',
    fontSize: 14,
    fontFamily: FontFamily.Semi_Bold,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 14,
    borderRadius: 15,
    color: '#fff',
    backgroundColor: '#1C1C1E',
    fontFamily: FontFamily.Regular,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 15,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#2C2C2E',
  },
  phoneInput: {
    flex: 1,
    padding: 14,
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  getLocationText: {
    color: '#9FED3A',
    fontSize: 12,
    fontFamily: FontFamily.Medium,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#9FED3A',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    shadowColor: '#9FED3A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontFamily: FontFamily.Bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FontFamily.Bold,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    alignItems: 'center',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
  iosDatePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  iosDatePickerSheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  okBtn: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
});
