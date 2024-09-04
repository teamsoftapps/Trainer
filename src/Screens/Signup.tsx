import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dropdown } from 'react-native-element-dropdown';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../Components/ButtonComp';
import { FontFamily, Images } from '../utils/Images';
import WrapperContainer from '../Components/Wrapper';
import MaskInput, { Masks } from 'react-native-mask-input';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useNavigation } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { IsLogin } from '../store/Slices/AuthSlice';
import { useSignUpUserMutation } from '../store/Slices/userAuth';
import { useSignUpTrainerMutation } from '../store/Slices/trainerAuth';

const Signup = ({ route }) => {
  const { user } = route.params;
  console.log('Rute', user);
  const dispatch = useDispatch();
  const [SignUpUser] = useSignUpUserMutation();
  const [SignUpTrainer] = useSignUpTrainerMutation();
  const authData = useSelector(state => state.Auth.data);
  const navigation = useNavigation();

  // States for signnup
  const [name, setname] = useState('John snow');
  const [email, setemail] = useState('Johnsnow@gmail.com');
  const [password, setpassword] = useState('1234656');
  const [confirmpassword, setconfirmpassword] = useState('1234656');
  const [DoB, setDoB] = useState('');
  const [weight, setweight] = useState('10');
  const [height, setheight] = useState('20');
  const [address, setAddress] = useState("43 Bourke street, WA, 7563")
  const [Gender, setGender] = useState('');

  // Icon touch activate Input 
  const dobRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);

  // Formik states to ensure correct details are entered
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);
  const [namedisabled, setnamedisable] = useState(false);
  const [emaildisabled, setemaildisable] = useState(false);
  const [passworddisabled, setpassworddisable] = useState(false);
  const [genderdisabled, setgenderdisable] = useState(false);
  const [DOBdisabled, setDOBdisable] = useState(false);
  const [Weightdisabled, setWeightdisable] = useState(false);
  const [Heightdisabled, setHeightdisable] = useState(false);
  const [Addressdisabled, setaddressdisabled] = useState(false)

  const data = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];


  const handledobInput = () => {
    dobRef.current?.focus();
  };
  const handleNameInput = () => {
    nameRef.current?.focus();
  };
  const handleEmailInput = () => {
    emailRef.current?.focus();
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const condition1 = name.includes(' ') && name.length > 3;
  const condition2 = emailPattern.test(email);
  const condition3 = password === confirmpassword && password != '';
  const condition4 = Gender != '';
  const condition5 = DoB != '';
  const condition6 = weight != '';
  const condition7 = height != '';
  const condition8 = address != "";


  const handleSignup = async () => {
    let payload = {
      fullName: name,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
      gender: Gender,
      Dob: DoB,
      weight: weight,
      height: height,
      Address: address
    };
    console.log("condition 7 & 8", condition7, condition8)
    if (condition1 &&
      condition2 &&
      condition3 &&
      condition4 &&
      condition5 &&
      condition6 &&
      condition7 &&
      condition8) {
      setnamedisable(false);
      setemaildisable(false);
      setpassworddisable(false);
      setgenderdisable(false);
      setDOBdisable(false);
      setWeightdisable(false);
      setHeightdisable(false);
      setaddressdisabled(false)
      try {
        if (user === 'user') {
          let res = await SignUpUser(payload);
          if (res.data) {
            showMessage({
              message: 'Success',
              description: 'User created in successfully',
              type: 'success',
            });
            dispatch(IsLogin(res.data?.data.token));
          }
          if (res.error) {
            showMessage({
              message: 'Error',
              description: res.error?.data.message,
              type: 'danger',
            });
          }
        } else {
          let res = await SignUpTrainer(payload);
          if (res.data) {
            showMessage({
              message: 'Success',
              description: 'Trainer created in successfully',
              type: 'success',
            });
            dispatch(IsLogin(res.data?.data.token));
          }
          if (res.error) {
            console.log('Errorsssssss//////', res.error);
            showMessage({
              message: 'Error',
              description: res.error?.data.message,
              type: 'danger',
            });
          }
        }
      } catch (error) {
        console.log('Errorrrr', error.message);
        showMessage({
          message: 'Error',
          description: 'error.message',
          type: 'danger',
        });
      }
    } else {
      if (!condition1) setnamedisable(true);
      if (!condition2) setemaildisable(true);
      if (!condition3) setpassworddisable(true);
      if (!condition4) setgenderdisable(true);
      if (!condition5) setDOBdisable(true);
      if (!condition6) setWeightdisable(true);
      if (!condition7) setHeightdisable(true);
      if (!condition8) setaddressdisabled(true);

      if (condition1) setnamedisable(false);
      if (condition2) setemaildisable(false);
      if (condition3) setpassworddisable(false);
      if (condition4) setgenderdisable(false);
      if (condition5) setDOBdisable(false);
      if (condition6) setWeightdisable(false);
      if (condition7) setHeightdisable(false);
      if (condition8) setaddressdisabled(false);
    }

  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <WrapperContainer>
        <ImageBackground
          resizeMode="cover"
          source={Images.bg}
          style={{ flex: 1 }}>
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

            <View style={{ gap: responsiveHeight(3) }}>
              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: namedisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{ color: '#908C8D' }}>Full name</Text>
                  <TextInput
                    ref={nameRef}
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
                  borderColor: emaildisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{ color: '#908C8D' }}>Email</Text>
                  <TextInput
                    ref={emailRef}
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
                    style={{ width: responsiveWidth(5) }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: responsiveWidth(85),
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: passworddisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{ color: '#908C8D' }}>Password</Text>
                  <TextInput
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
                    style={{ width: responsiveWidth(6) }}
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
                  borderColor: passworddisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{ color: '#908C8D' }}>Confirm Password</Text>
                  <TextInput
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
                    style={{ width: responsiveWidth(6) }}
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
                  borderColor: genderdisabled ? 'red' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ width: responsiveWidth(34) }}>
                  <Text style={{ color: '#908C8D' }}>Gender</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    renderRightIcon={() => (
                      <Image
                        source={Images.dropdown}
                        style={{ width: responsiveWidth(5) }}
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
                  borderColor: DOBdisabled ? 'red' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ width: responsiveWidth(27) }}>
                  <Text style={{ color: '#908C8D' }}>Date of Birth</Text>
                  <MaskInput
                    ref={dobRef}
                    value={DoB}
                    keyboardType="numeric"
                    placeholderTextColor="#908C8D"
                    focusable={true}
                    onChangeText={setDoB}
                    mask={Masks.DATE_DDMMYYYY}
                    style={{
                      padding: 0,
                      fontFamily: FontFamily.Semi_Bold,
                      color: 'white',
                      fontSize: responsiveFontSize(2),
                      width: responsiveWidth(67),
                      height: responsiveHeight(3),
                    }}
                  />
                </View>
                <TouchableOpacity onPress={handledobInput}>
                  <Image
                    source={Images.calendar}
                    style={{ width: responsiveWidth(4.5) }}
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
                  paddingVertical: responsiveWidth(2),
                  borderColor: Weightdisabled ? 'red' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ width: responsiveWidth(27) }}>
                  <Text style={{ color: '#908C8D' }}>Weight in lbs</Text>
                  <TextInput
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
                  borderColor: Heightdisabled ? 'red' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ width: responsiveWidth(27) }}>
                  <Text style={{ color: '#908C8D' }}>Height in ft</Text>
                  <TextInput
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
            <View
              style={{
                width: responsiveWidth(85),
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(2),
                marginTop: responsiveHeight(3),
                borderWidth: 1,
                borderColor: Addressdisabled ? 'red' : '#908C8D',
                borderRadius: 17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "space-between"
              }}>
              <View>
                <Text style={{ color: '#908C8D' }}>Address</Text>
                <TextInput
                  ref={addressRef}
                  placeholder="i.e 43 Bourke street, NSW 987"
                  value={address}
                  onChangeText={setAddress}
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
                  source={Images.LocationPin}

                  resizeMode='contain'
                  style={{ width: responsiveWidth(5), height: responsiveWidth(5), tintColor: '#908C8D' }}
                />
              </TouchableOpacity>
            </View>
            <ButtonComp
              text="Sign Up"
              mainStyle={{
                width: responsiveWidth(85),
                marginTop: responsiveHeight(5),
              }}
              onPress={() => {
                handleSignup();
                // fetchData();
                // navigation.navigate(NavigationStrings.COMPLETE_PROFILE);
              }}
            />
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
                  navigation.navigate(NavigationStrings.LOG_IN);
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
});
