import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
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

const Profile = () => {
  const navigation = useNavigation();

  const trainer_data = useSelector(state => state.Auth.data);

  const [profile, setProfile] = useState(null);

  const safe = v => (v ? v : '-');

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const res = await axiosBaseURL.get(
      `/Common/GetProfile/${trainer_data.token}`,
    );

    console.log('responce in profile:', res.data.data);
    setProfile(res.data.data);
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
          {/* avatar */}
          <Image
            source={
              profile?.profileImage
                ? {uri: profile.profileImage}
                : Images.profile
            }
            style={styles.avatar}
          />

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

        {/* ========= MAP ========= */}
        {coords && (
          <>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapCard}>
              <MapView
                style={{flex: 1}}
                region={{
                  latitude: coords[1],
                  longitude: coords[0],
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: coords[1],
                    longitude: coords[0],
                  }}
                />
              </MapView>
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
});
