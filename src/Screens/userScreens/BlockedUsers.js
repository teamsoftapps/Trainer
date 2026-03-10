import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect} from '@react-navigation/native';

const BlockedUsers = ({navigation}) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingIds, setUnblockingIds] = useState(new Set());
  const token = useSelector(state => state?.Auth?.data?.token);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosBaseURL.get('/user/blocked', {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (res.data?.status) {
        setBlockedUsers(res.data.data);
      }
    } catch (err) {
      console.log('Error fetching blocked users:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchBlockedUsers();
    }, [fetchBlockedUsers]),
  );

  const handleUnblock = async trainerId => {
    try {
      setUnblockingIds(prev => new Set(prev).add(trainerId));
      const res = await axiosBaseURL.post(
        '/user/unblock',
        {trainerId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (res.data?.status) {
        Alert.alert('Success', 'Trainer unblocked successfully', [
          {text: 'OK', onPress: () => fetchBlockedUsers()},
        ]);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Failed to unblock user',
      );
    } finally {
      setUnblockingIds(prev => {
        const next = new Set(prev);
        next.delete(trainerId);
        return next;
      });
    }
  };

  const renderItem = ({item}) => {
    const isUnblocking = unblockingIds.has(item._id);

    return (
      <View style={styles.card}>
        <Image
          source={{uri: item.profileImage || 'https://via.placeholder.com/150'}}
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.fullName}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.unblockBtn, isUnblocking && styles.unblockBtnDisabled]}
          onPress={() => handleUnblock(item._id)}
          disabled={isUnblocking}>
          {isUnblocking ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.unblockBtnText}>Unblock</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Trainers</Text>
        <View style={{width: 28}} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#B2FF00" />
        </View>
      ) : blockedUsers.length === 0 ? (
        <View style={styles.center}>
          <Icon
            name="person-off-outline"
            size={60}
            color="#666"
            style={{marginBottom: 15}}
          />
          <Text style={styles.emptyText}>No blocked trainers</Text>
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

export default BlockedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: responsiveFontSize(2),
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#B2FF00',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  nameText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  unblockBtn: {
    backgroundColor: '#B2FF00',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  unblockBtnDisabled: {
    opacity: 0.7,
  },
  unblockBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
  },
});
