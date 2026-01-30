import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

import {Images} from '../utils/Images';
import Profile from '../Screens/trainerScreens/Profile';
import Story from '../Screens/trainerScreens/Story';
import Sessions from '../Screens/trainerScreens/sessions';
import Earnings from '../Screens/trainerScreens/earnings';
import CompletedTrainerHome from '../Screens/trainerScreens/trainerOld';

const Bottom = createBottomTabNavigator();

const TrainerBttomStack = () => {
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
        name="CompletedTrainerHome"
        component={CompletedTrainerHome}
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
      />

      <Bottom.Screen
        name="Sessions"
        component={Sessions}
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
      />

      <Bottom.Screen
        name="Story"
        component={Story}
        options={{
          tabBarIcon: () => (
            <Image
              source={Images.story}
              resizeMode="contain"
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
              }}
            />
          ),
        }}
      />

      <Bottom.Screen
        name="Earnings"
        component={Earnings}
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
      />

      <Bottom.Screen
        name="Profile"
        component={Profile}
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
      />
    </Bottom.Navigator>
  );
};

export default TrainerBttomStack;

const styles = StyleSheet.create({});
