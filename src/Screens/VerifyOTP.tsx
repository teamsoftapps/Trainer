import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../Components/Wrapper'
import Header from '../Components/Header'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { FontFamily, Images } from '../utils/Images'
import { TouchableOpacity } from 'react-native'
import Button from '../Components/Button';
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from '@react-navigation/native'

const VerifyOTP = () => {
    const navigation = useNavigation()
    const [email, setemail] = useState("")
    console.log(email)
    return (
        <WrapperContainer >
            <ScrollView>
                <TouchableWithoutFeedback style={{ flex: 1 }}>
                    <KeyboardAvoidingView>

                        <Header text='Forgot Password' textstyle={{ color: "white" }} />
                        <View style={{ alignItems: "center" }}><Image source={Images.OTPImage} style={{ width: responsiveWidth(30) }} resizeMode='contain' /></View>
                        <View style={{ marginTop: responsiveWidth(7) }}>
                            <Text style={{ color: "grey", textAlign: "center", fontSize: responsiveFontSize(2.2) }}>Please enter your email address to recieve {'\n'} a verification code</Text>
                        </View>
                        <View style={{
                            alignItems: "center",
                            marginTop: responsiveWidth(7)
                        }}>

                            <OtpInput onTextChange={(text) => setemail(text)} numberOfDigits={4} theme={{ containerStyle: { width: responsiveWidth(70) }, pinCodeTextStyle: { color: "white" } }} />
                        </View>
                        <View style={{
                            alignItems: "center",
                            marginTop: responsiveWidth(7)
                        }}><Text style={{ color: "#9FED3A", textDecorationLine: "underline" }}>Resend code</Text></View>
                        <View style={{ alignItems: "center", marginTop: responsiveWidth(50), marginBottom: responsiveWidth(5) }}>
                            <Button text='Send' onPress={() => { navigation.navigate("ConfirmNewPassword") }} />
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