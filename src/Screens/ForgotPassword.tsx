import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../Components/Wrapper'
import Header from '../Components/Header'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { FontFamily, Images } from '../utils/Images'
import { TouchableOpacity } from 'react-native'
import Button from '../Components/Button'
import { useNavigation } from '@react-navigation/native'

const ForgotPassword = () => {
    const navigation = useNavigation()
    const [email, setemail] = useState("")
    return (
        <WrapperContainer >
            <ScrollView>
                <TouchableWithoutFeedback style={{ flex: 1 }}>
                    <KeyboardAvoidingView>

                        <Header text='Forgot Password' textstyle={{ color: "white" }} />
                        <View style={{ alignItems: "center" }}><Image source={Images.LockImage} style={{ width: responsiveWidth(30) }} resizeMode='contain' /></View>
                        <View style={{ marginTop: responsiveWidth(7) }}>
                            <Text style={{ color: "grey", textAlign: "center", fontSize: responsiveFontSize(2.2) }}>Please enter your email address to recieve {'\n'} a verification code</Text>
                        </View>
                        <View style={{
                            alignItems: "center",

                            marginTop: responsiveWidth(7)
                        }}>
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
                                    <Text style={{ color: '#908C8D' }}>Email</Text>
                                    <TextInput

                                        placeholder="Enter email"
                                        value={email || undefined}
                                        onChangeText={setemail}
                                        style={{
                                            padding: 0,
                                            fontFamily: FontFamily.Semi_Bold,
                                            color: 'white',
                                            fontSize: responsiveFontSize(2),
                                            width: responsiveWidth(68),
                                            height: responsiveHeight(3),
                                        }}
                                        numberOfLines={1}
                                        placeholderTextColor={'white'}
                                    />
                                </View>
                            </View>
                        </View>




                        <View style={{ alignItems: "center", marginTop: responsiveWidth(50), marginBottom: responsiveWidth(5) }}>
                            <Button text='Send' onPress={() => { navigation.navigate("VerifyOTP") }} />
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </WrapperContainer>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({})