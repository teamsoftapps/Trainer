import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {Image} from 'react-native';
import {Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const stories = [
  {img: Images.st_01},
  {img: Images.st_02},
  {img: Images.st_03},
  {img: Images.st_04},
  {img: Images.st_05},
  {img: Images.st_06},
  {img: Images.st_07},
  {img: Images.st_08},
  {img: Images.st_09},
];

const formats = [
  {
    value: 'Story',
  },
  {
    value: 'Post',
  },
];

const Story = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const GalleryData = ({item}) => {
    return (
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={item.img} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const renderFormats = ({item, index}) => {
    const isSelected = selectedIndex === index;
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
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
  return (
    <WrapperContainer style={{paddingHorizontal: responsiveWidth(10)}}>
      <ScrollView>
        <View style={{zIndex: 1000}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: responsiveHeight(3),
            }}>
            <TouchableOpacity onPress={() => {}}>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <Image source={Images.dropdown} />
          </View>
          <View
            style={[styles.gridContainer, {marginTop: responsiveHeight(2)}]}>
            {stories.map((item, index) => (
              <GalleryData key={index} item={item} />
            ))}
          </View>
          <View style={styles.gridContainer}>
            {stories.map((item, index) => (
              <GalleryData key={index} item={item} />
            ))}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: responsiveWidth(26),
    marginBottom: responsiveHeight(0.5),
  },
  image: {
    width: responsiveWidth(26),
    height: responsiveHeight(20),
    resizeMode: 'cover',
  },
});
