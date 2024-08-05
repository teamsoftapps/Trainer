import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import ButtonComp from '../Components/ButtonComp';
import {useNavigation} from '@react-navigation/native';

const CompleteProfile = () => {
  const [firstname, setfirstname] = useState('');
  const [secondname, setsecondname] = useState('');
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const navigation = useNavigation();
  return (
    <WrapperContainer>
      <ScrollView>
        <View
          style={{
            width: responsiveScreenWidth(90),
            alignSelf: 'center',
          }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
              Complete Your Profile
            </Text>
            <Text style={{color: 'grey', fontSize: responsiveFontSize(2)}}>
              Skip
            </Text>
          </View>
          <Text style={{color: 'white', marginTop: responsiveHeight(3)}}>
            Profile picture
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveWidth(7),
              marginTop: responsiveHeight(1),
            }}>
            <Image source={Images.placeholder} style={{}} />
            <View style={{flex: 1, justifyContent: 'space-around'}}>
              <Text
                style={{
                  color: '#9FED3A',
                  fontSize: responsiveScreenFontSize(2),
                }}>
                Upload your photo
              </Text>
              <Text
                style={{fontSize: responsiveScreenFontSize(2), color: 'white'}}>
                Upload a high-quality image
              </Text>
            </View>
          </View>
          <View
            style={{
              gap: responsiveHeight(2.5),
              marginTop: responsiveHeight(2),
            }}>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>First Name</Text>
              <TextInput
                value={firstname}
                onChangeText={setfirstname}
                placeholder="Enter First Name"
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                value={secondname}
                onChangeText={setsecondname}
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View>
              <Text style={{color: 'white', marginBottom: responsiveHeight(1)}}>
                Bio
              </Text>
              <View
                style={{
                  paddingHorizontal: responsiveWidth(3),
                  paddingVertical: responsiveWidth(1),
                  borderWidth: 0.5,
                  borderColor: '#908C8D',
                  borderRadius: 10,
                  height: responsiveHeight(20),
                }}>
                <TextInput
                  placeholder="A brief introduction about yourself and your training philosophy"
                  onChangeText={setBio}
                  value={Bio}
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(1.5),
                    height: Bio.length == 0 ? responsiveHeight(7) : 'auto',
                  }}
                  multiline
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>
          </View>
          <ButtonComp
            mainStyle={{marginTop: responsiveHeight(5)}}
            text="Next"
            onPress={() => {
              navigation.navigate('Membership');
            }}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({});
