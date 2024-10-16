import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../../utils/Images';
import {fetchSetupSheetparams, UserImages} from '../../utils/Dummy';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import EditAddressModal from '../../Components/EditAddressModal';
import DeleteCardModal from '../../Components/DeleteCardModal';
import useToast from '../../Hooks/Toast';
import ImageCropPicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
const Profile = () => {
  const {showToast} = useToast();
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const [Address, setAddress] = useState('');
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [AddressModal, setAddressModal] = useState(false);
  const [CardModal, setCardModal] = useState(false);
  const [stripeId, setStripeId] = useState(null);
  const [StripeCardDetails, setStripeCardDetails] = useState([]);
  const [StripeCardData, setStripeCardData] = useState('');
  const authData = useSelector(state => state.Auth.data);
  console.log('auth data in home:', authData);
  const [imageUri, setImageUri] = useState(null);
  const [isModal, setModal] = useState(false);

  useEffect(() => {
    fetchStripeCards();
  }, [stripeId]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const profileResponse = await axiosBaseURL.get(
            `/Common/GetProfile/${authData.token}`
          );
          const userData = profileResponse.data.data;
          setImageUri(userData.profileImage);
          setAddress(userData.Address);
          setname(userData.fullName);
          setemail(userData.email);
          setStripeId(userData.stripeCustomerID);
        } catch (error) {
          console.error(
            'Error fetching data:',
            error.response?.data?.message || error.message
          );
        }
      };

      fetchData();
    }, [authData?.token])
  );

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

  const uploadImage = async image => {
    try {
      const formData = new FormData();
      console.log('image received:', image);
      formData.append('file', {
        uri: image.path,
        type: image.mime,
        name: `profileImage-${Date.now()}.jpg`,
      });
      formData.append('email', authData.email);
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

  const fetchStripeCards = async () => {
    if (!stripeId) return;
    try {
      const response = await axiosBaseURL.post('/Common/GetStripeCards', {
        customerId: stripeId,
      });
      if (response.data) {
        setStripeCardDetails(response.data.data);
        console.log('Data received:', response.data.data);
      } else {
        console.log('No Data Found');
      }
    } catch (error) {
      console.error('Error fetching Stripe cards:', error.message);
    }
  };

  const initializepaymentsheet = async () => {
    if (!stripeId) return;
    try {
      const {ephemeralKey, setupIntents} = await fetchSetupSheetparams(
        stripeId
      );
      const {error} = await initPaymentSheet({
        customerId: stripeId,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntents,
        merchantDisplayName: "Stern's GYM",
        allowsDelayedPaymentMethods: true,
        allowsRemovalOfLastSavedPaymentMethod: true,
      });
      if (error) {
        console.error('Error initializing payment sheet:', error.message);
      } else {
        console.log('Payment sheet initialized successfully');
      }
    } catch (error) {
      console.error(
        'Error during payment sheet initialization:',
        error.message
      );
    }
  };

  const AddCardStripe = async () => {
    await initializepaymentsheet();
    const {error} = await presentPaymentSheet();
    if (error) {
    } else {
      showToast('Added Successfully!', 'Your card has been added', 'success');
      await fetchStripeCards();
    }
  };

  const limitedUserImages = UserImages.slice(0, 3);
  const navigation = useNavigation();
  return (
    <WrapperContainer>
      <ScrollView>
        <View style={styles.top}>
          <View style={styles.topimage}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.profile_image} />
            ) : (
              <Image
                source={require('../../assets/Images/PlaceholderImage.png')}
                style={styles.profile_image}
              />
            )}
            <TouchableOpacity onPress={openModal} style={styles.editImage}>
              <Image
                source={Images.edit}
                tintColor={'black'}
                style={styles.edit}
              />
            </TouchableOpacity>
          </View>
          <Modal
            transparent={true}
            animationType="slide"
            visible={isModal}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                  }}>
                  <Text style={styles.modalText}>Select Option</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleTakePhoto();
                    }}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Open Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleChoosePhoto();
                    }}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Open Gallery</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <Text
                    style={{
                      marginLeft: responsiveWidth(2),
                      fontSize: responsiveFontSize(2),
                      fontWeight: '500',
                      color: 'red',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.right}>
            <View>
              <Text numberOfLines={1} style={styles.name}>
                {name}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Image source={Images.setting} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.address}>
          <View style={styles.addresstext}>
            <Text style={styles.heading}>Favourite</Text>
            <Pressable
              onPress={() => {
                // navigation.navigate(NavigationStrings.FAVOURITES);
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{left: 25}}>
                <FlatList
                  horizontal
                  data={limitedUserImages}
                  renderItem={({item, index}) => {
                    return (
                      <Image
                        source={item.image}
                        style={{
                          width: responsiveWidth(11),
                          height: responsiveWidth(11),
                          borderRadius: 50,
                          right:
                            index === 0
                              ? null
                              : index === 1
                              ? 15
                              : index === 2
                              ? 25
                              : null,
                        }}
                      />
                    );
                  }}
                />
              </View>
              <TouchableOpacity>
                <View style={styles.favIcons}>
                  <Text
                    style={{color: 'black', fontSize: responsiveFontSize(2)}}>
                    +{UserImages.length - 3}
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <TouchableOpacity>
                  <Image source={Images.rightarrow} />
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.address}>
          <Text style={styles.heading}>Address</Text>
          <TouchableOpacity
            onPress={() => {
              setAddressModal(true);
            }}
            style={styles.addresstext}>
            <Text style={styles.text} numberOfLines={1}>
              {Address}
            </Text>
            <Image source={Images.edit} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.address}>
          <Text style={styles.heading}>Payment Cards</Text>
          <View>
            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              data={StripeCardDetails}
              contentContainerStyle={{gap: 10}}
              renderItem={({item, index}) => (
                <View key={item._id} style={styles.container2}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: responsiveWidth(4),
                    }}>
                    <Image
                      source={
                        item.card.brand === 'mastercard'
                          ? Images.mastersilver
                          : item.card.brand === 'visa'
                          ? Images.visasilver
                          : item.card.brand === 'jcb'
                          ? Images.JCBCard
                          : item.card.brand === 'amex'
                          ? Images.AmericanExpressCard
                          : item.card.brand === 'diners'
                          ? Images.DinersClub
                          : item.card.brand === 'UnionPay'
                          ? Images.UnionPay
                          : Images.DicoverCard
                      }
                      resizeMode="contain"
                      style={{
                        width: responsiveWidth(10),
                        height: responsiveWidth(10),
                      }}
                    />
                    <View style={{justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2.3),
                          color: 'white',
                        }}>
                        {'**** **** ****'} {item.card.last4}
                      </Text>
                      <Text
                        style={{
                          color: '#A7A7A7',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {'Expires'} {item.card.exp_month}
                        {'/'}
                        {item.card.exp_year}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setStripeCardData(item.id);
                      console.log('id we send:', StripeCardData);
                      setCardModal(true);
                    }}>
                    <Image
                      source={Images.DeleteBin}
                      style={{
                        width: responsiveWidth(5),
                        height: responsiveWidth(5),
                        tintColor: 'white',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.containers}>
            <Text style={styles.textgreen}>Add new card</Text>
            <TouchableOpacity
              onPress={() => {
                AddCardStripe();
              }}
              style={styles.plus}>
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  color: 'black',
                  fontFamily: FontFamily.Extra_Bold,
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {Address && (
          <EditAddressModal
            token={authData.token}
            Address={Address}
            modalstate={AddressModal}
            onRequestClose={() => setAddressModal(false)}
          />
        )}
        <DeleteCardModal
          modalstate={CardModal}
          paymentId={StripeCardData}
          onRequestClose={() => setCardModal(false)}
        />
      </ScrollView>
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#A7A7A7',
    borderBottomWidth: 0.5,
    paddingVertical: 3,
  },
  plus: {
    backgroundColor: '#9FED3A',
    borderRadius: 50,
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textgreen: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(2.5),
  },
  containers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(1),
  },
  favIcons: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#9FED3A',
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
  },
  image: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    position: 'absolute',
  },
  text: {
    width: responsiveWidth(73),
    color: 'white',
    fontSize: responsiveFontSize(1.7),
    fontFamily: FontFamily.Light,
    marginTop: responsiveWidth(3),
  },
  addresstext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    paddingBottom: 15,
  },
  heading2: {
    color: '#A7A7A7',
    fontSize: responsiveFontSize(2),
    marginVertical: responsiveHeight(1),
  },
  heading: {fontSize: responsiveFontSize(2.5), color: 'white'},
  email: {
    color: '#A7A7A7',
    fontSize: responsiveFontSize(1.5),
    width: responsiveWidth(45),
  },
  address: {
    marginHorizontal: responsiveWidth(8),
    marginVertical: responsiveHeight(1.5),
  },
  name: {
    fontSize: responsiveFontSize(3),
    fontFamily: FontFamily.Bold,
    color: 'white',
    width: responsiveWidth(45),
  },

  right: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  edit: {
    width: responsiveWidth(4),
    height: responsiveHeight(2),
    resizeMode: 'contain',
  },
  top: {
    marginHorizontal: responsiveWidth(6),
    flexDirection: 'row',
  },
  profile_image: {
    width: responsiveHeight(12),
    height: responsiveHeight(12),
    borderRadius: responsiveHeight(15),
  },
  editImage: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#9FED3A',
    borderRadius: responsiveWidth(5),
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  topimage: {
    borderRadius: responsiveHeight(15),
    padding: responsiveHeight(1),
    width: responsiveHeight(16),
    height: responsiveHeight(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: responsiveWidth(80),
    height: responsiveHeight(30),
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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
});
