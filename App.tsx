import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MMKV} from 'react-native-mmkv';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './src/Screens/Home';
import AuthStack from './src/Navigations/AuthStack';
import MainStack from './src/Navigations/MainStack';
const App = () => {
  const storage = new MMKV();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      {false ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
