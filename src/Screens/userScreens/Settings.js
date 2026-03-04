import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../../utils/Images';
import Button from '../../Components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SignOut } from '../../store/Slices/AuthSlice';
import axiosBaseURL from '../../services/AxiosBaseURL';
import { showMessage } from 'react-native-flash-message';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state?.Auth?.data?.token);

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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await axiosBaseURL.delete('/user/deleteAccount', {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.data.status) {
                showMessage({
                  message: 'Account deleted successfully',
                  type: 'success',
                  backgroundColor: '#B2FF00',
                  color: '#000'
                });
                dispatch(SignOut());
              }
            } catch (error) {
              console.log('Error deleting account:', error);
              showMessage({
                message: 'Failed to delete account',
                type: 'danger'
              });
            }
          }
        }
      ]
    );
  };
  return (
    <WrapperContainer>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
          rightView={
            <Image
              source={Images.logo}
              style={{ height: responsiveHeight(5), width: responsiveWidth(10) }}
            />
          }
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
        <View style={{ paddingHorizontal: responsiveScreenWidth(8) }}>
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
              navigation.navigate('ChangePassword');
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#2E2E2E',
              paddingVertical: responsiveHeight(2.5),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <Image
                source={Images.lock}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{ color: 'white', fontSize: responsiveFontSize(2.4) }}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <Image
                source={Images.bell}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{ color: 'white', fontSize: responsiveFontSize(2.4) }}>
                Notifications
              </Text>
            </View>
            <Image source={Images.rightarrow} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Linking.openURL(
                'https://www.termsfeed.com/live/f2f3da63-7737-4d15-b065-d877869ba22d',
              );
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#2E2E2E',
              paddingVertical: responsiveHeight(2.5),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <Image
                source={Images.privacy}
                style={{
                  width: responsiveScreenWidth(10),
                  height: responsiveScreenWidth(10),
                }}
              />
              <Text style={{ color: 'white', fontSize: responsiveFontSize(2.4) }}>
                Privacy Policy
              </Text>
            </View>
            <Image source={Images.rightarrow} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#2E2E2E',
              paddingVertical: responsiveHeight(2.5),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <Ionicons name="trash-outline" size={responsiveScreenWidth(8)} color="#FF3B30" />
              <Text style={{ color: '#FF3B30', fontSize: responsiveFontSize(2.4) }}>
                Delete Account
              </Text>
            </View>
            <Image source={Images.rightarrow} resizeMode="contain" tintColor="#FF3B30" />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', marginTop: responsiveHeight(5) }}>
          <Button
            text="Sign Out"
            textstyle={{ fontSize: responsiveFontSize(2.5) }}
            onPress={handleSignout}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({});
