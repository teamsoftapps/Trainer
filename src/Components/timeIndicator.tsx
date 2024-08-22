// components/TimerIndicator.js
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types'; // For type-checking
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const TimerIndicator = ({duration, onEnd}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: duration * 1000, // Convert seconds to milliseconds
      useNativeDriver: false,
    }).start(onEnd);
  }, [duration, onEnd, animatedValue]);

  const interpolateWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, {width: interpolateWidth}]} />
    </View>
  );
};

// TimerIndicator.propTypes = {
//   duration: PropTypes.number.isRequired,
//   onEnd:navigation.goBack(),
// };

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  line: {
    height: '100%',
    backgroundColor: 'white',
  },
});

export default TimerIndicator;
