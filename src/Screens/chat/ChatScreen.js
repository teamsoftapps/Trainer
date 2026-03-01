/**
 * ChatScreen — WhatsApp-style architecture
 *
 * Key design decisions:
 *  1. inverted FlatList  → newest messages sit at the bottom naturally,
 *     zero scrollToEnd() calls required, no scroll jitter on send.
 *  2. Data fed as [...messages].reverse() via useMemo so the underlying
 *     array is never mutated and referential equality is preserved.
 *  3. MessageBubble is a React.memo component with a custom areEqual
 *     comparator so only the one changed bubble re-renders per update.
 *  4. All callbacks are useCallback / stable refs — FlatList extraData
 *     only changes when myUserId changes (rare).
 *  5. KeyboardAvoidingView wraps the ENTIRE screen (not just the input)
 *     so the list shrinks cleanly when the keyboard appears.
 *  6. API object lives at module scope — zero hook overhead.
 */

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
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
  InteractionManager,
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

// ─── Constants ───────────────────────────────────────────────────────────────
const SOCKET_URL = baseUrl;
const API_BASE = baseUrl;

const joinUrl = (base, path) => {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
};

/** Stable API helper — module-level, never re-created. */
const API = {
  messages: id => joinUrl(API_BASE, `/chat/messages/${id}`),
  send: () => joinUrl(API_BASE, `/chat/send-message`),
  upload: () => joinUrl(API_BASE, `/chat/upload-chat-media`),
  deleteMsg: id => joinUrl(API_BASE, `/chat/message/${id}`),
  markSeen: () => joinUrl(API_BASE, `/chat/mark-seen`),
};

// ─── MessageBubble (memoized, custom equality) ────────────────────────────────
/**
 * Only re-renders when _id, text, mediaUrl, isOptimistic, or replyText change.
 * myUserId is stable for the whole session so it's safe in the comparator.
 */
const areMessagesEqual = (prev, next) =>
  prev.item._id === next.item._id &&
  prev.item.text === next.item.text &&
  prev.item.mediaUrl === next.item.mediaUrl &&
  prev.item.isOptimistic === next.item.isOptimistic &&
  prev.item.replyText === next.item.replyText &&
  prev.myUserId === next.myUserId;

const MessageBubble = React.memo(
  ({item, myUserId, onReply, openDeletePopup, openImagePreview}) => {
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
              {/* Reply snippet */}
              {!!item.replyText && (
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
              )}

              {/* Media */}
              {!!item.mediaUrl && (
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

              {/* Text */}
              {!!item.text && (
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.myText : styles.otherText,
                  ]}>
                  {item.text}
                </Text>
              )}

              {/* Timestamp */}
              <Text
                style={[
                  styles.timeText,
                  isMe ? styles.myTime : styles.otherTime,
                ]}>
                {time}
                {item.isOptimistic ? ' ✓' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  },
  areMessagesEqual,
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {otherUser, conversationId} = route.params || {};

  const user = useSelector(state => state.Auth.data);
  const myUserId = user?._id;

  // ─── State ────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const socketRef = useRef(null);
  /** Keep a mutable copy of replyTo inside sendMessage without stale closure */
  const replyToRef = useRef(null);
  replyToRef.current = replyTo;

  // ─── Inverted data (newest first for inverted FlatList) ───────────────────
  /**
   * inverted FlatList renders item[0] at the BOTTOM of the screen.
   * So we reverse the chronological array → newest message is index 0
   * and appears at the bottom, oldest is last and appears at top.
   */
  const invertedMessages = useMemo(
    () => [...messages].reverse(),
    [messages],
  );

  // ─── Mark seen ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId || !myUserId) return;
    axios
      .post(API.markSeen(), {conversationId, userId: myUserId})
      .catch(err =>
        console.log('markSeen error', err?.response?.data || err.message),
      );
  }, [conversationId, myUserId]);

  // ─── Load messages ────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await axios.get(API.messages(conversationId));
      if (res.data?.success) {
        setMessages(res.data.message || []);
      }
    } catch (err) {
      console.log('Load messages error:', err?.response?.data || err.message);
    }
  }, [conversationId]);

  // ─── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    // Defer socket init until after navigation transition animation finishes
    // so there is no frame drop on screen open.
    const task = InteractionManager.runAfterInteractions(() => {
      loadMessages();

      const s = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });
      socketRef.current = s;

      s.on('connect', () => {
        if (conversationId) s.emit('joinRoom', conversationId);
      });

      s.on('receiveMessage', newMsg => {
        setMessages(prev => {
          // Already exists — ignore (dedup)
          if (prev.some(m => m._id === newMsg._id)) return prev;

          // Replace optimistic placeholder sent by me
          const idx = prev.findIndex(
            m =>
              m.isOptimistic &&
              m.senderId === newMsg.senderId &&
              m.text === newMsg.text,
          );
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = {...newMsg, isOptimistic: false};
            return next;
          }

          // Brand new message from the other person
          return [...prev, newMsg];
        });
      });

      s.on('messageDeleted', ({messageId}) => {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      });

      s.on('connect_error', err =>
        console.log('Socket error:', err.message),
      );
    });

    return () => {
      task.cancel();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, loadMessages]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const pickMedia = useCallback((mediaType = 'photo') => {
    launchImageLibrary(
      {mediaType, quality: 0.8, includeBase64: false},
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
  }, []);

  const onReply = useCallback(msg => {
    setReplyTo({
      _id: msg._id,
      text: msg.text || (msg.mediaUrl ? 'Media' : ''),
      senderId: msg.senderId,
    });
    setTimeout(() => textInputRef.current?.focus?.(), 50);
  }, []);

  const openDeletePopup = useCallback(
    msg => {
      if (msg.senderId !== myUserId && msg.sender !== 'me') return;
      setDeleteTarget(msg);
      setDeletePopupVisible(true);
    },
    [myUserId],
  );

  const closeDeletePopup = useCallback(() => {
    setDeletePopupVisible(false);
    setDeleteTarget(null);
  }, []);

  const confirmDeleteMessage = useCallback(async () => {
    const msg = deleteTarget;
    if (!msg?._id) return closeDeletePopup();
    try {
      setMessages(prev => prev.filter(m => m._id !== msg._id));
      closeDeletePopup();
      await axios.delete(API.deleteMsg(msg._id), {data: {userId: myUserId}});
      socketRef.current?.emit?.('deleteMessage', {
        conversationId,
        messageId: msg._id,
      });
    } catch (err) {
      console.log('Delete failed:', err?.response?.data || err.message);
      loadMessages();
    }
  }, [deleteTarget, closeDeletePopup, myUserId, conversationId, loadMessages]);

  const openImagePreview = useCallback(url => {
    if (!url) return;
    setPreviewUrl(url);
    setImagePreviewVisible(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setImagePreviewVisible(false);
    setPreviewUrl(null);
  }, []);

  // ─── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmed = text.trim();
    const hasText = trimmed.length > 0;
    const hasMedia = !!selectedMedia;

    if (!hasText && !hasMedia) return;
    if (!myUserId) return;

    // Capture state before clearing
    const currentReply = replyToRef.current;
    const currentMedia = selectedMedia;

    // Clear UI instantly — feels like WhatsApp
    setText('');
    setSelectedMedia(null);
    setReplyTo(null);
    setIsSending(true);
    if (hasMedia) setIsUploading(true);

    const optimisticId = `opt-${Date.now()}`;
    const tempMsg = {
      _id: optimisticId,
      text: hasText ? trimmed : '',
      mediaUrl: hasMedia ? currentMedia.uri : null,
      sender: 'me',
      senderId: myUserId,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      replyTo: currentReply?._id ?? null,
      replyText: currentReply?.text ?? null,
    };

    // Append optimistic message — appears instantly at bottom
    setMessages(prev => [...prev, tempMsg]);

    // ── Upload media if any ──
    let mediaUrl = null;
    if (hasMedia) {
      const formData = new FormData();
      formData.append('file', {
        uri: currentMedia.uri,
        type:
          currentMedia.type ||
          (currentMedia.duration ? 'video/mp4' : 'image/jpeg'),
        name:
          currentMedia.fileName ||
          `media-${Date.now()}.${currentMedia.duration ? 'mp4' : 'jpg'}`,
      });
      try {
        const up = await axios.post(API.upload(), formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        if (up.data?.success) {
          mediaUrl = up.data.fileUrl || up.data.url;
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Upload failed:', err?.response?.data || err.message);
        setMessages(prev => prev.filter(m => m._id !== optimisticId));
        setIsSending(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // ── Send to server ──
    const payload = {
      conversationId,
      senderId: myUserId,
      senderRole: user?.isType || user?.role || 'user',
      text: hasText ? trimmed : '',
      mediaUrl,
      replyTo: currentReply?._id ?? null,
      replyText: currentReply?.text ?? null,
    };

    try {
      const res = await axios.post(API.send(), payload);
      if (res.data?.success) {
        const saved = res.data.message;
        // Replace optimistic with persisted message
        setMessages(prev =>
          prev.map(m =>
            m._id === optimisticId ? {...saved, isOptimistic: false} : m,
          ),
        );
      } else {
        setMessages(prev => prev.filter(m => m._id !== optimisticId));
      }
    } catch (err) {
      console.error('Send failed:', err?.response?.data || err.message);
      setMessages(prev => prev.filter(m => m._id !== optimisticId));
    } finally {
      setIsSending(false);
    }
  }, [text, selectedMedia, myUserId, conversationId, user]);

  // ─── FlatList helpers (all stable) ────────────────────────────────────────
  const keyExtractor = useCallback(item => item._id?.toString() || item.id, []);

  const renderMessage = useCallback(
    ({item}) => (
      <MessageBubble
        item={item}
        myUserId={myUserId}
        onReply={onReply}
        openDeletePopup={openDeletePopup}
        openImagePreview={openImagePreview}
      />
    ),
    [myUserId, onReply, openDeletePopup, openImagePreview],
  );

  /**
   * extraData: only pass myUserId — it virtually never changes,
   * so FlatList won't needlessly re-render all items on every state update.
   */
  const flatListExtraData = useMemo(() => myUserId, [myUserId]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header (outside KAV — always pinned at top) ── */}
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{
            uri:
              otherUser?.profileImage ||
              'https://i.pravatar.cc/150?img=12',
          }}
          style={styles.avatar}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser?.fullName || 'Trainer'}
          </Text>
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

      {/*
        KeyboardAvoidingView only wraps the FlatList + bottom bar.
        - iOS:     behavior="padding" adds bottom padding = keyboard height
                   so the input row is pushed up above the keyboard.
        - Android: windowSoftInputMode="adjustResize" (in AndroidManifest)
                   already resizes the window, so KAV is a no-op (enabled=false).
                   Using KAV on Android with adjustResize would double-push.
      */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled={Platform.OS === 'ios'}>

        {/* ── Message List ── */}
        <FlatList
          ref={flatListRef}
          data={invertedMessages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          extraData={flatListExtraData}
          inverted
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          updateCellsBatchingPeriod={30}
          windowSize={15}
          removeClippedSubviews={Platform.OS === 'android'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {/* ── Media preview bar ── */}
        {!!selectedMedia && (
          <View style={styles.mediaPreview}>
            <Image
              source={{uri: selectedMedia.uri}}
              style={styles.mediaThumb}
            />
            <TouchableOpacity
              hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
              onPress={() => setSelectedMedia(null)}>
              <Icon name="close" size={26} color="#ff4444" style={styles.mediaClose} />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Reply preview bar ── */}
        {!!replyTo && (
          <View style={styles.replyPreview}>
            <View style={styles.replyPreviewBar} />
            <View style={styles.replyPreviewBody}>
              <Text style={styles.replyPreviewLabel}>Replying to</Text>
              <Text numberOfLines={1} style={styles.replyPreviewText}>
                {replyTo.text}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              onPress={() => setReplyTo(null)}>
              <Icon name="close" size={22} color="#9FED3A" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Input row ── */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => pickMedia('photo')}>
            <Icon name="add" size={26} color="#fff" />
          </TouchableOpacity>

          <TextInput
            ref={textInputRef}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            returnKeyType="default"
          />

          <TouchableOpacity
            style={[styles.sendBtn, isSending && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={isSending}
            activeOpacity={0.75}>
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── Uploading overlay ── */}
      <Modal transparent visible={isUploading} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#57f265" />
            <Text style={styles.modalText}>Uploading…</Text>
          </View>
        </View>
      </Modal>

      {/* ── Delete popup ── */}
      <Modal transparent visible={deletePopupVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={closeDeletePopup}>
          <View style={styles.deleteOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.deletePopup}>
                <Text style={styles.deleteTitle}>Delete message?</Text>
                <Text numberOfLines={2} style={styles.deleteSub}>
                  {deleteTarget?.text || (deleteTarget?.mediaUrl ? 'Media message' : '')}
                </Text>
                <View style={styles.deleteBtnsRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={closeDeletePopup}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={confirmDeleteMessage}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Full-screen image preview ── */}
      <Modal
        visible={imagePreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImagePreview}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeImagePreview}
          />
          <View style={styles.previewContent}>
            <TouchableOpacity style={styles.previewClose} onPress={closeImagePreview}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
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
                style={{
                  width: responsiveWidth(100),
                  height: responsiveHeight(100),
                }}
                resizeMode="contain"
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#121212',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a2a',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 0,
  },
  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  status: {
    color: '#57f265',
    fontSize: 13,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },

  // Message row & bubble
  messageRow: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: responsiveWidth(75),
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#9FED3A',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#2A2A2A',
    borderBottomLeftRadius: 4,
  },
  mediaImage: {
    width: 220,
    height: 220,
    borderRadius: 14,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myText: {
    color: '#0b0b0b',
    fontWeight: '500',
  },
  otherText: {
    color: '#f0f0f0',
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  myTime: {
    color: 'rgba(0,0,0,0.45)',
  },
  otherTime: {
    color: '#888',
  },

  // Reply snippet inside bubble
  replySnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 7,
  },
  replySnippetMe: {
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  replySnippetOther: {
    backgroundColor: '#1a1a1a',
  },
  replyBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: '#9FED3A',
    borderRadius: 2,
    marginRight: 7,
  },
  replySnippetText: {
    fontSize: 12,
    flex: 1,
  },

  // Media preview bar
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#121212',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2a',
  },
  mediaThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  mediaClose: {
    marginLeft: 12,
  },

  // Reply preview bar
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#121212',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2a',
  },
  replyPreviewBar: {
    width: 3,
    height: '100%',
    minHeight: 36,
    backgroundColor: '#9FED3A',
    borderRadius: 2,
    marginRight: 10,
  },
  replyPreviewBody: {
    flex: 1,
  },
  replyPreviewLabel: {
    color: '#9FED3A',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyPreviewText: {
    color: '#ccc',
    fontSize: 13,
  },

  // Input row
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#121212',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2a',
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
    lineHeight: 21,
  },
  sendBtn: {
    marginLeft: 8,
    marginBottom: 1,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#57f265',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.55,
  },

  // Upload modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 160,
  },
  modalText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 15,
  },

  // Delete popup
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  deletePopup: {
    width: '100%',
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#2a2a2a',
  },
  deleteTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteSub: {
    color: '#999',
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  deleteBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#222',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#9FED3A',
  },
  deleteBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
  },

  // Image preview
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    width: '100%',
    height: '100%',
  },
  previewClose: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 99,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  previewScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
  },
});

export default ChatScreen;
