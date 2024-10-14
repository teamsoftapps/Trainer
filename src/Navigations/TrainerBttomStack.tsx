import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Images} from '../utils/Images';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

import TrainerHome from '../trainerScreens/TrainerHome';
import {useSelector} from 'react-redux';
import Profile from '../trainerScreens/Profile';
import Story from '../trainerScreens/Story';
import Booking from '../Screens/Booking';
import Favourite from '../trainerScreens/Favourite';
import Listing from '../trainerScreens/Listing';
import Sessions from '../trainerScreens/sessions';
import Earnings from '../trainerScreens/earnings';

const TrainerBttomStack = () => {
  const type = useSelector(state => state?.Auth?.data.type);
  console.log('type from bottom:', type);
  const Bottom = createBottomTabNavigator();
  return (
    <Bottom.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#000000',
        },
      }}>
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.home_filled : Images.home}
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
              }}
            />
          ),
        }}
        name={'TrainerHome'}
        component={TrainerHome}
      />
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused ? Images.sessions_filled : Images.sessions_outline
              }
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
              }}
            />
          ),
        }}
        name={'Sessions'}
        component={Sessions}
      />
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.story : Images.story}
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
              }}
            />
          ),
        }}
        name={'Story'}
        component={Story}
      />
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.wallet_filled : Images.wallet_outline}
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(4),
                width: responsiveScreenHeight(3.5),
              }}
            />
          ),
        }}
        name={'Earnings'}
        component={Earnings}
      />
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.profile_filled : Images.profile}
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
              }}
            />
          ),
        }}
        name={'Profile'}
        component={Profile}
      />
    </Bottom.Navigator>
  );
};

export default TrainerBttomStack;

const styles = StyleSheet.create({});
