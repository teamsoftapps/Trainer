import { StyleSheet, Text, View, StatusBar, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WrapperContainerProps {
  style?: ViewStyle;
  children: ReactNode;
  statusbackgroundColor?: string;
}

const WrapperContainer: React.FC<WrapperContainerProps> = ({
  style = {},
  children,
  statusbackgroundColor = '#fff',
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={statusbackgroundColor}
      />
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
