import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const IncomingCallModal = ({
  visible,
  callerName,
  callerImage,
  isVideoCall,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onDecline}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.callerInfo}>
            <Image
              source={
                callerImage
                  ? {uri: callerImage}
                  : require('../assets/Images/user.png') // Fallback if you have it
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{callerName || 'Unknown Caller'}</Text>
            <Text style={styles.callType}>
              {isVideoCall
                ? 'Incoming Video Call...'
                : 'Incoming Audio Call...'}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}>
              <Icon name="call-end" size={40} color="#fff" />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}>
              <Icon
                name={isVideoCall ? 'videocam' : 'call'}
                size={40}
                color="#fff"
              />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  avatar: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    borderWidth: 3,
    borderColor: '#7CFF01',
    marginBottom: 20,
  },
  name: {
    fontSize: responsiveFontSize(3.5),
    color: '#fff',
    fontWeight: 'bold',
  },
  callType: {
    fontSize: responsiveFontSize(2.2),
    color: '#aaa',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: responsiveHeight(5),
  },
  button: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#4CD964',
  },
  buttonText: {
    color: '#fff',
    marginTop: 10,
    fontSize: responsiveFontSize(1.8),
  },
});

export default IncomingCallModal;
