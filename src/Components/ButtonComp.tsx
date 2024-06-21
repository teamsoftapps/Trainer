import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ButtonComp = ({text = '', mainStyle = {}, textstyle = {}}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{...styles.main, ...mainStyle}}>
      <Text style={{...styles.text, ...textstyle}}>{text || 'SignUp'}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  main: {
    height: responsiveHeight(7.5),
    borderRadius: responsiveWidth(8),
    backgroundColor: '#9fed3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
  },
});
