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
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {Specialities, TimeSlots} from '../../utils/Dummy';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../Components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {updateLogin} from '../../store/Slices/AuthSlice';
import {format} from 'date-fns';

const EditProfile = ({route}) => {
  //UseSelectors
  const logedInTrainer = useSelector(state => state.Auth.data);
  console.log('loged in trainer data in edit profile screen :', logedInTrainer);

  // Data States
  const [firstname, setfirstname] = useState('');
  const [secondname, setsecondname] = useState('');
  const [Speciality, setSpeciality] = useState([]);
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState();
  const [selectedTime, setSelectedTime] = useState([]);
  const [Address, setAddress] = useState('');
  const [AddressModal, setAddressModal] = useState(false);
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  // Formik States
  const [specialityformik, setspecialityformik] = useState(false);
  const [Bioformik, setBioformik] = useState(false);
  const [Hourlyformik, setHourlyformik] = useState(false);
  const [timeformik, settimeformik] = useState(false);

  // Formik Conditions

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [formData, setFormData] = useState(logedInTrainer);

  const Spec = useSelector(state => state?.Auth?.data?.Availiblity);

  const condition1 = Hourly !== '0' && Hourly !== '';
  const condition2 = selectedTimes.length !== 0;
  const condition3 = Bio != '';
  const condition4 = selectedSpecialities.length !== 0;
  const condition5 = firstname !== '';
  const condition6 = Email !== '';
  const condition7 = gender !== '';
  const condition8 = dob !== '';
  const condition9 = Address !== '';

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const concat = () => {
    const fullname = firstname + ' ' + secondname;
    console.log('nameeee', fullname);
  };
  const handleSpecialitySelect = speciality => {
    setDropdownVisible(false);
    setSelectedSpecialities(prev => {
      if (prev.some(item => item.key === speciality.key)) {
        return prev.filter(item => item.key !== speciality.key);
      } else {
        return [...prev, speciality];
      }
    });
  };

  const handleRemoveSpeciality = speciality => {
    setSelectedSpecialities(prev =>
      prev.filter(item => item.key !== speciality.key),
    );
  };
  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || time;

      if (currentTime instanceof Date && !isNaN(currentTime)) {
        const formattedTime = moment(currentTime).format('hh:mm A');

        setSelectedTimes(prevTimes => {
          if (!prevTimes.includes(formattedTime)) {
            return [...prevTimes, formattedTime];
          } else {
            showMessage({
              message: 'Duplication',
              description: 'Already added!.',
              type: 'danger',
            });
          }
          return prevTimes;
        });
        setTime(currentTime);
        setModalVisible(false);
      }
    } else if (event.type === 'dismissed') {
      setModalVisible(false);
    }
  };

  const removeTime = timeToRemove => {
    setSelectedTimes(prevTimes =>
      prevTimes.filter(time => time !== timeToRemove),
    );
  };

  const onDateChange = (event, selectedValue) => {
    if (event.type === 'set') {
      const currentDate = selectedValue || date;

      // Get today's date
      const today = new Date();

      // Calculate age
      const age = today.getFullYear() - currentDate.getFullYear();
      const monthDifference = today.getMonth() - currentDate.getMonth();

      // Adjust age if the birth date hasn't occurred yet this year
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < currentDate.getDate())
      ) {
        age--;
      }

      // Check if the age is less than 24
      if (age < 24) {
        showMessage({
          message: 'Error',
          description: 'Age must be 24 years old.',
          type: 'danger',
        });
      } else {
        const formattedDate = `${String(currentDate.getDate()).padStart(
          2,
          '0',
        )}/${String(currentDate.getMonth() + 1).padStart(
          2,
          '0',
        )}/${currentDate.getFullYear()}`;
        setDob(formattedDate);
        console.log(formattedDate);
      }
    }

    setModalVisible2(false);
  };

  const toggleModalTimes = () => {
    setModalVisible(true);
  };

  const toggleModalDob = () => {
    setModalVisible2(true);
  };

  const Function = async () => {
    if (!firstname || firstname.length <= 3) {
      return showMessage({
        message: 'Validation Error',
        description: 'Name must be greater than 3 letters.',
        type: 'danger',
      });
    }

    if (!Bio.trim()) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please edit your bio.',
        type: 'danger',
      });
    }

    if (!gender.trim() || (gender !== 'Male' && gender !== 'Female')) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please select a valid gender (Male or Female).',
        type: 'danger',
      });
    }

    if (!dob) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please enter your date of birth.',
        type: 'danger',
      });
    }

    if (!Array.isArray(selectedTimes) || selectedTimes.length === 0) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please select your availability times.',
        type: 'danger',
      });
    }

    if (Hourly <= 0) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please enter a valid hourly rate.',
        type: 'danger',
      });
    }

    if (
      !Array.isArray(selectedSpecialities) ||
      selectedSpecialities.length === 0
    ) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please select at least one speciality.',
        type: 'danger',
      });
    }

    if (!Address.trim()) {
      return showMessage({
        message: 'Validation Error',
        description: 'Please edit your address.',
        type: 'danger',
      });
    }

    // Create the updateData object based on valid fields
    const updateData = {};
    if (logedInTrainer?.email) updateData.email = logedInTrainer.email;
    if (firstname) updateData.fullName = firstname;
    if (Bio.trim()) updateData.Bio = Bio;
    if (gender.trim()) updateData.gender = gender;
    if (dob) updateData.Dob = dob;
    if (Array.isArray(selectedTimes) && selectedTimes.length > 0) {
      updateData.Availiblity = selectedTimes;
    }
    if (Hourly > 0) updateData.Hourlyrate = Hourly;
    if (
      Array.isArray(selectedSpecialities) &&
      selectedSpecialities.length > 0
    ) {
      updateData.Speciality = selectedSpecialities;
    }
    if (Address.trim()) updateData.Address = Address;

    if (Object.keys(updateData).length === 0) {
      return showMessage({
        message: 'No Updates',
        description: 'No fields to update.',
        type: 'warning',
      });
    }

    try {
      const response = await axiosBaseURL.post('/trainer/update', updateData);
      dispatch(updateLogin({...logedInTrainer, ...updateData}));

      showMessage({
        message: 'Update Successful',
        description: 'Your data has been updated!',
        type: 'success',
      });

      navigation.navigate('Profile');
    } catch (error) {
      setUploadError('Upload failed.');
      console.error('Error uploading data:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
          rightView={
            <Image
              source={Images.logo}
              style={{height: responsiveHeight(5), width: responsiveWidth(10)}}
            />
          }
        />
        <View style={styles.Main}>
          <Text style={styles.subHeading}>Edit Profile</Text>
          <View style={styles.FirstNameContainer}>
            <View style={styles.FirstNameH}>
              <Text style={{color: '#908C8D'}}>Full Name</Text>
              <TextInput
                editable={true}
                value={firstname}
                onChangeText={setfirstname}
                placeholder={' Enter your full name'}
                style={styles.FirstNameInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  color: Bioformik ? 'red' : 'white',
                  marginBottom: responsiveHeight(1),
                  fontSize: responsiveFontSize(2.5),
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
                  editable={true}
                  placeholder={
                    'A brief introduction about yourself and your training philosophy'
                  }
                  onChangeText={text => setBio(text)}
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
            <View style={styles.EmailContainer}>
              <Text style={{color: '#908C8D'}}>Gender</Text>
              <TextInput
                placeholder={'Enter gender'}
                value={gender}
                onChangeText={text => {
                  setGender(text);
                }}
                style={styles.EmailInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View style={styles.EmailContainer}>
              <Text style={{color: '#908C8D'}}>Date of birth</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {/* <TextInput
                  value={date}
                  placeholder={'Enter DOB'}
                  style={styles.EmailInput}
                  numberOfLines={1}
                  placeholderTextColor={'white'}
                /> */}
                <Text style={{color: '#fff'}}>{dob ? dob : 'Enter dob'}</Text>

                <TouchableOpacity onPress={toggleModalDob}>
                  <Image source={Images.calendar} />
                </TouchableOpacity>
              </View>
            </View>
            {modalVisible && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setModalVisible(false)}>
                  <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                      <View>
                        <DateTimePicker
                          value={time}
                          mode="time"
                          display="default"
                          onChange={onTimeChange}
                          is24Hour={false}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            {modalVisible2 && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => setModalVisible2(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setModalVisible2(false)}>
                  <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                      <View>
                        <DateTimePicker
                          value={date}
                          mode="date"
                          display="default"
                          onChange={onDateChange}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            <TouchableOpacity
              onPress={toggleModalTimes}
              style={[{...styles.EmailContainer}, {flexDirection: 'column'}]}>
              <Text style={{color: '#908C8D'}}>Set Availabilities</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: responsiveHeight(0.7),
                }}>
                <View style={{width: responsiveWidth(70)}}>
                  {selectedTimes.length > 0 ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#fff',
                        fontSize: responsiveFontSize(1.5),
                      }}>
                      {selectedTimes.join(' , ')}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: responsiveFontSize(1.5),
                      }}>
                      Add Availabilities
                    </Text>
                  )}
                </View>

                <View>
                  <Image source={Images.calendar} />
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <FlatList
                data={selectedTimes}
                renderItem={({item}) => (
                  <View
                    key={item}
                    style={[
                      {...styles.MainFlatlist},
                      {
                        backgroundColor: selectedTime.includes(item)
                          ? '#9FED3A'
                          : '#181818',
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text
                      style={{
                        color: selectedTime.includes(item)
                          ? 'black'
                          : '#9FED3A',
                        fontSize: responsiveFontSize(2),
                      }}>
                      {item}
                    </Text>
                    <TouchableOpacity onPress={() => removeTime(item)}>
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
            <View style={[styles.EmailContainer]}>
              <Text style={{color: '#908C8D'}}>Hourly Rate</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: responsiveFontSize(2)}}>
                  $
                </Text>
                <TextInput
                  editable={true}
                  placeholder={'00'}
                  value={Hourly}
                  onChangeText={text => {
                    setHourly(text);
                  }}
                  style={styles.EmailInput}
                  numberOfLines={1}
                  placeholderTextColor={'white'}
                />
              </View>
            </View>
            <View style={[styles.EmailContainer, {position: 'relative'}]}>
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
                <Text
                  style={{color: '#fff', fontSize: responsiveFontSize(2.2)}}>
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
          </View>
          <View style={{marginVertical: responsiveHeight(1.5)}}>
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
          <Text style={{fontSize: responsiveFontSize(2.5), color: '#fff'}}>
            Location
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextInput
              onChangeText={text => {
                setAddress(text);
              }}
              value={Address}
              placeholder="Enter your address"
              style={{
                color: '#fff',
                width: responsiveWidth(70),
              }}
              placeholderTextColor={'#fff'}
            />
            {/* <TouchableOpacity
              onPress={() => {
                setAddressModal(true);
              }}>
              <Image
                source={Images.edit}
                style={{
                  height: responsiveHeight(2),
                  width: responsiveWidth(4),
                }}
              />
            </TouchableOpacity> */}
          </View>
          {/* <EditAddressModal
            token={logedInTrainer.token}
            Address={Address}
            modalstate={AddressModal}
            onRequestClose={() => setAddressModal(false)}
          /> */}
        </View>
      </ScrollView>
      <ButtonComp
        onPress={() => {
          Function();
          // concat();
        }}
        text="Save"
        mainStyle={{
          marginVertical: responsiveHeight(3),
          width: responsiveWidth(90),
          alignSelf: 'center',
        }}
      />
    </WrapperContainer>
  );
};

export default EditProfile;

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
    marginTop: responsiveHeight(2),
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
  subHeading: {color: 'white', fontSize: responsiveFontSize(3)},
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
    borderWidth: 0.4,
    borderColor: '#908C8D',
    borderRadius: responsiveWidth(2),
  },
  EmailInput: {
    padding: responsiveWidth(0),
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
    padding: responsiveWidth(4),
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
  selectedTimes: {
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    zIndex: 1000,
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
});
