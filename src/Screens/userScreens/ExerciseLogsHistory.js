import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

const ExerciseLogsHistory = ({route, navigation}) => {
  const {logs} = route.params || {logs: []};

  const renderItem = ({item}) => {
    const isVideo =
      item.mediaUrl &&
      (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.mov'));

    return (
      <View style={styles.card}>
        <View style={styles.dateRow}>
          <Icon name="calendar-outline" size={20} color="#A3FF12" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {item.mediaUrl ? (
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <Video
                source={{uri: item.mediaUrl}}
                style={styles.media}
                resizeMode="cover"
                controls
              />
            ) : (
              <Image source={{uri: item.mediaUrl}} style={styles.media} />
            )}
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          {item.reps ? (
            <Text style={styles.statText}>Reps: {item.reps}</Text>
          ) : null}
          {item.sets ? (
            <Text style={styles.statText}>Sets: {item.sets}</Text>
          ) : null}
          {item.weight ? (
            <Text style={styles.statText}>Weight: {item.weight}</Text>
          ) : null}
          {item.heightCm ? (
            <Text style={styles.statText}>Height: {item.heightCm} cm</Text>
          ) : null}
          {item.chestIn ? (
            <Text style={styles.statText}>Chest: {item.chestIn} in</Text>
          ) : null}
          {item.waistIn ? (
            <Text style={styles.statText}>Waist: {item.waistIn} in</Text>
          ) : null}
          {item.hipsIn ? (
            <Text style={styles.statText}>Hips: {item.hipsIn} in</Text>
          ) : null}
          {item.thighsIn ? (
            <Text style={styles.statText}>Thighs: {item.thighsIn} in</Text>
          ) : null}
        </View>
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
        <Text style={styles.headerTitle}>History</Text>
        <View style={{width: 28}} />
      </View>

      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-text-outline" size={60} color="#444" />
          <Text style={styles.emptyText}>No exercise logs found.</Text>
        </View>
      ) : (
        <FlatList
          data={[...logs].sort((a, b) => new Date(b.date) - new Date(a.date))}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

export default ExerciseLogsHistory;

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
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: '#A3FF12',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mediaContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#111',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statText: {
    color: '#ccc',
    width: '50%',
    marginBottom: 4,
    fontSize: responsiveFontSize(1.8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    marginTop: 10,
    fontSize: responsiveFontSize(2),
  },
});
