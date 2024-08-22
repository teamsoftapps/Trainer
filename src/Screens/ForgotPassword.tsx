import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../Components/Wrapper'
import Header from '../Components/Header'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { FontFamily, Images } from '../utils/Images'
import { TouchableOpacity } from 'react-native'
import Button from '../Components/Button'
import { useNavigation } from '@react-navigation/native'
import axiosBaseURL from '../utils/AxiosBaseURL'
import { showMessage } from 'react-native-flash-message'


const ForgotPassword = () => {
    const navigation = useNavigation()
    const [email, setemail] = useState("")
    const Onclick = () => {
        axiosBaseURL
            .post('/trainer/forgetPassword', {
                email: email,
            })
            .then(response => {
                navigation.navigate("VerifyOTP", { data: email })
            })
            .catch(error => {
                showMessage({
                    message: 'Incorrect Email',
                    description: "Please enter correct email",
                    type: 'danger',
                });
            });
    }
    return (
        <WrapperContainer >
            <ScrollView>
                <TouchableWithoutFeedback style={{ flex: 1 }}>
                    <KeyboardAvoidingView>

                        <Header text='Forgot Password' textstyle={{ color: "white" }} onPress={() => { navigation.goBack() }} />
                        <View style={{ alignItems: "center" }}><Image source={Images.LockImage} style={{ width: responsiveWidth(30) }} resizeMode='contain' /></View>
                        <View style={{ marginTop: responsiveWidth(7) }}>
                            <Text style={styles.text}>Please enter your email address to recieve {'\n'} a verification code</Text>
                        </View>
                        <View style={{
                            alignItems: "center",

                            marginTop: responsiveWidth(7)
                        }}>
                            <View
                                style={styles.emailView}>
                                <View>
                                    <Text style={{ color: '#908C8D' }}>Email</Text>
                                    <TextInput

                                        placeholder="Enter email"
                                        value={email || undefined}
                                        onChangeText={setemail}
                                        style={styles.Input}
                                        numberOfLines={1}
                                        placeholderTextColor={'white'}
                                    />
                                </View>
                            </View>
                        </View>




                        <View style={styles.button}>
                            <Button text='Send' onPress={() => { Onclick() }} />
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </WrapperContainer>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    text: { color: "grey", textAlign: "center", fontSize: responsiveFontSize(2.2) },
    emailView: {
        width: responsiveWidth(85),
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(2),
        borderWidth: 1,
        borderColor: '#908C8D',
        borderRadius: 17,
        flexDirection: 'row',
        alignItems: 'center',
    },
    Input: {
        padding: 0,
        fontFamily: FontFamily.Semi_Bold,
        color: 'white',
        fontSize: responsiveFontSize(2),
        width: responsiveWidth(68),
        height: responsiveHeight(3),
    },
    button: { alignItems: "center", marginTop: responsiveWidth(50), marginBottom: responsiveWidth(5) }
})