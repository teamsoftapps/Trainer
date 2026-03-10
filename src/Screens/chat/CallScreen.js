import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Images, FontFamily} from '../../utils/Images';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SocketService from '../../services/SocketService';

// Fill in your App ID
const appId = 'ec1f9bf00fb9454a8fdcc00914d98084';

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {channelName, isVideoCall, otherUser, token} = route.params || {};

  const agoraEngineRef = useRef();
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(!isVideoCall);

  const remoteUidRef = useRef(0);
  remoteUidRef.current = remoteUid;

  useEffect(() => {
    setupAgora();

    // Listen for recipient declining the call
    SocketService.on('call_declined', () => {
      console.log('❌ Call was declined');
      endCall();
    });

    return () => {
      // If I'm leaving and remote user hasn't joined, notify them to close modal
      if (remoteUidRef.current === 0 && otherUser?._id) {
        SocketService.emit('call_cancelled', {to: otherUser._id});
      }
      leave();
      SocketService.off('call_declined');
    };
  }, []); // Run only once on mount

  const setupAgora = async () => {
    console.log('🚀 Setting up Agora:', {
      appId,
      channelName,
      hasToken: !!token,
    });
    try {
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (_connection, elapsed) => {
          setIsJoined(true);
          setMessage('Successfully joined channel: ' + channelName);
        },
        onUserJoined: (_connection, uid, elapsed) => {
          setRemoteUid(uid);
          setMessage('Remote user joined with uid: ' + uid);
        },
        onUserOffline: (_connection, uid, reason) => {
          setRemoteUid(0);
          setMessage('Remote user left the channel');
          navigation.goBack();
        },
        onError: err => {
          console.error('Agora Error:', err);
        },
      });

      if (isVideoCall) {
        agoraEngine.enableVideo();
      } else {
        agoraEngine.enableAudio();
        agoraEngine.setEnableSpeakerphone(true);
        agoraEngine.setDefaultAudioRouteToSpeakerphone(true);
      }

      join();
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) return;
    try {
      agoraEngineRef.current?.joinChannel(token || '', channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      agoraEngineRef.current?.release();
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMute = () => {
    agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    agoraEngineRef.current?.enableLocalVideo(!isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  const endCall = () => {
    // Signal to the other user that I'm hanging up
    if (otherUser?._id) {
      SocketService.emit('call_declined', {
        to: otherUser._id,
        declinedBy: 'me', // generic indicator
      });
    }
    leave();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {isVideoCall ? (
        <View style={styles.videoContainer}>
          {remoteUid !== 0 ? (
            <RtcSurfaceView
              canvas={{uid: remoteUid}}
              style={styles.remoteVideo}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={
                  otherUser?.profileImage || otherUser?.profileimage
                    ? {uri: otherUser.profileImage || otherUser.profileimage}
                    : Images.logo
                }
                style={styles.placeholderImage}
              />
              <Text style={styles.waitingText}>
                Waiting for {otherUser?.fullName || 'other user'}...
              </Text>
            </View>
          )}

          {!isCameraOff && (
            <RtcSurfaceView canvas={{uid: 0}} style={styles.localVideo} />
          )}
        </View>
      ) : (
        <View style={styles.audioContainer}>
          <Image
            source={
              otherUser?.profileImage || otherUser?.profileimage
                ? {uri: otherUser.profileImage || otherUser.profileimage}
                : Images.logo
            }
            style={styles.audioAvatar}
          />
          <Text style={styles.audioName}>{otherUser?.fullName || 'User'}</Text>
          <Text style={styles.audioStatus}>
            {!isJoined
              ? 'Connecting...'
              : remoteUid === 0
                ? 'Ringing...'
                : 'On Call'}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={toggleMute}>
          <Icon name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>

        {isVideoCall && (
          <TouchableOpacity
            style={[styles.controlButton, isCameraOff && styles.activeControl]}
            onPress={toggleCamera}>
            <Icon
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}>
          <Icon name="call-end" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
  },
  localVideo: {
    width: 120,
    height: 160,
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  waitingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FontFamily.Medium,
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  audioName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FontFamily.Bold,
    marginBottom: 10,
  },
  audioStatus: {
    color: '#ccc',
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControl: {
    backgroundColor: '#ff4444',
  },
  endCallButton: {
    backgroundColor: '#ff0000',
  },
});

export default CallScreen;
