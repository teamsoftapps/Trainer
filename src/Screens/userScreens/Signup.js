import {Dropdown} from 'react-native-element-dropdown';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../../Components/ButtonComp.js';
import {FontFamily, Images} from '../../utils/Images.js';
import WrapperContainer from '../../Components/Wrapper.js';
import FlashMessage from 'react-native-flash-message';
import {showMessage} from 'react-native-flash-message';
import {useSignUpUserMutation} from '../../store/Apis/userAuth.js';
import {useSignUpTrainerMutation} from '../../store/Apis/trainerAuth.js';
import useToast from '../../Hooks/Toast.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {baseUrl} from '../../services/Urls.js';
import {useDispatch} from 'react-redux';
import {IsLogin} from '../../store/Slices/AuthSlice.js';
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
const Signup = ({route, navigation}) => {
  const user = route.params;
  console.log('Routes', user);
  const dispatch = useDispatch();
  const {showToast} = useToast();
  const [SignUpUser, {isLoading: SignupUserLoading}] = useSignUpUserMutation();
  const [SignUpTrainer, {isLoading: SignupTrainerLoading}] =
    useSignUpTrainerMutation();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [DoB, setDoB] = useState('');
  const [weight, setweight] = useState('');
  const [height, setheight] = useState('');
  const [address, setAddress] = useState('');
  const [Gender, setGender] = useState('');
  const [modalVisible2, setModalVisible2] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dob, setDob] = useState('');

  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('1');
  const [country, setCountry] = useState('US');
  const [showPicker, setShowPicker] = useState(false);

  const [fitnessPreference, setFitnessPreference] = useState('');
  const [goal, setGoal] = useState('');

  const [fitnessModal, setFitnessModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [focused, setFocused] = useState(null);

  // Icon touch activate Input
  const dobRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const weightRef = useRef(null);
  const heightRef = useRef(null);

  // Formik states to ensure correct details are entered
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);

  const data = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];

  const toggleModalDob = () => {
    setModalVisible2(true);
  };
  const onDateChange = async (event, selectedValue) => {
    if (event.type === 'set') {
      const currentDate = selectedValue || date;

      const today = new Date();

      const age = today.getFullYear() - currentDate.getFullYear();
      const monthDifference = today.getMonth() - currentDate.getMonth();

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
        await setDob(formattedDate);
        handleDoBChange(formattedDate);
        console.log('formated date', formattedDate);
      }
    }

    setModalVisible2(false);
  };
  const handleDoBChange = value => {
    setDoB(value);

    // Parse the input to get day, month, year
    const [day, month, year] = value.split('/').map(Number);
    const selectedDate = new Date(year, month - 1, day); // month is 0-based

    // Get today's date
    const today = new Date();

    // Calculate age
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < selectedDate.getDate())
    ) {
      age--;
    }

    // Check if the age is less than 24
    if (age < 24) {
      showToast('Error', 'Age must be 24 years', 'warning');
      setDoB(''); // Optionally clear the input if the age is invalid
    }
  };
  const handleNameInput = () => {
    nameRef.current?.focus();
  };
  const handleEmailInput = () => {
    emailRef.current?.focus();
  };

  const handleSignup = async () => {
    const payload = {
      fullName: name,
      Address: address,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
      gender: Gender,
      Dob: DoB,
      weight: weight,
      height: height,
    };

    const validationChecks = [
      {
        condition: name.length > 3,
        message: 'Name must be greater than 3 letters.',
      },
      {
        condition:
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          email.endsWith('@gmail.com'),
        message: 'Enter a valid Gmail address.',
      },
      {
        condition: password.length >= 6 && password === confirmpassword,
        message: 'Password must be the same and at least 6 characters long.',
      },
      {condition: Gender, message: 'Please enter your gender.'},
      {condition: DoB, message: 'Please enter your date of birth.'},
      {condition: weight > 0, message: 'Please enter your weight.'},
      {condition: height > 0, message: 'Please enter your height.'},
      {
        condition: address.trim().length > 0,
        message: 'Please enter your address.',
      },
    ];

    for (const {condition, message} of validationChecks) {
      if (!condition) {
        return showToast('Error', message, 'danger');
      }
    }

    try {
      let res;

      if (user.checkUser === 'user') {
        res = await SignUpUser(payload);
        if (res.data) {
          showToast('Success', 'User created successfully', 'success');
          navigation.navigate('signin', {checkUser: 'user'});
        } else if (res.error) {
          showToast('Error', res.error?.data?.message, 'danger');
        }
      } else if (user.checkUser === 'trainer') {
        res = await SignUpTrainer(payload);
        if (res.data) {
          showToast('Success', 'Trainer created successfully', 'success');
          navigation.navigate('signin', {checkUser: 'trainer'});
        } else if (res.error) {
          showToast('Error', res.error?.data.message, 'danger');
        }
      }
    } catch (error) {
      showToast('Error', error?.message, 'danger');
      console.error('Error:', error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // ✅ clear old session (VERY IMPORTANT)
      await GoogleSignin.signOut();

      // ✅ get fresh token
      const userInfo = await GoogleSignin.signIn();

      console.log('User info from google:', userInfo);

      const idToken = userInfo.data.idToken;

      if (!idToken) {
        throw new Error('No idToken received from Google');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential =
        await auth().signInWithCredential(googleCredential);

      const firebaseUser = userCredential.user;

      console.log('Firebase User:', firebaseUser);

      // ✅ SEND TO BACKEND
      const res = await fetch(`${baseUrl}common/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: route.params.checkUser, // 🔥 FIXED
          email: firebaseUser.email,
          fullName: firebaseUser.displayName,
          profileImage: firebaseUser.photoURL,
          firebaseUID: firebaseUser.uid,
        }),
      });

      const data = await res.json();

      dispatch(IsLogin(data.data));
    } catch (error) {
      console.log('Google Error:', error);
      showToast('Error', 'Google login failed', 'danger');
    }
  };

  const SelectionModal = ({visible, onClose, data, onSelect}) => {
    return (
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
  };

  return (
    <ScrollView style={{flexGrow: 1}}>
      <WrapperContainer>
        <ImageBackground
          resizeMode="cover"
          source={Images.bg}
          style={{flex: 1}}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Image source={Images.logo} />
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(4),
                fontFamily: FontFamily.Semi_Bold,
                marginBottom: responsiveHeight(2),
              }}>
              Sign Up
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2.5),
                fontFamily: FontFamily.Medium,
                marginBottom: responsiveHeight(2),
              }}>
              Create An Account
            </Text>

            <View style={{gap: responsiveHeight(3)}}>
              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: focused === 'name' ? '#9FED3A' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Full name</Text>
                  <TextInput
                    ref={nameRef}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter name"
                    value={name || undefined}
                    onChangeText={setname}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      width: responsiveWidth(68),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'#908C8D'}
                  />
                </View>
                <TouchableOpacity onPress={handleNameInput}>
                  <Image
                    source={Images.user}
                    style={{
                      width: responsiveWidth(3.6),
                      height: responsiveWidth(5),
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: focused === 'email' ? '#9FED3A' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Email</Text>
                  <TextInput
                    ref={emailRef}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter email"
                    value={email || undefined}
                    onChangeText={setemail}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      width: responsiveWidth(68),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'#908C8D'}
                  />
                </View>
                <TouchableOpacity onPress={handleEmailInput}>
                  <Image
                    source={Images.email}
                    style={{width: responsiveWidth(5)}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: focused === 'phone' ? '#9FED3A' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* LEFT SIDE → Country Picker */}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                    borderRightWidth: 1,
                    borderRightColor: '#555',
                  }}
                  onPress={() => setShowPicker(true)}>
                  <CountryPicker
                    countryCode={country}
                    withFlag
                    withCallingCode
                    withFilter
                    withEmoji
                    withModal
                    visible={showPicker}
                    onClose={() => setShowPicker(false)}
                    onSelect={c => {
                      setCountry(c.cca2);
                      setCountryCode(c.callingCode[0]);
                      setShowPicker(false);
                    }}
                  />

                  <Text style={{color: '#fff', marginLeft: 6}}>
                    +{countryCode}
                  </Text>
                </TouchableOpacity>

                {/* RIGHT SIDE → Number */}
                <TextInput
                  ref={phoneRef}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
                  placeholderTextColor="#908C8D"
                  value={phone}
                  onChangeText={setPhone}
                  style={{
                    color: '#fff',
                    flex: 1,
                    paddingLeft: 12,
                  }}
                />
              </View>

              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: focused === 'password' ? '#9FED3A' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Password</Text>
                  <TextInput
                    ref={passwordRef}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter Password"
                    secureTextEntry={secure}
                    value={password || undefined}
                    onChangeText={setpassword}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      width: responsiveWidth(67),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'#908C8D'}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setsecure(!secure);
                  }}>
                  <Image
                    source={secure ? Images.eye_off : Images.eye}
                    style={{width: responsiveWidth(6)}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: focused === 'confirm' ? '#9FED3A' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Confirm Password</Text>
                  <TextInput
                    ref={confirmRef}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter Password"
                    secureTextEntry={secure2}
                    value={confirmpassword || undefined}
                    onChangeText={setconfirmpassword}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      width: responsiveWidth(67),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'#908C8D'}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setsecure2(!secure2);
                  }}>
                  <Image
                    source={secure2 ? Images.eye_off : Images.eye}
                    style={{width: responsiveWidth(6)}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: responsiveWidth(85),
                justifyContent: 'space-between',
                marginTop: responsiveHeight(3),
              }}>
              <View
                style={{
                  width: responsiveWidth(40),
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(4),
                  paddingTop: responsiveWidth(2),
                  borderColor: focused === 'name' ? '#9FED3A' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: responsiveWidth(34)}}>
                  <Text style={{color: '#908C8D'}}>Gender</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    renderRightIcon={() => (
                      <Image
                        source={Images.dropdown}
                        style={{width: responsiveWidth(5)}}
                        resizeMode="contain"
                      />
                    )}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Gender"
                    value={Gender}
                    onChange={item => {
                      setGender(item.value);
                    }}
                    itemTextStyle={{color: '#000'}}
                  />
                </View>
              </View>
              <View
                style={{
                  width: responsiveWidth(40),
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveWidth(2),
                  borderColor: focused === 'name' ? '#9FED3A' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Date of Birth</Text>

                  {dob ? (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      {dob}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: '#bbbbbb',
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      dd/mm/yyyy
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={toggleModalDob}>
                  <Image
                    source={Images.calendar}
                    style={{width: responsiveWidth(4.5)}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {modalVisible2 && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => setModalVisible2(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setModalVisible2(false)}>
                  <View>
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
            <View
              style={{
                flexDirection: 'row',
                width: responsiveWidth(85),
                justifyContent: 'space-between',
                marginTop: responsiveHeight(3),
              }}>
              <View
                style={{
                  width: responsiveWidth(40),
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveWidth(2),
                  borderColor: focused === 'weight' ? '#9FED3A' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Weight in lbs</Text>
                  <TextInput
                    ref={weightRef}
                    onFocus={() => setFocused('weight')}
                    onBlur={() => setFocused(null)}
                    keyboardType="numeric"
                    placeholder="Your Weight"
                    placeholderTextColor={'#908C8D'}
                    value={weight}
                    onChangeText={setweight}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      height: responsiveHeight(3),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  width: responsiveWidth(40),
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveWidth(2),
                  borderColor: focused === 'height' ? '#9FED3A' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Height in ft</Text>
                  <TextInput
                    ref={heightRef}
                    onFocus={() => setFocused('height')}
                    onBlur={() => setFocused(null)}
                    keyboardType="numeric"
                    placeholder="Your Height"
                    placeholderTextColor={'#908C8D'}
                    value={height}
                    onChangeText={setheight}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      height: responsiveHeight(3),
                    }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setFitnessModal(true)}>
              <Text style={{color: '#908C8D'}}>Fitness Preference</Text>

              <Text style={{color: '#fff'}}>
                {fitnessPreference || 'Select Preference'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setGoalModal(true)}>
              <Text style={{color: '#908C8D'}}>Goal</Text>

              <Text style={{color: '#fff'}}>{goal || 'Select Goal'}</Text>
            </TouchableOpacity>

            <ButtonComp
              text="Sign Up"
              mainStyle={{
                width: responsiveWidth(85),
                marginTop: responsiveHeight(5),
              }}
              onPress={() => {
                handleSignup();
              }}
              isLoading={SignupUserLoading || SignupTrainerLoading}
            />
            <Text style={{color: '#aaa', marginTop: 20}}>Or continue with</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity onPress={handleGoogleSignup}>
                <Image source={Images.google} style={styles.socialIcon} />
              </TouchableOpacity>
              {/* <Image source={Images.facebook} style={styles.socialIcon} /> */}
              <Image source={Images.apple} style={styles.socialIcon} />
            </View>
            <View
              style={{
                width: '85%',
                marginTop: responsiveHeight(1),
                flexDirection: 'row',
                paddingBottom: responsiveHeight(10),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  fontFamily: FontFamily.Light,
                }}>
                Already have an Account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('signin', {
                    checkUser: user.checkUser === 'user' ? 'user' : 'trainer',
                  });
                }}>
                <Text
                  style={{
                    color: '#9FED3A',
                    textDecorationLine: 'underline',
                    fontFamily: FontFamily.Extra_Bold,
                  }}>
                  Sign In!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
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
      </WrapperContainer>
      <FlashMessage position="top" />
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  dropdown: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    height: responsiveHeight(3.3),
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
    // display: 'flex',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  inputBox: {
    width: responsiveWidth(85),
    padding: 15,
    borderWidth: 1,
    borderColor: '#908C8D',
    // borderColor: focused === 'name' ? '#9FED3A' : '#908C8D',
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

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
    gap: responsiveWidth(10),
  },

  socialIcon: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    resizeMode: 'contain',
  },
});
