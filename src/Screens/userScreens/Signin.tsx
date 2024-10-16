import {
  Alert,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {FontFamily, Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../../Components/ButtonComp';
import {useNavigation, useRoute} from '@react-navigation/native';

import WrapperContainer from '../../Components/Wrapper';
import {useDispatch, useSelector} from 'react-redux';
import {useSignInUserMutation} from '../../store/Apis/userAuth';
import {
  useSignInTrainerMutation,
  useSignUpTrainerMutation,
} from '../../store/Apis/trainerAuth';
import {IsLogin} from '../../store/Slices/AuthSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootProps} from '../../Navigations/AuthStack';
import useToast from '../../Hooks/Toast';
import {showMessage} from 'react-native-flash-message';

type Props = NativeStackScreenProps<RootProps, 'signin'>;

const Signin: React.FC<Props> = ({route}) => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [secure, setsecure] = useState(false);
  const [remember, setremember] = useState(false);
  const data = route.params;
  console.log('ADSASAD', data.checkUser);
  const {showToast} = useToast();
  const dispatch = useDispatch();
  const [SignInUser, {isLoading: SigninUserLoading}] = useSignInUserMutation();
  const [SignInTrainer, {isLoading: SigninTrainerLoading}] =
    useSignInTrainerMutation();
  const navigation = useNavigation();
  const handleSignin = async () => {
    let payload = {
      email: email,
      password: password,
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if (!emailPattern.test(email)) {
        return showToast('Error', 'Please Enter Valid Email', 'danger');
      }

      if (data.checkUser == 'user') {
        let res: any = await SignInUser(payload);
        if (res.data) {
          console.log('----------------++++++++++', res.data?.data);
          showToast('Success', 'User logged In Successfully', 'success');
          dispatch(IsLogin(res?.data?.data));
        }
        if (res.error) {
          console.log('Errorrrr', res.error);
          showToast('Error', res?.error?.data.message, 'danger');
        }
      } else {
        let res: any = await SignInTrainer(payload);
        if (res.data) {
          showMessage({
            message: 'Success',
            description: 'Trainer logged in successfully',
            type: 'success',
          });
          dispatch(IsLogin(res?.data?.data));
        }
        if (res.error) {
          showToast('Error', res.error?.data.message, 'danger');
        }
      }
    } catch (error: any) {
      console.log('Errorrrr', error?.message);
      showToast('Error', error?.message, 'danger');
    }
  };

  return (
    <WrapperContainer>
      <ImageBackground
        resizeMode="cover"
        source={Images.bg}
        style={{height: responsiveHeight(100)}}>
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
          <View style={{gap: responsiveHeight(3)}}>
            <View
              style={{
                width: responsiveWidth(85),
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(2),
                borderWidth: 1,
                borderColor: '#908C8D',
                borderRadius: 17,
              }}>
              <Text style={{color: '#908C8D'}}>Email</Text>
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
                  style={{width: responsiveWidth(6)}}
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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword', {data: data});
              }}>
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
            isLoading={SigninUserLoading || SigninTrainerLoading}
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
                navigation.navigate('signup', {checkUser: data.checkUser});
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
