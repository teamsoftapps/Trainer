import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
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
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../../Components/ButtonComp';
import {FontFamily, Images} from '../../utils/Images';
import WrapperContainer from '../../Components/Wrapper';
import MaskInput, {Masks} from 'react-native-mask-input';
import {useNavigation} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {IsLogin} from '../../store/Slices/AuthSlice';
import {useSignUpUserMutation} from '../../store/Apis/userAuth';
import {useSignUpTrainerMutation} from '../../store/Apis/trainerAuth';
import useToast from '../../Hooks/Toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootProps} from '../../Navigations/AuthStack';
import {MAP_API_KEY} from '../../config/urls';

type Props = NativeStackScreenProps<RootProps, 'signup'>;

const Signup: React.FC<Props> = ({route, navigation}) => {
  const user = route.params;
  console.log('Routes', user);
  const {showToast} = useToast();
  const dispatch = useDispatch();
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
  const [Addressdisabled, setaddressdisabled] = useState(false);

  const data = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];

  const emailPattern = /^[^\s@]+@gmail\.com$/;

  const handledobInput = () => {
    dobRef.current?.focus();
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
                  borderColor: namedisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Full name</Text>
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
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Email</Text>
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
                  borderColor: passworddisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Password</Text>
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
                  borderColor: passworddisabled ? 'red' : '#908C8D',
                  borderRadius: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#908C8D'}}>Confirm Password</Text>
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
                  borderColor: genderdisabled ? 'red' : '#908C8D',
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
                  borderColor: DOBdisabled ? 'red' : '#908C8D',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Date of Birth</Text>
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
                    style={{width: responsiveWidth(4.5)}}
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
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Weight in lbs</Text>
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
                <View style={{width: responsiveWidth(27)}}>
                  <Text style={{color: '#908C8D'}}>Height in ft</Text>
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
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{color: '#908C8D'}}>Address</Text>
                <TextInput
                  ref={addressRef}
                  placeholder="i.e 43 Bourke street, NSW 987"
                  value={address}
                  onChangeText={text => {
                    setAddress(text);
                  }}
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
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(5),
                    height: responsiveWidth(5),
                    tintColor: '#908C8D',
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* <GooglePlacesAutocomplete
              placeholder="Enter your address"
              onPress={handleAddressSelect}
              query={{
                key: MAP_API_KEY,
                language: 'en',
              }}
              styles={{
                textInput: {
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 20,
                },
              }}
            /> */}

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
