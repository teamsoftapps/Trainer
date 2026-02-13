// import React, {useMemo, useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Modal,
// } from 'react-native';
// import Video from 'react-native-video';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
// } from 'react-native-responsive-dimensions';
// import WrapperContainer from '../../Components/Wrapper';
// import {Images} from '../../utils/Images';

// const TrainerMediaScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {trainerData, posts} = route.params;

//   const [loading, setLoading] = useState(true);
//   const [mediaModal, setMediaModal] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);

//   const [activeTab, setActiveTab] = useState('photos'); // photos | videos

//   const photos = useMemo(() => posts.filter(p => p.type === 'image'), [posts]);

//   const videos = useMemo(() => posts.filter(p => p.type === 'video'), [posts]);

//   const dataToShow = activeTab === 'photos' ? photos : videos;

//   useEffect(() => {
//     if (posts) {
//       setLoading(false);
//     }
//   }, []);

//   const renderItem = ({item}) => {
//     const isVideo = item.type === 'video';

//     return (
//       <View style={styles.card}>
//         <Image
//           source={{
//             uri: isVideo ? item.thumbnail || item.mediaUrl : item.mediaUrl,
//           }}
//           style={styles.media}
//         />

//         {isVideo && (
//           <View style={styles.playOverlay}>
//             <Text style={styles.playIcon}>▶</Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <WrapperContainer style={{backgroundColor: '#000'}}>
//       {/* ===== HEADER ===== */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image source={Images.back} tintColor="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Watch Media</Text>

//         <View style={{width: 24}} />
//       </View>

//       {/* ===== PROFILE INFO ===== */}
//       <View style={styles.profileSection}>
//         <Image
//           source={{uri: trainerData?.profileImage}}
//           style={styles.avatar}
//         />

//         <Text style={styles.name}>{trainerData?.fullName}</Text>

//         <Text style={styles.subTitle}>
//           {trainerData?.Speciality?.[0]?.value} •{' '}
//           {trainerData?.experience || '7 Year Experience'}
//         </Text>
//       </View>

//       {/* ===== TOGGLE BUTTONS ===== */}
//       <View style={styles.toggleRow}>
//         <TouchableOpacity
//           onPress={() => setActiveTab('photos')}
//           style={[
//             styles.toggleBtn,
//             activeTab === 'photos' && styles.activeBtn,
//           ]}>
//           <Text
//             style={[
//               styles.toggleText,
//               activeTab === 'photos' && styles.activeText,
//             ]}>
//             Photos
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => setActiveTab('videos')}
//           style={[
//             styles.toggleBtn,
//             activeTab === 'videos' && styles.activeBtn,
//           ]}>
//           <Text
//             style={[
//               styles.toggleText,
//               activeTab === 'videos' && styles.activeText,
//             ]}>
//             Videos
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={{marginTop: 50}}>
//           <ActivityIndicator size="large" color="#9FED3A" />
//         </View>
//       ) : dataToShow.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>
//             {activeTab === 'photos'
//               ? 'No photos uploaded'
//               : 'No videos uploaded'}
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={dataToShow}
//           keyExtractor={item => item._id}
//           numColumns={2}
//           columnWrapperStyle={{
//             justifyContent: 'space-between',
//             paddingHorizontal: responsiveWidth(5),
//           }}
//           contentContainerStyle={{paddingBottom: 50}}
//           renderItem={({item}) => {
//             const isVideo = item.type === 'video';

//             return (
//               <TouchableOpacity
//                 style={styles.card}
//                 onPress={() => {
//                   setSelectedMedia(item);
//                   setMediaModal(true);
//                 }}>
//                 <Image
//                   source={{
//                     uri: isVideo
//                       ? item.thumbnail || item.mediaUrl
//                       : item.mediaUrl,
//                   }}
//                   style={styles.media}
//                 />

//                 {isVideo && (
//                   <View style={styles.playOverlay}>
//                     <Text style={styles.playIcon}>▶</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             );
//           }}
//         />
//       )}

//       <Modal visible={mediaModal} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <TouchableOpacity
//             style={styles.closeBtn}
//             onPress={() => setMediaModal(false)}>
//             <Text style={{color: '#fff', fontSize: 18}}>✕</Text>
//           </TouchableOpacity>

//           {selectedMedia?.type === 'video' ? (
//             <Video
//               source={{uri: selectedMedia.mediaUrl}}
//               style={styles.fullMedia}
//               controls
//               resizeMode="contain"
//             />
//           ) : (
//             <Image
//               source={{uri: selectedMedia?.mediaUrl}}
//               style={styles.fullMedia}
//               resizeMode="contain"
//             />
//           )}
//         </View>
//       </Modal>
//     </WrapperContainer>
//   );
// };

// export default TrainerMediaScreen;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: responsiveWidth(5),
//     marginTop: responsiveHeight(4),
//   },

//   headerTitle: {
//     color: '#fff',
//     fontSize: responsiveFontSize(2.2),
//     fontWeight: '700',
//   },

//   profileSection: {
//     alignItems: 'center',
//     marginTop: responsiveHeight(3),
//   },

//   avatar: {
//     width: responsiveWidth(25),
//     height: responsiveWidth(25),
//     borderRadius: 100,
//   },

//   name: {
//     color: '#fff',
//     fontSize: responsiveFontSize(2.6),
//     fontWeight: '700',
//     marginTop: 10,
//   },

//   subTitle: {
//     color: '#aaa',
//     marginTop: 5,
//   },

//   toggleRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: responsiveHeight(3),
//     gap: 15,
//   },

//   toggleBtn: {
//     backgroundColor: '#333',
//     paddingVertical: 12,
//     paddingHorizontal: 35,
//     borderRadius: 30,
//   },

//   activeBtn: {
//     backgroundColor: '#9FED3A',
//   },

//   toggleText: {
//     color: '#aaa',
//     fontWeight: '600',
//   },

//   activeText: {
//     color: '#000',
//   },

//   card: {
//     width: '48%',
//     marginBottom: 15,
//     borderRadius: 14,
//     overflow: 'hidden',
//     marginTop: responsiveHeight(2),
//   },

//   media: {
//     width: '100%',
//     height: 180,
//     borderRadius: 14,
//   },

//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   fullMedia: {
//     width: '100%',
//     height: '80%',
//   },

//   closeBtn: {
//     position: 'absolute',
//     top: 60,
//     right: 25,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 10,
//     borderRadius: 30,
//   },

//   playOverlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   playIcon: {
//     fontSize: 30,
//     color: '#fff',
//   },

//   playOverlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   playIcon: {
//     fontSize: 30,
//     color: '#fff',
//   },

//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: responsiveHeight(10),
//   },

//   emptyText: {
//     color: '#888',
//     fontSize: responsiveFontSize(2),
//   },
// });

import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

const TrainerMediaScreen = ({route, navigation}) => {
  const {trainerData, posts} = route.params;

  const [filter, setFilter] = useState('Photos');
  const [mediaModal, setMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filteredUploads = useMemo(() => {
    return filter === 'Photos'
      ? posts.filter(item => item.type === 'image')
      : posts.filter(item => item.type === 'video');
  }, [filter, posts]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedMedia(item);
        setMediaModal(true);
      }}>
      <Image
        source={{
          uri:
            item.type === 'video'
              ? item.thumbnail || item.mediaUrl
              : item.mediaUrl,
        }}
        style={styles.image}
      />

      {item.type === 'video' && (
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <WrapperContainer>
      {/* ===== TOP BAR ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Watch Media</Text>

        <View style={{width: 40}} />
      </View>

      {/* ===== PROFILE HEADER ===== */}
      <View style={styles.header}>
        <Image
          source={{uri: trainerData?.profileImage}}
          style={styles.avatar}
        />

        <Text style={styles.name}>{trainerData?.fullName}</Text>

        <Text style={styles.sub}>
          {trainerData?.fitnessPreference} ·{' '}
          {trainerData?.experience || '7 Year Experience'}
        </Text>
      </View>

      {/* ===== FILTER BUTTONS ===== */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'Photos' && styles.activeFilter]}
          onPress={() => setFilter('Photos')}>
          <Text
            style={{
              color: filter === 'Photos' ? '#000' : '#fff',
              fontWeight: '600',
            }}>
            Photos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === 'Videos' && styles.activeFilter]}
          onPress={() => setFilter('Videos')}>
          <Text
            style={{
              color: filter === 'Videos' ? '#000' : '#fff',
              fontWeight: '600',
            }}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== GRID ===== */}
      {filteredUploads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {filter === 'Photos' ? 'No photos uploaded' : 'No videos uploaded'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUploads}
          numColumns={2}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(5),
            paddingBottom: responsiveHeight(4),
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ===== MEDIA MODAL ===== */}
      <Modal visible={mediaModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setMediaModal(false)}>
            <Text style={{color: '#fff', fontSize: 18}}>✕</Text>
          </TouchableOpacity>

          {selectedMedia?.type === 'video' ? (
            <Video
              source={{uri: selectedMedia.mediaUrl}}
              style={styles.fullMedia}
              controls
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{uri: selectedMedia?.mediaUrl}}
              style={styles.fullMedia}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default TrainerMediaScreen;
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
  },

  backBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#1b1b1b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    fontWeight: '600',
  },

  header: {
    alignItems: 'center',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },

  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#9FED3A',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(2.7),
    marginTop: 10,
    fontWeight: '600',
  },

  sub: {
    color: '#9FED3A',
    marginTop: 4,
    fontSize: responsiveFontSize(1.8),
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: responsiveHeight(2),
  },

  filterBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },

  activeFilter: {
    backgroundColor: '#9FED3A',
  },

  card: {
    width: responsiveWidth(42),
    height: responsiveWidth(42),
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#222',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  playIcon: {
    color: '#fff',
    fontSize: 26,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullMedia: {
    width: '100%',
    height: '80%',
  },

  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 30,
  },

  emptyContainer: {
    marginTop: responsiveHeight(10),
    alignItems: 'center',
  },

  emptyText: {
    color: '#888',
    fontSize: responsiveFontSize(2),
  },
});
