import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';
import {Images} from '../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

const Message = ({route}) => {
  const navigation = useNavigation();
   const {data} = route.params;
  return (
    <WrapperContainer>
      <View style={styles.top}>
        <View style={styles.left_container}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={Images.back}
              tintColor={'white'}
              style={styles.back}
            />
          </TouchableOpacity>
          <Image source={data.image} style={styles.profile_image} />
          <View>
            <Text style={styles.user}>{data.name}</Text>
            <View style={styles.online}>
              <View style={styles.dot}></View>
              <Text style={styles.online_text}>Online</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveWidth(5),
          }}>
          <TouchableOpacity>
            <Image
              source={Images.video_white}
              resizeMode="contain"
              style={{width: responsiveWidth(7), height: responsiveWidth(7)}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={Images.call_white}
              resizeMode="contain"
              style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Message;

const styles = StyleSheet.create({
  user: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '300',
    color: 'white',
  },
  profile_image: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(10),
    objectFit: 'cover',
    marginHorizontal: responsiveWidth(3),
  },
  call: {
    borderRadius: responsiveWidth(4),
    height: responsiveWidth(9),
    width: responsiveWidth(9),
  },
  back: {
    width: responsiveWidth(6),
    height: responsiveHeight(2.8),
    resizeMode: 'contain',
  },
  online: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  online_text: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.5),
  },
  dot: {
    backgroundColor: '#9FED3A',
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(4),
  },
  container: {
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  text: {},
  input_container: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    gap: responsiveWidth(5),
    marginHorizontal: 20,
  },
  inp: {
    flex: 1,
    backgroundColor: 'white',
    height: responsiveWidth(12),
    width: responsiveWidth(70),
    borderRadius: responsiveWidth(3),
  },
  message1: {
    backgroundColor: '#4361EE',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 13,
    width: responsiveWidth(40),
  },
  top: {
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    top: 0,
    left: 0,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    backgroundColor: 'white',
    marginLeft: 'auto',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 13,
    width: responsiveWidth(40),
  },
});
