import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ButtonComp from '../Components/ButtonComp';
import {FontFamily, Images} from '../utils/Images';
import WrapperContainer from '../Components/Wrapper';

const Signup = () => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');

  const [secure, setsecure] = useState(false);
  const [secure2, setsecure2] = useState(false);

  const [remember, setremember] = useState(false);
  return (
    <WrapperContainer>
      <ImageBackground
        resizeMode="cover"
        source={Images.bg}
        style={{height: responsiveHeight(100)}}>
        <View
          style={{
            alignItems: 'center',
            marginTop: responsiveHeight(6),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(4),
              fontFamily: FontFamily.Semi_Bold,
              marginBottom: responsiveHeight(2),
            }}>
            Sign Up
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2.5),
              fontFamily: FontFamily.Medium,
              marginBottom: responsiveHeight(2),
            }}>
            Create An Account
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
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{color: '#908C8D'}}>Full name</Text>
                <TextInput
                  placeholder="Enter name"
                  value={name || undefined}
                  onChangeText={setname}
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
              <Image
                source={Images.user}
                style={{
                  width: responsiveWidth(3.6),
                  height: responsiveWidth(5),
                }}
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
                <Text style={{color: '#908C8D'}}>Email</Text>
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

              <Image
                source={Images.email}
                style={{width: responsiveWidth(5)}}
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
                />
              </TouchableOpacity>
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
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(85),
              justifyContent: 'space-between',
              marginTop: responsiveHeight(3),
            }}>
            <View
              style={{
                width: responsiveWidth(40),
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveWidth(2),
                borderColor: '#908C8D',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: responsiveWidth(27)}}>
                <Text style={{color: '#908C8D'}}>Gender</Text>
                <Text
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    height: responsiveHeight(3),
                  }}>
                  Your Gender
                </Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={Images.dropdown}
                  style={{width: responsiveWidth(5)}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: responsiveWidth(40),
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveWidth(2),
                borderColor: '#908C8D',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: responsiveWidth(27)}}>
                <Text style={{color: '#908C8D'}}>Date of Birth</Text>
                <Text
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    width: responsiveWidth(67),
                    height: responsiveHeight(3),
                  }}>
                  DoB
                </Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={Images.calendar}
                  style={{width: responsiveWidth(4.5)}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(85),
              justifyContent: 'space-between',
              marginTop: responsiveHeight(3),
            }}>
            <View
              style={{
                width: responsiveWidth(40),
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveWidth(2),
                borderColor: '#908C8D',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: responsiveWidth(27)}}>
                <Text style={{color: '#908C8D'}}>Weight in lbs</Text>
                <Text
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    height: responsiveHeight(3),
                  }}>
                  Your weight
                </Text>
              </View>
            </View>
            <View
              style={{
                width: responsiveWidth(40),
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveWidth(2),
                borderColor: '#908C8D',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: responsiveWidth(27)}}>
                <Text style={{color: '#908C8D'}}>Height in ft</Text>
                <Text
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    width: responsiveWidth(67),
                    height: responsiveHeight(3),
                  }}>
                  Your height
                </Text>
              </View>
            </View>
          </View>
          <ButtonComp
            text="Sign Up"
            mainStyle={{
              width: responsiveWidth(85),
              marginTop: responsiveHeight(5),
            }}
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
              Already have an Account?{' '}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text
                style={{
                  color: '#9FED3A',
                  textDecorationLine: 'underline',
                  fontFamily: FontFamily.Extra_Bold,
                }}>
                Sign In!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </WrapperContainer>
  );
};

export default Signup;

const styles = StyleSheet.create({});
