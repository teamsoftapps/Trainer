import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/Navigations/AuthStack';
import MainStack from './src/Navigations/MainStack';
import { useSelector } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {
  const authData = useSelector(state => state.Auth.data);
  // console.log('first', authData);
  return (
    <StripeProvider publishableKey="pk_test_51MhKy0E1gqTY55tO7v4bGT0EifIECw1SHFcUx33Jgc7YF46jqRPNvDzGoSE1h9konayrzaNes7Jse3NGDLpawDql00rxdyk8Cw">
      <NavigationContainer>
        {authData ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </StripeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
