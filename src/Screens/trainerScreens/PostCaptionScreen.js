import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {uploadPost} from '../../services/mediaService';
import {showMessage} from 'react-native-flash-message';
const PostCaptionScreen = ({route, navigation}) => {
  const {file, thumbnail} = route.params;

  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    try {
      setLoading(true);

      await uploadPost(file, caption, thumbnail, setProgress);
      showMessage({message: 'Post uploaded successfully 🚀', type: 'success'});
      navigation.replace('TrainerBttomStack');
    } catch (err) {
      showMessage({message: 'Error uploading post', type: 'danger'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {loading && (
        <>
          <ActivityIndicator />
          <Text style={{color: '#9FED3A', marginTop: 10}}>
            Uploading... {progress}%
          </Text>
        </>
      )}
      {/* HEADER */}
      <Text style={styles.header}>Create Post</Text>

      {/* IMAGE PREVIEW CARD */}
      <View style={styles.previewCard}>
        <Image source={{uri: file.path}} style={styles.previewImage} />
      </View>

      {/* CAPTION BOX */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Write caption..."
          placeholderTextColor="#aaa"
          value={caption}
          onChangeText={setCaption}
          multiline
          style={styles.input}
        />
      </View>

      {/* POST BUTTON */}
      <TouchableOpacity
        style={styles.postBtn}
        onPress={handleUpload}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.postText}>POST</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default PostCaptionScreen;

/* ------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
  },

  header: {
    color: '#9FED3A',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
  },

  /* image preview */
  previewCard: {
    backgroundColor: '#1b1b1b',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    marginBottom: 20,
  },

  previewImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },

  /* caption */
  inputWrapper: {
    backgroundColor: '#1b1b1b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 25,
  },

  input: {
    color: '#fff',
    fontSize: 15,
    minHeight: 80,
  },

  /* post button */
  postBtn: {
    backgroundColor: '#9FED3A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  postText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});
