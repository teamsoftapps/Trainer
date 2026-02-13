import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const AllReviewsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {reviews} = route.params;

  const [previewImage, setPreviewImage] = React.useState(null);

  return (
    <WrapperContainer style={{backgroundColor: '#000'}}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reviews</Text>
        <View style={{width: 22}} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item._id}
        contentContainerStyle={{padding: 20}}
        renderItem={({item}) => (
          <View style={styles.reviewCard}>
            <View style={styles.topRow}>
              <Image
                source={{
                  uri:
                    item.userId?.profileImage ||
                    'https://i.pravatar.cc/150?img=12',
                }}
                style={styles.avatar}
              />

              <View style={{flex: 1}}>
                <Text style={styles.name}>
                  {item.userId?.fullName || 'User'}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={star <= item.rating ? '#FFD700' : '#333'}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.reviewText}>{item.reviewText}</Text>

            {item.mediaUrl && (
              <TouchableOpacity onPress={() => setPreviewImage(item.mediaUrl)}>
                <Image
                  source={{uri: item.mediaUrl}}
                  style={styles.reviewImage}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* FULL SCREEN IMAGE MODAL */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.imageModal}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPreviewImage(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <Image
            source={{uri: previewImage}}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default AllReviewsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 12,
  },
  name: {
    color: '#fff',
    fontWeight: '600',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  reviewText: {
    color: '#ccc',
    marginTop: 12,
  },
  reviewImage: {
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },
  imageModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
