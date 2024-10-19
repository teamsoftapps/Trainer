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
const CompleteProfile = ({route}) => {
  // Data States
  const [firstname, setfirstname] = useState('');
  const [secondname, setsecondname] = useState('');
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState('00');
  const [Speciality, setSpeciality] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const navigation = useNavigation();

  // Formik States
  const [specialityformik, setspecialityformik] = useState(false);
  const [Bioformik, setBioformik] = useState(false);
  const [Hourlyformik, setHourlyformik] = useState(false);
  const [timeformik, settimeformik] = useState(false);

  // Formik Conditions

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
  const [time, setTime] = useState(new Date());
  const logedInTrainerEmail = useSelector(state => state.Auth.data);
  console.log('Logged In Data', logedInTrainerEmail);
  const dispatch = useDispatch();

  const condition1 = Hourly !== '0' && Hourly !== '';
  const condition2 = selectedTimes.length !== 0;
  const condition3 = Bio != '';
  const condition4 = selectedSpecialities.length !== 0;

  console.log(
    'trainer data in complete profile: ',
    logedInTrainerEmail?.res_EMAIL
  );

  const handleSpecialitySelect = selectedSpecialities => {
    setDropdownVisible(false);
    setSelectedSpecialities(prev => {
      if (prev.some(item => item.key === selectedSpecialities.key)) {
        return prev.filter(item => item.key !== selectedSpecialities.key);
      } else {
        return [...prev, selectedSpecialities];
      }
    });
  };

  const toggleModalTimes = () => {
    setModalVisible(true);
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || time;

      if (currentTime instanceof Date && !isNaN(currentTime.getTime())) {
        const formattedTime = moment(currentTime).format('HH:mm A');
        setSelectedTimes(prevTimes => [...prevTimes, formattedTime]);
        setTime(currentTime);
        setModalVisible(false);
      } else {
      }
    } else if (event.type === 'dismissed') {
      setModalVisible(false);
    }
  };

  const Chane = () => {
    let payload = {
      Bio: Bio,
      Speciality: selectedSpecialities,
      Hourlyrate: Hourly,
      Availiblity: selectedTimes,
    };
    dispatch(updateLogin(payload));
  };

  const Function = async () => {
    if (condition1 && condition2 && condition3 && condition4) {
      setspecialityformik(false);
      setBioformik(false);
      settimeformik(false);
      setHourlyformik(false);
      try {
        const response = await axiosBaseURL.post('/trainer/update', {
          email: logedInTrainerEmail?.email,
          Bio: Bio,
          Speciality: selectedSpecialities,
          Hourlyrate: Hourly,
          Availiblity: selectedTimes,
        });

        let payload = {
          Bio: Bio,
          Speciality: selectedSpecialities,
          Hourlyrate: Hourly,
          Availiblity: selectedTimes,
        };
        dispatch(updateLogin(payload));

        console.log('responce in complete profile:', response.data);
        showMessage({
          message: 'Updates Succesfully',
          description: 'your data has been updated!',
          type: 'success',
        });
        navigation.replace('TrainerBttomStack');

        console.log('Upload successful:', response.data);
      } catch (error) {
        setUploadError('Upload failed.');
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    } else {
      if (!condition4) setspecialityformik(true);
      if (!condition3) setBioformik(true);
      if (!condition2) settimeformik(true);
      if (!condition1) setHourlyformik(true);
    }
  };

  const handlePress = item => {
    setSelectedTime(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
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

  const uploadImage = async image => {
    try {
      const formData = new FormData();

      formData.append('profileImage', {
        uri: image.path,
        type: image.mime,
        name: `profileImage-${Date.now()}.jpg`,
      });
      formData.append('email', logedInTrainerEmail.email);

      const response = await axiosBaseURL.post(
        '/trainer/uploadProfileImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
  const Specialsity = [
    {key: 1, value: 'Strength Training'},
    {key: 2, value: 'Yoga'},
    {key: 3, value: 'Cardio Fitness'},
    {key: 4, value: 'Weight Loss Coaching'},
    {key: 5, value: 'Bodybuilding'},
    {key: 6, value: 'Crossfit'},
  ];

  return (
    <WrapperContainer>
      <ScrollView>
        <View style={styles.Main}>
          <View style={styles.Header}>
            <Text style={styles.H1}>Complete Your Profile</Text>
            <Text style={styles.greyH}>Skip</Text>
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
                value={firstname}
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
                value={logedInTrainerEmail.email}
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
                  <TouchableOpacity>
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
              {color: Hourlyformik ? 'red' : 'white'},
            ]}>
            Hourly Rate
          </Text>
          <View style={styles.HourlyContainer}>
            <View style={styles.RateContainer}>
              <Text style={styles.Dollar}>$</Text>
              <TextInput
                keyboardType="numeric"
                style={{paddingVertical: 0, color: 'white'}}
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
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.overlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                      <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
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
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
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
    width: responsiveWidth(14),
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
});
