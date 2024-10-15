import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import Button from '../../Components/Button';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {SignOut} from '../../store/Slices/AuthSlice';
import {showMessage} from 'react-native-flash-message';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSignout = async () => {
    let res = await Alert.alert('Info', 'Are you sure you want to Signout', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(SignOut());
        },
      },

      {
        text: 'No',
        onPress: () => {
          return;
        },
      },
    ]);
    console.log('REEE', res);
    // if(res){
    // showMessage({
    //   message: 'Info',
    //   description: 'User Sined Out',
    //   type: 'info',
    // })};
  };
  return (
    <WrapperContainer>
      {/* <ScrollView> */}
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View>
        <Text
          style={{
            color: 'white',
            fontFamily: FontFamily.Extra_Bold,
            fontSize: responsiveFontSize(3.3),
            marginLeft: responsiveScreenWidth(8),
          }}>
          Settings
        </Text>
      </View>
      <View style={{paddingHorizontal: responsiveScreenWidth(8)}}>
        <Text
          style={{
            fontSize: responsiveFontSize(2.4),
            color: 'white',
            marginTop: responsiveHeight(2),
          }}>
          Account
        </Text>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('ForgotPassword');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#2E2E2E',
            paddingVertical: responsiveHeight(2.5),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <Image
              source={Images.lock}
              style={{
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
              }}
            />
            <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
              Change Password
            </Text>
          </View>
          <Image source={Images.rightarrow} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notification');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#2E2E2E',
            paddingVertical: responsiveHeight(2.5),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <Image
              source={Images.bell}
              style={{
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
              }}
            />
            <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
              Notifications
            </Text>
          </View>
          <Image source={Images.rightarrow} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#2E2E2E',
            paddingVertical: responsiveHeight(2.5),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <Image
              source={Images.privacy}
              style={{
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
              }}
            />
            <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
              Privacy Settings
            </Text>
          </View>
          <Image source={Images.rightarrow} resizeMode="contain" />
        </TouchableOpacity>
        {/* <Text
            style={{
              fontSize: responsiveFontSize(2.4),
              color: 'white',
              marginTop: responsiveHeight(5),
            }}>
            More Options
          </Text> */}
        {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#2E2E2E',
              paddingVertical: responsiveHeight(2.5),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              <Image
                source={Images.language}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
                Languages
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Text
                style={{color: '#909090', fontSize: responsiveFontSize(2.4)}}>
                English
              </Text>
              <Image source={Images.rightarrow} resizeMode="contain" />
            </View>
          </TouchableOpacity> */}
        {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#2E2E2E',
              paddingVertical: responsiveHeight(2.5),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              <Image
                source={Images.currency}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
                Currency
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Text
                style={{color: '#909090', fontSize: responsiveFontSize(2.4)}}>
                $-USD
              </Text>
              <Image source={Images.rightarrow} resizeMode="contain" />
            </View>
          </TouchableOpacity> */}
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          // backgroundColor: 'red',
        }}>
        <Button
          containerstyles={{marginVertical: responsiveHeight(2)}}
          text="Sign Out"
          textstyle={{fontSize: responsiveFontSize(2.5)}}
          onPress={handleSignout}
        />
      </View>
      {/* </ScrollView> */}
    </WrapperContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({});
