import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const Button = ({
  textstyle = {},
  containerstyles = {},
  text = 'Cancel',
  onPress = () => {},
  disabled = false,
  isloading = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      style={[styles.container, containerstyles]}
      onPress={onPress}>
      {isloading ? (
        <ActivityIndicator color={'#000'} size={responsiveHeight(5)} />
      ) : (
        <Text
          style={[
            {
              color: 'black',
              fontSize: responsiveFontSize(2),
              fontWeight: '600',
            },
            textstyle,
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9FED3A',
    borderRadius: responsiveScreenHeight(20),
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
