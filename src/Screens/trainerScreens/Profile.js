import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../../utils/Images';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import StoryModal from '../../Components/StoryModal';
const Profile = () => {
  const navigation = useNavigation();

  const trainer_data = useSelector(state => state.Auth.data);

  console.log('trainer data in profile:', trainer_data);

  const [profile, setProfile] = useState(null);
  const [uploads, setUploads] = useState([]);

  const [stories, setStories] = useState([]);
  const [storyVisible, setStoryVisible] = useState(false);

  const safe = v => (v ? v : '-');

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const res = await axiosBaseURL.get(
      `/Common/GetProfile/${trainer_data.token}`,
    );
    const uploadsRes = await axiosBaseURL.get('/trainer/getUploads');
    const storyRes = await axiosBaseURL.get(
      `/trainer/stories/${trainer_data._id}`,
    );

    const formattedStories = (storyRes.data.data || []).map(s => ({
      id: s._id,
      url: s.type === 'video' ? s.thumbnail || s.mediaUrl : s.mediaUrl,
      videoUrl: s.type === 'video' ? s.mediaUrl : null,
      type: s.type,
    }));
    setProfile(res.data?.data);
    setUploads(uploadsRes?.data?.data);
    setStories(formattedStories);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (!profile) return null;
  const calculateAge = dob => {
    console.log('age for calculation:', dob);

    if (!dob) return '-';

    const [day, month, year] = dob.split('/').map(Number);

    const birth = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(profile?.Dob);

  const rating = profile?.rating || 0;
  const reviews = profile?.reviews || 0;
  const followers = profile?.followers || 0;

  const RowItem = ({title, value}) => (
    <View style={styles.rowItem}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowValue}>{safe(value)}</Text>
    </View>
  );

  const uniqueTimes = [...new Set(profile?.Availiblity || [])];
  const uniqueSpecialities = [
    ...new Map((profile?.Speciality || []).map(i => [i.value, i])).values(),
  ];

  const coords = profile?.location?.coordinates;

  /* ================= UI ================= */
  return (
    <WrapperContainer>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: responsiveWidth(6),
          paddingBottom: responsiveHeight(4),
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={() => {
              if (stories.length > 0) setStoryVisible(true);
            }}>
            <Image
              source={
                profile?.profileImage
                  ? {uri: profile.profileImage}
                  : Images.profile
              }
              style={[
                styles.avatar,
                stories.length > 0 && {
                  borderColor: '#9FED3A',
                  borderWidth: 4,
                },
              ]}
            />
          </TouchableOpacity>

          {/* settings button */}
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}>
            <Image
              source={Images.setting}
              style={{width: 22, height: 22, tintColor: '#000'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{safe(profile?.fullName)}</Text>
        <Text style={styles.role}>{safe(profile?.fitnessPreference)}</Text>
        <Text style={styles.bio}>{safe(profile?.Bio)}</Text>

        {/* ===== STATS ROW ===== */}
        <View style={styles.statsRow}>
          {/* Rating */}
          <View style={styles.statItem}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.statValue}>{rating}/5</Text>
            </View>
            <Text style={styles.statLabel}>({reviews} reviews)</Text>
          </View>

          {/* Followers */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followers?.length || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          {/* Age */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{age}</Text>
            <Text style={styles.statLabel}>Years old</Text>
          </View>
        </View>

        {/* ========= PERSONAL INFO ========= */}
        <Text style={styles.sectionTitle}>Personal Info</Text>

        <RowItem title="Age" value={calculateAge(profile?.Dob) + ` Year's`} />
        <RowItem
          title="Weight"
          value={profile?.weight && `${profile.weight} lbs`}
        />
        <RowItem
          title="Height"
          value={profile?.height && `${profile.height} ft`}
        />
        <RowItem
          title="Fitness Preference"
          value={profile?.fitnessPreference}
        />
        <RowItem title="Goal" value={profile?.goal} />

        {/* ========= UPLOADS ========= */}
        <Text style={styles.sectionTitle}>Uploads</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uploads.length === 0 ? (
            <Text style={styles.emptyText}>No uploads yet</Text>
          ) : (
            <FlatList
              // horizontal
              data={uploads}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              renderItem={({item}) => {
                const isVideo = item.type === 'video';

                return (
                  <TouchableOpacity style={styles.uploadCard}>
                    <Image
                      source={{
                        uri: isVideo ? item.thumbnail || item.url : item.url,
                      }}
                      style={styles.uploadImg}
                    />

                    {isVideo && (
                      <View style={styles.playOverlay}>
                        <Text style={styles.playIcon}>▶</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </ScrollView>

        {/* ========= MAP ========= */}
        {coords && (
          <>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapCard}>
              {coords && coords[0] !== 0 && coords[1] !== 0 && (
                <>
                  <Text style={styles.sectionTitle}>Location</Text>

                  <View style={styles.mapCard}>
                    <MapView
                      style={{flex: 1}}
                      showsUserLocation
                      showsMyLocationButton
                      initialRegion={{
                        latitude: Number(coords[1]),
                        longitude: Number(coords[0]),
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}>
                      <Marker
                        coordinate={{
                          latitude: Number(coords[1]),
                          longitude: Number(coords[0]),
                        }}
                      />
                    </MapView>
                  </View>
                </>
              )}
            </View>
          </>
        )}

        {/* ========= HOURLY ========= */}
        <RowItem
          title="Hourly Rate"
          value={`$${safe(profile?.Hourlyrate)}/hour`}
        />

        {/* ========= AVAILABILITY ========= */}
        <Text style={styles.sectionTitle}>Availability</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={uniqueTimes}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          )}
        />

        {/* ========= SPECIALITIES ========= */}
        <Text style={styles.sectionTitle}>Specialities</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={uniqueSpecialities}
          keyExtractor={item => item.key.toString()}
          renderItem={({item}) => (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.value}</Text>
            </View>
          )}
        />
      </ScrollView>
      <StoryModal
        visible={storyVisible}
        onClose={() => setStoryVisible(false)}
        stories={stories.map(s => ({
          type: s.type,
          url: s.type === 'video' ? s.videoUrl : s.url,
        }))}
      />
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },

  settingsBtn: {
    position: 'absolute',
    right: responsiveWidth(5),
    top: responsiveHeight(1),

    backgroundColor: '#9FED3A',
    height: 36,
    width: 36,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5, // Android shadow
  },

  avatar: {
    height: responsiveWidth(28),
    width: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    borderWidth: 3,
    borderColor: '#9FED3A',
  },

  name: {
    textAlign: 'center',
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: '600',
    marginTop: 10,
  },

  role: {
    textAlign: 'center',
    color: '#9FED3A',
  },

  bio: {
    textAlign: 'center',
    color: '#bbbbbb',
    marginVertical: 8,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    fontWeight: '600',
    marginVertical: 14,
  },

  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.3,
    borderBottomColor: '#444',
  },

  rowTitle: {
    color: '#fff',
  },

  rowValue: {
    color: '#9FED3A',
    width: responsiveWidth(50),
    textAlign: 'right',
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#9FED3A',
    borderRadius: 20,
    marginRight: 8,
  },

  chipText: {
    color: '#000',
    fontWeight: '600',
  },

  mapCard: {
    height: responsiveHeight(20),
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  /* ===== STATS ===== */

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
  },

  statLabel: {
    color: '#bbb',
    fontSize: responsiveFontSize(1.6),
    marginTop: 2,
  },

  star: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2.7),
    marginRight: 4,
  },

  emptyText: {
    color: '#777',
    marginBottom: 10,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  playIcon: {
    fontSize: 26,
    color: '#fff',
  },
  uploadCard: {
    width: responsiveWidth(50),
    height: responsiveWidth(30),
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#222',
    marginRight: responsiveWidth(2),
  },

  uploadImg: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  playIcon: {
    color: '#fff',
    fontSize: 24,
  },

  emptyText: {
    color: '#777',
    marginBottom: 10,
  },
  storyContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  closeStory: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
});
