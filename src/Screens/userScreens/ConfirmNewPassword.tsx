import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import {TouchableOpacity} from 'react-native';
import Button from '../../Components/Button';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {SignOut} from '../../store/Slices/AuthSlice';
import {useChangePasswordMutation} from '../../store/Apis/userAuth';
import useToast from '../../Hooks/Toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootProps} from '../../Navigations/AuthStack';
import {useTrainerChangePassMutation} from '../../store/Apis/trainerAuth';

type Props = NativeStackScreenProps<RootProps, 'ConfirmNewPassword'>;

const ConfirmNewPassword: React.FC<Props> = ({navigation, route}) => {
  const data = route.params;
  const dispatch = useDispatch();
  console.log('CNFRM', data.checkUser);
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);
  const [passworddisabled, setpassworddisable] = useState(false);
  const authData = useSelector(state => state.Auth);
  console.log('auth data', authData);
  const [changePassword, {isLoading: UserChangePassLoading}] =
    useChangePasswordMutation();
  const [TrainerChangePass, {isLoading: TrainerChangePassLoading}] =
    useTrainerChangePassMutation();
  const {showToast} = useToast();
  const condition1 = password === confirmpassword && password != '';

  const handleChangePassword = async () => {
    let payload = {
      data: {
        password: password,
      },
      id: authData?.res_ID,
    };
    try {
      if (!condition1) {
        return showToast('Error', 'Field must not be empty', 'danger');
      }

      if (data.checkUser === 'user') {
        const res: any = await changePassword(payload);
        if (res.data) {
          console.log('USERChanePasswordData', res.data);
          showToast('Success', `${res?.data?.message}!! Now Login `, 'success');
          navigation.replace('signin', {checkUser: data.checkUser});
        }
        if (res.error) {
          console.log('ChanePasswordDataError', res.error);
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }

      if (data.checkUser === 'trainer') {
        const res: any = await TrainerChangePass(payload);
        if (res.data) {
          console.log('TRAINERChanePasswordData', res.data);
          showToast('Success', `${res?.data?.message}!! Now Login `, 'success');
          navigation.replace('signin', {checkUser: data.checkUser});
        }
        if (res.error) {
          console.log('ChanePasswordDataError', res.error);
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }
    } catch (error: any) {
      showToast('Error', error?.message, 'danger');
    }
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <TouchableWithoutFeedback style={{flex: 1}}>
          <KeyboardAvoidingView>
            <Header
              text="Create New Password"
              textstyle={{color: 'white'}}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View style={{alignItems: 'center'}}>
              <Image
                source={Images.LockImage}
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
                Type a new password
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                gap: responsiveHeight(3),
                marginTop: responsiveWidth(7),
              }}>
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
                  <Text style={{color: '#908C8D'}}>New Password</Text>
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
                    style={{width: responsiveWidth(6)}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
                marginTop: responsiveWidth(50),
                marginBottom: responsiveWidth(5),
              }}>
              <Button
                text="Send"
                onPress={() => {
                  handleChangePassword();
                }}
                isloading={UserChangePassLoading || TrainerChangePassLoading}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </WrapperContainer>
  );
};
export default ConfirmNewPassword;

const styles = StyleSheet.create({});
