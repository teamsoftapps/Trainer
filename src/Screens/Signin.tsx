import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { FontFamily, Images } from '../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../Components/ButtonComp';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import WrapperContainer from '../Components/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useSignInMutation } from '../store/Slices/Auth';
import { IsLogin } from '../store/Slices/AuthSlice';
import { showMessage } from 'react-native-flash-message';
const Signin = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [secure, setsecure] = useState(false);
  const [remember, setremember] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const St = useSelector(state => state);
  console.log('State', St);
  const [SignIn, { data }] = useSignInMutation();

  const handleSignin = async () => {
    let payload = {
      email: email,
      password: password,
    };
    try {
      let res = await SignIn(payload);

      if (res.data) {
        showMessage({
          message: 'Success',
          description: 'User logged in successfully',
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
    } catch (error) {
      console.log('Errorrrr', error.message);
      showMessage({
        message: 'Error',
        description: 'error.message',
        type: 'danger',
      });
    }
  };

  return (
    <WrapperContainer>
      <ImageBackground
        resizeMode="cover"
        source={Images.bg}
        style={{ height: responsiveHeight(100) }}>
        <View
          style={{
            alignItems: 'center',
            marginTop: responsiveHeight(10),
          }}>
          <Image
            source={Images.logo}
            style={{
              marginBottom: responsiveHeight(2),
            }}
          />
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(4),
              fontFamily: FontFamily.Semi_Bold,
              marginBottom: responsiveHeight(2),
            }}>
            Welcome Back!
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2.5),
              fontFamily: FontFamily.Medium,
              marginBottom: responsiveHeight(2),
            }}>
            Sign in To Continue
          </Text>
          <View style={{ gap: responsiveHeight(3) }}>
            <View
              style={{
                width: responsiveWidth(85),
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(2),
                borderWidth: 1,
                borderColor: '#908C8D',
                borderRadius: 17,
              }}>
              <Text style={{ color: '#908C8D' }}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                value={email || undefined}
                onChangeText={setemail}
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={{
                width: responsiveWidth(85),
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(2),
                borderWidth: 1,
                borderColor: '#908C8D',
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
                    height: responsiveHeight(4),
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
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: responsiveWidth(85),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: responsiveHeight(2),
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveWidth(2),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setremember(!remember);
                }}>
                <Image
                  source={remember ? Images.checked : Images.unchecked}
                  style={{
                    width: responsiveWidth(7),
                    height: responsiveWidth(7),
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  fontFamily: FontFamily.Semi_Bold,
                }}>
                Remember me
              </Text>
            </View>
            <TouchableOpacity onPress={() => {  }}>
              <Text
                style={{
                  color: '#9FED3A',
                  textDecorationLine: 'underline',
                  fontSize: responsiveFontSize(2),
                  fontFamily: FontFamily.Semi_Bold,
                }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
          <ButtonComp
            onPress={handleSignin}
            text="Sign In"
            mainStyle={{
              width: responsiveWidth(85),
              marginTop: responsiveHeight(5),
            }}
          />
          <View
            style={{
              width: '85%',
              marginTop: responsiveHeight(1),
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontFamily: FontFamily.Light,
              }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(NavigationStrings.SIGN_UP);
              }}>
              <Text
                style={{
                  color: '#9FED3A',
                  textDecorationLine: 'underline',
                  fontFamily: FontFamily.Extra_Bold,
                }}>
                Sign up.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </WrapperContainer>
  );
};

export default Signin;

const styles = StyleSheet.create({});
