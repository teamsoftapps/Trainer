import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';

const Profile = () => {
  return (
    <WrapperContainer>
      <View
        style={{
          marginHorizontal: responsiveWidth(6),
          flexDirection: 'row',
        }}>
        <View style={styles.top}>
          <Image source={Images.trainer3} style={styles.profile_image} />
          <TouchableOpacity style={styles.editImage}>
            <Image
              source={Images.edit}
              tintColor={'black'}
              style={{
                width: responsiveWidth(4),
                height: responsiveHeight(2),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontSize: responsiveFontSize(3),
                fontFamily: FontFamily.Bold,
                color: 'white',
                width: responsiveWidth(45),
              }}>
              Nicole Foster
            </Text>
            <Text
              style={{
                color: '#A7A7A7',
                fontSize: responsiveFontSize(1.5),
                width: responsiveWidth(45),
              }}
              numberOfLines={1}>
              nicolefoster@mail.com
            </Text>
          </View>
          <Image source={Images.setting} />
        </View>
      </View>
      <View style={{marginHorizontal: responsiveWidth(8)}}>
        <Text style={{fontSize: responsiveFontSize(2.5), color: 'white'}}>
          Address
        </Text>
        <Text style={{ color: '#A7A7A7', fontSize: responsiveFontSize(2), marginVertical: responsiveHeight(1) }}>Home</Text>
        <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text style={{ width: responsiveWidth(73), color:"white", fontSize:responsiveFontSize(2.3), fontFamily:FontFamily.Light }} numberOfLines={1}>43 street, 4th ave, Newbridge NSW873 r-12</Text>     
          <Image source={Images.rightarrow}/>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
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
  top: {
    borderRadius: responsiveHeight(15),
    padding: responsiveHeight(1),
    width: responsiveHeight(16),
    height: responsiveHeight(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
