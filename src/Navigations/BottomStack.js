import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

import Home from '../Screens/userScreens/Home';
import Favourites from '../Screens/userScreens/Favourites';
import Profile from '../Screens/userScreens/Profile';
import SearchTrainer from '../Screens/userScreens/SearchTrainer';
import Booking from '../Screens/userScreens/Booking';
import {Images} from '../utils/Images';

const Bottom = createBottomTabNavigator();

const BottomStack = () => {
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
        name="Home"
        component={Home}
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
        name="Booking"
        component={Booking}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.message_filled : Images.message}
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
        name="SearchTrainer"
        component={SearchTrainer}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.search_filled : Images.search}
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
        name="Favourites"
        component={Favourites}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? Images.heart_filled : Images.heart}
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

export default BottomStack;

const styles = StyleSheet.create({});
