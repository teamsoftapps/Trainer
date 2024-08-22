import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WrapperContainer from '../Components/Wrapper'
import Header from '../Components/Header'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { FontFamily, Images } from '../utils/Images'
import { TouchableOpacity } from 'react-native'
import Button from '../Components/Button';
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import axiosBaseURL from '../utils/AxiosBaseURL'
import { useSelector } from 'react-redux'

const VerifyOTP = ({ route }) => {
    const navigation = useNavigation()
    const { data } = route.params;
    const [isDisabled, setIsDisabled] = useState(false);
    const [code, setcode] = useState("")
    const authData = useSelector(state => state.Auth.data);
    useEffect(() => {
        showMessage({
            message: 'OTP sent',
            description: "Please check your email",
            type: 'success',
        });


    }, [])

    const ResendOTPFunction = () => {
        axiosBaseURL
            .post('/trainer/forgetPassword', {
                email: data,
            })
            .then(response => {
                showMessage({
                    message: 'OTP sent',
                    description: "Please check your email",
                    type: 'success',
                });
                setIsDisabled(true);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 60000);
            })
            .catch(error => {
                showMessage({
                    message: 'Incorrect Email',
                    description: "Please enter correct email",
                    type: 'danger',
                });

            });
    }
    const VerifyOTPFunction = () => {
        axiosBaseURL
            .post('/trainer/VerifyOTP', {
                token: authData,
                resetPasswordVerificationCode: code
            })
            .then(response => {
                console.log(response.data.ID)
                navigation.navigate("ConfirmNewPassword", { data: response.data.ID })
            })
            .catch(error => {
                showMessage({
                    message: 'Incorrect OTP',
                    description: "Please enter correct OTP",
                    type: 'danger',
                });
                console.log(error)

            });
    }
    return (
        <WrapperContainer >
            <ScrollView>
                <TouchableWithoutFeedback style={{ flex: 1 }}>
                    <KeyboardAvoidingView>

                        <Header text='Verify OTP' textstyle={{ color: "white" }} onPress={() => { navigation.goBack() }} />
                        <View style={{ alignItems: "center" }}><Image source={Images.OTPImage} style={{ width: responsiveWidth(30) }} resizeMode='contain' /></View>
                        <View style={{ marginTop: responsiveWidth(7) }}>
                            <Text style={{ color: "grey", textAlign: "center", fontSize: responsiveFontSize(2.2) }}>Please enter your email address to recieve {'\n'} a verification code</Text>
                        </View>
                        <View style={{
                            alignItems: "center",
                            marginTop: responsiveWidth(7)
                        }}>

                            <OtpInput onTextChange={(text) => setcode(text)} numberOfDigits={4} theme={{ containerStyle: { width: responsiveWidth(70) }, pinCodeTextStyle: { color: "white" } }} />
                        </View>
                        <View style={{
                            alignItems: "center",
                            marginTop: responsiveWidth(7),
                        }}>
                            <TouchableOpacity disabled={isDisabled} onPress={() => { ResendOTPFunction() }}>
                                <Text style={{ color: isDisabled ? "grey" : "#9FED3A", textDecorationLine: "underline" }}>Resend code</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center", marginTop: responsiveWidth(50), marginBottom: responsiveWidth(5) }}>
                            <Button text='Send' onPress={() => { VerifyOTPFunction() }} />
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </WrapperContainer>
    )
}

export default VerifyOTP

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})