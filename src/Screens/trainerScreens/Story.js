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
import React, { useCallback, useState } from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import { uploadStory } from '../../services/mediaService';
import { createThumbnail } from 'react-native-create-thumbnail';

import Icon from 'react-native-vector-icons/Ionicons';

const formats = [{ value: 'Story' }, { value: 'Post' }];

const Story = () => {
  const navigation = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState('Story');
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
        first: 50,
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
        showMessage({ message: 'Select Story or Post first', type: 'info' });
        return;
      }

      let thumbnailFile = null;

      if (mime?.includes('video')) {
        const thumb = await createThumbnail({ url: file.path });
        thumbnailFile = { path: thumb.path };
      }

      if (selectedIndex === 'Post') {
        navigation.navigate('PostCaptionScreen', {
          file,
          thumbnail: thumbnailFile,
        });
        return;
      }

      setLoading(true);
      setProgress(0);

      await uploadStory(file, thumbnailFile, setProgress);

      showMessage({ message: 'Story uploaded successfully!', type: 'success' });
      navigation.goBack();
    } catch (err) {
      console.log(err);
      showMessage({ message: 'Upload failed', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- */
  /* Picker */
  /* ---------------------------------- */
  const openCamera = async type => {
    try {
      let file;
      if (type === 'photo') {
        file = await ImageCropPicker.openCamera({
          mediaType: 'photo',
          cropping: true,
          compressImageQuality: 0.8,
        });
      } else {
        file = await ImageCropPicker.openCamera({
          mediaType: 'video',
        });
      }
      await handleUpload(file, file.mime);
    } catch (e) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        showMessage({ message: 'Camera error', type: 'danger' });
      }
    }
  };

  const openPicker = async type => {
    try {
      let file;
      if (type === 'photo') {
        file = await ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          compressImageQuality: 0.8,
        });
      } else {
        file = await ImageCropPicker.openPicker({
          mediaType: 'video',
        });
      }
      await handleUpload(file, file.mime);
    } catch (e) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        showMessage({ message: 'Gallery error', type: 'danger' });
      }
    }
  };

  return (
    <WrapperContainer>
      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.glassCard}>
            <ActivityIndicator size="large" color="#9FED3A" />
            <Text style={styles.uploadingText}>Uploading {selectedIndex}...</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressIndicator, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
        </View>
      )}

      {/* HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Media</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* QUICK ACTIONS */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openCamera('photo')}>
            <View style={styles.iconCircle}>
              <Icon name="camera" size={26} color="#9FED3A" />
            </View>
            <Text style={styles.actionLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => openPicker('video')}>
            <View style={[styles.iconCircle, { backgroundColor: '#252525' }]}>
              <Icon name="videocam" size={26} color="#9FED3A" />
            </View>
            <Text style={styles.actionLabel}>Videos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Gallery</Text>
        </View>

        <View style={styles.gridContainer}>
          {media.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                const uri = item.node.image.uri;
                const isVideo = item.node.type?.includes('video');
                handleUpload(
                  { path: uri, mime: isVideo ? 'video/mp4' : 'image/jpeg' },
                  isVideo ? 'video/mp4' : 'image/jpeg',
                );
              }}
              style={styles.gridItem}>
              <Image source={{ uri: item.node.image.uri }} style={styles.gridImage} />
              {item.node.type?.includes('video') && (
                <View style={styles.videoBadge}>
                  <Icon name="play" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM SELECTOR */}
      <View style={styles.floatingTabs}>
        {formats.map(f => {
          const active = selectedIndex === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              onPress={() => setSelectedIndex(f.value)}
              style={[styles.tabItem, active && styles.tabItemActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {f.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </WrapperContainer>
  );
};

export default Story;

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
  },
  iconSm: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  iconMd: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#9FED3A',
  },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 15,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1b1b1b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '600',
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
  },
  gridItem: {
    width: responsiveWidth(33.3) - 2,
    height: responsiveWidth(40),
    margin: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 6,
  },
  badgeIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },

  floatingTabs: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#151515',
    padding: 6,
    borderRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  tabItem: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  tabItemActive: {
    backgroundColor: '#9FED3A',
  },
  tabText: {
    color: '#777',
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#000',
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '80%',
    backgroundColor: '#1b1b1b',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  uploadingText: {
    color: '#9FED3A',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 20,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 4,
    marginTop: 25,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#9FED3A',
    borderRadius: 4,
  },
  progressPercent: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
});
