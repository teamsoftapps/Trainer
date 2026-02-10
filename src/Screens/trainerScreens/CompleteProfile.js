import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {PermissionsAndroid, NativeModules, Platform} from 'react-native';
import {FontFamily, Images} from '../../utils/Images';
import ButtonComp from '../../Components/ButtonComp';
import {availableTimes, Specialities, TimeSlots} from '../../utils/Dummy';
import axiosBaseURL from '../../services/AxiosBaseURL';
import ImageCropPicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {saveProfileImage} from '../../store/Slices/profileImage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {IsLogin, updateLogin} from '../../store/Slices/AuthSlice';
import Geolocation from '@react-native-community/geolocation';

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

const CompleteProfile = ({route}) => {
  // Data States
  const [firstname, setfirstname] = useState('');
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState('');
  const [Speciality, setSpeciality] = useState([]);
  const navigation = useNavigation();

  // Formik States
  const [specialityformik, setspecialityformik] = useState(false);
  const [Bioformik, setBioformik] = useState(false);
  const [Hourlyformik, setHourlyformik] = useState(false);
  const [timeformik, settimeformik] = useState(false);

  const [isModal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [weight, setweight] = useState('');
  const [height, setheight] = useState('');
  const [fitnessPreference, setFitnessPreference] = useState('');
  const [goal, setGoal] = useState('');

  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fitnessModal, setFitnessModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [bundles, setBundles] = useState([]);
  const [bundleModal, setBundleModal] = useState(false);

  const [bundleName, setBundleName] = useState('');
  const [bundleDesc, setBundleDesc] = useState('');
  const [bundlePrice, setBundlePrice] = useState('');
  const [bundleItems, setBundleItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const [certificate, setCertificate] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState('');

  const [focused, setFocused] = useState(null);
  const [time, setTime] = useState(new Date());
  const logedInTrainer = useSelector(state => state.Auth.data);
  const isGoogleUser = logedInTrainer?.authProvider === 'google';

  console.log('trainer data in complete profile: ', logedInTrainer.token);

  const showBasicFields = isGoogleUser;

  const dispatch = useDispatch();

  const {LocationModule} = NativeModules;

  const handleSpecialitySelect = useCallback(selectedSpecialities => {
    setDropdownVisible(false);
    setSelectedSpecialities(prev => {
      if (prev.some(item => item.key === selectedSpecialities.key)) {
        return prev.filter(item => item.key !== selectedSpecialities.key);
      } else {
        return [...prev, selectedSpecialities];
      }
    });
  });

  const toggleModalTimes = () => {
    setModalVisible(true);
  };

  const handleRemoveSpeciality = speciality => {
    setSelectedSpecialities(prev =>
      prev.filter(item => item.key !== speciality.key),
    );
  };

  const onTimeChange = useCallback((event, selectedTime) => {
    if (event.type === 'set' && selectedTime) {
      const formatted = moment(selectedTime).format('hh:mm A');

      setSelectedTimes(prev =>
        prev.includes(formatted) ? prev : [...prev, formatted],
      );

      setTime(selectedTime);
    }
    setModalVisible(false);
  }, []);

  const handleCertificatePick = () => {
    ImageCropPicker.openPicker({
      mediaType: 'any', // ⭐ allow image/pdf both
    })
      .then(file => {
        setCertificate(file);
        setCertificatePreview(file.path);
      })
      .catch(() => {});
  };

  const Function = async () => {
    // ---------- VALIDATION ----------
    const validationChecks = [
      {condition: Bio.trim() !== '', message: 'Please add your bio.'},
      {
        condition:
          Array.isArray(selectedSpecialities) &&
          selectedSpecialities.length > 0,
        message: 'Please select at least one speciality.',
      },
      {condition: Hourly > 0, message: 'Please enter a valid hourly rate.'},
      {
        condition: Array.isArray(selectedTimes) && selectedTimes.length > 0,
        message: 'Please select your availability times.',
      },
      {
        condition: isGoogleUser ? weight > 0 : true,
        message: 'Please enter your weight.',
      },
      {
        condition: isGoogleUser ? height > 0 : true,
        message: 'Please enter your height.',
      },
      {
        condition: isGoogleUser ? fitnessPreference : true,
        message: 'Please select fitness preference.',
      },
      {
        condition: isGoogleUser ? goal : true,
        message: 'Please select goal.',
      },
      {
        condition: isGoogleUser ? !!dob : true,
        message: 'Please select your age.',
      },
    ];

    for (const {condition, message} of validationChecks) {
      if (!condition) {
        return showMessage({
          message: 'Validation Error',
          description: message,
          type: 'danger',
        });
      }
    }

    try {
      setUploading(true);

      // =================================================
      // ✅ FORM DATA (REQUIRED FOR FILE UPLOAD)
      // =================================================
      const formData = new FormData();

      formData.append('email', logedInTrainer?.email);
      formData.append('Bio', Bio);
      formData.append('Hourlyrate', Hourly);

      // arrays → stringify
      formData.append('Speciality', JSON.stringify(selectedSpecialities));
      formData.append('Availiblity', JSON.stringify(selectedTimes));
      formData.append('bundles', JSON.stringify(bundles || []));

      // google fields
      if (isGoogleUser) {
        formData.append('Dob', dob);
        formData.append('weight', weight);
        formData.append('height', height);
        formData.append('fitnessPreference', fitnessPreference);
        formData.append('goal', goal);
      }

      // =================================================
      // ⭐ CERTIFICATE FILE
      // =================================================
      if (certificate) {
        formData.append('certificate', {
          uri: certificate.path,
          type: certificate.mime || 'image/jpeg',
          name: `certificate-${Date.now()}.jpg`,
        });
      }

      // =================================================
      // API CALL
      // =================================================
      const res = await axiosBaseURL.post('/trainer/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${logedInTrainer?.token}`,
        },
      });

      console.log('Update response:', res.data);

      // =================================================
      // REDUX UPDATE
      // =================================================
      dispatch(
        updateLogin({
          Bio,
          Speciality: selectedSpecialities,
          Hourlyrate: Hourly,
          Availiblity: selectedTimes,
          Dob: dob,
          weight,
          height,
          fitnessPreference,
          goal,
          bundles: bundles || [],
        }),
      );

      // =================================================
      // SUCCESS
      // =================================================
      showMessage({
        message: 'Profile completed!',
        description: 'Choose your subscription plan',
        type: 'success',
      });

      navigation.replace('Subscription');
    } catch (error) {
      console.log(error);

      showMessage({
        message: 'Error',
        description: 'Failed to update profile',
        type: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  // const Function = async () => {
  //   // ---------- VALIDATION ----------
  //   const validationChecks = [
  //     {
  //       condition: Bio.trim() !== '',
  //       message: 'Please add your bio.',
  //     },
  //     {
  //       condition:
  //         Array.isArray(selectedSpecialities) &&
  //         selectedSpecialities.length > 0,
  //       message: 'Please select at least one speciality.',
  //     },
  //     {
  //       condition: Hourly > 0,
  //       message: 'Please enter a valid hourly rate.',
  //     },
  //     {
  //       condition: Array.isArray(selectedTimes) && selectedTimes.length > 0,
  //       message: 'Please select your availability times.',
  //     },
  //     {
  //       condition: isGoogleUser ? weight > 0 : true,
  //       message: 'Please enter your weight.',
  //     },
  //     {
  //       condition: isGoogleUser ? height > 0 : true,
  //       message: 'Please enter your height.',
  //     },
  //     {
  //       condition: isGoogleUser ? fitnessPreference : true,
  //       message: 'Please select fitness preference.',
  //     },
  //     {
  //       condition: isGoogleUser ? goal : true,
  //       message: 'Please select goal.',
  //     },
  //     {
  //       condition: isGoogleUser ? !!dob : true,
  //       message: 'Please select your age.',
  //     },
  //     // ❌ bundles skipped (optional)
  //   ];

  //   for (const {condition, message} of validationChecks) {
  //     if (!condition) {
  //       return showMessage({
  //         message: 'Validation Error',
  //         description: message,
  //         type: 'danger',
  //       });
  //     }
  //   }

  //   try {
  //     setUploading(true);
  //     // ---------- API CALL ----------
  //     const response = await axiosBaseURL.post(
  //       '/trainer/update',
  //       {
  //         email: logedInTrainer?.email,

  //         Bio,
  //         Speciality: selectedSpecialities,
  //         Hourlyrate: Hourly,
  //         Availiblity: selectedTimes,

  //         // ⭐ ONLY send if google user
  //         Dob: isGoogleUser ? dob : undefined,
  //         weight: isGoogleUser ? weight : undefined,
  //         height: isGoogleUser ? height : undefined,
  //         fitnessPreference: isGoogleUser ? fitnessPreference : undefined,
  //         goal: isGoogleUser ? goal : undefined,
  //         bundles: bundles || [],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${logedInTrainer?.token}`,
  //         },
  //       },
  //     );

  //     // ---------- REDUX UPDATE ----------
  //     dispatch(
  //       updateLogin({
  //         Bio,
  //         Speciality: selectedSpecialities,
  //         Hourlyrate: Hourly,
  //         Availiblity: selectedTimes,
  //         Dob: dob,
  //         weight,
  //         height,
  //         fitnessPreference,
  //         goal,
  //         bundles: bundles || [],
  //       }),
  //     );

  //     // ---------- SUCCESS ----------
  //     showMessage({
  //       message: 'Profile completed!',
  //       description: 'Choose your subscription plan',
  //       type: 'success',
  //     });

  //     navigation.replace('Subscription');
  //   } catch (error) {
  //     console.log(error);
  //     showMessage({
  //       message: 'Error',
  //       description: 'Failed to update profile',
  //       type: 'danger',
  //     });
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const uploadImage = async image => {
    try {
      const formData = new FormData();

      formData.append('profileImage', {
        uri: image.path,
        type: image.mime,
        name: `profileImage-${Date.now()}.jpg`,
      });
      formData.append('email', logedInTrainer?.email);

      const response = await axiosBaseURL.post(
        '/trainer/uploadProfileImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      showMessage({
        message: 'Update Successful',
        description: 'Your image has been updated!',
        type: 'success',
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      showMessage({
        message: 'Upload Failed',
        description: 'Failed to upload image.',
        type: 'danger',
      });
    }
  };

  const handleChoosePhoto = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        setImageUri(image.path);
        uploadImage(image);
        dispatch(saveProfileImage(image.path));
        console.log('Image Object', image);
        setModal(false);
      })
      .catch(error => {});
  };

  const handleTakePhoto = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        setImageUri(image.path);

        uploadImage(image);
        dispatch(saveProfileImage(image.path));
        console.log('Image Object', image);
        setModal(false);
      })
      .catch(error => {});
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // ✅ iOS (NO ARGUMENTS)
      Geolocation.requestAuthorization();
      return true;
    } catch (e) {
      console.log('Permission error:', e);
      return false;
    }
  };

  const getTrainerLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          console.log('IOS Location:', latitude, longitude);

          await axiosBaseURL.post('/trainer/updateLocation', {
            email: logedInTrainer.email,
            lat: latitude,
            lng: longitude,
          });
        },
        error => {
          console.log('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (e) {
      console.log('Location error:', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!logedInTrainer) return;

      getTrainerLocation();
    }, [logedInTrainer]),
  );

  const fetchBundles = async () => {
    const res = await axiosBaseURL.get('/trainer/bundle/list');
    setBundles(res.data.data);
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const createBundle = async () => {
    try {
      const res = await axiosBaseURL.post('/trainer/bundle/create', {
        name: bundleName,
        description: bundleDesc,
        price: Number(bundlePrice),
        items: bundleItems,
      });

      console.log('Response:', res);

      setBundles([...bundles, res.data.data]);

      setBundleModal(false);
      setBundleName('');
      setBundleDesc('');
      setBundlePrice('');
      setBundleItems([]);
    } catch (e) {
      console.log('sdsdsdsd', e);
      showMessage({message: 'Error creating bundle', type: 'danger'});
    }
  };

  const calculateAge = dateString => {
    const [day, month, year] = dateString.split('/');
    const birth = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const SelectionModal = ({visible, onClose, data, onSelect}) => (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}>
                  <Text style={{color: '#fff'}}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <WrapperContainer>
      <ScrollView>
        <View style={styles.Main}>
          <View style={styles.Header}>
            <Text style={styles.H1}>Complete Your Profile</Text>
          </View>
          <Text style={styles.subHeading}>Profile picture</Text>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveWidth(7),
              marginTop: responsiveHeight(1),
            }}>
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
                  : require('../../assets/Images/PlaceholderImage.png')
              }
              style={{
                height: responsiveHeight(10),
                width: responsiveWidth(20),
                borderRadius: responsiveWidth(10),
              }}
            />
            <TouchableOpacity
              onPress={openModal}
              style={{flex: 1, justifyContent: 'space-around'}}>
              <Text style={styles.UploadText}>Upload your photo</Text>
              <Text style={styles.UploadText2}>
                Upload a high-quality image
              </Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="slide"
              visible={isModal}
              onRequestClose={closeModal}>
              <TouchableWithoutFeedback onPress={closeModal}>
                <View
                  style={[styles.subModalContainer, {position: 'relative'}]}>
                  <View
                    style={{position: 'absolute', bottom: responsiveHeight(0)}}>
                    <View style={styles.subModalContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'baseline',
                        }}>
                        <Text style={styles.modalText}>Select Option</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            handleTakePhoto();
                          }}
                          style={styles.closeButton}>
                          <Text style={styles.closeButtonText}>
                            Open Camera
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            handleChoosePhoto();
                          }}
                          style={styles.closeButton}>
                          <Text style={styles.closeButtonText}>
                            Open Gallery
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
          <View style={styles.FirstNameContainer}>
            <View style={styles.FirstNameH}>
              <Text style={{color: '#908C8D'}}>First Name</Text>
              <TextInput
                value={logedInTrainer?.fullName}
                onChangeText={setfirstname}
                placeholder="Enter First Name"
                style={styles.FirstNameInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View style={styles.EmailContainer}>
              <Text style={{color: '#908C8D'}}>Email</Text>
              <TextInput
                editable={false}
                placeholder="Enter Email"
                value={logedInTrainer.email}
                onChangeText={setEmail}
                style={styles.EmailInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  color: Bioformik ? 'red' : 'white',
                  marginBottom: responsiveHeight(1),
                }}>
                Bio
              </Text>
              <View
                style={[
                  {...styles.BioCont},
                  {
                    borderColor: Bioformik ? 'red' : '#908C8D',
                  },
                ]}>
                <TextInput
                  placeholder="A brief introduction about yourself and your training philosophy"
                  onChangeText={setBio}
                  value={Bio}
                  style={[
                    {...styles.BioInput},
                    {height: Bio.length == 0 ? responsiveHeight(7) : 'auto'},
                  ]}
                  multiline
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>

            {/* ===== CERTIFICATE UPLOAD ===== */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#908C8D',
                borderRadius: 18,
                padding: responsiveHeight(3),
                marginTop: responsiveHeight(3),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleCertificatePick}>
              <Text style={{color: '#fff', marginBottom: 10}}>
                Verify Certification
              </Text>

              {certificatePreview ? (
                <Image
                  source={{uri: certificatePreview}}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff', fontSize: 30}}>＋</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.EmailContainer,
              {position: 'relative', marginTop: responsiveHeight(4)},
            ]}>
            <TouchableOpacity
              onPress={() => setDropdownVisible(!dropdownVisible)}
              style={[
                styles.inputContainer,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: responsiveHeight(1.4),
                },
              ]}>
              <Text style={{color: '#fff', fontSize: responsiveFontSize(2.2)}}>
                Select Specialities
              </Text>
              <View>
                <Image source={Images.dropdown} />
              </View>
            </TouchableOpacity>

            {dropdownVisible && (
              <FlatList
                initialNumToRender={6}
                removeClippedSubviews
                data={Specialities}
                keyExtractor={item => item.key.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSpecialitySelect(item)}
                    style={styles.dropdownItem}>
                    <Text style={styles.dropdownText}>{item.value}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
              />
            )}
          </View>
          <View style={{marginTop: responsiveHeight(1.5)}}>
            <FlatList
              initialNumToRender={6}
              removeClippedSubviews
              data={selectedSpecialities}
              renderItem={({item}) => (
                <View
                  key={item.key}
                  style={[
                    {...styles.MainFlatlist},
                    {
                      backgroundColor: Speciality.includes(item.value)
                        ? '#9FED3A'
                        : '#181818',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text
                    style={{
                      color: Speciality.includes(item.value)
                        ? 'black'
                        : '#9FED3A',
                      fontSize: responsiveFontSize(2),
                    }}>
                    {item.value}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveSpeciality(item)}>
                    <Image
                      source={Images.Cross}
                      style={{
                        tintColor: '#9FED3A',
                        marginLeft: responsiveWidth(4),
                        height: responsiveHeight(1.5),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </View>
          <Text
            style={[
              {...styles.HourlyText1},
              {
                color: Hourlyformik ? 'red' : 'white',
                paddingTop: responsiveHeight(1),
              },
            ]}>
            Hourly Rate
          </Text>
          <View style={styles.HourlyContainer}>
            <View style={styles.RateContainer}>
              <Text style={styles.Dollar}>$</Text>
              <TextInput
                keyboardType="numeric"
                style={{
                  paddingVertical: 0,
                  color: 'white',
                  width: responsiveWidth(20),
                }}
                value={Hourly}
                onChangeText={setHourly}
              />
            </View>
            <Text style={styles.HourlyText}>/hr</Text>
          </View>
          <TouchableOpacity
            onPress={toggleModalTimes}
            style={[
              {...styles.EmailContainer},
              {flexDirection: 'column', marginTop: responsiveHeight(4)},
            ]}>
            <Text style={{color: '#908C8D'}}>Set Availabilities</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: responsiveHeight(0.7),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#fff',
                  fontSize: responsiveFontSize(1.5),
                }}>
                {selectedTimes.length > 0
                  ? selectedTimes.map((item, index) => (
                      <React.Fragment key={index}>
                        <Text>{item}</Text>
                        {index < selectedTimes.length - 1 ? (
                          <Text>, </Text>
                        ) : null}
                      </React.Fragment>
                    ))
                  : 'No Availabilities'}
              </Text>
              <View>
                <Image source={Images.calendar} />
              </View>
            </View>
          </TouchableOpacity>
          {modalVisible && (
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.overlay}>
                <View style={styles.timeSheet}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner" // ⭐ important for iOS
                    onChange={(event, selectedTime) => {
                      if (selectedTime) setTime(selectedTime);
                    }}
                  />

                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={() => {
                      const formatted = moment(time).format('hh:mm A');

                      setSelectedTimes(prev =>
                        prev.includes(formatted) ? prev : [...prev, formatted],
                      );

                      setModalVisible(false);
                    }}>
                    <Text style={styles.okText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {showBasicFields && (
            <>
              {/* ===== WEIGHT + HEIGHT ROW ===== */}
              <View
                style={{
                  flexDirection: 'row',
                  width: responsiveWidth(85),
                  justifyContent: 'space-between',
                  marginTop: responsiveHeight(3),
                }}>
                {/* Weight */}
                <View
                  style={{
                    width: responsiveWidth(40),
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveWidth(2),
                    borderColor: focused === 'weight' ? '#9FED3A' : '#908C8D',
                  }}>
                  <Text style={{color: '#908C8D'}}>Weight in lbs</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weight}
                    onFocus={() => setFocused('weight')}
                    onBlur={() => setFocused(null)}
                    onChangeText={setweight}
                    placeholder="Your Weight"
                    placeholderTextColor="#908C8D"
                    style={{color: 'white'}}
                  />
                </View>

                {/* Height */}
                <View
                  style={{
                    width: responsiveWidth(40),
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveWidth(2),
                    borderColor: focused === 'height' ? '#9FED3A' : '#908C8D',
                  }}>
                  <Text style={{color: '#908C8D'}}>Height in ft</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={height}
                    onFocus={() => setFocused('height')}
                    onBlur={() => setFocused(null)}
                    onChangeText={setheight}
                    placeholder="Your Height"
                    placeholderTextColor="#908C8D"
                    style={{color: 'white'}}
                  />
                </View>
              </View>

              {/* {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);

                    if (selectedDate) {
                      const d = selectedDate;
                      const formatted = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

                      setDob(formatted);
                    }
                  }}
                />
              )} */}

              {/* ===== FITNESS ===== */}
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setFitnessModal(true)}>
                <Text style={{color: '#908C8D'}}>Fitness Preference</Text>
                <Text style={{color: '#fff'}}>
                  {fitnessPreference || 'Select Preference'}
                </Text>
              </TouchableOpacity>

              {/* ===== GOAL ===== */}
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setGoalModal(true)}>
                <Text style={{color: '#908C8D'}}>Goal</Text>
                <Text style={{color: '#fff'}}>{goal || 'Select Goal'}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* AGE FIELD */}
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowDatePicker(true)}>
            <Text style={{color: '#908C8D'}}>Age</Text>

            <Text style={{color: '#fff'}}>{dob || 'Select Date of Birth'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createBundleBtn}
            onPress={() => setBundleModal(true)}>
            <Text style={styles.createBundleText}>+ Create New Package</Text>
          </TouchableOpacity>
          {bundles.map((b, index) => (
            <View key={index} style={styles.bundleCard}>
              <Text style={styles.bundleTitle}>{b.name}</Text>
              <Text style={styles.bundleDesc}>{b.description}</Text>
              <Text style={styles.bundlePrice}>${b.price}</Text>
            </View>
          ))}
          <Modal
            visible={bundleModal}
            animationType="fade"
            transparent
            statusBarTranslucent
            onRequestClose={() => setBundleModal(false)}>
            {/* OVERLAY */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.bundleOverlay}
              onPress={() => setBundleModal(false)}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{width: '100%'}}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.bundleSheet}>
                  {/* BOTTOM SHEET */}
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bundleSheet}>
                    <Text style={styles.bundleHeader}>Create Package</Text>

                    <TextInput
                      placeholder="Package Name"
                      placeholderTextColor="#888"
                      value={bundleName}
                      onChangeText={setBundleName}
                      style={styles.bundleInput}
                    />

                    <TextInput
                      placeholder="Description"
                      placeholderTextColor="#888"
                      multiline
                      value={bundleDesc}
                      onChangeText={setBundleDesc}
                      style={[styles.bundleInput, {height: 90}]}
                    />

                    <TextInput
                      placeholder="Price ($)"
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                      value={bundlePrice}
                      onChangeText={setBundlePrice}
                      style={styles.bundleInput}
                    />

                    {/* ADD ITEM */}
                    <View style={{flexDirection: 'row', gap: 10}}>
                      <TextInput
                        placeholder="Add item"
                        placeholderTextColor="#888"
                        value={newItem}
                        onChangeText={setNewItem}
                        style={[styles.bundleInput, {flex: 1}]}
                      />

                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          if (newItem) {
                            setBundleItems([...bundleItems, newItem]);
                            setNewItem('');
                          }
                        }}>
                        <Text style={{color: '#000'}}>Add</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.createBtn}
                      onPress={createBundle}>
                      <Text style={{color: '#000', fontWeight: '700'}}>
                        Create Package
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>
          <ButtonComp
            mainStyle={{
              marginTop: responsiveHeight(5),
              marginBottom: responsiveHeight(5),
            }}
            text="Save"
            onPress={() => {
              // Chane();
              Function();
              // navigation.navigate('Membership');
            }}
          />
        </View>
        <SelectionModal
          visible={fitnessModal}
          onClose={() => setFitnessModal(false)}
          data={fitnessOptions}
          onSelect={setFitnessPreference}
        />

        <SelectionModal
          visible={goalModal}
          onClose={() => setGoalModal(false)}
          data={goalOptions}
          onSelect={setGoal}
        />

        {/* GLOBAL AGE PICKER MODAL */}
        <Modal
          transparent
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.overlay}>
            <View style={styles.ageSheet}>
              <DateTimePicker
                value={dob ? moment(dob, 'DD/MM/YYYY').toDate() : new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTime(selectedDate); // temp store
                  }
                }}
              />

              <TouchableOpacity
                style={styles.okBtn}
                onPress={() => {
                  const formatted = moment(time).format('DD/MM/YYYY');
                  setDob(formatted);
                  setShowDatePicker(false);
                }}>
                <Text
                  style={[
                    styles.okText,
                    {width: responsiveWidth(80), textAlign: 'center'},
                  ]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <Modal
          transparent
          animationType="fade"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}>
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={styles.overlay}>
              <View style={{backgroundColor: '#9FED3A', borderRadius: 12}}>
                <DateTimePicker
                  value={dob ? moment(dob, 'DD/MM/YYYY').toDate() : new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                      const formatted =
                        moment(selectedDate).format('DD/MM/YYYY');
                      setDob(formatted);
                    }
                    setShowDatePicker(false);
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  timeSheet: {
    backgroundColor: '#9FED3A',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },

  ageSheet: {
    backgroundColor: '#9FED3A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },

  okBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },

  okText: {
    color: '#9FED3A',
    fontWeight: '700',
    fontSize: 16,
  },

  MainFlatlist2: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
  MainFlatlist: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
  SpecialityMain: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  BioInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(1.5),
  },
  BioCont: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderRadius: 10,
    height: responsiveHeight(20),
  },
  HourlyText1: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
  },
  Avail: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  HourlyText: {color: 'white', fontFamily: FontFamily.Semi_Bold},
  Dollar: {color: 'white', fontFamily: FontFamily.Semi_Bold},
  RateContainer: {
    paddingHorizontal: responsiveWidth(2),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    height: responsiveHeight(5),
    width: responsiveWidth(30),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HourlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  Main: {
    width: responsiveScreenWidth(90),
    alignSelf: 'center',
  },
  Header: {justifyContent: 'space-between', flexDirection: 'row'},
  H1: {color: 'white', fontSize: responsiveFontSize(2.4)},
  greyH: {color: 'grey', fontSize: responsiveFontSize(2)},
  subHeading: {color: 'white', marginTop: responsiveHeight(3)},
  ProfileContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(7),
    marginTop: responsiveHeight(1),
  },
  ProfileText: {flex: 1, justifyContent: 'space-around'},
  UploadText: {
    color: '#9FED3A',
    fontSize: responsiveScreenFontSize(2),
  },
  UploadText2: {fontSize: responsiveScreenFontSize(2), color: 'white'},
  FirstNameContainer: {
    gap: responsiveHeight(2.5),
    marginTop: responsiveHeight(2),
  },
  FirstNameH: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  FirstNameInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  },
  LastNameContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  LastNameInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  },
  EmailContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  EmailInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: responsiveWidth(80),
    height: responsiveHeight(30),
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: responsiveWidth(1),
  },
  closeButtonText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveHeight(2),
  },
  dropdownItem: {
    padding: responsiveWidth(2),
    borderBottomWidth: responsiveWidth(0.3),
    borderBottomColor: 'grey',
  },
  dropdownText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subModalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(16),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },
  subModalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  inputBox: {
    width: responsiveWidth(85),
    padding: 15,
    borderWidth: 1,
    borderColor: '#908C8D',
    borderRadius: 17,
    marginTop: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalBox: {
    backgroundColor: '#111',
    maxHeight: '60%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  modalItem: {
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  bundleCard: {
    backgroundColor: '#9FED3A',
    padding: 14,
    borderRadius: 15,
    marginVertical: 10,
  },

  bundleTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  bundleDesc: {
    color: '#000',
    marginVertical: 4,
  },

  bundlePrice: {
    color: '#000',
    fontWeight: '700',
  },
  bundleOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },

  bundleSheet: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: '55%',
  },

  bundleHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  bundleInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  addBtn: {
    backgroundColor: '#9FED3A',
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 12,
  },

  createBtn: {
    backgroundColor: '#9FED3A',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  createBundleBtn: {
    backgroundColor: '#9FED3A',
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.8),

    borderRadius: 40, // pill shape
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 6, // Android shadow
    shadowColor: '#9FED3A', // iOS glow
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  createBundleText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
