import React, {useCallback, useState} from 'react';
import {NativeModules} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';

import WrapperContainer from '../../Components/Wrapper';
import ProfileImageModal from '../../Components/ProfileImageModal';
import ImageSourceModal from '../../Components/ImageSourceModal';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {Images} from '../../utils/Images';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

import {useSelector, useDispatch} from 'react-redux';
import {updateLogin} from '../../store/Slices/AuthSlice';

import ImageCropPicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {MAP_API_KEY} from '../../config/urls';
import {PermissionsAndroid} from 'react-native';
// =======================================================
// CONSTANTS
// =======================================================

const fitnessOptions = [
  'Adventure Sports Coaching',
  'Boxing',
  'Core Strength Training',
  'Cross-Fit',
  'Cycling',
  'Flexibility and Mobility Training',
  'Functional Training',
  'Group Fitness Classes',
  'High-Intensity Interval Training (HIIT)',
  'Kickboxing',
  'Martial Arts',
  'Nutrition Coaching',
  'Pilates',
  'Post-Rehabilitation Training',
];

const goalOptions = [
  'Body Composition',
  'Enhanced Athletic Performance',
  'Event Preparation',
  'General Fitness',
  'Healthy Aging',
  'Improved Endurance',
  'Mind-Body Connection',
  'Muscle Gain',
  'Posture Correction',
  'Rehabilitation',
  'Sport-Specific Training',
  'Stress Relief',
  'Weight Loss',
];

const allSpecialities = [
  {key: 1, value: 'Yoga'},
  {key: 2, value: 'Strength Training'},
  {key: 3, value: 'Crossfit'},
  {key: 4, value: 'Cardio Fitness'},
];

// =======================================================

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth.data);

  const {LocationModule} = NativeModules;

  // ================= STATES =================

  const [profile, setProfile] = useState(null);

  const [bio, setBio] = useState('');
  const [hourly, setHourly] = useState('');
  const [specialities, setSpecialities] = useState([]);
  const [times, setTimes] = useState([]);
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [pref, setPref] = useState('');
  const [goal, setGoal] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timePicker, setTimePicker] = useState(false);

  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  const [prefModal, setPrefModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [imageModal, setImageModal] = useState(false);
  const [sourceModal, setSourceModal] = useState(false);

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {
    const res = await axiosBaseURL.get(`/Common/GetProfile/${auth.token}`);
    const d = res.data.data;

    console.log('Fresh Data From Database:', d);

    setProfile(d);
    setBio(d.Bio || '');
    setHourly(d.Hourlyrate || '');
    setSpecialities(d.Speciality || []);
    setTimes(d.Availiblity || []);
    setDob(d.Dob || '');
    setWeight(d.weight || '');
    setHeight(d.height || '');
    setPref(d.fitnessPreference || '');
    setGoal(d.goal || '');
    setAddress(d.Address || '');
    setCoords(d.location?.coordinates || null);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  // ================= HELPERS =================

  const calculateAge = d => {
    if (!d) return '-';
    const [day, month, year] = d.split('/');
    const birth = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    )
      age--;

    return age;
  };

  // ================= IMAGE =================

  const uploadImage = async image => {
    const formData = new FormData();
    formData.append('profileImage', {
      uri: image.path,
      type: image.mime,
      name: 'profile.jpg',
    });
    formData.append('email', auth.email);

    const res = await axiosBaseURL.post(
      '/trainer/uploadProfileImage',
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    );

    dispatch(updateLogin({profileImage: res.data.url}));
    fetchProfile();
  };

  const deleteImage = async () => {
    await axiosBaseURL.delete('/trainer/deleteProfileImage', {
      headers: {Authorization: `Bearer ${auth.token}`},
      data: {email: auth.email},
    });
    dispatch(updateLogin({profileImage: null}));
    fetchProfile();
  };

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
        async position => {
          const {latitude, longitude} = position.coords;

          setCoords([longitude, latitude]);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          const data = await response.json();

          if (data?.display_name) {
            setAddress(data.display_name);

            showMessage({
              message: 'Location fetched successfully',
              type: 'success',
            });
          }
        },
        error => {
          console.log(error);
          showMessage({message: 'Location failed', type: 'danger'});
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    } catch (err) {
      console.log(err);
    }
  };

  // const getCurrentLocation = async () => {
  //   try {
  //     const {LocationModule} = NativeModules;

  //     const res = await LocationModule.getCurrentLocation();

  //     const latitude = res.lat;
  //     const longitude = res.lng;

  //     console.log('Native coords:', latitude, longitude);

  //     setCoords([longitude, latitude]);

  //     // ⭐ FIXED: add headers
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
  //       {
  //         headers: {
  //           'User-Agent': 'trainer-app',
  //           Accept: 'application/json',
  //         },
  //       },
  //     );

  //     const data = await response.json();

  //     console.log('Geo response:', data);

  //     if (data?.display_name) {
  //       setAddress(data.display_name);

  //       showMessage({
  //         message: 'Location fetched successfully',
  //         type: 'success',
  //       });
  //     } else {
  //       throw new Error('No address found');
  //     }
  //   } catch (err) {
  //     console.log('Location error:', err);

  //     showMessage({
  //       message: 'Location failed',
  //       description: 'Could not fetch address',
  //       type: 'danger',
  //     });
  //   }
  // };

  // ================= SAVE =================

  const handleSave = async () => {
    await axiosBaseURL.post(
      '/trainer/update',
      {
        email: auth.email,
        Bio: bio,
        Hourlyrate: hourly,
        Speciality: specialities,
        Availiblity: times,
        Dob: dob,
        weight,
        height,
        fitnessPreference: pref,
        goal,
        Address: address,
        location: {type: 'Point', coordinates: coords},
      },
      {headers: {Authorization: `Bearer ${auth.token}`}},
    );

    showMessage({message: 'Profile Updated', type: 'success'});
    navigation.goBack();
  };

  // ================= COMPONENTS =================

  const Label = ({title}) => <Text style={styles.label}>{title}</Text>;

  const Chip = ({text, selected, onPress}) => (
    <TouchableOpacity
      style={[styles.chip, {backgroundColor: selected ? '#9FED3A' : '#181818'}]}
      onPress={onPress}>
      <Text style={{color: selected ? '#000' : '#9FED3A'}}>{text}</Text>
    </TouchableOpacity>
  );

  const SelectModal = ({visible, data, onSelect, onClose}) => (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalBox}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}>
                <Text style={{color: '#fff'}}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ================= UI =================

  if (!profile) return null;

  return (
    <WrapperContainer>
      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* IMAGE */}
        <View style={styles.avatarWrap}>
          <Image
            source={
              profile.profileImage
                ? {uri: profile.profileImage}
                : Images.profile
            }
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setImageModal(true)}>
            <Image resizeMode="cover" source={Images.edit_icon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{profile.fullName}</Text>

        {/* BIO */}
        <Label title="Bio" />
        <TextInput style={styles.input} value={bio} onChangeText={setBio} />

        {/* AGE */}
        <Label title="Age" />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}>
          <Text style={{color: '#fff'}}>{calculateAge(dob) + ' '}Year's</Text>
        </TouchableOpacity>

        {/* WEIGHT */}
        <Label title="Weight (lbs)" />
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
        />

        {/* HEIGHT */}
        <Label title="Height (ft)" />
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
        />

        {/* PREFERENCE */}
        <Label title="Preference" />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setPrefModal(true)}>
          <Text style={{color: '#fff'}}>{pref || 'Select Preference'}</Text>
        </TouchableOpacity>

        {/* GOAL */}
        <Label title="Goal" />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setGoalModal(true)}>
          <Text style={{color: '#fff'}}>{goal || 'Select Goal'}</Text>
        </TouchableOpacity>

        {/* SPECIALITIES */}
        <Label title="Specialities" />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={allSpecialities}
          renderItem={({item}) => {
            const selected = specialities.some(s => s.key === item.key);
            return (
              <Chip
                text={item.value}
                selected={selected}
                onPress={() =>
                  selected
                    ? setSpecialities(prev =>
                        prev.filter(s => s.key !== item.key),
                      )
                    : setSpecialities(prev => [...prev, item])
                }
              />
            );
          }}
        />

        {/* AVAILABILITY */}
        <View style={styles.rowBetween}>
          <Label title="Availability" />
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => setTimePicker(true)}>
            <Image source={Images.edit_icon} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={times}
          renderItem={({item}) => <Chip text={item} selected />}
        />

        <View style={{marginBottom: responsiveHeight(2)}}>
          <Text style={styles.fieldLabel}>Location</Text>

          <TouchableOpacity
            style={styles.inputBox}
            onPress={getCurrentLocation}>
            <Text style={styles.inputText}>
              {address || 'Tap to fetch location'}
            </Text>

            <Image
              source={Images.edit_icon}
              style={{position: 'absolute', right: 10}}
            />
          </TouchableOpacity>
        </View>
        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={{color: '#000'}}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={showDatePicker} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.pickerSheet}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(e, d) => d && setTempDate(d)}
            />

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => {
                const formatted = moment(tempDate).format('DD/MM/YYYY');
                setDob(formatted);
                setShowDatePicker(false);
              }}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TIME MODAL — 100% iOS SAFE */}
      <Modal
        visible={timePicker}
        transparent
        animationType="slide"
        statusBarTranslucent>
        <View style={styles.overlay}>
          {/* tap outside to close */}
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={() => setTimePicker(false)}
          />

          {/* BOTTOM SHEET */}
          <View style={styles.timeSheet}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              onChange={(e, d) => d && setTempTime(d)}
            />

            <View style={styles.timeBtnRow}>
              <TouchableOpacity
                style={[styles.timeBtn, {backgroundColor: '#444'}]}
                onPress={() => setTimePicker(false)}>
                <Text style={{color: '#fff'}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeBtn}
                onPress={() => {
                  const t = moment(tempTime).format('hh:mm A');

                  if (!times.includes(t)) {
                    setTimes(prev => [...prev, t]);
                  }

                  setTimePicker(false);
                }}>
                <Text style={{color: '#000', fontWeight: '700'}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SelectModal
        visible={prefModal}
        data={fitnessOptions}
        onSelect={setPref}
        onClose={() => setPrefModal(false)}
      />
      <SelectModal
        visible={goalModal}
        data={goalOptions}
        onSelect={setGoal}
        onClose={() => setGoalModal(false)}
      />

      <ProfileImageModal
        visible={imageModal}
        onClose={() => setImageModal(false)}
        onChange={() => {
          setImageModal(false);
          setTimeout(() => setSourceModal(true), 200);
        }}
        onRemove={deleteImage}
      />

      <ImageSourceModal
        visible={sourceModal}
        onClose={() => setSourceModal(false)}
        onCamera={() =>
          ImageCropPicker.openCamera({cropping: true}).then(uploadImage)
        }
        onGallery={() =>
          ImageCropPicker.openPicker({cropping: true}).then(uploadImage)
        }
      />
    </WrapperContainer>
  );
};

export default EditProfile;

// ================= STYLES =================

const styles = StyleSheet.create({
  avatarWrap: {alignItems: 'center', marginVertical: 20},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#9FED3A',
  },
  editBtn: {position: 'absolute', bottom: 0, right: responsiveWidth(30)},

  name: {textAlign: 'center', color: '#fff', fontSize: 22, marginBottom: 20},

  label: {color: '#9FED3A', marginBottom: 6},

  pickerSheet: {
    backgroundColor: '#9FED3A',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },

  okBtn: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  okText: {
    color: '#9FED3A',
    fontWeight: '700',
    fontSize: 16,
  },

  input: {
    borderWidth: 0.5,
    borderColor: '#444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#9FED3A',
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: '#9FED3A',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginTop: 25,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#111',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalItem: {paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#333'},
  locationContainer: {
    marginBottom: responsiveHeight(2.2),
  },

  fieldLabel: {
    color: '#9FED3A',
    // fontFamily: FontFamily.Medium,
    fontSize: responsiveFontSize(1.9),
    marginBottom: responsiveHeight(0.6),
  },

  inputBox: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: responsiveHeight(1.6),
    paddingHorizontal: responsiveWidth(4),
    justifyContent: 'center',
  },

  inputText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },

  locationIcon: {
    position: 'absolute',
    right: responsiveWidth(4),
    height: responsiveWidth(5),
    width: responsiveWidth(5),
    tintColor: '#9FED3A',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // ⭐ key fix
  },

  timeSheet: {
    backgroundColor: '#9FED3A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },

  timeBtnRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },

  timeBtn: {
    flex: 1,
    backgroundColor: '#9FED3A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
});
