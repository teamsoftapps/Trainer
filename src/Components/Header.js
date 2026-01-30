import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';

const Header = ({
  text = '',
  style = {},
  textstyle = {},
  onPress = () => {},
  rightView = null,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={Images.back}
          style={{
            width: responsiveWidth(6),
            height: responsiveWidth(6),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>

      <View style={{flex: 0.9}}>
        <Text style={[styles.textstyle, textstyle]}>{text}</Text>
      </View>

      {rightView ? <TouchableOpacity>{rightView}</TouchableOpacity> : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textstyle: {
    fontSize: responsiveFontSize(2.5),
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
  },
});
