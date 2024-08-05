import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigations/AuthStack';
import MainStack from './src/Navigations/MainStack';
import {useSelector} from 'react-redux';
const App = () => {
  const authData = useSelector(state => state.Auth.data);
  return (
    <NavigationContainer>
      {true ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
