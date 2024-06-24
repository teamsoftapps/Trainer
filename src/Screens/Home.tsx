import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';

import {
  responsiveScreenHeight,
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import WrapperContainer from '../Components/Wrapper';
import {FontFamily, Images} from '../utils/Images';
import {TrainerProfile, UserImages} from '../utils/Dummy';

const Home = () => {
  const [modal, setmodal] = useState(false);
  return (
    <WrapperContainer>
      <View
        style={{
          height: responsiveHeight(8),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: responsiveWidth(5),
          paddingRight: responsiveWidth(7),
        }}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={Images.notification} style={styles.notifiaction} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={Images.messages} style={styles.notifiaction} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: responsiveHeight(23),
          borderBottomWidth: responsiveHeight(0.03),
          borderTopWidth: responsiveHeight(0.05),
          borderColor: '#fff',
          gap: responsiveHeight(2.5),
          justifyContent: 'center',
        }}>
        <Text style={styles.trainer}>Stories from trainers</Text>

        <View>
          <FlatList
            style={{paddingLeft: responsiveWidth(4)}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={UserImages}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    marginHorizontal: responsiveWidth(4),
                    width: responsiveWidth(14),
                    gap: responsiveHeight(0.5),
                  }}>
                  <View style={styles.imageView}>
                    <Image source={item.image} style={styles.storyImage} />
                  </View>
                  <Text style={styles.trainername} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <View>
        <Text style={styles.popular}>Popular Personal Trainers</Text>

        <View>
          <FlatList
            // scrollEnabled={false}
            data={TrainerProfile}
            renderItem={({item, index}) => {
              return (
                <ImageBackground
                  imageStyle={{borderRadius: responsiveWidth(1.5)}}
                  source={item.ProfileImage}
                  style={styles.Trainer}></ImageBackground>
              );
            }}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  notifiaction: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    resizeMode: 'contain',
  },
  trainer: {
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(2),
    marginHorizontal: responsiveWidth(6),
  },
  storyImage: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(8),
    borderColor: '#000',
    borderWidth: responsiveHeight(0.3),
  },
  trainername: {
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(1.7),
  },
  imageView: {
    width: responsiveHeight(8.8),
    height: responsiveHeight(8.8),
    borderColor: '#9FED3A',
    borderWidth: responsiveHeight(0.3),
    borderRadius: responsiveHeight(8.8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  popular: {
    color: '#fff',
    fontFamily: FontFamily.Medium,
    fontSize: responsiveFontSize(2.5),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3),
  },
  Trainer: {
    height: responsiveHeight(50),
    marginHorizontal: responsiveWidth(2),
    overflow: 'hidden',
    marginTop: responsiveHeight(2),
  },
});
