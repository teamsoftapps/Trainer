import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

const Button = ({
  textstyle = {},
  containerstyles = {},
  text = 'Cancel',
  onPress = () => { },
  disabled=false
}) => {
  return (
    <TouchableOpacity disabled={disabled} style={[styles.container, containerstyles]} onPress={onPress}>
      <Text
        style={[
          {color: 'black', fontSize: responsiveFontSize(2), fontWeight: '600'},
          textstyle,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9FED3A',
    borderRadius: responsiveScreenHeight(20),
    width: '90%',
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
