import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../../Components/Wrapper';
import {Images} from '../../utils/Images';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

const AddReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {trainerId, editMode, reviewData} = route.params || {};
  const authData = useSelector(state => state?.Auth?.data);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(editMode ? reviewData?.rating : 0);
  const [review, setReview] = useState(editMode ? reviewData?.reviewText : '');
  const [media, setMedia] = useState(
    editMode && reviewData?.mediaUrl
      ? {
          path: reviewData.mediaUrl,
          mime: reviewData.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
          isExisting: true,
        }
      : null,
  );
  const [previewModal, setPreviewModal] = useState(false);

  /* ===== OPEN PICKER ===== */
  const openPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'any', // image or video
    })
      .then(res => {
        setMedia(res);
      })
      .catch(err => console.log(err));
  };

  /* ===== RENDER STARS ===== */
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Text
          style={{
            fontSize: 35,
            marginRight: 8,
            color: star <= rating ? '#FFD700' : '#444',
          }}>
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      showMessage({
        message: 'Incomplete',
        description: 'Please add rating and review',
        type: 'danger',
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('reviewText', review);

      if (media && !media.isExisting) {
        formData.append('file', {
          uri: media.path,
          type: media.mime,
          name: `review-${Date.now()}`,
        });
      }

      if (editMode) {
        await axiosBaseURL.put(`/user/update/${reviewData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        showMessage({
          message: 'Updated',
          description: 'Review updated successfully',
          type: 'success',
        });
      } else {
        formData.append('trainerId', trainerId);

        const res = await axiosBaseURL.post('/user/addReview', formData, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('responce in review:', res);

        showMessage({
          message: 'Success',
          description: 'Review added successfully',
          type: 'success',
        });
      }

      navigation.goBack();
    } catch (error) {
      console.log('Erro::::::', error);
      showMessage({
        message: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer style={{backgroundColor: '#000'}}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Images.back} tintColor="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {editMode ? 'Edit Review' : 'Add Review'}
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* STARS */}
      <View style={styles.starRow}>{renderStars()}</View>

      {/* REVIEW INPUT */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Review</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your review..."
          placeholderTextColor="#666"
          value={review}
          onChangeText={setReview}
        />
      </View>

      {/* MEDIA PICKER */}
      <TouchableOpacity style={styles.mediaBox} onPress={openPicker}>
        {media ? (
          <>
            {media.mime?.includes('video') ? (
              <Video
                source={{uri: media.path}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
                paused
              />
            ) : (
              <Image
                source={{uri: media.path}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            )}

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setMedia(null)}>
              <Text style={{color: '#fff'}}>✕</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{color: '#aaa', fontSize: 16}}>
            + Select Image or Video
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitBtn, {opacity: loading ? 0.7 : 1}]}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.submitText}>
            {editMode ? 'Update' : 'Submit'}
          </Text>
        )}
      </TouchableOpacity>

      {/* FULL SCREEN PREVIEW */}
      <Modal visible={previewModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPreviewModal(false)}>
            <Text style={{color: '#fff', fontSize: 18}}>✕</Text>
          </TouchableOpacity>

          {media?.mime?.includes('video') ? (
            <Video
              source={{uri: media.path}}
              style={styles.fullMedia}
              controls
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{uri: media?.path}}
              style={styles.fullMedia}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),
  },

  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
  },

  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(5),
  },

  inputContainer: {
    marginTop: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
  },

  label: {
    color: '#ccc',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    padding: 15,
    minHeight: responsiveHeight(12),
    color: '#fff',
    textAlignVertical: 'top',
  },

  mediaBox: {
    marginTop: responsiveHeight(3),
    marginHorizontal: responsiveWidth(6),
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    height: responsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  submitBtn: {
    marginTop: responsiveHeight(5),
    marginHorizontal: responsiveWidth(6),
    backgroundColor: '#9FED3A',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  submitText: {
    color: '#000',
    fontWeight: '700',
    fontSize: responsiveFontSize(2),
  },

  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
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
});
