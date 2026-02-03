import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const ProfileImageModal = ({visible, onClose, onChange, onRemove}) => {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.btn} onPress={onChange}>
            <Text style={styles.text}>Change Profile Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onRemove}>
            <Text style={styles.remove}>Remove Current Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfileImageModal;

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

  remove: {
    color: '#ff4d4d',
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
