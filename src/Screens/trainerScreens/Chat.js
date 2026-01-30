import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {UserImages} from '../../utils/Dummy';
import {FontFamily, Images} from '../../utils/Images';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {useGetChatsQuery} from '../../store/Apis/chat';
import {FlashList} from '@shopify/flash-list';
import useToast from '../../Hooks/Toast';

const Chats = ({navigation}) => {
  const {data, isError, isLoading} = useGetChatsQuery();
  const [allChats, setallChats] = useState([]);
  const {showToast} = useToast();

  useEffect(() => {
    if (data?.data) {
      setallChats(data.data);
    }

    if (isError) {
      showToast('Error', isError, 'danger');
    }
  }, [data, isError]);

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color="gray" />
        ) : (
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: 'gray',
              fontSize: responsiveFontSize(2),
            }}>
            No Chat found
          </Text>
        )}
      </View>
    );
  };

  return (
    <WrapperContainer>
      <Header
        text="Chat with User"
        textstyle={{color: 'white', fontFamily: FontFamily.Medium}}
        onPress={() => navigation.goBack()}
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
          placeholder="Search for User"
          placeholderTextColor="white"
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
          All Active User
        </Text>

        <FlatList
          style={{paddingLeft: responsiveWidth(4)}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={UserImages}
          renderItem={({item}) => (
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
          )}
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
            ListEmptyComponent={listemptyComp}
            estimatedItemSize={20}
            data={allChats}
            extraData={allChats}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.container}
                onPress={() =>
                  navigation.navigate('Message', {
                    id: item?._id,
                    profile: item?.participants[0]?.userId?.profileImage,
                    name: item?.participants[0]?.userId?.fullName,
                  })
                }>
                <View style={styles.left}>
                  <Image
                    source={{
                      uri: item?.participants[0]?.userId?.profileImage,
                    }}
                    style={{
                      width: responsiveHeight(8),
                      height: responsiveHeight(8),
                      borderRadius: responsiveWidth(20),
                    }}
                  />

                  <View style={{flex: 1, gap: responsiveHeight(1)}}>
                    <Text style={styles.whitetext}>
                      {item?.participants[0]?.userId?.fullName}
                    </Text>
                    <Text style={styles.timeago}>{item?.latestmessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
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
  },
  trainername: {
    color: '#fff',
    fontFamily: FontFamily.Regular,
    fontSize: responsiveFontSize(1.7),
  },
  container: {
    flexDirection: 'row',
    paddingVertical: responsiveScreenWidth(3),
  },
  left: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    alignItems: 'center',
    flex: 1,
  },
  whitetext: {color: 'white', fontWeight: '500'},
  timeago: {color: '#B8B8B8', fontWeight: '400'},
});
