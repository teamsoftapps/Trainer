import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {TrainerProfile, UserImages} from '../utils/Dummy';
import {FontFamily, Images} from '../utils/Images';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';

const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    time: '8:00 AM',
    image: Images.trainer2,
    text: 'I hope youre doing great, I came across your profile',
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    time: '10:00 AM',
    image: Images.trainer,
    text: 'I hope youre doing great, I came across your profile',
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    time: '12:00 PM',
    image: Images.trainer3,
    text: 'I hope youre doing great, I came across your profile',
  },
];
const Chats = () => {
  return (
    <WrapperContainer>
      <Header
        text="Chat with Trainer"
        textstyle={{color: 'white', fontFamily: FontFamily.Medium}}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: responsiveWidth(4),
          marginHorizontal: responsiveWidth(8),
          backgroundColor: '#232323',
          paddingHorizontal: responsiveWidth(3),
          borderRadius: 25,
        }}>
        <TouchableOpacity>
          <Image
            source={Images.search}
            style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search for trainer"
          placeholderTextColor={'white'}
          style={{
            fontSize: responsiveScreenFontSize(2),
            width: responsiveWidth(60),
            color: 'white',
          }}
        />
      </View>
      <View>
        <Text
          style={{
            color: 'white',
            paddingLeft: responsiveWidth(8),
            marginVertical: responsiveHeight(3),
            fontSize: responsiveScreenFontSize(2.4),
          }}>
          All Active Trainer
        </Text>
        <FlatList
          style={{paddingLeft: responsiveWidth(4)}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={UserImages}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
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
      <View style={{marginHorizontal: responsiveWidth(8)}}>
        <Text
          style={{
            color: 'white',
            marginVertical: responsiveHeight(3),
            fontSize: responsiveScreenFontSize(2.4),
          }}>
          Chat
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={upcoming}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity activeOpacity={0.6} style={styles.container}>
                <View style={styles.left}>
                  <Image
                    source={item.image}
                    style={{
                      width: responsiveHeight(8),
                      height: responsiveHeight(8),
                    }}
                  />
                  <View style={{flex: 1, gap: responsiveHeight(1)}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.whitetext} numberOfLines={1}>
                        {item.name}
                      </Text>

                      <Text style={styles.greytext} numberOfLines={1}>
                        {item.time}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={styles.timeago}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </WrapperContainer>
  );
};

export default Chats;

const styles = StyleSheet.create({
  imageView: {
    width: responsiveHeight(8.8),
    height: responsiveHeight(8.8),
    borderColor: '#9FED3A',
    borderWidth: responsiveHeight(0.3),
    borderRadius: responsiveHeight(8.8),
    alignItems: 'center',
    justifyContent: 'center',
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
  border: {borderBottomColor: '#B8B8B8', borderBottomWidth: 0.5},
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: responsiveScreenWidth(3),
  },
  left: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    alignItems: 'center',
    flex: 1,
  },
  whitetext: {color: 'white', fontWeight: '500'},
  blacktext: {color: 'black', fontWeight: '500'},
  greytext: {color: '#B8B8B8', fontWeight: '400'},
  right: {justifyContent: 'space-evenly', alignItems: 'flex-end'},
  timeago: {color: '#B8B8B8', fontWeight: '400'},
  curve: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveScreenWidth(1),
    paddingHorizontal: responsiveScreenWidth(5),
  },
});
