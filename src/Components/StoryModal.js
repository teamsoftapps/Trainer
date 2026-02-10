import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import axiosBaseURL from '../services/AxiosBaseURL';

const {width, height} = Dimensions.get('window');
const STORY_DURATION = 5000;

const StoryModal = ({visible, stories = [], onClose}) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const paused = useRef(false);

  /* ================= PROGRESS ================= */

  const startProgress = () => {
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) next();
    });
  };

  /* ⭐ ONLY start AFTER loaded */
  useEffect(() => {
    if (visible && loaded) {
      startProgress();
    }
  }, [loaded, current, visible]);

  /* reset loader on story change */
  useEffect(() => {
    setLoaded(false);
  }, [current]);

  /* ================= NAVIGATION ================= */

  const next = () => {
    if (current < stories.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(prev => prev - 1);
    }
  };

  /* ================= HOLD TO PAUSE ================= */

  const onPressIn = () => {
    paused.current = true;
    progress.stopAnimation();
  };

  const onPressOut = () => {
    paused.current = false;
    if (loaded) startProgress();
  };

  /* ================= SEEN TRACKING ================= */

  const markSeen = async storyId => {
    try {
      await axiosBaseURL.post('/trainer/story/seen', {storyId});
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (stories[current]) {
      markSeen(stories[current].id);
    }
  }, [current]);

  /* ================= SWIPE DOWN CLOSE ================= */

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
    onPanResponderMove: (_, g) => {
      pan.setValue({x: 0, y: g.dy});
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) onClose();
      else {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!visible) return null;

  const story = stories[current];

  return (
    <Modal visible transparent animationType="fade">
      <Animated.View
        style={[styles.container, {transform: pan.getTranslateTransform()}]}
        {...panResponder.panHandlers}>
        {/* ===== Loader ===== */}
        {!loaded && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}

        {/* ===== Progress ===== */}
        <View style={styles.progressRow}>
          {stories.map((_, i) => (
            <View key={i} style={styles.progressBg}>
              {i === current && (
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              )}
              {i < current && (
                <View style={[styles.progressFill, {width: '100%'}]} />
              )}
            </View>
          ))}
        </View>

        {/* ===== MEDIA ===== */}
        {story.type === 'video' ? (
          <Video
            source={{uri: story.url}}
            style={styles.media}
            resizeMode="cover"
            onLoad={() => setLoaded(true)}
            paused={!loaded}
          />
        ) : (
          <FastImage
            source={{uri: story.url}}
            style={styles.media}
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* ===== TOUCH AREAS ===== */}
        <Pressable
          style={styles.left}
          onPress={prev}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
        <Pressable
          style={styles.right}
          onPress={next}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      </Animated.View>
    </Modal>
  );
};

export default StoryModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  media: {
    width,
    height,
  },

  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    zIndex: 20,
  },

  progressRow: {
    position: 'absolute',
    top: 50,
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    zIndex: 10,
  },

  progressBg: {
    flex: 1,
    height: 3,
    backgroundColor: '#555',
    marginHorizontal: 2,
    borderRadius: 3,
  },

  progressFill: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 3,
  },

  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },

  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
});
