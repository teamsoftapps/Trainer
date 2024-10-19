import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';

const TrainerHeader = ({
  text = '',
  style = {},
  textStyle = {},
  onPress = () => {},
  rightView = null,
}) => {
  return (
    <View style={{...styles.container, ...style}}>
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Image source={Images.back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
        </View>
      </View>
      {rightView && <TouchableOpacity>{rightView}</TouchableOpacity>}
    </View>
  );
};

export default TrainerHeader;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(8),
    flexDirection: 'row',
    marginVertical: responsiveHeight(1.3),
    justifyContent: 'space-between',
  },
  backIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.9,
  },
  textStyle: {
    fontSize: responsiveFontSize(3.3),
    color: '#fff',
    fontWeight: '600',
    marginTop: responsiveHeight(1.4),
  },
});
