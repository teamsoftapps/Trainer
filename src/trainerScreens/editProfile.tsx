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
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import ButtonComp from '../Components/ButtonComp';
import {Specialities, TimeSlots} from '../utils/Dummy';
import axiosBaseURL from '../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import Header from '../Components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TouchableWithoutFeedback} from 'react-native';
import EditAddressModal from '../Components/EditAddressModal';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const EditProfile = ({route}) => {
  //UseSelectors
  const logedInTrainer = useSelector(state => state.Auth.data.data);
  console.log('loded in trainer data:', logedInTrainer);

  //Spliting fullName in to first and lst name.
  const setFullName = logedInTrainer?.fullName?.split(' ');
  const firstName = setFullName[0] || [];
  const lastName = setFullName[1] || [];

  // Data States
  const [firstname, setfirstname] = useState('');
  const [secondname, setsecondname] = useState('');
  const [Speciality, setSpeciality] = useState([]);
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);
  const [Address, setAddress] = useState('');
  const [AddressModal, setAddressModal] = useState(false);

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

  const condition1 = Hourly !== '0' && Hourly !== '';
  const condition2 = selectedTimes.length !== 0;
  const condition3 = Bio != '';
  const condition4 = selectedSpecialities.length !== 0;
  const navigation = useNavigation();

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

  const toggleModalTimes = () => {
    setModalVisible(true);
  };

  const toggleModalDob = () => {
    setModalVisible2(true);
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || time;

      // Ensure currentTime is a valid Date object
      if (currentTime instanceof Date && !isNaN(currentTime)) {
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

  const onDateChange = selectedValue => {
    if (selectedValue instanceof Date && !isNaN(selectedValue)) {
      setDate(selectedValue);
    }
    setModalVisible2(false);
  };

  const Function = async () => {
    if (condition1 && condition2 && condition3 && condition4) {
      setspecialityformik(false);
      setBioformik(false);
      settimeformik(false);
      setHourlyformik(false);
      try {
        const response = await axiosBaseURL.post('/trainer/update', {
          email: logedInTrainer.email,
          Bio: Bio,
          Hourlyrate: Hourly,
          Availiblity: selectedTimes,
          Speciality: selectedSpecialities,
        });
        showMessage({
          message: 'Updates Succesfully',
          description: 'your data has been updated!',
          type: 'success',
        });
        navigation.navigate('Profile');
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

  return (
    <WrapperContainer>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.Main}>
          <Text style={styles.subHeading}>Edit picture</Text>
          <View style={styles.FirstNameContainer}>
            <View style={styles.FirstNameH}>
              <Text style={{color: '#908C8D'}}>First Name</Text>
              <TextInput
                editable={false}
                value={firstName}
                onChangeText={setfirstname}
                placeholder="Enter First Name"
                style={styles.FirstNameInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View style={styles.LastNameContainer}>
              <Text style={{color: '#908C8D'}}>Last Name</Text>
              <TextInput
                editable={false}
                placeholder="Enter Last Name"
                value={lastName}
                onChangeText={setsecondname}
                style={styles.LastNameInput}
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
            <View style={styles.EmailContainer}>
              <Text style={{color: '#908C8D'}}>Gender</Text>
              <Text style={{color: '#fff', fontSize: responsiveFontSize(2.2)}}>
                {logedInTrainer.gender}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleModalDob}
              style={styles.EmailContainer}>
              <Text style={{color: '#908C8D'}}>Date of Birth</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: '#fff', fontSize: responsiveFontSize(2.2)}}>
                  10/10/2003
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
                  placeholder="00"
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
            <Text></Text>
          </View>
          <View>
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
              value={logedInTrainer.Address}
              placeholder="Enter your address"
              style={{
                color: '#fff',
                width: responsiveWidth(70),
              }}
              placeholderTextColor={'#fff'}
            />
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
          <EditAddressModal
            token={logedInTrainer.token}
            Address={Address}
            modalstate={AddressModal}
            onRequestClose={() => setAddressModal(false)}
          />
        </View>
      </ScrollView>
      <ButtonComp
        onPress={() => {
          Function();
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
