import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigations/AuthStack';
import MainStack from './src/Navigations/MainStack';
const App = () => {
  return (
    <NavigationContainer>
      {true ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
