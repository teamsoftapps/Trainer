import {
  FlatList,
  Keyboard,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {Image} from 'react-native';
import {Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
const formats = [
  {
    value: 'Story',
  },
  {
    value: 'Post',
  },
];
const categories = [{value: 'Photos'}, {value: 'Videos'}];

const Story = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  console.log('gggg', selectedIndex);
  const [media, setMedia] = useState([]);
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({value: 'All'});

  const getMedia = (assetType = 'All') => {
    CameraRoll.getPhotos({
      first: 18,
      assetType,
    })
      .then(r => {
        setMedia(r.edges);
      })
      .catch(err => {
        console.log('Error fetching media:', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getMedia();
    }, []),
  );

  const renderFormats = ({item, index}) => {
    const isSelected = selectedIndex === item.value;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(item.value);
        }}
        style={{
          height: responsiveHeight(4),
          width: responsiveWidth(20),
          borderRadius: responsiveWidth(5),
          backgroundColor: isSelected ? '#9FED3A' : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: responsiveWidth(2.5),
        }}>
        <Text
          style={{
            color: isSelected ? '#000' : '#fff',
            fontSize: responsiveFontSize(1.9),
            fontWeight: '500',
          }}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };
  const RenderedMedia = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={{uri: item.node.image.uri}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const handleSelectCategory = category => {
    setSelectedCategory(category);
    setDropdownVisible(false);
    console.log('Selected Category:', category.value);
    getMedia(category.value === 'All' ? 'All' : category.value);
  };

  const handleChoosePhoto = () => {
    if (selectedIndex === null) {
      showMessage({
        message: 'Post or Story',
        description: 'Your image has been updated!',
        type: 'info',
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
      })
        .then(image => {
          navigation.navigate('StoryView', {data: {...image, selectedIndex}});
          console.log('selected Image:', image);
        })
        .catch(error => {});
    }
  };

  const handleChooseVideo = () => {
    if (selectedIndex === null) {
      showMessage({
        message: 'Post or Story',
        description: 'Your image has been updated!',
        type: 'info',
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'video',
      })
        .then(video => {
          navigation.navigate('StoryView', {data: {...video, selectedIndex}});
          console.log('selected Video:', video, selectedIndex);
        })
        .catch(error => {});
    }
  };

  return (
    <WrapperContainer style={{paddingHorizontal: responsiveWidth(5)}}>
      <ScrollView>
        <View style={{zIndex: 1000}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: responsiveHeight(3),
            }}>
            <TouchableOpacity>
              <Image source={Images.Cross} tintColor={'#fff'} />
            </TouchableOpacity>
            <Text style={{color: '#fff', fontSize: responsiveFontSize(2.5)}}>
              Add to Story
            </Text>
            <View></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                handleChoosePhoto();
              }}>
              <View
                style={{
                  backgroundColor: '#333333',
                  height: responsiveHeight(10),
                  width: responsiveWidth(20),
                  borderRadius: responsiveWidth(3),
                  marginRight: responsiveWidth(3),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={Images.imageoutline} />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(1.5),
                    marginTop: responsiveHeight(1),
                  }}>
                  Photos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleChooseVideo();
              }}>
              <View
                style={{
                  backgroundColor: '#333333',
                  height: responsiveHeight(10),
                  width: responsiveWidth(20),
                  borderRadius: responsiveWidth(3),
                  marginRight: responsiveWidth(3),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={Images.videoIcon} />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(1.5),
                    marginTop: responsiveHeight(1),
                  }}>
                  Videos
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: responsiveHeight(4),
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: responsiveFontSize(2.4),
                  marginRight: responsiveWidth(2),
                }}>
                Photos
              </Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Image source={Images.dropdown} />
              </TouchableOpacity>
            </View>
            {dropdownVisible && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={[{value: 'All'}, ...categories]}
                  keyExtractor={item => item.value}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.categoryItem}
                      onPress={() => handleSelectCategory(item)}>
                      <Text style={styles.categoryText}>{item.value}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <View style={{marginTop: responsiveHeight(2)}}>
            <FlatList numColumns={3} data={media} renderItem={RenderedMedia} />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: responsiveHeight(2),
          left: responsiveWidth(40),
          transform: [{translateX: -responsiveWidth(25)}],
          height: responsiveWidth(13),
          width: responsiveWidth(50),
          borderRadius: responsiveWidth(10),
          backgroundColor: '#333333',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1001,
        }}>
        <FlatList horizontal data={formats} renderItem={renderFormats} />
      </View>
    </WrapperContainer>
  );
};

export default Story;

const styles = StyleSheet.create({
  imageContainer: {
    width: responsiveWidth(30),
    marginBottom: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(0.5),
  },
  image: {
    height: responsiveHeight(15),
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: responsiveWidth(100),
    height: responsiveHeight(25),
    padding: responsiveWidth(3),
    backgroundColor: '#333333',
    borderRadius: responsiveWidth(3),
  },
  dropdownContainer: {
    position: 'absolute',
    top: responsiveHeight(7),
    left: responsiveWidth(0),
    width: responsiveWidth(30),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2),
    shadowOpacity: 0.25,
    zIndex: 1000,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: responsiveWidth(0.2),
    borderBottomColor: '#bbbbbb',
  },
  categoryText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
});
