import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import {TouchableOpacity} from 'react-native';
import Button from '../Components/Button';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import axiosBaseURL from '../services/AxiosBaseURL';
import {useDispatch, useSelector} from 'react-redux';
import {
  useForgotPassUserMutation,
  useVerifyOtpMutation,
} from '../store/Apis/userAuth';
import useToast from '../Hooks/Toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootProps} from '../Navigations/AuthStack';
import {SaveEmail, ForgetPasswordID} from '../store/Slices/AuthSlice';
import {
  useTrainerForgetPassMutation,
  useTrainerVerifyOtpMutation,
} from '../store/Apis/trainerAuth';

type Props = NativeStackScreenProps<RootProps, 'VerifyOTP'>;
const VerifyOTP: React.FC<Props> = ({navigation, route}) => {
  const data = route.params;
  const [start, setstart] = useState(false);
  const [code, setcode] = useState('');
  const [time, setTime] = useState(60);
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const authData = useSelector(state => state.Auth);
  const [verifyOtp, {isLoading: isUserLoading}] = useVerifyOtpMutation();
  const [TrainerVerifyOtp, {isLoading: isTrainerLoading}] =
    useTrainerVerifyOtpMutation();
  const [ForgotPassUser, {isLoading: isUserResetOtpLoading}] =
    useForgotPassUserMutation();
  const [TrainerForgetPass, {isLoading: isTrainerResetOtpLoading}] =
    useTrainerForgetPassMutation();
  const {showToast} = useToast();
  const dispatch = useDispatch();

  const ResendOTPFunctions = async () => {
    if (isDisabled) return; // Prevent action if button is disabled

    let payload = {email: authData.res_EMAIL};

    try {
      if (data.checkUser === 'user') {
        const res: any = await ForgotPassUser(payload);

        if (res.data) {
          showToast('Success', 'OTP has been resent successfully', 'success');
          setIsDisabled(true);
          setRemainingTime(60);
          const countdown = (time: number) => {
            if (time <= 0) {
              setIsDisabled(false); // Re-enable button when countdown ends
              return;
            }

            // Update remaining time
            setRemainingTime(time);

            // Set timeout to update time every second
            const id: any = setTimeout(() => countdown(time - 1), 1000);

            // Save the timeout ID to clear it if needed
            setTimeoutId(id);
          };

          // Start the countdown
          countdown(60);
        } else if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }
      if (data.checkUser === 'trainer') {
        const res: any = await TrainerForgetPass(payload);

        if (res.data) {
          showToast('Success', 'OTP has been resent successfully', 'success');
          setIsDisabled(true);
          setRemainingTime(60);
          const countdown = (time: number) => {
            if (time <= 0) {
              setIsDisabled(false); // Re-enable button when countdown ends
              return;
            }

            // Update remaining time
            setRemainingTime(time);

            // Set timeout to update time every second
            const id: any = setTimeout(() => countdown(time - 1), 1000);

            // Save the timeout ID to clear it if needed
            setTimeoutId(id);
          };

          // Start the countdown
          countdown(60);
        } else if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }
    } catch (error: any) {
      showToast('Error', error?.message, 'danger');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const VerifyOTPFunction = async () => {
    let payload = {
      data: {resetPasswordVerificationCode: code},

      _id: authData?.res_ID,
    };
    try {
      if (!code || code.length < 4) {
        return showToast('Error', 'Input field must not be empty', 'danger');
      }

      // FOR USER // This Api Func will Run

      if (data.checkUser === 'user') {
        const res: any = await verifyOtp(payload);

        if (res?.data) {
          setcode('');
          showToast('Success', res?.data.message, 'success');
          navigation.replace('ConfirmNewPassword', {checkUser: data.checkUser});
          dispatch(SaveEmail(null));
        }
        if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }

      // FOR TRAINER // This Api Func will Run

      if (data.checkUser === 'trainer') {
        const res: any = await TrainerVerifyOtp(payload);

        if (res?.data) {
          setcode('');
          showToast('Success', res?.data.message, 'success');
          navigation.replace('ConfirmNewPassword', {checkUser: data.checkUser});
          dispatch(SaveEmail(null));
        }
        if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }
    } catch (error: any) {
      showToast('Error', error?.message, 'danger');
    }
  };

  useEffect(() => {
    if (!start) {
      return;
    }
    if (time <= 0) return;

    const timeoutId = setTimeout(() => {
      setTime(prevTime => {
        if (prevTime <= 1) return 0;
        return prevTime - 1;
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [time, start]);

  return (
    <WrapperContainer>
      <ScrollView>
        <TouchableWithoutFeedback style={{flex: 1}}>
          <KeyboardAvoidingView>
            <Header
              text="Verify OTP"
              textstyle={{color: 'white'}}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View style={{alignItems: 'center'}}>
              <Image
                source={Images.OTPImage}
                style={{width: responsiveWidth(30)}}
                resizeMode="contain"
              />
            </View>
            <View style={{marginTop: responsiveWidth(7)}}>
              <Text
                style={{
                  color: 'grey',
                  textAlign: 'center',
                  fontSize: responsiveFontSize(2.2),
                }}>
                Please enter your email address to recieve {'\n'} a verification
                code
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: responsiveWidth(7),
              }}>
              <OtpInput
                onTextChange={text => setcode(text)}
                numberOfDigits={4}
                theme={{
                  containerStyle: {width: responsiveWidth(70)},
                  pinCodeTextStyle: {color: 'white'},
                }}
              />
            </View>
            {isUserResetOtpLoading || isTrainerResetOtpLoading ? (
              <ActivityIndicator
                style={{marginTop: responsiveHeight(2)}}
                size={responsiveHeight(5)}
                color={'#9FED3A'}
              />
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: responsiveWidth(7),
                }}>
                <TouchableOpacity
                  disabled={isDisabled}
                  onPress={() => {
                    ResendOTPFunctions();
                  }}>
                  <Text
                    style={{
                      color: isDisabled ? 'grey' : '#9FED3A',
                      textDecorationLine: 'underline',
                    }}>
                    {isDisabled ? `Resend in ${remainingTime}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                alignItems: 'center',
                marginTop: responsiveWidth(50),
                marginBottom: responsiveWidth(5),
              }}>
              <Button
                text="Send"
                onPress={() => {
                  VerifyOTPFunction();
                }}
                isloading={isTrainerLoading || isUserLoading}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </WrapperContainer>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
