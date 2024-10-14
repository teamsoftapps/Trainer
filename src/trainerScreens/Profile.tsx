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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import ImageCropPicker from 'react-native-image-crop-picker';
import axiosBaseURL from '../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';
import EditAddressModal from '../Components/EditAddressModal';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
const uploads = [
  {
    img: require('../assets/Images/trainer4.jpg'),
  },
  {
    img: require('../assets/Images/trainer4.jpg'),
  },
  {
    img: require('../assets/Images/trainer4.jpg'),
  },
];
const Profile = () => {
  //useSelector
  const trainer_data = useSelector(state => state.Auth.data.data);

  //useRef
  const textInputRef = useRef(null);
  //useStates
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [Address, setAddress] = useState('');
  const [AddressModal, setAddressModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isModal, setModal] = useState(false);
  const [Bio, setBio] = useState(trainer_data.Bio);
  const [Hourly, setHourly] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);
  const [Speciality, setSpeciality] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //Functions
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // Formik States
  const [specialityformik, setspecialityformik] = useState(false);
  const [Bioformik, setBioformik] = useState(false);
  const [Hourlyformik, setHourlyformik] = useState(false);
  const [timeformik, settimeformik] = useState(false);

  // Formik Conditions
  // const condition1 = Hourly !== '0' && Hourly !== '';
  // const condition2 = selectedTime.length !== 0;
  // const condition3 = Bio != '';
  // const condition4 = Speciality.length !== 0;

  const navigation = useNavigation();

  //consoles
  console.log('auth data in trainer profile', trainer_data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axiosBaseURL.get(
          `/Common/GetProfile/${trainer_data.token}`
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
          error.response?.data?.message || error.message
        );
      }
    };

    fetchData();
  }, [trainer_data.token]);

  const handleEditPress = () => {
    setIsEditing(true);
    setTimeout(() => {
      textInputRef.current.focus();
    }, 0);
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

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

  const uploadImage = async image => {
    try {
      const formData = new FormData();
      console.log('image received:', image);
      formData.append('file', {
        uri: image.path,
        type: image.mime,
        name: `profileImage-${Date.now()}.jpg`,
      });
      formData.append('email', trainer_data.email);
      console.log('form data:', formData);

      const response = await axiosBaseURL.post('/Common/fileUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUri(response.data.data.url);
      if (response.data.status) {
        showMessage({
          message: 'Update Successful',
          description: 'Your image has been updated!',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Upload Error: ', error);
      showMessage({
        message: 'Upload Failed',
        description: error.message || 'Failed to upload image.',
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
        setModal(false);
      })
      .catch(error => {
        console.error('ImagePicker Error: ', error.message);
      });
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        cropping: true,
      });
      uploadImage(image);
      setModal(false);
    } catch (error) {
      console.error('ImagePicker Error: ', error.message);
    }
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

  const RenderedSelectedTimes = ({item, index}) => {
    const isSelected = selectedIndex === index;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(index);
        }}
        style={[
          styles.MainFlatlist,
          {
            backgroundColor: isSelected ? '#9FED3A' : '#181818',
          },
        ]}>
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
            backgroundColor: isSelected ? '#9FED3A' : '#181818', // Green for selected
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

  // const Function = async () => {
  //   if (condition1 && condition2 && condition3 && condition4) {
  //     setspecialityformik(false);
  //     setBioformik(false);
  //     settimeformik(false);
  //     setHourlyformik(false);
  //     try {
  //       const response = await axiosBaseURL.post('/trainer/update', {
  //         email: trainer_data.email,
  //         Bio: Bio,
  //         Speciality: Speciality,
  //         Hourlyrate: Hourly,
  //         Availiblity: selectedTime,
  //       });
  //       showMessage({
  //         message: 'Updates Succesfully',
  //         description: 'your data has been updated!',
  //         type: 'success',
  //       });
  //       console.log('Upload successful:', response.data);
  //     } catch (error) {
  //       setUploadError('Upload failed.');
  //       console.error('Error uploading file:', error);
  //     } finally {
  //       setUploading(false);
  //     }
  //   } else {
  //     if (!condition4) setspecialityformik(true);
  //     if (!condition3) setBioformik(true);
  //     if (!condition2) settimeformik(true);
  //     if (!condition1) setHourlyformik(true);
  //   }
  // };
  return (
    <WrapperContainer>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginLeft: responsiveWidth(27),
            position: 'relative',
            marginVertical: responsiveHeight(3),
          }}>
          <Image
            src={trainer_data.profileImage}
            style={{
              height: responsiveWidth(25),
              width: responsiveWidth(25),
              borderRadius: responsiveWidth(12.5),
              borderColor: '#9FED3A',
              borderWidth: responsiveWidth(1),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              openModal();
            }}
            style={{
              position: 'absolute',
              top: responsiveHeight(10),
              left: responsiveWidth(18),
              height: responsiveHeight(4),
              width: responsiveWidth(8),
            }}>
            <Image source={Images.edit_icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <Image source={Images.setting} />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModal}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      height: responsiveHeight(0.2),
                      width: responsiveWidth(8),
                      backgroundColor: '#bbbbbb',
                      alignSelf: 'center',
                    }}></View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: responsiveHeight(3),
                    }}>
                    <Image
                      source={Images.current}
                      tintColor={'#bbbbbb'}
                      style={{
                        height: responsiveHeight(3),
                        width: responsiveWidth(4),
                      }}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: responsiveFontSize(1.8),
                        marginLeft: responsiveWidth(5),
                      }}>
                      View Story
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: responsiveHeight(3),
                    }}>
                    <Image
                      source={Images.editImage}
                      tintColor={'#fff'}
                      style={{
                        height: responsiveHeight(3),
                        width: responsiveWidth(5),
                      }}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: responsiveFontSize(1.8),
                        marginLeft: responsiveWidth(5),
                      }}>
                      Change Profile Picture
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: responsiveHeight(3),
                    }}>
                    <Image
                      source={Images.DeleteBin}
                      tintColor={'red'}
                      style={{
                        height: responsiveHeight(2.8),
                        width: responsiveWidth(5),
                      }}
                    />
                    <Text
                      style={{
                        color: 'red',
                        fontSize: responsiveFontSize(1.8),
                        marginLeft: responsiveWidth(5),
                      }}>
                      Remove Current Picture
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              fontWeight: '500',
              textAlign: 'center',
            }}>
            {trainer_data.fullName}
          </Text>
          <Text
            style={{
              color: '#bbbbbb',
              fontSize: responsiveFontSize(1.7),
              textAlign: 'center',
            }}>
            Certified Personel Trainer
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(1.7),
              textAlign: 'center',
              width: responsiveWidth(80),
              alignSelf: 'center',
              marginVertical: responsiveHeight(1),
            }}>
            {trainer_data.Bio}
          </Text>
        </View>

        <View
          style={{
            width: responsiveWidth(80),
            height: responsiveHeight(7),
            borderBottomColor: '#bbbbbb',
            borderBottomWidth: responsiveWidth(0.15),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={Images.Star}
                style={{height: responsiveHeight(2), width: responsiveWidth(5)}}
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: '700',
                  marginHorizontal: responsiveWidth(2),
                }}>
                4.8/5
              </Text>
            </View>
            <Text
              style={{
                color: '#9FED3A',
                fontSize: responsiveFontSize(1.5),
                textAlign: 'center',
              }}>
              120 reviews
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: responsiveFontSize(2.5),
                fontWeight: '700',
                marginHorizontal: responsiveWidth(2),
                textAlign: 'center',
              }}>
              {/* {trainer_data.Followers} */}
              92
            </Text>
            <Text style={{color: '#9FED3A', fontSize: responsiveFontSize(1.5)}}>
              Followers
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: responsiveFontSize(2.5),
                fontWeight: '700',
                marginHorizontal: responsiveWidth(2),
                textAlign: 'center',
              }}>
              28
            </Text>
            <Text
              style={{
                color: '#9FED3A',
                fontSize: responsiveFontSize(1.5),
                textAlign: 'center',
              }}>
              Years old
            </Text>
          </View>
        </View>

        <View
          style={{
            width: responsiveWidth(80),
            alignSelf: 'center',
            marginVertical: responsiveHeight(3),
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              fontWeight: '500',
            }}>
            Uploads
          </Text>
          <FlatList
            style={{marginTop: responsiveHeight(2)}}
            horizontal
            data={uploads}
            renderItem={RenderedUploads}
          />
        </View>

        <View
          style={{
            width: responsiveWidth(80),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: responsiveHeight(3),
            borderBottomColor: '#bbbbbb',
            borderWidth: responsiveWidth(0.2),
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.3),
              fontWeight: '500',
            }}>
            Hourly Rate
          </Text>
          <Text
            style={{
              color: '#bbbbbb',
              fontSize: responsiveFontSize(2),
              fontWeight: '500',
            }}>
            ${Hourly} (1 hr)
          </Text>
        </View>

        <View
          style={{
            width: responsiveWidth(90),
            marginVertical: responsiveHeight(3),
            alignSelf: 'flex-end',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              fontWeight: '500',
            }}>
            Availability
          </Text>

          <FlatList
            ListEmptyComponent={WhenAvalibilitiesEmpth}
            style={{marginTop: responsiveHeight(2)}}
            data={selectedTime}
            renderItem={RenderedSelectedTimes}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
          />
        </View>

        <View
          style={{
            width: responsiveWidth(90),
            marginBottom: responsiveHeight(3),
            alignSelf: 'flex-end',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              fontWeight: '500',
            }}>
            Specialities
          </Text>

          <FlatList
            ListEmptyComponent={WhenSpetialitiesEmpth}
            style={{marginTop: responsiveHeight(2)}}
            data={Speciality}
            renderItem={({item}) => (
              <RenderedSpecialities
                item={item}
                Speciality={selectedSpeciality}
                setSpeciality={setSelectedSpeciality}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            keyExtractor={item => item.key}
          />
        </View>
        <View
          style={{
            width: responsiveWidth(80),
            marginBottom: responsiveHeight(3),
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2.5),
              fontWeight: '500',
            }}>
            Location
          </Text>
          <TouchableOpacity
            onPress={() => {
              setAddressModal(true);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextInput
              onChangeText={text => {
                setAddress(text);
              }}
              value={Address}
              placeholder="Enter your address"
              style={{
                color: '#fff',
                width: responsiveWidth(70),
              }}
              placeholderTextColor={'#fff'}
            />
          </TouchableOpacity>
        </View>
        <EditAddressModal
          token={trainer_data.token}
          Address={Address}
          modalstate={AddressModal}
          onRequestClose={() => setAddressModal(false)}
        />
      </ScrollView>
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: responsiveWidth(1),
  },
  closeButtonText: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.7),
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
