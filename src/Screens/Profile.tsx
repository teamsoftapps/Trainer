import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../utils/Images';
import { UserImages } from '../utils/Dummy';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useSelector } from 'react-redux';
import axiosBaseURL from '../utils/AxiosBaseURL';
import EditAddressModal from '../Components/EditAddressModal';
import DeleteCardModal from '../Components/DeleteCardModal';

const Profile = () => {
  const [CardDetails, setCardDetails] = useState([])
  const [Address, setAddress] = useState("")
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [AddressModal, setAddressModal] = useState(false)
  const [CardModal, setCardModal] = useState(false)
  const [CardData, SetCardData] = useState("")
  const authData = useSelector(state => state.Auth.data);

  useFocusEffect(
    useCallback(() => {
      axiosBaseURL
        .post('/Common/GetCardDetail', {
          token: authData
        })
        .then(response => {
          setCardDetails(response.data.data)
        })
        .catch(error => {

        });
      axiosBaseURL
        .get(`/common/GetProfile/${authData}`)
        .then(response => {
          console.log('User found', response.data.data);
          setAddress(response.data.data.Address)
          setname(response.data.data.fullName)
          setemail(response.data.data.email)
        })
        .catch(error => {
          console.error('Error fetching data:', error.response.data.message);

        });
    }, [AddressModal, CardModal])
  );



  const limitedUserImages = UserImages.slice(0, 3);
  const navigation = useNavigation();
  return (
    <WrapperContainer>
      <ScrollView>
        <View style={styles.top}>
          <View style={styles.topimage}>
            <Image source={Images.placeholderimage} style={styles.profile_image} />
            <TouchableOpacity style={styles.editImage}>
              <Image
                source={Images.edit}
                tintColor={'black'}
                style={styles.edit}
              />
            </TouchableOpacity>
          </View>
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
                navigation.navigate(NavigationStrings.FAVOURITES);
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ left: 25 }}>
                <FlatList
                  horizontal
                  data={limitedUserImages}
                  renderItem={({ item, index }) => {
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
                  <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>
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
          <TouchableOpacity onPress={() => { setAddressModal(true) }} style={styles.addresstext}>
            <Text style={styles.text} numberOfLines={1}>
              {Address}
            </Text>
            <Image source={Images.edit} resizeMode='contain' />
          </TouchableOpacity>


        </View>
        <View style={styles.address}>
          <Text style={styles.heading}>Payment Cards</Text>
          <View>
            <FlatList scrollEnabled={false} showsVerticalScrollIndicator={false} data={CardDetails} contentContainerStyle={{ gap: 10 }} renderItem={({ item, index }) => (
              <View
                key={item._id}
                style={styles.container2}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: responsiveWidth(4),
                  }}>
                  <Image
                    source={item.CardType === "mastercard" ? Images.mastersilver : item.CardType === "visa" ? Images.visasilver : item.CardType === "jcb" ? Images.JCBCard : Images.AmericanExpressCard}
                    resizeMode="contain"
                    style={{ width: responsiveWidth(10), height: responsiveWidth(10) }}
                  />
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: responsiveFontSize(2.3), color: 'white' }}>
                      {item.CardholderName}
                    </Text>
                    <Text style={{ color: '#A7A7A7', fontSize: responsiveFontSize(2) }}>
                      {item.CardNumber}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => { SetCardData(item._id); setCardModal(true) }}>
                  <Image source={Images.DeleteBin} style={{ width: responsiveWidth(5), height: responsiveWidth(5), tintColor: "white" }} resizeMode='contain' />
                </TouchableOpacity>
              </View>
            )} />
          </View>

          <View style={styles.containers}>
            <Text style={styles.textgreen}>Add new card</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddCard');
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
        {Address && <EditAddressModal token={authData} Address={Address} modalstate={AddressModal} onRequestClose={() => setAddressModal(false)} />}
        <DeleteCardModal modalstate={CardModal} CardData={CardData} onRequestClose={() => setCardModal(false)} />
      </ScrollView>
    </WrapperContainer >
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
    marginTop: responsiveWidth(3)
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
  heading: { fontSize: responsiveFontSize(2.5), color: 'white' },
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
});
