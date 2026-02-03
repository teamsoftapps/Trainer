import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import ImageCropPicker from 'react-native-image-crop-picker';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';
import EditAddressModal from '../../Components/EditAddressModal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {updateLogin} from '../../store/Slices/AuthSlice';
import ProfileImageModal from '../../Components/ProfileImageModal';
import ImageSourceModal from '../../Components/ImageSourceModal';
const uploads = [
  {
    img: require('../../assets/Images/trainer4.jpg'),
  },
  {
    img: require('../../assets/Images/trainer4.jpg'),
  },
  {
    img: require('../../assets/Images/trainer4.jpg'),
  },
];
const Profile = () => {
  //useSelector
  const trainer_data = useSelector(state => state.Auth.data);

  console.log('trainer_data', trainer_data.email);
  const dispatch = useDispatch();

  //useStates
  const [isEditing, setIsEditing] = useState(false);
  const [Address, setAddress] = useState('');
  const [AddressModal, setAddressModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [Hourly, setHourly] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [Speciality, setSpeciality] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isImageUploading, setImageUploading] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [sourceModal, setSourceModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const navigation = useNavigation();
  const safe = v => (v === null || v === undefined || v === '' ? '-' : v);
  safe(trainer_data?.Bio);
  safe(trainer_data?.Address);
  safe(trainer_data?.Hourlyrate);
  //consoles
  console.log('auth data in trainer profile', trainer_data.token);

  const fetchData = async () => {
    try {
      const profileResponse = await axiosBaseURL.get(
        `/Common/GetProfile/${trainer_data.token}`,
      );
      const userData = profileResponse.data.data;
      console.log('profileResponce', userData);
      await setSelectedTime(userData.Availiblity);
      await setSpeciality(userData.Speciality);
      await setHourly(userData.Hourlyrate);
      setLoading(false);
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response?.data?.message || error.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      console.log('fetch called');
    }, [trainer_data.token]),
  );

  const RenderedUploads = ({item, index}) => {
    return (
      <View>
        <Image
          source={item.img}
          style={{
            height: responsiveHeight(15),
            width: responsiveWidth(60),
            marginRight: responsiveWidth(5),
            borderRadius: responsiveWidth(3),
          }}
        />
      </View>
    );
  };

  // const uploadImage = async image => {
  //   try {
  //     const formData = new FormData();

  //     formData.append('file', {
  //       uri: image.path,
  //       type: image.mime,
  //       name: `profileImage-${Date.now()}.jpg`,
  //     });
  //     formData.append('email', trainer_data.email);

  //     setImageUploading(true);

  //     const response = await axiosBaseURL.post('/Common/fileUpload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log('image url:', response.data.data.url);
  //     dispatch(updateLogin({profileImage: response.data.data.url}));
  //     closeSubModal();

  //     if (response.data.status) {
  //       showMessage({
  //         message: 'Update Successful',
  //         description: 'Your image has been updated!',
  //         type: 'success',
  //       });
  //     }
  //   } catch (error) {
  //     showMessage({
  //       message: 'Upload Failed',
  //       description: error.message || 'Failed to upload image.',
  //       type: 'danger',
  //     });
  //   } finally {
  //     setImageUploading(false);
  //   }
  // };

  const uploadImage = async image => {
    try {
      const formData = new FormData();

      formData.append('profileImage', {
        uri: image.path,
        type: image.mime,
        name: 'profile.jpg',
      });

      formData.append('email', trainer_data.email);

      setImageUploading(true);

      const res = await axiosBaseURL.post(
        '/trainer/uploadProfileImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const url = res.data.url;

      // ✅ instantly update redux
      dispatch(updateLogin({profileImage: url}));

      showMessage({
        message: 'Profile updated',
        type: 'success',
      });
    } catch (err) {
      showMessage({
        message: 'Upload failed',
        type: 'danger',
      });
    } finally {
      setImageUploading(false);
    }
  };

  const deleteProfileImage = async () => {
    try {
      await axiosBaseURL.delete('/trainer/deleteProfileImage', {
        headers: {
          Authorization: `Bearer ${trainer_data.token}`,
        },
        data: {
          email: trainer_data.email,
        },
      });

      // clear instantly
      dispatch(updateLogin({profileImage: null}));

      showMessage({
        message: 'Profile image removed',
        type: 'success',
      });
    } catch (err) {
      showMessage({
        message: 'Delete failed',
        type: 'danger',
      });
    }
  };

  const handleChoosePhoto = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        uploadImage(image);
        console.log(':jjjjjjjjjjjjj', image);
        setModal(false);
      })
      .catch(error => {});
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        cropping: true,
      });
      uploadImage(image);
      setModal(false);
    } catch (error) {}
  };

  const WhenSpetialitiesEmpth = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            Checking.....
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No Spetialities
          </Text>
        )}
      </View>
    );
  };
  const WhenAvalibilitiesEmpth = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            Checking.....
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No Availibilities
          </Text>
        )}
      </View>
    );
  };

  const toggleItem = item => {
    setAvailability(prevSelected => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter(i => i !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const RenderedSelectedTimes = ({item}) => {
    const isSelected = availability.includes(item);
    return (
      <TouchableOpacity
        style={[
          styles.MainFlatlist,
          {
            backgroundColor: isSelected ? '#9FED3A' : '#181818',
          },
        ]}
        onPress={() => toggleItem(item)}>
        <Text
          style={{
            color: isSelected ? 'black' : '#9FED3A',
            fontSize: responsiveFontSize(2),
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const RenderedSpecialities = ({item, Speciality, setSpeciality}) => {
    const handlePress = () => {
      if (Speciality.includes(item.value)) {
        setSpeciality(Speciality.filter(s => s !== item.value));
      } else {
        setSpeciality([...Speciality, item.value]);
      }
    };

    const isSelected = Speciality.includes(item.value);

    return (
      <TouchableOpacity
        style={[
          styles.MainFlatlist,
          {
            backgroundColor: isSelected ? '#9FED3A' : '#181818',
          },
        ]}
        onPress={handlePress}>
        <Text
          style={{
            color: isSelected ? 'black' : '#9FED3A',
            fontSize: responsiveFontSize(2),
          }}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  // const calculateAge = birthdateString => {
  //   const [month, day, year] = birthdateString.split('/');
  //   const formattedDate = `${year}-${month}-${day}`;
  //   const birthDate = new Date(formattedDate);

  //   const today = new Date();

  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = today.getMonth() - birthDate.getMonth();

  //   if (
  //     monthDifference < 0 ||
  //     (monthDifference === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     age--;
  //   }

  //   return age;
  // };
  // const age = calculateAge(trainer_data.Dob);

  const SectionTitle = ({title}) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const RowItem = ({title, value}) => (
    <View style={styles.rowItem}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  const StatItem = ({label, value}) => (
    <View style={{alignItems: 'center'}}>
      <Text style={styles.statValue}>{safe(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const uniqueArray = arr => [...new Set(arr || [])];

  const uniqueSpecialities = arr => [
    ...new Map((arr || []).map(i => [i.value, i])).values(),
  ];

  return (
    <WrapperContainer>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: responsiveWidth(6)}}
        showsVerticalScrollIndicator={false}>
        {/* ================= HEADER + PROFILE IMAGE ================= */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                trainer_data?.profileImage
                  ? {uri: trainer_data.profileImage}
                  : Images.profile // default placeholder
              }
              style={styles.avatar}
            />

            <TouchableOpacity
              onPress={() => setImageModal(true)}
              style={styles.editBtn}>
              <Image source={Images.edit_icon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}>
            <Image source={Images.setting} />
          </TouchableOpacity>
        </View>

        {/* ================= NAME + ROLE ================= */}
        <Text style={styles.name}>{safe(trainer_data?.fullName)}</Text>

        <Text style={styles.role}>Personal Trainer</Text>

        <Text style={styles.bio}>{safe(trainer_data?.Bio)}</Text>

        {/* ================= STATS ROW ================= */}
        <View style={styles.statsRow}>
          <StatItem label="Rating" value="0.0/5" />
          <StatItem
            label="Followers"
            value={safe(trainer_data?.followers?.length)}
          />
          <StatItem label="Years old" value="-" />
        </View>

        {/* ================= UPLOADS ================= */}
        <SectionTitle title="Uploads" />

        <FlatList
          horizontal
          data={uploads}
          renderItem={RenderedUploads}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginTop: 10}}
        />

        {/* ================= HOURLY RATE ================= */}
        <RowItem title="Hourly Rate" value={`$${safe(Hourly)}/hour`} />

        {/* ================= AVAILABILITY ================= */}
        <SectionTitle title="Availability" />

        <FlatList
          horizontal
          data={uniqueArray(selectedTime)}
          renderItem={RenderedSelectedTimes}
          ListEmptyComponent={<Text style={styles.empty}>-</Text>}
        />

        {/* ================= SPECIALITIES ================= */}
        <SectionTitle title="Specialities" />

        <FlatList
          horizontal
          data={uniqueSpecialities(Speciality)}
          keyExtractor={item => item.key.toString()}
          renderItem={({item}) => (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{safe(item?.value)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>-</Text>}
        />

        {/* ================= LOCATION ================= */}
        <SectionTitle title="Location" />
        <RowItem
          title="Location"
          value={safe(trainer_data?.Address) || 'Not added yet'}
        />
      </ScrollView>
      <ProfileImageModal
        visible={imageModal}
        onClose={() => setImageModal(false)}
        onChange={() => {
          setImageModal(false);
          setTimeout(() => setSourceModal(true), 300);
        }}
        onRemove={() => {
          setImageModal(false);
          deleteProfileImage(); // ⭐ API called here
        }}
      />
      <ImageSourceModal
        visible={sourceModal}
        onClose={() => setSourceModal(false)}
        onCamera={() => {
          setSourceModal(false);
          handleTakePhoto(); // your existing camera fn
        }}
        onGallery={() => {
          setSourceModal(false);
          handleChoosePhoto(); // your existing picker fn
        }}
      />
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(3),
  },

  settingsBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },

  avatarWrapper: {
    alignItems: 'center',
  },
  avatar: {
    height: responsiveWidth(28),
    width: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    borderWidth: 3,
    borderColor: '#9FED3A',
  },

  editBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
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
    marginTop: 4,
  },

  bio: {
    textAlign: 'center',
    color: '#bbbbbb',
    marginHorizontal: responsiveWidth(10),
    marginTop: 8,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: responsiveHeight(3),
  },

  statValue: {
    color: '#fff',
    fontSize: responsiveFontSize(2.6),
    fontWeight: '700',
  },

  statLabel: {
    color: '#9FED3A',
    marginTop: 2,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
    marginVertical: responsiveHeight(2),
  },

  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 0.3,
    borderBottomColor: '#444',
  },

  rowTitle: {
    color: '#fff',
  },

  rowValue: {
    color: '#9FED3A',
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#9FED3A',
    borderRadius: 20,
    marginHorizontal: 6,
  },

  chipText: {
    color: '#000',
    fontWeight: '600',
  },

  empty: {
    color: '#888',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subModalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(25),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },

  subModalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(16),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },
  modalText: {
    fontSize: responsiveFontSize(2.2),
    marginBottom: responsiveHeight(3),
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: '#000',
    borderRadius: responsiveWidth(6),
    marginHorizontal: responsiveWidth(1),
  },
  closeButtonText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  MainFlatlist: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginRight: responsiveWidth(1),
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
  MainFlatlist2: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginRight: responsiveWidth(1),
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
});
