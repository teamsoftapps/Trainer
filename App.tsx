<<<<<<< Updated upstream
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Text>App</Text>
      <Text>OK HOW ARE U</Text>
    </View>
  );
=======
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MMKV} from 'react-native-mmkv';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './src/Screens/Home';
import AuthStack from './src/Navigations/AuthStack';
const App = () => {
  const storage = new MMKV();
  const Stack = createNativeStackNavigator();
  return <NavigationContainer>{true && <AuthStack />}</NavigationContainer>;
>>>>>>> Stashed changes
};

export default App;

const styles = StyleSheet.create({});
