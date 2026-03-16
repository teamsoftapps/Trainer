import {StyleSheet, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const WrapperContainer = ({
  style = {},
  children,
  statusbackgroundColor = 'transparent',
  withSafeArea = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={statusbackgroundColor}
        translucent={!withSafeArea}
      />

      {withSafeArea ? (
        <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
      ) : (
        <View style={{flex: 1}}>{children}</View>
      )}
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
