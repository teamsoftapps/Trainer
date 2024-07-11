import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import {UserImages} from '../utils/Dummy';

const Profile = () => {
  const limitedUserImages = UserImages.slice(0, 3);
  return (
    <WrapperContainer>
      <View style={styles.top}>
        <View style={styles.topimage}>
          <Image source={Images.trainer3} style={styles.profile_image} />
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
              Nicole Foster
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              nicolefoster@mail.com
            </Text>
          </View>
          <TouchableOpacity>
            <Image source={Images.setting} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.address}>
        <View style={styles.addresstext}>
          <Text style={styles.heading}>Favourite</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                <Text style={{color: 'black', fontSize: responsiveFontSize(2)}}>
                  +{UserImages.length - 3}
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity>
                <Image source={Images.rightarrow} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.address}>
        <Text style={styles.heading}>Address</Text>
        <Text style={styles.heading2}>Home</Text>
        <View style={styles.addresstext}>
          <Text style={styles.text} numberOfLines={1}>
            43 street, 4th ave, Newbridge NSW873 r-12
          </Text>
          <Image source={Images.rightarrow} />
        </View>

        <View style={styles.containers}>
          <Text style={styles.textgreen}>Add new address</Text>
          <TouchableOpacity style={styles.plus}>
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
      <View style={styles.address}>
        <Text style={styles.heading}>Payment Cards</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#A7A7A7',
            borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              gap: responsiveWidth(4),
            }}>
            <Image
              source={Images.mastersilver}
              resizeMode="contain"
              style={{width: responsiveWidth(10)}}
            />
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: responsiveFontSize(2.3), color: 'white'}}>
                Main Card
              </Text>
              <Text style={{color: '#A7A7A7', fontSize: responsiveFontSize(2)}}>
                9432 **** ****
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image source={Images.rightarrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.containers}>
          <Text style={styles.textgreen}>Add new card</Text>
          <TouchableOpacity style={styles.plus}>
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
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
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
    marginVertical: responsiveHeight(3),
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
    fontSize: responsiveFontSize(2.3),
    fontFamily: FontFamily.Light,
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
});
