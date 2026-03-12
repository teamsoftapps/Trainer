import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {FontFamily, Images} from '../../utils/Images';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {baseUrl} from '../../services/Urls';
import {requestCallPermissions} from '../../utils/PermissionHelper';
import SocketService from '../../services/SocketService';
import {AGORA_TEST_TOKEN} from '@env';

const joinUrl = (base, path) => {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
};

const TrainerDetailView = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation();
  const authData = useSelector(state => state?.Auth?.data);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const calculateAge = birthdateString => {
    if (!birthdateString) return '--';
    const [month, day, year] = birthdateString.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    const birthDate = new Date(formattedDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = data?.Dob ? calculateAge(data.Dob) : '--';

  const fetchReviews = async () => {
    try {
      const res = await axiosBaseURL.get(`/user/trainer/${data._id}/reviews`);
      if (res.data.status) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.log('Reviews error:', err);
    }
  };

  const fetchTrainerPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await axiosBaseURL.get(`/trainer/posts/${data._id}`);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching posts', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrainerPosts();
      fetchReviews();
    }, []),
  );

  const videoPosts = posts.filter(p => p.type === 'video');
  const imagePosts = posts.filter(p => p.type === 'image');
  let previewPosts = [];
  if (videoPosts.length > 0) {
    previewPosts = videoPosts.slice(0, 3);
  } else {
    previewPosts = imagePosts.slice(0, 3);
  }

  const latestReviews = reviews.slice(0, 3);

  // ─── Contact Actions ───
  const handleOpenChat = async () => {
    try {
      const res = await axiosBaseURL.post('/chat/create-conversation', {
        userId: authData?._id,
        trainerId: data?._id,
      });

      if (res.data.success) {
        const conversation = res.data.conversation || res.data.data;
        setConversationId(conversation?._id);

        navigation.navigate('ChatScreen', {
          conversationId: conversation?._id,
          otherUser: data,
        });
      }
    } catch (error) {
      console.log('Chat error:', error?.response?.data || error.message);
    }
  };

  const handleCall = async (isVideo = false) => {
    const hasPermission = await requestCallPermissions();
    if (!hasPermission) {
      alert('Camera and Microphone permissions are required for calls.');
      return;
    }

    if (!data?._id) {
      alert('Trainer data not available.');
      return;
    }

    // First ensure we have a conversation
    let convId = conversationId;
    if (!convId) {
      try {
        const res = await axiosBaseURL.post('/chat/create-conversation', {
          userId: authData?._id,
          trainerId: data?._id,
        });
        if (res.data.success) {
          const conversation = res.data.conversation || res.data.data;
          convId = conversation?._id;
          setConversationId(convId);
        }
      } catch (err) {
        console.log('Create conversation error:', err);
        return;
      }
    }

    // Send call signal
    const callSignal = {
      callerName: authData?.fullName || 'Someone',
      callerImage: authData?.profileImage || authData?.profileimage,
      profileImage: authData?.profileImage || authData?.profileimage,
      profileimage: authData?.profileImage || authData?.profileimage,
      isVideoCall: isVideo,
      channelName: 'test',
    };

    axios
      .post(joinUrl(baseUrl, '/chat/send-message'), {
        conversationId: convId,
        senderId: authData?._id,
        senderRole: authData?.isType || authData?.role || 'trainer',
        text: `__COMM_CALL__${JSON.stringify(callSignal)}`,
      })
      .catch(err => console.log('Call signal error:', err));

    SocketService.emit('incoming_call', {
      to: data._id,
      callerId: authData?._id,
      ...callSignal,
      conversationId: convId,
    });

    navigation.navigate('CallScreen', {
      channelName: 'test',
      isVideoCall: isVideo,
      otherUser: data,
      token: AGORA_TEST_TOKEN,
    });
  };

  const renderScheduleItem = ({item}) => {
    const safeText =
      typeof item === 'string' || typeof item === 'number'
        ? String(item)
        : item?.day || item?.label || '';

    return (
      <View style={styles.scheduleChip}>
        <Text style={styles.scheduleChipText}>{safeText}</Text>
      </View>
    );
  };

  return (
    <WrapperContainer style={{backgroundColor: 'black'}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: responsiveHeight(15)}}
        showsVerticalScrollIndicator={false}>
        {/* ═══════ HEADER SECTION ═══════ */}
        <ImageBackground
          source={Images.ProfileBG}
          style={{width: responsiveWidth(100)}}
          resizeMode="cover">
          <LinearGradient
            colors={['transparent', '#000', '#000']}
            style={{flex: 1, paddingTop: responsiveHeight(5)}}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={Images.back} tintColor={'white'} />
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>Trainer Profile</Text>
              <View style={{width: 24}} />
            </View>

            {/* Profile Image */}
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Image
                source={
                  data?.profileImage
                    ? {uri: data.profileImage}
                    : Images.placeholderimage
                }
                style={styles.profileImage}
              />

              {/* Available Badge */}
              <View
                style={[
                  styles.availBadge,
                  !data?.isAvailable && {backgroundColor: '#555'},
                ]}>
                <Text
                  style={[
                    styles.availBadgeText,
                    !data?.isAvailable && {color: '#ccc'},
                  ]}>
                  {data?.isAvailable ? 'Available' : 'Not Available'}
                </Text>
              </View>

              {/* Name */}
              <Text style={styles.trainerName}>{data?.fullName}</Text>

              <Text style={styles.certText}>Certified Personal Trainer</Text>

              {/* Speciality + Experience */}
              <View style={styles.specRow}>
                <Text style={styles.specText}>
                  {data?.Speciality?.[0]?.value}
                </Text>
                <Text style={styles.specText}> • </Text>
                <Text style={styles.specText}>
                  {data?.experience || 'No Experience Added'}
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: '#9FED3A'}]}>
                  ⭐ {data?.Rating || '0.0'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {data?.followers?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {data?.Dob ? age : '--'}
                </Text>
                <Text style={styles.statLabel}>Years old</Text>
              </View>
            </View>

            {/* Hourly Rate Box */}
            <View style={{alignItems: 'center', marginTop: 25}}>
              <View style={styles.rateBox}>
                <Text style={styles.rateBoxLabel}>Hourly Rate</Text>
                <Text style={styles.rateBoxValue}>
                  ${data?.Hourlyrate}{' '}
                  <Text style={styles.rateBoxUnit}>/ per hour</Text>
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* ═══════ SPECIALITIES ═══════ */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Specialities</Text>
          <Text style={{color: 'gray'}}>Verified by Business</Text>

          {data?.Speciality?.map((item, index) => (
            <Text key={index} style={styles.whiteText}>
              • {item?.value}
            </Text>
          ))}
        </View>

        {/* ═══════ VIDEOS/POSTS ═══════ */}
        <View style={{marginTop: responsiveHeight(2)}}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>Watch Video</Text>
            {posts.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TrainerMediaScreen', {
                    trainerData: data,
                    posts: posts,
                  })
                }>
                <Text style={{color: '#9FED3A'}}>See all ›</Text>
              </TouchableOpacity>
            )}
          </View>

          {loadingPosts ? (
            <Text style={{color: 'gray', paddingHorizontal: 20}}>
              Loading...
            </Text>
          ) : previewPosts.length === 0 ? (
            <Text style={{color: 'gray', paddingHorizontal: 20}}>
              No posts available
            </Text>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: responsiveWidth(6)}}
              data={previewPosts}
              keyExtractor={item => item._id}
              renderItem={({item}) => {
                const isVideo = item.type === 'video';
                return (
                  <TouchableOpacity
                    style={styles.postThumb}>
                    <Image
                      source={{
                        uri: isVideo
                          ? item.thumbnail || item.mediaUrl
                          : item.mediaUrl,
                      }}
                      style={styles.postThumbImage}
                    />
                    {isVideo && (
                      <View style={styles.playOverlay}>
                        <Text style={{fontSize: 30, color: 'white'}}>▶</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* ═══════ DESCRIPTION ═══════ */}
        <View style={styles.bioContainer}>
          <Text style={styles.heading}>Description</Text>
          <Text
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={e => {
              if (e.nativeEvent.lines.length > 3) {
                setShowReadMore(true);
              }
            }}
            style={styles.whiteText}>
            {data?.Bio}
          </Text>
          {showReadMore && (
            <Text
              onPress={() => setExpanded(!expanded)}
              style={{color: '#9FED3A', marginTop: 5}}>
              {expanded ? 'See less' : 'Read more'}
            </Text>
          )}
        </View>

        {/* ═══════ SCHEDULE ═══════ */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Schedule</Text>
          <FlatList
            data={data?.Availiblity}
            horizontal
            keyExtractor={(item, i) => String(i)}
            renderItem={renderScheduleItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* ═══════ LOCATION ═══════ */}
        <View style={{paddingHorizontal: 25, marginTop: 20}}>
          <Text style={styles.heading}>Location</Text>
          {data?.location?.coordinates &&
          data.location.coordinates.length === 2 ? (
            <View style={styles.mapContainer}>
              <MapView
                style={{flex: 1}}
                initialRegion={{
                  latitude: Number(data.location.coordinates[1]),
                  longitude: Number(data.location.coordinates[0]),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: Number(data.location.coordinates[1]),
                    longitude: Number(data.location.coordinates[0]),
                  }}
                />
              </MapView>
            </View>
          ) : (
            <Text style={styles.whiteText}>Location not available</Text>
          )}
        </View>

        {/* ═══════ REVIEWS ═══════ */}
        <View style={{paddingHorizontal: 25, marginTop: 25}}>
          <Text style={styles.heading}>Reviews</Text>

          {latestReviews.length === 0 ? (
            <Text style={{color: 'gray'}}>No reviews yet</Text>
          ) : (
            latestReviews.map(item => (
              <View key={item._id} style={styles.reviewCard}>
                <View style={styles.reviewTopRow}>
                  <Image
                    source={{
                      uri:
                        item.userId?.profileImage ||
                        'https://i.pravatar.cc/150?img=12',
                    }}
                    style={styles.reviewAvatar}
                  />
                  <View style={{flex: 1}}>
                    <Text style={styles.reviewName}>
                      {item.userId?.fullName || 'User'}
                    </Text>
                    <Text style={styles.reviewTime}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Text
                        key={star}
                        style={{
                          color: star <= item.rating ? '#FFD700' : '#333',
                          fontSize: 14,
                          marginLeft: 1,
                        }}>
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{item.reviewText}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ═══════ FLOATING CONTACT BAR ═══════ */}
      <View style={styles.floatingBar}>
        <TouchableOpacity
          style={styles.contactBtn}
          activeOpacity={0.8}
          onPress={handleOpenChat}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#000" />
          <Text style={styles.contactBtnText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, styles.contactBtnOutline]}
          activeOpacity={0.8}
          onPress={() => handleCall(false)}>
          <Ionicons name="call" size={22} color="#9FED3A" />
          <Text style={[styles.contactBtnText, {color: '#9FED3A'}]}>
            Audio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, styles.contactBtnOutline]}
          activeOpacity={0.8}
          onPress={() => handleCall(true)}>
          <Ionicons name="videocam" size={22} color="#9FED3A" />
          <Text style={[styles.contactBtnText, {color: '#9FED3A'}]}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </WrapperContainer>
  );
};

export default TrainerDetailView;

const styles = StyleSheet.create({
  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  topBarTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Semi_Bold,
  },

  // ── Profile ──
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#fff',
  },
  availBadge: {
    backgroundColor: '#9FED3A',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  availBadgeText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 13,
  },
  trainerName: {
    color: '#fff',
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
    marginTop: 10,
  },
  certText: {
    color: '#ccc',
    fontSize: 14,
  },
  specRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  specText: {
    color: '#ccc',
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
  },
  statLabel: {
    color: '#aaa',
    marginTop: 2,
  },

  // ── Rate Box ──
  rateBox: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 18,
    borderRadius: 16,
    width: responsiveWidth(88),
    backgroundColor: '#0f0f0f',
  },
  rateBoxLabel: {
    color: '#9FED3A',
    fontSize: 14,
  },
  rateBoxValue: {
    color: '#fff',
    fontSize: 20,
    marginTop: 6,
    fontWeight: '600',
  },
  rateBoxUnit: {
    color: '#aaa',
    fontSize: 14,
  },

  // ── Sections ──
  heading: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    fontFamily: FontFamily.Bold,
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1.5),
  },
  whiteText: {
    color: 'white',
    fontSize: responsiveFontSize(1.7),
    fontFamily: FontFamily.Medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(7),
    alignItems: 'center',
  },
  bioContainer: {
    paddingHorizontal: responsiveWidth(7),
    marginTop: responsiveHeight(1),
  },

  // ── Schedule ──
  scheduleChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: responsiveWidth(2),
    marginHorizontal: responsiveWidth(1),
    backgroundColor: '#9FED3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleChipText: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.Semi_Bold,
  },

  // ── Posts ──
  postThumb: {
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postThumbImage: {
    width: responsiveWidth(50),
    height: responsiveHeight(15),
    borderRadius: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Map ──
  mapContainer: {
    height: responsiveHeight(25),
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },

  // ── Reviews ──
  reviewCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewName: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  reviewTime: {
    color: '#888',
    fontSize: responsiveFontSize(1.4),
    marginTop: 2,
  },
  reviewText: {
    color: '#ccc',
    marginTop: 10,
    lineHeight: 20,
    fontSize: responsiveFontSize(1.7),
  },

  // ── Floating Contact Bar ──
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
    paddingTop: responsiveHeight(1.5),
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(159,237,58,0.15)',
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#9FED3A',
    paddingVertical: 14,
    borderRadius: 30,
  },
  contactBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#9FED3A',
  },
  contactBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
    fontFamily: FontFamily.Semi_Bold,
  },
});
