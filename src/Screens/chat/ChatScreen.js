import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import io from 'socket.io-client';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {baseUrl} from '../../services/Urls';
import {ScrollView, Swipeable} from 'react-native-gesture-handler';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

// Backend URLs
const SOCKET_URL = baseUrl;
const API_BASE = baseUrl;

// ✅ Safe URL join (prevents missing "/" bugs)
const joinUrl = (base, path) => {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
};

const Message = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const {trainerData, conversationId} = route.params || {};

  const {otherUser, conversationId} = route.params || {};
  const user = useSelector(state => state.Auth.data);
  const myUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Reply state (swipe right)
  const [replyTo, setReplyTo] = useState(null);

  // ✅ Delete popup state (long press)
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const flatListRef = useRef(null);
  const textInputRef = useRef(null);

  // ✅ Keep socket in ref (prevents re-init issues)
  const socketRef = useRef(null);
  useEffect(() => {
    if (!conversationId || !myUserId) return;

    axios
      .post(API.markSeen(), {
        conversationId,
        userId: myUserId,
      })
      .catch(err =>
        console.log('markSeen error', err?.response?.data || err.message),
      );
  }, [conversationId, myUserId, API]);

  const API = useMemo(
    () => ({
      messages: id => joinUrl(API_BASE, `/chat/messages/${id}`),
      send: () => joinUrl(API_BASE, `/chat/send-message`),
      upload: () => joinUrl(API_BASE, `/chat/upload-chat-media`),
      deleteMsg: id => joinUrl(API_BASE, `/chat/message/${id}`),
      markSeen: () => joinUrl(API_BASE, `/chat/mark-seen`),
    }),
    [],
  );

  const scrollToEnd = useCallback((animated = true) => {
    setTimeout(() => flatListRef.current?.scrollToEnd({animated}), 80);
  }, []);

  // Load previous messages
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await axios.get(API.messages(conversationId));
      if (res.data?.success) {
        setMessages(res.data.message || []);
        scrollToEnd(false);
      }
    } catch (err) {
      console.log('Load messages error:', err?.response?.data || err.message);
    }
  }, [conversationId, API, scrollToEnd]);

  // Socket connection
  useEffect(() => {
    loadMessages();

    const s = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = s;

    s.on('connect', () => {
      if (conversationId) s.emit('joinRoom', conversationId);
    });

    // s.on('receiveMessage', newMsg => {
    //   setMessages(prev => {
    //     if (prev.some(m => m._id === newMsg._id)) return prev;
    //     return [...prev, newMsg];
    //   });
    //   scrollToEnd();
    // });

    s.on('receiveMessage', newMsg => {
      setMessages(prev => {
        // 1️⃣ If message already exists (real id)
        if (prev.some(m => m._id === newMsg._id)) {
          return prev;
        }

        // 2️⃣ If we have optimistic message (replace it)
        const optimisticIndex = prev.findIndex(
          m =>
            m.isOptimistic &&
            m.senderId === newMsg.senderId &&
            m.text === newMsg.text,
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = {
            ...newMsg,
            isOptimistic: false,
          };
          return updated;
        }

        // 3️⃣ Otherwise add normally (message from other user)
        return [...prev, newMsg];
      });

      scrollToEnd();
    });

    // ✅ Listen delete broadcast
    s.on('messageDeleted', ({messageId}) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    s.on('connect_error', err => console.log('Socket error:', err.message));

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, loadMessages, scrollToEnd]);

  // Pick media
  const pickMedia = (mediaType = 'photo') => {
    launchImageLibrary(
      {mediaType, quality: 0.82, includeBase64: false},
      response => {
        if (
          !response.didCancel &&
          !response.errorCode &&
          response.assets?.[0]
        ) {
          setSelectedMedia(response.assets[0]);
        }
      },
    );
  };

  // ✅ Swipe right => reply
  const onReply = useCallback(msg => {
    setReplyTo({
      _id: msg._id,
      text: msg.text || (msg.mediaUrl ? 'Media' : ''),
      senderId: msg.senderId,
    });
    // optional: focus input
    setTimeout(() => textInputRef.current?.focus?.(), 50);
  }, []);

  // ✅ Long press => open custom delete popup
  const openDeletePopup = useCallback(
    msg => {
      const isMe = msg.senderId === myUserId || msg.sender === 'me';
      if (!isMe) return;
      setDeleteTarget(msg);
      setDeletePopupVisible(true);
    },
    [myUserId],
  );

  const closeDeletePopup = useCallback(() => {
    setDeletePopupVisible(false);
    setDeleteTarget(null);
  }, []);

  // ✅ Confirm delete
  const confirmDeleteMessage = useCallback(async () => {
    const msg = deleteTarget;
    if (!msg?._id) {
      closeDeletePopup();
      return;
    }

    try {
      // optimistic remove
      setMessages(prev => prev.filter(m => m._id !== msg._id));
      closeDeletePopup();

      await axios.delete(API.deleteMsg(msg._id), {
        data: {userId: myUserId},
      });

      socketRef.current?.emit?.('deleteMessage', {
        conversationId,
        messageId: msg._id,
      });
    } catch (err) {
      console.log('Delete failed:', err?.response?.data || err.message);
      // restore by reloading
      loadMessages();
    }
  }, [
    deleteTarget,
    closeDeletePopup,
    API,
    myUserId,
    conversationId,
    loadMessages,
  ]);

  // Send message
  const sendMessage = async () => {
    const hasText = text.trim().length > 0;
    const hasMedia = !!selectedMedia;

    if (!hasText && !hasMedia) return;
    if (!myUserId) {
      console.error('Cannot send: user ID missing');
      return;
    }

    setIsSending(true);
    if (hasMedia) setIsUploading(true);

    const optimisticId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: optimisticId,
      text: hasText ? text.trim() : '',
      mediaUrl: hasMedia ? selectedMedia.uri : null,
      sender: 'me',
      senderId: myUserId,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOptimistic: true,

      // reply preview data (optional)
      replyTo: replyTo ? replyTo._id : null,
      replyText: replyTo ? replyTo.text : null,
    };

    setMessages(prev => [...prev, tempMsg]);
    scrollToEnd();

    let mediaUrl = null;

    // Upload media
    if (hasMedia) {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedMedia.uri,
        type:
          selectedMedia.type ||
          (selectedMedia.duration ? 'video/mp4' : 'image/jpeg'),
        name:
          selectedMedia.fileName ||
          `media-${Date.now()}.${selectedMedia.duration ? 'mp4' : 'jpg'}`,
      });

      try {
        const uploadRes = await axios.post(API.upload(), formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        if (uploadRes.data?.success) {
          mediaUrl = uploadRes.data.fileUrl || uploadRes.data.url;
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Upload failed:', err?.response?.data || err.message);
        setMessages(prev => prev.filter(m => m._id !== optimisticId));
        setIsSending(false);
        setIsUploading(false);
        return;
      }
    }

    const payload = {
      conversationId,
      senderId: myUserId,
      senderRole: user.isType || user.role || 'user',
      text: hasText ? text.trim() : '',
      mediaUrl,

      // ✅ reply fields
      replyTo: replyTo ? replyTo._id : null,
      replyText: replyTo ? replyTo.text : null,
    };

    try {
      const res = await axios.post(API.send(), payload);
      if (res.data?.success) {
        const savedMsg = res.data.message;
        setMessages(prev =>
          prev.map(m =>
            m._id === optimisticId ? {...savedMsg, isOptimistic: false} : m,
          ),
        );
        // socketRef.current?.emit?.('sendMessage', savedMsg);
        setText('');
        setSelectedMedia(null);
        setReplyTo(null);
        scrollToEnd();
      } else {
        setMessages(prev => prev.filter(m => m._id !== optimisticId));
      }
    } catch (err) {
      console.error('Send failed:', err?.response?.data || err.message);
      setMessages(prev => prev.filter(m => m._id !== optimisticId));
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  const openImagePreview = useCallback(url => {
    if (!url) return;
    setPreviewUrl(url);
    setImagePreviewVisible(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setImagePreviewVisible(false);
    setPreviewUrl(null);
  }, []);

  // Render message
  const renderMessage = ({item}) => {
    const isMe = item?.senderId === myUserId || item?.sender === 'me';

    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : item.time || '';

    return (
      <Swipeable
        friction={2}
        leftThreshold={40}
        overshootLeft={false}
        renderLeftActions={() => null}
        onSwipeableLeftOpen={() => onReply(item)}>
        <View
          style={[
            styles.messageRow,
            {justifyContent: isMe ? 'flex-end' : 'flex-start'},
          ]}>
          <TouchableOpacity
            activeOpacity={0.85}
            delayLongPress={300}
            onLongPress={() => openDeletePopup(item)}>
            <View
              style={[
                styles.bubble,
                isMe ? styles.myBubble : styles.otherBubble,
              ]}>
              {/* reply snippet */}
              {item.replyText ? (
                <View
                  style={[
                    styles.replySnippet,
                    isMe ? styles.replySnippetMe : styles.replySnippetOther,
                  ]}>
                  <View style={styles.replyBar} />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.replySnippetText,
                      isMe ? styles.myText : styles.otherText,
                    ]}>
                    {item.replyText}
                  </Text>
                </View>
              ) : null}

              {item.mediaUrl && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => openImagePreview(item.mediaUrl)}>
                  <Image
                    source={{uri: item.mediaUrl}}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              {item.text ? (
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.myText : styles.otherText,
                  ]}>
                  {item.text}
                </Text>
              ) : null}

              <Text
                style={[
                  styles.timeText,
                  isMe ? styles.myTime : styles.otherTime,
                ]}>
                {time}
                {item.isOptimistic && ' • sending...'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  const getItemLayout = useCallback((data, index) => {
    const height = data[index]?.mediaUrl ? 240 : 80;
    return {length: height, offset: height * index, index};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{
            uri: otherUser?.profileImage || 'https://i.pravatar.cc/150?img=12',
          }}
          style={styles.avatar}
        />

        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.name}>{otherUser?.fullName || 'Trainer'}</Text>
          <Text style={styles.status}>
            {otherUser?.isAvailable ? 'Active now' : 'Offline'}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="videocam" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id || item.id}
        getItemLayout={getItemLayout}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={11}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => scrollToEnd(false)}
        onLayout={() => scrollToEnd(false)}
      />
      {/* Media Preview*/}
      {selectedMedia && (
        <View style={styles.mediaPreview}>
          <Image
            source={{uri: selectedMedia.uri}}
            style={styles.previewImage}
          />
          <TouchableOpacity onPress={() => setSelectedMedia(null)}>
            <Icon
              name="close"
              size={28}
              color="#ff4444"
              style={{marginLeft: 12}}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* ✅ Reply Preview (theme black/green) */}
      {replyTo && (
        <View style={styles.replyPreview}>
          <View style={{flex: 1}}>
            <Text style={styles.replyPreviewLabel}>Replying to</Text>
            <Text numberOfLines={1} style={styles.replyPreviewText}>
              {replyTo.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Icon name="close" size={22} color="#9FED3A" />
          </TouchableOpacity>
        </View>
      )}
      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => pickMedia('photo')}>
            <Icon name="add" size={26} color="#fff" />
          </TouchableOpacity>

          <TextInput
            ref={textInputRef}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, isSending && {opacity: 0.6}]}
            onPress={sendMessage}
            disabled={isSending}>
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Uploading overlay */}
      <Modal transparent visible={isUploading} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#57f265" />
            <Text style={styles.modalText}>Uploading...</Text>
          </View>
        </View>
      </Modal>
      {/* ✅ Custom Delete Popup (green/black theme) */}
      <Modal transparent visible={deletePopupVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={closeDeletePopup}>
          <View style={styles.deleteOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.deletePopup}>
                <Text style={styles.deleteTitle}>Delete message?</Text>

                <Text numberOfLines={2} style={styles.deleteSub}>
                  {deleteTarget?.text
                    ? deleteTarget.text
                    : deleteTarget?.mediaUrl
                      ? 'Media message'
                      : ''}
                </Text>

                <View style={styles.deleteBtnsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={closeDeletePopup}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={confirmDeleteMessage}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={imagePreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImagePreview}>
        <View style={styles.previewOverlay}>
          {/* Tap outside to close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeImagePreview}
          />

          {/* Content */}
          <View style={styles.previewContent}>
            <TouchableOpacity
              style={styles.previewClose}
              onPress={closeImagePreview}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {/* iOS supports pinch zoom inside ScrollView, Android will just show fullscreen */}
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={styles.previewScrollContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              bouncesZoom
              centerContent>
              <Image
                source={{uri: previewUrl || ''}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b0b0b'},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {width: 44, height: 44, borderRadius: 22, marginHorizontal: 12},
  name: {color: '#fff', fontSize: 17, fontWeight: '600'},
  status: {color: '#57f265', fontSize: 13},
  iconButton: {padding: 8, marginLeft: 12},

  listContent: {padding: 16, paddingBottom: 100},

  messageRow: {marginVertical: 6, flexDirection: 'row'},

  mediaImage: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: 6,
  },
  bubble: {
    maxWidth: '100%',
    padding: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  myBubble: {
    backgroundColor: '#9FED3A', // ✅ green (my side)
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: '#2A2A2A', // ✅ gray (other side)
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myText: {
    color: '#0b0b0b', // ✅ dark text on green
    fontWeight: '500',
  },

  otherText: {
    color: '#fff', // ✅ white text on gray
  },
  myTime: {
    color: 'rgba(0,0,0,0.55)', // ✅ darker time on green
  },
  otherTime: {
    color: '#B8B8B8', // ✅ light gray time
  },

  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#121212',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: responsiveWidth(5),
  },

  // ✅ reply snippet inside bubble
  replySnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  replySnippetMe: {
    backgroundColor: 'rgba(0,0,0,0.08)', // subtle on green
  },

  replySnippetOther: {
    backgroundColor: '#1A1A1A', // dark on gray
  },

  replyBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#0b0b0b',
    borderRadius: 2,
    marginRight: 8,
  },
  replySnippetText: {
    fontSize: 12,
    flex: 1,
  },

  // ✅ reply preview above input
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  replyPreviewLabel: {color: '#9FED3A', fontSize: 12, marginBottom: 2},
  replyPreviewText: {color: '#fff', fontSize: 13},

  inputWrapper: {backgroundColor: '#121212'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
  },
  sendBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#57f265',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Uploading modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: 180,
  },
  modalText: {color: '#fff', marginTop: 12, fontSize: 16},

  // ✅ Delete popup
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  deletePopup: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  deleteTitle: {color: '#fff', fontSize: 16, fontWeight: '700'},
  deleteSub: {color: '#bdbdbd', marginTop: 10, fontSize: 13, lineHeight: 18},
  deleteBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cancelBtnText: {color: '#fff', fontWeight: '600'},
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#9FED3A',
  },
  deleteBtnText: {color: '#000', fontWeight: '800'},
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewContent: {
    width: '100%',
    height: '100%',
  },

  previewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 99,
    padding: 8,
  },

  previewScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, // so image doesn't hide behind close button
  },

  // previewImage: {
  //   width: '100%',
  //   height: '85%',
  // },
});

export default Message;
