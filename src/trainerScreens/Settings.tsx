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
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import Button from '../Components/Button';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {SignOut} from '../store/Slices/AuthSlice';
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
  };
  return (
    <WrapperContainer>
      <ScrollView>
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
              navigation.navigate('EditProfile');
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
                source={Images.person}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
                Edit Profile
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ManagePlans');
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
                source={Images.managePlans}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
                Manage Plans
              </Text>
            </View>
            <Image source={Images.rightarrow} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginTop: responsiveHeight(5)}}>
          <Button
            text="Sign Out"
            textstyle={{fontSize: responsiveFontSize(2.5)}}
            onPress={handleSignout}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({});
