import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import Favourites from '../Screens/Favourites';
import Profile from '../Screens/Profile';
import {Images} from '../utils/Images';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import Booking from '../Screens/Booking';
import SearchTrainer from '../Screens/SearchTrainer';
import TrainerHome from '../Screens/TrainerHome';
import {useSelector} from 'react-redux';

const BottomStack = () => {
  const type = useSelector(state => state.Auth.data.type);
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
      {type === 'trainer' ? (
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
      ) : (
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
          name={'Home'}
          component={Home}
        />
      )}

      <Bottom.Screen
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
        name={'Booking'}
        component={Booking}
      />
      <Bottom.Screen
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
        name={'SearchTrainer'}
        component={SearchTrainer}
      />
      <Bottom.Screen
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
        name={'Favourites'}
        component={Favourites}
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

export default BottomStack;

const styles = StyleSheet.create({});
