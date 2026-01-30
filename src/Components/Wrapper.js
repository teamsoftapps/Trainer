import {StyleSheet, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const WrapperContainer = ({
  style = {},
  children,
  statusbackgroundColor = '#181818',
}) => {
  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={statusbackgroundColor}
      />

      <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
});
