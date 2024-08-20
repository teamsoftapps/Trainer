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
import axiosBaseURL from '../utils/AxiosBaseURL';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { IsLogin } from '../store/Slices/AuthSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.Auth.data);
  const navigation = useNavigation();
  const [name, setname] = useState('test def');
  const [email, setemail] = useState('test@gmail.com');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [DoB, setDoB] = useState('');
  const [weight, setweight] = useState('');
  const [height, setheight] = useState('');
  const dobRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [Gender, setGender] = useState('');
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);
  const [namedisabled, setnamedisable] = useState(false);
  const [emaildisabled, setemaildisable] = useState(false);
  const [passworddisabled, setpassworddisable] = useState(false);
  const [genderdisabled, setgenderdisable] = useState(false);
  const [DOBdisabled, setDOBdisable] = useState(false);
  const [Weightdisabled, setWeightdisable] = useState(false);
  const [Heightdisabled, setHeightdisable] = useState(false);
  const data = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  if (!authData) {
    console.log('no Data saved in store');
  } else {
    console.log('Data found in store::', authData);
  }

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

  const fetchData = () => {


    if (
      condition1 &&
      condition2 &&
      condition3 &&
      condition4 &&
      condition5 &&
      condition6 &&
      condition7
    ) {
      setnamedisable(false);
      setemaildisable(false);
      setpassworddisable(false);
      setgenderdisable(false);
      setDOBdisable(false);
      setWeightdisable(false);
      setHeightdisable(false);
      axiosBaseURL
        .post('/trainer/trainerSignup', {
          email: email,
          fullname: name,
          password: password,
          gender: Gender,
          Dob: DoB,
          weight: weight,
          height: height,
        })
        .then(response => {
          console.log('User Created', response.data);
          dispatch(IsLogin(response.data.data.email));
        })
        .catch(error => {
          console.error('Error fetching data:', error.response.data.message);
          showMessage({
            message: 'Login Error',
            description:
              error?.response?.data?.message ||
              'An error occurred while logging in',
            type: 'danger',
          });
        });
    } else {
      if (!condition1) setnamedisable(true);
      if (!condition2) setemaildisable(true);
      if (!condition3) setpassworddisable(true);
      if (!condition4) setgenderdisable(true);
      if (!condition5) setDOBdisable(true);
      if (!condition6) setWeightdisable(true);
      if (!condition7) setHeightdisable(true);
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
                      height: responsiveHeight(3),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'white'}
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
                      height: responsiveHeight(3),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'white'}
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
                      height: responsiveHeight(3),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'white'}
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
                      height: responsiveHeight(3),
                    }}
                    numberOfLines={1}
                    placeholderTextColor={'white'}
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
                    placeholderTextColor="#fff"
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
                    placeholderTextColor={'#fff'}
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
                    placeholderTextColor={'#fff'}
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
            <ButtonComp
              text="Sign Up"
              mainStyle={{
                width: responsiveWidth(85),
                marginTop: responsiveHeight(5),
              }}
              onPress={() => {
                fetchData();
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
