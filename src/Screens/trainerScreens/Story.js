// import {
//   FlatList,
//   PermissionsAndroid,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useCallback, useState} from 'react';
// import WrapperContainer from '../../Components/Wrapper';
// import {Image} from 'react-native';
// import {Images} from '../../utils/Images';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import {showMessage} from 'react-native-flash-message';
// import {uploadStory} from '../../services/mediaService';
// import CreateThumbnail from 'react-native-create-thumbnail';

// const formats = [{value: 'Story'}, {value: 'Post'}];

// const Story = () => {
//   const navigation = useNavigation();

//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [media, setMedia] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ------------------------------------------------ */
//   /* Permission */
//   /* ------------------------------------------------ */
//   const requestPermission = async () => {
//     if (Platform.OS === 'ios') return true;

//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//     );

//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   };

//   /* ------------------------------------------------ */
//   /* Fetch Gallery */
//   /* ------------------------------------------------ */
//   const getMedia = async () => {
//     try {
//       const ok = await requestPermission();
//       if (!ok) return;

//       const res = await CameraRoll.getPhotos({
//         first: 30,
//         assetType: 'All',
//       });

//       setMedia(res.edges);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       getMedia();
//     }, []),
//   );

//   /* ------------------------------------------------ */
//   /* MAIN UPLOAD HANDLER (single source of truth) */
//   /* ------------------------------------------------ */
//   const handleUpload = async (file, mime) => {
//     try {
//       if (!selectedIndex) {
//         showMessage({message: 'Select Story or Post first', type: 'info'});
//         return;
//       }

//       let thumbnailFile = null;

//       // generate thumbnail for ANY video
//       if (mime?.includes('video')) {
//         const thumb = await createThumbnail({url: file.path});
//         thumbnailFile = {path: thumb.path};
//       }

//       // POST → go caption screen
//       if (selectedIndex === 'Post') {
//         navigation.navigate('PostCaptionScreen', {
//           file,
//           thumbnail: thumbnailFile,
//         });
//         return;
//       }

//       // STORY → upload directly
//       setLoading(true);

//       await uploadStory(file, thumbnailFile);

//       showMessage({message: 'Story uploaded 🚀', type: 'success'});
//       navigation.goBack();
//     } catch (err) {
//       console.log(err);
//       showMessage({message: 'Upload failed', type: 'danger'});
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------------------------------------ */
//   /* Picker */
//   /* ------------------------------------------------ */
//   const openPicker = async type => {
//     try {
//       let file;

//       if (type === 'photo') {
//         file = await ImageCropPicker.openPicker({
//           mediaType: 'photo',
//           cropping: true,
//           compressImageQuality: 0.7,
//         });
//       } else {
//         file = await ImageCropPicker.openPicker({
//           mediaType: 'video',
//         });
//       }

//       await handleUpload(file, file.mime);
//     } catch (e) {
//       if (e?.code !== 'E_PICKER_CANCELLED') {
//         showMessage({message: 'Error opening gallery', type: 'danger'});
//       }
//     }
//   };

//   /* ------------------------------------------------ */
//   /* Grid tap upload */
//   /* ------------------------------------------------ */
//   const onGridSelect = async item => {
//     const uri = item.node.image.uri;
//     const mime = item.node.type?.includes('video') ? 'video/mp4' : 'image/jpeg';

//     await handleUpload(
//       {
//         path: uri,
//         mime,
//       },
//       mime,
//     );
//   };

//   /* ------------------------------------------------ */
//   /* Render */
//   /* ------------------------------------------------ */
//   const renderFormats = ({item}) => {
//     const isSelected = selectedIndex === item.value;

//     return (
//       <TouchableOpacity
//         onPress={() => setSelectedIndex(item.value)}
//         style={{
//           height: responsiveHeight(4),
//           width: responsiveWidth(20),
//           borderRadius: 20,
//           backgroundColor: isSelected ? '#9FED3A' : '#333',
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginHorizontal: 6,
//         }}>
//         <Text style={{color: isSelected ? '#000' : '#fff'}}>{item.value}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const RenderedMedia = ({item}) => (
//     <TouchableOpacity onPress={() => onGridSelect(item)}>
//       <Image source={{uri: item.node.image.uri}} style={styles.image} />
//     </TouchableOpacity>
//   );

//   /* ------------------------------------------------ */

//   return (
//     <WrapperContainer style={{paddingHorizontal: 15}}>
//       {loading && (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#9FED3A" />
//         </View>
//       )}

//       <ScrollView>
//         <Text style={styles.header}>Add Media</Text>

//         {/* picker buttons */}
//         <View style={{flexDirection: 'row'}}>
//           <TouchableOpacity
//             style={styles.mediaBtn}
//             onPress={() => openPicker('photo')}>
//             <Image source={Images.imageoutline} />
//             <Text style={styles.btnText}>Photos</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.mediaBtn}
//             onPress={() => openPicker('video')}>
//             <Image source={Images.videoIcon} />
//             <Text style={styles.btnText}>Videos</Text>
//           </TouchableOpacity>
//         </View>

//         {/* grid */}
//         <FlatList
//           style={{marginTop: 15}}
//           numColumns={3}
//           data={media}
//           renderItem={RenderedMedia}
//           keyExtractor={(item, i) => i.toString()}
//         />
//       </ScrollView>

//       {/* story/post selector */}
//       <View style={styles.bottomBar}>
//         <FlatList horizontal data={formats} renderItem={renderFormats} />
//       </View>
//     </WrapperContainer>
//   );
// };

// export default Story;

// /* ------------------------------------------------ */

// const styles = StyleSheet.create({
//   header: {
//     color: '#fff',
//     fontSize: responsiveFontSize(2.5),
//     fontWeight: '600',
//     marginVertical: 20,
//   },
//   mediaBtn: {
//     backgroundColor: '#333',
//     height: 80,
//     width: 90,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   btnText: {
//     color: '#fff',
//     marginTop: 6,
//     fontSize: 12,
//   },
//   image: {
//     width: responsiveWidth(30),
//     height: responsiveHeight(15),
//     margin: 2,
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: '#222',
//     borderRadius: 30,
//     padding: 8,
//   },
//   loader: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
// });

import {
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {uploadStory} from '../../services/mediaService';
import {createThumbnail} from 'react-native-create-thumbnail';

const formats = [{value: 'Story'}, {value: 'Post'}];

const Story = () => {
  const navigation = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  /* ---------------------------------- */
  /* Permission */
  /* ---------------------------------- */
  const requestPermission = async () => {
    if (Platform.OS === 'ios') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  /* ---------------------------------- */
  /* Load Gallery */
  /* ---------------------------------- */
  const getMedia = async () => {
    try {
      const ok = await requestPermission();
      if (!ok) return;

      const res = await CameraRoll.getPhotos({
        first: 30,
        assetType: 'All',
      });

      setMedia(res.edges);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMedia();
    }, []),
  );

  /* ---------------------------------- */
  /* Main Upload Handler */
  /* ---------------------------------- */
  const handleUpload = async (file, mime) => {
    try {
      if (!selectedIndex) {
        showMessage({message: 'Select Story or Post first', type: 'info'});
        return;
      }

      let thumbnailFile = null;

      if (mime?.includes('video')) {
        const thumb = await createThumbnail({url: file.path});
        thumbnailFile = {path: thumb.path};
      }

      // POST → caption screen
      if (selectedIndex === 'Post') {
        navigation.navigate('PostCaptionScreen', {
          file,
          thumbnail: thumbnailFile,
        });
        return;
      }

      // STORY → upload directly
      setLoading(true);

      // await uploadStory(file, thumbnailFile);
      await uploadStory(file, thumbnailFile, setProgress);

      showMessage({message: 'Story uploaded 🚀', type: 'success'});
      navigation.goBack();
    } catch (err) {
      console.log(err);
      showMessage({message: 'Upload failed', type: 'danger'});
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- */
  /* Picker */
  /* ---------------------------------- */
  const openPicker = async type => {
    try {
      let file;

      if (type === 'photo') {
        file = await ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          compressImageQuality: 0.7,
        });
      } else {
        file = await ImageCropPicker.openPicker({
          mediaType: 'video',
        });
      }

      await handleUpload(file, file.mime);
    } catch (e) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        showMessage({message: 'Error opening gallery', type: 'danger'});
      }
    }
  };

  /* ---------------------------------- */
  /* Grid Tap */
  /* ---------------------------------- */
  const onGridSelect = async item => {
    const uri = item.node.image.uri;
    const isVideo = item.node.type?.includes('video');

    await handleUpload(
      {
        path: uri,
        mime: isVideo ? 'video/mp4' : 'image/jpeg',
      },
      isVideo ? 'video/mp4' : 'image/jpeg',
    );
  };

  /* ---------------------------------- */

  const renderFormats = ({item}) => {
    const isSelected = selectedIndex === item.value;

    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(item.value)}
        style={{
          backgroundColor: isSelected ? '#9FED3A' : '#333',
          paddingHorizontal: 20,
          paddingVertical: 6,
          borderRadius: 20,
          marginHorizontal: 6,
        }}>
        <Text style={{color: isSelected ? '#000' : '#fff'}}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const RenderedMedia = ({item}) => (
    <TouchableOpacity onPress={() => onGridSelect(item)}>
      <Image source={{uri: item.node.image.uri}} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <WrapperContainer style={{paddingHorizontal: 15}}>
      {loading && (
        <View style={styles.loader}>
          <View style={styles.progressCard}>
            <Text style={styles.uploadText}>Uploading {selectedIndex}...</Text>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: `${progress}%`}]} />
            </View>

            <Text style={styles.percent}>{progress}%</Text>
          </View>
        </View>
      )}

      <ScrollView>
        <Text style={styles.header}>Add Media</Text>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => openPicker('photo')}>
            <Text style={styles.btnText}>Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => openPicker('video')}>
            <Text style={styles.btnText}>Videos</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          numColumns={3}
          data={media}
          renderItem={RenderedMedia}
          keyExtractor={(item, i) => i.toString()}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <FlatList horizontal data={formats} renderItem={renderFormats} />
      </View>
    </WrapperContainer>
  );
};

export default Story;

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    marginVertical: 20,
  },
  mediaBtn: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  btnText: {
    color: '#fff',
  },
  image: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    margin: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  progressCard: {
    backgroundColor: '#1b1b1b',
    padding: 25,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },

  uploadText: {
    color: '#9FED3A',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },

  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#9FED3A',
  },

  percent: {
    color: '#fff',
    marginTop: 12,
  },
});
