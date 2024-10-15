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
import {useDispatch, useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import useToast from '../../Hooks/Toast';

const ChangePassword = ({route}) => {
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState('');
  const [Newpassword, setNewpassword] = useState('');
  const [confirmNewpassword, setConfirmNewpassword] = useState('');
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);
  const [passworddisabled, setpassworddisable] = useState(false);
  const authData = useSelector(state => state.Auth.data.data);
  const {showToast} = useToast();
  const navigation = useNavigation();

  const ChangePassword = async () => {
    try {
      const responce = await axiosBaseURL.post('/user/changePassword', {
        id: authData._id,
        oldPassword: oldPassword,
        newPassword: Newpassword,
        confirmNewPassword: confirmNewpassword,
      });
      if (responce.data) {
        showToast('Success', responce.data.message, 'success');
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : 'Something went wrong. Please try again.';
      showToast('Error', errorMessage, 'danger');
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
                Please enter your email address to recieve {'\n'} a verification
                code
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
                  <Text style={{color: '#908C8D'}}>Old Password</Text>
                  <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={secure}
                    value={oldPassword || undefined}
                    onChangeText={setOldPassword}
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
                  <Text style={{color: '#908C8D'}}>New Password</Text>
                  <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={secure}
                    value={Newpassword || undefined}
                    onChangeText={setNewpassword}
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
                  <Text style={{color: '#908C8D'}}>Confirm New Password</Text>
                  <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={secure2}
                    value={confirmNewpassword || undefined}
                    onChangeText={setConfirmNewpassword}
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
                  ChangePassword();
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </WrapperContainer>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
