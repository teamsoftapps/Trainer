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
import React, {useEffect, useMemo, useState} from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {TrainerProfile, UserImages} from '../../utils/Dummy';
import {FontFamily, Images} from '../../utils/Images';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {useGetChatsQuery} from '../../store/Apis/chat';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainProps} from '../../Navigations/MainStack';
import InstaStory from 'react-native-insta-story';
import useToast from '../../Hooks/Toast';
const StoriesData = [
  {
    user_id: '1',
    storyType: 'image',
    user_image:
      'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
    user_name: 'Alex Morgan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: '2',
    user_image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Jordan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://plus.unsplash.com/premium_photo-1666174933753-36abe3cb834b?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://images.unsplash.com/photo-1724268509269-cd2c9bd9bef3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '3',
    user_image:
      'https://images.unsplash.com/photo-1721332149267-ef9b10eaacd9?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Ruben Neves',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '4',
    user_image:
      'https://images.unsplash.com/photo-1720048171098-dba33b2c4806?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Ryan',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '5',
    user_image:
      'https://images.unsplash.com/photo-1724313802205-6f70304e6c64?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Emily',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: '5',
    user_image:
      'https://images.unsplash.com/photo-1724313802205-6f70304e6c64?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    user_name: 'Emily',
    stories: [
      {
        story_id: '1',
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: '2',
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        // swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

type Props = NativeStackScreenProps<MainProps, 'Chat'>;
const Chats: React.FC<Props> = ({navigation, route}) => {
  const {data, isError, refetch, isLoading} = useGetChatsQuery();
  const [allChats, setallChats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {showToast} = useToast();
  useEffect(() => {
    if (data?.data) {
      setallChats(data?.data);
      console.log('All Chats', data.data);
    }
    if (isError) {
      showToast('Error', isError, 'danger');
    }
  }, [data, isError]);

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'gray'} />
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

  const toLowerCase = searchText.toLowerCase();

  const filteredData = useMemo(() => {
    return allChats.filter((item: any) => {
      return item?.participants[1]?.userId?.fullName
        ?.toLowerCase()
        .includes(toLowerCase);
    });
  }, [searchText, allChats]);
  console.log('Filtered Dataaa', filteredData);
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
          value={searchText}
          onChangeText={setSearchText}
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
        <View>
          <InstaStory
            data={StoriesData}
            duration={10000}
            unPressedBorderColor={'#9FED3A'}
            unPressedAvatarTextColor={'#fff'}
            pressedAvatarTextColor={'#fff'}
            swipeText={' '}
          />
        </View>
      </View>
      {/* <View style={{marginHorizontal: responsiveWidth(8)}}> */}
      <Text
        style={{
          color: 'white',
          marginVertical: responsiveHeight(3),
          fontSize: responsiveScreenFontSize(2.4),
          marginHorizontal: responsiveWidth(8),
        }}>
        Chats
      </Text>

      <FlashList
        contentContainerStyle={{paddingHorizontal: responsiveWidth(8)}}
        ListEmptyComponent={listemptyComp}
        estimatedItemSize={20}
        data={filteredData}
        extraData={filteredData}
        renderItem={({item, index}) => {
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
