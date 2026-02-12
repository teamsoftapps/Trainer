// // StoryViewer.jsx
// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import {Text} from 'react-native-svg';
// import Video from 'react-native-video';

// const {width, height} = Dimensions.get('window');

// const StoryViewer = ({route, navigation}) => {
//   const {user, onAllSeen, markStorySeen} = route.params;
//   const stories = user?.stories || [];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const progressAnims = useRef(
//     stories.map(() => new Animated.Value(0)),
//   ).current;

//   const currentStory = stories[currentIndex] || {};

//   // Mark current story as seen on backend
//   useEffect(() => {
//     if (currentStory?.story_id && typeof markStorySeen === 'function') {
//       markStorySeen(currentStory.story_id);
//     }
//   }, [currentIndex, currentStory, markStorySeen]);

//   // Progress animation
//   useEffect(() => {
//     if (paused) return;

//     const anim = progressAnims[currentIndex];
//     anim.setValue(0);

//     const duration = currentStory.story_type === 'video' ? 12000 : 5500;

//     Animated.timing(anim, {
//       toValue: 1,
//       duration,
//       useNativeDriver: false,
//     }).start(({finished}) => {
//       if (finished) {
//         goToNext();
//       }
//     });

//     return () => anim.stopAnimation();
//   }, [currentIndex, paused, currentStory]);

//   const goToNext = () => {
//     if (currentIndex >= stories.length - 1) {
//       onAllSeen?.();
//       navigation.goBack();
//       return;
//     }
//     setCurrentIndex(prev => prev + 1);
//   };

//   const goToPrev = () => {
//     if (currentIndex <= 0) {
//       navigation.goBack();
//       return;
//     }
//     setCurrentIndex(prev => prev - 1);
//   };

//   const togglePause = () => setPaused(p => !p);

//   const progressWidth = progressAnims[currentIndex].interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   return (
//     <View style={styles.container}>
//       {/* Progress bars */}
//       <View style={styles.progressContainer}>
//         {stories.map((_, i) => {
//           const isActive = i === currentIndex;
//           const isSeen = i < currentIndex;

//           return (
//             <View key={i} style={styles.progressBarBg}>
//               <Animated.View
//                 style={[
//                   styles.progressBarFill,
//                   {
//                     width: isActive ? progressWidth : isSeen ? '100%' : '0%',
//                     backgroundColor: isActive
//                       ? '#fff'
//                       : isSeen
//                         ? '#aaa'
//                         : '#555',
//                   },
//                 ]}
//               />
//             </View>
//           );
//         })}
//       </View>

//       {/* Media */}
//       {currentStory.story_type === 'video' ? (
//         <Video
//           source={{uri: currentStory.url}}
//           style={styles.media}
//           resizeMode="centre"
//           paused={paused}
//           repeat={false}
//           onEnd={goToNext}
//         />
//       ) : (
//         <Image
//           source={{uri: currentStory.story_image || currentStory.url}}
//           style={styles.media}
//           resizeMode="contain"
//         />
//       )}

//       {/* Tap zones */}
//       <View style={styles.touchAreas}>
//         <TouchableOpacity
//           style={styles.touchLeft}
//           onPress={goToPrev}
//           onLongPress={() => setPaused(true)}
//           onPressOut={() => setPaused(false)}
//         />
//         <TouchableOpacity
//           style={styles.touchRight}
//           onPress={goToNext}
//           onLongPress={() => setPaused(true)}
//           onPressOut={() => setPaused(false)}
//         />
//       </View>

//       {/* Close button */}
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => navigation.goBack()}>
//         <Text style={styles.closeText}>✕</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   media: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     paddingTop: 40,
//     zIndex: 10,
//   },
//   progressBarBg: {
//     flex: 1,
//     height: 4,
//     backgroundColor: '#333',
//     marginHorizontal: 2,
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: 2,
//   },
//   touchAreas: {
//     ...StyleSheet.absoluteFillObject,
//     flexDirection: 'row',
//     zIndex: 5,
//   },
//   touchLeft: {
//     flex: 1,
//   },
//   touchRight: {
//     flex: 1,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 20,
//   },
//   closeText: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
// });

// export default StoryViewer;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');

const StoryViewer = ({route, navigation}) => {
  const {user, onAllSeen, markStorySeen} = route.params;
  const stories = user?.stories || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const progressAnims = useRef(
    stories.map(() => new Animated.Value(0)),
  ).current;

  const currentStory = stories[currentIndex] || {};

  // Mark story as seen
  useEffect(() => {
    if (currentStory?.story_id && typeof markStorySeen === 'function') {
      markStorySeen(currentStory.story_id);
    }
  }, [currentIndex, currentStory, markStorySeen]);

  // Auto-progress animation
  useEffect(() => {
    if (paused || !stories.length) return;

    const anim = progressAnims[currentIndex];
    anim.setValue(0);

    const duration = currentStory.story_type === 'video' ? 15000 : 6000;

    Animated.timing(anim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) goToNext();
    });

    return () => anim.stopAnimation();
  }, [currentIndex, paused, currentStory, stories.length]);

  const goToNext = () => {
    if (currentIndex >= stories.length - 1) {
      onAllSeen?.();
      navigation.goBack();
      return;
    }
    setCurrentIndex(prev => prev + 1);
  };

  const goToPrev = () => {
    if (currentIndex <= 0) {
      navigation.goBack();
      return;
    }
    setCurrentIndex(prev => prev - 1);
  };

  // Progress width for current bar
  const progressWidth = progressAnims[currentIndex].interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Fake "posted time" — you can replace with real timestamp logic
  const postedTime = '20 min ago'; // or calculate from createdAt

  return (
    <View style={styles.container}>
      {/* Progress bars – very thin at top */}
      <View style={styles.progressWrapper}>
        {stories.map((_, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;

          return (
            <View key={i} style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: isActive
                      ? progressWidth
                      : isCompleted
                        ? '100%'
                        : '0%',
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Header – avatar + name + time + close */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{uri: user.user_image}} style={styles.headerAvatar} />
          <View style={styles.nameTime}>
            <Text style={styles.username}>{user.user_name}</Text>
            <Text style={styles.postedTime}>{postedTime}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Media – image or video */}
      {currentStory.story_type === 'video' ? (
        <Video
          source={{uri: currentStory.url}}
          style={styles.media}
          resizeMode="contain"
          paused={paused}
          repeat={false}
          onEnd={goToNext}
          playInBackground={false}
          playWhenInactive={false}
        />
      ) : (
        <Image
          source={{uri: currentStory.story_image || currentStory.url}}
          style={styles.media}
          resizeMode="contain"
        />
      )}

      {/* Tap zones for navigation */}
      <View style={styles.touchLayer}>
        <TouchableOpacity
          style={styles.touchLeft}
          onPress={goToPrev}
          onLongPress={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
        />
        <TouchableOpacity
          style={styles.touchRight}
          onPress={goToNext}
          onLongPress={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  progressWrapper: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 8,
    zIndex: 20,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameTime: {
    marginLeft: 12,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  postedTime: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },

  media: {
    ...StyleSheet.absoluteFillObject,
  },

  touchLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 10,
  },
  touchLeft: {
    flex: 1,
  },
  touchRight: {
    flex: 1,
  },
});

export default StoryViewer;
