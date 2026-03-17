import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Video from 'react-native-video';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
const AllUploadsScreen = ({route, navigation}) => {
  const {uploads, profileImage, fullName, fitnessPreference, experience} =
    route.params;

  const [filter, setFilter] = useState('Photos');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredUploads =
    filter === 'Photos'
      ? uploads.filter(item => item.type === 'image')
      : uploads.filter(item => item.type === 'video');

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <Image
        source={{
          uri: item.type === 'video' ? item.thumbnail || item.url : item.url,
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
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>My Media</Text>

        <View style={{width: 24}} />
      </View>
      {/* ===== PROFILE HEADER ===== */}
      <View style={styles.header}>
        <Image
          source={
            profileImage
              ? {uri: profileImage}
              : require('../../assets/Images/PlaceholderImage.png')
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>{fullName}</Text>

        <Text style={styles.sub}>
          {fitnessPreference} · {experience}
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
      <FlatList
        data={filteredUploads}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
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

      {/* LONG PREVIEW MODAL */}
      <Modal
        visible={!!selectedItem}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              onPress={() => setSelectedItem(null)}
              style={styles.previewBack}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.previewMediaBox}>
            {selectedItem?.type === 'video' ? (
              <Video
                source={{uri: selectedItem.url}}
                style={styles.previewMedia}
                resizeMode="contain"
                controls={true}
                repeat={true}
              />
            ) : (
              <Image
                source={{uri: selectedItem?.url}}
                style={styles.previewMedia}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default AllUploadsScreen;

const styles = StyleSheet.create({
  /* ===== HEADER ===== */
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
    fontSize: responsiveFontSize(2.5),
    marginTop: 10,
    fontWeight: '700',
    width: responsiveWidth(60),
    textAlign: 'center',
  },

  sub: {
    color: '#9FED3A',
    marginTop: 4,
    fontSize: responsiveFontSize(1.8),
  },

  /* ===== FILTER ===== */
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

  /* ===== GRID ===== */
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
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  previewBack: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  previewMediaBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
  },
});
