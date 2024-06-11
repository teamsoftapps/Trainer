import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Images} from '../utils/Images';

const InitialScreen = () => {
  return (
    <ImageBackground
      source={Images.primary}
      style={{flex: 1}}></ImageBackground>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({});
