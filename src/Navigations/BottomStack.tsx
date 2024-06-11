import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationStrings from './NavigationStrings';
import Home from '../Screens/Home';
import Message from '../Screens/Message';
import Search from '../Screens/Search';
import Favourites from '../Screens/Favourites';
import Profile from '../Screens/Profile';

const BottomStack = () => {
  const Bottom = createBottomTabNavigator();
  return (
    <Bottom.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Bottom.Screen name={NavigationStrings.HOME} component={Home} />
      <Bottom.Screen name={NavigationStrings.MESSAGE} component={Message} />
      <Bottom.Screen name={NavigationStrings.SEARCH} component={Search} />
      <Bottom.Screen
        name={NavigationStrings.FAVOURITES}
        component={Favourites}
      />
      <Bottom.Screen name={NavigationStrings.PROFILE} component={Profile} />
    </Bottom.Navigator>
  );
};

export default BottomStack;

const styles = StyleSheet.create({});
