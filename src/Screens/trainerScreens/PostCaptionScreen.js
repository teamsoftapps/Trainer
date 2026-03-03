import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { uploadPost } from '../../services/mediaService';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
const PostCaptionScreen = ({ route, navigation }) => {
  const { file, thumbnail } = route.params;

  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    try {
      setLoading(true);
      await uploadPost(file, caption, thumbnail, setProgress);
      showMessage({ message: 'Post uploaded successfully 🚀', type: 'success' });
      navigation.replace('TrainerBttomStack');
    } catch (err) {
      showMessage({ message: 'Error uploading post', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#9FED3A" />
          <Text style={styles.loadingText}>Uploading... {progress}%</Text>
        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleUpload} disabled={loading}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* IMAGE PREVIEW CARD */}
          <View style={styles.previewCard}>
            <Image source={{ uri: file.path }} style={styles.previewImage} />
            <View style={styles.imageOverlay} />
          </View>

          {/* CAPTION BOX */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Caption</Text>
            <TextInput
              placeholder="What's on your mind?..."
              placeholderTextColor="#666"
              value={caption}
              onChangeText={setCaption}
              multiline
              style={styles.input}
            />
          </View>

          <View style={styles.infoBox}>
            <Icon name="information-circle-outline" size={20} color="#9FED3A" />
            <Text style={styles.infoText}>Your post will be visible to all your followers and on the explore page.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostCaptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9FED3A',
    fontWeight: '700',
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backBtn: {
    padding: 5,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  shareBtn: {
    backgroundColor: '#9FED3A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  previewCard: {
    width: '90%',
    alignSelf: 'center',
    height: 350,
    borderRadius: 24,
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    elevation: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
  },
  inputLabel: {
    color: '#9FED3A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 18,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#222',
  },
  infoBox: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(159, 237, 58, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 20,
    height: 20,
    tintColor: '#9FED3A',
  },
  infoText: {
    color: '#9FED3A',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
