import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';

import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {FontFamily, Images} from '../../utils/Images';
import {useDispatch, useSelector} from 'react-redux';
import {useChangePasswordMutation} from '../../store/Apis/userAuth';
import {useTrainerChangePassMutation} from '../../store/Apis/trainerAuth';
import useToast from '../../Hooks/Toast';

const ConfirmNewPassword = ({navigation, route}) => {
  const data = route.params;
  const dispatch = useDispatch();
  const authData = useSelector(state => state.Auth);

  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);
  const [passworddisabled] = useState(false);

  const [changePassword, {isLoading: UserChangePassLoading}] =
    useChangePasswordMutation();

  const [TrainerChangePass, {isLoading: TrainerChangePassLoading}] =
    useTrainerChangePassMutation();

  const {showToast} = useToast();

  const condition1 = password === confirmpassword && password !== '';

  const handleChangePassword = async () => {
    const payload = {
      data: {password},
      id: authData?.res_ID,
    };

    try {
      if (!condition1) {
        return showToast('Error', 'Field must not be empty', 'danger');
      }

      // USER
      if (data.checkUser === 'user') {
        const res = await changePassword(payload);

        if (res.data) {
          showToast('Success', `${res?.data?.message}!! Now Login`, 'success');
          navigation.replace('signin', {checkUser: data.checkUser});
        }

        if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }

      // TRAINER
      if (data.checkUser === 'trainer') {
        const res = await TrainerChangePass(payload);

        if (res.data) {
          showToast('Success', `${res?.data?.message}!! Now Login`, 'success');
          navigation.replace('signin', {checkUser: data.checkUser});
        }

        if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }
    } catch (error) {
      showToast('Error', error?.message, 'danger');
    }
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <TouchableWithoutFeedback style={{flex: 1}}>
          <KeyboardAvoidingView>
            <Header
              rightView={
                <Image
                  source={Images.logo}
                  style={{
                    height: responsiveHeight(5),
                    width: responsiveWidth(10),
                  }}
                />
              }
              text="Create New Password"
              textstyle={{color: 'white'}}
              onPress={() => navigation.goBack()}
            />

            <View style={{alignItems: 'center'}}>
              <Image
                source={Images.LockImage}
                style={{width: responsiveWidth(30)}}
                resizeMode="contain"
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                gap: responsiveHeight(3),
                marginTop: responsiveWidth(7),
              }}>
              {/* PASSWORD */}
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Enter Password"
                  secureTextEntry={secure}
                  value={password}
                  onChangeText={setpassword}
                  style={styles.input}
                  placeholderTextColor="white"
                />
                <TouchableOpacity onPress={() => setsecure(!secure)}>
                  <Image
                    source={secure ? Images.eye_off : Images.eye}
                    style={styles.eye}
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRM */}
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={secure2}
                  value={confirmpassword}
                  onChangeText={setconfirmpassword}
                  style={styles.input}
                  placeholderTextColor="white"
                />
                <TouchableOpacity onPress={() => setsecure2(!secure2)}>
                  <Image
                    source={secure2 ? Images.eye_off : Images.eye}
                    style={styles.eye}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{alignItems: 'center', marginTop: responsiveWidth(50)}}>
              <Button
                text="Send"
                onPress={handleChangePassword}
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

const styles = StyleSheet.create({
  inputBox: {
    width: responsiveWidth(85),
    borderWidth: 1,
    borderColor: '#908C8D',
    borderRadius: 17,
    paddingHorizontal: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    color: 'white',
    fontFamily: FontFamily.Semi_Bold,
  },
  eye: {
    width: responsiveWidth(6),
  },
});
