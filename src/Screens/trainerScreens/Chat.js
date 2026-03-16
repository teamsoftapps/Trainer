import React, {useCallback, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {FlashList} from '@shopify/flash-list';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {FontFamily, Images} from '../../utils/Images';
import {baseUrl} from '../../services/Urls';

const API_BASE = baseUrl;

// ✅ Safe URL join (prevents missing "/" bugs)
const joinUrl = (base, path) => {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
};

const Chats = ({navigation}) => {
  const auth = useSelector(state => state?.Auth?.data);
  const myId = auth?._id;

  // ✅ role can be: "user" or "trainer"
  // (your project uses isType in many places)
  const viewerRole = (auth?.isType || auth?.role || 'trainer').toLowerCase();

  const [allChats, setAllChats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ For USER screen: show trainer
  // ✅ For TRAINER screen: show user
  const getOtherUser = useCallback(
    conv => {
      const part = conv?.participants?.find(p => {
        const pid = p?.userId?._id || p?.userId;
        return String(pid) !== String(myId);
      });
      const u = part?.userId;

      // populated -> object
      if (u && typeof u === 'object') return u;

      // not populated -> null
      return null;
    },
    [myId],
  );

  // ✅ decide which endpoint based on role


  const fetchConversations = useCallback(async () => {
    if (!myId) return;

    try {
      setLoading(true);
      const isTrainer = viewerRole === 'trainer';

      // Endpoint 1: Where I am the "trainer" participant
      const urlTrainer = joinUrl(
        API_BASE,
        `/chat/conversation-list-trainer/${myId}`,
      );
      // Endpoint 2: Where I am the "user" participant (initiated the chat)
      const urlUser = joinUrl(API_BASE, `/chat/conversation-list/${myId}`);

      const [resTrainer, resUser] = await Promise.all([
        axios.get(urlTrainer).catch(() => ({data: {success: false}})),
        isTrainer
          ? axios.get(urlUser).catch(() => ({data: {success: false}}))
          : Promise.resolve({data: {success: false}}),
      ]);

      let combined = [];
      if (resTrainer.data?.success) {
        // I am the trainer in these
        const list = (resTrainer.data.conversations || []).map(c => ({
          ...c,
          myRoleInThisChat: 'trainer',
        }));
        combined = [...list];
      }

      if (resUser.data?.success) {
        // I am the user in these (initiated them or found via broadened query)
        const userConversations = (resUser.data.conversations || []).map(c => ({
          ...c,
          myRoleInThisChat: c.myRoleInThisChat || 'user',
        }));

        userConversations.forEach(conv => {
          if (!combined.some(c => c._id === conv._id)) {
            combined.push(conv);
          }
        });
      }

      // Sort by last message / updatedAt
      combined.sort((a, b) => {
        const dateA = new Date(
          a.lastMessage?.createdAt || a.updatedAt || 0,
        ).getTime();
        const dateB = new Date(
          b.lastMessage?.createdAt || b.updatedAt || 0,
        ).getTime();
        return dateB - dateA;
      });

      setAllChats(combined);
    } catch (err) {
      console.log(
        'Fetch conversations error:',
        err?.response?.data || err?.message,
      );
      setAllChats([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [myId, viewerRole]);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [fetchConversations]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, [fetchConversations]);

  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return allChats;

    return allChats.filter(conv => {
      const other = getOtherUser(conv);
      const name = (other?.fullName || '').toLowerCase();
      return name.includes(q);
    });
  }, [searchText, allChats, getOtherUser]);

  const ListEmpty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.emptyWrap}>
          <ActivityIndicator size="large" color="#9FED3A" />
        </View>
      );
    }
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No Chat found</Text>
      </View>
    );
  }, [loading]);

  const headerTitle =
    viewerRole === 'trainer' ? 'Chat with Users' : 'Chat with Trainers';

  const searchPlaceholder =
    viewerRole === 'trainer' ? 'Search for users' : 'Search for trainers';

  return (
    <WrapperContainer>
      <Header
        text={headerTitle}
        textstyle={{color: 'white', fontFamily: FontFamily.Medium}}
        onPress={() => navigation.goBack()}
        rightView={
          <Image
            source={Images.logo}
            style={{height: responsiveHeight(5), width: responsiveWidth(10)}}
          />
        }
      />

      {/* ✅ Search */}
      <View style={styles.searchBox}>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={Images.search}
            style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
          />
        </TouchableOpacity>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={searchPlaceholder}
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* ✅ Title */}
      <Text style={styles.sectionTitle}>Chats</Text>

      <FlashList
        contentContainerStyle={{paddingHorizontal: responsiveWidth(8)}}
        estimatedItemSize={84}
        data={filteredData}
        extraData={filteredData}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={item => item?._id}
        ListEmptyComponent={ListEmpty}
        renderItem={({item}) => {
          const other = getOtherUser(item);

          const lastMsgText =
            item?.lastMessage?.text ||
            (item?.lastMessage?.mediaUrl ? 'Media' : '') ||
            '';

          const timeText = item?.lastMessage?.createdAt
            ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <TouchableOpacity
              activeOpacity={0.65}
              style={styles.row}
              onPress={() => {
                navigation.navigate('ChatScreen', {
                  conversationId: item?._id || item?.id,
                  otherUser: other,
                  myRole: item?.myRoleInThisChat || viewerRole,
                });
              }}>
              <View style={styles.left}>
                <Image
                  source={{
                    uri: other?.profileImage || 'https://i.pravatar.cc/150',
                  }}
                  style={styles.avatar}
                />

                <View style={{flex: 1}}>
                  <View style={styles.topLine}>
                    <Text style={styles.name} numberOfLines={1}>
                      {other?.fullName ||
                        (viewerRole === 'trainer' ? 'User' : 'Trainer')}
                    </Text>

                    <Text style={styles.time} numberOfLines={1}>
                      {timeText}
                    </Text>
                  </View>

                  <Text style={styles.preview} numberOfLines={1}>
                    {lastMsgText || ' '}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default Chats;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(4),
    marginHorizontal: responsiveWidth(8),
    backgroundColor: '#232323',
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    paddingVertical: responsiveHeight(1.2),
    marginTop: responsiveHeight(1),
  },
  searchInput: {
    fontSize: responsiveScreenFontSize(2),
    flex: 1,
    color: 'white',
    paddingVertical: 0,
  },

  sectionTitle: {
    color: 'white',
    marginVertical: responsiveHeight(2.5),
    fontSize: responsiveScreenFontSize(2.4),
    marginHorizontal: responsiveWidth(8),
    fontFamily: FontFamily.Medium,
  },

  row: {
    paddingVertical: responsiveHeight(1.6),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  left: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: responsiveHeight(7.5),
    height: responsiveHeight(7.5),
    borderRadius: responsiveHeight(7.5) / 2,
    borderWidth: 2,
    borderColor: '#9FED3A',
  },

  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontFamily: FontFamily.Medium,
    fontSize: responsiveScreenFontSize(2.05),
    flex: 1,
    paddingRight: responsiveWidth(3),
  },
  time: {
    color: '#B8B8B8',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveScreenFontSize(1.55),
  },
  preview: {
    marginTop: responsiveHeight(0.6),
    color: '#B8B8B8',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveScreenFontSize(1.7),
  },

  emptyWrap: {
    paddingVertical: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'gray',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveScreenFontSize(2),
  },
});
