import React, {useEffect, useState} from 'react';
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
  Alert,
  Linking,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import Geolocation from '@react-native-community/geolocation';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector, useDispatch} from 'react-redux';
import {updateLogin} from '../../store/Slices/AuthSlice';
import ImageCropPicker from 'react-native-image-crop-picker';
import CountryPicker from 'react-native-country-picker-modal';
const genderOptions = ['Male', 'Female'];

const CompleteUserProfile = ({navigation}) => {
  const auth = useSelector(state => state.Auth.data);
  const dispatch = useDispatch();

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

  const [saving, setSaving] = useState(false);

  // ================= PREFILL FROM AUTH =================
  useEffect(() => {
    if (!auth) return;

    if (auth.fullName) {
      setFirstName(auth.fullName);
    }
    if (auth.phone?.countryCode && auth.phone?.number) {
      setCountryCode(auth.phone.countryCode);
      setPhone(auth.phone.number);
    }

    if (auth.gender) setGender(auth.gender);
    if (auth.Dob) setDob(auth.Dob);
    if (auth.Address) setAddress(auth.Address);
    if (auth.profileImage) setImageUri(auth.profileImage);

    if (auth.locationCoordinates?.lat && auth.locationCoordinates?.lng) {
      setCoords([auth.locationCoordinates.lng, auth.locationCoordinates.lat]);
    }
  }, [auth]);

  // ================= AUTO GET LAT/LNG ONLY =================
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const showLocationErrorAlert = () => {
    Alert.alert(
      'Location Error',
      'Unable to get your location. Please ensure GPS is enabled and you have granted location permissions.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Retry', onPress: () => getCurrentLocation()},
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ],
    );
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCoords([longitude, latitude]); // MongoDB format
          console.log('coordinates:', longitude, latitude);

          // Reverse Geocoding
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
          // Only show alert if it's a real error (like timeout or permission)
          // To avoid annoying the user immediately on mount if they haven't decided yet
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ================= IMAGE UPLOAD =================
  const uploadImage = image => {
    setImageUri(image.path); // just store locally
  };

  // ================= SAVE =================
  const handleSave = async () => {
    // ===== VALIDATIONS =====
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

    const age = moment().diff(moment(dob, 'DD/MM/YYYY'), 'years');
    if (age < 13)
      return showMessage({
        message: 'You must be at least 13 years old',
        type: 'danger',
      });

    if (!address.trim())
      return showMessage({message: 'Address is required', type: 'danger'});

    if (!coords || coords.length !== 2) {
      showLocationErrorAlert();
      return;
    }

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
      formData.append('lat', coords[1]);
      formData.append('lng', coords[0]);

      // 🔥 ONLY attach image if new image selected
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

      console.log('Response Data:', res.data.data);

      showMessage({
        message: 'Profile Completed Successfully',
        type: 'success',
      });

      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'MainStack'}],
      // });
    } catch (error) {
      console.log(error);
      showMessage({message: 'Profile update failed', type: 'danger'});
    } finally {
      setSaving(false);
    }
  };

  return (
    <WrapperContainer>
      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* PROFILE IMAGE */}
        {/* PROFILE PICTURE SECTION */}
        <View style={styles.profileSection}>
          <Image
            source={
              imageUri
                ? {uri: imageUri}
                : require('../../assets/Images/PlaceholderImage.png')
            }
            style={styles.profileImage}
          />

          <View style={styles.profileTextContainer}>
            <TouchableOpacity onPress={() => setPhotoModal(true)}>
              <Text style={styles.uploadTitle}>Upload your photo</Text>
            </TouchableOpacity>

            <Text style={styles.uploadSubtitle}>
              Upload a high-quality image.
            </Text>
          </View>
        </View>

        {/* FIRST NAME */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#777"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* GENDER */}
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setGenderModal(true)}>
          <Text style={{color: '#fff'}}>{gender || 'Select Gender'}</Text>
        </TouchableOpacity>

        {/* DOB */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}>
          <Text style={{color: '#fff'}}>{dob || 'Select Date'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Phone</Text>

        <View style={styles.phoneContainer}>
          {/* Country Picker */}
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

          {/* Number */}
          <TextInput
            style={styles.phoneInput}
            keyboardType="phone-pad"
            placeholder="Phone Number"
            placeholderTextColor="#777"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ADDRESS MANUAL INPUT */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}>
          <Text style={[styles.label, {marginBottom: 0}]}>Address</Text>
          <TouchableOpacity onPress={() => getCurrentLocation()}>
            <Text style={{color: '#9FED3A', fontSize: 12}}>
              Get Current Location
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your full address"
          placeholderTextColor="#777"
          value={address}
          onChangeText={setAddress}
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={{color: '#000'}}>Save & Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* IMAGE MODAL */}
      <Modal transparent visible={photoModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setPhotoModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  ImageCropPicker.openCamera({cropping: true}).then(image => {
                    uploadImage(image);
                    setPhotoModal(false);
                  })
                }>
                <Text style={{color: '#000'}}>Open Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  ImageCropPicker.openPicker({cropping: true}).then(image => {
                    uploadImage(image);
                    setPhotoModal(false);
                  })
                }>
                <Text style={{color: '#000'}}>Open Gallery</Text>
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
              {genderOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setGender(item);
                    setGenderModal(false);
                  }}>
                  <Text style={{color: '#000'}}>{item}</Text>
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
          <Modal transparent animationType="slide">
            <View style={styles.overlay}>
              <View style={styles.sheet}>
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
                  <Text style={{color: '#9FED3A'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ))}
    </WrapperContainer>
  );
};

export default CompleteUserProfile;

const styles = StyleSheet.create({
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#444',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#111',
    alignItems: 'center',
  },

  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 0.5,
    borderRightColor: '#444',
  },

  phoneInput: {
    flex: 1,
    padding: 12,
    color: '#fff',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#222',
  },

  profileTextContainer: {
    marginLeft: 18,
    flex: 1,
  },

  uploadTitle: {
    color: '#9FED3A',
    fontSize: 16,
    fontWeight: '600',
  },

  uploadSubtitle: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
  },

  avatarWrap: {alignItems: 'center', marginVertical: 20},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#9FED3A',
  },
  label: {color: '#9FED3A', marginBottom: 6},
  input: {
    borderWidth: 0.5,
    borderColor: '#444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: '#111',
  },
  saveBtn: {
    backgroundColor: '#9FED3A',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginTop: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#9FED3A',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalItem: {paddingVertical: 15},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#9FED3A',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  okBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
  },
});
