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
import useToast from '../../Hooks/Toast';
import {useForgotPassUserMutation} from '../../store/Apis/userAuth';
import {useTrainerForgetPassMutation} from '../../store/Apis/trainerAuth';
import {useDispatch} from 'react-redux';
import {ForgetPasswordID, SaveEmail} from '../../store/Slices/AuthSlice';

const ForgotPassword = ({navigation, route}) => {
  const data = route.params;
  const reciveddata = data?.data?.checkUser;

  const [email, setemail] = useState('');
  const dispatch = useDispatch();
  const {showToast} = useToast();

  const [ForgotPassUser, {isLoading: userisLoading}] =
    useForgotPassUserMutation();

  const [TrainerForgetPass, {isLoading: trainerisLoading}] =
    useTrainerForgetPassMutation();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const Onclick = async () => {
    const payload = {email};

    try {
      if (!emailPattern.test(email)) {
        return showToast('Error', 'Enter a Valid Email', 'danger');
      }

      // USER
      if (reciveddata === 'user') {
        const res = await ForgotPassUser(payload);

        if (res.data) {
          showToast('Success', res?.data?.message, 'success');
          dispatch(ForgetPasswordID(res?.data?.data?.id));
          dispatch(SaveEmail(res?.data?.data?.email));
          navigation.navigate('VerifyOTP', {checkUser: reciveddata});
        }

        if (res.error) {
          showToast('Error', res?.error?.data?.message, 'danger');
        }
      }

      // TRAINER
      if (reciveddata === 'trainer') {
        const res = await TrainerForgetPass(payload);

        if (res.data) {
          showToast('Success', res?.data?.message, 'success');
          dispatch(ForgetPasswordID(res?.data?.data?.id));
          dispatch(SaveEmail(res?.data?.data?.email));
          navigation.navigate('VerifyOTP', {checkUser: reciveddata});
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
              text="Forgot Password"
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

            <View style={{marginTop: responsiveWidth(7)}}>
              <Text style={styles.text}>
                Please enter your email address to recieve {'\n'} a verification
                code
              </Text>
            </View>

            <View style={{alignItems: 'center', marginTop: responsiveWidth(7)}}>
              <View style={styles.emailView}>
                <TextInput
                  placeholder="Enter email"
                  value={email}
                  onChangeText={setemail}
                  style={styles.Input}
                  placeholderTextColor="white"
                />
              </View>
            </View>

            <View style={styles.button}>
              <Button
                text="Send"
                onPress={Onclick}
                isloading={userisLoading || trainerisLoading}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </WrapperContainer>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.2),
  },
  emailView: {
    width: responsiveWidth(85),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(2),
    borderWidth: 1,
    borderColor: '#908C8D',
    borderRadius: 17,
  },
  Input: {
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    height: responsiveHeight(3),
  },
  button: {
    alignItems: 'center',
    marginTop: responsiveWidth(50),
    marginBottom: responsiveWidth(5),
  },
});
