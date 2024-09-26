import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useGetChatsQuery} from '../store/Apis/chat';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainProps} from '../Navigations/MainStack';

type Props = NativeStackScreenProps<MainProps, 'Chat'>;
const Chats: React.FC<Props> = ({navigation, route}) => {
  const {data} = useGetChatsQuery();
  const [allChats, setallChats] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    try {
      const res = await data;

      console.log('Chats Success', res.data);
      await res?.data.map(item =>
        console.log(
          'CONSSSS',
          item
          // .participants[1].userId.profileImage
        )
      );

      setallChats(res?.data);
    } catch (error) {
      console.log('Chats Error', error);
    }
  };

  return (
    <WrapperContainer>
      <Header
        text="Chat with Trainer"
        textstyle={{color: 'white', fontFamily: FontFamily.Medium}}
        onPress={() => {
          navigation.goBack();
        }}
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
          Chats
        </Text>
        <View style={{height: '100%'}}>
          <FlashList
            estimatedItemSize={20}
            data={allChats}
            extraData={allChats}
            renderItem={({item, index}) => {
              console.log('Data', allChats);
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.container}
                  onPress={() => {
                    navigation.navigate('Messages', {
                      id: item?._id,
                      profile: item?.participants[1]?.userId?.profileImage,
                      name: item?.participants[1]?.userId?.fullName,
                    });
                  }}>
                  <View style={styles.left}>
                    <Image
                      source={{
                        uri: item?.participants[1]?.userId?.profileImage,
                      }}
                      style={{
                        width: responsiveHeight(8),
                        height: responsiveHeight(8),
                        borderRadius: responsiveWidth(20),
                      }}
                    />
                    <View style={{flex: 1, gap: responsiveHeight(1)}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.whitetext} numberOfLines={1}>
                          {item?.participants[1]?.userId?.fullName}
                        </Text>

                        <Text style={styles.greytext} numberOfLines={1}>
                          {item.time}
                        </Text>
                      </View>
                      <View>
                        <Text numberOfLines={1} style={styles.timeago}>
                          {item?.latestmessage}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
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
    // width: '100%',
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
