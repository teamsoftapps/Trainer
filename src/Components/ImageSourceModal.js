import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const ImageSourceModal = ({visible, onClose, onCamera, onGallery}) => {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.btn} onPress={onCamera}>
            <Text style={styles.text}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onGallery}>
            <Text style={styles.text}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ImageSourceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  sheet: {
    backgroundColor: '#222',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: responsiveScreenHeight(4),
  },

  btn: {
    paddingVertical: responsiveScreenHeight(2.2),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },

  text: {
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
  },

  cancel: {
    paddingVertical: responsiveScreenHeight(2.2),
    alignItems: 'center',
  },

  cancelText: {
    color: '#9FED3A',
    fontWeight: '600',
    fontSize: responsiveFontSize(2.1),
  },
});
